'use client';
import React, { useState, useEffect } from 'react';
import type { User, PasswordData } from '@/types';
import { userService } from '@/services/profileService';
import ProfileView from '@/components/profile/ProfileView';
import EditProfileView from '@/components/profile/EditProfileView';
import EditPasswordView from '@/components/profile/EditPasswordView';
import { Settings } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';
import NavBar from '@/components/NavBar';
import FootBar from '@/components/footer/FootBar';

type View = 'profile' | 'editProfile' | 'editPassword';

const Profile: React.FC = () => {
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

  const renderView = () => {
    if (isLoading || !user) {
      return <LoadingScreen />;
    }

    switch (view) {
      case 'editProfile':
        return <EditProfileView user={user} onSave={handleSaveProfile} onCancel={() => setView('profile')} />;
      case 'editPassword':
        return <EditPasswordView onSave={handleSavePassword} onCancel={() => setView('profile')} />;
      case 'profile':
      default:
        return <ProfileView user={user} onEditProfile={() => setView('editProfile')} onEditPassword={() => setView('editPassword')} />;
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <NavBar />
      <div className="min-h-screen bg-white font-sans p-4 sm:p-6 md:p-8 text-black">
        <div className="max-w-11/12 mx-auto">
          <header className="flex items-center space-x-3 mb-6">
            <Settings className="w-12 h-12 text-gray-800" />
            <h1 className="text-3xl font-bold text-gray-800">Kelola Akun</h1>
          </header>
          <main>
            {renderView()}
          </main>
        </div>
      </div>
      <FootBar />
    </div>
    
  );
};

export default Profile;
