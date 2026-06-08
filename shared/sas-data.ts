// UK Medical Specialty Self-Assessment Score (SAS) Data
// Sources: NHS Oriel, HEE, Royal Colleges, Specialty Recruitment Offices
// Last updated: April 2026

export interface SASCriterion {
  id: string;
  criterion: string;
  score: number;
  evidence: string;
  // For radio/select questions with multiple options
  options?: { label: string; score: number }[];
}

export interface SASDomain {
  id: string;
  name: string;
  maxScore: number;
  criteria: SASCriterion[];
}

export interface SASSpecialty {
  id: string;
  name: string;
  shortName: string;
  applicationRoute: string; // "Core Training" | "Specialty Training" | "Run-through"
  msraRequired: boolean;
  totalMaxScore: number;
  competitiveThreshold: number | null;
  sourceUrl: string;
  description: string;
  domains: SASDomain[];
}

export const SAS_SPECIALTIES: SASSpecialty[] = [
  // ─── 1. Internal Medicine Training (IMT) ─────────────────────────────────
  {
    id: "imt",
    name: "Internal Medicine Training (IMT)",
    shortName: "IMT",
    applicationRoute: "Core Training",
    msraRequired: true,
    totalMaxScore: 30,
    competitiveThreshold: 22,
    sourceUrl: "https://www.imtrecruitment.org.uk/recruitment-process/applying/application-scoring",
    description: "2-year core medical training programme leading to CMT Certificate of Completion. Applications via Oriel with MSRA shortlisting.",
    domains: [
      {
        id: "imt_qualifications",
        name: "Postgraduate Degrees & Qualifications",
        maxScore: 4,
        criteria: [
          {
            id: "imt_q1",
            criterion: "Highest postgraduate degree or qualification",
            score: 0,
            evidence: "Certificate/transcript of degree",
            options: [
              { label: "PhD or MD by research (medical or non-medical)", score: 4 },
              { label: "Masters level degree (MSc, MA, MRes) – ≥8 months full-time equivalent", score: 3 },
              { label: "Postgraduate diploma (PgDip) – ≥4 months full-time equivalent", score: 2 },
              { label: "Postgraduate certificate (PgCert) – ≥2 months full-time equivalent", score: 1 },
              { label: "None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "imt_presentations",
        name: "Presentations / Posters",
        maxScore: 6,
        criteria: [
          {
            id: "imt_p1",
            criterion: "Best level of presentation/poster at a medical meeting",
            score: 0,
            evidence: "Programme/certificate showing your name and presentation title",
            options: [
              { label: "Oral presentation at national or international medical meeting", score: 6 },
              { label: "Oral presentation at regional medical meeting", score: 4 },
              { label: "Poster presentation at national or international medical meeting", score: 3 },
              { label: "Poster presentation at regional medical meeting", score: 2 },
              { label: "Oral or poster presentation at local (hospital/trust) meeting", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "imt_publications",
        name: "Publications",
        maxScore: 6,
        criteria: [
          {
            id: "imt_pub1",
            criterion: "Best publication level",
            score: 0,
            evidence: "PubMed/DOI link or journal citation",
            options: [
              { label: "First author paper in peer-reviewed journal (indexed in PubMed/Medline)", score: 6 },
              { label: "First author paper in peer-reviewed journal (not indexed)", score: 5 },
              { label: "Co-author paper in peer-reviewed journal (indexed in PubMed/Medline)", score: 4 },
              { label: "Co-author paper in peer-reviewed journal (not indexed)", score: 3 },
              { label: "Published case report or letter", score: 2 },
              { label: "Published abstract only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "imt_teaching",
        name: "Teaching",
        maxScore: 4,
        criteria: [
          {
            id: "imt_t1",
            criterion: "Formal teaching qualification or evidence of teaching",
            score: 0,
            evidence: "Certificate of teaching qualification or teaching portfolio evidence",
            options: [
              { label: "Formal postgraduate teaching qualification (PgCert in Medical Education or equivalent)", score: 4 },
              { label: "Evidence of organising and delivering a formal teaching programme (≥3 sessions)", score: 3 },
              { label: "Evidence of regular formal teaching (≥3 sessions in 12 months)", score: 2 },
              { label: "Evidence of some formal teaching (1–2 sessions)", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "imt_audit_qip",
        name: "Audit / Quality Improvement",
        maxScore: 4,
        criteria: [
          {
            id: "imt_a1",
            criterion: "Audit or Quality Improvement Project (QIP) experience",
            score: 0,
            evidence: "Audit/QIP report showing your role, methodology, and re-audit/implementation",
            options: [
              { label: "Completed full audit cycle (audit → changes → re-audit) OR completed QIP with demonstrated improvement", score: 4 },
              { label: "Completed a clinical audit (data collection, analysis, recommendations) without re-audit", score: 2 },
              { label: "Participated in an audit (data collection only)", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "imt_leadership",
        name: "Leadership & Management",
        maxScore: 6,
        criteria: [
          {
            id: "imt_l1",
            criterion: "Leadership or management experience",
            score: 0,
            evidence: "Description of role, responsibilities, and impact",
            options: [
              { label: "Significant leadership role with demonstrated impact (e.g., committee chair, clinical lead, society president)", score: 6 },
              { label: "Active leadership role (e.g., committee member, rota coordinator, teaching lead)", score: 4 },
              { label: "Some leadership activity (e.g., organising a local event, leading a project)", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 2. Core Surgical Training (CST) ─────────────────────────────────────
  {
    id: "cst",
    name: "Core Surgical Training (CST)",
    shortName: "CST",
    applicationRoute: "Core Training",
    msraRequired: true,
    totalMaxScore: 60,
    competitiveThreshold: 42,
    sourceUrl: "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/surgery/core-surgery",
    description: "2-year core surgical training. Portfolio-based scoring after MSRA shortlisting. Covers all surgical specialties.",
    domains: [
      {
        id: "cst_commitment",
        name: "Commitment to Specialty",
        maxScore: 12,
        criteria: [
          {
            id: "cst_c1",
            criterion: "Surgical taster week or elective",
            score: 0,
            evidence: "Letter from supervisor confirming dates and surgical specialty",
            options: [
              { label: "Surgical taster week (≥5 days) OR surgical elective as medical student (≥4 weeks)", score: 12 },
              { label: "No surgical taster/elective", score: 0 },
            ],
          },
        ],
      },
      {
        id: "cst_experience",
        name: "Surgical Experience (Logbook)",
        maxScore: 12,
        criteria: [
          {
            id: "cst_e1",
            criterion: "Number of surgical cases in logbook",
            score: 0,
            evidence: "Surgical logbook (eLogbook or equivalent) showing case numbers",
            options: [
              { label: "40 or more cases", score: 12 },
              { label: "30–39 cases", score: 9 },
              { label: "20–29 cases", score: 6 },
              { label: "10–19 cases", score: 3 },
              { label: "Fewer than 10 cases", score: 0 },
            ],
          },
        ],
      },
      {
        id: "cst_qualifications",
        name: "Qualifications",
        maxScore: 12,
        criteria: [
          {
            id: "cst_q1",
            criterion: "Postgraduate qualification",
            score: 0,
            evidence: "Certificate of qualification",
            options: [
              { label: "PhD or MD by research", score: 12 },
              { label: "Masters degree (MSc, MRes, MA)", score: 9 },
              { label: "Postgraduate diploma", score: 6 },
              { label: "MRCS Part A passed", score: 3 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "cst_research",
        name: "Research & Publications",
        maxScore: 12,
        criteria: [
          {
            id: "cst_r1",
            criterion: "Publications and presentations",
            score: 0,
            evidence: "PubMed/DOI links, conference programmes",
            options: [
              { label: "First-author publication in peer-reviewed journal + national/international presentation", score: 12 },
              { label: "First-author publication in peer-reviewed journal OR national/international presentation", score: 9 },
              { label: "Co-author publication OR regional presentation", score: 6 },
              { label: "Published abstract or local presentation", score: 3 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "cst_audit_teaching",
        name: "Audit, QIP & Teaching",
        maxScore: 12,
        criteria: [
          {
            id: "cst_at1",
            criterion: "Audit/QIP and teaching experience",
            score: 0,
            evidence: "Audit report, QIP documentation, teaching records",
            options: [
              { label: "Completed full audit cycle AND evidence of regular teaching", score: 12 },
              { label: "Completed full audit cycle OR evidence of regular teaching", score: 8 },
              { label: "Completed audit without re-audit OR some teaching", score: 4 },
              { label: "Participated in audit only", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 3. General Practice (GP) ─────────────────────────────────────────────
  {
    id: "gp",
    name: "General Practice (GP) Specialty Training",
    shortName: "GP",
    applicationRoute: "Specialty Training",
    msraRequired: true,
    totalMaxScore: 100,
    competitiveThreshold: 60,
    sourceUrl: "https://gprecruitment.hee.nhs.uk/Recruitment",
    description: "3-year GP training programme. MSRA is the primary selection tool. Shortlisted candidates attend a selection centre.",
    domains: [
      {
        id: "gp_msra",
        name: "MSRA Score",
        maxScore: 50,
        criteria: [
          {
            id: "gp_m1",
            criterion: "MSRA Clinical Problem Solving (CPS) score",
            score: 0,
            evidence: "MSRA score report",
            options: [
              { label: "Score ≥ 240 (top band)", score: 50 },
              { label: "Score 220–239", score: 40 },
              { label: "Score 200–219", score: 30 },
              { label: "Score 185–199", score: 20 },
              { label: "Score 170–184", score: 10 },
              { label: "Score < 170", score: 0 },
            ],
          },
        ],
      },
      {
        id: "gp_portfolio",
        name: "Portfolio (Clinical Experience & Achievements)",
        maxScore: 30,
        criteria: [
          {
            id: "gp_p1",
            criterion: "Postgraduate qualification",
            score: 0,
            evidence: "Degree certificate",
            options: [
              { label: "PhD/MD or Masters degree", score: 10 },
              { label: "Postgraduate diploma", score: 6 },
              { label: "Postgraduate certificate", score: 3 },
              { label: "None", score: 0 },
            ],
          },
          {
            id: "gp_p2",
            criterion: "Publications and presentations",
            score: 0,
            evidence: "PubMed links, conference programmes",
            options: [
              { label: "First-author peer-reviewed publication", score: 10 },
              { label: "Co-author peer-reviewed publication OR national presentation", score: 6 },
              { label: "Published abstract or regional/local presentation", score: 3 },
              { label: "None", score: 0 },
            ],
          },
          {
            id: "gp_p3",
            criterion: "Audit/QIP completion",
            score: 0,
            evidence: "Audit report",
            options: [
              { label: "Completed full audit cycle or QIP with demonstrated improvement", score: 10 },
              { label: "Completed audit without re-audit", score: 5 },
              { label: "Participated in audit only", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "gp_selection_centre",
        name: "Selection Centre",
        maxScore: 20,
        criteria: [
          {
            id: "gp_sc1",
            criterion: "Selection centre performance (simulated consultation, written exercise)",
            score: 0,
            evidence: "Assessed on the day",
            options: [
              { label: "Excellent performance (top quartile)", score: 20 },
              { label: "Good performance", score: 15 },
              { label: "Satisfactory performance", score: 10 },
              { label: "Below expected standard", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 4. Psychiatry Core Training (CT1) ───────────────────────────────────
  {
    id: "psychiatry",
    name: "Psychiatry Core Training (CT1)",
    shortName: "Psychiatry",
    applicationRoute: "Core Training",
    msraRequired: true,
    totalMaxScore: 40,
    competitiveThreshold: 28,
    sourceUrl: "https://www.rcpsych.ac.uk/training/training-in-the-uk/core-training",
    description: "3-year core psychiatry training. MSRA used for shortlisting. Portfolio scored at interview stage.",
    domains: [
      {
        id: "psych_qualifications",
        name: "Qualifications",
        maxScore: 8,
        criteria: [
          {
            id: "psych_q1",
            criterion: "Highest postgraduate qualification",
            score: 0,
            evidence: "Degree certificate",
            options: [
              { label: "PhD or MD by research", score: 8 },
              { label: "Masters degree (MSc, MA, MRes)", score: 6 },
              { label: "Postgraduate diploma", score: 4 },
              { label: "Postgraduate certificate", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "psych_research",
        name: "Research & Publications",
        maxScore: 8,
        criteria: [
          {
            id: "psych_r1",
            criterion: "Best publication",
            score: 0,
            evidence: "PubMed/DOI link",
            options: [
              { label: "First-author paper in peer-reviewed journal", score: 8 },
              { label: "Co-author paper in peer-reviewed journal", score: 6 },
              { label: "Published case report or letter", score: 4 },
              { label: "Published abstract", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "psych_presentations",
        name: "Presentations",
        maxScore: 6,
        criteria: [
          {
            id: "psych_p1",
            criterion: "Best presentation level",
            score: 0,
            evidence: "Conference programme showing your name",
            options: [
              { label: "Oral presentation at national/international meeting", score: 6 },
              { label: "Oral presentation at regional meeting", score: 4 },
              { label: "Poster at national/international meeting", score: 3 },
              { label: "Poster at regional meeting", score: 2 },
              { label: "Local presentation only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "psych_audit",
        name: "Audit / Quality Improvement",
        maxScore: 6,
        criteria: [
          {
            id: "psych_a1",
            criterion: "Audit/QIP experience",
            score: 0,
            evidence: "Audit report",
            options: [
              { label: "Completed full audit cycle or QIP with demonstrated improvement", score: 6 },
              { label: "Completed audit (data, analysis, recommendations) without re-audit", score: 4 },
              { label: "Participated in audit (data collection only)", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "psych_teaching",
        name: "Teaching",
        maxScore: 6,
        criteria: [
          {
            id: "psych_t1",
            criterion: "Teaching experience",
            score: 0,
            evidence: "Teaching records, feedback forms",
            options: [
              { label: "Formal teaching qualification (PgCert in Medical Education or equivalent)", score: 6 },
              { label: "Organised and delivered formal teaching programme (≥3 sessions)", score: 4 },
              { label: "Regular formal teaching (≥3 sessions in 12 months)", score: 3 },
              { label: "Some teaching (1–2 sessions)", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "psych_leadership",
        name: "Leadership & Management",
        maxScore: 6,
        criteria: [
          {
            id: "psych_l1",
            criterion: "Leadership/management experience",
            score: 0,
            evidence: "Description of role and impact",
            options: [
              { label: "Significant leadership role with demonstrated impact", score: 6 },
              { label: "Active leadership role (committee, rota, society)", score: 4 },
              { label: "Some leadership activity", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 5. Paediatrics and Child Health ─────────────────────────────────────
  {
    id: "paediatrics",
    name: "Paediatrics and Child Health",
    shortName: "Paediatrics",
    applicationRoute: "Core Training",
    msraRequired: false,
    totalMaxScore: 25,
    competitiveThreshold: 18,
    sourceUrl: "https://www.rcpch.ac.uk/resources/paediatric-specialty-training-recruitment",
    description: "Paediatric training from CT1 level. Portfolio-based scoring with interview. RCPCH oversees training.",
    domains: [
      {
        id: "paed_qualifications",
        name: "Qualifications",
        maxScore: 5,
        criteria: [
          {
            id: "paed_q1",
            criterion: "Postgraduate qualification",
            score: 0,
            evidence: "Degree certificate",
            options: [
              { label: "PhD or MD by research", score: 5 },
              { label: "Masters degree", score: 4 },
              { label: "Postgraduate diploma", score: 3 },
              { label: "MRCPCH Part 1 passed", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "paed_research",
        name: "Research & Publications",
        maxScore: 5,
        criteria: [
          {
            id: "paed_r1",
            criterion: "Best publication",
            score: 0,
            evidence: "PubMed/DOI link",
            options: [
              { label: "First-author peer-reviewed publication", score: 5 },
              { label: "Co-author peer-reviewed publication", score: 4 },
              { label: "Published case report or letter", score: 3 },
              { label: "Published abstract", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "paed_presentations",
        name: "Presentations",
        maxScore: 5,
        criteria: [
          {
            id: "paed_p1",
            criterion: "Best presentation level",
            score: 0,
            evidence: "Conference programme",
            options: [
              { label: "Oral presentation at national/international meeting", score: 5 },
              { label: "Oral presentation at regional meeting", score: 4 },
              { label: "Poster at national/international meeting", score: 3 },
              { label: "Poster at regional meeting", score: 2 },
              { label: "Local presentation only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "paed_audit",
        name: "Audit / QIP",
        maxScore: 5,
        criteria: [
          {
            id: "paed_a1",
            criterion: "Audit/QIP experience",
            score: 0,
            evidence: "Audit report",
            options: [
              { label: "Completed full audit cycle or QIP with improvement", score: 5 },
              { label: "Completed audit without re-audit", score: 3 },
              { label: "Participated in audit only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "paed_teaching_leadership",
        name: "Teaching & Leadership",
        maxScore: 5,
        criteria: [
          {
            id: "paed_tl1",
            criterion: "Teaching and leadership experience",
            score: 0,
            evidence: "Teaching records, leadership role description",
            options: [
              { label: "Formal teaching qualification AND significant leadership role", score: 5 },
              { label: "Regular teaching OR significant leadership role", score: 3 },
              { label: "Some teaching OR some leadership activity", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 6. Obstetrics & Gynaecology (O&G) ───────────────────────────────────
  {
    id: "og",
    name: "Obstetrics and Gynaecology (O&G)",
    shortName: "O&G",
    applicationRoute: "Core Training",
    msraRequired: true,
    totalMaxScore: 150,
    competitiveThreshold: 100,
    sourceUrl: "https://www.rcog.org.uk/careers-and-training/starting-your-og-career/specialty-training/",
    description: "O&G specialty training from ST1. MSRA used for shortlisting. Portfolio scored at interview. RCOG oversees training.",
    domains: [
      {
        id: "og_qualifications",
        name: "Qualifications",
        maxScore: 30,
        criteria: [
          {
            id: "og_q1",
            criterion: "Postgraduate qualification",
            score: 0,
            evidence: "Degree certificate",
            options: [
              { label: "PhD or MD by research", score: 30 },
              { label: "Masters degree (MSc, MA, MRes)", score: 20 },
              { label: "Postgraduate diploma", score: 10 },
              { label: "Postgraduate certificate", score: 5 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "og_research",
        name: "Research, Publications & Presentations",
        maxScore: 30,
        criteria: [
          {
            id: "og_r1",
            criterion: "Publications",
            score: 0,
            evidence: "PubMed/DOI link",
            options: [
              { label: "First-author paper in peer-reviewed journal (indexed)", score: 15 },
              { label: "First-author paper in peer-reviewed journal (not indexed)", score: 12 },
              { label: "Co-author paper in peer-reviewed journal", score: 9 },
              { label: "Published case report or letter", score: 6 },
              { label: "Published abstract", score: 3 },
              { label: "None", score: 0 },
            ],
          },
          {
            id: "og_r2",
            criterion: "Presentations",
            score: 0,
            evidence: "Conference programme",
            options: [
              { label: "Oral presentation at national/international meeting", score: 15 },
              { label: "Oral presentation at regional meeting", score: 10 },
              { label: "Poster at national/international meeting", score: 8 },
              { label: "Poster at regional meeting", score: 5 },
              { label: "Local presentation only", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "og_audit",
        name: "Audit / Quality Improvement",
        maxScore: 30,
        criteria: [
          {
            id: "og_a1",
            criterion: "Audit/QIP experience",
            score: 0,
            evidence: "Audit report with your role clearly documented",
            options: [
              { label: "Completed full audit cycle (audit → change → re-audit) or QIP with improvement", score: 30 },
              { label: "Completed audit without re-audit", score: 20 },
              { label: "Participated in audit (data collection only)", score: 10 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "og_teaching",
        name: "Teaching",
        maxScore: 30,
        criteria: [
          {
            id: "og_t1",
            criterion: "Teaching experience",
            score: 0,
            evidence: "Teaching records, feedback forms",
            options: [
              { label: "Formal teaching qualification (PgCert in Medical Education or equivalent)", score: 30 },
              { label: "Organised and delivered formal teaching programme (≥3 sessions)", score: 20 },
              { label: "Regular formal teaching (≥3 sessions in 12 months)", score: 15 },
              { label: "Some teaching (1–2 sessions)", score: 5 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "og_leadership",
        name: "Leadership & Management",
        maxScore: 30,
        criteria: [
          {
            id: "og_l1",
            criterion: "Leadership/management experience",
            score: 0,
            evidence: "Description of role and impact",
            options: [
              { label: "Significant leadership role with demonstrated impact", score: 30 },
              { label: "Active leadership role", score: 20 },
              { label: "Some leadership activity", score: 10 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 7. Anaesthetics / ACCS ───────────────────────────────────────────────
  {
    id: "anaesthetics",
    name: "Anaesthetics / ACCS (Anaesthesia)",
    shortName: "Anaesthetics",
    applicationRoute: "Core Training",
    msraRequired: false,
    totalMaxScore: 50,
    competitiveThreshold: 35,
    sourceUrl: "https://www.rcoa.ac.uk/training-careers/training-anaesthesia/applying-anaesthesia-training",
    description: "Core Anaesthetics Training (CAT) or ACCS Anaesthesia. Portfolio-based scoring at interview. RCoA oversees training.",
    domains: [
      {
        id: "anaes_qualifications",
        name: "Qualifications",
        maxScore: 8,
        criteria: [
          {
            id: "anaes_q1",
            criterion: "Postgraduate qualification",
            score: 0,
            evidence: "Degree certificate",
            options: [
              { label: "PhD or MD by research", score: 8 },
              { label: "Masters degree", score: 6 },
              { label: "Postgraduate diploma", score: 4 },
              { label: "Postgraduate certificate", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "anaes_research",
        name: "Research & Publications",
        maxScore: 8,
        criteria: [
          {
            id: "anaes_r1",
            criterion: "Best publication",
            score: 0,
            evidence: "PubMed/DOI link",
            options: [
              { label: "First-author paper in peer-reviewed journal", score: 8 },
              { label: "Co-author paper in peer-reviewed journal", score: 6 },
              { label: "Published case report or letter", score: 4 },
              { label: "Published abstract", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "anaes_presentations",
        name: "Presentations",
        maxScore: 6,
        criteria: [
          {
            id: "anaes_p1",
            criterion: "Best presentation level",
            score: 0,
            evidence: "Conference programme",
            options: [
              { label: "Oral presentation at national/international meeting", score: 6 },
              { label: "Oral presentation at regional meeting", score: 4 },
              { label: "Poster at national/international meeting", score: 3 },
              { label: "Poster at regional meeting", score: 2 },
              { label: "Local presentation only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "anaes_audit",
        name: "Audit / Quality Improvement",
        maxScore: 8,
        criteria: [
          {
            id: "anaes_a1",
            criterion: "Audit/QIP experience",
            score: 0,
            evidence: "Audit report",
            options: [
              { label: "Completed full audit cycle or QIP with improvement", score: 8 },
              { label: "Completed audit without re-audit", score: 5 },
              { label: "Participated in audit only", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "anaes_teaching",
        name: "Teaching",
        maxScore: 6,
        criteria: [
          {
            id: "anaes_t1",
            criterion: "Teaching experience",
            score: 0,
            evidence: "Teaching records",
            options: [
              { label: "Formal teaching qualification", score: 6 },
              { label: "Organised formal teaching programme (≥3 sessions)", score: 4 },
              { label: "Regular formal teaching (≥3 sessions)", score: 3 },
              { label: "Some teaching (1–2 sessions)", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "anaes_leadership",
        name: "Leadership & Management",
        maxScore: 8,
        criteria: [
          {
            id: "anaes_l1",
            criterion: "Leadership/management experience",
            score: 0,
            evidence: "Role description and impact",
            options: [
              { label: "Significant leadership role with demonstrated impact", score: 8 },
              { label: "Active leadership role", score: 5 },
              { label: "Some leadership activity", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "anaes_commitment",
        name: "Commitment to Specialty",
        maxScore: 6,
        criteria: [
          {
            id: "anaes_cs1",
            criterion: "Anaesthetics taster/elective or relevant experience",
            score: 0,
            evidence: "Letter from supervisor",
            options: [
              { label: "Anaesthetics taster week (≥5 days) or elective (≥4 weeks)", score: 6 },
              { label: "Attended anaesthetics course (e.g., ATLS, ALS, FRCA preparation)", score: 3 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 8. Emergency Medicine (EM) ───────────────────────────────────────────
  {
    id: "em",
    name: "Emergency Medicine (EM)",
    shortName: "Emergency Medicine",
    applicationRoute: "Core Training",
    msraRequired: false,
    totalMaxScore: 56,
    competitiveThreshold: 38,
    sourceUrl: "https://www.rcem.ac.uk/Training-Exams/Specialty-Training/Recruitment",
    description: "Emergency Medicine specialty training from CT1/ST1. Portfolio-based scoring. RCEM oversees training.",
    domains: [
      {
        id: "em_qualifications",
        name: "Qualifications",
        maxScore: 8,
        criteria: [
          {
            id: "em_q1",
            criterion: "Postgraduate qualification",
            score: 0,
            evidence: "Degree certificate",
            options: [
              { label: "PhD or MD by research", score: 8 },
              { label: "Masters degree", score: 6 },
              { label: "Postgraduate diploma", score: 4 },
              { label: "Postgraduate certificate", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "em_research",
        name: "Research & Publications",
        maxScore: 8,
        criteria: [
          {
            id: "em_r1",
            criterion: "Best publication",
            score: 0,
            evidence: "PubMed/DOI link",
            options: [
              { label: "First-author paper in peer-reviewed journal", score: 8 },
              { label: "Co-author paper in peer-reviewed journal", score: 6 },
              { label: "Published case report or letter", score: 4 },
              { label: "Published abstract", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "em_presentations",
        name: "Presentations",
        maxScore: 8,
        criteria: [
          {
            id: "em_p1",
            criterion: "Best presentation level",
            score: 0,
            evidence: "Conference programme",
            options: [
              { label: "Oral presentation at national/international meeting", score: 8 },
              { label: "Oral presentation at regional meeting", score: 6 },
              { label: "Poster at national/international meeting", score: 4 },
              { label: "Poster at regional meeting", score: 2 },
              { label: "Local presentation only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "em_audit",
        name: "Audit / Quality Improvement",
        maxScore: 8,
        criteria: [
          {
            id: "em_a1",
            criterion: "Audit/QIP experience",
            score: 0,
            evidence: "Audit report",
            options: [
              { label: "Completed full audit cycle or QIP with improvement", score: 8 },
              { label: "Completed audit without re-audit", score: 5 },
              { label: "Participated in audit only", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "em_teaching",
        name: "Teaching",
        maxScore: 8,
        criteria: [
          {
            id: "em_t1",
            criterion: "Teaching experience",
            score: 0,
            evidence: "Teaching records",
            options: [
              { label: "Formal teaching qualification", score: 8 },
              { label: "Organised formal teaching programme (≥3 sessions)", score: 6 },
              { label: "Regular formal teaching (≥3 sessions)", score: 4 },
              { label: "Some teaching (1–2 sessions)", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "em_leadership",
        name: "Leadership & Management",
        maxScore: 8,
        criteria: [
          {
            id: "em_l1",
            criterion: "Leadership/management experience",
            score: 0,
            evidence: "Role description and impact",
            options: [
              { label: "Significant leadership role with demonstrated impact", score: 8 },
              { label: "Active leadership role", score: 5 },
              { label: "Some leadership activity", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "em_courses",
        name: "Relevant Courses & Commitment",
        maxScore: 8,
        criteria: [
          {
            id: "em_c1",
            criterion: "Emergency Medicine relevant courses",
            score: 0,
            evidence: "Course completion certificates",
            options: [
              { label: "ATLS + ALS + APLS (or equivalent) all completed", score: 8 },
              { label: "Two of: ATLS, ALS, APLS", score: 5 },
              { label: "One of: ATLS, ALS, APLS", score: 3 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 9. Clinical Radiology ────────────────────────────────────────────────
  {
    id: "radiology",
    name: "Clinical Radiology",
    shortName: "Radiology",
    applicationRoute: "Specialty Training",
    msraRequired: true,
    totalMaxScore: 24,
    competitiveThreshold: 18,
    sourceUrl: "https://www.rcr.ac.uk/clinical-radiology/recruitment/clinical-radiology-recruitment/",
    description: "5-year radiology specialty training from ST1. MSRA used for shortlisting. Portfolio scored at interview. RCR oversees training.",
    domains: [
      {
        id: "rad_qualifications",
        name: "Qualifications",
        maxScore: 4,
        criteria: [
          {
            id: "rad_q1",
            criterion: "Postgraduate qualification",
            score: 0,
            evidence: "Degree certificate",
            options: [
              { label: "PhD or MD by research", score: 4 },
              { label: "Masters degree", score: 3 },
              { label: "Postgraduate diploma", score: 2 },
              { label: "Postgraduate certificate", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "rad_research",
        name: "Research & Publications",
        maxScore: 6,
        criteria: [
          {
            id: "rad_r1",
            criterion: "Best publication",
            score: 0,
            evidence: "PubMed/DOI link",
            options: [
              { label: "First-author paper in peer-reviewed journal (indexed)", score: 6 },
              { label: "First-author paper in peer-reviewed journal (not indexed)", score: 5 },
              { label: "Co-author paper in peer-reviewed journal", score: 4 },
              { label: "Published case report or letter", score: 2 },
              { label: "Published abstract", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "rad_presentations",
        name: "Presentations",
        maxScore: 4,
        criteria: [
          {
            id: "rad_p1",
            criterion: "Best presentation level",
            score: 0,
            evidence: "Conference programme",
            options: [
              { label: "Oral presentation at national/international meeting", score: 4 },
              { label: "Oral presentation at regional meeting", score: 3 },
              { label: "Poster at national/international meeting", score: 2 },
              { label: "Poster at regional meeting", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "rad_audit",
        name: "Audit / Quality Improvement",
        maxScore: 4,
        criteria: [
          {
            id: "rad_a1",
            criterion: "Audit/QIP experience",
            score: 0,
            evidence: "Audit report",
            options: [
              { label: "Completed full audit cycle or QIP with improvement", score: 4 },
              { label: "Completed audit without re-audit", score: 2 },
              { label: "Participated in audit only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "rad_teaching",
        name: "Teaching & Leadership",
        maxScore: 6,
        criteria: [
          {
            id: "rad_t1",
            criterion: "Teaching and leadership experience",
            score: 0,
            evidence: "Teaching records, leadership role description",
            options: [
              { label: "Formal teaching qualification AND significant leadership role", score: 6 },
              { label: "Regular teaching OR significant leadership role", score: 4 },
              { label: "Some teaching OR some leadership", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 10. Ophthalmology ────────────────────────────────────────────────────
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    shortName: "Ophthalmology",
    applicationRoute: "Run-through",
    msraRequired: true,
    totalMaxScore: 45,
    competitiveThreshold: 32,
    sourceUrl: "https://www.rcophth.ac.uk/training/ophthalmology-specialty-training/",
    description: "7-year run-through ophthalmology training from ST1. MSRA used for shortlisting. RCOphth oversees training.",
    domains: [
      {
        id: "oph_qualifications",
        name: "Qualifications",
        maxScore: 8,
        criteria: [
          {
            id: "oph_q1",
            criterion: "Postgraduate qualification",
            score: 0,
            evidence: "Degree certificate",
            options: [
              { label: "PhD or MD by research", score: 8 },
              { label: "Masters degree", score: 6 },
              { label: "Postgraduate diploma", score: 4 },
              { label: "Postgraduate certificate", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "oph_research",
        name: "Research & Publications",
        maxScore: 9,
        criteria: [
          {
            id: "oph_r1",
            criterion: "Best publication",
            score: 0,
            evidence: "PubMed/DOI link",
            options: [
              { label: "First-author paper in peer-reviewed journal (indexed)", score: 9 },
              { label: "First-author paper in peer-reviewed journal (not indexed)", score: 7 },
              { label: "Co-author paper in peer-reviewed journal", score: 5 },
              { label: "Published case report or letter", score: 3 },
              { label: "Published abstract", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "oph_presentations",
        name: "Presentations",
        maxScore: 6,
        criteria: [
          {
            id: "oph_p1",
            criterion: "Best presentation level",
            score: 0,
            evidence: "Conference programme",
            options: [
              { label: "Oral presentation at national/international meeting", score: 6 },
              { label: "Oral presentation at regional meeting", score: 4 },
              { label: "Poster at national/international meeting", score: 3 },
              { label: "Poster at regional meeting", score: 2 },
              { label: "Local presentation only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "oph_audit",
        name: "Audit / Quality Improvement",
        maxScore: 6,
        criteria: [
          {
            id: "oph_a1",
            criterion: "Audit/QIP experience",
            score: 0,
            evidence: "Audit report",
            options: [
              { label: "Completed full audit cycle or QIP with improvement", score: 6 },
              { label: "Completed audit without re-audit", score: 4 },
              { label: "Participated in audit only", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "oph_teaching",
        name: "Teaching",
        maxScore: 6,
        criteria: [
          {
            id: "oph_t1",
            criterion: "Teaching experience",
            score: 0,
            evidence: "Teaching records",
            options: [
              { label: "Formal teaching qualification", score: 6 },
              { label: "Organised formal teaching programme (≥3 sessions)", score: 4 },
              { label: "Regular formal teaching (≥3 sessions)", score: 3 },
              { label: "Some teaching (1–2 sessions)", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "oph_leadership",
        name: "Leadership & Management",
        maxScore: 6,
        criteria: [
          {
            id: "oph_l1",
            criterion: "Leadership/management experience",
            score: 0,
            evidence: "Role description and impact",
            options: [
              { label: "Significant leadership role with demonstrated impact", score: 6 },
              { label: "Active leadership role", score: 4 },
              { label: "Some leadership activity", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "oph_commitment",
        name: "Commitment to Specialty",
        maxScore: 4,
        criteria: [
          {
            id: "oph_cs1",
            criterion: "Ophthalmology taster/elective or relevant experience",
            score: 0,
            evidence: "Letter from supervisor",
            options: [
              { label: "Ophthalmology taster week (≥5 days) or elective (≥4 weeks)", score: 4 },
              { label: "Attended ophthalmology course or conference", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 11. Orthopaedic Surgery ──────────────────────────────────────────────
  {
    id: "orthopaedics",
    name: "Orthopaedic Surgery",
    shortName: "Orthopaedics",
    applicationRoute: "Core Training",
    msraRequired: false,
    totalMaxScore: 45,
    competitiveThreshold: 32,
    sourceUrl: "https://www.boa.ac.uk/careers-and-training/specialty-training/",
    description: "Core Surgical Training (CST) with orthopaedic focus, then ST3 orthopaedics. BOA and JCST oversee training.",
    domains: [
      {
        id: "orth_qualifications",
        name: "Qualifications",
        maxScore: 8,
        criteria: [
          {
            id: "orth_q1",
            criterion: "Postgraduate qualification",
            score: 0,
            evidence: "Degree certificate",
            options: [
              { label: "PhD or MD by research", score: 8 },
              { label: "Masters degree", score: 6 },
              { label: "Postgraduate diploma", score: 4 },
              { label: "MRCS Part A passed", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "orth_logbook",
        name: "Surgical Logbook",
        maxScore: 8,
        criteria: [
          {
            id: "orth_l1",
            criterion: "Orthopaedic/surgical cases in logbook",
            score: 0,
            evidence: "Surgical logbook (eLogbook)",
            options: [
              { label: "40 or more cases", score: 8 },
              { label: "30–39 cases", score: 6 },
              { label: "20–29 cases", score: 4 },
              { label: "10–19 cases", score: 2 },
              { label: "Fewer than 10 cases", score: 0 },
            ],
          },
        ],
      },
      {
        id: "orth_research",
        name: "Research & Publications",
        maxScore: 8,
        criteria: [
          {
            id: "orth_r1",
            criterion: "Best publication",
            score: 0,
            evidence: "PubMed/DOI link",
            options: [
              { label: "First-author paper in peer-reviewed journal", score: 8 },
              { label: "Co-author paper in peer-reviewed journal", score: 6 },
              { label: "Published case report or letter", score: 4 },
              { label: "Published abstract", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "orth_presentations",
        name: "Presentations",
        maxScore: 6,
        criteria: [
          {
            id: "orth_p1",
            criterion: "Best presentation level",
            score: 0,
            evidence: "Conference programme",
            options: [
              { label: "Oral presentation at national/international meeting", score: 6 },
              { label: "Oral presentation at regional meeting", score: 4 },
              { label: "Poster at national/international meeting", score: 3 },
              { label: "Poster at regional meeting", score: 2 },
              { label: "Local presentation only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "orth_audit_teaching",
        name: "Audit, QIP & Teaching",
        maxScore: 8,
        criteria: [
          {
            id: "orth_at1",
            criterion: "Audit/QIP and teaching experience",
            score: 0,
            evidence: "Audit report, teaching records",
            options: [
              { label: "Completed full audit cycle AND evidence of regular teaching", score: 8 },
              { label: "Completed full audit cycle OR evidence of regular teaching", score: 5 },
              { label: "Completed audit without re-audit OR some teaching", score: 3 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "orth_leadership",
        name: "Leadership & Commitment",
        maxScore: 7,
        criteria: [
          {
            id: "orth_lc1",
            criterion: "Leadership and commitment to orthopaedics",
            score: 0,
            evidence: "Role description, taster week letter",
            options: [
              { label: "Significant leadership role AND orthopaedic taster/elective", score: 7 },
              { label: "Significant leadership role OR orthopaedic taster/elective", score: 4 },
              { label: "Some leadership OR some orthopaedic exposure", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 12. Neurosurgery ─────────────────────────────────────────────────────
  {
    id: "neurosurgery",
    name: "Neurosurgery ST1",
    shortName: "Neurosurgery",
    applicationRoute: "Run-through",
    msraRequired: true,
    totalMaxScore: 36,
    competitiveThreshold: 26,
    sourceUrl: "https://www.sbns.org.uk/index.php/education-and-training/specialty-training/",
    description: "8-year run-through neurosurgery training from ST1. MSRA used for shortlisting. SBNS oversees training. Highly competitive.",
    domains: [
      {
        id: "neuro_qualifications",
        name: "Qualifications",
        maxScore: 6,
        criteria: [
          {
            id: "neuro_q1",
            criterion: "Postgraduate qualification",
            score: 0,
            evidence: "Degree certificate",
            options: [
              { label: "PhD or MD by research", score: 6 },
              { label: "Masters degree", score: 5 },
              { label: "Postgraduate diploma", score: 3 },
              { label: "Postgraduate certificate", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "neuro_research",
        name: "Research & Publications",
        maxScore: 8,
        criteria: [
          {
            id: "neuro_r1",
            criterion: "Best publication",
            score: 0,
            evidence: "PubMed/DOI link",
            options: [
              { label: "First-author paper in peer-reviewed journal (indexed)", score: 8 },
              { label: "First-author paper in peer-reviewed journal (not indexed)", score: 6 },
              { label: "Co-author paper in peer-reviewed journal", score: 4 },
              { label: "Published case report or letter", score: 2 },
              { label: "Published abstract", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "neuro_presentations",
        name: "Presentations",
        maxScore: 6,
        criteria: [
          {
            id: "neuro_p1",
            criterion: "Best presentation level",
            score: 0,
            evidence: "Conference programme",
            options: [
              { label: "Oral presentation at national/international meeting", score: 6 },
              { label: "Oral presentation at regional meeting", score: 4 },
              { label: "Poster at national/international meeting", score: 3 },
              { label: "Poster at regional meeting", score: 2 },
              { label: "Local presentation only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "neuro_audit",
        name: "Audit / Quality Improvement",
        maxScore: 6,
        criteria: [
          {
            id: "neuro_a1",
            criterion: "Audit/QIP experience",
            score: 0,
            evidence: "Audit report",
            options: [
              { label: "Completed full audit cycle or QIP with improvement", score: 6 },
              { label: "Completed audit without re-audit", score: 4 },
              { label: "Participated in audit only", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "neuro_teaching_leadership",
        name: "Teaching & Leadership",
        maxScore: 6,
        criteria: [
          {
            id: "neuro_tl1",
            criterion: "Teaching and leadership experience",
            score: 0,
            evidence: "Teaching records, leadership role description",
            options: [
              { label: "Formal teaching qualification AND significant leadership role", score: 6 },
              { label: "Regular teaching OR significant leadership role", score: 4 },
              { label: "Some teaching OR some leadership", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "neuro_commitment",
        name: "Commitment to Neurosurgery",
        maxScore: 4,
        criteria: [
          {
            id: "neuro_cs1",
            criterion: "Neurosurgery taster/elective or relevant experience",
            score: 0,
            evidence: "Letter from neurosurgery supervisor",
            options: [
              { label: "Neurosurgery taster week (≥5 days) or elective (≥4 weeks)", score: 4 },
              { label: "Attended neurosurgery course or conference", score: 2 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 13. Dermatology ─────────────────────────────────────────────────────────
  {
    id: "dermatology",
    name: "Dermatology",
    shortName: "Derm",
    applicationRoute: "Specialty Training",
    msraRequired: false,
    totalMaxScore: 32,
    competitiveThreshold: 24,
    sourceUrl: "https://www.bsdermatology.co.uk/training/specialty-training/",
    description: "ST3 entry specialty. Highly competitive with portfolio-based shortlisting via Oriel. Requires strong academic and clinical evidence.",
    domains: [
      {
        id: "derm_qualifications",
        name: "Postgraduate Degrees & Qualifications",
        maxScore: 4,
        criteria: [
          {
            id: "derm_q1",
            criterion: "Highest postgraduate degree or qualification",
            score: 0,
            evidence: "Certificate/transcript of degree",
            options: [
              { label: "PhD or MD by research", score: 4 },
              { label: "Masters degree (MSc, MRes, MA) – ≥8 months", score: 3 },
              { label: "Postgraduate diploma (PgDip) – ≥4 months", score: 2 },
              { label: "Postgraduate certificate (PgCert) – ≥2 months", score: 1 },
              { label: "None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "derm_publications",
        name: "Publications",
        maxScore: 8,
        criteria: [
          {
            id: "derm_pub1",
            criterion: "Best publication level",
            score: 0,
            evidence: "PubMed/DOI link or journal citation",
            options: [
              { label: "First author paper in peer-reviewed journal (PubMed indexed)", score: 8 },
              { label: "First author paper in peer-reviewed journal (not indexed)", score: 6 },
              { label: "Co-author paper in peer-reviewed journal (PubMed indexed)", score: 5 },
              { label: "Co-author paper in peer-reviewed journal (not indexed)", score: 3 },
              { label: "Published case report or letter", score: 2 },
              { label: "Published abstract only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "derm_presentations",
        name: "Presentations & Posters",
        maxScore: 6,
        criteria: [
          {
            id: "derm_pres1",
            criterion: "Best level of presentation at a medical meeting",
            score: 0,
            evidence: "Programme/certificate with your name and title",
            options: [
              { label: "Oral presentation at national or international meeting", score: 6 },
              { label: "Oral presentation at regional meeting", score: 4 },
              { label: "Poster at national or international meeting", score: 3 },
              { label: "Poster at regional meeting", score: 2 },
              { label: "Presentation at local (trust) meeting", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "derm_teaching",
        name: "Teaching & Education",
        maxScore: 4,
        criteria: [
          {
            id: "derm_t1",
            criterion: "Evidence of formal teaching or teaching qualification",
            score: 0,
            evidence: "Certificate or teaching portfolio evidence",
            options: [
              { label: "Formal teaching qualification (PgCert in Medical Education or equivalent)", score: 4 },
              { label: "Sustained teaching programme with feedback (≥3 sessions)", score: 3 },
              { label: "Some formal teaching with feedback (1–2 sessions)", score: 2 },
              { label: "Informal teaching only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "derm_audit_qip",
        name: "Audit & Quality Improvement",
        maxScore: 4,
        criteria: [
          {
            id: "derm_aud1",
            criterion: "Completed clinical audit or QIP",
            score: 0,
            evidence: "Audit report or QI project documentation",
            options: [
              { label: "Completed full audit cycle or QIP with re-audit", score: 4 },
              { label: "Completed audit or QIP (no re-audit)", score: 3 },
              { label: "Participated in audit data collection", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "derm_leadership",
        name: "Leadership & Management",
        maxScore: 3,
        criteria: [
          {
            id: "derm_lead1",
            criterion: "Leadership or management role",
            score: 0,
            evidence: "Letter or certificate confirming role",
            options: [
              { label: "National or regional leadership role (committee, society officer)", score: 3 },
              { label: "Local leadership role (department lead, rota coordinator)", score: 2 },
              { label: "Participated in leadership activity", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "derm_clinical_exp",
        name: "Dermatology Clinical Experience",
        maxScore: 3,
        criteria: [
          {
            id: "derm_clin1",
            criterion: "Relevant dermatology clinical experience",
            score: 0,
            evidence: "Supervisor letter or job description",
            options: [
              { label: "≥6 months dermatology post (SHO or above)", score: 3 },
              { label: "Dermatology taster week or elective (≥4 weeks)", score: 2 },
              { label: "Attended dermatology course or conference", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 14. Cardiology (ST3) ─────────────────────────────────────────────────
  {
    id: "cardiology",
    name: "Cardiology",
    shortName: "Cardio",
    applicationRoute: "Specialty Training",
    msraRequired: false,
    totalMaxScore: 32,
    competitiveThreshold: 25,
    sourceUrl: "https://www.bcs.com/education-and-research/training-and-accreditation/cardiology-training",
    description: "ST3 entry after IMT/ACCS. Highly competitive. Portfolio-based shortlisting with strong emphasis on research and academic output.",
    domains: [
      {
        id: "cardio_qualifications",
        name: "Postgraduate Degrees & Qualifications",
        maxScore: 4,
        criteria: [
          {
            id: "cardio_q1",
            criterion: "Highest postgraduate degree or qualification",
            score: 0,
            evidence: "Certificate/transcript of degree",
            options: [
              { label: "PhD or MD by research", score: 4 },
              { label: "Masters degree (MSc, MRes, MA) – ≥8 months", score: 3 },
              { label: "Postgraduate diploma (PgDip) – ≥4 months", score: 2 },
              { label: "Postgraduate certificate (PgCert) – ≥2 months", score: 1 },
              { label: "None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "cardio_publications",
        name: "Publications",
        maxScore: 8,
        criteria: [
          {
            id: "cardio_pub1",
            criterion: "Best publication level",
            score: 0,
            evidence: "PubMed/DOI link or journal citation",
            options: [
              { label: "First author paper in peer-reviewed journal (PubMed indexed)", score: 8 },
              { label: "First author paper in peer-reviewed journal (not indexed)", score: 6 },
              { label: "Co-author paper in peer-reviewed journal (PubMed indexed)", score: 5 },
              { label: "Co-author paper in peer-reviewed journal (not indexed)", score: 3 },
              { label: "Published case report or letter", score: 2 },
              { label: "Published abstract only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "cardio_presentations",
        name: "Presentations & Posters",
        maxScore: 6,
        criteria: [
          {
            id: "cardio_pres1",
            criterion: "Best level of presentation at a medical meeting",
            score: 0,
            evidence: "Programme/certificate with your name and title",
            options: [
              { label: "Oral presentation at national or international meeting", score: 6 },
              { label: "Oral presentation at regional meeting", score: 4 },
              { label: "Poster at national or international meeting", score: 3 },
              { label: "Poster at regional meeting", score: 2 },
              { label: "Presentation at local (trust) meeting", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "cardio_teaching",
        name: "Teaching & Education",
        maxScore: 4,
        criteria: [
          {
            id: "cardio_t1",
            criterion: "Evidence of formal teaching or teaching qualification",
            score: 0,
            evidence: "Certificate or teaching portfolio evidence",
            options: [
              { label: "Formal teaching qualification (PgCert in Medical Education or equivalent)", score: 4 },
              { label: "Sustained teaching programme with feedback (≥3 sessions)", score: 3 },
              { label: "Some formal teaching with feedback (1–2 sessions)", score: 2 },
              { label: "Informal teaching only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "cardio_audit_qip",
        name: "Audit & Quality Improvement",
        maxScore: 4,
        criteria: [
          {
            id: "cardio_aud1",
            criterion: "Completed clinical audit or QIP",
            score: 0,
            evidence: "Audit report or QI project documentation",
            options: [
              { label: "Completed full audit cycle or QIP with re-audit", score: 4 },
              { label: "Completed audit or QIP (no re-audit)", score: 3 },
              { label: "Participated in audit data collection", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "cardio_leadership",
        name: "Leadership & Management",
        maxScore: 3,
        criteria: [
          {
            id: "cardio_lead1",
            criterion: "Leadership or management role",
            score: 0,
            evidence: "Letter or certificate confirming role",
            options: [
              { label: "National or regional leadership role (committee, society officer)", score: 3 },
              { label: "Local leadership role (department lead, rota coordinator)", score: 2 },
              { label: "Participated in leadership activity", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "cardio_clinical_exp",
        name: "Cardiology Clinical Experience",
        maxScore: 3,
        criteria: [
          {
            id: "cardio_clin1",
            criterion: "Relevant cardiology or IMT clinical experience",
            score: 0,
            evidence: "Supervisor letter or job description",
            options: [
              { label: "Completed IMT/ACCS with cardiology attachment or ≥6 months cardiology", score: 3 },
              { label: "Cardiology taster week or elective (≥4 weeks)", score: 2 },
              { label: "Attended cardiology course or conference (e.g., BSE echo)", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 15. Neurology (ST3) ──────────────────────────────────────────────────
  {
    id: "neurology",
    name: "Neurology",
    shortName: "Neuro",
    applicationRoute: "Specialty Training",
    msraRequired: false,
    totalMaxScore: 32,
    competitiveThreshold: 24,
    sourceUrl: "https://www.theabn.org/page/training",
    description: "ST3 entry after IMT. Portfolio-based shortlisting. Strong academic output and neurology experience are key differentiators.",
    domains: [
      {
        id: "neuro_st3_qualifications",
        name: "Postgraduate Degrees & Qualifications",
        maxScore: 4,
        criteria: [
          {
            id: "neuro_st3_q1",
            criterion: "Highest postgraduate degree or qualification",
            score: 0,
            evidence: "Certificate/transcript of degree",
            options: [
              { label: "PhD or MD by research", score: 4 },
              { label: "Masters degree (MSc, MRes, MA) – ≥8 months", score: 3 },
              { label: "Postgraduate diploma (PgDip) – ≥4 months", score: 2 },
              { label: "Postgraduate certificate (PgCert) – ≥2 months", score: 1 },
              { label: "None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "neuro_st3_publications",
        name: "Publications",
        maxScore: 8,
        criteria: [
          {
            id: "neuro_st3_pub1",
            criterion: "Best publication level",
            score: 0,
            evidence: "PubMed/DOI link or journal citation",
            options: [
              { label: "First author paper in peer-reviewed journal (PubMed indexed)", score: 8 },
              { label: "First author paper in peer-reviewed journal (not indexed)", score: 6 },
              { label: "Co-author paper in peer-reviewed journal (PubMed indexed)", score: 5 },
              { label: "Co-author paper in peer-reviewed journal (not indexed)", score: 3 },
              { label: "Published case report or letter", score: 2 },
              { label: "Published abstract only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "neuro_st3_presentations",
        name: "Presentations & Posters",
        maxScore: 6,
        criteria: [
          {
            id: "neuro_st3_pres1",
            criterion: "Best level of presentation at a medical meeting",
            score: 0,
            evidence: "Programme/certificate with your name and title",
            options: [
              { label: "Oral presentation at national or international meeting", score: 6 },
              { label: "Oral presentation at regional meeting", score: 4 },
              { label: "Poster at national or international meeting", score: 3 },
              { label: "Poster at regional meeting", score: 2 },
              { label: "Presentation at local (trust) meeting", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "neuro_st3_teaching",
        name: "Teaching & Education",
        maxScore: 4,
        criteria: [
          {
            id: "neuro_st3_t1",
            criterion: "Evidence of formal teaching or teaching qualification",
            score: 0,
            evidence: "Certificate or teaching portfolio evidence",
            options: [
              { label: "Formal teaching qualification (PgCert in Medical Education or equivalent)", score: 4 },
              { label: "Sustained teaching programme with feedback (≥3 sessions)", score: 3 },
              { label: "Some formal teaching with feedback (1–2 sessions)", score: 2 },
              { label: "Informal teaching only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "neuro_st3_audit_qip",
        name: "Audit & Quality Improvement",
        maxScore: 4,
        criteria: [
          {
            id: "neuro_st3_aud1",
            criterion: "Completed clinical audit or QIP",
            score: 0,
            evidence: "Audit report or QI project documentation",
            options: [
              { label: "Completed full audit cycle or QIP with re-audit", score: 4 },
              { label: "Completed audit or QIP (no re-audit)", score: 3 },
              { label: "Participated in audit data collection", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "neuro_st3_leadership",
        name: "Leadership & Management",
        maxScore: 3,
        criteria: [
          {
            id: "neuro_st3_lead1",
            criterion: "Leadership or management role",
            score: 0,
            evidence: "Letter or certificate confirming role",
            options: [
              { label: "National or regional leadership role (committee, society officer)", score: 3 },
              { label: "Local leadership role (department lead, rota coordinator)", score: 2 },
              { label: "Participated in leadership activity", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "neuro_st3_clinical_exp",
        name: "Neurology Clinical Experience",
        maxScore: 3,
        criteria: [
          {
            id: "neuro_st3_clin1",
            criterion: "Relevant neurology clinical experience",
            score: 0,
            evidence: "Supervisor letter or job description",
            options: [
              { label: "≥6 months neurology post (SHO or above)", score: 3 },
              { label: "Neurology taster week or elective (≥4 weeks)", score: 2 },
              { label: "Attended neurology course or ABN conference", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 16. Gastroenterology (ST3) ───────────────────────────────────────────
  {
    id: "gastroenterology",
    name: "Gastroenterology",
    shortName: "Gastro",
    applicationRoute: "Specialty Training",
    msraRequired: false,
    totalMaxScore: 32,
    competitiveThreshold: 24,
    sourceUrl: "https://www.bsg.org.uk/education-training/training/specialty-training/",
    description: "ST3 entry after IMT. Portfolio-based shortlisting. Research output and endoscopy experience are highly valued.",
    domains: [
      {
        id: "gastro_qualifications",
        name: "Postgraduate Degrees & Qualifications",
        maxScore: 4,
        criteria: [
          {
            id: "gastro_q1",
            criterion: "Highest postgraduate degree or qualification",
            score: 0,
            evidence: "Certificate/transcript of degree",
            options: [
              { label: "PhD or MD by research", score: 4 },
              { label: "Masters degree (MSc, MRes, MA) – ≥8 months", score: 3 },
              { label: "Postgraduate diploma (PgDip) – ≥4 months", score: 2 },
              { label: "Postgraduate certificate (PgCert) – ≥2 months", score: 1 },
              { label: "None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "gastro_publications",
        name: "Publications",
        maxScore: 8,
        criteria: [
          {
            id: "gastro_pub1",
            criterion: "Best publication level",
            score: 0,
            evidence: "PubMed/DOI link or journal citation",
            options: [
              { label: "First author paper in peer-reviewed journal (PubMed indexed)", score: 8 },
              { label: "First author paper in peer-reviewed journal (not indexed)", score: 6 },
              { label: "Co-author paper in peer-reviewed journal (PubMed indexed)", score: 5 },
              { label: "Co-author paper in peer-reviewed journal (not indexed)", score: 3 },
              { label: "Published case report or letter", score: 2 },
              { label: "Published abstract only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "gastro_presentations",
        name: "Presentations & Posters",
        maxScore: 6,
        criteria: [
          {
            id: "gastro_pres1",
            criterion: "Best level of presentation at a medical meeting",
            score: 0,
            evidence: "Programme/certificate with your name and title",
            options: [
              { label: "Oral presentation at national or international meeting", score: 6 },
              { label: "Oral presentation at regional meeting", score: 4 },
              { label: "Poster at national or international meeting", score: 3 },
              { label: "Poster at regional meeting", score: 2 },
              { label: "Presentation at local (trust) meeting", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "gastro_teaching",
        name: "Teaching & Education",
        maxScore: 4,
        criteria: [
          {
            id: "gastro_t1",
            criterion: "Evidence of formal teaching or teaching qualification",
            score: 0,
            evidence: "Certificate or teaching portfolio evidence",
            options: [
              { label: "Formal teaching qualification (PgCert in Medical Education or equivalent)", score: 4 },
              { label: "Sustained teaching programme with feedback (≥3 sessions)", score: 3 },
              { label: "Some formal teaching with feedback (1–2 sessions)", score: 2 },
              { label: "Informal teaching only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "gastro_audit_qip",
        name: "Audit & Quality Improvement",
        maxScore: 4,
        criteria: [
          {
            id: "gastro_aud1",
            criterion: "Completed clinical audit or QIP",
            score: 0,
            evidence: "Audit report or QI project documentation",
            options: [
              { label: "Completed full audit cycle or QIP with re-audit", score: 4 },
              { label: "Completed audit or QIP (no re-audit)", score: 3 },
              { label: "Participated in audit data collection", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "gastro_leadership",
        name: "Leadership & Management",
        maxScore: 3,
        criteria: [
          {
            id: "gastro_lead1",
            criterion: "Leadership or management role",
            score: 0,
            evidence: "Letter or certificate confirming role",
            options: [
              { label: "National or regional leadership role (committee, society officer)", score: 3 },
              { label: "Local leadership role (department lead, rota coordinator)", score: 2 },
              { label: "Participated in leadership activity", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "gastro_clinical_exp",
        name: "Gastroenterology Clinical Experience",
        maxScore: 3,
        criteria: [
          {
            id: "gastro_clin1",
            criterion: "Relevant gastroenterology or endoscopy experience",
            score: 0,
            evidence: "Supervisor letter or job description",
            options: [
              { label: "≥6 months gastroenterology post (SHO or above) or endoscopy training", score: 3 },
              { label: "Gastroenterology taster week or elective (≥4 weeks)", score: 2 },
              { label: "Attended BSG course or gastroenterology conference", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 17. Endocrinology & Diabetes (ST3) ───────────────────────────────────
  {
    id: "endocrinology",
    name: "Endocrinology & Diabetes",
    shortName: "Endo",
    applicationRoute: "Specialty Training",
    msraRequired: false,
    totalMaxScore: 32,
    competitiveThreshold: 23,
    sourceUrl: "https://www.sfebes.org.uk/training-education/specialty-training/",
    description: "ST3 entry after IMT. Portfolio-based shortlisting. Research in diabetes/endocrinology and clinical experience are key.",
    domains: [
      {
        id: "endo_qualifications",
        name: "Postgraduate Degrees & Qualifications",
        maxScore: 4,
        criteria: [
          {
            id: "endo_q1",
            criterion: "Highest postgraduate degree or qualification",
            score: 0,
            evidence: "Certificate/transcript of degree",
            options: [
              { label: "PhD or MD by research", score: 4 },
              { label: "Masters degree (MSc, MRes, MA) – ≥8 months", score: 3 },
              { label: "Postgraduate diploma (PgDip) – ≥4 months", score: 2 },
              { label: "Postgraduate certificate (PgCert) – ≥2 months", score: 1 },
              { label: "None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "endo_publications",
        name: "Publications",
        maxScore: 8,
        criteria: [
          {
            id: "endo_pub1",
            criterion: "Best publication level",
            score: 0,
            evidence: "PubMed/DOI link or journal citation",
            options: [
              { label: "First author paper in peer-reviewed journal (PubMed indexed)", score: 8 },
              { label: "First author paper in peer-reviewed journal (not indexed)", score: 6 },
              { label: "Co-author paper in peer-reviewed journal (PubMed indexed)", score: 5 },
              { label: "Co-author paper in peer-reviewed journal (not indexed)", score: 3 },
              { label: "Published case report or letter", score: 2 },
              { label: "Published abstract only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "endo_presentations",
        name: "Presentations & Posters",
        maxScore: 6,
        criteria: [
          {
            id: "endo_pres1",
            criterion: "Best level of presentation at a medical meeting",
            score: 0,
            evidence: "Programme/certificate with your name and title",
            options: [
              { label: "Oral presentation at national or international meeting", score: 6 },
              { label: "Oral presentation at regional meeting", score: 4 },
              { label: "Poster at national or international meeting", score: 3 },
              { label: "Poster at regional meeting", score: 2 },
              { label: "Presentation at local (trust) meeting", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "endo_teaching",
        name: "Teaching & Education",
        maxScore: 4,
        criteria: [
          {
            id: "endo_t1",
            criterion: "Evidence of formal teaching or teaching qualification",
            score: 0,
            evidence: "Certificate or teaching portfolio evidence",
            options: [
              { label: "Formal teaching qualification (PgCert in Medical Education or equivalent)", score: 4 },
              { label: "Sustained teaching programme with feedback (≥3 sessions)", score: 3 },
              { label: "Some formal teaching with feedback (1–2 sessions)", score: 2 },
              { label: "Informal teaching only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "endo_audit_qip",
        name: "Audit & Quality Improvement",
        maxScore: 4,
        criteria: [
          {
            id: "endo_aud1",
            criterion: "Completed clinical audit or QIP",
            score: 0,
            evidence: "Audit report or QI project documentation",
            options: [
              { label: "Completed full audit cycle or QIP with re-audit", score: 4 },
              { label: "Completed audit or QIP (no re-audit)", score: 3 },
              { label: "Participated in audit data collection", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "endo_leadership",
        name: "Leadership & Management",
        maxScore: 3,
        criteria: [
          {
            id: "endo_lead1",
            criterion: "Leadership or management role",
            score: 0,
            evidence: "Letter or certificate confirming role",
            options: [
              { label: "National or regional leadership role (committee, society officer)", score: 3 },
              { label: "Local leadership role (department lead, rota coordinator)", score: 2 },
              { label: "Participated in leadership activity", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "endo_clinical_exp",
        name: "Endocrinology/Diabetes Clinical Experience",
        maxScore: 3,
        criteria: [
          {
            id: "endo_clin1",
            criterion: "Relevant endocrinology or diabetes clinical experience",
            score: 0,
            evidence: "Supervisor letter or job description",
            options: [
              { label: "≥6 months endocrinology/diabetes post (SHO or above)", score: 3 },
              { label: "Endocrinology taster week or elective (≥4 weeks)", score: 2 },
              { label: "Attended SfE/ABCD course or conference", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },

  // ─── 18. Respiratory Medicine (ST3) ───────────────────────────────────────
  {
    id: "respiratory",
    name: "Respiratory Medicine",
    shortName: "Resp",
    applicationRoute: "Specialty Training",
    msraRequired: false,
    totalMaxScore: 32,
    competitiveThreshold: 23,
    sourceUrl: "https://www.brit-thoracic.org.uk/education-and-research/training-and-education/",
    description: "ST3 entry after IMT. Portfolio-based shortlisting. Research output and respiratory clinical experience are key differentiators.",
    domains: [
      {
        id: "resp_qualifications",
        name: "Postgraduate Degrees & Qualifications",
        maxScore: 4,
        criteria: [
          {
            id: "resp_q1",
            criterion: "Highest postgraduate degree or qualification",
            score: 0,
            evidence: "Certificate/transcript of degree",
            options: [
              { label: "PhD or MD by research", score: 4 },
              { label: "Masters degree (MSc, MRes, MA) – ≥8 months", score: 3 },
              { label: "Postgraduate diploma (PgDip) – ≥4 months", score: 2 },
              { label: "Postgraduate certificate (PgCert) – ≥2 months", score: 1 },
              { label: "None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "resp_publications",
        name: "Publications",
        maxScore: 8,
        criteria: [
          {
            id: "resp_pub1",
            criterion: "Best publication level",
            score: 0,
            evidence: "PubMed/DOI link or journal citation",
            options: [
              { label: "First author paper in peer-reviewed journal (PubMed indexed)", score: 8 },
              { label: "First author paper in peer-reviewed journal (not indexed)", score: 6 },
              { label: "Co-author paper in peer-reviewed journal (PubMed indexed)", score: 5 },
              { label: "Co-author paper in peer-reviewed journal (not indexed)", score: 3 },
              { label: "Published case report or letter", score: 2 },
              { label: "Published abstract only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "resp_presentations",
        name: "Presentations & Posters",
        maxScore: 6,
        criteria: [
          {
            id: "resp_pres1",
            criterion: "Best level of presentation at a medical meeting",
            score: 0,
            evidence: "Programme/certificate with your name and title",
            options: [
              { label: "Oral presentation at national or international meeting", score: 6 },
              { label: "Oral presentation at regional meeting", score: 4 },
              { label: "Poster at national or international meeting", score: 3 },
              { label: "Poster at regional meeting", score: 2 },
              { label: "Presentation at local (trust) meeting", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "resp_teaching",
        name: "Teaching & Education",
        maxScore: 4,
        criteria: [
          {
            id: "resp_t1",
            criterion: "Evidence of formal teaching or teaching qualification",
            score: 0,
            evidence: "Certificate or teaching portfolio evidence",
            options: [
              { label: "Formal teaching qualification (PgCert in Medical Education or equivalent)", score: 4 },
              { label: "Sustained teaching programme with feedback (≥3 sessions)", score: 3 },
              { label: "Some formal teaching with feedback (1–2 sessions)", score: 2 },
              { label: "Informal teaching only", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "resp_audit_qip",
        name: "Audit & Quality Improvement",
        maxScore: 4,
        criteria: [
          {
            id: "resp_aud1",
            criterion: "Completed clinical audit or QIP",
            score: 0,
            evidence: "Audit report or QI project documentation",
            options: [
              { label: "Completed full audit cycle or QIP with re-audit", score: 4 },
              { label: "Completed audit or QIP (no re-audit)", score: 3 },
              { label: "Participated in audit data collection", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "resp_leadership",
        name: "Leadership & Management",
        maxScore: 3,
        criteria: [
          {
            id: "resp_lead1",
            criterion: "Leadership or management role",
            score: 0,
            evidence: "Letter or certificate confirming role",
            options: [
              { label: "National or regional leadership role (committee, society officer)", score: 3 },
              { label: "Local leadership role (department lead, rota coordinator)", score: 2 },
              { label: "Participated in leadership activity", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
      {
        id: "resp_clinical_exp",
        name: "Respiratory Clinical Experience",
        maxScore: 3,
        criteria: [
          {
            id: "resp_clin1",
            criterion: "Relevant respiratory clinical experience",
            score: 0,
            evidence: "Supervisor letter or job description",
            options: [
              { label: "≥6 months respiratory medicine post (SHO or above)", score: 3 },
              { label: "Respiratory taster week or elective (≥4 weeks)", score: 2 },
              { label: "Attended BTS course or respiratory conference", score: 1 },
              { label: "None", score: 0 },
            ],
          },
        ],
      },
    ],
  },
];

export function getSpecialtyById(id: string): SASSpecialty | undefined {
  return SAS_SPECIALTIES.find(s => s.id === id);
}

export function calculateSASScore(
  specialtyId: string,
  answers: Record<string, number>
): { totalScore: number; maxScore: number; domainScores: Record<string, { score: number; maxScore: number }> } {
  const specialty = getSpecialtyById(specialtyId);
  if (!specialty) return { totalScore: 0, maxScore: 0, domainScores: {} };

  let totalScore = 0;
  const domainScores: Record<string, { score: number; maxScore: number }> = {};

  for (const domain of specialty.domains) {
    let domainScore = 0;
    for (const criterion of domain.criteria) {
      const answer = answers[criterion.id] ?? 0;
      domainScore += answer;
    }
    // Cap domain score at maxScore
    domainScore = Math.min(domainScore, domain.maxScore);
    domainScores[domain.id] = { score: domainScore, maxScore: domain.maxScore };
    totalScore += domainScore;
  }

  return { totalScore, maxScore: specialty.totalMaxScore, domainScores };
}
