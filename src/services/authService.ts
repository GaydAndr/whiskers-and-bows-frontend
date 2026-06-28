import { API_BASE_URL } from '../config/api';
import { User } from '@whiskers-bows/shared';


export const authService = {
  async getProfile(userId: string) {
    const response = await fetch(`${API_BASE_URL}/auth/profile?id=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  async forgotPassword(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error('Failed to request password reset');
  },

  async resetPassword(token: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    if (!response.ok) throw new Error('Failed to reset password');
    return response.json();
  },
};
