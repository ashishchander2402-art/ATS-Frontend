interface SkillsComparisonProps {
  matchedSkills: string[];
  missingSkills: string[];
}

const CheckIcon = () => (
  <svg
    className="h-4 w-4 shrink-0 text-green-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    className="h-4 w-4 shrink-0 text-red-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
    />
  </svg>
);

const SkillsComparison = ({
  matchedSkills,
  missingSkills,
}: SkillsComparisonProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="bg-green-600 px-4 py-2.5 text-sm font-semibold text-white">
          Matched Skills
        </div>
        <ul className="divide-y divide-slate-100">
          {matchedSkills.length > 0 ? (
            matchedSkills.map((skill) => (
              <li
                key={skill}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700"
              >
                <CheckIcon />
                {skill}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-slate-400">No matched skills found.</li>
          )}
        </ul>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-500 px-4 py-2.5 text-sm font-semibold text-white">
          Missing Skills
        </div>
        <ul className="divide-y divide-slate-100">
          {missingSkills.length > 0 ? (
            missingSkills.map((skill) => (
              <li
                key={skill}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700"
              >
                <WarningIcon />
                {skill}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-slate-400">No missing skills found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SkillsComparison;
