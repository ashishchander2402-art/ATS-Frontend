import { useState } from "react";
import type { Improvement } from "../services/Store/resumeParsingStore";

interface ImprovementsAccordionProps {
  improvements: Improvement[];
}

const priorityStyles: Record<Improvement["priority"], string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-orange-100 text-orange-700 border-orange-200",
  Low: "bg-slate-100 text-slate-600 border-slate-200",
};

const ImprovementsAccordion = ({ improvements }: ImprovementsAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (improvements.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-left text-lg font-semibold text-slate-800">
        Recommended Improvements
      </h3>

      <div className="space-y-2">
        {improvements.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={`${item.title}-${index}`}
              className="rounded-lg border border-slate-200 bg-white"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-slate-50"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <svg
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span className="truncate text-sm font-medium text-slate-800">
                    {item.title}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${priorityStyles[item.priority]}`}
                  >
                    {item.priority}
                  </span>
                </div>
              </button>

              {isOpen && item.details && item.details !== item.title && (
                <div className="border-t border-slate-100 px-4 py-3 text-left text-sm text-slate-600">
                  {item.details}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ImprovementsAccordion;
