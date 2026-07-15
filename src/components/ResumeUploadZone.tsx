import { useRef, useState, type DragEvent, type ChangeEvent } from "react";

interface ResumeUploadZoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

const ResumeUploadZone = ({
  file,
  onFileSelect,
  disabled = false,
}: ResumeUploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selected: File | null) => {
    if (disabled || !selected) return;

    if (selected.type !== "application/pdf" && !selected.name.endsWith(".pdf")) {
      alert("Please upload a PDF file only.");
      return;
    }

    onFileSelect(selected);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFile(event.dataTransfer.files?.[0] ?? null);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] ?? null);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Upload Your Resume (PDF)
      </label>

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`flex min-h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 transition-colors ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
            : isDragging
              ? "cursor-pointer border-[#3b41e3] bg-blue-50/40"
              : "cursor-pointer border-slate-300 hover:border-blue-400 hover:bg-slate-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          disabled={disabled}
          onChange={onInputChange}
        />

        {file ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <svg
              className="h-10 w-10 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4zM8 13h8v2H8v-2zm0 4h5v2H8v-2z" />
            </svg>
            <p className="max-w-full truncate text-sm font-medium text-slate-700">
              {file.name}
            </p>
            <div className="flex items-center gap-1 text-green-600">
              <svg
                className="h-5 w-5"
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
              <span className="text-xs font-medium">Uploaded</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <svg
              className="h-8 w-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5-5 5 5M12 5v12"
              />
            </svg>
            <p className="text-sm text-slate-600">
              Drop PDF here or click to browse
            </p>
            <p className="text-xs text-slate-400">PDF only</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadZone;
