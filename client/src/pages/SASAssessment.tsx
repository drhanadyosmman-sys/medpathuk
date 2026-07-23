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
  type SASScoringModel,
} from "../../../shared/sas-data";
import { courseForDomain } from "../../../shared/courses";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { sasAr } from "../../../shared/sas-i18n-ar";
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

// Arabic-above-English display for one scoring-data field. When the reader has
// chosen Arabic AND a translation exists for this id/field, the Arabic takes the
// prominent line (inheriting the surrounding element's size/weight) and the
// original authoritative English sits beneath it in a smaller muted line. When
// there is no Arabic, or the language is English, the English renders exactly as
// before — no extra line, no layout change. The English is never hidden.
function BiText({
  ar,
  en,
  enClassName = "block text-xs text-gray-500 font-normal mt-0.5",
}: {
  ar?: string;
  en: string;
  enClassName?: string;
}) {
  const { language } = useLanguage();
  if (language === "ar" && ar) {
    return (
      <>
        {ar}
        <span className={enClassName}>{en}</span>
      </>
    );
  }
  return <>{en}</>;
}

// Which chrome key describes the card of a specialty with nothing to self-score.
// The default covers "msra-only", where the portfolio genuinely earns nothing;
// the named entries are for specialties whose portfolio is scored, just not by
// the applicant.
function nonScorableCardKey(model: SASScoringModel): string {
  if (model === "interview-portfolio") return "sas.nonScorableCard.interviewPortfolio";
  if (model === "application-assessed") return "sas.nonScorableCard.applicationAssessed";
  return "sas.nonScorableCard.default";
}

function getCompetitiveLevel(
  percentage: number
): "excellent" | "competitive" | "borderline" | "needs_improvement" {
  if (percentage >= 85) return "excellent";
  if (percentage >= 65) return "competitive";
  if (percentage >= 50) return "borderline";
  return "needs_improvement";
}

// Returns the colour classes and the i18n key for the level label; the words
// themselves live in the sas dictionary and are looked up at the call site.
function competitiveLevelLabel(level: string) {
  switch (level) {
    case "excellent": return { labelKey: "sas.levels.excellent", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" };
    case "competitive": return { labelKey: "sas.levels.competitive", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" };
    case "borderline": return { labelKey: "sas.levels.borderline", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" };
    default: return { labelKey: "sas.levels.needs_improvement", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" };
  }
}

// ─── Specialty Selection ──────────────────────────────────────────────────────
function SpecialtySelector({ onSelect }: { onSelect: (s: SASSpecialty) => void }) {
  const { t } = useLanguage();
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
            <ChevronLeft className="w-3 h-3" /> {t("sas.selector.backToDashboard")}
          </a>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <a href="/sas/history" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
              <HistoryIcon className="w-3 h-3" /> {t("sas.selector.viewHistory")}
            </a>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
          <ClipboardList className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300 font-medium">{t("sas.selector.badge")}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          {t("sas.selector.title")}
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-base">
          {t("sas.selector.subtitle")}
        </p>
        {/* Stated up front rather than buried: a doctor deciding what to work
            on next needs to know which specialties are still mid-review. The
            notice disappears on its own once every matrix is verified. */}
        {unverifiedCount > 0 && (
          <p className="text-amber-300/80 max-w-2xl mx-auto text-sm mt-3">
            {t("sas.selector.unverifiedNotice", {
              count: unverifiedCount,
              total: SAS_SPECIALTIES.length,
            })}
          </p>
        )}

        {/* A portfolio score is not the whole picture any more. Someone about to
            plan two years around this number needs the prioritisation rules in
            front of them now, not after they have built the evidence. */}
        <div className="max-w-2xl mx-auto mt-5 rounded-xl border border-blue-500/25 bg-blue-500/8 px-4 py-3 text-start">
          <p className="text-xs text-blue-200/90 leading-relaxed">
            <span className="font-semibold">{t("sas.selector.priorityLabel")}</span>{" "}
            {t("sas.selector.priorityBody")}{" "}
            <a
              href="https://www.bma.org.uk/advice-and-support/career-progression/training/what-we-know-so-far-about-uk-graduate-prioritisation"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              {t("sas.selector.priorityLink")}
            </a>
            .
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder={t("sas.selector.searchPlaceholder")}
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
            className="group text-start bg-white/3 hover:bg-white/6 border border-white/8 hover:border-purple-500/40 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
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
              <BiText ar={sasAr(specialty.id)?.name} en={specialty.name} />
            </h3>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">
              <BiText ar={sasAr(specialty.id)?.description} en={specialty.description} />
            </p>
            {/* Three states. A specialty with no self-scorable portfolio says so
                whether or not it is verified — a max score would be meaningless
                there. Otherwise figures appear only once the matrix behind them
                has been checked against the official source. */}
            {!isScorable(specialty.id) ? (
              <div className="flex items-center gap-1.5 text-xs text-blue-300/90">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {t(nonScorableCardKey(getVerification(specialty.id).scoringModel))}
              </div>
            ) : isVerified(specialty.id) ? (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{t("sas.selector.maxScore")} <span className="text-purple-400 font-semibold">{specialty.totalMaxScore}</span></span>
                {specialty.competitiveThreshold && (
                  <span className="text-gray-500">{t("sas.selector.threshold")} <span className="text-orange-400 font-semibold">{specialty.competitiveThreshold}</span></span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-amber-400/90">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {t("sas.selector.underReview")}
              </div>
            )}
            {specialty.msraRequired && (
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <AlertCircle className="w-3 h-3" />
                {t("sas.selector.msraRequired")}
              </div>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{t("sas.selector.noResults", { search })}</p>
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
  const { t } = useLanguage();
  const arDomain = sasAr(domain.id);
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
          <CardTitle className="text-base text-white font-semibold"><BiText ar={arDomain?.name} en={domain.name} /></CardTitle>
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
        {domain.criteria.map((criterion) => {
          const arCrit = sasAr(criterion.id);
          return (
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
                <p className="text-sm text-gray-200 font-medium mb-1"><BiText ar={arCrit?.criterion} en={criterion.criterion} /></p>
                <p className="text-xs text-gray-500 mb-3">
                  <span className="text-purple-400">{t("sas.domain.evidenceRequired")}</span>{" "}
                  <BiText ar={arCrit?.evidence} en={criterion.evidence} enClassName="block text-gray-600 mt-0.5" />
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
                          <BiText ar={arCrit?.options?.[idx]} en={opt.label} />
                        </Label>
                        <span className={`text-xs font-bold shrink-0 ${opt.score > 0 ? "text-purple-400" : "text-gray-600"}`}>
                          {t("sas.domain.points", { score: opt.score })}
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
                        {t("sas.domain.yes", { score: criterion.score })}
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
                        {t("sas.domain.no")}
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              </div>
            </div>
          </div>
          );
        })}
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
  const { t, language } = useLanguage();
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
      toast.error(t("sas.toast.signInToSave"));
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
      toast.success(t("sas.toast.saved"));
    } catch {
      toast.error(t("sas.toast.saveFailed"));
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!isAuthenticated) {
      toast.error(t("sas.toast.signInToGenerate"));
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
        language,
      });
      setSuggestions(result);
    } catch {
      toast.error(t("sas.toast.generateFailed"));
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
      toast.success(t("sas.toast.milestonesSaved", { count: result.count }));
    } catch {
      toast.error(t("sas.toast.milestonesFailed"));
    }
  };

  const priorityConfig = {
    high: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", labelKey: "sas.results.priority.high" },
    medium: { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", labelKey: "sas.results.priority.medium" },
    low: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", labelKey: "sas.results.priority.low" },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex justify-end mb-4">
        <LanguageToggle />
      </div>
      {/* Score Card */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
          <Award className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300 font-medium">{t("sas.results.badge")}</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1"><BiText ar={sasAr(specialty.id)?.name} en={specialty.name} /></h2>
        <p className="text-gray-400 text-sm">{t("sas.results.subtitle")}</p>
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
          {t(levelInfo.labelKey)}
        </div>
        {/* Three cases. A threshold comparison is only shown when the matrix is
            verified AND the specialty publishes a threshold — several rank
            applicants against interview capacity instead, so there is no bar to
            clear and claiming one would be inventing a number. */}
        {isVerified(specialty.id) && specialty.competitiveThreshold ? (
          <p className="text-sm text-gray-400 mt-4">
            {t("sas.results.thresholdLine", { specialty: specialty.shortName })}{" "}
            <span className="text-orange-400 font-semibold">{specialty.competitiveThreshold}/{maxScore}</span>
            {totalScore >= specialty.competitiveThreshold ? (
              <span className="text-emerald-400 ms-2">{t("sas.results.meetThreshold")}</span>
            ) : (
              <span className="text-red-400 ms-2">
                {t("sas.results.needMore", { points: specialty.competitiveThreshold - totalScore })}
              </span>
            )}
          </p>
        ) : isVerified(specialty.id) ? (
          <p className="text-sm text-gray-400 mt-4 max-w-lg mx-auto">
            {t("sas.results.noThreshold", { specialty: specialty.shortName })}
          </p>
        ) : (
          <p className="text-sm text-amber-300/90 mt-4 max-w-lg mx-auto">
            {t("sas.results.unverified", { specialty: specialty.shortName })}
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
              {t("sas.results.interviewHeading")}
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
                    {t("sas.results.scoreDoesNotCarry")}
                  </span>{" "}
                  {t("sas.results.usedAtShortlisting")}
                  {specialty.interviewScoring.weightedMaxScore && (
                    <>
                      {" "}{t("sas.results.offersRankedOn", { max: specialty.interviewScoring.weightedMaxScore })}
                    </>
                  )}
                </p>
                <p className="text-sm text-amber-200/85 leading-relaxed mt-2">
                  {t("sas.results.achievementsStillMatter")}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-400 leading-relaxed">
              {specialty.interviewScoring.description}
            </p>

            {specialty.interviewScoring.appointabilityCriteria && (
              <div className="mt-4">
                <p className="text-sm font-medium text-white mb-2">
                  {t("sas.results.appointableHeading")}
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
                  {t("sas.results.appointableNote")}
                </p>
              </div>
            )}

            {specialty.interviewScoring.weightedAreas && (
              <div className="mt-4">
                <p className="text-sm font-medium text-white mb-2">
                  {t("sas.results.interviewWeightedHeading")}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <tbody>
                      {specialty.interviewScoring.weightedAreas.map((a) => (
                        <tr key={a.area} className="border-b border-white/5">
                          <td className="py-1.5 pe-3 text-gray-400">{a.area}</td>
                          <td className="py-1.5 pe-3 text-gray-500 whitespace-nowrap">{a.weighting}</td>
                          <td className="py-1.5 text-end text-gray-300 whitespace-nowrap">{a.maxScore === undefined ? "—" : `/${a.maxScore}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4">
              {t("sas.results.interviewFooter")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Section Breakdown */}
      <Card className="bg-white/3 border-white/8 mb-6">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            {t("sas.results.breakdownHeading")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(sectionScores).map(([domainId, section]) => {
            const pct = Math.round((section.score / section.maxScore) * 100);
            return (
              <div key={domainId}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300"><BiText ar={sasAr(domainId)?.name} en={section.name} /></span>
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
              {t("sas.results.offersHeading")}
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
              {t("sas.results.offersFooter")}
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
              {t("sas.results.evidenceHeading")}
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
            {t("sas.results.focusHeading")}
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
                  <p className="text-sm text-gray-200 font-medium"><BiText ar={sasAr(domain.id)?.name} en={domain.name} /></p>
                  <p className="text-xs text-gray-500">
                    {t("sas.results.focusMeta", { score: domainScore, max: domain.maxScore, gap, plural: gap !== 1 ? "s" : "" })}
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
                            {t("sas.results.ourCourse")}
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
              <p className="font-semibold">{t("sas.results.maxAchieved")}</p>
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
          <h3 className="text-lg font-bold text-white mb-2">{t("sas.results.roadmapHeading")}</h3>
          <p className="text-sm text-gray-400 mb-4">
            {t("sas.results.roadmapBody", { specialty: specialty.shortName })}
          </p>
          <Button
            onClick={handleGenerateSuggestions}
            disabled={!isAuthenticated}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6"
          >
            <Sparkles className="w-4 h-4 me-2" />
            {isAuthenticated ? t("sas.results.generateRoadmap") : t("sas.results.signInToGenerate")}
          </Button>
        </div>
      ) : generateSuggestions.isPending ? (
        <div className="mb-6 bg-white/3 border border-white/8 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 font-medium">{t("sas.results.analysing")}</p>
          <p className="text-sm text-gray-500 mt-1">{t("sas.results.analysingHint")}</p>
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
                <h3 className="text-sm font-semibold text-purple-300 mb-1">{t("sas.results.aiSummaryHeading")}</h3>
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
                {savedToRoadmap ? t("sas.results.milestonesAdded") : t("sas.results.addMilestones")}
              </p>
            </div>
            {savedToRoadmap ? (
              <a href="/roadmap" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 whitespace-nowrap underline">
                {t("sas.results.viewRoadmap")}
              </a>
            ) : (
              <Button
                size="sm"
                onClick={handleSaveToRoadmap}
                disabled={saveMilestonesToRoadmap.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold whitespace-nowrap shrink-0"
              >
                {saveMilestonesToRoadmap.isPending ? t("sas.results.saving") : t("sas.results.saveToRoadmap")}
              </Button>
            )}
          </div>

          {/* Milestone Cards */}
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-400" />
              {t("sas.results.milestonesHeading")}
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
                            {t(pc.labelKey)}
                          </span>
                          <span className="text-xs text-gray-500">{milestone.timeframe}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{milestone.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{milestone.domain}</p>
                      </div>
                      <div className="text-end shrink-0">
                        <div className="text-xs text-gray-500">{t("sas.results.current")}</div>
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
                          <ExternalLink className="w-3 h-3" /> {t("sas.results.usefulResources")}
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
            ? t("sas.results.sourceVerified")
            : t("sas.results.sourceUnverified")}
        </span>
        <a
          href={specialty.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 underline"
        >
          {t("sas.results.sourceLink", { specialty: specialty.shortName })}
        </a>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSave}
          disabled={saveResult.isPending || !isAuthenticated}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
        >
          {saveResult.isPending ? t("sas.results.saving") : isAuthenticated ? t("sas.results.saveResults") : t("sas.results.signInToSave")}
        </Button>
        <Button variant="outline" onClick={onRetake} className="flex-1 border-white/15 text-gray-300 hover:bg-white/5">
          <RotateCcw className="w-4 h-4 me-2" />
          {t("sas.results.retake")}
        </Button>
        <Button variant="outline" onClick={onReset} className="flex-1 border-white/15 text-gray-300 hover:bg-white/5">
          <Stethoscope className="w-4 h-4 me-2" />
          {t("sas.results.tryAnother")}
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
  const { t } = useLanguage();
  const { note, scoringModel } = getVerification(specialty.id);

  // Several distinct situations reach this screen and conflating them would
  // mislead badly. Only under "msra-only" does the portfolio earn nothing;
  // elsewhere it carries real marks and simply is not self-scored. Telling an
  // O&G applicant their portfolio is not scored would send them away from 40 of
  // the 150 marks available to them. The wording for each case lives in the sas
  // dictionary; here we pick the right variant key.
  const VARIANT_KEY: Record<string, string> = {
    "interview-portfolio": "interviewPortfolio",
    "application-assessed": "applicationAssessed",
    "msra-only": "msraOnly",
    unknown: "unknown",
  };
  const variant = VARIANT_KEY[scoringModel] ?? "unknown";
  const copy = {
    heading: t(`sas.notPortfolioScored.${variant}.heading`, { specialty: specialty.name }),
    body: t(`sas.notPortfolioScored.${variant}.body`),
    areasLabel: t(`sas.notPortfolioScored.${variant}.areasLabel`),
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-amber-500/8 border border-amber-500/25 rounded-2xl p-8">
        <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center mb-5">
          <AlertCircle className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">{copy.heading}</h1>
        <p className="text-gray-300 leading-relaxed mb-4">{note}</p>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">{copy.body}</p>

        {/* Where the specialty ranks on an interview, showing what that
            interview marks is the closest thing to actionable guidance we can
            give in place of a score. */}
        {specialty.interviewScoring && (
          <div className="mb-6 rounded-xl border border-white/10 bg-white/3 p-4">
            <p className="text-sm font-medium text-white mb-2">{copy.areasLabel}</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              {specialty.interviewScoring.description}
            </p>
            {specialty.interviewScoring.weightedAreas && (
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs">
                  <tbody>
                    {specialty.interviewScoring.weightedAreas.map((a) => (
                      <tr key={a.area} className="border-b border-white/5">
                        <td className="py-1.5 pe-3 text-gray-400">{a.area}</td>
                        <td className="py-1.5 pe-3 text-gray-500 whitespace-nowrap">{a.weighting}</td>
                        <td className="py-1.5 text-end text-gray-300 whitespace-nowrap">{a.maxScore === undefined ? "—" : `/${a.maxScore}`}</td>
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
            {t("sas.notPortfolioScored.officialGuidance", { specialty: specialty.shortName })}
          </a>
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 border-white/15 text-gray-300 hover:bg-white/5"
          >
            {t("sas.notPortfolioScored.chooseAnother")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Assessment Flow ─────────────────────────────────────────────────────
export default function SASAssessment() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
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
              {t("sas.progress.changeSpecialty")}
            </button>
            <div className="text-center flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{selectedSpecialty.shortName}</span>
              <span className="text-xs text-gray-500">
                {t("sas.progress.domainOf", { current: currentDomainIdx + 1, total: domains.length })}
              </span>
              <LanguageToggle />
            </div>
            <div className="text-end">
              <span className="text-sm font-bold text-purple-400">{currentScore}</span>
              <span className="text-xs text-gray-500">{t("sas.progress.pts", { max: currentMax })}</span>
            </div>
          </div>
          <Progress value={overallProgress} className="h-1.5" />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{t("sas.progress.questionsAnswered", { answered: answeredCriteria, total: totalCriteria })}</span>
            <span>{t("sas.progress.percentComplete", { percent: overallProgress })}</span>
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
              {t("sas.progress.unverifiedNotice", { specialty: selectedSpecialty.shortName })}
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
              {t("sas.progress.eligibilitySummary", { specialty: selectedSpecialty.shortName })}
              <ChevronRight className="w-4 h-4 ms-auto shrink-0 transition-transform group-open:rotate-90" />
            </summary>
            <p className="mt-2 text-xs text-blue-200/70">
              {t("sas.progress.eligibilityIntro", { cycle: selectedSpecialty.eligibility.cycle })}
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
              {t("sas.progress.domainLabel", { current: currentDomainIdx + 1 })}
            </span>
            {domainComplete && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                {t("sas.progress.complete")}
              </Badge>
            )}
          </div>
          <h2 className="text-xl font-bold text-white">
            {currentDomain && <BiText ar={sasAr(currentDomain.id)?.name} en={currentDomain.name} />}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t("sas.progress.domainMeta", { max: currentDomain?.maxScore ?? 0, answered: domainAnswered, total: domainTotal })}
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
            <ChevronLeft className="w-4 h-4 me-1" />
            {t("sas.progress.previous")}
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
              {t("sas.progress.nextDomain")}
              <ChevronRight className="w-4 h-4 ms-1" />
            </Button>
          ) : (
            <Button
              onClick={() => setShowResults(true)}
              className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold"
            >
              <Award className="w-4 h-4 me-2" />
              {t("sas.progress.viewMyScore")}
            </Button>
          )}
        </div>

        {/* Login prompt for saving */}
        {!isAuthenticated && (
          <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-300">
              <a href="/login" className="underline font-semibold">{t("sas.progress.signInPrefix")}</a> {t("sas.progress.signInSuffix")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
