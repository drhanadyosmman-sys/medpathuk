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

const TIER_CONFIG = {
  free: { label: "Starter", color: "bg-secondary text-secondary-foreground", icon: Zap },
  pro: { label: "Professional", color: "bg-primary/10 text-primary", icon: Star },
  premium: { label: "Premium", color: "bg-amber-100 text-amber-700", icon: Crown },
};

const PLANS = [
  {
    id: "free",
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Get started with essential guidance for your UK medical career.",
    icon: Zap,
    iconStyle: "bg-secondary text-foreground",
    borderColor: "border-border",
    highlight: false,
    ctaText: "Get Started Free",
    ctaClass: "border border-border bg-transparent text-foreground hover:bg-secondary",
    features: [
      { text: "Career roadmap (5 milestones)", included: true },
      { text: "Basic onboarding assessment", included: true },
      { text: "Free resources library", included: true },
      { text: "Official links directory", included: true },
      { text: "AI chat (10 messages/month)", included: true },
      { text: "Personalised AI roadmap", included: false },
      { text: "Professional resources", included: false },
      { text: "Interview preparation guides", included: false },
      { text: "1-to-1 guidance sessions", included: false },
      { text: "Personal statement review", included: false },
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: "£29.99",
    period: "per month",
    description: "Comprehensive guidance with personalised roadmap and full resource access.",
    icon: Star,
    iconStyle: "gradient-purple text-white",
    borderColor: "border-primary",
    highlight: true,
    ctaText: "Upgrade to Professional",
    ctaClass: "gradient-purple text-white border-0",
    features: [
      { text: "Career roadmap (15 milestones)", included: true },
      { text: "Advanced onboarding assessment", included: true },
      { text: "Full resources library access", included: true },
      { text: "Official links directory", included: true },
      { text: "AI chat (unlimited)", included: true },
      { text: "Personalised AI roadmap", included: true },
      { text: "Interview preparation guides", included: true },
      { text: "CV & portfolio review tips", included: true },
      { text: "1-to-1 guidance sessions", included: false },
      { text: "Personal statement review", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "£79.99",
    period: "per month",
    description: "Complete 1-to-1 support from assessment to job offer.",
    icon: Crown,
    iconStyle: "gradient-orange text-white",
    borderColor: "border-amber-400",
    highlight: false,
    ctaText: "Upgrade to Premium",
    ctaClass: "gradient-orange text-white border-0",
    features: [
      { text: "Career roadmap (20+ milestones)", included: true },
      { text: "Comprehensive onboarding assessment", included: true },
      { text: "Full resources library access", included: true },
      { text: "Official links directory", included: true },
      { text: "AI chat (unlimited + priority)", included: true },
      { text: "Personalised AI roadmap", included: true },
      { text: "Interview prep + mock sessions", included: true },
      { text: "CV & personal statement review", included: true },
      { text: "1-to-1 guidance (4 sessions/month)", included: true },
      { text: "Direct agency introductions", included: true },
    ],
  },
];

function PageHeader({ tier }: { tier: string }) {
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
            { href: "/dashboard", label: "Dashboard" },
            { href: "/roadmap", label: "Roadmap" },
            { href: "/workspaces", label: "AI Workspaces" },
            { href: "/resources", label: "Resources" },
            { href: "/links", label: "Official Links" },
          ].map(item => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">{item.label}</Button>
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Badge className={tierConfig.color}><TierIcon className="w-3 h-3 mr-1" />{tierConfig.label}</Badge>
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
      toast.success(`Successfully upgraded to ${planId === "pro" ? "Professional" : "Premium"}!`);
    } catch (e: any) {
      toast.error(e.message || "Upgrade failed. Please try again.");
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
          <Badge className="bg-primary/10 text-primary mb-4">Pricing Plans</Badge>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Choose Your Career Acceleration Plan
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Whether you're just starting out or need intensive 1-to-1 support, we have a plan to help you succeed in the UK medical system.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PLANS.map(plan => {
            const PlanIcon = plan.icon;
            const isCurrentPlan = tier === plan.id;
            const isLoading = upgrading === plan.id;

            return (
              <div
                key={plan.id}
                className={`bg-card border-2 rounded-2xl overflow-hidden transition-all relative ${plan.borderColor} ${plan.highlight ? "shadow-xl scale-105" : ""}`}
              >
                {plan.highlight && (
                  <div className="gradient-purple text-white text-center text-xs font-semibold py-1.5 tracking-wide">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${plan.iconStyle} flex items-center justify-center`}>
                      <PlanIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{plan.name}</h3>
                      {isCurrentPlan && <Badge className="text-xs bg-green-100 text-green-700">Current Plan</Badge>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    {plan.period !== "forever" && (
                      <span className="text-muted-foreground text-sm ml-1">/{plan.period}</span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan || isLoading || plan.id === "free"}
                    className={`w-full ${plan.ctaClass} ${isCurrentPlan ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Upgrading...</>
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : (
                      plan.ctaText
                    )}
                  </Button>
                </div>

                <div className="px-6 pb-6">
                  <div className="border-t border-border pt-4 space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground/60"}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.",
              },
              {
                q: "What is the 1-to-1 guidance?",
                a: "Premium members get 4 monthly sessions with a UK-trained medical career advisor who reviews your portfolio and guides your applications.",
              },
              {
                q: "Is the access code required?",
                a: "Yes, MedPath UK is currently invite-only. Each access code is linked to one email address and allows a single registration.",
              },
              {
                q: "Can I upgrade or downgrade?",
                a: "You can upgrade at any time. Downgrades take effect at the end of your current billing period.",
              },
            ].map((faq, i) => (
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
