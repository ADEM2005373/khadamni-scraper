"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, Calendar, TrendingUp, Layers } from "lucide-react";

interface DailyData {
  date: string;
  tanitJobs: number;
  keejob: number;
  totalScraped: number;
  userApplications: number;
}

interface SkillData {
  skill: string;
  count: number;
  percentage: number;
  category: string;
}

interface AnalyticsChartsProps {
  onDataLoaded?: (metrics: any) => void;
}

export function AnalyticsCharts({ onDataLoaded }: AnalyticsChartsProps) {
  const [timeframe, setTimeframe] = useState<"7d" | "14d" | "30d">("14d");
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [skillData, setSkillData] = useState<SkillData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/analytics/dashboard?range=${timeframe}`);
        const data = await res.json();
        if (data.success) {
          setDailyData(data.dailyScrapingVolume || []);
          setSkillData(data.skillDemandDistribution || []);
          if (onDataLoaded && data.metrics) {
            onDataLoaded(data.metrics);
          }
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, [timeframe]);

  return (
    <div className="space-y-6">
      {/* 1. Daily Scraping Curve / Area Chart */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-red-100 text-red-700">
                <TrendingUp className="w-4 h-4" />
              </span>
              <CardTitle className="text-base font-bold text-slate-900">
                Courbe d&apos;Extraction Quotidienne (Tunisie)
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Volume d&apos;offres collectées chaque jour sur TanitJobs & Keejob vs vélocité de vos candidatures
            </CardDescription>
          </div>

          {/* Timeframe Selector Pills */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl gap-1 shrink-0">
            {(["7d", "14d", "30d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeframe(range)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeframe === range
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {range === "7d" ? "7 Jours" : range === "14d" ? "14 Jours" : "30 Jours"}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradTanit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E70013" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#E70013" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradKeejob" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="tanitJobs"
                  stroke="#E70013"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#gradTanit)"
                  name="TanitJobs (Offres)"
                />
                <Area
                  type="monotone"
                  dataKey="keejob"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#gradKeejob)"
                  name="Keejob (Offres)"
                />
                <Area
                  type="monotone"
                  dataKey="userApplications"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradApps)"
                  name="Candidatures Soumises"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. Market Activity Bar Chart: Top In-Demand Tech Stacks in Tunisia */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-blue-100 text-blue-700">
                  <Layers className="w-4 h-4" />
                </span>
                <CardTitle className="text-base font-bold text-slate-900">
                  Baromètre Marché : Compétences & Technologies les Plus Demandées
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-1">
                Distribution en pourcentage des compétences exigées dans les offres d&apos;emploi scrappées en Tunisie
              </CardDescription>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Indexé par Gemini AI
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={skillData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="skill" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit="%"
                />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val}% des annonces`, "Fréquence"]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="percentage"
                  fill="#E70013"
                  radius={[6, 6, 0, 0]}
                  name="Part de Marché (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
