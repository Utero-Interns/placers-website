
import React, { useState } from 'react';
import type { User } from '@/types';
import { UserIcon, Mail, Phone  } from 'lucide-react';
import Modal from './Modal';
import Image from 'next/image';

interface ProfileViewProps {
  user: User;
  onEditProfile: () => void;
  onEditPassword: () => void;
}

const InfoCard: React.FC<{ icon: React.ReactNode; value: string }> = ({ icon, value }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center space-x-4">
        <div className="text-gray-500">{icon}</div>
        <div>
            <p className="font-medium text-gray-800">{value}</p>
        </div>
    </div>
);


const ProfileView: React.FC<ProfileViewProps> = ({ user, onEditProfile, onEditPassword }) => {
    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
    
    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
                <Image
                    src={user.avatarUrl}
                    alt="User Avatar"
                    width={500}
                    height={500}
                    className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-grow text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-black">{user.username}</h2>
                    <p className="text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={onEditProfile} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer">Edit Profil</button>
                    <button onClick={onEditPassword} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer">Edit Password</button>
                    <button onClick={() => setLogoutModalOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 rounded-lg cursor-pointer">Logout</button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4 text-black">Informasi Akun</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard icon={<UserIcon stroke='#0000FF'/>} value={user.username} />
                    <InfoCard icon={<Mail stroke='#008000'/>} value={user.email} />
                    <InfoCard icon={<Phone stroke='#C5BF07'/>} value={user.phone} />
                </div>
            </div>

            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                title="Konfirmasi Logout"
            >
                <p className="text-gray-600">Apakah Anda yakin ingin keluar dari akun?</p>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={() => setLogoutModalOpen(false)} className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">Batal</button>
                    <button onClick={() => { /* Handle logout logic here */ setLogoutModalOpen(false); }} className="px-6 py-2 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 rounded-lg cursor-pointer">Logout</button>
                </div>
            </Modal>
        </div>
    );
};

export default ProfileView;
