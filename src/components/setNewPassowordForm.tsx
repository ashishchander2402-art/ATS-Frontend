import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SetNewPasswordForm = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(0); // 0 to 3
  const [strengthText, setStrengthText] = useState("");
  const [strengthColor, setStrengthColor] = useState("bg-slate-200");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setStrengthText("");
      setStrengthColor("bg-slate-200");
      return;
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    setPasswordStrength(score);

    if (score === 1) {
      setStrengthText("Weak");
      setStrengthColor("bg-red-500");
    } else if (score === 2) {
      setStrengthText("Medium");
      setStrengthColor("bg-orange-500");
    } else if (score === 3) {
      setStrengthText("Strong");
      setStrengthColor("bg-green-500");
    } else {
      setStrengthText("Too Short");
      setStrengthColor("bg-red-500");
    }
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate Reset Password API
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100/80 px-8 py-10 md:px-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Set Your New Password
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 font-medium">
          Create a strong, new password that you haven't used before.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 border border-red-150 p-3.5 text-xs text-red-600 font-medium text-left">
          {error}
        </div>
      )}

      {success ? (
        <div className="mt-6 text-left">
          <div className="rounded-xl bg-green-50 border border-green-150 p-4 text-xs text-green-700 font-medium leading-relaxed">
            <span className="font-bold block text-sm mb-1 text-green-800 font-bold">Password Updated!</span>
            Your password has been successfully updated. You can now log in with your new password.
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full mt-6 flex justify-center items-center py-3.5 bg-[#3b41e3] hover:bg-[#2f33c8] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
          >
            Go to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-left">
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2"
            >
              New Password
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******** or Min. 8 chars, 1 uppercase"
                className="block w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-700 outline-none focus:bg-white focus:border-[#3b41e3] focus:ring-2 focus:ring-[#3b41e3]/10 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2.5">
                <div className="flex h-1.5 gap-1.5">
                  <div
                    className={`h-full flex-1 rounded transition-colors duration-300 ${
                      passwordStrength >= 1 ? strengthColor : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded transition-colors duration-300 ${
                      passwordStrength >= 2 ? strengthColor : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded transition-colors duration-300 ${
                      passwordStrength >= 3 ? strengthColor : "bg-slate-200"
                    }`}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>Strength:</span>
                  <span
                    className={
                      passwordStrength === 3
                        ? "text-green-500 font-extrabold"
                        : passwordStrength === 2
                          ? "text-orange-500"
                          : "text-red-500"
                    }
                  >
                    {strengthText}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="******** or Re-enter your new password"
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-700 outline-none focus:bg-white focus:border-[#3b41e3] focus:ring-2 focus:ring-[#3b41e3]/10 transition-all"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3.5 bg-[#3b41e3] hover:bg-[#2f33c8] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
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
            ) : (
              "Set New Password"
            )}
          </button>

          {/* Back to Login Link */}
          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default SetNewPasswordForm;
