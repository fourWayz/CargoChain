import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './hello_world.did';

// canister ID 
const CANISTER_ID = 'qvy4c-iaaaa-aaaao-a4ciq-cai';
const IC_HOST = 'https://ic0.app';

// Initialize auth client at app start
let authClient;

export const initAuthClient = async () => {
  authClient = await AuthClient.create({
    idleOptions: {
      disableIdle: true,
      disableDefaultIdleCallback: true,
    },
  });
  return authClient;
};

export const getActor = async () => {
  if (!authClient) {
    await initAuthClient();
  }

  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ 
    host: IC_HOST,
    identity 
  });

  // Only fetch root key when not in production
  if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: CANISTER_ID,
  });
};

export const login = async () => {
  if (!authClient) {
    await initAuthClient();
  }

  return new Promise((resolve, reject) => {
    authClient.login({
      identityProvider: process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic' 
        ? 'https://identity.ic0.app' 
        : `http://localhost:4943?canisterId=${process.env.NEXT_PUBLIC_CANISTER_ID_FRONTEND}`,
      onSuccess: () => resolve(true),
      onError: (error) => reject(error),
    });
  });
};

export const logout = async () => {
  if (!authClient) {
    await initAuthClient();
  }
  await authClient.logout();
};

export const isAuthenticated = async () => {
  if (!authClient) {
    await initAuthClient();
  }
  return await authClient.isAuthenticated();
};

export const getPrincipal = async () => {
  if (!authClient) {
    await initAuthClient();
  }
  const identity = authClient.getIdentity();
  return identity.getPrincipal();
};