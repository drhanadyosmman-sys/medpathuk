import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardList,
  Clock,
  Compass,
  FileText,
  FileWarning,
  GraduationCap,
  MessageSquare,
  Microscope,
  Search,
  Shield,
  Star,
  Stethoscope,
  Target,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

// Icons stay in code — they are visual, not linguistic, so they live here and
// pair up with the translated text by position.
const PAIN_ICONS = [Target, TrendingUp, Clock, FileWarning, Search, Compass];
const ANSWER_ICONS = [ClipboardList, Shield, Brain, MessageSquare];
const WORKSPACE_ICONS = [
  Microscope, TrendingUp, ClipboardList, GraduationCap, Star,
  MessageSquare, BookOpen, FileText, Target, Brain,
];
const HERO_GRADIENT = "linear-gradient(135deg, oklch(0.70 0.19 52), oklch(0.80 0.15 70))";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { dict } = useLanguage();
  const h = dict.home;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 start-0 end-0 z-50 border-b border-white/10 glass">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">MedPath UK</span>
            <Badge variant="secondary" className="text-xs hidden sm:flex">{h.nav.by}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle className="hidden sm:inline-flex" />
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm" className="gradient-orange text-white border-0">{h.nav.dashboard}</Button>
              </Link>
            ) : (
              <>
                <a href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{h.nav.signIn}</a>
                <a href="/register">
                  <Button size="sm" className="gradient-orange text-white border-0">{h.nav.getStarted}</Button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-hero flex items-center pt-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 start-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 end-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="container relative z-10 py-24 lg:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-6 px-4 py-1.5 text-sm bg-white/10 text-white border-white/20 hover:bg-white/15">
              {h.hero.badge}
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {h.hero.titleLine1}
              <span className="block text-transparent bg-clip-text" style={{ backgroundImage: HERO_GRADIENT }}>
                {h.hero.titleLine2}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/75 mb-4 leading-relaxed">{h.hero.body1}</p>
            <p className="text-lg sm:text-xl text-white/75 mb-10 leading-relaxed">{h.hero.body2}</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="gradient-orange text-white border-0 px-8 py-6 text-base font-semibold shadow-lg">
                    {h.hero.goToDashboard} <ArrowRight className="w-5 h-5 ms-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <a href="/register">
                    <Button size="lg" className="gradient-orange text-white border-0 px-8 py-6 text-base font-semibold shadow-lg">
                      {h.hero.ctaPrimary} <ArrowRight className="w-5 h-5 ms-2" />
                    </Button>
                  </a>
                  <a href="/login">
                    <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 px-8 py-6 text-base">
                      {h.hero.ctaSignIn}
                    </Button>
                  </a>
                </>
              )}
            </div>

            <p className="text-sm text-white/50">{h.hero.note}</p>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mb-16">
            <Badge variant="secondary" className="mb-4">{h.problem.badge}</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{h.problem.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{h.problem.body}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {h.problem.pains.map((point, i) => {
              const Icon = PAIN_ICONS[i];
              return (
                <div key={point.problem} className="p-6 rounded-2xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 leading-snug">{point.problem}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The answer */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl mb-16">
            <Badge variant="secondary" className="mb-4">{h.answer.badge}</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{h.answer.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{h.answer.body}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {h.answer.items.map((answer, i) => {
              const Icon = ANSWER_ICONS[i];
              return (
                <div key={answer.title} className="flex gap-4 p-6 rounded-2xl bg-card border border-border">
                  <div className="w-11 h-11 rounded-xl gradient-purple flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{answer.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{answer.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mb-16">
            <Badge variant="secondary" className="mb-4">{h.steps.badge}</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{h.steps.title}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {h.steps.items.map((step, i) => (
              <div key={step.title}>
                <div className="text-4xl font-bold text-transparent bg-clip-text mb-4 force-ltr" style={{ backgroundImage: HERO_GRADIENT }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workspaces */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl mb-16">
            <Badge variant="secondary" className="mb-4">{h.workspaces.badge}</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{h.workspaces.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{h.workspaces.body}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {h.workspaces.items.map((workspace, i) => {
              const Icon = WORKSPACE_ICONS[i];
              return (
                <div key={workspace.title} className="p-5 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-primary shrink-0" />
                    <h3 className="font-medium text-foreground text-sm">{workspace.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{workspace.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">{h.sources.badge}</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">{h.sources.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">{h.sources.body}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["NHS England", "Oriel", "GMC", "Royal Colleges", "Deanery recruitment offices", "NICE"].map((source) => (
                <span key={source} className="px-4 py-2 rounded-full bg-secondary text-sm text-secondary-foreground">
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* UK graduate prioritisation — stated plainly, because a doctor deciding
          where to spend the next two years needs it before they decide, not
          after. Omitting it would make everything else on this page misleading. */}
      <section className="py-24 bg-background border-y border-border">
        <div className="container">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">{h.priority.badge}</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">{h.priority.title}</h2>

            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p className="text-lg">{h.priority.intro}</p>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-3">{h.priority.listHeading}</h3>
                <ul className="space-y-2 text-sm">
                  {h.priority.groups.map((group) => (
                    <li key={group} className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {group}
                    </li>
                  ))}
                </ul>
                <p className="text-sm mt-4 pt-4 border-t border-border">
                  {h.priority.listNoteBefore}
                  <span className="text-foreground font-medium">{h.priority.listNoteEmphasis}</span>
                  {h.priority.listNoteAfter}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-3">{h.priority.whenHeading}</h3>
                <ul className="space-y-2 text-sm">
                  <li><span className="text-foreground font-medium">{h.priority.when2026Label}</span>{h.priority.when2026}</li>
                  <li><span className="text-foreground font-medium">{h.priority.when2027Label}</span>{h.priority.when2027}</li>
                </ul>
              </div>

              <p>{h.priority.honest}</p>

              <p className="text-sm">
                {h.priority.checkBefore}
                <a
                  href="https://www.bma.org.uk/advice-and-support/career-progression/training/what-we-know-so-far-about-uk-graduate-prioritisation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {h.priority.bmaLink}
                </a>
                {h.priority.decidedBy}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">{h.pricing.badge}</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{h.pricing.title}</h2>
            <p className="text-lg text-muted-foreground">{h.pricing.body}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {h.pricing.plans.map((plan, i) => {
              const highlight = i === 1;
              return (
                <div
                  key={plan.name}
                  className={`p-8 rounded-2xl border ${highlight ? "border-primary bg-card shadow-lg scale-[1.02]" : "border-border bg-card"}`}
                >
                  {highlight && <Badge className="mb-4 gradient-orange text-white border-0">{h.pricing.mostPopular}</Badge>}
                  <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                  <div className="text-3xl font-bold text-foreground mb-6">{plan.price}</div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a href="/register" className="block">
                    <Button className={`w-full ${highlight ? "gradient-orange text-white border-0" : ""}`} variant={highlight ? "default" : "outline"}>
                      {plan.cta}
                    </Button>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 start-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute top-1/2 end-1/4 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl" />
        </div>
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{h.cta.title}</h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">{h.cta.body}</p>
          <a href="/register">
            <Button size="lg" className="gradient-orange text-white border-0 px-10 py-6 text-base font-semibold shadow-xl">
              {h.cta.button} <ArrowRight className="w-5 h-5 ms-2" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-14">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg gradient-purple flex items-center justify-center">
                  <Stethoscope className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-foreground">MedPath UK</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{h.footer.tagline}</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-sm mb-3">{h.footer.platformHeading}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/sas" className="hover:text-foreground transition-colors">{h.footer.selfAssessment}</Link></li>
                <li><Link href="/resources" className="hover:text-foreground transition-colors">{h.footer.resources}</Link></li>
                <li><Link href="/links" className="hover:text-foreground transition-colors">{h.footer.officialLinks}</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">{h.footer.pricing}</Link></li>
              </ul>
            </div>

            {/* Company identity and statutory registrations. These are
                registrations, not accreditations or endorsements — an ICO entry
                is a data-protection requirement and a UKPRN is a provider
                identifier. Described as what they are. */}
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-3">{h.footer.companyHeading}</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="leading-relaxed">{h.footer.companyBody}</p>
                <p className="leading-relaxed" dir="ltr">
                  {h.footer.address1}<br />
                  {h.footer.address2}
                </p>
                <p className="leading-relaxed text-xs">
                  {h.footer.ico}<span className="text-foreground">ZC149125</span>.<br />
                  {h.footer.ukprn}<span className="text-foreground">10101333</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">{h.footer.copyright}</p>
            <p className="text-xs text-muted-foreground max-w-xl sm:text-end">{h.footer.disclaimer}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
