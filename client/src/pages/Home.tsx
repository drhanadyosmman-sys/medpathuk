import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// ─── Pain points ──────────────────────────────────────────────────────────────
// Every figure below comes from the official recruitment criteria the assessment
// tool is built on. They are specific because vague reassurance is what
// applicants already get everywhere else.
const PAIN_POINTS = [
  {
    icon: Target,
    problem: "You build a portfolio, then find it was never scored",
    detail:
      "GP and Core Psychiatry rank applicants on the MSRA alone — no portfolio is scored at any stage. A year spent collecting evidence for either earns nothing.",
  },
  {
    icon: TrendingUp,
    problem: "More experience can score you lower, not higher",
    detail:
      "Trauma & Orthopaedics scores 10 to 42 months in the specialty at 8 points, and 60 months or more at 1. Years accumulated in non-training posts move you down the list.",
  },
  {
    icon: Clock,
    problem: "Eligibility rules out strong applicants before scoring begins",
    detail:
      "IMT changed for 2026: full GMC registration must be in place when you submit, not when you start. A CREST certificate needs a supervisor's sign-off and takes months to arrange.",
  },
  {
    icon: FileWarning,
    problem: "Evidence you cannot organise is evidence that does not count",
    detail:
      "Higher medical specialties award 2 marks for how well documents are presented, and that judgement cannot be appealed. Submitting nothing for three or more scored domains stops an application outright.",
  },
  {
    icon: Search,
    problem: "The real criteria are scattered, and some change every year",
    detail:
      "Each specialty publishes its own matrix across deanery sites, college pages and PDFs. Several are revised annually, and guidance that has quietly gone stale looks identical to guidance that has not.",
  },
  {
    icon: Compass,
    problem: "Nobody tells you when to stop building and start preparing",
    detail:
      "For IMT the self-assessment score decides who is interviewed, then stops counting — offers are ranked on the interview alone. Past a point, more evidence changes nothing.",
  },
];

// ─── What the platform does about each ────────────────────────────────────────
const ANSWERS = [
  {
    icon: ClipboardList,
    title: "Score yourself against the real criteria",
    body: "Work through the actual scoring domains for your target specialty — the same options assessors use — and see where your evidence is thin. Specialties that score no portfolio say so, instead of inventing a number.",
  },
  {
    icon: Shield,
    title: "Every figure traced to its official source",
    body: "Each specialty records which recruitment source its criteria came from and when it was last checked. Anything not yet verified shows no score at all rather than a plausible guess.",
  },
  {
    icon: Brain,
    title: "A plan built around what moves your application",
    body: "Your weakest scoring domains become a sequenced plan with deadlines — weighted by what the criteria reward, not by what is easiest to collect.",
  },
  {
    icon: MessageSquare,
    title: "Specialist support for each piece of evidence",
    body: "Separate workspaces for research and publication, quality improvement, clinical audit, teaching, CV and portfolio, interviews, OET, and the UK pathway itself.",
  },
];

// ─── How it works ─────────────────────────────────────────────────────────────
const STEPS = [
  { number: "01", title: "Tell us where you are", body: "Your stage, your target specialty, and how much time you have. Two minutes." },
  { number: "02", title: "See your score and your gaps", body: "Your portfolio measured against your specialty's published criteria, domain by domain." },
  { number: "03", title: "Get a plan in priority order", body: "What to do next, sequenced by what earns most and what takes longest to arrange." },
  { number: "04", title: "Work through it with support", body: "Specialist guidance for each piece of evidence, plus the official sources behind every requirement." },
];

const WORKSPACES = [
  { icon: Microscope, title: "Research & Publication", desc: "Journal selection, manuscript writing, authorship under ICMJE guidance" },
  { icon: TrendingUp, title: "Quality Improvement", desc: "PDSA cycles, baseline measurement, NHS improvement methodology" },
  { icon: ClipboardList, title: "Clinical Audit", desc: "Audit design, standard setting, gap analysis, closing the loop" },
  { icon: GraduationCap, title: "Teaching", desc: "Session planning, learning objectives, evidencing a teaching portfolio" },
  { icon: Star, title: "Presentations & Conferences", desc: "Abstract writing, poster design, oral presentation coaching" },
  { icon: MessageSquare, title: "Interview Preparation", desc: "NHS interview coaching, structured answers, mock sessions" },
  { icon: BookOpen, title: "OET Preparation", desc: "All sub-tests, writing review, speaking practice, official resources" },
  { icon: FileText, title: "CV & Portfolio", desc: "Medical CV structure, portfolio mapping, role-targeted versions" },
  { icon: Target, title: "UK Pathway Centre", desc: "PLAB, Royal College exams, Oriel applications, NHS Jobs, GMC" },
  { icon: Brain, title: "Career Advisor", desc: "Personalised guidance, roadmap generation, long-term planning" },
];

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    desc: "See where you stand",
    features: ["Onboarding assessment", "Self-assessment for your specialty", "Personal career roadmap", "Official resources centre", "Progress tracking"],
    cta: "Create Free Account",
    highlight: false,
  },
  {
    name: "Professional",
    price: "£29.99/mo",
    desc: "Build the evidence",
    features: ["Everything in Starter", "Full AI workspace access", "File upload & analysis", "Interview mock sessions", "CV review & feedback", "Priority support"],
    cta: "Upgrade",
    highlight: true,
  },
  {
    name: "Premium",
    price: "£79.99/mo",
    desc: "One-to-one support",
    features: ["Everything in Professional", "1-to-1 mentoring sessions", "Personalised journal finder", "Unlimited AI interactions", "Dedicated career advisor", "Guaranteed response time"],
    cta: "Go Premium",
    highlight: false,
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 glass">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">MedPath UK</span>
            <Badge variant="secondary" className="text-xs hidden sm:flex">by Healthcare Quality School</Badge>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm" className="gradient-orange text-white border-0">Dashboard</Button>
              </Link>
            ) : (
              <>
                <a href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</a>
                <a href="/register">
                  <Button size="sm" className="gradient-orange text-white border-0">Get Started</Button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-hero flex items-center pt-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="container relative z-10 py-24 lg:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-6 px-4 py-1.5 text-sm bg-white/10 text-white border-white/20 hover:bg-white/15">
              For international doctors applying to UK training
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Know exactly what your
              <span className="block text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, oklch(0.70 0.19 52), oklch(0.80 0.15 70))" }}>
                application actually scores.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/75 mb-4 leading-relaxed">
              Most doctors build a portfolio on guesswork — advice from colleagues, forum posts, whatever
              turns up in a search. Meanwhile the recruitment criteria are published, specific, and
              different for every specialty.
            </p>
            <p className="text-lg sm:text-xl text-white/75 mb-10 leading-relaxed">
              MedPath UK measures your portfolio against those criteria, shows you where the marks are,
              and tells you what to do next.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="gradient-orange text-white border-0 px-8 py-6 text-base font-semibold shadow-lg">
                    Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <a href="/register">
                    <Button size="lg" className="gradient-orange text-white border-0 px-8 py-6 text-base font-semibold shadow-lg">
                      Check my specialty free <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <a href="/login">
                    <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 px-8 py-6 text-base">
                      Sign In
                    </Button>
                  </a>
                </>
              )}
            </div>

            <p className="text-sm text-white/50">
              Free to start. No access code needed.
            </p>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mb-16">
            <Badge variant="secondary" className="mb-4">The problem</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Effort is not the same as points
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              UK specialty recruitment publishes what it rewards. The difficulty is that it rewards
              different things in every specialty, states them across dozens of separate sources, and
              revises them without announcement. These are real examples from the 2026 criteria.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAIN_POINTS.map((point) => (
              <div key={point.problem} className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                  <point.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 leading-snug">{point.problem}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The answer */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl mb-16">
            <Badge variant="secondary" className="mb-4">What we do</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              The criteria, applied to you
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We read the official recruitment guidance for each specialty, transcribe it exactly, and
              record where every figure came from. Then we measure your portfolio against it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ANSWERS.map((answer) => (
              <div key={answer.title} className="flex gap-4 p-6 rounded-2xl bg-card border border-border">
                <div className="w-11 h-11 rounded-xl gradient-purple flex items-center justify-center shrink-0">
                  <answer.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{answer.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{answer.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mb-16">
            <Badge variant="secondary" className="mb-4">How it works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">From where you are to what to do next</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div key={step.number}>
                <div className="text-4xl font-bold text-transparent bg-clip-text mb-4" style={{ backgroundImage: "linear-gradient(135deg, oklch(0.70 0.19 52), oklch(0.80 0.15 70))" }}>
                  {step.number}
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
            <Badge variant="secondary" className="mb-4">Support</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Help with each piece of evidence</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Knowing a domain is weak is the easy part. These workspaces help you actually build the
              evidence — each one specialised rather than a general assistant.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WORKSPACES.map((workspace) => (
              <div key={workspace.title} className="p-5 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <workspace.icon className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="font-medium text-foreground text-sm">{workspace.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{workspace.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">Where the criteria come from</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Official sources, and a record of which
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Scoring criteria are transcribed from NHS England specialty recruitment pages, the national
              recruitment offices that run each round, and the royal colleges. Every specialty carries the
              source it came from and the date it was checked — so you can confirm it yourself, and so
              anything that has gone out of date is visible rather than assumed.
            </p>
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
            <Badge variant="secondary" className="mb-4">Something you should know first</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              UK graduates now get priority for training posts
            </h2>

            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                The Medical Training (Prioritisation) Act became law on 5 March 2026. It gives priority
                for specialty and foundation training to UK graduates and to several other defined
                groups. If you are not in one of those groups, this changes your odds — and you should
                know that before you plan around anything on this page.
              </p>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-3">Prioritised for specialty training</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    "Graduates of UK and Republic of Ireland medical schools",
                    "Graduates of medical schools in Iceland, Liechtenstein, Norway and Switzerland",
                    "Doctors who have completed, or are completing, relevant UK training",
                    "British and Irish citizens; Commonwealth citizens with right of abode",
                    "Holders of indefinite leave to remain, or EU Settlement Scheme status",
                  ].map((group) => (
                    <li key={group} className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {group}
                    </li>
                  ))}
                </ul>
                <p className="text-sm mt-4 pt-4 border-t border-border">
                  Note the second half of that list: an international graduate who holds British
                  citizenship or indefinite leave to remain <span className="text-foreground font-medium">is</span>{" "}
                  prioritised for specialty training. Where you qualified is not the only thing that counts.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-3">When it applies</h3>
                <ul className="space-y-2 text-sm">
                  <li><span className="text-foreground font-medium">2026 recruitment</span> — priority is applied at the offer stage, because shortlisting had already begun.</li>
                  <li><span className="text-foreground font-medium">2027 onwards</span> — priority applies at both shortlisting and offer.</li>
                </ul>
              </div>

              <p>
                We are not going to tell you this makes no difference. For a doctor outside the
                prioritised groups it is a real barrier, and from 2027 it applies before your portfolio
                is even scored. What a strong portfolio still does is put you at the front of everyone
                you are compared against — and it remains what the criteria reward once you are in
                contention.
              </p>

              <p className="text-sm">
                Check your own position against the official guidance before making plans:{" "}
                <a
                  href="https://www.bma.org.uk/advice-and-support/career-progression/training/what-we-know-so-far-about-uk-graduate-prioritisation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  BMA — UK graduate prioritisation
                </a>
                . Eligibility is decided by the recruiting bodies, not by us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Start free, upgrade when you need more</h2>
            <p className="text-lg text-muted-foreground">
              The self-assessment and your roadmap are free. Paid plans add the workspaces and one-to-one support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-2xl border ${plan.highlight ? "border-primary bg-card shadow-lg scale-[1.02]" : "border-border bg-card"}`}
              >
                {plan.highlight && <Badge className="mb-4 gradient-orange text-white border-0">Most popular</Badge>}
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
                  <Button className={`w-full ${plan.highlight ? "gradient-orange text-white border-0" : ""}`} variant={plan.highlight ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </a>
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
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Find out where you actually stand</h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Pick your specialty, work through its scoring domains, and see the gaps. It takes about ten
            minutes and costs nothing.
          </p>
          <a href="/register">
            <Button size="lg" className="gradient-orange text-white border-0 px-10 py-6 text-base font-semibold shadow-xl">
              Start my self-assessment <ArrowRight className="w-5 h-5 ml-2" />
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
              <p className="text-sm text-muted-foreground leading-relaxed">
                A platform by Healthcare Quality School, helping international doctors plan and evidence a
                career in UK medicine.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground text-sm mb-3">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/sas" className="hover:text-foreground transition-colors">Self-assessment</Link></li>
                <li><Link href="/resources" className="hover:text-foreground transition-colors">Resources</Link></li>
                <li><Link href="/links" className="hover:text-foreground transition-colors">Official links</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>

            {/* Company identity and statutory registrations. These are
                registrations, not accreditations or endorsements — an ICO entry
                is a data-protection requirement and a UKPRN is a provider
                identifier. Described as what they are. */}
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-3">Healthcare Quality School</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="leading-relaxed">
                  A United States company based in Boulder, Colorado, with a branch in the United Kingdom.
                </p>
                <p className="leading-relaxed">
                  71–75 Shelton Street, Covent Garden<br />
                  London WC2H 9JQ, United Kingdom
                </p>
                <p className="leading-relaxed text-xs">
                  Registered with the Information Commissioner's Office, reference <span className="text-foreground">ZC149125</span>.<br />
                  Listed on the UK Register of Learning Providers, UKPRN <span className="text-foreground">10101333</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © 2026 Healthcare Quality School. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground max-w-xl sm:text-right">
              MedPath UK supports planning and preparation. It does not replace official regulatory
              requirements — always confirm current criteria with the recruiting body before you apply.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
