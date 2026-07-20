import { create } from "zustand";
import api from "../api/interceptor";

interface AuthStore{
    login: (email: string, password: string) => Promise<any>;
    forgetPassword: (email: string) => Promise<any>;
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
  forgetPassword: async (email)  => {
    try{
        const data = await api.post("/auth/forgot-password", { email });
        return data;
    }catch(error){
        throw error;
    }},
}));