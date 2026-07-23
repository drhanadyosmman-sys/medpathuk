export const resources = {
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

  title: "Resources Library",
  subtitle: "Comprehensive guides for every aspect of your UK medical career",

  upsell: {
    title: "Unlock all resources with Professional or Premium",
    body: "Some guides are locked on the Starter plan.",
    cta: "Upgrade Now",
  },

  locked: {
    // {tier} is filled from the tiers map above (e.g. "Professional").
    requires: "Requires {tier} plan.",
    upgrade: "Upgrade",
  },

  // Mirrors the structural RESOURCES array in Resources.tsx, in the same order.
  // Icons, colours and tier gating stay in the .tsx; only the words live here.
  sections: [
    {
      title: "Medical Research",
      description: "How to conduct, publish, and present medical research in the UK",
      items: [
        {
          title: "Getting Started with Medical Research",
          content: "Research is a key component of a strong UK medical portfolio.\n\nTypes of Research:\n- Case Reports: Document interesting or rare clinical cases. Ideal for beginners.\n- Audit/QIP: Systematic review of clinical practice against standards.\n- Retrospective Studies: Analyse existing patient data. Requires ethics approval.\n- Systematic Reviews: Synthesise existing literature. No patient contact needed.\n\nFirst Steps:\n1. Identify a clinical question from your daily practice\n2. Search PubMed to check if it has been answered\n3. Discuss with your consultant or supervisor\n4. Apply for ethics approval if needed (HRA website)\n5. Collect data systematically\n6. Write up and submit for publication",
        },
        {
          title: "Ethics Approval & HRA Process",
          content: "When do you need ethics approval?\n- Any research involving NHS patients, staff, or data\n- Studies involving identifiable patient information\n- Interventional studies\n\nHRA Process:\n1. Register on IRAS at iras.health.org.uk\n2. Complete the application form (2-4 weeks)\n3. Submit to Research Ethics Committee (REC)\n4. Await approval (usually 60 days)\n5. Register study on ISRCTN or ClinicalTrials.gov\n\nAudit vs Research:\n- Audit: Measures current practice against a standard. Usually no ethics needed.\n- Research: Generates new knowledge. Ethics approval required.\n- QIP: Implements change and measures improvement. Usually no ethics needed.",
        },
        {
          title: "Publishing Your Research",
          content: "Recommended Journals for IMGs:\n- BMJ Case Reports (case reports, open access)\n- JRSM (Royal Society of Medicine)\n- Postgraduate Medical Journal\n- BMJ Open (open access, broad scope)\n- Specialty journals (e.g., Gut, Heart, BJA)\n\nWriting Tips:\n- Follow IMRAD structure: Introduction, Methods, Results, Discussion\n- Use CONSORT (RCTs), STROBE (observational), or PRISMA (systematic reviews) guidelines\n- Get a senior author to review before submission\n- Respond professionally to reviewer comments\n\nPresentation Opportunities:\n- Royal College annual meetings\n- Regional specialty conferences\n- NHS Trust audit meetings\n- Grand rounds",
        },
      ],
    },
    {
      title: "Quality Improvement Projects",
      description: "Design and implement QIPs that strengthen your portfolio",
      items: [
        {
          title: "QIP Fundamentals",
          content: "A QIP is a structured effort to improve a specific aspect of healthcare delivery. It is a core requirement for specialty training applications.\n\nThe PDSA Cycle:\n- Plan: Identify the problem, set a measurable goal\n- Do: Implement the change on a small scale\n- Study: Measure the impact\n- Act: Refine and spread the improvement\n\nCommon QIP Topics:\n- Improving handover documentation\n- Reducing medication errors\n- Improving patient discharge times\n- Enhancing infection control compliance\n- Improving consent documentation",
        },
        {
          title: "Running a Successful QIP",
          content: "Step-by-Step QIP Guide:\n\n1. Identify the Problem (Week 1-2)\n   - Observe a recurring issue in your department\n   - Define a SMART goal\n\n2. Baseline Measurement (Week 3-4)\n   - Collect baseline data\n   - Use simple tools (Excel, Google Forms)\n\n3. Intervention Design (Week 5-6)\n   - Design a simple, practical change\n   - Get buy-in from the team\n\n4. Implementation (Week 7-10)\n   - Run the intervention\n   - Collect data throughout\n\n5. Re-audit and Analysis (Week 11-12)\n   - Compare before and after data\n   - Calculate percentage improvement\n\n6. Present and Disseminate\n   - Present at departmental meeting\n   - Write up for portfolio\n   - Consider submitting as abstract to a conference",
        },
      ],
    },
    {
      title: "Clinical Audit",
      description: "Conduct clinical audits that demonstrate your commitment to standards",
      items: [
        {
          title: "Clinical Audit Basics",
          content: "A clinical audit measures current clinical practice against an established standard such as NICE guidelines or Royal College standards.\n\nThe Audit Cycle:\n1. Select a topic and identify the standard\n2. Collect data on current practice\n3. Compare against the standard\n4. Identify gaps and implement changes\n5. Re-audit to close the loop\n\nChoosing an Audit Topic:\n- Look at NICE guidelines relevant to your specialty\n- Check Royal College standards\n- Identify areas where your department struggles\n- Ask your consultant for suggestions",
        },
        {
          title: "Audit Data Collection and Analysis",
          content: "Data Collection Methods:\n- Retrospective case note review (most common)\n- Prospective data collection\n- Electronic patient record (EPR) queries\n\nSample Size:\n- Aim for at least 20-30 cases for a meaningful audit\n- Larger samples (50-100) give more reliable results\n\nAnalysis:\n- Calculate compliance rate: (compliant cases / total cases) x 100\n- Present as percentages and graphs\n- Use Excel or SPSS for analysis\n\nNational Audit Programmes:\n- NCEPOD (National Confidential Enquiry into Patient Outcome and Death)\n- NHFD (National Hip Fracture Database)\n- MINAP (Myocardial Ischaemia National Audit Project)",
        },
      ],
    },
    {
      title: "Interview Preparation",
      description: "Prepare for specialty training and NHS job interviews",
      items: [
        {
          title: "Types of NHS Interviews",
          content: "Specialty Training Interviews (Oriel):\n- Structured interviews with standardised scoring\n- Typically 2-3 stations (portfolio, clinical, situational)\n- Scored against a mark scheme\n- Competitive - national ranking determines offers\n\nCommon Interview Formats:\n- Portfolio Station: Discuss your CV, research, audits, teaching\n- Clinical Station: Clinical scenarios, management questions\n- Situational Judgement: How you handle workplace situations\n- Leadership/Management: Examples of leadership and teamwork\n\nKey Principles:\n- Use the STAR method (Situation, Task, Action, Result)\n- Prepare 5-7 strong examples from your experience\n- Know your portfolio inside out\n- Research the specialty person specification",
        },
        {
          title: "Specialty-Specific Interview Guide",
          content: "Core Medical Training (CMT) Interviews:\n- Portfolio review: audit, QIP, teaching, research, presentations\n- Clinical scenarios: acute medical emergencies\n- Commitment to specialty: why medicine, career plan\n\nCore Surgical Training (CST) Interviews:\n- Portfolio: logbook, audits, courses (ALS, ATLS), research\n- Clinical: surgical emergencies, anatomy\n- Situational: teamwork, professionalism\n\nGP Training (GPST) Interviews:\n- Machine-marked written test and clinical scenarios\n- Professional dilemmas\n- Commitment to GP\n\nGeneral Tips:\n- Book a mock interview with your deanery or educational supervisor\n- Practice with colleagues using the mark scheme\n- Record yourself and review your answers\n- Dress professionally (smart formal)",
        },
        {
          title: "Mock Interview Questions and STAR Answers",
          content: "Common Portfolio Questions:\n\nQ: Tell me about a piece of research you have been involved in.\nSTAR Answer Framework:\n- Situation: Describe the clinical context\n- Task: What was your role?\n- Action: What did you specifically do?\n- Result: What was the outcome/impact?\n\nQ: Describe a Quality Improvement Project you led.\n- Focus on your leadership role\n- Emphasise the PDSA cycle\n- Quantify the improvement (e.g., compliance improved from 40% to 85%)\n- Mention re-audit and sustainability\n\nQ: Give an example of a time you dealt with a difficult colleague.\n- Use a real but anonymised example\n- Focus on professional resolution\n- Show insight and learning\n\nClinical Scenario Tips:\n- Always start with: I would ensure patient safety first\n- Use ABCDE approach for acute scenarios\n- Mention escalation and senior support\n- Reference guidelines (NICE, BNF, local protocols)",
        },
      ],
    },
    {
      title: "CV and Portfolio Building",
      description: "Build a competitive medical CV and portfolio for UK applications",
      items: [
        {
          title: "UK Medical CV Structure",
          content: "Standard UK Medical CV Sections:\n\n1. Personal Details: Name, GMC number, contact details\n2. Personal Statement: 1-2 paragraphs on career goals\n3. Medical Qualifications: Primary degree, PLAB, MRCP/MRCS etc.\n4. Employment History: Current and previous posts (most recent first)\n5. Clinical Skills: Procedures, competencies, courses\n6. Research and Publications: List all publications with citations\n7. Audit and Quality Improvement: Title, role, outcome\n8. Teaching: Formal and informal teaching experience\n9. Management and Leadership: Any leadership roles\n10. Presentations: Conferences, grand rounds\n11. Prizes and Awards\n12. Professional Development: Courses, conferences attended\n13. Referees: 2-3 consultants who know your work\n\nKey Tips:\n- Keep it concise (2-4 pages for junior doctors)\n- Use bullet points for clarity\n- Quantify achievements where possible\n- Tailor to the specific post",
        },
        {
          title: "Building Your Portfolio Evidence",
          content: "Portfolio Evidence by Category:\n\nResearch (aim for 1-2 publications):\n- Published papers (first author > co-author)\n- Submitted papers (note status)\n- Abstracts accepted at conferences\n- Posters presented\n\nAudit and QIP (aim for 2-3 completed cycles):\n- Full audit cycle (design, data, change, re-audit)\n- QIP with PDSA cycle\n- National audit participation\n\nTeaching (aim for regular involvement):\n- Medical student teaching\n- Peer teaching\n- BLS/ALS instructor\n- Formal teaching sessions with feedback\n\nCourses and Qualifications:\n- ALS (Advanced Life Support) - essential\n- ATLS (Advanced Trauma Life Support) - for surgical\n- APLS (Advanced Paediatric Life Support) - for paediatrics\n- MRCP/MRCS/MRCGP - specialty exams",
        },
      ],
    },
    {
      title: "Choosing Your Specialty",
      description: "Navigate specialty selection and understand training pathways",
      items: [
        {
          title: "Overview of UK Specialty Training",
          content: "The UK Training Pathway:\nFoundation Programme (F1-F2) -> Core Training (CT1-CT2/3) -> Specialty Training (ST3-ST8) -> Consultant/GP\n\nFor IMGs (International Medical Graduates):\nMost IMGs enter at:\n- SHO/CT1 level: After PLAB and gaining UK experience\n- Specialty Registrar (ST3+): If you have equivalent training from abroad\n\nCompetitive Specialties (harder to get into):\n- Neurosurgery, Plastic Surgery, Cardiothoracic Surgery\n- Dermatology, Ophthalmology\n- Academic Clinical Fellowships\n\nLess Competitive Specialties:\n- General Practice (GP) - largest intake\n- Psychiatry\n- Geriatrics\n- Emergency Medicine\n\nKey Factors to Consider:\n- Lifestyle (hours, on-call frequency)\n- Training length (GP = 3 years, Surgery = 6-8 years)\n- Competitiveness\n- Your clinical interests\n- Location flexibility",
        },
        {
          title: "Specialty Deep Dives",
          content: "Internal Medicine (Core Medical Training):\n- Entry: CT1 via Oriel (national recruitment)\n- Exam: MRCP (Parts 1, 2, PACES)\n- Duration: 2 years core + 4-6 years specialty\n- Leads to: Cardiology, Gastro, Respiratory, Nephrology, etc.\n\nGeneral Practice:\n- Entry: GPST1 via national recruitment\n- Exam: MRCGP (AKT + CSA/RCCA)\n- Duration: 3 years\n- Lifestyle: Best work-life balance\n\nSurgery (Core Surgical Training):\n- Entry: CT1/2 via national recruitment\n- Exam: MRCS (Parts A and B)\n- Duration: 2 years core + 6 years specialty\n- Leads to: General Surgery, Orthopaedics, Urology, etc.\n\nPsychiatry:\n- Entry: CT1 via national recruitment\n- Exam: MRCPsych\n- Duration: 3 years core + 3 years specialty\n\nEmergency Medicine:\n- Entry: CT1/2 via national recruitment\n- Exam: FRCEM\n- Duration: 6 years total",
        },
      ],
    },
  ],
} as const;
