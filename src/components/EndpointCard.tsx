"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Trash2, Play, Clock, Check, Power, X, Code2 } from "lucide-react";
import { toast } from "sonner";

export interface EndpointData {
  id: string;
  name: string;
  slug: string;
  httpMethod: string;
  statusCode: number;
  delayMs: number;
  responseBody: string;
  isActive: boolean;
  callCount: number;
  createdAt: string;
}

interface EndpointCardProps {
  endpoint: EndpointData;
  onRefresh: () => void;
}

const methodColors: Record<string, string> = {
  GET: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/60",
  POST: "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800/60",
  PUT: "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800/60",
  DELETE: "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800/60",
  PATCH: "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800/60",
};

export const EndpointCard: React.FC<EndpointCardProps> = ({ endpoint, onRefresh }) => {
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    status?: number;
    timeMs?: number;
    data?: any;
    error?: string;
  } | null>(null);
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false);

  // Full shareable URL
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareableUrl = `${origin}/api/mock/${endpoint.slug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    toast.success("Live API Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleActive = async () => {
    try {
      const res = await fetch(`/api/endpoints/${endpoint.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !endpoint.isActive }),
      });

      if (res.ok) {
        toast.success(
          `Endpoint ${!endpoint.isActive ? "Activated" : "Deactivated"}`
        );
        onRefresh();
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${endpoint.name}"?`)) return;

    try {
      const res = await fetch(`/api/endpoints/${endpoint.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Endpoint deleted successfully!");
        onRefresh();
      }
    } catch {
      toast.error("Failed to delete endpoint");
    }
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const startTime = performance.now();

    try {
      const res = await fetch(`/api/mock/${endpoint.slug}`, {
        method: endpoint.httpMethod,
      });

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      const data = await res.json();

      setTestResult({
        status: res.status,
        timeMs: duration,
        data,
      });
      onRefresh(); // Refresh to update call count
    } catch (err: any) {
      setTestResult({
        error: err.message || "Failed to execute request",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-slate-900/80 border rounded-2xl p-4 sm:p-5 backdrop-blur-md transition-all duration-300 relative group overflow-hidden ${
          endpoint.isActive
            ? "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-md dark:shadow-xl"
            : "border-slate-200/60 dark:border-slate-800/40 opacity-60 bg-slate-100/50 dark:bg-slate-950/40"
        }`}
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold font-mono border ${
                methodColors[endpoint.httpMethod] || "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              {endpoint.httpMethod}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md font-mono border border-slate-200 dark:border-slate-700/50">
              {endpoint.statusCode}
            </span>
          </div>

          {/* Controls: Active Toggle & Delete */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleActive}
              title={endpoint.isActive ? "Deactivate Endpoint" : "Activate Endpoint"}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                endpoint.isActive
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400"
                  : "bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700/50 text-slate-400 dark:text-slate-500"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              title="Delete Endpoint"
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2 truncate">
          {endpoint.name}
        </h3>

        {/* Shareable Link Bar */}
        <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800/80 rounded-xl p-2 mb-4 overflow-hidden">
          <span className="text-[11px] sm:text-xs text-blue-600 dark:text-slate-400 font-mono truncate min-w-0 flex-1 pl-1">
            /api/mock/{endpoint.slug}
          </span>
          <button
            onClick={handleCopyUrl}
            title="Copy Full Live URL"
            className="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1 text-xs shadow-sm shrink-0"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Stats Row & Test Trigger */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800/60 text-xs">
          <div className="flex items-center gap-2.5 text-[11px] sm:text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              {endpoint.delayMs}ms
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Hits: <strong className="text-slate-900 dark:text-white">{endpoint.callCount}</strong>
            </span>
          </div>

          <button
            onClick={() => {
              setIsTestDrawerOpen(true);
              handleRunTest();
            }}
            className="py-1.5 px-2.5 sm:px-3 rounded-lg bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-100 dark:hover:bg-blue-600/30 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Test</span>
          </button>
        </div>
      </motion.div>

      {/* Quick Test Modal / Drawer */}
      <AnimatePresence>
        {isTestDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                    Live API Tester: {endpoint.name}
                  </h3>
                </div>
                <button
                  onClick={() => setIsTestDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Endpoint Request Info */}
              <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs font-mono shrink-0">
                <div className="flex items-center gap-2 truncate min-w-0">
                  <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">{endpoint.httpMethod}</span>
                  <span className="text-slate-700 dark:text-slate-300 truncate min-w-0">{shareableUrl}</span>
                </div>
                <button
                  onClick={handleRunTest}
                  disabled={isTesting}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg font-sans font-medium text-xs hover:bg-blue-500 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isTesting ? "Executing..." : "Re-run"}
                </button>
              </div>

              {/* Test Results Output */}
              <div className="space-y-2 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between text-xs shrink-0">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Response Output</span>
                  {testResult && (
                    <div className="flex items-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Status: {testResult.status}
                      </span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        Latency: {testResult.timeMs}ms
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-100 flex-1 min-h-[160px] max-h-[300px] overflow-y-auto custom-scrollbar">
                  {isTesting ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-500 gap-2 h-full">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span>Simulating {endpoint.delayMs}ms delay...</span>
                    </div>
                  ) : testResult ? (
                    <pre className="whitespace-pre-wrap break-all">{JSON.stringify(testResult.data, null, 2)}</pre>
                  ) : (
                    <span className="text-slate-600">Click Re-run to test...</span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
