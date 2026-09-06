import { partySyncService } from './partySyncService';

export const doc = (...args: any[]) => {
  const pathStr = args.map(a => (typeof a === 'object' && a?.path ? a.path : String(a))).join('/');
  const isParty = pathStr.includes('/parties/');
  let partyId: string | undefined;
  if (isParty) {
    const parts = pathStr.split('/parties/');
    partyId = parts[1]?.split('/')[0]?.toUpperCase();
  }
  return {
    id: args[args.length - 1],
    path: pathStr,
    isPartyDoc: isParty,
    partyId
  };
};

export const setDoc = async (ref: any, data: any, _opts?: any) => {
  if (ref?.isPartyDoc && ref.partyId) {
    if (data?.messages && Array.isArray(data.messages)) {
      const msg = data.messages[data.messages.length - 1];
      if (msg && (msg.text || msg.action)) {
        await partySyncService.sendMessage(ref.partyId, msg);
        return;
      }
    }
    if (data?.status !== undefined || data?.currentOffset !== undefined) {
      await partySyncService.syncAction(ref.partyId, {
        status: data.status,
        currentOffset: data.currentOffset,
        syncTime: data.syncTime,
        season: data.season,
        episode: data.episode
      });
      return;
    }
    await partySyncService.updateParty(ref.partyId, data);
    return;
  }
};

export const updateDoc = async (ref: any, data: any) => {
  if (ref?.isPartyDoc && ref.partyId) {
    if (data?.messages && Array.isArray(data.messages)) {
      const msg = data.messages[data.messages.length - 1];
      if (msg && (msg.text || msg.action)) {
        await partySyncService.sendMessage(ref.partyId, msg);
      }
    }
    if (data?.status !== undefined || data?.currentOffset !== undefined) {
      await partySyncService.syncAction(ref.partyId, {
        status: data.status,
        currentOffset: data.currentOffset,
        syncTime: data.syncTime,
        season: data.season,
        episode: data.episode
      });
    }
    await partySyncService.updateParty(ref.partyId, data);
    return;
  }
};

export const getDoc = async (ref: any) => {
  if (ref?.isPartyDoc && ref.partyId) {
    const party = await partySyncService.getParty(ref.partyId);
    return {
      exists: () => !!party,
      data: () => party || {}
    };
  }
  return { exists: () => false, data: (): any => ({}) };
};

export const onSnapshot = (ref: any, onNext: any, _onError?: any) => {
  if (ref?.isPartyDoc && ref.partyId) {
    return partySyncService.subscribeParty(ref.partyId, (partyData) => {
      if (onNext) {
        onNext({
          exists: () => !!partyData,
          data: () => partyData
        });
      }
    });
  }
  return () => {};
};

export const deleteDoc = async (...args: any[]) => {};
export const collection = (...args: any[]) => ({ path: args.join('/') });
export const addDoc = async (...args: any[]) => ({ id: 'mock-id' });
export const query = (...args: any[]) => ({});
export const orderBy = (...args: any[]) => ({});
export const limit = (...args: any[]) => ({});
export const getDocs = async (...args: any[]) => ({ docs: [] as any[], empty: true, forEach: (_fn: any) => {} });
export const arrayUnion = (...args: any[]) => args;
export const arrayRemove = (...args: any[]) => args;
export const collectionGroup = (...args: any[]) => ({});

export const onAuthStateChanged = (auth: any, cb: any) => { cb(null); return () => {}; };
export const signInAnonymously = async (...args: any[]) => ({ user: { uid: 'mock' } });
export const signInWithPopup = async (...args: any[]) => ({ user: { uid: 'mock' } });
export const signInWithRedirect = async (...args: any[]) => {};
export const signOut = async (...args: any[]) => {};

export const getMessaging = (...args: any[]) => ({});
export const getToken = async (...args: any[]) => 'mock-token';
export const onMessage = (...args: any[]) => (() => {});
export const isSupported = async (...args: any[]) => false;

export const app: any = {};
export const auth: any = {};
export const db: any = {};
export const googleProvider: any = {};
export const facebookProvider: any = {};
export const VAPID_KEY = '';
export const NOTIF_PATH = ['mock'];
export const FCM_TOKEN_PATH = (...args: any[]) => ['mock'];

