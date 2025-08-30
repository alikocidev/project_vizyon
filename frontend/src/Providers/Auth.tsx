import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthState } from "@/types";
import apiClient from "@/Services";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

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

      // Clear any invalid token
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
      await apiClient.post("/auth/logout");
    } catch (error) {
      // Even if the API call fails, we should log out locally
    } finally {
      localStorage.removeItem("auth_token");
      delete apiClient.defaults.headers.common["Authorization"];
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
