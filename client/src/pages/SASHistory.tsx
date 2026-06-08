import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Award,
  BarChart3,
  ChevronLeft,
  ClipboardList,
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  Lock,
} from "lucide-react";
import { Link } from "wouter";
import { useMemo } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function levelBadge(level: string | null) {
  switch (level) {
    case "excellent":
      return { label: "Excellent", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" };
    case "competitive":
      return { label: "Competitive", color: "bg-blue-500/15 text-blue-400 border-blueald-500/30" };
    case "borderline":
      return { label: "Borderline", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" };
    case "needs_improvement":
      return { label: "Needs Improvement", color: "bg-red-500/15 text-red-400 border-red-500/30" };
    default:
      return { label: "Unknown", color: "bg-gray-500/15 text-gray-400 border-gray-500/30" };
  }
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatShortDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ─── Trend icon ───────────────────────────────────────────────────────────────
function TrendIcon({ current, previous }: { current: number; previous?: number }) {
  if (previous === undefined) return null;
  const diff = current - previous;
  if (diff > 0) return <span className="flex items-center gap-0.5 text-emerald-400 text-xs font-semibold"><TrendingUp className="w-3 h-3" />+{diff.toFixed(1)}%</span>;
  if (diff < 0) return <span className="flex items-center gap-0.5 text-red-400 text-xs font-semibold"><TrendingDown className="w-3 h-3" />{diff.toFixed(1)}%</span>;
  return <span className="flex items-center gap-0.5 text-gray-500 text-xs"><Minus className="w-3 h-3" />No change</span>;
}

// ─── Colour palette for chart lines ───────────────────────────────────────────
const CHART_COLORS = [
  "#a78bfa", "#fb923c", "#34d399", "#60a5fa", "#f472b6",
  "#facc15", "#38bdf8", "#c084fc", "#4ade80", "#f87171",
];

// ─── Page Header ──────────────────────────────────────────────────────────────
function PageHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/8">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-1 px-2">
              <ChevronLeft className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-white">SAS Assessment History</span>
          </div>
        </div>
        <Link href="/sas">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">
            <ClipboardList className="w-3.5 h-3.5 mr-1.5" />
            New Assessment
          </Button>
        </Link>
      </div>
    </header>
  );
}

// ─── Score Trend Chart ────────────────────────────────────────────────────────
function ScoreTrendChart({ results }: { results: any[] }) {
  // Group by specialty and build chart data (chronological)
  const specialties = useMemo(() => {
    const map: Record<string, { name: string; data: { date: string; score: number }[] }> = {};
    const sorted = [...results].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    for (const r of sorted) {
      if (!map[r.specialty]) map[r.specialty] = { name: r.specialtyName || r.specialty, data: [] };
      map[r.specialty].data.push({
        date: formatShortDate(r.createdAt),
        score: parseFloat(r.percentageScore ?? "0"),
      });
    }
    return Object.entries(map);
  }, [results]);

  // Build unified timeline for multi-line chart
  const chartData = useMemo(() => {
    const allDates = Array.from(new Set(results.map((r) => formatShortDate(r.createdAt))));
    return allDates.map((date) => {
      const point: Record<string, any> = { date };
      for (const [key, sp] of specialties) {
        const match = sp.data.find((d) => d.date === date);
        if (match) point[key] = match.score;
      }
      return point;
    });
  }, [results, specialties]);

  const chartConfig = useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {};
    specialties.forEach(([key, sp], idx) => {
      cfg[key] = { label: sp.name, color: CHART_COLORS[idx % CHART_COLORS.length] };
    });
    return cfg;
  }, [specialties]);

  if (results.length < 2) {
    return (
      <Card className="bg-white/3 border-white/8 mb-6">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            Score Trend Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Complete at least 2 assessments to see your score trend.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/3 border-white/8 mb-6">
      <CardHeader>
        <CardTitle className="text-base text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          Score Trend Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              formatter={(value) => chartConfig[value]?.label ?? value}
            />
            {specialties.map(([key], idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4, fill: CHART_COLORS[idx % CHART_COLORS.length] }}
                activeDot={{ r: 6 }}
                connectNulls
                name={key}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ─── Result Card ──────────────────────────────────────────────────────────────
function ResultCard({ result, previousResult }: { result: any; previousResult?: any }) {
  const badge = levelBadge(result.competitiveLevel);
  const pct = parseFloat(result.percentageScore ?? "0");
  const prevPct = previousResult ? parseFloat(previousResult.percentageScore ?? "0") : undefined;
  const sectionScores = result.sectionScores as Record<string, { name: string; score: number; maxScore: number }> | null;

  return (
    <Card className="bg-white/3 border-white/8 hover:border-white/15 transition-colors">
      <CardContent className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badge.color}`}>
                {badge.label}
              </span>
              <TrendIcon current={pct} previous={prevPct} />
            </div>
            <h3 className="text-sm font-bold text-white">{result.specialtyName || result.specialty}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{formatDate(result.createdAt)}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-white">
              {result.totalScore}
              <span className="text-sm text-gray-400 font-normal">/{result.maxScore}</span>
            </div>
            <div className="text-sm font-bold text-purple-400">{pct.toFixed(1)}%</div>
          </div>
        </div>

        {/* Overall progress bar */}
        <Progress value={pct} className="h-2 mb-4" />

        {/* Domain breakdown */}
        {sectionScores && Object.keys(sectionScores).length > 0 && (
          <div className="space-y-2">
            {Object.values(sectionScores).map((section) => {
              const domainPct = Math.round((section.score / section.maxScore) * 100);
              const isWeak = domainPct < 50;
              return (
                <div key={section.name}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className={isWeak ? "text-red-400" : "text-gray-400"}>{section.name}</span>
                    <span className="text-gray-500">{section.score}/{section.maxScore}</span>
                  </div>
                  <Progress
                    value={domainPct}
                    className={`h-1.5 ${isWeak ? "[&>div]:bg-red-500" : ""}`}
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Specialty Summary ────────────────────────────────────────────────────────
function SpecialtySummary({ results }: { results: any[] }) {
  const bySpecialty = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const r of results) {
      if (!map[r.specialty]) map[r.specialty] = [];
      map[r.specialty].push(r);
    }
    return Object.entries(map).map(([key, items]) => {
      const sorted = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const latest = sorted[0];
      const best = items.reduce((best, r) => parseFloat(r.percentageScore) > parseFloat(best.percentageScore) ? r : best, items[0]);
      return { key, name: latest.specialtyName || key, count: items.length, latest, best };
    });
  }, [results]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {bySpecialty.map(({ key, name, count, latest, best }) => {
        const latestPct = parseFloat(latest.percentageScore ?? "0");
        const bestPct = parseFloat(best.percentageScore ?? "0");
        const badge = levelBadge(latest.competitiveLevel);
        return (
          <div key={key} className="bg-white/3 border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-white leading-tight">{name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{count} assessment{count !== 1 ? "s" : ""}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-500">Latest</p>
                <p className="text-xl font-black text-white">{latestPct.toFixed(0)}<span className="text-xs text-gray-400">%</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Best</p>
                <p className="text-sm font-bold text-purple-400">{bestPct.toFixed(0)}%</p>
              </div>
            </div>
            <Progress value={latestPct} className="h-1.5 mt-2" />
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SASHistory() {
  const { isAuthenticated, loading } = useAuth();
  const { data: results, isLoading } = trpc.sas.getResults.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-gray-400 text-sm mb-6">Sign in to view your SAS assessment history and track your progress over time.</p>
          <a href={getLoginUrl()}>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Sign In</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
            <History className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Assessment History</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Your SAS Score History</h1>
          <p className="text-gray-400 text-sm">Track your portfolio progress across specialties over time.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/3 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : !results || results.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-400 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Assessments Yet</h3>
            <p className="text-gray-500 text-sm mb-6">Complete your first SAS assessment to start tracking your progress.</p>
            <Link href="/sas">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <ClipboardList className="w-4 h-4 mr-2" />
                Start Assessment
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/3 border border-white/8 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-white">{results.length}</div>
                <div className="text-xs text-gray-500 mt-0.5">Total Assessments</div>
              </div>
              <div className="bg-white/3 border border-white/8 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-purple-400">
                  {new Set(results.map((r) => r.specialty)).size}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Specialties Tested</div>
              </div>
              <div className="bg-white/3 border border-white/8 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-emerald-400">
                  {Math.max(...results.map((r) => parseFloat(r.percentageScore ?? "0"))).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Best Score</div>
              </div>
              <div className="bg-white/3 border border-white/8 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-orange-400">
                  {(results.reduce((sum, r) => sum + parseFloat(r.percentageScore ?? "0"), 0) / results.length).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Average Score</div>
              </div>
            </div>

            {/* Specialty summary cards */}
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              By Specialty
            </h2>
            <SpecialtySummary results={results} />

            {/* Trend chart */}
            <ScoreTrendChart results={results} />

            {/* Full history list */}
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              All Assessments
            </h2>
            <div className="space-y-4">
              {results.map((result, idx) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  previousResult={results[idx + 1]}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
