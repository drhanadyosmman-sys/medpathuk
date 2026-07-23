export const admin = {
  badge: "Admin",

  nav: {
    dashboard: "Dashboard",
    roadmap: "Roadmap",
    workspaces: "AI Workspaces",
  },

  denied: {
    title: "Access Denied",
    body: "You don't have permission to view this page.",
    cta: "Go to Dashboard",
  },

  title: "Admin Dashboard",
  subtitle: "Manage users, access codes, and platform settings",

  stats: {
    totalUsers: "Total Users",
    activeCodes: "Active Codes",
    usedCodes: "Used Codes",
    premiumUsers: "Premium Users",
  },

  generate: {
    title: "Generate Access Code",
    email: "Email Address *",
    tier: "Subscription Tier",
    tierFree: "Starter (Free)",
    tierPro: "Professional (£29.99/mo)",
    tierPremium: "Premium (£79.99/mo)",
    expiry: "Expires in (days, optional)",
    expiryPlaceholder: "e.g. 30",
    notes: "Notes (optional)",
    notesPlaceholder: "e.g. Referred by Dr. Ahmed",
    generating: "Generating…",
    submit: "Generate & Copy Code",
  },

  codes: {
    title: "Access Codes",
    empty: "No access codes yet.",
    used: "Used",
  },

  users: {
    title: "Registered Users",
    empty: "No users registered yet.",
    columns: ["Name", "Email", "Specialty", "Tier", "Role", "Joined"],
  },

  toast: {
    copied: "Code copied to clipboard!",
    emailRequired: "Please enter an email address.",
    generated: "Access code generated: {code}",
    failed: "Failed to generate code.",
  },
} as const;
