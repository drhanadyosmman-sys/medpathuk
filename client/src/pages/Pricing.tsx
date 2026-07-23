import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import {
  Check, Crown, Loader2, Stethoscope, User, Zap, Star, X,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const TIER_CONFIG = {
  free: { tierKey: "free" as const, color: "bg-secondary text-secondary-foreground", icon: Zap },
  pro: { tierKey: "pro" as const, color: "bg-primary/10 text-primary", icon: Star },
  premium: { tierKey: "premium" as const, color: "bg-amber-100 text-amber-700", icon: Crown },
};

// Structural, language-independent config for each plan. Translatable text
// (name, price, description, cta, feature labels) lives in the `pricing`
// dictionary and is zipped in by index; the `included` flags and styling stay
// here because they never change between languages.
const PLAN_META = [
  {
    id: "free",
    icon: Zap,
    iconStyle: "bg-secondary text-foreground",
    borderColor: "border-border",
    highlight: false,
    ctaClass: "border border-border bg-transparent text-foreground hover:bg-secondary",
    showPeriod: false,
    included: [true, true, true, true, true, false, false, false, false, false],
  },
  {
    id: "pro",
    icon: Star,
    iconStyle: "gradient-purple text-white",
    borderColor: "border-primary",
    highlight: true,
    ctaClass: "gradient-purple text-white border-0",
    showPeriod: true,
    included: [true, true, true, true, true, true, true, true, false, false],
  },
  {
    id: "premium",
    icon: Crown,
    iconStyle: "gradient-orange text-white",
    borderColor: "border-amber-400",
    highlight: false,
    ctaClass: "gradient-orange text-white border-0",
    showPeriod: true,
    included: [true, true, true, true, true, true, true, true, true, true],
  },
];

function PageHeader({ tier }: { tier: string }) {
  const t = useT();
  const tierConfig = TIER_CONFIG[tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.free;
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
            { href: "/dashboard", label: t("pricing.nav.dashboard") },
            { href: "/roadmap", label: t("pricing.nav.roadmap") },
            { href: "/workspaces", label: t("pricing.nav.workspaces") },
            { href: "/resources", label: t("pricing.nav.resources") },
            { href: "/links", label: t("pricing.nav.links") },
          ].map(item => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">{item.label}</Button>
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Badge className={tierConfig.color}><TierIcon className="w-3 h-3 me-1" />{t(`pricing.tiers.${tierConfig.tierKey}`)}</Badge>
          <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const t = useT();
  const { dict } = useLanguage();
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const upgradeTier = trpc.subscription.upgrade.useMutation();
  const utils = trpc.useUtils();

  const tier = (user?.subscriptionTier ?? "free") as string;

  const handleUpgrade = async (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    if (planId === "free") return;
    setUpgrading(planId);
    try {
      await upgradeTier.mutateAsync({ tier: planId as "pro" | "premium" });
      utils.auth.me.invalidate();
      const planName = planId === "pro" ? t("pricing.tiers.pro") : t("pricing.tiers.premium");
      toast.success(t("pricing.upgradeSuccess", { plan: planName }));
    } catch (e: any) {
      toast.error(e.message || t("pricing.upgradeFailed"));
    } finally {
      setUpgrading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader tier={tier} />

      <div className="container py-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary mb-4">{t("pricing.badge")}</Badge>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t("pricing.title")}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PLAN_META.map((meta, planIndex) => {
            const plan = dict.pricing.plans[planIndex];
            const PlanIcon = meta.icon;
            const isCurrentPlan = tier === meta.id;
            const isLoading = upgrading === meta.id;

            return (
              <div
                key={meta.id}
                className={`bg-card border-2 rounded-2xl overflow-hidden transition-all relative ${meta.borderColor} ${meta.highlight ? "shadow-xl scale-105" : ""}`}
              >
                {meta.highlight && (
                  <div className="gradient-purple text-white text-center text-xs font-semibold py-1.5 tracking-wide">
                    {t("pricing.mostPopular")}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${meta.iconStyle} flex items-center justify-center`}>
                      <PlanIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{plan.name}</h3>
                      {isCurrentPlan && <Badge className="text-xs bg-green-100 text-green-700">{t("pricing.currentPlan")}</Badge>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    {meta.showPeriod && (
                      <span className="text-muted-foreground text-sm ms-1">/{plan.period}</span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                  <Button
                    onClick={() => handleUpgrade(meta.id)}
                    disabled={isCurrentPlan || isLoading || meta.id === "free"}
                    className={`w-full ${meta.ctaClass} ${isCurrentPlan ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 me-2 animate-spin" />{t("pricing.upgrading")}</>
                    ) : isCurrentPlan ? (
                      t("pricing.currentPlan")
                    ) : (
                      plan.ctaText
                    )}
                  </Button>
                </div>

                <div className="px-6 pb-6">
                  <div className="border-t border-border pt-4 space-y-2.5">
                    {plan.features.map((feature, i) => {
                      const included = meta.included[i];
                      return (
                        <div key={i} className="flex items-center gap-2.5">
                          {included ? (
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${included ? "text-foreground" : "text-muted-foreground/60"}`}>
                            {feature}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">{t("pricing.faqHeading")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {dict.pricing.faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="font-semibold text-foreground mb-1">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
