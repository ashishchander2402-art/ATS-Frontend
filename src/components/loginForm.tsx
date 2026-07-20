import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../services/Store/authStore";
import { showToast } from "../utils/toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  const {login} = useAuthStore()

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      // setError("Please fill in all fields.");
      showToast.error("Please fill in all fields.");
      return;
    }
    setLoading(true)
    try{
      const data = await login(email, password);
      showToast.success(data?.data?.message);
      navigate("/");
    }catch(error: any){
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      // setError(message);
      showToast.error(message);
      // console.log(error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100/80 px-8 py-10 md:px-10">
      {/* Brand Logo "RP" */}
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-1 text-sm text-slate-500 font-medium">
          Log in to access your analysis history.
        </p>
      </div>

      {/* {error && (
        <div className="mt-4 rounded-xl bg-red-50 border border-red-150 p-3.5 text-xs text-red-600 font-medium text-left">
          {error}
        </div>
      )} */}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-left">
        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2"
          >
            Email Address
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              {/* Mail Icon SVG */}
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-700 outline-none focus:bg-white focus:border-[#3b41e3] focus:ring-2 focus:ring-[#3b41e3]/10 transition-all"
              // required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider"
            >
              Password
            </label>
            <Link
              to="/resetpassword"
              className="text-xs font-bold text-[#3b41e3] hover:text-[#2f33c8] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              {/* Lock Icon SVG */}
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
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="block w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-700 outline-none focus:bg-white focus:border-[#3b41e3] focus:ring-2 focus:ring-[#3b41e3]/10 transition-all"
              // required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? (
                /* Eye Off SVG */
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
                /* Eye SVG */
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
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 font-medium">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-[#3b41e3] hover:text-[#2f33c8] transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
