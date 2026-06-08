import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  GraduationCap,
  Heart,
  Lock,
  MessageSquare,
  Microscope,
  Shield,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

const WORKSPACES = [
  { icon: Microscope, title: "Research Workspace", desc: "Journal selection, manuscript writing, authorship planning following ICMJE guidelines", color: "from-purple-500 to-purple-700" },
  { icon: TrendingUp, title: "QI Project Workspace", desc: "PDSA cycles, baseline measurement, NHS improvement methodology", color: "from-blue-500 to-blue-700" },
  { icon: ClipboardList, title: "Clinical Audit Workspace", desc: "Audit design, standard setting, gap analysis, re-audit planning", color: "from-indigo-500 to-indigo-700" },
  { icon: GraduationCap, title: "Teaching Workspace", desc: "Session planning, learning objectives, teaching portfolios", color: "from-violet-500 to-violet-700" },
  { icon: Star, title: "Presentations & Conferences", desc: "Abstract writing, poster design, oral presentation coaching", color: "from-orange-500 to-orange-600" },
  { icon: MessageSquare, title: "Interview Preparation", desc: "NHS interview coaching, STAR method, mock sessions", color: "from-amber-500 to-amber-600" },
  { icon: BookOpen, title: "OET Preparation", desc: "All sub-tests, writing review, speaking practice, official resources", color: "from-green-500 to-green-700" },
  { icon: FileText, title: "CV & Portfolio Workspace", desc: "Medical CV structure, portfolio mapping, role-targeted versions", color: "from-teal-500 to-teal-700" },
  { icon: Target, title: "UK Pathway Center", desc: "PLAB, Royal College exams, Oriel applications, NHS Jobs", color: "from-rose-500 to-rose-700" },
  { icon: Brain, title: "AI Career Advisor", desc: "Personalised guidance, roadmap generation, career planning", color: "from-pink-500 to-pink-700" },
];

const PLANS = [
  {
    name: "Starter",
    price: "Access Code",
    desc: "Begin your UK career journey",
    features: ["Onboarding assessment", "Personal career roadmap", "AI workspace access", "Official resources center", "Progress tracking"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Professional",
    price: "£29.99/mo",
    desc: "Comprehensive career support",
    features: ["Everything in Starter", "Full AI workspace access", "File upload & analysis", "Interview mock sessions", "CV review & feedback", "Priority support"],
    cta: "Upgrade Now",
    highlight: true,
  },
  {
    name: "Premium",
    price: "£79.99/mo",
    desc: "1-to-1 mentoring & full support",
    features: ["Everything in Professional", "1-to-1 mentoring sessions", "Personalised journal finder", "Unlimited AI interactions", "Dedicated career advisor", "Guaranteed response time"],
    cta: "Go Premium",
    highlight: false,
  },
];

const STATS = [
  { value: "10+", label: "AI Workspaces" },
  { value: "500+", label: "Doctors Supported" },
  { value: "95%", label: "Success Rate" },
  { value: "24/7", label: "AI Availability" },
];

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 glass">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">Manas</span>
            <Badge variant="secondary" className="text-xs hidden sm:flex">by Health Care Quality School</Badge>
          </div>
          <div className="flex items-center gap-3">
            {!loading && (
              isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="sm" className="gradient-purple text-white border-0">
                    Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </a>
                  <Link href="/activate">
                    <Button size="sm" className="gradient-purple text-white border-0">
                      Activate Access
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-hero min-h-screen flex items-center pt-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-3xl" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 px-4 py-1.5 text-sm bg-white/10 text-white border-white/20 hover:bg-white/15">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Premium UK Medical Career Platform
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your UK Medical
              <span className="block text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, oklch(0.70 0.19 52), oklch(0.80 0.15 70))" }}>
                Career, Mastered.
              </span>
            </h1>

            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              A premium, access-code protected platform for healthcare professionals preparing for UK careers.
              Powered by specialised AI workspaces, official resources, and expert guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="gradient-orange text-white border-0 px-8 py-6 text-base font-semibold shadow-lg">
                    Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/activate">
                    <Button size="lg" className="gradient-orange text-white border-0 px-8 py-6 text-base font-semibold shadow-lg">
                      Activate Your Access <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <a href={getLoginUrl()}>
                    <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 px-8 py-6 text-base">
                      Sign In
                    </Button>
                  </a>
                </>
              )}
            </div>

            {/* Access code notice */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/60 text-sm">
              <Lock className="w-3.5 h-3.5" />
              Access requires an invitation code linked to your email
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center glass rounded-xl p-4">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">Your Journey to UK Practice</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A structured, assessment-driven pathway designed specifically for international medical graduates.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", icon: Lock, title: "Activate Access", desc: "Enter your unique invitation code and authorised email to unlock the platform." },
              { step: "02", icon: ClipboardList, title: "Complete Assessment", desc: "A comprehensive onboarding assessment evaluates your current portfolio and goals." },
              { step: "03", icon: Target, title: "Get Your Roadmap", desc: "AI generates a personalised career roadmap with milestones and deadlines." },
              { step: "04", icon: Zap, title: "Work in AI Spaces", desc: "Use specialised AI workspaces to build every component of your portfolio." },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="w-14 h-14 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs font-bold text-primary/40 mb-2">{item.step}</div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Workspaces */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">AI Workspaces</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">10 Specialised AI Workspaces</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Each workspace is a professional studio powered by AI, designed for a specific aspect of your UK career preparation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {WORKSPACES.map((ws) => (
              <div key={ws.title} className="workspace-card group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ws.color} flex items-center justify-center mb-3 shadow-md`}>
                  <ws.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{ws.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{ws.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Resources */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <Badge variant="secondary" className="mb-4">Official Resources</Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">Built on Trusted Sources</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Every piece of guidance is anchored to official UK medical organisations and internationally recognised standards.
              </p>
              <div className="space-y-3">
                {[
                  "GMC — General Medical Council",
                  "NHS Jobs & Oriel Applications Portal",
                  "OET Official — Occupational English Test",
                  "Think. Check. Submit. — Journal Integrity",
                  "ICMJE — Authorship Standards",
                  "UKRIO — Research Integrity Office",
                  "Royal Colleges — MRCP, MRCS, MRCGP",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="gradient-hero rounded-2xl p-8 text-white">
                <Shield className="w-12 h-12 mb-4 text-orange-400" />
                <h3 className="text-2xl font-bold mb-3">Compliance First</h3>
                <p className="text-white/70 mb-6">
                  Every section touching official processes includes trust-oriented guidance reminding users to verify current requirements with official sources.
                </p>
                <div className="space-y-2">
                  {[
                    "Evidence-based guidance only",
                    "Official links always provided",
                    "AI supports — doesn't replace — official requirements",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                      <ChevronRight className="w-4 h-4 text-orange-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Level</h2>
            <p className="text-muted-foreground text-lg">All plans require an access code. Upgrade anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border ${plan.highlight ? "gradient-purple text-white border-transparent shadow-2xl scale-105" : "bg-card border-border"}`}
              >
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-foreground"}`}>{plan.name}</h3>
                  <div className={`text-3xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-foreground"}`}>{plan.price}</div>
                  <p className={`text-sm ${plan.highlight ? "text-white/70" : "text-muted-foreground"}`}>{plan.desc}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-orange-300" : "text-primary"}`} />
                      <span className={plan.highlight ? "text-white/90" : "text-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/activate">
                  <Button
                    className={`w-full ${plan.highlight ? "bg-white text-purple-700 hover:bg-white/90" : "gradient-purple text-white border-0"}`}
                    variant={plan.highlight ? "outline" : "default"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl" />
        </div>
        <div className="container relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Begin Your UK Journey?</h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of healthcare professionals who have structured their UK career with Manas.
          </p>
          <Link href="/activate">
            <Button size="lg" className="gradient-orange text-white border-0 px-10 py-6 text-base font-semibold shadow-xl">
              Activate Your Access Code <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-white/40 text-sm mt-4">Access code required. Contact your programme coordinator to obtain one.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-purple flex items-center justify-center">
                <Stethoscope className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-foreground">Manas</span>
              <span className="text-muted-foreground text-sm">by Health Care Quality School</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/resources">Official Resources</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/activate">Activate</Link>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 Manas. This platform supports planning and preparation but does not replace official regulatory requirements.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
