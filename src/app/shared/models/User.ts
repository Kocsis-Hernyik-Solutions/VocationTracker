export type UserRole = 'user' | 'admin' | 'leader';

export interface User {
  id: string;
  email: string;
  name: string;
  position: string;
  department: string;
  remainingDays: number;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  isActive?: boolean;
  phoneNumber?: string;
  imageUrl?: string;
}