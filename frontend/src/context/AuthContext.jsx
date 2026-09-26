import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAdminToken, setFirebaseTokenProvider } from '../lib/api';
import {
  onClientAuthStateChanged,
  getClientIdToken,
  clientLogout,
  reloadClientUser,
} from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [client, setClient] = useState(null);
  const [clientProfile, setClientProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFirebaseTokenProvider(getClientIdToken);

    (async () => {
      try {
        if (localStorage.getItem('admin_token')) {
          const { user } = await api.get('/admin/me', { auth: 'admin' });
          setAdmin(user);
        }
      } catch (_) {
        setAdminToken(null);
      }
    })();

    const unsub = onClientAuthStateChanged(async (fbUser) => {
      setClient(fbUser);
      if (fbUser) {
        try {
          const { client: prof } = await api.get('/clients/self', { auth: 'client' });
          setClientProfile(prof);
        } catch {
          setClientProfile(null);
        }
      } else {
        setClientProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Verification state derived from the Firebase user — kept in sync with whatever
  // the current ID token carries. Phone presence === phone verified for Firebase.
  const verification = useMemo(() => {
    if (!client) return { emailVerified: false, phoneVerified: false, atLeastOne: false };
    const emailVerified = !!client.emailVerified;
    const phoneVerified = !!client.phoneNumber;
    return { emailVerified, phoneVerified, atLeastOne: emailVerified || phoneVerified };
  }, [client]);

  async function adminLogin(email, password, pathToken) {
    const { token, user } = await api.post(
      `/staff-portal/${pathToken}/login`,
      { email, password }
    );
    setAdminToken(token);
    setAdmin(user);
    return user;
  }

  function adminLogout() {
    setAdminToken(null);
    setAdmin(null);
  }

  async function clientSignOut() {
    await clientLogout();
    setClient(null);
    setClientProfile(null);
  }

  async function upsertClientProfile(payload) {
    const { client: prof } = await api.post('/clients/self', payload, { auth: 'client' });
    setClientProfile(prof);
    return prof;
  }

  // After clicking the email-verify link, Firebase flips the claim — reload the
  // user object to pick it up and re-fetch our server-side profile.
  async function refreshClient() {
    const user = await reloadClientUser();
    setClient(user);
    if (user) {
      try {
        const { client: prof } = await api.get('/clients/self', { auth: 'client' });
        setClientProfile(prof);
      } catch {}
    }
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        client,
        clientProfile,
        verification,
        loading,
        adminLogin,
        adminLogout,
        clientSignOut,
        upsertClientProfile,
        refreshClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
