import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  Crown,
  FileText,
  GraduationCap,
  Loader2,
  MessageSquare,
  Microscope,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const TIER_CONFIG = {
  free: { color: "bg-secondary text-secondary-foreground", icon: Zap },
  pro: { color: "bg-primary/10 text-primary", icon: Star },
  premium: { color: "bg-amber-100 text-amber-700", icon: Crown },
};

const QUICK_WORKSPACES = [
  { key: "research", icon: Microscope, color: "from-purple-500 to-purple-700" },
  { key: "qip", icon: TrendingUp, color: "from-blue-500 to-blue-700" },
  { key: "audit", icon: ClipboardList, color: "from-indigo-500 to-indigo-700" },
  { key: "interview", icon: MessageSquare, color: "from-amber-500 to-amber-600" },
  { key: "cv", icon: FileText, color: "from-teal-500 to-teal-700" },
  { key: "oet", icon: BookOpen, color: "from-green-500 to-green-700" },
] as const;

function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { data: roadmapData, isLoading: roadmapLoading } = trpc.roadmap.getActive.useQuery(undefined, { enabled: isAuthenticated });
  const { data: tasks, isLoading: tasksLoading } = trpc.tasks.list.useQuery(undefined, { enabled: isAuthenticated });
  const toggleTask = trpc.tasks.toggle.useMutation();
  const utils = trpc.useUtils();
  const { t, dict } = useLanguage();
  const d = dict.dashboard;

  if (loading) return <LoadingScreen label={t("dashboard.loading")} />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{t("dashboard.gate.title")}</h2>
          <p className="text-muted-foreground mb-6">{t("dashboard.gate.body")}</p>
          <a href="/login"><Button className="gradient-purple text-white border-0">{t("dashboard.gate.signIn")}</Button></a>
        </div>
      </div>
    );
  }

  const tier = (user?.subscriptionTier ?? "free") as keyof typeof TIER_CONFIG;
  const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.free;
  const TierIcon = tierConfig.icon;
  const completedMilestones = roadmapData?.milestones?.filter((m: any) => m.isCompleted).length ?? 0;
  const totalMilestones = roadmapData?.milestones?.length ?? 0;
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  const pendingTasks = tasks?.filter((t: any) => !t.isCompleted) ?? [];

  const handleToggleTask = async (taskId: number, current: boolean) => {
    await toggleTask.mutateAsync({ taskId, isCompleted: !current });
    utils.tasks.list.invalidate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              { href: "/dashboard", label: d.nav.dashboard },
              { href: "/roadmap", label: d.nav.roadmap },
              { href: "/sas", label: d.nav.sasTool },
              { href: "/workspaces", label: d.nav.workspaces },
              { href: "/resources", label: d.nav.resources },
              { href: "/links", label: d.nav.links },
            ].map(item => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">{item.label}</Button>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageToggle className="hidden sm:inline-flex" />
            <Badge className={tierConfig.color}>
              <TierIcon className="w-3 h-3 me-1" />
              {t(`dashboard.tiers.${tier}`)}
            </Badge>
            <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {t("dashboard.welcome", { name: user?.name?.split(" ")[0] || t("dashboard.defaultName") })}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.specialty ? `${user.specialty} · ` : ""}{user?.careerLevel || t("dashboard.journeyDefault")}
          </p>
        </div>

        {/* Onboarding Banner */}
        {!user?.onboardingCompleted && (
          <div className="gradient-hero rounded-2xl p-6 mb-8 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">{t("dashboard.onboarding.title")}</h3>
              <p className="text-white/70 text-sm">{t("dashboard.onboarding.body")}</p>
            </div>
            <Link href="/onboarding">
              <Button className="gradient-orange text-white border-0 flex-shrink-0">
                {t("dashboard.onboarding.cta")} <ArrowRight className="w-4 h-4 ms-2" />
              </Button>
            </Link>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Roadmap Progress */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">{t("dashboard.roadmapCard.title")}</h2>
                <Link href="/roadmap">
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    {t("dashboard.roadmapCard.viewAll")} <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              {roadmapLoading ? (
                <div className="h-20 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : roadmapData ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{t("dashboard.roadmapCard.milestones", { done: completedMilestones, total: totalMilestones })}</span>
                    <span className="text-sm font-semibold text-primary">{progress}%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden mb-4">
                    <div className="h-full gradient-purple rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="space-y-2">
                    {roadmapData.milestones?.slice(0, 4).map((m: any) => (
                      <div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border ${m.isCompleted ? "bg-secondary/50 border-border" : "bg-background border-border"}`}>
                        {m.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm flex-1 ${m.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>{m.title}</span>
                        <Badge variant="secondary" className="text-xs capitalize">{m.category}</Badge>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm mb-4">{t("dashboard.roadmapCard.emptyBody")}</p>
                  <Link href="/onboarding">
                    <Button size="sm" className="gradient-purple text-white border-0">{t("dashboard.roadmapCard.generate")}</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* AI Workspaces Quick Access */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">{t("dashboard.workspacesCard.title")}</h2>
                <Link href="/workspaces">
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    {t("dashboard.workspacesCard.all")} <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {QUICK_WORKSPACES.map(ws => (
                  <Link key={ws.key} href="/workspaces">
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/50 transition-all cursor-pointer group">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${ws.color} flex items-center justify-center flex-shrink-0`}>
                        <ws.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{t(`dashboard.workspacesCard.items.${ws.key}`)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">{t("dashboard.tasksCard.title")}</h2>
                <Badge variant="secondary">{t("dashboard.tasksCard.pending", { count: pendingTasks.length })}</Badge>
              </div>
              {tasksLoading ? (
                <div className="h-20 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : pendingTasks.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">{t("dashboard.tasksCard.allDone")}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingTasks.slice(0, 5).map((task: any) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/30 transition-all">
                      <button
                        onClick={() => handleToggleTask(task.id, task.isCompleted)}
                        className="w-5 h-5 rounded-full border-2 border-primary/40 hover:border-primary flex-shrink-0 transition-colors"
                      />
                      <span className="text-sm text-foreground flex-1">{task.title}</span>
                      {task.dueDate && (
                        <span className="text-xs text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                      <Badge variant="secondary" className={`text-xs ${task.priority === "high" ? "bg-red-100 text-red-700" : task.priority === "medium" ? "bg-amber-100 text-amber-700" : ""}`}>
                        {t(`dashboard.tasksCard.priority.${task.priority}`)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full gradient-purple flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{user?.name || "Doctor"}</div>
                  <div className="text-sm text-muted-foreground">{user?.email}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {user?.specialty && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("dashboard.profile.specialty")}</span>
                    <span className="text-foreground font-medium">{user.specialty}</span>
                  </div>
                )}
                {user?.careerLevel && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("dashboard.profile.level")}</span>
                    <span className="text-foreground font-medium">{user.careerLevel}</span>
                  </div>
                )}
                {user?.country && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("dashboard.profile.country")}</span>
                    <span className="text-foreground font-medium">{user.country}</span>
                  </div>
                )}
                {user?.readinessScore != null && (
                  <div className="pt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">{t("dashboard.profile.readiness")}</span>
                      <span className="text-primary font-bold">{user.readinessScore}/100</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full gradient-purple rounded-full" style={{ width: `${user.readinessScore}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subscription */}
            <div className={`rounded-2xl p-6 ${tier === "premium" ? "gradient-hero text-white" : tier === "pro" ? "bg-primary/5 border border-primary/20" : "bg-card border border-border"}`}>
              <div className="flex items-center gap-2 mb-3">
                <TierIcon className={`w-5 h-5 ${tier === "premium" ? "text-orange-400" : "text-primary"}`} />
                <span className={`font-semibold ${tier === "premium" ? "text-white" : "text-foreground"}`}>{t(`dashboard.tiers.${tier}`)} {t("dashboard.subscription.planSuffix")}</span>
              </div>
              {tier === "free" && (
                <>
                  <p className="text-sm text-muted-foreground mb-4">{t("dashboard.subscription.freeBody")}</p>
                  <Link href="/pricing">
                    <Button size="sm" className="gradient-purple text-white border-0 w-full">{t("dashboard.subscription.freeCta")}</Button>
                  </Link>
                </>
              )}
              {tier === "pro" && (
                <>
                  <p className="text-sm text-muted-foreground mb-4">{t("dashboard.subscription.proBody")}</p>
                  <Link href="/pricing">
                    <Button size="sm" className="gradient-orange text-white border-0 w-full">{t("dashboard.subscription.proCta")}</Button>
                  </Link>
                </>
              )}
              {tier === "premium" && (
                <p className="text-sm text-white/70">{t("dashboard.subscription.premiumBody")}</p>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-3">{t("dashboard.quickLinks.title")}</h3>
              <div className="space-y-2">
                {[
                  { href: "/roadmap", icon: Target, label: d.quickLinks.roadmap },
                  { href: "/sas", icon: ClipboardList, label: d.quickLinks.sas },
                  { href: "/workspaces", icon: Sparkles, label: d.quickLinks.workspaces },
                  { href: "/resources", icon: BookOpen, label: d.quickLinks.resources },
                  { href: "/links", icon: GraduationCap, label: d.quickLinks.links },
                ].map(item => (
                  <Link key={item.href} href={item.href}>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-all cursor-pointer group">
                      <item.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{item.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ms-auto" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Button variant="outline" onClick={logout} className="w-full text-muted-foreground">
              {t("dashboard.signOut")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
