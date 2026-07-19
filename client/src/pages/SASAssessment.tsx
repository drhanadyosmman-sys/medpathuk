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
  getVerification,
  isScorable,
  isVerified,
  type SASSpecialty,
  type SASDomain,
} from "../../../shared/sas-data";
import { courseForDomain } from "../../../shared/courses";
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
  FileText,
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
  const unverifiedCount = SAS_SPECIALTIES.filter((s) => !isVerified(s.id)).length;
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
          Work through the portfolio domains for your target specialty to see
          where your evidence is strong and where it is thin.
        </p>
        {/* Stated up front rather than buried: a doctor deciding what to work
            on next needs to know which specialties are still mid-review. The
            notice disappears on its own once every matrix is verified. */}
        {unverifiedCount > 0 && (
          <p className="text-amber-300/80 max-w-2xl mx-auto text-sm mt-3">
            {unverifiedCount} of {SAS_SPECIALTIES.length} specialties are still
            being re-checked against official recruitment sources and are marked
            below. For those, treat the result as a reflection exercise rather
            than a prediction of how competitive you are.
          </p>
        )}
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
            {/* Three states. A specialty with no self-scorable portfolio says so
                whether or not it is verified — a max score would be meaningless
                there. Otherwise figures appear only once the matrix behind them
                has been checked against the official source. */}
            {!isScorable(specialty.id) ? (
              <div className="flex items-center gap-1.5 text-xs text-blue-300/90">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Not scored by portfolio — see details
              </div>
            ) : isVerified(specialty.id) ? (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Max score: <span className="text-purple-400 font-semibold">{specialty.totalMaxScore}</span></span>
                {specialty.competitiveThreshold && (
                  <span className="text-gray-500">Threshold: <span className="text-orange-400 font-semibold">{specialty.competitiveThreshold}</span></span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-amber-400/90">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Scoring under review — figures not yet confirmed
              </div>
            )}
            {specialty.msraRequired && (
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
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
        {/* Three cases. A threshold comparison is only shown when the matrix is
            verified AND the specialty publishes a threshold — several rank
            applicants against interview capacity instead, so there is no bar to
            clear and claiming one would be inventing a number. */}
        {isVerified(specialty.id) && specialty.competitiveThreshold ? (
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
        ) : isVerified(specialty.id) ? (
          <p className="text-sm text-gray-400 mt-4 max-w-lg mx-auto">
            {specialty.shortName} does not publish a pass mark. Applicants are
            invited to interview in order of score until capacity is filled, so
            the score needed changes each year. Use this to see where your
            evidence is thin, not as a cut-off.
          </p>
        ) : (
          <p className="text-sm text-amber-300/90 mt-4 max-w-lg mx-auto">
            This score is a self-reflection exercise only. The scoring criteria
            for {specialty.shortName} have not yet been confirmed against the
            official recruitment source, so it does not tell you whether you
            would be competitive. Check the official criteria before you plan
            around it.
          </p>
        )}
      </div>

      {/* Interview stage — shown as context, deliberately outside the score
          card and never added to the total. These marks are awarded by
          interviewers on the day and cannot be self-assessed. */}
      {specialty.interviewScoring && (
        <Card className="bg-white/3 border-white/8 mb-6">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-400" />
              After shortlisting: the interview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Where the shortlisting score does not carry forward, this is the
                single most decision-changing fact on the page: it tells the
                applicant when to stop building portfolio and start preparing
                for interview. It leads, rather than sitting in small print. */}
            {specialty.interviewScoring.shortlistingScoreCarriesForward === false && (
              <div className="mb-4 rounded-lg border border-amber-500/25 bg-amber-500/8 px-3 py-2.5">
                <p className="text-sm text-amber-200 leading-relaxed">
                  <span className="font-semibold">
                    Your score above does not carry into your final ranking.
                  </span>{" "}
                  It is used at shortlisting only — to win you an interview.
                  {specialty.interviewScoring.weightedMaxScore && (
                    <>
                      {" "}Offers are ranked on the weighted interview score out
                      of {specialty.interviewScoring.weightedMaxScore}, awarded
                      on the day.
                    </>
                  )}
                </p>
                <p className="text-sm text-amber-200/85 leading-relaxed mt-2">
                  Your achievements still matter after shortlisting, but as
                  something you discuss rather than a score you carry: they are
                  assessed at interview under "Application and achievements".
                  So once you are comfortably shortlisted, being able to talk
                  about the evidence you already have beats gathering more of
                  it.
                </p>
              </div>
            )}

            <p className="text-sm text-gray-400 leading-relaxed">
              {specialty.interviewScoring.description}
            </p>

            {specialty.interviewScoring.appointabilityCriteria && (
              <div className="mt-4">
                <p className="text-sm font-medium text-white mb-2">
                  To be appointable you must meet all of these
                </p>
                <ul className="space-y-1">
                  {specialty.interviewScoring.appointabilityCriteria.map((c) => (
                    <li key={c} className="flex gap-2 text-xs text-gray-400">
                      <span className="text-blue-400 shrink-0">•</span>
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  Failing any one of these makes an application not appointable,
                  however strong the rest of it is.
                </p>
              </div>
            )}

            {specialty.interviewScoring.weightedAreas && (
              <div className="mt-4">
                <p className="text-sm font-medium text-white mb-2">
                  How the interview is weighted
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <tbody>
                      {specialty.interviewScoring.weightedAreas.map((a) => (
                        <tr key={a.area} className="border-b border-white/5">
                          <td className="py-1.5 pr-3 text-gray-400">{a.area}</td>
                          <td className="py-1.5 pr-3 text-gray-500 whitespace-nowrap">{a.weighting}</td>
                          <td className="py-1.5 text-right text-gray-300 whitespace-nowrap">/{a.maxScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4">
              None of this is included in the score above — interviewers award
              these marks on the day, so it is not something you can score
              yourself in advance.
            </p>
          </CardContent>
        </Card>
      )}

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

      {/* Offers — the last stage, and the one with the most avoidable losses:
          missing the preference deadline forfeits an offer outright no matter
          how well the applicant scored. */}
      {specialty.offersGuidance && (
        <Card className="bg-white/3 border-white/8 mb-6">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              After the interview: how offers are made
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {specialty.offersGuidance.points.map((p) => (
                <li key={p.title}>
                  <p className="text-sm font-medium text-white">{p.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                    {p.detail}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-4">
              Programme details and regional information change every cycle —
              check the official source for the round you are applying to.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Evidence — placed straight after the breakdown, at the moment the
          applicant has just claimed a set of points and can still check they
          are able to prove each one. Scoring is self-assessed and rarely
          audited, so the cost of over-claiming surfaces far too late. */}
      {specialty.evidenceGuidance && (
        <Card className="bg-white/3 border-white/8 mb-6">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Can you prove what you claimed?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {specialty.evidenceGuidance.hardFails.map((f) => (
                <div
                  key={f}
                  className="flex gap-2 rounded-lg border border-red-500/25 bg-red-500/8 px-3 py-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-200/90 leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
            <ul className="space-y-2">
              {specialty.evidenceGuidance.rules.map((r) => (
                <li key={r} className="flex gap-2 text-xs text-gray-400 leading-relaxed">
                  <span className="text-purple-400 shrink-0">•</span>
                  {r}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

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
            // Suggest one of our own courses only where it answers this
            // specific gap, and only while the gap is substantial — a doctor
            // one point short does not need a course, and showing one there
            // turns guidance into advertising.
            const course =
              gap >= Math.ceil(domain.maxScore / 2)
                ? courseForDomain(specialty.id, domain.name)
                : null;
            return (
              <div key={domain.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/2 border border-white/5">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-400">+{gap}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-200 font-medium">{domain.name}</p>
                  <p className="text-xs text-gray-500">
                    You scored {domainScore}/{domain.maxScore} — {gap} point{gap !== 1 ? "s" : ""} available
                  </p>
                  {course && (
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-start gap-2 rounded-lg border border-teal-500/25 bg-teal-500/8 px-2.5 py-2 hover:border-teal-500/45 transition-colors group/course"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-medium text-teal-100 group-hover/course:text-white transition-colors">
                            {course.title}
                          </span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                            Our course
                          </Badge>
                        </span>
                        <span className="block text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                          {course.blurb}
                        </span>
                      </span>
                    </a>
                  )}
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
            Our AI will analyse your weakest scoring domains and generate specific, actionable steps to strengthen your {specialty.shortName} portfolio.
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

      {/* Source Link — the wording must not claim official provenance the
          figures do not have. Only a verified matrix is described as based on
          official criteria; otherwise we point to the source to check against. */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <ExternalLink className="w-4 h-4 shrink-0" />
        <span>
          {isVerified(specialty.id)
            ? "Scoring based on official criteria from"
            : "Confirm the current criteria at"}
        </span>
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

// ─── Specialty with no portfolio scoring ──────────────────────────────────────
// Some specialties rank applicants on the MSRA alone. There is no portfolio to
// self-score, so offering a score would invent a process that does not exist.
function NotPortfolioScored({
  specialty,
  onBack,
}: {
  specialty: SASSpecialty;
  onBack: () => void;
}) {
  const { note } = getVerification(specialty.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-amber-500/8 border border-amber-500/25 rounded-2xl p-8">
        <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center mb-5">
          <AlertCircle className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">
          {specialty.name} is not scored by portfolio
        </h1>
        <p className="text-gray-300 leading-relaxed mb-4">{note}</p>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          Because there is no portfolio score, a self-assessment cannot tell you
          anything useful here. Preparing for what is actually assessed is what
          moves your application.
        </p>

        {/* Where the specialty ranks on an interview, showing what that
            interview marks is the closest thing to actionable guidance we can
            give in place of a score. */}
        {specialty.interviewScoring && (
          <div className="mb-6 rounded-xl border border-white/10 bg-white/3 p-4">
            <p className="text-sm font-medium text-white mb-2">
              What you are assessed on instead
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              {specialty.interviewScoring.description}
            </p>
            {specialty.interviewScoring.weightedAreas && (
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs">
                  <tbody>
                    {specialty.interviewScoring.weightedAreas.map((a) => (
                      <tr key={a.area} className="border-b border-white/5">
                        <td className="py-1.5 pr-3 text-gray-400">{a.area}</td>
                        <td className="py-1.5 pr-3 text-gray-500 whitespace-nowrap">{a.weighting}</td>
                        <td className="py-1.5 text-right text-gray-300 whitespace-nowrap">/{a.maxScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={specialty.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Official {specialty.shortName} guidance
          </a>
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 border-white/15 text-gray-300 hover:bg-white/5"
          >
            Choose another specialty
          </Button>
        </div>
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

  // ── Specialty has no self-scorable portfolio ──
  if (!isScorable(selectedSpecialty.id)) {
    return (
      <div className="min-h-screen bg-background">
        <NotPortfolioScored specialty={selectedSpecialty} onBack={handleReset} />
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
        {/* Unverified matrices are usable as a reflection exercise, but the
            applicant needs to know that before they invest in the result. */}
        {!isVerified(selectedSpecialty.id) && (
          <div className="mb-6 flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/90 leading-relaxed">
              These criteria are under review and have not been confirmed
              against {selectedSpecialty.shortName} recruitment for the current
              cycle. Use this to reflect on your portfolio, not to judge whether
              you are competitive — and check the official criteria before
              planning around it.
            </p>
          </div>
        )}

        {/* Eligibility gates the whole application, and CREST sign-off or GMC
            registration can take months — so it is surfaced at the start of the
            assessment rather than after it. Collapsed by default to stay out of
            the way of applicants who have already cleared it. */}
        {currentDomainIdx === 0 && selectedSpecialty.eligibility && (
          <details className="mb-6 rounded-xl border border-blue-500/25 bg-blue-500/8 px-4 py-3 group">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-blue-200 marker:content-none">
              <ClipboardList className="w-4 h-4 shrink-0" />
              Before you apply: {selectedSpecialty.shortName} eligibility
              requirements
              <ChevronRight className="w-4 h-4 ml-auto shrink-0 transition-transform group-open:rotate-90" />
            </summary>
            <p className="mt-2 text-xs text-blue-200/70">
              A strong portfolio counts for nothing if you cannot apply. These
              are the {selectedSpecialty.eligibility.cycle} entry requirements.
            </p>
            <ul className="mt-3 space-y-3">
              {selectedSpecialty.eligibility.requirements.map((req) => (
                <li key={req.title}>
                  <p className="text-sm font-medium text-white">{req.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                    {req.detail}
                  </p>
                </li>
              ))}
            </ul>
          </details>
        )}

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
              <a href="/login" className="underline font-semibold">Sign in</a> to save your assessment results to your profile
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
