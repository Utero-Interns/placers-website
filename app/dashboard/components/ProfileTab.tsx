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

  const handleSaveProfile = async (updatedData: Partial<User>) => {
    if (!user) return;
    const updatedUser = await userService.updateUser(updatedData);
    setUser(updatedUser);
    setView('profile');
  };

  const handleSavePassword = async (passwordData: PasswordData) => {
    console.log('Updating password:', passwordData);
    
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      alert('Please provide both old and new passwords');
      return;
    }
    
    const result = await userService.updatePassword(
      passwordData.oldPassword,
      passwordData.newPassword
    );
    
    if (result.success) {
      alert(result.message || 'Password updated successfully!');
      setView('profile');
    } else {
      alert(result.message || 'Failed to update password');
    }
  };

  if (isLoading || !user) {
    return <div className="p-8 text-center">Loading profile...</div>;
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
