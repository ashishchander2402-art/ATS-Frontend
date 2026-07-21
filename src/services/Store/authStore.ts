import { create } from "zustand";
import api from "../api/interceptor";

interface AuthStore{
    login: (email: string, password: string) => Promise<any>;
    signUp: (firstname: string, lastname: string, email: string, passowrd: string) => Promise<any>;
    forgetPassword: (email: string) => Promise<any>;
    newPassword: (token: string, password: string) => Promise<any>;
}

export const useAuthStore = create<AuthStore>(() => ({
  login: async (email, password) => {
    try {
      const data = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessKey", data?.data?.data.accessToken)
      return data;
      // update state here if needed, e.g. set({ user: ... })
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // re-throw so calling code (e.g. a form) can handle it too
    }
  },
  signUp: async (firstname, lastname, email, password) => {
    try{
      const data = await api.post("/auth/signup", { firstname, lastname, email, password });
        return data;
    }catch(error){
      throw error;
    }
  },
  forgetPassword: async (email)  => {
    try{
        const data = await api.post("/auth/forgot-password", { email });
        return data;
    }catch(error){
        throw error;
    }},
    newPassword : async (token, password) => {
      try{
        const data = await api.post("/auth/reset-password", {token, password});
        return data;
      }catch(error){
        throw error;
      }
    }
}));