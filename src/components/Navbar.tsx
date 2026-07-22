"use client";

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  LogOut,
  User as UserIcon,
  Plus,
  Settings,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  onOpenCreateModal: () => void;
  onOpenProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreateModal,
  onOpenProfileModal,
}) => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-xl transition-colors duration-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                MOCK ENGINE
              </span>
              <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase">
                Dynamic API Dashboard
              </span>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenCreateModal}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center gap-2 transition-all duration-200 shadow-lg shadow-blue-500/20 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Mock API</span>
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* User Badge / Profile Settings Trigger */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={onOpenProfileModal}
                title="Account Settings"
                className="flex items-center gap-2 group cursor-pointer text-left py-1 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:border-blue-500 transition-all">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 max-w-[110px] truncate transition-all">
                    {session?.user?.name || "Developer"}
                  </span>
                  <span className="block text-[10px] text-slate-500 max-w-[110px] truncate">
                    {session?.user?.email}
                  </span>
                </div>
                <Settings className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-all" />
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sign Out"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Actions Header (Theme Toggle + Hamburger Menu) */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Animated Slide-Over Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Slow Sliding Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="relative w-4/5 max-w-xs h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      Navigation
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info Card */}
                <div className="bg-slate-100 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {session?.user?.name?.[0] || "U"}
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white truncate">
                      {session?.user?.name || "Developer"}
                    </span>
                    <span className="block text-xs text-slate-500 truncate">
                      {session?.user?.email}
                    </span>
                  </div>
                </div>

                {/* Action List */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenCreateModal();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Mock API</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenProfileModal();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium text-sm flex items-center gap-2.5 transition-all cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Account Settings</span>
                  </button>
                </div>
              </div>

              {/* Drawer Bottom Sign Out */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full py-3 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
