export const doc = (...args: any[]) => ({ id: args.join('/') });
export const setDoc = async (...args: any[]) => {};
export const getDoc = async (...args: any[]) => ({ exists: () => false, data: (): any => ({}) });
export const deleteDoc = async (...args: any[]) => {};
export const collection = (...args: any[]) => ({ path: args.join('/') });
export const addDoc = async (...args: any[]) => ({ id: 'mock-id' });
export const onSnapshot = (...args: any[]) => (() => {});
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
export const updateDoc = async (...args: any[]) => {};

