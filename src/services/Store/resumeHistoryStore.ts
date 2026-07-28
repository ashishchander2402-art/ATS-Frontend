import { create } from "zustand";
import api from "../api/interceptor";

interface ResumeHistoryStore {
  historyList: any[];
  resumeHistory: () => Promise<any>;
}

export const useResumeHistoryStore = create<ResumeHistoryStore>((set) => ({
  historyList: [],
  resumeHistory: async () => {
    try {
      // Removing the redundant "/api" prefix since it is already configured in the axios baseURL.
      const response = await api.get("/resume/history");
      const list = response?.data?.data || [];
      set({ historyList: list });
      return response;
    } catch (error) {
      console.error("Failed to fetch resume history:", error);
      throw error;
    }
  },
}));