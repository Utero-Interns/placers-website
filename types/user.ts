export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface PasswordData {
  oldPassword?: string;
  newPassword?: string;
}

export interface OwnerUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  level: string;
  provider: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRating {
  id: string;
  username: string;
  profilePicture: string;
}
