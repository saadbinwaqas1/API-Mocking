"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Lock, Trash2, ShieldAlert, Check } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName?: string | null;
  currentEmail?: string | null;
  onProfileUpdated: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentName,
  currentEmail,
  onProfileUpdated,
}) => {
  const [name, setName] = useState(currentName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setName(currentName || "");
  }, [currentName]);

  if (!isOpen) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update profile");
        setIsLoading(false);
        return;
      }

      toast.success("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      onProfileUpdated();
      onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Account deleted. Redirecting...");
        signOut({ callbackUrl: "/login" });
      } else {
        toast.error("Failed to delete account");
        setIsDeleting(false);
      }
    } catch {
      toast.error("Error deleting account");
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Account Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleUpdateProfile} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {/* Email (Read only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address (Read Only)
              </label>
              <input
                type="email"
                disabled
                value={currentEmail || ""}
                className="w-full bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60 rounded-xl py-2.5 px-3.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-2" />

            {/* Change Password Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>Change Password</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Save Changes Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{isLoading ? "Saving..." : "Save Profile Changes"}</span>
              </button>
            </div>

            <hr className="border-slate-200 dark:border-slate-800 my-4" />

            {/* Danger Zone: Delete Account */}
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Danger Zone</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Deleting your account will permanently delete all your created mock endpoints and data.
              </p>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="py-2 px-3 rounded-lg bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete My Account</span>
                </button>
              ) : (
                <div className="space-y-2 pt-2 border-t border-rose-200 dark:border-rose-900/40">
                  <p className="text-xs text-rose-600 dark:text-rose-300 font-bold">
                    Are you 100% sure? This action cannot be undone!
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="py-1.5 px-3 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Yes, Delete Permanently"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="py-1.5 px-3 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
