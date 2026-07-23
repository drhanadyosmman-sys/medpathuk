import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Crown, ExternalLink, GraduationCap,
  Globe, Heart, Search, Stethoscope, User, Zap, Star,
  Microscope, Briefcase, Shield, TrendingUp,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const TIER_CONFIG = {
  free: { label: "Starter", color: "bg-secondary text-secondary-foreground", icon: Zap },
  pro: { label: "Professional", color: "bg-primary/10 text-primary", icon: Star },
  premium: { label: "Premium", color: "bg-amber-100 text-amber-700", icon: Crown },
};

const LINK_CATEGORIES = [
  {
    id: "registration", label: "Registration & Licensing", icon: Shield, color: "from-blue-500 to-blue-700",
    links: [
      { title: "GMC – General Medical Council", url: "https://www.gmc-uk.org", desc: "Medical registration, PLAB, revalidation" },
      { title: "PLAB Information", url: "https://www.gmc-uk.org/registration-and-licensing/join-the-register/plab", desc: "PLAB 1 & 2 guidance and booking" },
      { title: "OET Official Website", url: "https://www.occupationalenglishtest.org", desc: "English language test for healthcare" },
      { title: "NHS Employers", url: "https://www.nhsemployers.org", desc: "Employment guidance for NHS staff" },
    ],
  },
  {
    id: "training", label: "Training & Applications", icon: GraduationCap, color: "from-purple-500 to-purple-700",
    links: [
      { title: "Oriel – Specialty Training Applications", url: "https://www.oriel.nhs.uk", desc: "Apply for specialty training posts" },
      { title: "Health Education England (HEE)", url: "https://www.hee.nhs.uk", desc: "Postgraduate medical education" },
      { title: "Foundation Programme", url: "https://www.foundationprogramme.nhs.uk", desc: "Foundation year information" },
      { title: "NHS Medical Careers", url: "https://www.healthcareers.nhs.uk", desc: "Career pathways and specialty info" },
      { title: "Medical Training Initiative (MTI)", url: "https://www.rcplondon.ac.uk/projects/medical-training-initiative", desc: "Training pathway for IMGs" },
    ],
  },
  {
    id: "royal-colleges", label: "Royal Colleges", icon: Crown, color: "from-amber-500 to-amber-700",
    links: [
      { title: "Royal College of Physicians (RCP)", url: "https://www.rcplondon.ac.uk", desc: "MRCP exams and physician resources" },
      { title: "Royal College of Surgeons (RCS)", url: "https://www.rcseng.ac.uk", desc: "MRCS exams and surgical training" },
      { title: "Royal College of GPs (RCGP)", url: "https://www.rcgp.org.uk", desc: "MRCGP and GP training" },
      { title: "Royal College of Psychiatrists", url: "https://www.rcpsych.ac.uk", desc: "MRCPsych and psychiatry resources" },
      { title: "Royal College of Radiologists", url: "https://www.rcr.ac.uk", desc: "Radiology and oncology training" },
      { title: "Royal College of Anaesthetists", url: "https://www.rcoa.ac.uk", desc: "Anaesthesia training and exams" },
      { title: "Royal College of Paediatrics", url: "https://www.rcpch.ac.uk", desc: "MRCPCH and paediatric training" },
      { title: "Royal College of Obstetricians", url: "https://www.rcog.org.uk", desc: "MRCOG and O&G training" },
      { title: "Royal College of Emergency Medicine", url: "https://rcem.ac.uk", desc: "FRCEM and emergency medicine" },
    ],
  },
  {
    id: "research", label: "Research & Publications", icon: Microscope, color: "from-indigo-500 to-indigo-700",
    links: [
      { title: "Research Methodology & Publication — training courses", url: "https://www.healthcarequalityschools.com/p/home", desc: "Specialty-specific research and publication courses. Run by Health Care Quality School, who operate this platform", ours: true },
      { title: "NIHR – National Institute for Health Research", url: "https://www.nihr.ac.uk", desc: "Research funding and opportunities" },
      { title: "BMJ – British Medical Journal", url: "https://www.bmj.com", desc: "Leading medical journal" },
      { title: "BMJ Case Reports", url: "https://casereports.bmj.com", desc: "Submit case reports" },
      { title: "The Lancet", url: "https://www.thelancet.com", desc: "High-impact medical research" },
      { title: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov", desc: "Medical literature database" },
      { title: "Cochrane Library", url: "https://www.cochranelibrary.com", desc: "Systematic reviews and evidence" },
      { title: "HRA – Health Research Authority", url: "https://www.hra.nhs.uk", desc: "Research ethics approval" },
    ],
  },
  {
    id: "quality", label: "Quality Improvement", icon: TrendingUp, color: "from-teal-500 to-teal-700",
    links: [
      { title: "QIP in Healthcare — training course", url: "https://www.healthcarequalityschools.com/p/quality-improvement-project-in-healthcare512244112131", desc: "Structured QIP training. Run by Health Care Quality School, who operate this platform", ours: true },
      { title: "Clinical Audit — training course", url: "https://www.healthcarequalityschools.com/p/clinical-audit-training", desc: "Clinical audit training. Run by Health Care Quality School, who operate this platform", ours: true },
      { title: "HQIP – Healthcare Quality Improvement Partnership", url: "https://www.hqip.org.uk", desc: "National clinical audit programmes" },
      { title: "NHS Improvement", url: "https://improvement.nhs.uk", desc: "QI resources and tools" },
      { title: "IHI – Institute for Healthcare Improvement", url: "https://www.ihi.org", desc: "QI methodology and training" },
      { title: "NICE Guidelines", url: "https://www.nice.org.uk", desc: "Clinical guidelines and standards" },
    ],
  },
  {
    id: "exams", label: "Exams & Study", icon: BookOpen, color: "from-green-500 to-green-700",
    links: [
      { title: "Passmedicine", url: "https://www.passmedicine.com", desc: "PLAB and specialty exam questions" },
      { title: "Plabable", url: "https://www.plabable.com", desc: "PLAB question bank" },
      { title: "OnExamination", url: "https://www.onexamination.com", desc: "Royal College exam preparation" },
      { title: "MRCP UK", url: "https://www.mrcpuk.org", desc: "Official MRCP exam information" },
    ],
  },
  {
    id: "agencies", label: "Recruitment Agencies", icon: Briefcase, color: "from-rose-500 to-rose-700",
    links: [
      { title: "NHS Jobs", url: "https://www.jobs.nhs.uk", desc: "Official NHS job vacancies" },
      { title: "BDI Resourcing", url: "https://www.bdiresourcing.com", desc: "IMG specialist recruitment" },
      { title: "Medacs Healthcare", url: "https://www.medacs.com", desc: "Medical staffing solutions" },
      { title: "Pulse Jobs", url: "https://www.pulsejobs.com", desc: "Healthcare recruitment" },
      { title: "ID Medical", url: "https://www.idmedical.co.uk", desc: "Medical locum and permanent" },
      { title: "Maxxima", url: "https://www.maxxima.com", desc: "NHS staffing agency" },
      { title: "BMA Jobs", url: "https://jobs.bma.org.uk", desc: "British Medical Association jobs" },
    ],
  },
  {
    id: "support", label: "IMG Support & Wellbeing", icon: Heart, color: "from-pink-500 to-pink-700",
    links: [
      { title: "BMA – British Medical Association", url: "https://www.bma.org.uk", desc: "Doctors' union and support" },
      { title: "Doctors in Distress", url: "https://doctors-in-distress.org.uk", desc: "Mental health support for doctors" },
      { title: "IMG Connect", url: "https://www.imgconnect.co.uk", desc: "IMG community and resources" },
      { title: "NHS Practitioner Health", url: "https://www.practitionerhealth.nhs.uk", desc: "Health support for NHS staff" },
    ],
  },
  {
    id: "visa", label: "Visa & Immigration", icon: Globe, color: "from-cyan-500 to-cyan-700",
    links: [
      { title: "UK Visas & Immigration", url: "https://www.gov.uk/skilled-worker-visa", desc: "Skilled Worker Visa information" },
      { title: "UKVI Guidance", url: "https://www.gov.uk/browse/visas-immigration", desc: "All UK visa types" },
      { title: "NHS International Recruitment", url: "https://www.nhsemployers.org/articles/international-recruitment", desc: "International recruitment guidance" },
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

export default function Links() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const tier = (user?.subscriptionTier ?? "free") as string;

  const totalLinks = LINK_CATEGORIES.reduce((a, c) => a + c.links.length, 0);

  const filteredCategories = LINK_CATEGORIES
    .filter(cat => selectedCategory === "all" || cat.id === selectedCategory)
    .map(cat => ({
      ...cat,
      links: search
        ? cat.links.filter(l =>
            l.title.toLowerCase().includes(search.toLowerCase()) ||
            l.desc.toLowerCase().includes(search.toLowerCase())
          )
        : cat.links,
    }))
    .filter(cat => cat.links.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader tier={tier} />

      <div className="container py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Official UK Medical Links</h1>
          <p className="text-muted-foreground mt-1">Curated directory of {totalLinks}+ essential resources for IMGs in the UK</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search links..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full ps-10 pe-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === "all" ? "gradient-purple text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            All Categories
          </button>
          {LINK_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id ? "gradient-purple text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Link Categories */}
        <div className="space-y-8">
          {filteredCategories.map(cat => {
            const CatIcon = cat.icon;
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                    <CatIcon className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{cat.label}</h2>
                  <Badge variant="secondary" className="text-xs">{cat.links.length} links</Badge>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cat.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-sm transition-all group"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <ExternalLink className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5 flex-wrap">
                          {link.title}
                          {/* Every other entry here is an independent or official
                              body. Our own commercial course is marked so it
                              cannot be mistaken for a neutral recommendation. */}
                          {"ours" in link && link.ours && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                              Our course
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{link.desc}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No links found for your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
