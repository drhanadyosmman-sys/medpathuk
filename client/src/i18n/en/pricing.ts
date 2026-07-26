export const pricing = {
  nav: {
    dashboard: "Dashboard",
    roadmap: "Roadmap",
    workspaces: "AI Workspaces",
    resources: "Resources",
    links: "Official Links",
  },

  tiers: {
    free: "Essential",
    pro: "Professional",
    premium: "Premium",
  },

  badge: "Pricing Plans",
  title: "Choose Your Career Acceleration Plan",
  subtitle:
    "A self-serve toolkit powered by AI — assessment, a personalised roadmap, and an AI assistant to guide your UK medical career. Pick the depth that suits you.",

  mostPopular: "MOST POPULAR",
  currentPlan: "Current Plan",
  upgrading: "Upgrading…",
  upgradeSuccess: "Successfully upgraded to {plan}!",
  upgradeFailed: "Upgrade failed. Please try again.",

  perMonth: "per month",
  forever: "forever",

  plans: [
    {
      name: "Essential",
      price: "£9.99",
      period: "per month",
      description:
        "Everything you need to start planning your UK medical career with AI.",
      ctaText: "Get Essential",
      features: [
        "Career roadmap (10 milestones)",
        "1 AI roadmap generation",
        "UK self-assessment & readiness score",
        "AI assistant (standard)",
        "Resources library & official links",
        "Interview preparation guides",
        "AI CV & portfolio review",
        "AI mock interview practice",
      ],
    },
    {
      name: "Professional",
      price: "£19.99",
      period: "per month",
      description:
        "A deeper roadmap, unlimited AI, and tools to strengthen your portfolio.",
      ctaText: "Upgrade to Professional",
      features: [
        "Career roadmap (15 milestones)",
        "3 AI roadmap generations",
        "UK self-assessment & readiness score",
        "AI assistant (unlimited)",
        "Resources library & official links",
        "Interview preparation guides",
        "AI CV & portfolio review",
        "AI mock interview practice",
      ],
    },
    {
      name: "Premium",
      price: "£34.99",
      period: "per month",
      description:
        "The fullest AI guidance, with priority responses and interview practice.",
      ctaText: "Upgrade to Premium",
      features: [
        "Career roadmap (20+ milestones)",
        "5 AI roadmap generations",
        "Comprehensive self-assessment",
        "AI assistant (priority & detailed)",
        "Resources library & official links",
        "Interview preparation guides",
        "AI CV & portfolio review",
        "AI mock interview practice",
      ],
    },
  ],

  faqHeading: "Frequently Asked Questions",
  faqs: [
    {
      q: "Can I cancel anytime?",
      a: "Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.",
    },
    {
      q: "How many times can I generate my roadmap?",
      a: "Essential includes 1 AI roadmap generation, Professional 3, and Premium 5. This lets you regenerate if your situation changes or to switch the plan's language, while keeping AI costs fair.",
    },
    {
      q: "Is the access code required?",
      a: "Yes, MedPath UK is currently invite-only. Each access code is linked to one email address and allows a single registration.",
    },
    {
      q: "Can I upgrade or downgrade?",
      a: "You can upgrade at any time. Downgrades take effect at the end of your current billing period.",
    },
  ],
} as const;
