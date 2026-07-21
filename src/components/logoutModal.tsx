import React from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    // Clear all keys from local storage
    localStorage.clear();

    // Show a success message
    showToast.success("Logged out successfully!");

    // Navigate to the login page
    navigate("/login");

    // Close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent backdrop with backdrop blur for premium depth effect */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={onClose}
      />

      {/* Popup Dialog Box */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-2xl transition-all duration-300 ease-out border border-slate-100/80 scale-100">
        {/* Warning Icon with a glowing red background ring */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4 ring-8 ring-red-50/50">
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>

        {/* Modal Title */}
        <h3 className="text-xl font-bold leading-6 text-slate-900 mb-2">
          Confirm Logout
        </h3>

        {/* Modal Prompt Description */}
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to log out? Any active sessions will be closed, and all cached data will be cleared.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-slate-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 active:from-red-700 active:to-rose-800 shadow-md shadow-red-200/50 rounded-xl transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-red-500/50"
            onClick={handleLogout}
          >
            Yes, Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
