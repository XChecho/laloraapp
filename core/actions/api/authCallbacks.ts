export interface AuthCallbacks {
  logout: () => Promise<void>;
  updateProfile: (data: { token: string; refreshToken: string }) => Promise<void>;
}

let callbacks: AuthCallbacks | null = null;

export function setAuthCallbacks(cb: AuthCallbacks) {
  callbacks = cb;
}

export function getAuthCallbacks(): AuthCallbacks {
  if (!callbacks) {
    throw new Error('Auth callbacks not initialized. Call setAuthCallbacks() first.');
  }
  return callbacks;
}
