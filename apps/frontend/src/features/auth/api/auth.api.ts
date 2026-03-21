export interface AuthResponse {
  user: { id: string; email: string };
  token: string;
}

export type Credentials = Record<'email' | 'password', string>;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const loginApi = async (credentials: Credentials): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Login failed');
  }
  return res.json();
};

export const registerApi = async (credentials: Credentials): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Registration failed');
  }
  return res.json();
};

export const deleteAccountApi = async (token: string): Promise<void> => {
  const res = await fetch(`${API_URL}/auth/delete`, {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete account');
  }
};