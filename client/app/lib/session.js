import { AuthClient } from '@dfinity/auth-client';

const SESSION_KEY = 'ic-auth-session';

export const checkSession = async () => {
  const authClient = await AuthClient.create();
  return await authClient.isAuthenticated();
};

export const getSessionPrincipal = async () => {
  const authClient = await AuthClient.create();
  if (await authClient.isAuthenticated()) {
    return authClient.getIdentity().getPrincipal();
  }
  return null;
};

export const clearSession = async () => {
  const authClient = await AuthClient.create();
  await authClient.logout();
  localStorage.removeItem(SESSION_KEY);
};