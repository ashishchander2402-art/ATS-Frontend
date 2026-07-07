import { create } from "zustand";
import api from "../api/interceptor";

export interface KeywordMatch {
  term: string;
  percentage: number;
}

export interface Improvement {
  title: string;
  tags: string[];
  priority: "High" | "Medium" | "Low";
  details?: string;
}

export interface AnalysisResult {
  matchScore: number;
  matchLabel: string;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  keywords: KeywordMatch[];
  improvements: Improvement[];
  experienceMatch?: string;
  educationMatch?: string;
}

interface ResumeParsingStore {
  resumeFile: File | null;
  jobDescription: string;
  analysisResult: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  setResumeFile: (file: File | null) => void;
  setJobDescription: (text: string) => void;
  parseAndSave: () => Promise<void>;
  resetError: () => void;
}

const getMatchLabel = (score: number): string => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) =>
    typeof item === "string" ? item : String(item ?? "")
  );
};

const normalizeKeywords = (value: unknown): KeywordMatch[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") {
        return { term: item, percentage: 0 };
      }

      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const term = String(
          record.term ?? record.keyword ?? record.name ?? record.skill ?? ""
        );
        const percentage = Number(
          record.percentage ?? record.score ?? record.match ?? 0
        );

        return { term, percentage: Number.isFinite(percentage) ? percentage : 0 };
      }

      return null;
    })
    .filter((item): item is KeywordMatch => Boolean(item?.term));
};

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

const truncate = (text: string, max = 90): string =>
  text.length > max ? `${text.slice(0, max).trim()}...` : text;

const normalizeImprovements = (value: unknown): Improvement[] => {
  if (!Array.isArray(value)) return [];

  const results: Improvement[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") continue;

    const record = item as Record<string, unknown>;
    const suggestion = String(
      record.suggestion ?? record.title ?? record.improvement ?? ""
    );

    if (!suggestion) continue;

    const rawPriority = String(record.priority ?? "medium").toLowerCase();
    let priority: Improvement["priority"] = "Medium";

    if (rawPriority.includes("high")) priority = "High";
    else if (rawPriority.includes("low")) priority = "Low";

    const category = record.category ? String(record.category) : "";
    const tags = category
      ? [capitalize(category)]
      : toStringArray(record.tags ?? record.categories ?? []);

    results.push({
      title: truncate(suggestion),
      tags,
      priority,
      details: suggestion,
    });
  }

  return results;
};

const normalizeAnalysisResult = (data: unknown): AnalysisResult => {
  const record =
    data && typeof data === "object"
      ? (data as Record<string, unknown>)
      : ({} as Record<string, unknown>);

  // API returns { success, message, data: { ai_response, resume_file, ... } }
  const payload =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  const aiResponse =
    payload.ai_response && typeof payload.ai_response === "object"
      ? (payload.ai_response as Record<string, unknown>)
      : payload;

  const matchAnalysis =
    aiResponse.match_analysis && typeof aiResponse.match_analysis === "object"
      ? (aiResponse.match_analysis as Record<string, unknown>)
      : ({} as Record<string, unknown>);

  const matchScore = Number(aiResponse.ats_score ?? 0);
  const safeScore = Math.min(100, Math.max(0, matchScore));

  return {
    matchScore: safeScore,
    matchLabel: getMatchLabel(safeScore),
    summary: String(matchAnalysis.summary ?? ""),
    matchedSkills: toStringArray(matchAnalysis.matched_skills),
    missingSkills: toStringArray(matchAnalysis.missing_skills),
    keywords: normalizeKeywords(matchAnalysis.matched_keywords),
    improvements: normalizeImprovements(aiResponse.suggestions),
    experienceMatch: matchAnalysis.experience_match
      ? capitalize(String(matchAnalysis.experience_match))
      : undefined,
    educationMatch: matchAnalysis.education_match
      ? capitalize(String(matchAnalysis.education_match))
      : undefined,
  };
};

export const useResumeParsingStore = create<ResumeParsingStore>((set, get) => ({
  resumeFile: null,
  jobDescription: "",
  analysisResult: null,
  loading: false,
  error: null,

  setResumeFile: (file) => set({ resumeFile: file, error: null }),

  setJobDescription: (text) => set({ jobDescription: text, error: null }),

  resetError: () => set({ error: null }),

  parseAndSave: async () => {
    const { resumeFile, jobDescription } = get();

    if (!resumeFile) {
      set({ error: "Please upload a PDF resume before analyzing." });
      return;
    }

    if (!jobDescription.trim()) {
      set({ error: "Please enter a job description before analyzing." });
      return;
    }

    set({ loading: true, error: null });

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription.trim());

      const response = await api.post("/parse-save", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({
        analysisResult: normalizeAnalysisResult(response.data),
        loading: false,
      });
    } catch (error: unknown) {
      const message =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : error instanceof Error
            ? error.message
            : "Failed to analyze resume. Please try again.";

      set({
        error: message,
        loading: false,
      });
    }
  },
}));
