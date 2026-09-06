import { doc, setDoc, getDoc } from '../lib/firebase-stub';
import { APP_ID } from '../constants';
import { supabase, isSupabaseConfigured, syncUserProfileSupabase } from '../lib/supabase';
import { partySyncService } from '../lib/partySyncService';

export interface PersistAvatarOptions {
  name?: string;
  handle?: string;
  email?: string;
  isVip?: boolean;
}

/**
 * Persists the user's chosen 3D avatar permanently into the cloud & server databases
 * (Server disk DB, Firebase, and Supabase), and updates active party / local states.
 */
export async function persistAvatarGlobally(
  userId: string | null | undefined,
  avatarUrlOrId: string,
  options: PersistAvatarOptions = {}
): Promise<boolean> {
  if (!avatarUrlOrId) return false;

  const targetUid = userId || 
    localStorage.getItem('levelmovie_user_uid') || 
    localStorage.getItem('lm_guest_party_uid') || 
    'user_' + Math.random().toString(36).substring(2, 9);

  const effectiveName = options.name || 
    localStorage.getItem('levelmovie_username') || 
    localStorage.getItem('levelmovie_user_name') || 
    'Cinéphile';

  const effectiveHandle = options.handle || 
    localStorage.getItem('levelmovie_user_handle') || 
    '';

  const effectiveEmail = options.email || 
    localStorage.getItem('levelmovie_user_email') || 
    '';

  // 1. Local storage immediate cache
  try {
    localStorage.setItem('levelmovie_custom_avatar', avatarUrlOrId);
    localStorage.setItem('levelmovie_user_photo', avatarUrlOrId);
    localStorage.setItem('lm_photo', avatarUrlOrId);
  } catch (e) {
    console.warn('LocalStorage avatar cache error:', e);
  }

  // 2. Dispatch events for real-time UI synchronization across all open views
  try {
    window.dispatchEvent(new CustomEvent('levelmovie_avatar_change', { 
      detail: { avatar: avatarUrlOrId } 
    }));
    window.dispatchEvent(new CustomEvent('levelmovie_profile_change', { 
      detail: { photo: avatarUrlOrId, name: effectiveName, handle: effectiveHandle } 
    }));
  } catch (e) {}

  // 3. Update active Watch Party member profile
  try {
    partySyncService.setMember({
      uid: targetUid,
      name: effectiveName,
      photo: avatarUrlOrId
    });
  } catch (e) {}

  // 4. Primary Server Database Persistence (/api/user/profile)
  const apiPromise = fetch('/api/user/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid: targetUid,
      name: effectiveName,
      handle: effectiveHandle,
      photo: avatarUrlOrId,
      email: effectiveEmail,
      isVip: options.isVip
    })
  }).catch((err) => {
    console.warn('Server user profile database error:', err);
  });

  // 5. Firestore Document Persistence
  const firestorePromises: Promise<any>[] = [];
  try {
    if (APP_ID && targetUid) {
      firestorePromises.push(
        setDoc(doc("artifacts", APP_ID, "users", targetUid, "preferences", "settings"), {
          photoURL: avatarUrlOrId,
          avatar: avatarUrlOrId,
          photo: avatarUrlOrId,
          updatedAt: Date.now()
        }, { merge: true })
      );

      firestorePromises.push(
        setDoc(doc("artifacts", APP_ID, "users", targetUid, "public", "profile"), {
          uid: targetUid,
          name: effectiveName,
          handle: effectiveHandle,
          photo: avatarUrlOrId,
          photoURL: avatarUrlOrId,
          email: effectiveEmail,
          updatedAt: Date.now()
        }, { merge: true })
      );
    }
  } catch (err) {
    console.warn('Firestore avatar persist error:', err);
  }

  // 6. Supabase Database Persistence (if configured)
  let supabasePromise = Promise.resolve();
  try {
    if (isSupabaseConfigured() && supabase) {
      supabasePromise = (async () => {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          const supabaseUid = authUser?.id || targetUid;
          if (supabaseUid) {
            await syncUserProfileSupabase(supabaseUid, {
              photoURL: avatarUrlOrId,
              photo: avatarUrlOrId,
              displayName: effectiveName,
              username: effectiveHandle,
              email: effectiveEmail || authUser?.email
            });
          }
        } catch (supaErr) {
          console.warn('Supabase avatar sync notice:', supaErr);
        }
      })();
    }
  } catch (err) {
    console.warn('Supabase check error:', err);
  }

  try {
    await Promise.allSettled([apiPromise, ...firestorePromises, supabasePromise]);
    return true;
  } catch (e) {
    console.error('Error persisting avatar to database:', e);
    return false;
  }
}

/**
 * Fetch avatar & profile from database for given user ID
 */
export async function fetchUserAvatarFromDatabase(userId: string): Promise<string | null> {
  if (!userId) return null;

  try {
    // 1. Try Server Database endpoint
    const res = await fetch(`/api/user/profile?uid=${encodeURIComponent(userId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.profile?.photo) {
        return data.profile.photo;
      }
    }
  } catch (err) {
    console.warn('Error fetching avatar from server DB:', err);
  }

  try {
    // 2. Try Firestore public profile
    if (APP_ID) {
      const snap = await getDoc(doc("artifacts", APP_ID, "users", userId, "public", "profile"));
      if (snap.exists()) {
        const data = snap.data();
        const photo = data.photo || data.photoURL;
        if (photo) return photo;
      }
    }
  } catch (err) {
    console.warn('Error fetching avatar from firestore:', err);
  }

  try {
    // 3. Try Supabase
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, photo_url')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        const photo = data.avatar_url || data.photo_url;
        if (photo) return photo;
      }
    }
  } catch (err) {
    console.warn('Error fetching avatar from Supabase:', err);
  }

  return null;
}
