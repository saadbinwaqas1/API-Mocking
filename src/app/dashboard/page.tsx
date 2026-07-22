"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { CreateEndpointModal } from "@/components/CreateEndpointModal";
import { ProfileModal } from "@/components/ProfileModal";
import { EndpointCard, EndpointData } from "@/components/EndpointCard";
import {
  Plus,
  Search,
  Activity,
  Layers,
  Clock,
  Sparkles,
  RefreshCw,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  const [endpoints, setEndpoints] = useState<EndpointData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Auth protection
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch endpoints
  const fetchEndpoints = async () => {
    try {
      const res = await fetch("/api/endpoints");
      if (res.ok) {
        const data = await res.json();
        setEndpoints(data);
      }
    } catch {
      toast.error("Failed to load mock endpoints");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchEndpoints();
    }
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading your API Dashboard...</span>
      </div>
    );
  }

  // Calculate Quick Analytics
  const totalMocks = endpoints.length;
  const activeMocks = endpoints.filter((e) => e.isActive).length;
  const totalCalls = endpoints.reduce((acc, curr) => acc + curr.callCount, 0);
  const avgDelay = totalMocks > 0
    ? Math.round(endpoints.reduce((acc, curr) => acc + curr.delayMs, 0) / totalMocks)
    : 0;

  // Filtered endpoints
  const filteredEndpoints = endpoints.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Glassmorphic Navbar */}
      <Navbar
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Dynamic Mock APIs</span>
              <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Create instant backend URLs with custom simulated latency and JSON data.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="py-2.5 px-4 sm:py-3 sm:px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-xl shadow-blue-500/20 cursor-pointer active:scale-95 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Endpoint</span>
          </button>
        </div>

        {/* Compact Mobile-Friendly Analytics Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-none backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">Total Endpoints</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <span className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">{totalMocks}</span>
            <span className="block text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
              {activeMocks} Active / {totalMocks - activeMocks} Inactive
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-none backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">Requests Served</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <span className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">{totalCalls}</span>
            <span className="block text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
              Total API hits
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-none backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Latency</span>
              <div className="p-1.5 sm:p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <span className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">{avgDelay} ms</span>
            <span className="block text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
              Simulated response
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-none backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">Database</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/50 px-2 py-0.5 rounded-full font-bold">
                Online
              </span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">Vercel Postgres</span>
            <span className="block text-[10px] sm:text-[11px] text-slate-500">Prisma ORM v7</span>
          </div>
        </div>

        {/* Search & Section Title Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 p-3.5 sm:p-4 rounded-2xl shadow-sm dark:shadow-none backdrop-blur-md">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search endpoints by name or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <button
              onClick={fetchEndpoints}
              className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh List</span>
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Your API Endpoints ({filteredEndpoints.length})
            </h2>
          </div>
        </div>

        {/* Endpoints Grid (1 Column on Mobile, 2 on Tablet, 3 on Desktop) */}
        {filteredEndpoints.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm dark:shadow-none">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 shadow-xl">
              <Terminal className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500 dark:text-blue-400" />
            </div>
            <div className="max-w-md">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                {searchQuery ? "No matching endpoints found" : "No Mock Endpoints Yet"}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                {searchQuery
                  ? "Try searching for a different keyword or clear your filter."
                  : "Create your first mock API endpoint to generate a live shareable URL for your frontend or mobile app."}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Create Mock Endpoint Now</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredEndpoints.map((endpoint) => (
              <EndpointCard
                key={endpoint.id}
                endpoint={endpoint}
                onRefresh={fetchEndpoints}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      <CreateEndpointModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEndpointCreated={fetchEndpoints}
      />

      {/* Account Settings / Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentName={session?.user?.name}
        currentEmail={session?.user?.email}
        onProfileUpdated={() => {
          updateSession();
          fetchEndpoints();
        }}
      />
    </div>
  );
}
