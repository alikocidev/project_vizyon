import React, { createContext, useState, useEffect, ReactNode } from "react";
import { AuthState } from "@/types";
import apiClient from "@/services/api";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<boolean>;
  loading: boolean;
  updateUser: (user: AuthState["user"]) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("auth_token"),
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Set axios default header
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Verify token and get user
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await apiClient.get("/user");
      setAuthState({
        user: response.data.user,
        token: localStorage.getItem("auth_token"),
        isAuthenticated: true,
      });
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem("auth_token");
      delete apiClient.defaults.headers.common["Authorization"];
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("auth_token", token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAuthState({
        user,
        token,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);

      localStorage.removeItem("auth_token");
      delete apiClient.defaults.headers.common["Authorization"];

      return false;
    }
  };

  const register = async (name: string, email: string, password: string, passwordConfirmation: string): Promise<boolean> => {
    try {
      const response = await apiClient.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      const { token, user } = response.data;

      localStorage.setItem("auth_token", token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAuthState({
        user,
        token,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      delete apiClient.defaults.headers.common["Authorization"];

      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
      });

      setLoading(false);
    }
  };

  const updateUser = async (user: AuthState["user"]) => {
    try {
      setLoading(true);
      const response = await apiClient.put("/profile", user);
      setAuthState((prev) => ({ ...prev, user: response.data.user }));
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setAuthState((prev) => ({ ...prev, user }));
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
        loading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
