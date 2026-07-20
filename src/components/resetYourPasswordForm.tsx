import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../services/Store/authStore";
import { showToast } from "../utils/toast";

const ResetYourPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const {forgetPassword} = useAuthStore();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast.error("Please enter your email address.");
      return;
    }
    setLoading(true)
        try{
          const data = await forgetPassword(email);
          showToast.success(data?.data?.message);
          setSuccess(true);
        }catch(error: any){
          const message = error.response?.data?.message || "Something went wrong. Please try again.";
          showToast.error(message);
        }finally{
          setLoading(false);
        }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100/80 px-8 py-10 md:px-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Reset Your Password
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 font-medium">
          Enter your email for a recovery link.
        </p>
      </div>

      {success ? (
        <div className="mt-6 text-left">
          <div className="rounded-xl bg-green-50 border border-green-150 p-4 text-xs text-green-700 font-medium leading-relaxed">
            <span className="font-bold block text-sm mb-1 text-green-800">Check your inbox!</span>
            We've sent a password reset link to <strong className="text-green-900">{email}</strong>. Please check your email to complete the process.
          </div>
          <Link
            to="/login"
            className="w-full mt-6 flex justify-center items-center gap-2 py-3.5 border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 text-sm font-semibold rounded-xl transition-all active:scale-[0.98]"
          >
            {/* Arrow Left Icon */}
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-left">
          {/* Email Address */}
          <div>
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
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-700 outline-none focus:bg-white focus:border-[#3b41e3] focus:ring-2 focus:ring-[#3b41e3]/10 transition-all"
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
              "Send Reset Link"
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

export default ResetYourPasswordForm;
