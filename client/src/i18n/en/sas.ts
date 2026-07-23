export const sas = {
  // ─── Specialty selector ──────────────────────────────────────────────────
  selector: {
    backToDashboard: "Dashboard",
    viewHistory: "View History",
    badge: "UK Specialty Self-Assessment",
    title: "Self Assessment Score Tool",
    subtitle:
      "Work through the portfolio domains for your target specialty to see where your evidence is strong and where it is thin.",
    // {count} of {total} specialties are still being checked.
    unverifiedNotice:
      "Every score here comes from that specialty's official recruitment criteria. {count} of {total} specialties are still being checked and offer no score until they are — open one to see what has been established so far.",
    priorityLabel: "Before you plan around a score:",
    // Sentence runs into the BMA link (priorityLink), then a full stop.
    priorityBody:
      "the Medical Training (Prioritisation) Act gives UK graduates and certain other groups — including British citizens and holders of indefinite leave to remain — priority for training posts. In 2026 this applies at the offer stage; from 2027 it applies at shortlisting too, before your portfolio is scored. Check where you stand with the",
    priorityLink: "BMA guidance",
    searchPlaceholder: "Search specialty...",
    maxScore: "Max score:",
    threshold: "Threshold:",
    underReview: "Scoring under review — figures not yet confirmed",
    msraRequired: "MSRA required",
    noResults: 'No specialties found matching "{search}"',
  },

  // Card wording for specialties with nothing to self-score.
  nonScorableCard: {
    interviewPortfolio: "Portfolio scored at interview — see details",
    applicationAssessed: "Scored from your application — see details",
    default: "Not scored by portfolio — see details",
  },

  // Competitive-level labels (colours stay in the .tsx).
  levels: {
    excellent: "Excellent",
    competitive: "Competitive",
    borderline: "Borderline",
    needs_improvement: "Needs Improvement",
  },

  // ─── Domain question card ────────────────────────────────────────────────
  domain: {
    evidenceRequired: "Evidence required:",
    points: "{score} pts",
    yes: "Yes — {score} pts",
    no: "No — 0 pts",
  },

  // ─── Assessment in progress ──────────────────────────────────────────────
  progress: {
    changeSpecialty: "Change Specialty",
    domainOf: "Domain {current} of {total}",
    pts: "/{max} pts",
    questionsAnswered: "{answered}/{total} questions answered",
    percentComplete: "{percent}% complete",
    unverifiedNotice:
      "These criteria are under review and have not been confirmed against {specialty} recruitment for the current cycle. Use this to reflect on your portfolio, not to judge whether you are competitive — and check the official criteria before planning around it.",
    eligibilitySummary:
      "Before you apply: {specialty} eligibility requirements",
    eligibilityIntro:
      "A strong portfolio counts for nothing if you cannot apply. These are the {cycle} entry requirements.",
    domainLabel: "Domain {current}",
    complete: "Complete",
    domainMeta: "Max {max} points · {answered}/{total} answered",
    previous: "Previous",
    nextDomain: "Next Domain",
    viewMyScore: "View My Score",
    signInPrefix: "Sign in",
    signInSuffix: "to save your assessment results to your profile",
  },

  // ─── Results view ────────────────────────────────────────────────────────
  results: {
    badge: "Assessment Complete",
    subtitle: "Self Assessment Score Results",
    thresholdLine: "Competitive threshold for {specialty}:",
    meetThreshold: "✓ You meet this threshold",
    needMore: "You need {points} more points",
    noThreshold:
      "{specialty} does not publish a pass mark. Applicants are invited to interview in order of score until capacity is filled, so the score needed changes each year. Use this to see where your evidence is thin, not as a cut-off.",
    unverified:
      "This score is a self-reflection exercise only. The scoring criteria for {specialty} have not yet been confirmed against the official recruitment source, so it does not tell you whether you would be competitive. Check the official criteria before you plan around it.",

    interviewHeading: "After shortlisting: the interview",
    scoreDoesNotCarry:
      "Your score above does not carry into your final ranking.",
    usedAtShortlisting: "It is used at shortlisting only — to win you an interview.",
    offersRankedOn:
      "Offers are ranked on the weighted interview score out of {max}, awarded on the day.",
    achievementsStillMatter:
      'Your achievements still matter after shortlisting, but as something you discuss rather than a score you carry: they are assessed at interview under "Application and achievements". So once you are comfortably shortlisted, being able to talk about the evidence you already have beats gathering more of it.',
    appointableHeading: "To be appointable you must meet all of these",
    appointableNote:
      "Failing any one of these makes an application not appointable, however strong the rest of it is.",
    interviewWeightedHeading: "How the interview is weighted",
    interviewFooter:
      "None of this is included in the score above — interviewers award these marks on the day, so it is not something you can score yourself in advance.",

    breakdownHeading: "Score Breakdown by Domain",

    offersHeading: "After the interview: how offers are made",
    offersFooter:
      "Programme details and regional information change every cycle — check the official source for the round you are applying to.",

    evidenceHeading: "Can you prove what you claimed?",

    focusHeading: "What to Focus On Next",
    focusMeta: "You scored {score}/{max} — {gap} point{plural} available",
    ourCourse: "Our course",
    maxAchieved: "Maximum score achieved!",

    roadmapHeading: "Get Your Personalised Improvement Roadmap",
    roadmapBody:
      "Our AI will analyse your weakest scoring domains and generate specific, actionable steps to strengthen your {specialty} portfolio.",
    generateRoadmap: "Generate My Roadmap",
    signInToGenerate: "Sign In to Generate Roadmap",
    analysing:
      "Analysing your portfolio and generating personalised milestones...",
    analysingHint: "This may take a few seconds",
    aiSummaryHeading: "AI Assessment Summary",
    milestonesAdded: "Milestones added to your Roadmap!",
    addMilestones:
      "Add these milestones directly to your personal Roadmap for ongoing tracking.",
    viewRoadmap: "View Roadmap →",
    saving: "Saving...",
    saveToRoadmap: "Save to Roadmap",
    milestonesHeading: "Personalised Improvement Milestones",
    priority: {
      high: "High Priority",
      medium: "Medium Priority",
      low: "Low Priority",
    },
    current: "Current",
    usefulResources: "Useful Resources",

    sourceVerified: "Scoring based on official criteria from",
    sourceUnverified: "Confirm the current criteria at",
    sourceLink: "{specialty} Recruitment",

    saveResults: "Save Results to Profile",
    signInToSave: "Sign In to Save",
    retake: "Retake Assessment",
    tryAnother: "Try Another Specialty",
  },

  // ─── Specialty with no portfolio scoring ─────────────────────────────────
  notPortfolioScored: {
    interviewPortfolio: {
      heading: "{specialty} is scored at interview, not on the form",
      body: "Your portfolio still carries real marks here — a panel assesses it on the day rather than you declaring a score on your application, so no self-assessment can predict the result. What this can do is show you which areas are marked, so you arrive with evidence for each.",
      areasLabel: "What the panel marks you on",
    },
    applicationAssessed: {
      heading: "{specialty} is scored from your application, not self-assessed",
      body: "Your portfolio carries real marks here, but assessors award them by reading your written answers rather than you selecting a category. There is no score to calculate in advance — what matters is having evidence in each scored area and describing it well in the words you are given.",
      areasLabel: "What your application is scored on",
    },
    msraOnly: {
      heading: "{specialty} is not scored by portfolio",
      body: "Because no portfolio is scored at any stage, a self-assessment cannot tell you anything useful here. Preparing for what is actually assessed is what moves your application.",
      areasLabel: "What you are assessed on instead",
    },
    unknown: {
      heading: "{specialty} — scoring still being checked",
      body: "There is no self-assessment to complete for this specialty, so no score is offered. Exactly how the rest of the process is scored has not been established against an official source, and is set out below only as far as it has been confirmed. Check the current guidance for the round you are applying to.",
      areasLabel: "What has been confirmed so far",
    },
    officialGuidance: "Official {specialty} guidance",
    chooseAnother: "Choose another specialty",
  },

  // ─── Toasts ──────────────────────────────────────────────────────────────
  toast: {
    signInToSave: "Please sign in to save your results",
    saved: "Results saved to your profile!",
    saveFailed: "Failed to save results",
    signInToGenerate: "Please sign in to generate your personalised roadmap",
    generateFailed: "Failed to generate suggestions. Please try again.",
    milestonesSaved: "{count} milestones saved to your Roadmap!",
    milestonesFailed: "Failed to save milestones to Roadmap. Please try again.",
  },
} as const;
