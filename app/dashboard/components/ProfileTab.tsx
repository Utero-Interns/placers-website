'use client';

import EditPasswordView from '@/components/profile/EditPasswordView';
import EditProfileView from '@/components/profile/EditProfileView';
import ProfileView from '@/components/profile/ProfileView';
import { userService } from '@/services/profileService';
import type { PasswordData, User } from '@/types';
import { useEffect, useState } from 'react';

type View = 'profile' | 'editProfile' | 'editPassword';

export default function ProfileTab() {
  const [view, setView] = useState<View>('profile');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    userService.getUser().then(data => {
      setUser(data);
      setIsLoading(false);
    });
  }, []);

  const handleSaveProfile = async (updatedData: Partial<User> & { _avatarFile?: File }) => {
    if (!user) return;
    try {
      const updatedUser = await userService.updateUser(updatedData);
      setUser(updatedUser);
      alert('Edit profil berhasil');
      window.location.href = '/dashboard';
    } catch (error) {
      alert('Gagal mengedit profil. Silakan coba lagi.');
    }
  };

  const handleSavePassword = async (passwordData: PasswordData) => {
    console.log('Updating password:', passwordData);
    
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      alert('Please provide both old and new passwords');
      return;
    }
    
    const result = await userService.updatePassword(passwordData);
    
    if (result.success) {
      alert(result.message || 'Password updated successfully!');
      setView('profile');
    } else {
      alert(result.message || 'Failed to update password');
    }
  };

  if (isLoading || !user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mb-4"></div>
          <p className="text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
       {(() => {
        switch (view) {
          case 'editProfile':
            return <EditProfileView user={user} onSave={handleSaveProfile} onCancel={() => setView('profile')} />;
          case 'editPassword':
            return <EditPasswordView onSave={handleSavePassword} onCancel={() => setView('profile')} />;
          case 'profile':
          default:
            return <ProfileView user={user} onEditProfile={() => setView('editProfile')} onEditPassword={() => setView('editPassword')} />;
        }
       })()}
    </div>
  );
}
