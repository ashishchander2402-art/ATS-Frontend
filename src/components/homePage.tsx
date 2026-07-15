import ResumeUploadZone from "./ResumeUploadZone";
import MatchScoreGauge from "./MatchScoreGauge";
import SkillsComparison from "./SkillsComparison";
import KeywordsList from "./KeywordsList";
import ImprovementsAccordion from "./ImprovementsAccordion";
import { useResumeParsingStore } from "../services/Store/resumeParsingStore";

const HomePage = () => {
  const {
    resumeFile,
    jobDescription,
    analysisResult,
    loading,
    error,
    setResumeFile,
    setJobDescription,
    parseAndSave,
    resetError,
  } = useResumeParsingStore();

  const handleAnalyze = async () => {
    resetError();
    await parseAndSave();
  };

  return (
    <div className="w-full space-y-6 text-left">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold text-slate-800">
          Upload &amp; Analyze
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ResumeUploadZone
            file={resumeFile}
            onFileSelect={setResumeFile}
            disabled={loading}
          />

          <div>
            <label
              htmlFor="job-description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Enter Job Description
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              disabled={loading}
              placeholder={`React JS Developer\n\nResponsibilities:\n- Develop and maintain web applications\n- Collaborate with design team\n\nRequired Skills:\n- React.js, JavaScript, REST APIs`}
              className="min-h-40 w-full resize-y rounded-lg border border-slate-300 p-3 text-sm text-slate-700 outline-none focus:border-[#3b41e3] focus:ring-2 focus:ring-[#3b41e3]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
              rows={7}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3b41e3] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2f33c8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {loading
            ? "Analyzing..."
            : analysisResult
              ? "Re-Analyze Match"
              : "Analyze Match"}
        </button>
      </section>

      {analysisResult && (
        <>
          <section className="space-y-4">
            <h2 className="text-sm font-bold tracking-wide text-slate-500 uppercase">
              Resume Analysis Results
            </h2>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
              <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <MatchScoreGauge
                  score={analysisResult.matchScore}
                  label={analysisResult.matchLabel}
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-slate-800">
                  Analysis Summary
                </h3>
                {(analysisResult.experienceMatch ||
                  analysisResult.educationMatch) && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {analysisResult.experienceMatch && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        Experience: {analysisResult.experienceMatch}
                      </span>
                    )}
                    {analysisResult.educationMatch && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        Education: {analysisResult.educationMatch}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-sm leading-relaxed text-slate-600">
                  {analysisResult.summary ||
                    "No summary available for this analysis."}
                </p>
              </div>
            </div>

            <SkillsComparison
              matchedSkills={analysisResult.matchedSkills}
              missingSkills={analysisResult.missingSkills}
            />

            <KeywordsList keywords={analysisResult.keywords} />
          </section>

          <ImprovementsAccordion improvements={analysisResult.improvements} />
        </>
      )}
    </div>
  );
};

export default HomePage;
