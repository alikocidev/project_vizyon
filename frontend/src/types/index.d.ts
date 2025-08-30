import { ReactNode } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface PageProps {
  user: User | null;
  title: string;
  loading?: boolean;
}
