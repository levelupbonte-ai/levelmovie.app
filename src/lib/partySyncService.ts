// =========================================================================
// REAL-TIME WATCH PARTY SYNCHRONIZATION SERVICE
// Multi-user room sharing, live message synchronization, video player sync
// =========================================================================

export interface PartyMember {
  uid: string;
  name: string;
  photo?: string;
  joinedAt?: number;
  lastSeen?: number;
}

export interface PartyMessage {
  id?: string;
  uid: string;
  name: string;
  photo?: string;
  text?: string;
  time: number;
  isSystem?: boolean;
  action?: string;
  targetName?: string;
  season?: number;
  episode?: number;
  replyTo?: any;
}

export interface PartyData {
  id: string;
  hostUid: string;
  mods: string[];
  modInvites: string[];
  banned: string[];
  muted: Array<{ uid: string; by: string }>;
  movieId: number | string;
  mediaType: 'movie' | 'tv';
  season?: number | null;
  episode?: number | null;
  title: string;
  roomName: string;
  status: string; // 'idle' | 'play_countdown' | 'pause' | 'ended'
  syncTime: number;
  currentOffset: number;
  members: PartyMember[];
  messages: PartyMessage[];
  createdAt?: number;
  updatedAt?: number;
}

type PartyListener = (partyData: PartyData) => void;

class PartySyncService {
  private socket: WebSocket | null = null;
  private activePartyId: string | null = null;
  private currentMember: PartyMember | null = null;
  private listeners: Set<PartyListener> = new Set();
  private reconnectTimeout: any = null;
  private heartbeatInterval: any = null;
  private pollInterval: any = null;
  private isConnecting = false;
  private cachedParty: PartyData | null = null;

  constructor() {
    // Visibility change handler to instantly catch up when returning to tab
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.activePartyId) {
          this.refreshPartyFromHttp(this.activePartyId);
          this.ensureWebSocket();
        }
      });
    }
  }

  public getCachedParty(): PartyData | null {
    return this.cachedParty;
  }

  public setMember(member: PartyMember) {
    this.currentMember = member;
    if (this.socket && this.socket.readyState === WebSocket.OPEN && this.activePartyId) {
      this.socket.send(JSON.stringify({
        type: 'join',
        partyId: this.activePartyId,
        member: this.currentMember
      }));
    }
  }

  // Subscribe to real-time party updates
  public subscribeParty(partyId: string, listener: PartyListener): () => void {
    const cleanId = partyId.trim().toUpperCase();
    this.listeners.add(listener);

    // If changing party, reset socket room
    if (this.activePartyId !== cleanId) {
      this.activePartyId = cleanId;
      this.cachedParty = null;
      this.ensureWebSocket();
      this.startPolling(cleanId);
    }

    // Immediately fetch from HTTP
    this.refreshPartyFromHttp(cleanId);

    // If we have cached party, notify immediately
    if (this.cachedParty && this.cachedParty.id === cleanId) {
      listener(this.cachedParty);
    }

    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.stopPolling();
      }
    };
  }

  private notifyListeners(data: PartyData) {
    this.cachedParty = data;
    this.listeners.forEach((fn) => {
      try {
        fn(data);
      } catch (e) {
        console.warn('[PartySyncService] Listener error:', e);
      }
    });
  }

  // Establish or maintain WebSocket connection
  private ensureWebSocket() {
    if (typeof window === 'undefined') return;
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      if (this.socket.readyState === WebSocket.OPEN && this.activePartyId) {
        this.socket.send(JSON.stringify({
          type: 'join',
          partyId: this.activePartyId,
          member: this.currentMember
        }));
      }
      return;
    }

    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/party`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        this.isConnecting = false;
        this.socket = ws;
        console.log('[PartySyncService] Connected to real-time Watch Party WebSocket');

        // Join active party room
        if (this.activePartyId) {
          ws.send(JSON.stringify({
            type: 'join',
            partyId: this.activePartyId,
            member: this.currentMember
          }));
        }

        // Heartbeat ping every 25s
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 25000);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'init' || payload.type === 'party_update') {
            if (payload.partyData) {
              this.notifyListeners(payload.partyData);
            }
          } else if (payload.type === 'new_message') {
            if (payload.partyData) {
              this.notifyListeners(payload.partyData);
            } else if (payload.message && this.cachedParty) {
              const updated = {
                ...this.cachedParty,
                messages: [...(this.cachedParty.messages || []), payload.message]
              };
              this.notifyListeners(updated);
            }
          }
        } catch (e) {
          console.warn('[PartySyncService] WS message parse error:', e);
        }
      };

      ws.onclose = () => {
        this.isConnecting = false;
        this.socket = null;
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

        // Auto reconnect if we have an active party
        if (this.activePartyId && this.listeners.size > 0) {
          if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = setTimeout(() => {
            this.ensureWebSocket();
          }, 2000);
        }
      };

      ws.onerror = (err) => {
        this.isConnecting = false;
        console.warn('[PartySyncService] WS error, fallback to HTTP active:', err);
      };
    } catch (e) {
      this.isConnecting = false;
      console.warn('[PartySyncService] WS connection failed to initialize:', e);
    }
  }

  // Backup HTTP Polling (runs every 2 seconds to guarantee zero desync)
  private startPolling(partyId: string) {
    this.stopPolling();
    this.pollInterval = setInterval(() => {
      if (this.activePartyId === partyId && this.listeners.size > 0) {
        this.refreshPartyFromHttp(partyId);
      }
    }, 2000);
  }

  private stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  // Refresh party from REST API
  public async refreshPartyFromHttp(partyId: string): Promise<PartyData | null> {
    try {
      const res = await fetch(`/api/parties/${encodeURIComponent(partyId)}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && data.party) {
        this.notifyListeners(data.party);
        return data.party;
      }
    } catch (e) {
      // Network warning
    }
    return null;
  }

  // Fetch party by ID (e.g. for joining via code or shared link)
  public async getParty(partyId: string): Promise<PartyData | null> {
    try {
      const cleanId = partyId.trim().toUpperCase();
      const res = await fetch(`/api/parties/${encodeURIComponent(cleanId)}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && data.party) {
        return data.party;
      }
    } catch (e) {
      console.warn('[PartySyncService] getParty error:', e);
    }
    return null;
  }

  // Create party on backend
  public async createParty(partyData: Partial<PartyData>): Promise<PartyData | null> {
    try {
      const res = await fetch('/api/parties/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partyData)
      });
      const data = await res.json();
      if (data.success && data.party) {
        this.activePartyId = data.party.id;
        this.notifyListeners(data.party);
        this.ensureWebSocket();
        this.startPolling(data.party.id);
        return data.party;
      }
    } catch (e) {
      console.warn('[PartySyncService] createParty error:', e);
    }
    return null;
  }

  // Join party with member profile
  public async joinParty(partyId: string, member: PartyMember): Promise<PartyData | null> {
    const cleanId = partyId.trim().toUpperCase();
    this.activePartyId = cleanId;
    this.currentMember = member;
    this.ensureWebSocket();
    this.startPolling(cleanId);

    try {
      const res = await fetch(`/api/parties/${encodeURIComponent(cleanId)}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member })
      });
      const data = await res.json();
      if (data.success && data.party) {
        this.notifyListeners(data.party);
        return data.party;
      }
    } catch (e) {
      console.warn('[PartySyncService] joinParty error:', e);
    }
    return null;
  }

  // Send a message or live reaction
  public async sendMessage(partyId: string, message: Partial<PartyMessage>): Promise<boolean> {
    const cleanId = partyId.trim().toUpperCase();

    // Optimistic local update so user feels instant response
    const tempMsg: PartyMessage = {
      id: 'opt_' + Date.now(),
      uid: message.uid || this.currentMember?.uid || 'guest',
      name: message.name || this.currentMember?.name || 'Invité',
      photo: message.photo || this.currentMember?.photo || '',
      text: message.text || '',
      time: Date.now(),
      isSystem: message.isSystem || false,
      action: message.action,
      targetName: message.targetName,
      replyTo: message.replyTo
    };

    if (this.cachedParty && this.cachedParty.id === cleanId) {
      const optimisticParty: PartyData = {
        ...this.cachedParty,
        messages: [...(this.cachedParty.messages || []), tempMsg]
      };
      this.notifyListeners(optimisticParty);
    }

    // Send via WebSocket first if connected
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'message',
        partyId: cleanId,
        message: tempMsg
      }));
    }

    // Also send via HTTP POST for guaranteed delivery
    try {
      const res = await fetch(`/api/parties/${encodeURIComponent(cleanId)}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: tempMsg })
      });
      const data = await res.json();
      if (data.success && data.party) {
        this.notifyListeners(data.party);
        return true;
      }
    } catch (e) {
      console.warn('[PartySyncService] sendMessage HTTP fallback error:', e);
    }
    return false;
  }

  // Sync playback (play countdown, pause, offset, episode)
  public async syncAction(partyId: string, params: {
    status?: string;
    currentOffset?: number;
    syncTime?: number;
    season?: number;
    episode?: number;
  }): Promise<boolean> {
    const cleanId = partyId.trim().toUpperCase();

    // Optimistic update
    if (this.cachedParty && this.cachedParty.id === cleanId) {
      const updated = { ...this.cachedParty, ...params, syncTime: params.syncTime || Date.now() };
      this.notifyListeners(updated);
    }

    // Send via WebSocket
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'sync_action',
        partyId: cleanId,
        ...params
      }));
    }

    // Send via HTTP POST
    try {
      const res = await fetch(`/api/parties/${encodeURIComponent(cleanId)}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (data.success && data.party) {
        this.notifyListeners(data.party);
        return true;
      }
    } catch (e) {
      console.warn('[PartySyncService] syncAction HTTP fallback error:', e);
    }
    return false;
  }

  // Update room data (moderation, ban, mute, mods, etc.)
  public async updateParty(partyId: string, patch: any): Promise<boolean> {
    const cleanId = partyId.trim().toUpperCase();

    // Optimistic update
    if (this.cachedParty && this.cachedParty.id === cleanId) {
      this.notifyListeners({ ...this.cachedParty, ...patch });
    }

    try {
      const res = await fetch(`/api/parties/${encodeURIComponent(cleanId)}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      });
      const data = await res.json();
      if (data.success && data.party) {
        this.notifyListeners(data.party);
        return true;
      }
    } catch (e) {
      console.warn('[PartySyncService] updateParty HTTP error:', e);
    }
    return false;
  }

  // Leave party
  public async leaveParty(partyId: string, uid: string, name?: string): Promise<void> {
    const cleanId = partyId.trim().toUpperCase();
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'leave',
        partyId: cleanId,
        uid
      }));
    }

    try {
      await fetch(`/api/parties/${encodeURIComponent(cleanId)}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, name })
      });
    } catch (e) {}

    if (this.activePartyId === cleanId) {
      this.activePartyId = null;
      this.cachedParty = null;
      this.stopPolling();
    }
  }
}

export const partySyncService = new PartySyncService();
