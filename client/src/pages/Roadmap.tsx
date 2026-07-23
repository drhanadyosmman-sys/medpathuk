import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  ArrowRight, BookOpen, CheckCircle2, ChevronRight, Circle,
  ClipboardList, Crown, ExternalLink, FileText, GraduationCap,
  Loader2, MessageSquare, Microscope, Stethoscope, Target,
  TrendingUp, User, Zap, Star, Calendar, Flag, Lock,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const CATEGORY_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  research: { icon: Microscope, color: "text-purple-600", bg: "bg-purple-100" },
  audit: { icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-100" },
  qip: { icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-100" },
  exam: { icon: GraduationCap, color: "text-green-600", bg: "bg-green-100" },
  interview: { icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-100" },
  cv: { icon: FileText, color: "text-teal-600", bg: "bg-teal-100" },
  teaching: { icon: BookOpen, color: "text-rose-600", bg: "bg-rose-100" },
  leadership: { icon: Crown, color: "text-orange-600", bg: "bg-orange-100" },
  oet: { icon: BookOpen, color: "text-cyan-600", bg: "bg-cyan-100" },
  application: { icon: Target, color: "text-emerald-600", bg: "bg-emerald-100" },
  other: { icon: Star, color: "text-gray-600", bg: "bg-gray-100" },
};

const TIER_CONFIG = {
  free: { color: "bg-secondary text-secondary-foreground", icon: Zap },
  pro: { color: "bg-primary/10 text-primary", icon: Star },
  premium: { color: "bg-amber-100 text-amber-700", icon: Crown },
};

function PageHeader({ tier }: { tier: string }) {
  const { t, dict } = useLanguage();
  const r = dict.roadmap;
  const tierKey = (tier in TIER_CONFIG ? tier : "free") as keyof typeof TIER_CONFIG;
  const tierConfig = TIER_CONFIG[tierKey];
  const TierIcon = tierConfig.icon;
  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <div className="container py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-foreground">MedPath UK</span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/dashboard", label: r.nav.dashboard },
            { href: "/roadmap", label: r.nav.roadmap },
            { href: "/workspaces", label: r.nav.workspaces },
            { href: "/resources", label: r.nav.resources },
            { href: "/links", label: r.nav.links },
          ].map(item => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">{item.label}</Button>
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />
          <Badge className={tierConfig.color}><TierIcon className="w-3 h-3 me-1" />{t(`roadmap.tiers.${tierKey}`)}</Badge>
          <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Roadmap() {
  const { user, isAuthenticated, loading } = useAuth();
  const { t, dict } = useLanguage();
  const r = dict.roadmap;
  const { data: roadmapData, isLoading: roadmapLoading } = trpc.roadmap.getActive.useQuery(undefined, { enabled: isAuthenticated });
  const generateRoadmap = trpc.roadmap.generate.useMutation();
  const toggleMilestone = trpc.roadmap.toggleMilestone.useMutation();
  const utils = trpc.useUtils();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [generating, setGenerating] = useState(false);

  // Milestone `category` and `priority` are fixed enums stored in English in
  // the data. Show a translated label but fall back to the raw value if a new
  // enum value ever appears that the dictionary hasn't caught up with.
  const cats = r.categories as Record<string, string>;
  const prios = r.priority as Record<string, string>;
  const catLabel = (cat: string) => (cat === "all" ? r.filter.all : cats[cat] ?? cat);
  const prioLabel = (p: string) => prios[p] ?? p;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{t("roadmap.gate.title")}</h2>
          <a href="/login"><Button className="gradient-purple text-white border-0">{t("roadmap.gate.signIn")}</Button></a>
        </div>
      </div>
    );
  }

  const tier = (user?.subscriptionTier ?? "free") as string;
  const milestones = roadmapData?.milestones ?? [];
  const completedCount = milestones.filter((m: any) => m.isCompleted).length;
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const categories: string[] = ["all", ...Array.from(new Set<string>(milestones.map((m: any) => m.category as string)))];
  const filteredMilestones = selectedCategory === "all" ? milestones : milestones.filter((m: any) => m.category === selectedCategory);

  const handleToggle = async (milestoneId: number, current: boolean) => {
    await toggleMilestone.mutateAsync({ milestoneId, isCompleted: !current });
    utils.roadmap.getActive.invalidate();
    if (!current) toast.success(t("roadmap.toast.milestoneCompleted"));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateRoadmap.mutateAsync({ assessmentId: 0 });
      utils.roadmap.getActive.invalidate();
      toast.success(t("roadmap.toast.generated"));
    } catch (e: any) {
      toast.error(e.message || t("roadmap.toast.generateFailed"));
    } finally {
      setGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-red-100 text-red-700";
    if (priority === "medium") return "bg-amber-100 text-amber-700";
    return "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader tier={tier} />

      <div className="container py-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("roadmap.header.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("roadmap.header.subtitle")}</p>
          </div>
          {!roadmapLoading && !roadmapData && user?.onboardingCompleted && (
            <Button onClick={handleGenerate} disabled={generating} className="gradient-purple text-white border-0">
              {generating ? <><Loader2 className="w-4 h-4 me-2 animate-spin" />{t("roadmap.generate.generating")}</> : <><Zap className="w-4 h-4 me-2" />{t("roadmap.generate.idle")}</>}
            </Button>
          )}
        </div>

        {roadmapLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !roadmapData ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">{t("roadmap.empty.title")}</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {user?.onboardingCompleted
                ? t("roadmap.empty.bodyReady")
                : t("roadmap.empty.bodyOnboard")}
            </p>
            {!user?.onboardingCompleted && (
              <Link href="/onboarding">
                <Button className="gradient-purple text-white border-0">
                  {t("roadmap.empty.startAssessment")} <ArrowRight className="w-4 h-4 ms-2" />
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Progress Overview */}
            <div className="gradient-hero rounded-2xl p-6 mb-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold">{roadmapData.title}</h2>
                  {roadmapData.summary && <p className="text-white/70 text-sm mt-1">{roadmapData.summary}</p>}
                </div>
                <div className="text-end">
                  <div className="text-3xl font-bold">{progress}%</div>
                  <div className="text-white/70 text-sm">{t("roadmap.progress.complete")}</div>
                </div>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-white/70">
                <span>{t("roadmap.progress.milestones", { done: completedCount, total: milestones.length })}</span>
                {roadmapData.totalDurationMonths && <span>{t("roadmap.progress.monthPlan", { months: roadmapData.totalDurationMonths })}</span>}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              {categories.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${selectedCategory === cat ? "gradient-purple text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                >
                  {catLabel(cat)}
                </button>
              ))}
            </div>

            {/* Milestones */}
            <div className="space-y-3">
              {filteredMilestones.map((milestone: any, index: number) => {
                const catConfig = CATEGORY_CONFIG[milestone.category] || CATEGORY_CONFIG.other;
                const CatIcon = catConfig.icon;
                let resources: any[] = [];
                try { resources = JSON.parse(milestone.resources ?? "[]"); } catch { resources = []; }

                return (
                  <div
                    key={milestone.id}
                    className={`bg-card border rounded-2xl p-5 transition-all ${milestone.isCompleted ? "border-green-200 bg-green-50/30" : "border-border hover:border-primary/30"}`}
                  >
                    <div className="flex items-start gap-4">
                      <button onClick={() => handleToggle(milestone.id, milestone.isCompleted)} className="mt-0.5 flex-shrink-0">
                        {milestone.isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className={`font-semibold text-foreground ${milestone.isCompleted ? "line-through text-muted-foreground" : ""}`}>
                            {milestone.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge className={`text-xs ${getPriorityColor(milestone.priority)}`}>{prioLabel(milestone.priority)}</Badge>
                            <div className={`w-7 h-7 rounded-lg ${catConfig.bg} flex items-center justify-center`}>
                              <CatIcon className={`w-3.5 h-3.5 ${catConfig.color}`} />
                            </div>
                          </div>
                        </div>

                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="capitalize font-medium">{catLabel(milestone.category)}</span>
                          {milestone.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {t("roadmap.milestone.due")} {new Date(milestone.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Flag className="w-3 h-3" />
                            {t("roadmap.milestone.step", { n: index + 1 })}
                          </span>
                        </div>

                        {resources && resources.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {resources.slice(0, 3).map((r: any, i: number) => (
                              <a key={i} href={r.url || r} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-primary hover:underline">
                                <ExternalLink className="w-3 h-3" />
                                {r.title || t("roadmap.milestone.resourceFallback", { n: i + 1 })}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {tier === "free" && (
              <div className="mt-8 gradient-hero rounded-2xl p-6 text-center text-white">
                <Lock className="w-8 h-8 mx-auto mb-3 text-white/70" />
                <h3 className="font-bold text-lg mb-2">{t("roadmap.upsell.title")}</h3>
                <p className="text-white/70 text-sm mb-4">{t("roadmap.upsell.body")}</p>
                <Link href="/pricing">
                  <Button className="gradient-orange text-white border-0">{t("roadmap.upsell.cta")}</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
