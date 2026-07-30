import { create } from "zustand";
import api from "../api/interceptor";

interface ResumeHistoryStore {
  historyList: any[];
  isLoading: boolean;
  pendingHistoryPromise: Promise<any> | null;
  resumeHistory: () => Promise<any>;
}

export const useResumeHistoryStore = create<ResumeHistoryStore>((set, get) => ({
  historyList: [],
  isLoading: false,
  pendingHistoryPromise: null,
  resumeHistory: async () => {
    const existingPromise = get().pendingHistoryPromise;
    if (existingPromise) {
      return existingPromise;
    }

    set({ isLoading: true });

    const requestPromise = (async () => {
      try {
        const response = await api.get("/resume/history");
        const list = response?.data?.data || [];
        set({ historyList: list, isLoading: false, pendingHistoryPromise: null });
        return response;
      } catch (error) {
        console.error("Failed to fetch resume history:", error);
        set({ isLoading: false, pendingHistoryPromise: null });
        throw error;
      }
    })();

    set({ pendingHistoryPromise: requestPromise });
    return requestPromise;
  },
}));