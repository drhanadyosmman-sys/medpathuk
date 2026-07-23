export const links = {
  meta: {
    title: "Official UK Medical Links",
    subtitle:
      "Curated directory of {count}+ essential resources for IMGs in the UK",
    searchPlaceholder: "Search links...",
    allCategories: "All Categories",
    linksCount: "links",
    ourCourse: "Our course",
    empty: "No links found for your search.",
  },

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

  // Keyed by category id. `descs` runs in the same order as the links array for
  // that category in Links.tsx. Official organisation names and URLs live in the
  // page as data and are never translated — only these labels and descriptions.
  categories: {
    registration: {
      label: "Registration & Licensing",
      descs: [
        "Medical registration, PLAB, revalidation",
        "PLAB 1 & 2 guidance and booking",
        "English language test for healthcare",
        "Employment guidance for NHS staff",
      ],
    },
    training: {
      label: "Training & Applications",
      descs: [
        "Apply for specialty training posts",
        "Postgraduate medical education",
        "Foundation year information",
        "Career pathways and specialty info",
        "Training pathway for IMGs",
      ],
    },
    "royal-colleges": {
      label: "Royal Colleges",
      descs: [
        "MRCP exams and physician resources",
        "MRCS exams and surgical training",
        "MRCGP and GP training",
        "MRCPsych and psychiatry resources",
        "Radiology and oncology training",
        "Anaesthesia training and exams",
        "MRCPCH and paediatric training",
        "MRCOG and O&G training",
        "FRCEM and emergency medicine",
      ],
    },
    research: {
      label: "Research & Publications",
      descs: [
        "Specialty-specific research and publication courses. Run by Health Care Quality School, who operate this platform",
        "Research funding and opportunities",
        "Leading medical journal",
        "Submit case reports",
        "High-impact medical research",
        "Medical literature database",
        "Systematic reviews and evidence",
        "Research ethics approval",
      ],
    },
    quality: {
      label: "Quality Improvement",
      descs: [
        "Structured QIP training. Run by Health Care Quality School, who operate this platform",
        "Clinical audit training. Run by Health Care Quality School, who operate this platform",
        "National clinical audit programmes",
        "QI resources and tools",
        "QI methodology and training",
        "Clinical guidelines and standards",
      ],
    },
    exams: {
      label: "Exams & Study",
      descs: [
        "PLAB and specialty exam questions",
        "PLAB question bank",
        "Royal College exam preparation",
        "Official MRCP exam information",
      ],
    },
    agencies: {
      label: "Recruitment Agencies",
      descs: [
        "Official NHS job vacancies",
        "IMG specialist recruitment",
        "Medical staffing solutions",
        "Healthcare recruitment",
        "Medical locum and permanent",
        "NHS staffing agency",
        "British Medical Association jobs",
      ],
    },
    support: {
      label: "IMG Support & Wellbeing",
      descs: [
        "Doctors' union and support",
        "Mental health support for doctors",
        "IMG community and resources",
        "Health support for NHS staff",
      ],
    },
    visa: {
      label: "Visa & Immigration",
      descs: [
        "Skilled Worker Visa information",
        "All UK visa types",
        "International recruitment guidance",
      ],
    },
  },
} as const;
