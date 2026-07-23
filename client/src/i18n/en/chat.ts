export const chat = {
  gate: {
    title: "Sign In Required",
    body: "Sign in to access the AI Workspaces.",
    cta: "Sign In",
  },

  header: "AI Workspaces",
  backDashboard: "Dashboard",
  backWorkspaces: "Workspaces",

  chooseTitle: "Choose Your Workspace",
  chooseSubtitle: "Select a specialised AI workspace to begin your session.",
  open: "Open Workspace",
  popular: "Popular",

  inputPlaceholder: "Ask the {workspace}…",
  disclaimer:
    "Always verify current requirements with official sources before taking action.",
  errorReply: "I apologise, an error occurred. Please try again.",

  workspaces: {
    research: {
      title: "Research Workspace",
      desc: "Journal selection, manuscript writing, ICMJE authorship, Think.Check.Submit.",
    },
    qip: {
      title: "QI Project Workspace",
      desc: "PDSA cycles, NHS improvement methodology, project timelines",
    },
    audit: {
      title: "Clinical Audit Workspace",
      desc: "Audit design, standard setting, gap analysis, re-audit planning",
    },
    teaching: {
      title: "Teaching Workspace",
      desc: "Session planning, learning objectives, teaching portfolios",
    },
    presentation: {
      title: "Presentations & Conferences",
      desc: "Abstract writing, poster design, oral presentation coaching",
    },
    interview: {
      title: "Interview Preparation",
      desc: "NHS interview coaching, STAR method, mock sessions, role-specific prep",
    },
    oet: {
      title: "OET Preparation",
      desc: "All sub-tests, writing review, speaking practice, official OET resources",
    },
    cv: {
      title: "CV & Portfolio Workspace",
      desc: "Medical CV structure, portfolio mapping, role-targeted versions",
    },
    pathway: {
      title: "UK Pathway Center",
      desc: "PLAB, Royal College exams, Oriel applications, NHS Jobs guidance",
    },
    general: {
      title: "AI Career Advisor",
      desc: "General UK medical career guidance, planning, and advice",
    },
  },
} as const;
