import { authService } from '@/app/lib/auth';
import type { PasswordData, User } from '@/types';

// Helper to convert base64 to Blob
const checkBase64 = (str: string) => {
  return /^data:image\/[a-z]+;base64,/.test(str);
};

const base64ToBlob = async (base64: string): Promise<Blob> => {
  const res = await fetch(base64);
  return await res.blob();
};

export const userService = {
  getUser: async (): Promise<User> => {
    try {
      const authUser = await authService.getProfile();
      
      const userId = authUser.user?.id || authUser.data?.id;

      if (!userId) {
        throw new Error('User not found in session');
      }

      const response = await fetch(`/api/profile/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const result = await response.json();
      const userData = result.data || result;

      // Transform profilePicture to avatarUrl
      if (userData.profilePicture) {
        userData.avatarUrl = `/api/uploads/${userData.profilePicture.replace(/^uploads\//, "")}`;
      } else {
        userData.avatarUrl = '/seller-placeholder.png';
      }

      return userData;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  updateUser: async (updatedData: Partial<User>): Promise<User> => {
    try {
      // Validation
      if (updatedData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedData.email)) {
        throw new Error('Invalid email format');
      }
      if (updatedData.phone && !/^\d{10,15}$/.test(updatedData.phone)) {
        throw new Error('Phone number must be 10-15 digits');
      }

      // Get ID
      const authUser = await authService.getProfile();
      const userId = authUser.user?.id || authUser.data?.id;

      if (!userId) {
        throw new Error('User ID not found');
      }

      const formData = new FormData();
      if (updatedData.username) formData.append('username', updatedData.username);
      if (updatedData.email) formData.append('email', updatedData.email);
      if (updatedData.phone) formData.append('phone', updatedData.phone);
      
      // Handle Avatar
      if (updatedData.avatarUrl && checkBase64(updatedData.avatarUrl)) {
        const blob = await base64ToBlob(updatedData.avatarUrl);
        formData.append('file', blob, 'profile-picture.jpg');
      }

      const response = await fetch(`/api/profile/${userId}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update user');
      }

      return result.data || result;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  updatePassword: async (
    passwordData: PasswordData
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      if (!passwordData) {
        throw new Error('Password data is required');
      }

      if (!passwordData.newPassword) {
        throw new Error('New password is required');
      }

        if (!passwordData.confirmPassword) {
        throw new Error('Confirm password is required');
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const authUser = await authService.getProfile();
      const userId = authUser.user?.id || authUser.data?.id;

      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await fetch(`/api/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = result?.message || 'Failed to update password';

        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.join(', ');
        } else if (typeof errorMessage !== 'string') {
          errorMessage = JSON.stringify(errorMessage);
        }

        throw new Error(errorMessage);
      }

      return { success: true, message: result?.message };

    } catch (error: any) {
      console.error('Error updating password:', error);
      throw new Error(error?.message || 'Failed to update password');
    }
  }
};
