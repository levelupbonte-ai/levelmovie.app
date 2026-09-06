import fs from 'fs';
import path from 'path';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import type { Express, Request, Response } from 'express';

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

export interface PartyRoom {
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
  createdAt: number;
  updatedAt: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'parties.json');

// In-memory store of active party rooms
const parties = new Map<string, PartyRoom>();

// Map of partyId -> Set of active WebSocket connections
const partyClients = new Map<string, Set<WebSocket>>();

// Ensure persistence directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed: Record<string, PartyRoom> = JSON.parse(raw);
    Object.entries(parsed).forEach(([id, party]) => {
      parties.set(id, party);
    });
    console.log(`[PartyEngine] Loaded ${parties.size} watch parties from storage.`);
  }
} catch (e) {
  console.warn('[PartyEngine] Error loading parties store:', e);
}

// Debounced persistence to disk
let saveTimeout: NodeJS.Timeout | null = null;
function persistParties(): void {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      const obj: Record<string, PartyRoom> = {};
      parties.forEach((val, key) => {
        // Keep active parties (not ended or ended recently within 24h)
        if (Date.now() - val.updatedAt < 24 * 60 * 60 * 1000) {
          obj[key] = val;
        }
      });
      fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[PartyEngine] Error saving parties store:', e);
    }
  }, 1000);
}

// Broadcast message to all connected clients of a party
function broadcastToParty(partyId: string, payload: any, senderWs?: WebSocket): void {
  const clients = partyClients.get(partyId);
  if (!clients || clients.size === 0) return;

  const dataStr = JSON.stringify(payload);
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(dataStr);
      } catch (e) {
        console.warn('[PartyEngine] Broadcast error:', e);
      }
    }
  });
}

export function setupPartyEngine(app: Express, httpServer: http.Server) {
  // 1. REST API ENDPOINTS

  // Get party data
  app.get('/api/parties/:partyId', (req: Request, res: Response) => {
    const partyId = (req.params.partyId || '').trim().toUpperCase();
    const party = parties.get(partyId);
    if (!party) {
      return res.status(404).json({ success: false, error: 'Salon introuvable' });
    }
    return res.json({ success: true, party });
  });

  // Create party
  const handleCreatePartyReq = (req: Request, res: Response) => {
    const data = req.body;
    if (!data || !data.movieId) {
      return res.status(400).json({ success: false, error: 'Données de salon manquantes' });
    }

    const partyId = (data.id || ('LVL-' + Math.random().toString(36).substring(2, 8).toUpperCase())).trim().toUpperCase();
    const now = Date.now();

    const newParty: PartyRoom = {
      id: partyId,
      hostUid: data.hostUid || 'guest_host',
      mods: data.mods || [],
      modInvites: data.modInvites || [],
      banned: data.banned || [],
      muted: data.muted || [],
      movieId: data.movieId,
      mediaType: data.mediaType || 'movie',
      season: data.season || null,
      episode: data.episode || null,
      title: data.title || 'Watch Party',
      roomName: data.roomName || `Salon de ${data.title || 'Cinéma'}`,
      status: data.status || 'idle',
      syncTime: data.syncTime || now,
      currentOffset: data.currentOffset || 0,
      members: Array.isArray(data.members) ? data.members : [{ uid: data.hostUid, name: 'Hôte' }],
      messages: Array.isArray(data.messages) ? data.messages : [],
      createdAt: now,
      updatedAt: now,
    };

    parties.set(partyId, newParty);
    persistParties();

    // Broadcast update
    broadcastToParty(partyId, { type: 'party_update', partyData: newParty });

    console.log(`[PartyEngine] Watch party created: ${partyId} ("${newParty.roomName}")`);
    return res.json({ success: true, party: newParty });
  };

  app.post('/api/parties', handleCreatePartyReq);
  app.post('/api/parties/create', handleCreatePartyReq);

  // Join party
  app.post('/api/parties/:partyId/join', (req: Request, res: Response) => {
    const partyId = (req.params.partyId || '').trim().toUpperCase();
    const { member } = req.body;
    const party = parties.get(partyId);

    if (!party) {
      return res.status(404).json({ success: false, error: 'Salon introuvable ou terminé' });
    }

    if (member && member.uid) {
      // Check if banned
      if (party.banned && party.banned.includes(member.uid)) {
        return res.status(403).json({ success: false, error: 'Vous êtes banni de ce salon' });
      }

      // Add or update member
      const existingIdx = party.members.findIndex((m) => m.uid === member.uid);
      if (existingIdx >= 0) {
        party.members[existingIdx] = { ...party.members[existingIdx], ...member, lastSeen: Date.now() };
      } else {
        party.members.push({
          uid: member.uid,
          name: member.name || 'Invité',
          photo: member.photo || '',
          joinedAt: Date.now(),
          lastSeen: Date.now()
        });

        // Add a system welcome message
        party.messages.push({
          uid: member.uid,
          name: member.name || 'Invité',
          photo: member.photo || '',
          isSystem: true,
          action: 'JOIN',
          time: Date.now()
        });
      }

      party.updatedAt = Date.now();
      persistParties();
      broadcastToParty(partyId, { type: 'party_update', partyData: party });
    }

    return res.json({ success: true, party });
  });

  // Get party messages
  const handleGetMessages = (req: Request, res: Response) => {
    const partyId = (req.params.partyId || '').trim().toUpperCase();
    const party = parties.get(partyId);
    if (!party) {
      return res.status(404).json({ success: false, error: 'Salon introuvable' });
    }
    return res.json({ success: true, messages: party.messages, partyId });
  };
  app.get('/api/parties/:partyId/message', handleGetMessages);
  app.get('/api/parties/:partyId/messages', handleGetMessages);

  // Post message to party
  const handlePostMessage = (req: Request, res: Response) => {
    const partyId = (req.params.partyId || '').trim().toUpperCase();
    const message = req.body.message || req.body;
    const party = parties.get(partyId);

    if (!party) {
      return res.status(404).json({ success: false, error: 'Salon introuvable' });
    }

    if (!message || (!message.text && !message.action)) {
      return res.status(400).json({ success: false, error: 'Message vide' });
    }

    // Check if muted
    if (message.uid && party.muted?.some((m) => m.uid === message.uid)) {
      return res.status(403).json({ success: false, error: 'Vous avez été mis en sourdine dans ce salon.' });
    }

    const fullMessage: PartyMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      uid: message.uid || 'guest',
      name: message.name || 'Anonyme',
      photo: message.photo || '',
      text: message.text || '',
      time: message.time || Date.now(),
      isSystem: message.isSystem || false,
      action: message.action,
      targetName: message.targetName,
      season: message.season,
      episode: message.episode,
      replyTo: message.replyTo,
    };

    party.messages.push(fullMessage);
    // Keep max 250 messages
    if (party.messages.length > 250) {
      party.messages = party.messages.slice(-250);
    }
    party.updatedAt = Date.now();
    persistParties();

    // Broadcast both new_message and party_update for real-time fidelity
    broadcastToParty(partyId, {
      type: 'new_message',
      partyId,
      message: fullMessage,
      partyData: party
    });

    return res.json({ success: true, message: fullMessage, party });
  };

  app.post('/api/parties/:partyId/message', handlePostMessage);
  app.post('/api/parties/:partyId/messages', handlePostMessage);

  // Sync playback action (play_countdown, pause, seek, episode)
  app.post('/api/parties/:partyId/sync', (req: Request, res: Response) => {
    const partyId = (req.params.partyId || '').trim().toUpperCase();
    const { status, currentOffset, syncTime, season, episode } = req.body;
    const party = parties.get(partyId);

    if (!party) {
      return res.status(404).json({ success: false, error: 'Salon introuvable' });
    }

    if (status !== undefined) party.status = status;
    if (currentOffset !== undefined) party.currentOffset = currentOffset;
    party.syncTime = syncTime || Date.now();
    if (season !== undefined) party.season = season;
    if (episode !== undefined) party.episode = episode;

    party.updatedAt = Date.now();
    persistParties();

    broadcastToParty(partyId, { type: 'party_update', partyData: party });
    return res.json({ success: true, party });
  });

  // Update party data (patch mods, banned, muted, ended, etc.)
  app.post('/api/parties/:partyId/update', (req: Request, res: Response) => {
    const partyId = (req.params.partyId || '').trim().toUpperCase();
    const patch = req.body;
    const party = parties.get(partyId);

    if (!party) {
      return res.status(404).json({ success: false, error: 'Salon introuvable' });
    }

    // Merge allowed fields
    if (patch.mods !== undefined) party.mods = patch.mods;
    if (patch.modInvites !== undefined) party.modInvites = patch.modInvites;
    if (patch.banned !== undefined) party.banned = patch.banned;
    if (patch.muted !== undefined) party.muted = patch.muted;
    if (patch.status !== undefined) party.status = patch.status;
    if (patch.roomName !== undefined) party.roomName = patch.roomName;
    if (patch.season !== undefined) party.season = patch.season;
    if (patch.episode !== undefined) party.episode = patch.episode;
    if (patch.members !== undefined) party.members = patch.members;
    if (Array.isArray(patch.messages)) party.messages = patch.messages;

    party.updatedAt = Date.now();
    persistParties();

    broadcastToParty(partyId, { type: 'party_update', partyData: party });
    return res.json({ success: true, party });
  });

  // Leave party
  app.post('/api/parties/:partyId/leave', (req: Request, res: Response) => {
    const partyId = (req.params.partyId || '').trim().toUpperCase();
    const { uid, name } = req.body;
    const party = parties.get(partyId);

    if (party && uid) {
      party.members = party.members.filter((m) => m.uid !== uid);
      if (party.members.length > 0) {
        party.messages.push({
          uid,
          name: name || 'Un spectateur',
          isSystem: true,
          action: 'LEAVE',
          time: Date.now()
        });
      }
      party.updatedAt = Date.now();
      persistParties();
      broadcastToParty(partyId, { type: 'party_update', partyData: party });
    }

    return res.json({ success: true });
  });

  // 2. WEBSOCKET SERVER ATTACHMENT
  const wss = new WebSocketServer({
    server: httpServer,
    path: '/ws/party'
  });

  wss.on('connection', (ws: WebSocket, req) => {
    let currentPartyId: string | null = null;
    let currentUserUid: string | null = null;

    ws.on('message', (rawData) => {
      try {
        const data = JSON.parse(rawData.toString());
        const type = data.type;

        if (type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', time: Date.now() }));
          return;
        }

        if (type === 'join') {
          const { partyId, member } = data;
          if (!partyId) return;
          const cleanPartyId = partyId.trim().toUpperCase();
          currentPartyId = cleanPartyId;

          // Register client connection
          if (!partyClients.has(cleanPartyId)) {
            partyClients.set(cleanPartyId, new Set());
          }
          partyClients.get(cleanPartyId)!.add(ws);

          const party = parties.get(cleanPartyId);
          if (party) {
            if (member && member.uid) {
              currentUserUid = member.uid;
              const idx = party.members.findIndex((m) => m.uid === member.uid);
              if (idx >= 0) {
                party.members[idx] = { ...party.members[idx], ...member, lastSeen: Date.now() };
              } else {
                party.members.push({
                  uid: member.uid,
                  name: member.name || 'Invité',
                  photo: member.photo || '',
                  joinedAt: Date.now(),
                  lastSeen: Date.now()
                });
              }
              party.updatedAt = Date.now();
              persistParties();
            }

            // Send initial state to caller
            ws.send(JSON.stringify({ type: 'init', partyData: party }));
            // Broadcast member update to other peers
            broadcastToParty(cleanPartyId, { type: 'party_update', partyData: party });
          } else {
            ws.send(JSON.stringify({ type: 'error', message: 'Salon introuvable' }));
          }
          return;
        }

        if (type === 'message') {
          const { partyId, message } = data;
          if (!partyId || !message) return;
          const cleanPartyId = partyId.trim().toUpperCase();
          const party = parties.get(cleanPartyId);
          if (!party) return;

          // Check if muted
          if (message.uid && party.muted?.some((m) => m.uid === message.uid)) {
            ws.send(JSON.stringify({ type: 'error', message: 'Muted in this room' }));
            return;
          }

          const fullMessage: PartyMessage = {
            id: 'msg_' + Math.random().toString(36).substring(2, 9),
            uid: message.uid || currentUserUid || 'guest',
            name: message.name || 'Invité',
            photo: message.photo || '',
            text: message.text || '',
            time: Date.now(),
            isSystem: message.isSystem || false,
            action: message.action,
            targetName: message.targetName,
            season: message.season,
            episode: message.episode,
            replyTo: message.replyTo
          };

          party.messages.push(fullMessage);
          if (party.messages.length > 250) {
            party.messages = party.messages.slice(-250);
          }
          party.updatedAt = Date.now();
          persistParties();

          // Broadcast to everyone in the party room
          broadcastToParty(cleanPartyId, {
            type: 'new_message',
            partyId: cleanPartyId,
            message: fullMessage,
            partyData: party
          });
          return;
        }

        if (type === 'sync_action') {
          const { partyId, status, currentOffset, syncTime, season, episode } = data;
          if (!partyId) return;
          const cleanPartyId = partyId.trim().toUpperCase();
          const party = parties.get(cleanPartyId);
          if (!party) return;

          if (status !== undefined) party.status = status;
          if (currentOffset !== undefined) party.currentOffset = currentOffset;
          party.syncTime = syncTime || Date.now();
          if (season !== undefined) party.season = season;
          if (episode !== undefined) party.episode = episode;

          party.updatedAt = Date.now();
          persistParties();

          broadcastToParty(cleanPartyId, { type: 'party_update', partyData: party });
          return;
        }

        if (type === 'leave') {
          const { partyId, uid } = data;
          if (partyId) {
            const cleanPartyId = partyId.trim().toUpperCase();
            const party = parties.get(cleanPartyId);
            if (party && uid) {
              party.members = party.members.filter((m) => m.uid !== uid);
              party.updatedAt = Date.now();
              persistParties();
              broadcastToParty(cleanPartyId, { type: 'party_update', partyData: party });
            }
          }
        }
      } catch (err) {
        console.warn('[PartyEngine WS] Message error:', err);
      }
    });

    ws.on('close', () => {
      if (currentPartyId && partyClients.has(currentPartyId)) {
        const clientSet = partyClients.get(currentPartyId);
        if (clientSet) {
          clientSet.delete(ws);
          if (clientSet.size === 0) {
            partyClients.delete(currentPartyId);
          }
        }
      }
    });

    ws.on('error', (err) => {
      console.warn('[PartyEngine WS] Connection error:', err);
    });
  });

  console.log('[PartyEngine] Real-time Watch Party WebSocket & REST Engine ready.');
}
