import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(0); // 0 to 3
  const [strengthText, setStrengthText] = useState("");
  const [strengthColor, setStrengthColor] = useState("bg-slate-200");

  const [loading, setLoading] = useState(false);
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
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
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
    // if (!agreeTerms) {
    //   setError("You must agree to the Terms of Service.");
    //   return;
    // }

    setError("");
    setLoading(true);

    // Simulate API sign up
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1200);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100/80 px-8 py-8 md:px-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Create Account
        </h2>
        <p className="mt-1 text-sm text-slate-500 font-medium">
          Get started by creating your user profile.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 border border-red-150 p-3.5 text-xs text-red-600 font-medium text-left">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
        {/* Name Fields (Row) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"
            >
              First Name
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                {/* User Icon SVG */}
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-700 outline-none focus:bg-white focus:border-[#3b41e3] focus:ring-2 focus:ring-[#3b41e3]/10 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"
            >
              Last Name
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                {/* User Icon SVG */}
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-700 outline-none focus:bg-white focus:border-[#3b41e3] focus:ring-2 focus:ring-[#3b41e3]/10 transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"
          >
            Email Address
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg
                className="h-4.5 w-4.5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="block w-full pl-10.5 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-700 outline-none focus:bg-white focus:border-[#3b41e3] focus:ring-2 focus:ring-[#3b41e3]/10 transition-all"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"
          >
            Password
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg
                className="h-4.5 w-4.5 text-slate-400"
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
              placeholder="Min. 8 chars, 1 uppercase"
              className="block w-full pl-10.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-700 outline-none focus:bg-white focus:border-[#3b41e3] focus:ring-2 focus:ring-[#3b41e3]/10 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? (
                <svg
                  className="h-4.5 w-4.5"
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
                  className="h-4.5 w-4.5"
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
            <div className="mt-2">
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

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg
                className="h-4.5 w-4.5 text-slate-400"
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
              placeholder="Re-enter your password"
              className="block w-full pl-10.5 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-700 outline-none focus:bg-white focus:border-[#3b41e3] focus:ring-2 focus:ring-[#3b41e3]/10 transition-all"
              required
            />
          </div>
        </div>

        {/* Terms Agreement */}
        {/* <div className="flex items-start pt-1.5">
          <div className="flex items-center h-5">
            <input
              id="agreeTerms"
              name="agreeTerms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#3b41e3] focus:ring-[#3b41e3] cursor-pointer"
            />
          </div>
          <div className="ml-3 text-xs">
            <label htmlFor="agreeTerms" className="font-medium text-slate-500 cursor-pointer select-none">
              I agree to the{" "}
              <a href="#" className="font-bold text-[#3b41e3] hover:underline" onClick={(e) => e.preventDefault()}>
                Terms of Service
              </a>
            </label>
          </div>
        </div> */}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 bg-[#3b41e3] hover:bg-[#2f33c8] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
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
            "Create Account"
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#3b41e3] hover:text-[#2f33c8] transition-colors"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
