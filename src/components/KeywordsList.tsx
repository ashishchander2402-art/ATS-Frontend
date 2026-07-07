import type { KeywordMatch } from "../services/Store/resumeParsingStore";

interface KeywordsListProps {
  keywords: KeywordMatch[];
}

const KeywordsList = ({ keywords }: KeywordsListProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-left text-sm font-semibold text-slate-800">
        Top Matched Keywords
      </h3>
      <div className="flex flex-wrap gap-2">
        {keywords.length > 0 ? (
          keywords.map((keyword) => (
            <span
              key={`${keyword.term}-${keyword.percentage}`}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
            >
              {keyword.term}
              {keyword.percentage > 0 ? ` (${keyword.percentage}%)` : ""}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-400">No keywords available.</span>
        )}
      </div>
    </div>
  );
};

export default KeywordsList;
