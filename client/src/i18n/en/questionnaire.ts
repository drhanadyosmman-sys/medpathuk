export const questionnaire = {
  // "Step X of Y" badge in the header.
  stepBadge: "Step {current} of {total}",

  // Step titles/descriptions, indexed to match the STEPS array order.
  steps: [
    { title: "Your Background", desc: "Tell us about your current position" },
    { title: "English & Pathway", desc: "Language status and target pathway" },
    { title: "Portfolio Status", desc: "Your current academic achievements" },
    {
      title: "Exams & Qualifications",
      desc: "Examinations completed and in progress",
    },
    { title: "Goals & Timeline", desc: "What you want to achieve and when" },
  ],

  fields: {
    currentSpecialty: "Current Specialty",
    currentCareerLevel: "Current Career Level",
    countryOfOrigin: "Country of Origin",
    countryPlaceholder: "e.g. Egypt, Pakistan, Nigeria...",

    englishStatus: "English Language Status",
    oetStatus: "OET Status",
    targetPathway: "Target UK Pathway",
    targetSpecialty: "Target Specialty (if different)",

    academicPortfolio: "Academic Portfolio",
    researchPapers: "Published / submitted research papers",
    clinicalAudits: "Completed clinical audits",
    qips: "Quality Improvement Projects (QIPs)",
    presentations: "Conference presentations / posters",
    experience: "Experience",
    teaching: "Teaching experience (formal or informal)",
    leadership: "Leadership or management experience",

    examsPreparing: "Exams Currently Preparing For",
    examsPassed: "Exams Already Passed",

    primaryGoal: "Primary Goal",
    availableHours: "Available Hours/Week:",
    hoursValue: "{hours}h",
    hoursMin: "2h",
    hoursMax: "40h",
    timeline: "Timeline:",
    monthsValue: "{months} months",
    monthsMin: "3mo",
    monthsMax: "36mo",
    additionalInfo: "Anything else you'd like us to know?",
    additionalPlaceholder:
      "Any specific challenges, previous UK experience, or goals not covered above...",
  },

  buttons: {
    back: "Back",
    continue: "Continue",
    generate: "Generate My Roadmap",
    generating: "Generating Roadmap...",
  },

  toasts: {
    saved: "Assessment saved! Generating your personalised roadmap...",
    ready: "Your personalised roadmap is ready! 🎉",
    error: "An error occurred. Please try again.",
  },

  // Option labels. Keys are the EXACT English values stored in formData and
  // submitted to the API — never translate a key, only its displayed label.
  specialties: {
    "Internal Medicine": "Internal Medicine",
    Surgery: "Surgery",
    Paediatrics: "Paediatrics",
    "Obstetrics & Gynaecology": "Obstetrics & Gynaecology",
    Psychiatry: "Psychiatry",
    "Emergency Medicine": "Emergency Medicine",
    Anaesthetics: "Anaesthetics",
    Radiology: "Radiology",
    Pathology: "Pathology",
    "General Practice": "General Practice",
    Ophthalmology: "Ophthalmology",
    ENT: "ENT",
    Orthopaedics: "Orthopaedics",
    Neurology: "Neurology",
    Cardiology: "Cardiology",
    Gastroenterology: "Gastroenterology",
    Other: "Other",
  },

  careerLevels: {
    "Medical Student": "Medical Student",
    "Foundation Year 1 (FY1)": "Foundation Year 1 (FY1)",
    "Foundation Year 2 (FY2)": "Foundation Year 2 (FY2)",
    "Core Medical Training (CMT)": "Core Medical Training (CMT)",
    "Core Surgical Training (CST)": "Core Surgical Training (CST)",
    "Specialty Registrar (ST3+)": "Specialty Registrar (ST3+)",
    Consultant: "Consultant",
    Other: "Other",
  },

  pathways: {
    "Foundation Programme": "Foundation Programme",
    "Core Training": "Core Training",
    "Specialty Training (Run-through)": "Specialty Training (Run-through)",
    "Specialty Training (Uncoupled)": "Specialty Training (Uncoupled)",
    "GP Training": "GP Training",
    "Academic Clinical Fellowship": "Academic Clinical Fellowship",
    Other: "Other",
  },

  englishStatuses: {
    "Native English Speaker": "Native English Speaker",
    "OET Passed": "OET Passed",
    "IELTS Passed": "IELTS Passed",
    "Currently Preparing": "Currently Preparing",
    "Not Started Yet": "Not Started Yet",
  },

  oetStatuses: {
    "Not Applicable": "Not Applicable",
    "Not Started": "Not Started",
    "Currently Preparing": "Currently Preparing",
    "Booked Exam": "Booked Exam",
    "Passed (All Bands)": "Passed (All Bands)",
    "Passed (Some Bands)": "Passed (Some Bands)",
  },

  exams: {
    "PLAB 1": "PLAB 1",
    "PLAB 2": "PLAB 2",
    "MRCP Part 1": "MRCP Part 1",
    "MRCP Part 2 Written": "MRCP Part 2 Written",
    "MRCP PACES": "MRCP PACES",
    "MRCS Part A": "MRCS Part A",
    "MRCS Part B (OSCE)": "MRCS Part B (OSCE)",
    "MRCGP AKT": "MRCGP AKT",
    "MRCGP CSA/RCA": "MRCGP CSA/RCA",
    "FRCA Primary": "FRCA Primary",
    "FRCR Part 1": "FRCR Part 1",
    Other: "Other",
  },

  goals: {
    "Secure a Foundation Programme post": "Secure a Foundation Programme post",
    "Enter Core Training": "Enter Core Training",
    "Enter Specialty Training": "Enter Specialty Training",
    "Become a GP": "Become a GP",
    "Pursue Academic Medicine": "Pursue Academic Medicine",
    "Build a strong portfolio": "Build a strong portfolio",
    "Pass Royal College exams": "Pass Royal College exams",
    "Improve my CV for applications": "Improve my CV for applications",
  },
} as const;
