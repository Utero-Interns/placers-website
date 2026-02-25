
import type { PasswordData } from '@/types';
import React, { useState } from 'react';
import PasswordInput from './PasswordInput';

interface EditPasswordViewProps {
  onSave: (passwords: PasswordData) => void;
  onCancel: () => void;
}

const EditPasswordView: React.FC<EditPasswordViewProps> = ({ onSave, onCancel }) => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Password baru tidak cocok!");
      return;
    }
    onSave({ 
      oldPassword: passwords.oldPassword, 
      newPassword: passwords.newPassword,
      confirmPassword: passwords.confirmPassword 
    });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">Password lama</label>
          <PasswordInput
            id="oldPassword"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handleChange}
            placeholder="Masukkan password lama"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              placeholder="Masukkan password baru"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder="Masukkan konfirmasi password baru"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">Batal</button>
          <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 rounded-lg cursor-pointer">Simpan</button>
        </div>
      </form>
    </div>
  );
};

export default EditPasswordView;
