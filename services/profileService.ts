
import type { User } from '../types';

const API_BASE_URL = '/api/proxy';

export const userService = {
  getUser: async (): Promise<User> => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/me`, {
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch user profile: ${res.status}`);
      }

      const data = await res.json();
      // Handle both response structures: { user: {...} } or { data: {...} }
      const user = data.user || data.data || data;
      
      // Map backend profilePicture to frontend avatarUrl if needed
      if (user.profilePicture && !user.avatarUrl) {
        user.avatarUrl = user.profilePicture;
      }
      
      return user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  updateUser: async (updatedData: Partial<User> & { _avatarFile?: File }): Promise<User> => {
    try {
      const { _avatarFile, ...fields } = updatedData;
      let body: BodyInit;
      const headers: Record<string, string> = {};

      if (_avatarFile) {
        const form = new FormData();
        Object.entries(fields).forEach(([k, v]) => {
          if (v !== undefined && v !== null) form.append(k, String(v));
        });
        form.append('file', _avatarFile);
        body = form;
        // Don't set Content-Type — browser sets it with boundary automatically
      } else {
        body = JSON.stringify(fields);
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'PATCH',
        credentials: 'include',
        headers,
        body,
      });

      if (!res.ok) {
        throw new Error(`Failed to update user profile: ${res.status}`);
      }

      const data = await res.json();
      const user = data.user || data.data || data;
      
      // Map backend profilePicture to frontend avatarUrl if needed
      if (user.profilePicture && !user.avatarUrl) {
        user.avatarUrl = user.profilePicture;
      }
      
      return user;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  updatePassword: async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/password`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to change password: ${res.status}`);
      }

      const result = await res.json();
      return { 
        success: true, 
        message: result.message || 'Password changed successfully' 
      };
    } catch (error) {
      console.error('Error changing password:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to change password' 
      };
    }
  }
};
