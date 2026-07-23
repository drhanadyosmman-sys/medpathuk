export const roadmap = {
  nav: {
    dashboard: "Dashboard",
    roadmap: "Roadmap",
    workspaces: "AI Workspaces",
    resources: "Resources",
    links: "Official Links",
  },

  tiers: {
    free: "Starter",
    pro: "Professional",
    premium: "Premium",
  },

  gate: {
    title: "Sign In to View Your Roadmap",
    signIn: "Sign In",
  },

  header: {
    title: "Your Career Roadmap",
    subtitle: "Personalised milestones to achieve your UK career goals",
  },

  generate: {
    idle: "Generate Roadmap",
    generating: "Generating…",
  },

  empty: {
    title: "No Roadmap Yet",
    bodyReady: "Click the button above to generate your personalised AI roadmap.",
    bodyOnboard:
      "Complete your onboarding assessment first to generate a personalised roadmap.",
    startAssessment: "Start Assessment",
  },

  progress: {
    complete: "Complete",
    milestones: "{done} of {total} milestones completed",
    monthPlan: "{months} month plan",
  },

  filter: {
    all: "All",
  },

  // Display labels for the fixed milestone category enum. The underlying key
  // (research/audit/…) stays in English in the data; only the label shown to a
  // reader is translated.
  categories: {
    research: "Research",
    audit: "Clinical Audit",
    qip: "Quality Improvement",
    exam: "Exams",
    interview: "Interviews",
    cv: "CV & Portfolio",
    teaching: "Teaching",
    leadership: "Leadership",
    oet: "OET",
    application: "Application",
    other: "Other",
  },

  priority: {
    high: "High",
    medium: "Medium",
    low: "Low",
  },

  milestone: {
    due: "Due:",
    step: "Step {n}",
    resourceFallback: "Resource {n}",
  },

  upsell: {
    title: "Unlock Your Full Roadmap",
    body: "Upgrade to Professional or Premium for up to 20 detailed milestones with resources and 1-to-1 guidance.",
    cta: "Upgrade Now",
  },

  toast: {
    milestoneCompleted: "Milestone completed! 🎉",
    generated: "Roadmap generated successfully!",
    generateFailed: "Failed to generate roadmap",
  },
} as const;
