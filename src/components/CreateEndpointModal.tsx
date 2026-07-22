"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Code2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CreateEndpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEndpointCreated: () => void;
}

const DEFAULT_JSON = JSON.stringify(
  {
    status: "success",
    message: "Data retrieved successfully",
    data: {
      id: 101,
      username: "john_doe",
      role: "Senior Developer",
      skills: ["React", "Next.js", "TypeScript"],
    },
  },
  null,
  2
);

export const CreateEndpointModal: React.FC<CreateEndpointModalProps> = ({
  isOpen,
  onClose,
  onEndpointCreated,
}) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [httpMethod, setHttpMethod] = useState("GET");
  const [statusCode, setStatusCode] = useState(200);
  const [delayMs, setDelayMs] = useState(0);
  const [responseBody, setResponseBody] = useState(DEFAULT_JSON);
  const [isLoading, setIsLoading] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrettifyJson = () => {
    try {
      const parsed = JSON.parse(responseBody);
      setResponseBody(JSON.stringify(parsed, null, 2));
      setJsonError(null);
      toast.success("JSON formatted perfectly!");
    } catch {
      setJsonError("Invalid JSON syntax");
      toast.error("Invalid JSON syntax");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter endpoint name");
      return;
    }

    if (!slug.trim()) {
      toast.error("Please enter a custom URL slug");
      return;
    }

    // Validate JSON
    try {
      JSON.parse(responseBody);
      setJsonError(null);
    } catch {
      setJsonError("Invalid JSON format");
      toast.error("Please provide valid JSON response body");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/endpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          httpMethod,
          statusCode,
          delayMs,
          responseBody,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create endpoint");
        setIsLoading(false);
        return;
      }

      toast.success("Mock API Endpoint created successfully!");
      onEndpointCreated();
      onClose();

      // Reset form
      setName("");
      setSlug("");
      setHttpMethod("GET");
      setStatusCode(200);
      setDelayMs(0);
      setResponseBody(DEFAULT_JSON);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Create Mock API Endpoint</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Form Body for Mobile & Desktop */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
            {/* Endpoint Name & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Endpoint Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Get User Details"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL Slug *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs text-blue-600 dark:text-blue-400 font-mono font-semibold pointer-events-none select-none">
                    /mock/
                  </span>
                  <input
                    type="text"
                    placeholder="users-profile"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-20 pr-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* HTTP Method & Status Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  HTTP Method
                </label>
                <select
                  value={httpMethod}
                  onChange={(e) => setHttpMethod(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  HTTP Status Code
                </label>
                <select
                  value={statusCode}
                  onChange={(e) => setStatusCode(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value={200}>200 OK (Success)</option>
                  <option value={201}>201 Created</option>
                  <option value={400}>400 Bad Request</option>
                  <option value={401}>401 Unauthorized</option>
                  <option value={404}>404 Not Found</option>
                  <option value={500}>500 Internal Server Error</option>
                </select>
              </div>
            </div>

            {/* Simulated Latency / Delay Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>Simulated Latency (Delay)</span>
                </label>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 px-2 py-0.5 rounded-md">
                  {delayMs} ms ({(delayMs / 1000).toFixed(1)}s)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="500"
                value={delayMs}
                onChange={(e) => setDelayMs(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-950 rounded-lg border border-slate-300 dark:border-slate-800"
              />
            </div>

            {/* JSON Response Body */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Response JSON Body</span>
                </label>
                <button
                  type="button"
                  onClick={handlePrettifyJson}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-500 font-medium cursor-pointer"
                >
                  Format JSON
                </button>
              </div>
              <textarea
                rows={5}
                value={responseBody}
                onChange={(e) => setResponseBody(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 border border-slate-800 rounded-xl p-3 text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all leading-relaxed"
              />
              {jsonError && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{jsonError}</span>
                </p>
              )}
            </div>

            {/* Submit Action */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Save & Generate API"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
