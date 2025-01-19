import { Department } from "./Department";

export type UserRole = 'user' | 'admin' | 'leader';

export interface User {
  id: string;
  email: string;
  name: string;
  post: string;
  department: Department[];
  remainingDays: number;
  taken_days: number;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  isActive?: boolean;
  phoneNumber?: string;
  imageUrl?: string;
}