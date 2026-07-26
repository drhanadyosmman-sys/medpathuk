export const dashboard = {
  gate: {
    title: "Sign In to Access Dashboard",
    body: "Your personalised career dashboard awaits.",
    signIn: "Sign In",
  },

  loading: "Loading your dashboard…",

  nav: {
    dashboard: "Dashboard",
    roadmap: "Roadmap",
    sasTool: "SAS Tool",
    workspaces: "AI Workspaces",
    resources: "Resources",
    links: "Official Links",
  },

  tiers: {
    free: "Starter",
    pro: "Professional",
    premium: "Premium",
  },

  welcome: "Welcome back, {name} 👋",
  defaultName: "Doctor",
  journeyDefault: "Your UK career journey continues.",

  onboarding: {
    title: "Complete Your Assessment",
    body: "Answer a few questions to generate your personalised career roadmap.",
    cta: "Start Assessment",
  },

  roadmapCard: {
    title: "Career Roadmap Progress",
    viewAll: "View All",
    milestones: "{done} of {total} milestones completed",
    emptyBody: "No roadmap yet. Complete your assessment to generate one.",
    generate: "Generate Roadmap",
  },

  workspacesCard: {
    title: "AI Workspaces",
    all: "All Workspaces",
    items: {
      research: "Research",
      qip: "QI Projects",
      audit: "Clinical Audit",
      interview: "Interviews",
      cv: "CV & Portfolio",
      oet: "OET Prep",
    },
  },

  tasksCard: {
    title: "My Tasks",
    pending: "{count} pending",
    allDone: "All tasks completed!",
    priority: {
      high: "high",
      medium: "medium",
      low: "low",
    },
  },

  profile: {
    specialty: "Specialty",
    level: "Level",
    country: "Country",
    readiness: "Readiness Score",
  },

  subscription: {
    planSuffix: "Plan",
    freeBody: "Your access is set by the code you registered with.",
    freeCta: "Upgrade Plan",
    proBody: "Your access is set by the code you registered with.",
    proCta: "Go Premium",
    premiumBody: "You have full access to every AI feature, including mock interview practice.",
  },

  quickLinks: {
    title: "Quick Links",
    roadmap: "My Roadmap",
    sas: "SAS Assessment Tool",
    workspaces: "AI Workspaces",
    resources: "Resources Library",
    links: "Official UK Links",
  },

  signOut: "Sign Out",
} as const;
