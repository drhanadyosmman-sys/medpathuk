export const sasHistory = {
  header: {
    back: "Dashboard",
    title: "SAS Assessment History",
    newAssessment: "New Assessment",
  },

  // Competitive-level labels are hardcoded in the page; the colour and the
  // underlying level key stay in the .tsx, only the words live here.
  levels: {
    excellent: "Excellent",
    competitive: "Competitive",
    borderline: "Borderline",
    needs_improvement: "Needs Improvement",
    unknown: "Unknown",
  },

  trend: {
    noChange: "No change",
  },

  chart: {
    title: "Score Trend Over Time",
    empty: "Complete at least 2 assessments to see your score trend.",
  },

  summary: {
    heading: "By Specialty",
    // English needs the singular for exactly one; {count} stays a Western digit.
    assessmentOne: "1 assessment",
    assessmentsOther: "{count} assessments",
    latest: "Latest",
    best: "Best",
  },

  gate: {
    title: "Sign In Required",
    body: "Sign in to view your SAS assessment history and track your progress over time.",
    signIn: "Sign In",
  },

  intro: {
    badge: "Assessment History",
    title: "Your SAS Score History",
    subtitle: "Track your portfolio progress across specialties over time.",
  },

  empty: {
    title: "No Assessments Yet",
    body: "Complete your first SAS assessment to start tracking your progress.",
    cta: "Start Assessment",
  },

  stats: {
    total: "Total Assessments",
    specialties: "Specialties Tested",
    best: "Best Score",
    average: "Average Score",
  },

  list: {
    heading: "All Assessments",
  },
} as const;
