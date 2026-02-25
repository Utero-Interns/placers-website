import type { User } from '@/types';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface EditProfileViewProps {
  user: User;
  onSave: (updatedUser: Partial<User> & { _avatarFile?: File }) => void;
  onCancel: () => void;
}

const EditProfileView: React.FC<EditProfileViewProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone,
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatePayload: Partial<User> & { _avatarFile?: File } = { ...formData };
    if (avatarFile) {
      updatePayload._avatarFile = avatarFile;
    }
    onSave(updatePayload);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Profil</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Profil</label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            {avatarPreview ? (
              <Image src={avatarPreview || '/seller-placeholder.png'} alt="Avatar Preview" width={300} height={300} className="mx-auto h-24 w-24 rounded-full object-cover mb-4" />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <Upload className="w-12 h-12 mb-2" />
                <p>Unggah gambar disini, atau klik untuk memilih gambar</p>
                <p className="text-xs text-gray-400 mt-1">Anda dapat mengunggah 1 gambar dengan ukuran hingga 2MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
        </div>

        <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">Batal</button>
          <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 rounded-lg cursor-pointer">Simpan</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileView;
