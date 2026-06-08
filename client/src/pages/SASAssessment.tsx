import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  SAS_SPECIALTIES,
  type SASSpecialty,
  type SASDomain,
} from "../../../shared/sas-data";
import {
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  Lock,
  RotateCcw,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  History as HistoryIcon,
  Zap,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

type AnswerMap = Record<string, number>; // criterionId -> score

function getCompetitiveLevel(
  percentage: number
): "excellent" | "competitive" | "borderline" | "needs_improvement" {
  if (percentage >= 85) return "excellent";
  if (percentage >= 65) return "competitive";
  if (percentage >= 50) return "borderline";
  return "needs_improvement";
}

function competitiveLevelLabel(level: string) {
  switch (level) {
    case "excellent": return { label: "Excellent", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" };
    case "competitive": return { label: "Competitive", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" };
    case "borderline": return { label: "Borderline", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" };
    default: return { label: "Needs Improvement", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" };
  }
}

// ─── Specialty Selection ──────────────────────────────────────────────────────
function SpecialtySelector({ onSelect }: { onSelect: (s: SASSpecialty) => void }) {
  const [search, setSearch] = useState("");
  const filtered = SAS_SPECIALTIES.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.shortName.toLowerCase().includes(search.toLowerCase())
  );

  const routeColors: Record<string, string> = {
    "Core Training": "bg-purple-500/20 text-purple-300 border-purple-500/30",
    "Specialty Training": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "Run-through": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-between mb-4">
          <a href="/dashboard" className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors">
            <ChevronLeft className="w-3 h-3" /> Dashboard
          </a>
          <a href="/sas/history" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
            <HistoryIcon className="w-3 h-3" /> View History
          </a>
        </div>
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
          <ClipboardList className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300 font-medium">UK Specialty Self-Assessment</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Self Assessment Score Tool
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-base">
          Based on official NHS Oriel scoring criteria. Select your target specialty to calculate your portfolio score and see how competitive you are for UK specialty training applications.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-all"
        />
      </div>

      {/* Specialty Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((specialty) => (
          <button
            key={specialty.id}
            onClick={() => onSelect(specialty)}
            className="group text-left bg-white/3 hover:bg-white/6 border border-white/8 hover:border-purple-500/40 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center group-hover:bg-purple-500/25 transition-colors">
                <Stethoscope className="w-5 h-5 text-purple-400" />
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full border font-medium ${
                  routeColors[specialty.applicationRoute] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30"
                }`}
              >
                {specialty.shortName}
              </span>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1 leading-snug">
              {specialty.name}
            </h3>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{specialty.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Max score: <span className="text-purple-400 font-semibold">{specialty.totalMaxScore}</span></span>
              {specialty.competitiveThreshold && (
                <span className="text-gray-500">Threshold: <span className="text-orange-400 font-semibold">{specialty.competitiveThreshold}</span></span>
              )}
            </div>
            {specialty.msraRequired && (
              <div className="mt-2 flex items-center gap-1 text-xs text-amber-400">
                <AlertCircle className="w-3 h-3" />
                MSRA required
              </div>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No specialties found matching "{search}"</p>
        </div>
      )}
    </div>
  );
}

// ─── Domain Question Card ─────────────────────────────────────────────────────
function DomainCard({
  domain,
  answers,
  onAnswer,
}: {
  domain: SASDomain;
  answers: AnswerMap;
  onAnswer: (criterionId: string, score: number) => void;
}) {
  const domainScore = domain.criteria.reduce(
    (sum, c) => sum + (answers[c.id] ?? 0),
    0
  );
  const domainMax = domain.maxScore;
  const domainPct = Math.round((domainScore / domainMax) * 100);

  return (
    <Card className="bg-white/3 border-white/8 mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-white font-semibold">{domain.name}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              <span className="text-white font-semibold">{domainScore}</span>/{domainMax}
            </span>
            <div className="w-16">
              <Progress value={domainPct} className="h-1.5" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {domain.criteria.map((criterion) => (
          <div key={criterion.id} className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                {answers[criterion.id] !== undefined ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-600 shrink-0" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-200 font-medium mb-1">{criterion.criterion}</p>
                <p className="text-xs text-gray-500 mb-3">
                  <span className="text-purple-400">Evidence required:</span> {criterion.evidence}
                </p>
                {criterion.options ? (
                  <RadioGroup
                    value={answers[criterion.id]?.toString() ?? ""}
                    onValueChange={(val) => onAnswer(criterion.id, parseInt(val))}
                    className="space-y-2"
                  >
                    {criterion.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          answers[criterion.id] === opt.score
                            ? "border-purple-500/50 bg-purple-500/10"
                            : "border-white/5 bg-white/2 hover:border-white/15 hover:bg-white/5"
                        }`}
                        onClick={() => onAnswer(criterion.id, opt.score)}
                      >
                        <RadioGroupItem value={opt.score.toString()} id={`${criterion.id}_${idx}`} className="shrink-0" />
                        <Label htmlFor={`${criterion.id}_${idx}`} className="flex-1 cursor-pointer text-sm text-gray-300">
                          {opt.label}
                        </Label>
                        <span className={`text-xs font-bold shrink-0 ${opt.score > 0 ? "text-purple-400" : "text-gray-600"}`}>
                          {opt.score} pts
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  // Boolean yes/no for criteria without options
                  <RadioGroup
                    value={answers[criterion.id]?.toString() ?? ""}
                    onValueChange={(val) => onAnswer(criterion.id, parseInt(val))}
                    className="flex gap-3"
                  >
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                        answers[criterion.id] === criterion.score
                          ? "border-purple-500/50 bg-purple-500/10"
                          : "border-white/5 bg-white/2 hover:border-white/15"
                      }`}
                      onClick={() => onAnswer(criterion.id, criterion.score)}
                    >
                      <RadioGroupItem value={criterion.score.toString()} id={`${criterion.id}_yes`} />
                      <Label htmlFor={`${criterion.id}_yes`} className="cursor-pointer text-sm text-gray-300">
                        Yes — {criterion.score} pts
                      </Label>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                        answers[criterion.id] === 0
                          ? "border-white/20 bg-white/5"
                          : "border-white/5 bg-white/2 hover:border-white/15"
                      }`}
                      onClick={() => onAnswer(criterion.id, 0)}
                    >
                      <RadioGroupItem value="0" id={`${criterion.id}_no`} />
                      <Label htmlFor={`${criterion.id}_no`} className="cursor-pointer text-sm text-gray-300">
                        No — 0 pts
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Results View ─────────────────────────────────────────────────────────────
function ResultsView({
  specialty,
  answers,
  onReset,
  onRetake,
}: {
  specialty: SASSpecialty;
  answers: AnswerMap;
  onReset: () => void;
  onRetake: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const saveResult = trpc.sas.saveResult.useMutation();
  const generateSuggestions = trpc.sas.generateRoadmapSuggestions.useMutation();
  const saveMilestonesToRoadmap = trpc.sas.saveMilestonesToRoadmap.useMutation();
  const [savedToRoadmap, setSavedToRoadmap] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    summary: string;
    overallAdvice: string;
    milestones: Array<{
      domain: string;
      priority: "high" | "medium" | "low";
      currentScore: number;
      maxScore: number;
      title: string;
      description: string;
      steps: string[];
      timeframe: string;
      resources: Array<{ title: string; url: string }>;
    }>;
  } | null>(null);
  const [suggestionsRequested, setSuggestionsRequested] = useState(false);

  // Calculate scores
  const totalScore = Object.values(answers).reduce((sum, s) => sum + s, 0);
  const maxScore = specialty.totalMaxScore;
  const percentage = Math.round((totalScore / maxScore) * 100);
  const level = getCompetitiveLevel(percentage);
  const levelInfo = competitiveLevelLabel(level);

  const sectionScores = useMemo(() => {
    const result: Record<string, { score: number; maxScore: number; name: string }> = {};
    for (const domain of specialty.domains) {
      const domainScore = domain.criteria.reduce((sum, c) => sum + (answers[c.id] ?? 0), 0);
      result[domain.id] = { score: domainScore, maxScore: domain.maxScore, name: domain.name };
    }
    return result;
  }, [specialty, answers]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save your results");
      return;
    }
    try {
      await saveResult.mutateAsync({
        specialty: specialty.id,
        specialtyName: specialty.name,
        totalScore,
        maxScore,
        percentageScore: percentage,
        answers: JSON.stringify(answers),
        sectionScores: JSON.stringify(sectionScores),
        competitiveLevel: level,
      });
      toast.success("Results saved to your profile!");
    } catch {
      toast.error("Failed to save results");
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to generate your personalised roadmap");
      return;
    }
    setSuggestionsRequested(true);
    try {
      const result = await generateSuggestions.mutateAsync({
        specialtyName: specialty.name,
        totalScore,
        maxScore,
        percentageScore: percentage,
        competitiveLevel: level,
        sectionScores: JSON.stringify(sectionScores),
      });
      setSuggestions(result);
    } catch {
      toast.error("Failed to generate suggestions. Please try again.");
      setSuggestionsRequested(false);
    }
  };

  const handleSaveToRoadmap = async () => {
    if (!suggestions || !isAuthenticated) return;
    try {
      const result = await saveMilestonesToRoadmap.mutateAsync({
        specialtyName: specialty.name,
        milestones: suggestions.milestones.map((m) => ({
          domain: m.domain,
          priority: m.priority,
          title: m.title,
          description: m.description,
          steps: m.steps,
          timeframe: m.timeframe,
          resources: m.resources,
        })),
      });
      setSavedToRoadmap(true);
      toast.success(`${result.count} milestones saved to your Roadmap!`);
    } catch {
      toast.error("Failed to save milestones to Roadmap. Please try again.");
    }
  };

  const priorityConfig = {
    high: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", label: "High Priority" },
    medium: { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", label: "Medium Priority" },
    low: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", label: "Low Priority" },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Score Card */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
          <Award className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300 font-medium">Assessment Complete</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">{specialty.name}</h2>
        <p className="text-gray-400 text-sm">Self Assessment Score Results</p>
      </div>

      {/* Main Score */}
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/30 border border-purple-500/20 rounded-2xl p-8 text-center mb-6">
        <div className="text-7xl font-black text-white mb-2">
          {totalScore}
          <span className="text-3xl text-gray-400 font-normal">/{maxScore}</span>
        </div>
        <div className="text-2xl font-bold text-purple-400 mb-4">{percentage}%</div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${levelInfo.bg} ${levelInfo.color}`}>
          <TrendingUp className="w-4 h-4" />
          {levelInfo.label}
        </div>
        {specialty.competitiveThreshold && (
          <p className="text-sm text-gray-400 mt-4">
            Competitive threshold for {specialty.shortName}:{" "}
            <span className="text-orange-400 font-semibold">{specialty.competitiveThreshold}/{maxScore}</span>
            {totalScore >= specialty.competitiveThreshold ? (
              <span className="text-emerald-400 ml-2">✓ You meet this threshold</span>
            ) : (
              <span className="text-red-400 ml-2">
                You need {specialty.competitiveThreshold - totalScore} more points
              </span>
            )}
          </p>
        )}
      </div>

      {/* Section Breakdown */}
      <Card className="bg-white/3 border-white/8 mb-6">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            Score Breakdown by Domain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.values(sectionScores).map((section) => {
            const pct = Math.round((section.score / section.maxScore) * 100);
            return (
              <div key={section.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{section.name}</span>
                  <span className="text-gray-400">
                    <span className="text-white font-semibold">{section.score}</span>/{section.maxScore}
                  </span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Guidance */}
      <Card className="bg-white/3 border-white/8 mb-6">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            What to Focus On Next
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {specialty.domains.map((domain) => {
            const domainScore = domain.criteria.reduce((sum, c) => sum + (answers[c.id] ?? 0), 0);
            const gap = domain.maxScore - domainScore;
            if (gap === 0) return null;
            return (
              <div key={domain.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/2 border border-white/5">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-400">+{gap}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-200 font-medium">{domain.name}</p>
                  <p className="text-xs text-gray-500">
                    You scored {domainScore}/{domain.maxScore} — {gap} point{gap !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>
            );
          })}
          {specialty.domains.every((d) => {
            const s = d.criteria.reduce((sum, c) => sum + (answers[c.id] ?? 0), 0);
            return s === d.maxScore;
          }) && (
            <div className="text-center py-4 text-emerald-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Maximum score achieved!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Roadmap Suggestions */}
      {!suggestionsRequested ? (
        <div className="mb-6 bg-gradient-to-br from-orange-900/20 to-purple-900/20 border border-orange-500/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-orange-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Get Your Personalised Improvement Roadmap</h3>
          <p className="text-sm text-gray-400 mb-4">
            Our AI will analyse your weak scoring domains and generate specific, actionable steps to help you reach the competitive threshold for {specialty.shortName}.
          </p>
          <Button
            onClick={handleGenerateSuggestions}
            disabled={!isAuthenticated}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isAuthenticated ? "Generate My Roadmap" : "Sign In to Generate Roadmap"}
          </Button>
        </div>
      ) : generateSuggestions.isPending ? (
        <div className="mb-6 bg-white/3 border border-white/8 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 font-medium">Analysing your portfolio and generating personalised milestones...</p>
          <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
        </div>
      ) : suggestions ? (
        <div className="mb-6 space-y-4">
          {/* AI Summary Banner */}
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 border border-purple-500/20 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-purple-300 mb-1">AI Assessment Summary</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{suggestions.summary}</p>
                {suggestions.overallAdvice && (
                  <p className="text-sm text-gray-400 mt-2 italic">{suggestions.overallAdvice}</p>
                )}
              </div>
            </div>
          </div>

          {/* Save to Roadmap CTA */}
          <div className="flex items-center justify-between gap-3 bg-emerald-900/20 border border-emerald-500/20 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-sm text-gray-300">
                {savedToRoadmap ? "Milestones added to your Roadmap!" : "Add these milestones directly to your personal Roadmap for ongoing tracking."}
              </p>
            </div>
            {savedToRoadmap ? (
              <a href="/roadmap" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 whitespace-nowrap underline">
                View Roadmap →
              </a>
            ) : (
              <Button
                size="sm"
                onClick={handleSaveToRoadmap}
                disabled={saveMilestonesToRoadmap.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold whitespace-nowrap shrink-0"
              >
                {saveMilestonesToRoadmap.isPending ? "Saving..." : "Save to Roadmap"}
              </Button>
            )}
          </div>

          {/* Milestone Cards */}
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-400" />
              Personalised Improvement Milestones
            </h3>
            <div className="space-y-4">
              {suggestions.milestones.map((milestone, idx) => {
                const pc = priorityConfig[milestone.priority];
                return (
                  <div key={idx} className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-colors">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${pc.bg} ${pc.color}`}>
                            {pc.label}
                          </span>
                          <span className="text-xs text-gray-500">{milestone.timeframe}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{milestone.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{milestone.domain}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-gray-500">Current</div>
                        <div className="text-sm font-bold text-orange-400">{milestone.currentScore}/{milestone.maxScore}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-3 leading-relaxed">{milestone.description}</p>

                    {/* Steps */}
                    <div className="space-y-2 mb-3">
                      {milestone.steps.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-purple-400">{sIdx + 1}</span>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>

                    {/* Resources */}
                    {milestone.resources.length > 0 && (
                      <div className="border-t border-white/5 pt-3">
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> Useful Resources
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {milestone.resources.map((res, rIdx) => (
                            <a
                              key={rIdx}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-purple-400 hover:text-purple-300 underline"
                            >
                              {res.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Source Link */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <ExternalLink className="w-4 h-4" />
        <span>Scoring based on official criteria from</span>
        <a
          href={specialty.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 underline"
        >
          {specialty.shortName} Recruitment
        </a>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSave}
          disabled={saveResult.isPending || !isAuthenticated}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
        >
          {saveResult.isPending ? "Saving..." : isAuthenticated ? "Save Results to Profile" : "Sign In to Save"}
        </Button>
        <Button variant="outline" onClick={onRetake} className="flex-1 border-white/15 text-gray-300 hover:bg-white/5">
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Assessment
        </Button>
        <Button variant="outline" onClick={onReset} className="flex-1 border-white/15 text-gray-300 hover:bg-white/5">
          <Stethoscope className="w-4 h-4 mr-2" />
          Try Another Specialty
        </Button>
      </div>
    </div>
  );
}

// ─── Main Assessment Flow ─────────────────────────────────────────────────────
export default function SASAssessment() {
  const { isAuthenticated } = useAuth();
  const [selectedSpecialty, setSelectedSpecialty] = useState<SASSpecialty | null>(null);
  const [currentDomainIdx, setCurrentDomainIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (criterionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [criterionId]: score }));
  };

  const handleSelectSpecialty = (s: SASSpecialty) => {
    setSelectedSpecialty(s);
    setCurrentDomainIdx(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleReset = () => {
    setSelectedSpecialty(null);
    setCurrentDomainIdx(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleRetake = () => {
    setCurrentDomainIdx(0);
    setAnswers({});
    setShowResults(false);
  };

  // ── Specialty not selected ──
  if (!selectedSpecialty) {
    return (
      <div className="min-h-screen bg-background">
        <SpecialtySelector onSelect={handleSelectSpecialty} />
      </div>
    );
  }

  // ── Show results ──
  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <ResultsView
          specialty={selectedSpecialty}
          answers={answers}
          onReset={handleReset}
          onRetake={handleRetake}
        />
      </div>
    );
  }

  // ── Assessment in progress ──
  const domains = selectedSpecialty.domains;
  const currentDomain = domains[currentDomainIdx];
  const totalCriteria = domains.reduce((sum, d) => sum + d.criteria.length, 0);
  const answeredCriteria = Object.keys(answers).length;
  const overallProgress = Math.round((answeredCriteria / totalCriteria) * 100);

  // Running score
  const currentScore = Object.values(answers).reduce((sum, s) => sum + s, 0);
  const currentMax = selectedSpecialty.totalMaxScore;

  // Domain progress
  const domainAnswered = currentDomain?.criteria.filter((c) => answers[c.id] !== undefined).length ?? 0;
  const domainTotal = currentDomain?.criteria.length ?? 0;
  const domainComplete = domainAnswered === domainTotal;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-white/8 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Change Specialty
            </button>
            <div className="text-center">
              <span className="text-sm font-semibold text-white">{selectedSpecialty.shortName}</span>
              <span className="text-xs text-gray-500 ml-2">
                Domain {currentDomainIdx + 1} of {domains.length}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-purple-400">{currentScore}</span>
              <span className="text-xs text-gray-500">/{currentMax} pts</span>
            </div>
          </div>
          <Progress value={overallProgress} className="h-1.5" />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{answeredCriteria}/{totalCriteria} questions answered</span>
            <span>{overallProgress}% complete</span>
          </div>
        </div>
      </div>

      {/* Domain Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Domain Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">
              Domain {currentDomainIdx + 1}
            </span>
            {domainComplete && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                Complete
              </Badge>
            )}
          </div>
          <h2 className="text-xl font-bold text-white">{currentDomain?.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Max {currentDomain?.maxScore} points · {domainAnswered}/{domainTotal} answered
          </p>
        </div>

        {/* Domain Questions */}
        {currentDomain && (
          <DomainCard
            domain={currentDomain}
            answers={answers}
            onAnswer={handleAnswer}
          />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/8">
          <Button
            variant="outline"
            onClick={() => setCurrentDomainIdx((i) => Math.max(0, i - 1))}
            disabled={currentDomainIdx === 0}
            className="border-white/15 text-gray-300 hover:bg-white/5"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-1.5">
            {domains.map((d, idx) => {
              const domainDone = d.criteria.every((c) => answers[c.id] !== undefined);
              return (
                <button
                  key={d.id}
                  onClick={() => setCurrentDomainIdx(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentDomainIdx
                      ? "bg-purple-500 scale-125"
                      : domainDone
                      ? "bg-emerald-500"
                      : "bg-white/20"
                  }`}
                />
              );
            })}
          </div>

          {currentDomainIdx < domains.length - 1 ? (
            <Button
              onClick={() => setCurrentDomainIdx((i) => i + 1)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Next Domain
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => setShowResults(true)}
              className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold"
            >
              <Award className="w-4 h-4 mr-2" />
              View My Score
            </Button>
          )}
        </div>

        {/* Login prompt for saving */}
        {!isAuthenticated && (
          <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-300">
              <a href={getLoginUrl()} className="underline font-semibold">Sign in</a> to save your assessment results to your profile
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
