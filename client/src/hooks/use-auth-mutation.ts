import { useMutation } from '@tanstack/react-query';

type AuthPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
  user: {
    password: string;
    id: string;
    email: string;
    lastLogin?: string;
  };
  expiresIn: string;
};

export function useAuthMutation(endpoint: '/api/user/auth' | '/api/user/user') {
  return useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: async (payload: AuthPayload) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      return data;
    },
  });
}
