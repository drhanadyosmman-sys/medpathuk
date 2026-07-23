import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown, FileText, GraduationCap, Lock,
  Microscope, Stethoscope, TrendingUp, User, Users, Zap, Star,
  ChevronDown, ChevronUp, Target,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useT, useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

type TierLevel = "free" | "pro" | "premium";

const TIER_CONFIG: Record<TierLevel, { color: string; icon: typeof Zap }> = {
  free: { color: "bg-secondary text-secondary-foreground", icon: Zap },
  pro: { color: "bg-primary/10 text-primary", icon: Star },
  premium: { color: "bg-amber-100 text-amber-700", icon: Crown },
};

const TIER_ORDER: Record<TierLevel, number> = { free: 0, pro: 1, premium: 2 };
function canAccess(userTier: TierLevel, requiredTier: TierLevel) {
  return TIER_ORDER[userTier] >= TIER_ORDER[requiredTier];
}

// Structure only — icons, colours and tier gating stay in code. The words
// (section titles/descriptions, item titles and bodies) come from the
// `resources` dictionary, mapped by matching array order.
const RESOURCE_STRUCTURE = [
  { id: "research", icon: Microscope, color: "from-indigo-500 to-indigo-700", tiers: ["free", "pro", "pro"] as TierLevel[] },
  { id: "qip", icon: TrendingUp, color: "from-teal-500 to-teal-700", tiers: ["free", "pro"] as TierLevel[] },
  { id: "audit", icon: Target, color: "from-purple-500 to-purple-700", tiers: ["free", "pro"] as TierLevel[] },
  { id: "interviews", icon: Users, color: "from-rose-500 to-rose-700", tiers: ["free", "pro", "premium"] as TierLevel[] },
  { id: "cv", icon: FileText, color: "from-amber-500 to-amber-700", tiers: ["free", "pro"] as TierLevel[] },
  { id: "specialty", icon: GraduationCap, color: "from-green-500 to-green-700", tiers: ["free", "pro"] as TierLevel[] },
];

function PageHeader({ tier }: { tier: TierLevel }) {
  const t = useT();
  const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.free;
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
            { href: "/dashboard", label: t("resources.nav.dashboard") },
            { href: "/roadmap", label: t("resources.nav.roadmap") },
            { href: "/workspaces", label: t("resources.nav.workspaces") },
            { href: "/resources", label: t("resources.nav.resources") },
            { href: "/links", label: t("resources.nav.links") },
          ].map(item => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">{item.label}</Button>
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Badge className={tierConfig.color}><TierIcon className="w-3 h-3 me-1" />{t(`resources.tiers.${tier}`)}</Badge>
          <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Resources() {
  const { user } = useAuth();
  const t = useT();
  const { dict } = useLanguage();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const tier = (user?.subscriptionTier ?? "free") as TierLevel;

  const toggleItem = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = dict.resources.sections;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader tier={tier} />
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{t("resources.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("resources.subtitle")}</p>
        </div>

        {tier === "free" && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex items-center gap-3">
            <Star className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">{t("resources.upsell.title")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t("resources.upsell.body")}</p>
            </div>
            <Link href="/pricing" className="ms-auto">
              <Button size="sm" className="gradient-purple text-white border-0 whitespace-nowrap">{t("resources.upsell.cta")}</Button>
            </Link>
          </div>
        )}

        <div className="space-y-8">
          {RESOURCE_STRUCTURE.map((section, s) => {
            const SectionIcon = section.icon;
            const sectionText = sections[s];
            return (
              <div key={section.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                    <SectionIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{sectionText.title}</h2>
                    <p className="text-sm text-muted-foreground">{sectionText.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {section.tiers.map((minTier, i) => {
                    const key = `${section.id}-${i}`;
                    const itemText = sectionText.items[i];
                    const accessible = canAccess(tier, minTier);
                    const isExpanded = expandedItems[key];
                    return (
                      <div key={key} className={`bg-card border rounded-xl overflow-hidden transition-all ${accessible ? "border-border" : "border-border/50 opacity-75"}`}>
                        <button
                          onClick={() => accessible && toggleItem(key)}
                          className={`w-full flex items-center gap-3 p-4 text-start ${accessible ? "hover:bg-secondary/30 cursor-pointer" : "cursor-not-allowed"}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-foreground text-sm">{itemText.title}</span>
                              {minTier !== "free" && (
                                <Badge className={`text-xs ${TIER_CONFIG[minTier].color}`}>
                                  {t(`resources.tiers.${minTier}`)}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {accessible ? (
                            isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </button>
                        {accessible && isExpanded && (
                          <div className="px-4 pb-4 border-t border-border">
                            <div className="pt-4 space-y-1">
                              {itemText.content.split("\n").map((line: string, li: number) => {
                                if (line === "") return <div key={li} className="h-2" />;
                                if (line.startsWith("- ")) return <p key={li} className="text-sm text-muted-foreground ms-4">• {line.slice(2)}</p>;
                                if (line.match(/^\d+\./)) return <p key={li} className="text-sm text-foreground ms-4">{line}</p>;
                                if (line.endsWith(":")) return <p key={li} className="text-sm font-semibold text-foreground mt-3">{line}</p>;
                                return <p key={li} className="text-sm text-muted-foreground">{line}</p>;
                              })}
                            </div>
                          </div>
                        )}
                        {!accessible && (
                          <div className="px-4 pb-3">
                            <div className="flex items-center gap-2">
                              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {t("resources.locked.requires", { tier: t(`resources.tiers.${minTier}`) })}{" "}
                                <Link href="/pricing" className="text-primary hover:underline">{t("resources.locked.upgrade")}</Link>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
