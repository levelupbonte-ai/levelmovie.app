export const doc = (...args: any[]) => ({ id: args.join('/') });
export const setDoc = async () => {};
export const getDoc = async () => ({ exists: () => false, data: () => ({}) });
export const deleteDoc = async () => {};
export const collection = (...args: any[]) => ({ path: args.join('/') });
export const addDoc = async () => ({ id: 'mock-id' });
export const onSnapshot = () => (() => {});
export const query = () => ({});
export const orderBy = () => ({});
export const limit = () => ({});
export const getDocs = async () => ({ docs: [], empty: true, forEach: () => {} });
export const arrayUnion = (val: any) => val;
export const arrayRemove = (val: any) => val;
export const collectionGroup = () => ({});

export const onAuthStateChanged = (auth: any, cb: any) => { cb(null); return () => {}; };
export const signInAnonymously = async () => ({ user: { uid: 'mock' } });
export const signInWithPopup = async () => ({ user: { uid: 'mock' } });
export const signInWithRedirect = async () => {};
export const signOut = async () => {};

export const getMessaging = () => ({});
export const getToken = async () => 'mock-token';
export const onMessage = () => (() => {});
export const isSupported = async () => false;

export const app = {};
export const auth = {};
export const db = {};
export const googleProvider = {};
export const facebookProvider = {};
export const VAPID_KEY = '';
export const NOTIF_PATH = ['mock'];
export const FCM_TOKEN_PATH = () => ['mock'];
export const updateDoc = async () => {};
