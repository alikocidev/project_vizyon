import { AuthState } from "@/types";
import apiClient from "./api";

export const getUser = async (): Promise<{ user: AuthState["user"] }> => {
  try {
    const response = await apiClient.get("/user");
    return response.data;
  } catch (error) {
    console.error("Fetch error:auth:user");
    throw error;
  }
};

export const postLogin = async (
  email: string,
  password: string
): Promise<{ token: string; user: AuthState["user"] }> => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Fetch error:auth:login");
    throw error;
  }
};

export const postRegister = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<{ token: string; user: any }> => {
  try {
    const response = await apiClient.post("/auth/register", {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  } catch (error) {
    console.error("Fetch error:auth:register");
    throw error;
  }
};

export const postLogout = async (): Promise<boolean> => {
  try {
    await apiClient.post("auth/logout");
    return true;
  } catch (error) {
    console.error("Fetch error:auth:logout");
    throw error;
  }
};

export const putProfile = async (
  user: AuthState["user"]
): Promise<{
  message: string;
  user: AuthState["user"];
}> => {
  try {
    const response = await apiClient.put("/profile", user);
    return response.data;
  } catch (error) {
    console.error("Fetch error:auth:profile:update");
    throw error;
  }
};

export const postVerificationEmail = async (): Promise<{
  message: string;
  success: boolean;
  user: AuthState["user"];
  data: any;
}> => {
  try {
    const response = await apiClient.post("/email/verification-notification");
    return response.data;
  } catch (error) {
    console.error("Fetch error:auth:profile:verificationEmail");
    throw error;
  }
};
