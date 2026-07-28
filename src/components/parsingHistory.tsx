import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ColDef } from "ag-grid-community";
import TableComponent from "./tableComponent";
import { useResumeParsingStore, type AnalysisResult } from "../services/Store/resumeParsingStore";
import { useResumeHistoryStore } from "../services/Store/resumeHistoryStore";
import { toast } from "react-toastify";

interface HistoryRecord {
  id: string;
  originalName: string;
  email: string;
  phone: string;
  atsScore: number;
  updatedAt: string;
  jobDescription: string;
  rawRecord: any;
}

// Map the complex backend response fields to the standard AnalysisResult expected by the homepage store
const mapBackendToAnalysisResult = (item: any): AnalysisResult => {
  const aiResponse = item?.ai_response || {};
  const matchAnalysis = aiResponse?.match_analysis || {};
  const score = Number(aiResponse?.ats_score ?? 0);
  const safeScore = Math.min(100, Math.max(0, score));

  const getMatchLabel = (s: number): string => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Fair";
    return "Poor";
  };

  // Convert matched keywords string array to KeywordMatch structure
  const rawKeywords = matchAnalysis?.matched_keywords || [];
  const keywords = rawKeywords
    .map((kw: any) => {
      if (typeof kw === "string") return { term: kw, percentage: 0 };
      return {
        term: String(kw?.term || kw?.keyword || kw?.name || kw?.skill || ""),
        percentage: Number(kw?.percentage || 0),
      };
    })
    .filter((k: any) => !!k.term);

  // Convert suggestions/improvements
  const rawSuggestions = aiResponse?.suggestions || [];
  const improvements = rawSuggestions
    .map((s: any) => {
      const title = s?.suggestion || s?.title || "";
      const rawPriority = String(s?.priority || "medium").toLowerCase();
      let priority: "High" | "Medium" | "Low" = "Medium";
      if (rawPriority.includes("high")) priority = "High";
      else if (rawPriority.includes("low")) priority = "Low";

      return {
        title: title.length > 90 ? `${title.slice(0, 90).trim()}...` : title,
        tags: s?.category ? [s.category.charAt(0).toUpperCase() + s.category.slice(1)] : [],
        priority,
        details: title,
      };
    })
    .filter((imp: any) => !!imp.title);

  return {
    matchScore: safeScore,
    matchLabel: getMatchLabel(safeScore),
    summary: String(matchAnalysis?.summary ?? ""),
    matchedSkills: Array.isArray(matchAnalysis?.matched_skills) ? matchAnalysis.matched_skills : [],
    missingSkills: Array.isArray(matchAnalysis?.missing_skills) ? matchAnalysis.missing_skills : [],
    keywords,
    improvements,
    experienceMatch: matchAnalysis?.experience_match
      ? matchAnalysis.experience_match.charAt(0).toUpperCase() + matchAnalysis.experience_match.slice(1)
      : undefined,
    educationMatch: matchAnalysis?.education_match
      ? matchAnalysis.education_match.charAt(0).toUpperCase() + matchAnalysis.education_match.slice(1)
      : undefined,
  };
};

export const ParsingHistory = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const setJobDescription = useResumeParsingStore((state) => state.setJobDescription);
  const { historyList, resumeHistory } = useResumeHistoryStore();

  // Load Parsing History from the API store
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await resumeHistory().catch((err) => {
        console.warn("Backend resumeHistory store fetch failed:", err);
        return null;
      });

      let fetchedList: any[] = [];
      if (response && response.data && Array.isArray(response.data.data)) {
        fetchedList = response.data.data;
      } else if (historyList && Array.isArray(historyList)) {
        fetchedList = historyList;
      }

      const mappedHistory: HistoryRecord[] = fetchedList.map((item: any) => ({
        id: item._id,
        originalName: item.resume_file?.original_name || "Parsed Resume.pdf",
        email: item.ai_response?.resume?.email || "N/A",
        phone: item.ai_response?.resume?.phone || "N/A",
        atsScore: item.ai_response?.ats_score || 0,
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
        jobDescription: item.job_description || "",
        rawRecord: item,
      }));

      setHistory(mappedHistory);
    } catch (err) {
      console.error("Error loading parsing history:", err);
      toast.error("Failed to load resume parsing history.");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // View details: map selection, save to home store, and navigate
  const handleViewDetails = (record: HistoryRecord) => {
    const analysisResult = mapBackendToAnalysisResult(record.rawRecord);
    useResumeParsingStore.setState({ analysisResult });
    setJobDescription(record.jobDescription);
    toast.success(`Loaded analysis details for ${record.originalName}`);
    navigate("/");
  };

  // Statistics summaries based on actual fetched list
  const stats = useMemo(() => {
    const total = history.length;
    if (total === 0) return { total: 0, avgScore: 0, excellent: 0, poor: 0 };

    const sum = history.reduce((acc, item) => acc + item.atsScore, 0);
    const avgScore = Math.round(sum / total);
    const excellent = history.filter((item) => item.atsScore >= 80).length;
    const poor = history.filter((item) => item.atsScore < 50).length;

    return { total, avgScore, excellent, poor };
  }, [history]);

  // AG Grid Column Definitions mapping user specifications
  const columnDefs = useMemo<ColDef<HistoryRecord>[]>(() => [
    {
      headerName: "Resume Name",
      field: "originalName",
      flex: 2.2,
      minWidth: 240,
      autoHeight: true,
      tooltipField: "originalName",   // full name on hover if truncated
      cellRenderer: (params: any) => {
        const value = params.value;
        return (
          <div className="flex items-center gap-3 h-full min-w-0">
            <div className=" p-2 text-red-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="truncate text-[14px]">{value}</span>
          </div>
        );
      }
    },
    {
      headerName: "Email Address",
      field: "email",
      flex: 1.8,
      minWidth: 200,
      tooltipField: "email",
      autoHeight: true,
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full text-slate-600 text-[14px] font-medium truncate">
          {params.value}
        </div>
      )
    },
    {
      headerName: "Phone Number",
      field: "phone",
      flex: 1.2,
      minWidth: 150,
      autoHeight: true,
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full text-slate-600 text-[14px] font-medium">
          {params.value}
        </div>
      )
    },
    {
      headerName: "ATS Match Score",
      field: "atsScore",
      flex: 1.4,
      minWidth: 170,
      sort: "desc",
      autoHeight: true,
      cellRenderer: (params: any) => {
        const score = params.value;
        let badgeColor = "bg-red-50 text-red-700 border-red-200";
        if (score >= 80) badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
        else if (score >= 60) badgeColor = "bg-amber-50 text-amber-700 border-amber-200";

        return (
          <div className="flex items-center gap-3 h-full">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeColor} shrink-0`}>
              {score}%
            </span>
            <div className="hidden lg:block w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden shrink-0">
              <div
                className={`h-full rounded-full ${score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      headerName: "Date Analyzed",
      field: "updatedAt",
      flex: 1.3,
      minWidth: 160,
      autoHeight: true,
      cellRenderer: (params: any) => {
        if (!params.value) return "-";
        const date = new Date(params.value);
        return (
          <div className="flex items-center h-full text-slate-500 text-[14px] font-normal whitespace-nowrap">
            {date.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })} at {date.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        );
      }
    },
    {
      headerName: "Actions",
      field: "id",
      flex: 0.8,
      minWidth: 110,
      maxWidth: 130,
      sortable: false,
      filter: false,
      pinned: "right",   // always visible, doesn't get squeezed out
      resizable: false,
      autoHeight: true,
      cellRenderer: (params: any) => {
        const record = params.data;
        if (!record) return null;
        return (
          <div className="flex items-center gap-2 h-full justify-start">
            <button
              onClick={() => handleViewDetails(record)}
              className="flex items-center gap-1 rounded-md bg-[#3b41e3] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#2f33c8] shadow-sm hover:shadow active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        );
      }
    }
  ], [history]);

  return (
    <div className="w-full space-y-6 text-left">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 m-0 tracking-tight">Analysis History</h1>
        <p className="mt-1 text-sm text-slate-500">
          View, search, and load your previously parsed and analyzed resumes.
        </p>
      </div>

      {/* Stats Summary Dashboard */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Total Resumes</div>
          <div className="mt-2 text-2xl font-bold text-slate-800">{stats.total}</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Avg Match Score</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{stats.avgScore}%</span>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
              stats.avgScore >= 80 ? "bg-emerald-50 text-emerald-700" : 
              stats.avgScore >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
            }`}>
              {stats.avgScore >= 80 ? "Strong" : stats.avgScore >= 60 ? "Moderate" : "Weak"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold tracking-wide text-slate-400 uppercase">High Matches (&ge;80%)</div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{stats.excellent}</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Needs Attention (&lt;50%)</div>
          <div className="mt-2 text-2xl font-bold text-rose-600">{stats.poor}</div>
        </div>
      </div>

      {/* Reusable Grid Table */}
      <TableComponent
        rowData={history}
        columnDefs={columnDefs}
        loading={loading}
        title="Parsed Resumes Database"
        description="Filter by candidate, target job role, or sort by ATS score."
        paginationPageSize={10}
        height="480px"
      />
    </div>
  );
};

export default ParsingHistory;