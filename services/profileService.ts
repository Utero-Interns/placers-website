
import type { User } from '../types';

let mockUser: User = {
  id: '1',
  username: 'User',
  email: 'user@gmail.com',
  phone: '081234567891',
  avatarUrl: 'https://picsum.photos/200',
};

export const userService = {
  getUser: (): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUser);
      }, 500);
    });
  },

  updateUser: (updatedData: Partial<User>): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockUser = { ...mockUser, ...updatedData };
        resolve(mockUser);
      }, 500);
    });
  },

  updatePassword: (): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 500);
    });
  }
};
