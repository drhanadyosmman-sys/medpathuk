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

const TIER_CONFIG = {
  free: { label: "Starter", color: "bg-secondary text-secondary-foreground", icon: Zap },
  pro: { label: "Professional", color: "bg-primary/10 text-primary", icon: Star },
  premium: { label: "Premium", color: "bg-amber-100 text-amber-700", icon: Crown },
};

type TierLevel = "free" | "pro" | "premium";
const TIER_ORDER: Record<TierLevel, number> = { free: 0, pro: 1, premium: 2 };
function canAccess(userTier: TierLevel, requiredTier: TierLevel) {
  return TIER_ORDER[userTier] >= TIER_ORDER[requiredTier];
}

const RESOURCES = [
  {
    id: "research", title: "Medical Research", icon: Microscope, color: "from-indigo-500 to-indigo-700",
    description: "How to conduct, publish, and present medical research in the UK",
    items: [
      {
        title: "Getting Started with Medical Research", minTier: "free" as TierLevel,
        content: "Research is a key component of a strong UK medical portfolio.\n\nTypes of Research:\n- Case Reports: Document interesting or rare clinical cases. Ideal for beginners.\n- Audit/QIP: Systematic review of clinical practice against standards.\n- Retrospective Studies: Analyse existing patient data. Requires ethics approval.\n- Systematic Reviews: Synthesise existing literature. No patient contact needed.\n\nFirst Steps:\n1. Identify a clinical question from your daily practice\n2. Search PubMed to check if it has been answered\n3. Discuss with your consultant or supervisor\n4. Apply for ethics approval if needed (HRA website)\n5. Collect data systematically\n6. Write up and submit for publication",
      },
      {
        title: "Ethics Approval & HRA Process", minTier: "pro" as TierLevel,
        content: "When do you need ethics approval?\n- Any research involving NHS patients, staff, or data\n- Studies involving identifiable patient information\n- Interventional studies\n\nHRA Process:\n1. Register on IRAS at iras.health.org.uk\n2. Complete the application form (2-4 weeks)\n3. Submit to Research Ethics Committee (REC)\n4. Await approval (usually 60 days)\n5. Register study on ISRCTN or ClinicalTrials.gov\n\nAudit vs Research:\n- Audit: Measures current practice against a standard. Usually no ethics needed.\n- Research: Generates new knowledge. Ethics approval required.\n- QIP: Implements change and measures improvement. Usually no ethics needed.",
      },
      {
        title: "Publishing Your Research", minTier: "pro" as TierLevel,
        content: "Recommended Journals for IMGs:\n- BMJ Case Reports (case reports, open access)\n- JRSM (Royal Society of Medicine)\n- Postgraduate Medical Journal\n- BMJ Open (open access, broad scope)\n- Specialty journals (e.g., Gut, Heart, BJA)\n\nWriting Tips:\n- Follow IMRAD structure: Introduction, Methods, Results, Discussion\n- Use CONSORT (RCTs), STROBE (observational), or PRISMA (systematic reviews) guidelines\n- Get a senior author to review before submission\n- Respond professionally to reviewer comments\n\nPresentation Opportunities:\n- Royal College annual meetings\n- Regional specialty conferences\n- NHS Trust audit meetings\n- Grand rounds",
      },
    ],
  },
  {
    id: "qip", title: "Quality Improvement Projects", icon: TrendingUp, color: "from-teal-500 to-teal-700",
    description: "Design and implement QIPs that strengthen your portfolio",
    items: [
      {
        title: "QIP Fundamentals", minTier: "free" as TierLevel,
        content: "A QIP is a structured effort to improve a specific aspect of healthcare delivery. It is a core requirement for specialty training applications.\n\nThe PDSA Cycle:\n- Plan: Identify the problem, set a measurable goal\n- Do: Implement the change on a small scale\n- Study: Measure the impact\n- Act: Refine and spread the improvement\n\nCommon QIP Topics:\n- Improving handover documentation\n- Reducing medication errors\n- Improving patient discharge times\n- Enhancing infection control compliance\n- Improving consent documentation",
      },
      {
        title: "Running a Successful QIP", minTier: "pro" as TierLevel,
        content: "Step-by-Step QIP Guide:\n\n1. Identify the Problem (Week 1-2)\n   - Observe a recurring issue in your department\n   - Define a SMART goal\n\n2. Baseline Measurement (Week 3-4)\n   - Collect baseline data\n   - Use simple tools (Excel, Google Forms)\n\n3. Intervention Design (Week 5-6)\n   - Design a simple, practical change\n   - Get buy-in from the team\n\n4. Implementation (Week 7-10)\n   - Run the intervention\n   - Collect data throughout\n\n5. Re-audit and Analysis (Week 11-12)\n   - Compare before and after data\n   - Calculate percentage improvement\n\n6. Present and Disseminate\n   - Present at departmental meeting\n   - Write up for portfolio\n   - Consider submitting as abstract to a conference",
      },
    ],
  },
  {
    id: "audit", title: "Clinical Audit", icon: Target, color: "from-purple-500 to-purple-700",
    description: "Conduct clinical audits that demonstrate your commitment to standards",
    items: [
      {
        title: "Clinical Audit Basics", minTier: "free" as TierLevel,
        content: "A clinical audit measures current clinical practice against an established standard such as NICE guidelines or Royal College standards.\n\nThe Audit Cycle:\n1. Select a topic and identify the standard\n2. Collect data on current practice\n3. Compare against the standard\n4. Identify gaps and implement changes\n5. Re-audit to close the loop\n\nChoosing an Audit Topic:\n- Look at NICE guidelines relevant to your specialty\n- Check Royal College standards\n- Identify areas where your department struggles\n- Ask your consultant for suggestions",
      },
      {
        title: "Audit Data Collection and Analysis", minTier: "pro" as TierLevel,
        content: "Data Collection Methods:\n- Retrospective case note review (most common)\n- Prospective data collection\n- Electronic patient record (EPR) queries\n\nSample Size:\n- Aim for at least 20-30 cases for a meaningful audit\n- Larger samples (50-100) give more reliable results\n\nAnalysis:\n- Calculate compliance rate: (compliant cases / total cases) x 100\n- Present as percentages and graphs\n- Use Excel or SPSS for analysis\n\nNational Audit Programmes:\n- NCEPOD (National Confidential Enquiry into Patient Outcome and Death)\n- NHFD (National Hip Fracture Database)\n- MINAP (Myocardial Ischaemia National Audit Project)",
      },
    ],
  },
  {
    id: "interviews", title: "Interview Preparation", icon: Users, color: "from-rose-500 to-rose-700",
    description: "Prepare for specialty training and NHS job interviews",
    items: [
      {
        title: "Types of NHS Interviews", minTier: "free" as TierLevel,
        content: "Specialty Training Interviews (Oriel):\n- Structured interviews with standardised scoring\n- Typically 2-3 stations (portfolio, clinical, situational)\n- Scored against a mark scheme\n- Competitive - national ranking determines offers\n\nCommon Interview Formats:\n- Portfolio Station: Discuss your CV, research, audits, teaching\n- Clinical Station: Clinical scenarios, management questions\n- Situational Judgement: How you handle workplace situations\n- Leadership/Management: Examples of leadership and teamwork\n\nKey Principles:\n- Use the STAR method (Situation, Task, Action, Result)\n- Prepare 5-7 strong examples from your experience\n- Know your portfolio inside out\n- Research the specialty person specification",
      },
      {
        title: "Specialty-Specific Interview Guide", minTier: "pro" as TierLevel,
        content: "Core Medical Training (CMT) Interviews:\n- Portfolio review: audit, QIP, teaching, research, presentations\n- Clinical scenarios: acute medical emergencies\n- Commitment to specialty: why medicine, career plan\n\nCore Surgical Training (CST) Interviews:\n- Portfolio: logbook, audits, courses (ALS, ATLS), research\n- Clinical: surgical emergencies, anatomy\n- Situational: teamwork, professionalism\n\nGP Training (GPST) Interviews:\n- Machine-marked written test and clinical scenarios\n- Professional dilemmas\n- Commitment to GP\n\nGeneral Tips:\n- Book a mock interview with your deanery or educational supervisor\n- Practice with colleagues using the mark scheme\n- Record yourself and review your answers\n- Dress professionally (smart formal)",
      },
      {
        title: "Mock Interview Questions and STAR Answers", minTier: "premium" as TierLevel,
        content: "Common Portfolio Questions:\n\nQ: Tell me about a piece of research you have been involved in.\nSTAR Answer Framework:\n- Situation: Describe the clinical context\n- Task: What was your role?\n- Action: What did you specifically do?\n- Result: What was the outcome/impact?\n\nQ: Describe a Quality Improvement Project you led.\n- Focus on your leadership role\n- Emphasise the PDSA cycle\n- Quantify the improvement (e.g., compliance improved from 40% to 85%)\n- Mention re-audit and sustainability\n\nQ: Give an example of a time you dealt with a difficult colleague.\n- Use a real but anonymised example\n- Focus on professional resolution\n- Show insight and learning\n\nClinical Scenario Tips:\n- Always start with: I would ensure patient safety first\n- Use ABCDE approach for acute scenarios\n- Mention escalation and senior support\n- Reference guidelines (NICE, BNF, local protocols)",
      },
    ],
  },
  {
    id: "cv", title: "CV and Portfolio Building", icon: FileText, color: "from-amber-500 to-amber-700",
    description: "Build a competitive medical CV and portfolio for UK applications",
    items: [
      {
        title: "UK Medical CV Structure", minTier: "free" as TierLevel,
        content: "Standard UK Medical CV Sections:\n\n1. Personal Details: Name, GMC number, contact details\n2. Personal Statement: 1-2 paragraphs on career goals\n3. Medical Qualifications: Primary degree, PLAB, MRCP/MRCS etc.\n4. Employment History: Current and previous posts (most recent first)\n5. Clinical Skills: Procedures, competencies, courses\n6. Research and Publications: List all publications with citations\n7. Audit and Quality Improvement: Title, role, outcome\n8. Teaching: Formal and informal teaching experience\n9. Management and Leadership: Any leadership roles\n10. Presentations: Conferences, grand rounds\n11. Prizes and Awards\n12. Professional Development: Courses, conferences attended\n13. Referees: 2-3 consultants who know your work\n\nKey Tips:\n- Keep it concise (2-4 pages for junior doctors)\n- Use bullet points for clarity\n- Quantify achievements where possible\n- Tailor to the specific post",
      },
      {
        title: "Building Your Portfolio Evidence", minTier: "pro" as TierLevel,
        content: "Portfolio Evidence by Category:\n\nResearch (aim for 1-2 publications):\n- Published papers (first author > co-author)\n- Submitted papers (note status)\n- Abstracts accepted at conferences\n- Posters presented\n\nAudit and QIP (aim for 2-3 completed cycles):\n- Full audit cycle (design, data, change, re-audit)\n- QIP with PDSA cycle\n- National audit participation\n\nTeaching (aim for regular involvement):\n- Medical student teaching\n- Peer teaching\n- BLS/ALS instructor\n- Formal teaching sessions with feedback\n\nCourses and Qualifications:\n- ALS (Advanced Life Support) - essential\n- ATLS (Advanced Trauma Life Support) - for surgical\n- APLS (Advanced Paediatric Life Support) - for paediatrics\n- MRCP/MRCS/MRCGP - specialty exams",
      },
    ],
  },
  {
    id: "specialty", title: "Choosing Your Specialty", icon: GraduationCap, color: "from-green-500 to-green-700",
    description: "Navigate specialty selection and understand training pathways",
    items: [
      {
        title: "Overview of UK Specialty Training", minTier: "free" as TierLevel,
        content: "The UK Training Pathway:\nFoundation Programme (F1-F2) -> Core Training (CT1-CT2/3) -> Specialty Training (ST3-ST8) -> Consultant/GP\n\nFor IMGs (International Medical Graduates):\nMost IMGs enter at:\n- SHO/CT1 level: After PLAB and gaining UK experience\n- Specialty Registrar (ST3+): If you have equivalent training from abroad\n\nCompetitive Specialties (harder to get into):\n- Neurosurgery, Plastic Surgery, Cardiothoracic Surgery\n- Dermatology, Ophthalmology\n- Academic Clinical Fellowships\n\nLess Competitive Specialties:\n- General Practice (GP) - largest intake\n- Psychiatry\n- Geriatrics\n- Emergency Medicine\n\nKey Factors to Consider:\n- Lifestyle (hours, on-call frequency)\n- Training length (GP = 3 years, Surgery = 6-8 years)\n- Competitiveness\n- Your clinical interests\n- Location flexibility",
      },
      {
        title: "Specialty Deep Dives", minTier: "pro" as TierLevel,
        content: "Internal Medicine (Core Medical Training):\n- Entry: CT1 via Oriel (national recruitment)\n- Exam: MRCP (Parts 1, 2, PACES)\n- Duration: 2 years core + 4-6 years specialty\n- Leads to: Cardiology, Gastro, Respiratory, Nephrology, etc.\n\nGeneral Practice:\n- Entry: GPST1 via national recruitment\n- Exam: MRCGP (AKT + CSA/RCCA)\n- Duration: 3 years\n- Lifestyle: Best work-life balance\n\nSurgery (Core Surgical Training):\n- Entry: CT1/2 via national recruitment\n- Exam: MRCS (Parts A and B)\n- Duration: 2 years core + 6 years specialty\n- Leads to: General Surgery, Orthopaedics, Urology, etc.\n\nPsychiatry:\n- Entry: CT1 via national recruitment\n- Exam: MRCPsych\n- Duration: 3 years core + 3 years specialty\n\nEmergency Medicine:\n- Entry: CT1/2 via national recruitment\n- Exam: FRCEM\n- Duration: 6 years total",
      },
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
          <Badge className={tierConfig.color}><TierIcon className="w-3 h-3 me-1" />{tierConfig.label}</Badge>
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
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const tier = (user?.subscriptionTier ?? "free") as TierLevel;

  const toggleItem = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader tier={tier} />
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Resources Library</h1>
          <p className="text-muted-foreground mt-1">Comprehensive guides for every aspect of your UK medical career</p>
        </div>

        {tier === "free" && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex items-center gap-3">
            <Star className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Unlock all resources with Professional or Premium</p>
              <p className="text-xs text-muted-foreground mt-0.5">Some guides are locked on the Starter plan.</p>
            </div>
            <Link href="/pricing" className="ms-auto">
              <Button size="sm" className="gradient-purple text-white border-0 whitespace-nowrap">Upgrade Now</Button>
            </Link>
          </div>
        )}

        <div className="space-y-8">
          {RESOURCES.map(section => {
            const SectionIcon = section.icon;
            return (
              <div key={section.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                    <SectionIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {section.items.map((item, i) => {
                    const key = `${section.id}-${i}`;
                    const accessible = canAccess(tier, item.minTier);
                    const isExpanded = expandedItems[key];
                    return (
                      <div key={key} className={`bg-card border rounded-xl overflow-hidden transition-all ${accessible ? "border-border" : "border-border/50 opacity-75"}`}>
                        <button
                          onClick={() => accessible && toggleItem(key)}
                          className={`w-full flex items-center gap-3 p-4 text-start ${accessible ? "hover:bg-secondary/30 cursor-pointer" : "cursor-not-allowed"}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-foreground text-sm">{item.title}</span>
                              {item.minTier !== "free" && (
                                <Badge className={`text-xs ${TIER_CONFIG[item.minTier].color}`}>
                                  {TIER_CONFIG[item.minTier].label}
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
                              {item.content.split("\n").map((line: string, li: number) => {
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
                                Requires {TIER_CONFIG[item.minTier].label} plan.{" "}
                                <Link href="/pricing" className="text-primary hover:underline">Upgrade</Link>
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
