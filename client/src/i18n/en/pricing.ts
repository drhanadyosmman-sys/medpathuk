export const pricing = {
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

  badge: "Pricing Plans",
  title: "Choose Your Career Acceleration Plan",
  subtitle:
    "Whether you're just starting out or need intensive 1-to-1 support, we have a plan to help you succeed in the UK medical system.",

  mostPopular: "MOST POPULAR",
  currentPlan: "Current Plan",
  upgrading: "Upgrading…",
  upgradeSuccess: "Successfully upgraded to {plan}!",
  upgradeFailed: "Upgrade failed. Please try again.",

  perMonth: "per month",
  forever: "forever",

  plans: [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description:
        "Get started with essential guidance for your UK medical career.",
      ctaText: "Get Started Free",
      features: [
        "Career roadmap (5 milestones)",
        "Basic onboarding assessment",
        "Free resources library",
        "Official links directory",
        "AI chat (10 messages/month)",
        "Personalised AI roadmap",
        "Professional resources",
        "Interview preparation guides",
        "1-to-1 guidance sessions",
        "Personal statement review",
      ],
    },
    {
      name: "Professional",
      price: "£29.99",
      period: "per month",
      description:
        "Comprehensive guidance with personalised roadmap and full resource access.",
      ctaText: "Upgrade to Professional",
      features: [
        "Career roadmap (15 milestones)",
        "Advanced onboarding assessment",
        "Full resources library access",
        "Official links directory",
        "AI chat (unlimited)",
        "Personalised AI roadmap",
        "Interview preparation guides",
        "CV & portfolio review tips",
        "1-to-1 guidance sessions",
        "Personal statement review",
      ],
    },
    {
      name: "Premium",
      price: "£79.99",
      period: "per month",
      description: "Complete 1-to-1 support from assessment to job offer.",
      ctaText: "Upgrade to Premium",
      features: [
        "Career roadmap (20+ milestones)",
        "Comprehensive onboarding assessment",
        "Full resources library access",
        "Official links directory",
        "AI chat (unlimited + priority)",
        "Personalised AI roadmap",
        "Interview prep + mock sessions",
        "CV & personal statement review",
        "1-to-1 guidance (4 sessions/month)",
        "Direct agency introductions",
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
      q: "What is the 1-to-1 guidance?",
      a: "Premium members get 4 monthly sessions with a UK-trained medical career advisor who reviews your portfolio and guides your applications.",
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
