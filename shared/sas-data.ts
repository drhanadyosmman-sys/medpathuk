// UK Medical Specialty Self-Assessment Score (SAS) Data
//
// PROVENANCE: every specialty's scoring matrix below carries an entry in
// SAS_VERIFICATION at the bottom of this file recording whether it has been
// checked against the official recruitment source, and for which cycle.
// Nothing here is presented to users as official until its entry says
// status: "verified". Anything without an entry is treated as unverified.
// See getVerification() — the default is deliberately the safe one.

/**
 * How a specialty's recruitment score is actually produced. This decides
 * whether a self-assessment tool can model the specialty at all.
 *
 *  - "self-assessment"     Applicant assigns their own score or category on the
 *                          application form, and that is what gets used. A tool
 *                          can mirror this exactly.
 *  - "interview-portfolio" Portfolio content is scored, but by a panel at
 *                          interview rather than on the form. The portfolio
 *                          matters a great deal here — it simply cannot be
 *                          self-scored in advance, so the tool shows what the
 *                          panel marks instead of producing a number.
 *  - "msra-only"           No portfolio is scored at any stage; ranking comes
 *                          from the MSRA exam alone. Distinct from the case
 *                          above, and the difference changes what an applicant
 *                          should spend their time on.
 *  - "unknown"             Not yet established. Treated as unverified.
 */
export type SASScoringModel =
  | "self-assessment"
  | "interview-portfolio"
  | "msra-only"
  | "unknown";

/**
 * Models where the applicant cannot put a number on themselves in advance.
 *
 * Note this includes "interview-portfolio", where the portfolio is scored but
 * by a panel on the day. Offering a self-assessed total there would be
 * inventing a figure that does not exist in the process.
 */
const NON_SCORABLE_MODELS: SASScoringModel[] = ["msra-only", "interview-portfolio"];

/**
 * How the interview stage is scored, where a specialty publishes it.
 *
 * This is deliberately NOT part of the domain matrix and is never added to the
 * self-assessment total. Interview marks are awarded by interviewers on the
 * day, so an applicant cannot self-score them — presenting them as something
 * you can total up in advance is exactly the error this tool is being audited
 * for. It is shown as context after the result instead.
 */
export interface SASInterviewScoring {
  /** Maximum raw interview score, before any weighting is applied. */
  rawMaxScore: number;
  /** Maximum weighted total that determines ranking, where published. */
  weightedMaxScore?: number;
  /** How that raw score is produced. */
  description: string;
  /**
   * Whether the shortlisting score is carried into the final ranking.
   *
   * This matters more than anything else the tool reports. Where it is false,
   * the portfolio's entire job is to win an interview, and everything after
   * that is decided on the day — so telling an applicant to keep building
   * portfolio evidence once they are comfortably shortlisted is bad advice.
   */
  shortlistingScoreCarriesForward?: boolean;
  /** Hard gates that make an application unappointable regardless of rank. */
  appointabilityCriteria?: string[];
  /** Assessment areas making up the ranked total. */
  weightedAreas?: {
    area: string;
    /** How the area is marked, e.g. a multiplier or number of assessors. */
    weighting: string;
    /**
     * Marks available. Omitted where the official guidance names the assessed
     * areas but does not publish their point values — listing the areas is
     * still useful, and inventing the numbers is what this audit exists to
     * undo.
     */
    maxScore?: number;
  }[];
}

/** One thing an applicant must satisfy before they can apply at all. */
export interface SASEligibilityRequirement {
  title: string;
  detail: string;
}

/**
 * Entry requirements for a specialty.
 *
 * Shown before the scoring domains because eligibility gates everything: a
 * maxed-out portfolio is worth nothing if the applicant cannot apply. Several
 * of these (CREST sign-off, GMC registration) take months to arrange, so an
 * applicant needs to see them early rather than after scoring themselves.
 */
export interface SASEligibility {
  /** Recruitment cycle these requirements were taken from. */
  cycle: string;
  requirements: SASEligibilityRequirement[];
}

/**
 * What an applicant must be able to prove for the points they claim.
 *
 * Scoring is self-assessed and usually unaudited, which makes it easy to claim
 * points you cannot document. The consequences of that land later and are
 * severe, so the requirements belong next to the score, not in a separate guide.
 */
export interface SASEvidenceGuidance {
  /** Conditions that stop an application progressing, regardless of score. */
  hardFails: string[];
  /** Practical rules for preparing and submitting evidence. */
  rules: string[];
}

/**
 * How offers are made once ranking is settled.
 *
 * Only the rules that change what an applicant should do are recorded here.
 * Deliberately excluded: the mechanics of the Oriel interface and regional
 * programme detail. Both change between cycles, and stale guidance that looks
 * current is the failure this data set is being corrected for.
 */
export interface SASOffersGuidance {
  points: SASEligibilityRequirement[];
}

/** Provenance record for one specialty's scoring matrix. */
export interface SASVerification {
  status: "verified" | "unverified";
  scoringModel: SASScoringModel;
  /** ISO date the matrix was last checked against the official source. */
  checkedOn: string | null;
  /** Recruitment cycle the matrix applies to, e.g. "2026". */
  cycle: string | null;
  /** What is known to be wrong or outstanding. Shown in-app when unverified. */
  note?: string;
}

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
  /** Context about the interview stage. Never scored by this tool. */
  interviewScoring?: SASInterviewScoring;
  /** Entry requirements, shown before the applicant scores themselves. */
  eligibility?: SASEligibility;
  /** What the applicant must be able to prove for the points they claim. */
  evidenceGuidance?: SASEvidenceGuidance;
  /** How offers are made once ranking is settled. */
  offersGuidance?: SASOffersGuidance;
}

export const SAS_SPECIALTIES: SASSpecialty[] = [
  // ─── 1. Internal Medicine Training (IMT) ─────────────────────────────────
  // VERIFIED against the official IMT 2026 application scoring guidance.
  // Source: https://imtrecruitment.org.uk/recruitment-process/applying/application-scoring
  //
  // Shortlisting score = self-assessment (max 30) + unique-applicant points
  // (5 or 0) = max 35. The six self-assessment domains and their maxima are
  // Postgraduate 4, Presentations 6, Publications 8, Teaching experience 5,
  // Training in teaching 3, Quality improvement 4 — totalling 30.
  {
    id: "imt",
    name: "Internal Medicine Training (IMT)",
    shortName: "IMT",
    applicationRoute: "Core Training",
    msraRequired: false,
    totalMaxScore: 35,
    competitiveThreshold: null,
    sourceUrl: "https://imtrecruitment.org.uk/recruitment-process/applying/application-scoring",
    description: "3-year core medical training programme (IMT1-3), which replaced Core Medical Training in 2019. Applications are made via Oriel and shortlisted on a self-assessed score out of 30, plus 5 points for applying only to IMT/ACCS-IM in Round 1.",
    interviewScoring: {
      rawMaxScore: 70,
      weightedMaxScore: 96,
      shortlistingScoreCarriesForward: false,
      description:
        "Shortlisted applicants are interviewed on seven aspects of their candidature. Two interviewers score each aspect from 1 to 5, giving 14 marks and a raw interview score between 14 and 70. A weighting is then applied to each area to produce the total score out of 96 that determines your ranking. A mark of 3/5 is satisfactory and reflects the level expected of a trainee ready to progress to IMT; 4/5 is the level expected on completing F2 and 5/5 the level expected at IMT or above.",
      appointabilityCriteria: [
        "None of your 14 interview scores may be 1/5",
        "No more than two of your 14 interview scores may be 2/5",
        "Your raw interview score must be 42 or above",
      ],
      weightedAreas: [
        { area: "Application and achievements (Station 1, Q1)", weighting: "x1.6", maxScore: 16 },
        { area: "Suitability for IMT (Station 1, Q1)", weighting: "x1.6", maxScore: 16 },
        { area: "Ethics, professionalism and governance (Station 1, Q2)", weighting: "x1.2", maxScore: 12 },
        { area: "Communication (Station 1, Q3)", weighting: "x1.6", maxScore: 16 },
        { area: "Clinical scenario — investigations, diagnosis, management (Station 2)", weighting: "x1.2", maxScore: 12 },
        { area: "Clinical scenario — patient handover (Station 2)", weighting: "x0.8", maxScore: 8 },
        { area: "Communication (Station 2)", weighting: "x1.6", maxScore: 16 },
      ],
    },
    offersGuidance: {
      points: [
        {
          title: "Every programme starts in 'not wanted'",
          detail:
            "Nothing is preferenced for you. If you miss the preference deadline you cannot be made an offer at all, however well you scored. Set aside real time for it — in a recent applicant survey 79% took over three hours and 37% took more than ten, choosing from over 1,500 options. The drag-and-drop interface does not work properly on phones or tablets, so use a laptop or desktop.",
        },
        {
          title: "Ranking your preferences cannot game the outcome",
          detail:
            "Whether you get an offer depends only on your total score, the number of posts available, and how many programmes you preferenced. The order changes which post you are offered, not your chances of one. Putting an unpopular post first does not get you an offer sooner: once your rank is reached you are considered for all your preferences ahead of anyone ranked below you.",
        },
        {
          title: "Only preference posts you would genuinely accept",
          detail:
            "Declining an offer takes you out of contention for the specialty entirely. Being unplaced and on the reserve list is a better position than holding an offer you do not want and hoping to upgrade, because by the holding deadline you must decline it and are then out. Include programmes showing zero places in the order you would want them — places are sometimes added later and there is no penalty for listing them.",
        },
      ],
    },
    evidenceGuidance: {
      hardFails: [
        "Supplying no evidence at all, or no evidence for three or more of your scored achievements, stops your application progressing",
        "Patient-identifiable data found in your documents — including hospital or NHS ID numbers — is likely to be reported to your employer, supervisor and region. Redact everything before you upload",
      ],
      rules: [
        "You will usually not be asked for evidence — it is requested only in a randomised fairness audit, or if there are concerns about your self-assessment. You must still have documentation available for every achievement you claim from the moment you apply.",
        "You cannot upload anything before a request is sent. If asked, you get at least one week to supply it.",
        "Upload only what justifies the option you selected. If you claimed a national presentation, do not include your other presentations; if you claimed a book chapter, include only enough pages to verify it.",
        "Do not include evidence for courses or commitment-to-specialty entries unless they relate to a scored option.",
        "Tag each document to the domain it supports. One document can be tagged to more than one domain — a presentation based on a QI project can count for both.",
        "PDFs or image files only, maximum 5MB each.",
        "Anything not in English must be translated for credit to be given.",
        "Assessors verify evidence quickly, and poorly organised documents may mean an achievement cannot be verified at all.",
      ],
    },
    eligibility: {
      cycle: "2026",
      requirements: [
        {
          title: "Full GMC registration by the time you apply",
          detail:
            "Changed for 2026 recruitment: you must already hold full GMC registration and appear on the GMC register when you submit your application. If your record cannot be found on the register you are not eligible. A licence to practise is separate and is not needed until the start date of an accepted offer.",
        },
        {
          title: "24 months' experience by the post start date",
          detail:
            "At least 24 months working as a doctor — 12 months pre-registration and 12 months post-registration. Experience gained in any country counts, and any specialty counts provided it is postgraduate working or training. You may apply on the basis that you will have gained this by the start date.",
        },
        {
          title: "12 of those months after full registration eligibility",
          detail:
            "At least 12 months must come after you became eligible for full GMC registration. If you qualified outside the UK this can mean 12 months after eligibility for full registration with your country's equivalent regulator — you do not need to have worked 12 months after registering with the GMC itself. Where the pre-registration year sits before graduation, that year normally counts as the first 12 months.",
        },
        {
          title: "Foundation competence",
          detail:
            "You must evidence competences equivalent to a doctor who has completed UK foundation training. How you show this depends on your background: current F2, completed F2 (within three and a half years of the post start date — February 2023 for the 2026 intake), current specialty trainee, or a Certificate of Readiness to Enter Specialty Training (CREST) if none of those apply. Separate arrangements exist for refugee doctors. A CREST needs a suitable signatory and takes time to arrange, so start early.",
        },
        {
          title: "English language",
          detail:
            "No separate evidence is required — proof of English is part of GMC registration, which is already mandatory. Your communication skills are assessed at interview.",
        },
        {
          title: "Right to work",
          detail:
            "All medical practitioners have been on the UK Shortage Occupation List since 6 October 2019 and are exempt from the Resident Labour Market Test, so you can apply for any specialty in any round subject to eligibility. The recruitment office cannot advise on immigration or visas — those queries go to the UK Home Office.",
        },
      ],
    },
    domains: [
      {
        id: "imt_unique",
        name: "Unique Applicant to IMT",
        maxScore: 5,
        criteria: [
          {
            id: "imt_u1",
            criterion: "Applications made in Round 1 of national recruitment",
            score: 0,
            evidence: "No evidence required — awarded automatically from your live applications at the closing date",
            options: [
              { label: "I have applied only to the joint IMT/ACCS-IM vacancy in Round 1", score: 5 },
              { label: "I have live applications to one or more additional specialties", score: 0 },
            ],
          },
        ],
      },
      {
        id: "imt_qualifications",
        name: "Postgraduate Degrees & Qualifications",
        maxScore: 4,
        criteria: [
          {
            id: "imt_q1",
            criterion: "Highest postgraduate degree or qualification",
            score: 0,
            evidence: "Qualification certificate, or a letter from the awarding body confirming it. Intercalated degrees cannot be claimed. MRCP(UK) and other membership exams cannot be claimed. Teaching qualifications belong in Training in Teaching.",
            options: [
              { label: "PhD or MD by research (can include non-medical related qualifications)", score: 4 },
              { label: "Masters level degree e.g. MSc, MA, MRes (can include non-medical). Typically 8 months or longer, full-time equivalent", score: 3 },
              { label: "Other relevant postgraduate diploma or certificate, typically lasting between one and ten months whole-time equivalent", score: 1 },
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
            criterion: "Best presentation or poster at a medical meeting (first or second author only)",
            score: 0,
            evidence: "Confirmation the presentation/poster was accepted and included at the meeting (letter, certificate, or the abstracts book), plus the abstract and a copy of the slides or poster.",
            options: [
              { label: "Oral presentation, first or second author, at a national or international medical meeting", score: 6 },
              { label: "Poster, first or second author, shown at a national or international medical meeting", score: 4 },
              { label: "Oral presentation, first or second author, at a regional medical meeting", score: 3 },
              { label: "Oral presentation, first or second author, at a local medical meeting", score: 2 },
              { label: "Poster, first or second author, shown at a regional or local medical meeting", score: 2 },
              { label: "None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "imt_publications",
        name: "Publications",
        maxScore: 8,
        criteria: [
          {
            id: "imt_pub1",
            criterion: "Best publication",
            score: 0,
            evidence: "Screenshot of the PubMed citation and the PubMed link. For 'in press' items, confirmation of acceptance from the publisher. For books, cover page, contents, author list and ISBN.",
            options: [
              { label: "First author, joint-first author or corresponding author of one or more PubMed-cited original research publication (or in press)", score: 8 },
              { label: "Co-author of one or more PubMed-cited original research publication (or in press)", score: 6 },
              { label: "Author or co-author of more than one PubMed-cited other publication (or in press) — editorials, reviews, abstracts, case reports, letters", score: 5 },
              { label: "Written one or more chapters of a book related to medicine (not self-published)", score: 5 },
              { label: "Author or co-author of one PubMed-cited other publication (or in press) — editorial, review, abstract, case report, letter", score: 3 },
              { label: "Published one or more abstracts, non peer-reviewed articles, or articles that are not PubMed-cited", score: 1 },
              { label: "None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "imt_teaching",
        name: "Teaching Experience",
        maxScore: 5,
        criteria: [
          {
            id: "imt_t1",
            criterion: "Teaching experience delivered",
            score: 0,
            evidence: "Evidence of formal feedback is required for every scoring option. For the top two options you also need a letter from your tutor/organisation confirming your role, plus the programme timetable or outline.",
            options: [
              { label: "Worked with local tutors to organise a teaching programme for healthcare professionals or medical students, taught on it regularly for approximately three months or longer, with evidence of formal feedback", score: 5 },
              { label: "Provided regular teaching as part of a defined programme or course for approximately three months or longer, with evidence of formal feedback", score: 3 },
              { label: "Taught medical students or other healthcare professionals occasionally (at least three sessions), with evidence of formal feedback", score: 1 },
              { label: "None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "imt_teaching_training",
        name: "Training in Teaching",
        maxScore: 3,
        criteria: [
          {
            id: "imt_tt1",
            criterion: "Training received in teaching methods",
            score: 0,
            evidence: "Certificate of completion from the course provider (or a letter confirming attendance), plus a course outline confirming duration and delivery.",
            options: [
              { label: "Higher qualification in teaching, e.g. PG Cert or PG Diploma (university accredited, graduate entry only, worth at least 60 credit points)", score: 3 },
              { label: "Training in teaching methods below PG Cert or PG Diploma level (at least six hours of live teaching time, beyond your primary medical qualification)", score: 1 },
              { label: "No training in teaching methods", score: 0 },
            ],
          },
        ],
      },
      {
        id: "imt_qi",
        name: "Quality Improvement",
        maxScore: 4,
        criteria: [
          {
            id: "imt_qi1",
            criterion: "Involvement in quality improvement projects",
            score: 0,
            evidence: "A QIPAT form is preferred. Otherwise a headed document from your supervisor covering the topic and aims, measures identified, QI methodology used, change implementation, evaluation, and future application.",
            options: [
              { label: "Involvement in all stages of two cycles of a quality improvement project", score: 4 },
              { label: "Involvement in some stages of two cycles, OR all stages of a single cycle, of a quality improvement project", score: 3 },
              { label: "Involvement in some stages of a single cycle of a quality improvement project", score: 1 },
              { label: "None of the above", score: 0 },
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
    totalMaxScore: 0,
    competitiveThreshold: null,
    sourceUrl: "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/surgery/core-surgery/core-surgical-training-portfolio-guidance-for-candidates",
    description: "2-year core surgical training. You categorise yourself A-E across five portfolio domains and upload evidence, which is then assessed at interview — two of the domains are explored through structured questions. The point values behind the categories are not published.",
    interviewScoring: {
      rawMaxScore: 0,
      shortlistingScoreCarriesForward: true,
      description:
        "Five portfolio domains, each categorised A to E with evidence uploaded ahead of interview. Assessors review the portfolio and then question you on two domains of their choosing. NHS England names the domains and the category descriptors but does not publish what each category scores, so no total is shown here — check the current guidance for the round you are applying to.",
      weightedAreas: [
        { area: "Commitment to Specialty (operative experience)", weighting: "categories A-E" },
        { area: "Surgical Experience (taster week or elective)", weighting: "categories A-B" },
        { area: "Quality Improvement / Clinical Audit", weighting: "categories A-E" },
        { area: "Presentations and Publications", weighting: "categories A-E" },
        { area: "Teaching Experience", weighting: "categories A-E" },
      ],
    },
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
    description: "3-year GP training programme. Offers and location are decided by the MSRA alone — there is no interview and no portfolio scoring at any stage.",
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
    sourceUrl: "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/psychiatry",
    description: "3-year core psychiatry training. Selection is on MSRA score alone — there is no interview and no portfolio scoring.",
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
    sourceUrl: "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/paediatrics",
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
    applicationRoute: "Specialty Training",
    msraRequired: true,
    totalMaxScore: 150,
    competitiveThreshold: null,
    sourceUrl: "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/obstetrics-and-gynaecology/st1-obstetrics-and-gynaecology/scoring-overview",
    description: "O&G specialty training from ST1. Ranking is out of 150: the MSRA scaled to 0-50 plus a 100-mark online interview. Your portfolio is assessed — quality improvement, research and teaching, and leadership are scored areas of the structured interview — but by the panel on the day rather than on the application form.",
    interviewScoring: {
      rawMaxScore: 100,
      weightedMaxScore: 150,
      shortlistingScoreCarriesForward: true,
      description:
        "The MSRA is scaled to 0-50 (Clinical Problem Solving 0-25, Professional Dilemmas 0-25) and carries forward as 33.3% of the final total. The online interview adds 100 marks across three sections, each question marked by two panel members. Note that the structured interview is where your portfolio is assessed: quality improvement, research and teaching, and leadership are each worth 10 marks. The top 75 applicants by MSRA score bypass the interview entirely.",
      appointabilityCriteria: [
        "You must score at least 50% on the online interview (50/100) to be found appointable",
        "Responses to the clinical prioritisation exercise that raise serious patient-safety concerns can make an application unappointable regardless of overall score",
      ],
      weightedAreas: [
        { area: "MSRA — Clinical Problem Solving", weighting: "scaled", maxScore: 25 },
        { area: "MSRA — Professional Dilemmas", weighting: "scaled", maxScore: 25 },
        { area: "Structured interview — Commitment to specialty", weighting: "2 panel × 5", maxScore: 10 },
        { area: "Structured interview — Quality improvement measures", weighting: "2 panel × 5", maxScore: 10 },
        { area: "Structured interview — Research and teaching", weighting: "2 panel × 5", maxScore: 10 },
        { area: "Structured interview — Experience outside medicine, leadership and teamworking", weighting: "2 panel × 5", maxScore: 10 },
        { area: "Clinical prioritisation — Ability to prioritise", weighting: "2 panel × 4", maxScore: 8 },
        { area: "Clinical prioritisation — Priority 1", weighting: "2 panel × 6", maxScore: 12 },
        { area: "Clinical prioritisation — Priority 2", weighting: "2 panel × 4", maxScore: 8 },
        { area: "Clinical prioritisation — Priority 3", weighting: "2 panel × 4", maxScore: 8 },
        { area: "Clinical prioritisation — Priority 4", weighting: "2 panel × 2", maxScore: 4 },
        { area: "Ethics and Governance", weighting: "2 panel × 10", maxScore: 20 },
      ],
    },
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
    msraRequired: true,
    totalMaxScore: 100,
    competitiveThreshold: null,
    sourceUrl: "https://anro.wm.hee.nhs.uk/ct1",
    description: "CT1 Anaesthetics or ACCS Anaesthetics, recruited nationally through ANRO via Oriel. Shortlisting is on the MSRA; ranking is on a two-station competency interview scored out of 100. There is no self-assessed portfolio at CT1 — that applies at ST4 entry.",
    interviewScoring: {
      rawMaxScore: 100,
      shortlistingScoreCarriesForward: false,
      description:
        "A two-station interview: Station 1 covers clinical judgement, Station 2 is a general interview. Four assessors score in total, two per station. Six attributes are each marked out of 5 by two assessors, giving 10 apiece, and each of the four assessors also awards a global rating out of 10. Each station totals 50, for an interview score out of 100.",
      weightedAreas: [
        { area: "Professional Behaviour & Communication", weighting: "2 assessors × 5", maxScore: 10 },
        { area: "Clinical Judgement & Decision Making", weighting: "2 assessors × 5", maxScore: 10 },
        { area: "Team Working", weighting: "2 assessors × 5", maxScore: 10 },
        { area: "Reflective Practice", weighting: "2 assessors × 5", maxScore: 10 },
        { area: "Commitment to Specialty", weighting: "2 assessors × 5", maxScore: 10 },
        { area: "Working Under Pressure", weighting: "2 assessors × 5", maxScore: 10 },
        { area: "Global Rating", weighting: "4 assessors × 10", maxScore: 40 },
      ],
    },
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

  // ─── 9. Clinical Radiology ───────────────────────────────────────────────
  // VERIFIED against the official Clinical Radiology ST1 Portfolio Review
  // Guidance 2026 (NHS England).
  //
  // Five domains, each self-categorised A-E on Oriel with one piece of evidence
  // submitted per domain. Categories score A=4, B=3, C=2, D=1, E=0, and Domain 1
  // is double-weighted, giving a portfolio maximum of 24. The category is chosen
  // by the applicant and then verified, so this tool can mirror it exactly.
  {
    id: "radiology",
    name: "Clinical Radiology",
    shortName: "Radiology",
    applicationRoute: "Specialty Training",
    msraRequired: true,
    totalMaxScore: 24,
    competitiveThreshold: null,
    sourceUrl: "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/clinical-radiology/core-clinical-radiology/clinical-radiology-st1-portfolio-review-guidance",
    description: "5-year radiology specialty training from ST1. You self-categorise A-E across five portfolio domains on Oriel and submit one piece of evidence for each. Final ranking combines your MSRA score, the verified evidence score and your interview score.",
    domains: [
      {
        id: "rad_commitment",
        name: "Commitment to Specialty",
        maxScore: 8,
        criteria: [
          {
            id: "rad_c1",
            criterion: "Your strongest evidence of commitment to radiology (this domain is double-weighted)",
            score: 0,
            evidence: "One piece of evidence: a letter confirming attendance at a taster or placement, a course certificate, or a conference registration.",
            options: [
              { label: "A — Multiple significant exposures to the work of a clinical radiology department", score: 8 },
              { label: "B — One significant exposure to the work of a radiology department", score: 6 },
              { label: "C — Attended a radiology-based course of at least one day in length", score: 4 },
              { label: "D — Attended a radiology-related conference", score: 2 },
              { label: "E — None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "rad_leadership",
        name: "Leadership and Management",
        maxScore: 4,
        criteria: [
          {
            id: "rad_l1",
            criterion: "Your highest leadership or management role",
            score: 0,
            evidence: "One piece of evidence confirming the role and its scope, such as a letter from the organisation or committee.",
            options: [
              { label: "A — A national-level leadership or management role involving radiology", score: 4 },
              { label: "B — A national healthcare role outside radiology, or a local or regional radiology role", score: 3 },
              { label: "C — A national role outside healthcare, or a local healthcare role outside radiology", score: 2 },
              { label: "D — A local or regional leadership or management role outside healthcare", score: 1 },
              { label: "E — None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "rad_teaching",
        name: "Teaching and Training",
        maxScore: 4,
        criteria: [
          {
            id: "rad_t1",
            criterion: "Your strongest teaching qualification or contribution",
            score: 0,
            evidence: "One piece of evidence: a qualification certificate, confirmation of your role in a teaching programme, or a course certificate.",
            options: [
              { label: "A — A formal teaching qualification awarded at postgraduate level", score: 4 },
              { label: "B — A major contribution to a national or international teaching programme", score: 3 },
              { label: "C — Other training in teaching methods after study of at least two days", score: 2 },
              { label: "D — Evidence of providing regional teaching", score: 1 },
              { label: "E — None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "rad_audit",
        name: "Audit and Quality Improvement",
        maxScore: 4,
        criteria: [
          {
            id: "rad_a1",
            criterion: "Your strongest audit or quality improvement involvement",
            score: 0,
            evidence: "Evidence of the project and your role in it. Category A is the one domain accepting two pieces of evidence, since it requires two projects.",
            options: [
              { label: "A — Led two or more audits or quality improvement projects relating to radiology", score: 4 },
              { label: "B — Led an audit or quality improvement project relating to radiology", score: 3 },
              { label: "C — Led an audit or quality improvement project outside radiology", score: 2 },
              { label: "D — Contributed to, but did not lead, an audit or quality improvement project", score: 1 },
              { label: "E — None of the above", score: 0 },
            ],
          },
        ],
      },
      {
        id: "rad_academic",
        name: "Academic Achievements",
        maxScore: 4,
        criteria: [
          {
            id: "rad_ac1",
            criterion: "Your strongest academic achievement",
            score: 0,
            evidence: "One piece of evidence: the degree certificate, the publication citation, or confirmation of the presentation.",
            options: [
              { label: "A — A postgraduate research degree, or first-author radiology publication", score: 4 },
              { label: "B — Co-authored radiology publication, first-author non-radiology publication, or a radiology case report", score: 3 },
              { label: "C — Co-authored publication, non-radiology case report, or a regional presentation", score: 2 },
              { label: "D — A non-radiology presentation, or involvement in research", score: 1 },
              { label: "E — None of the above", score: 0 },
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
    sourceUrl: "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/surgery",
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
    sourceUrl: "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/surgery",
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
    sourceUrl: "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/medicine",
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
    sourceUrl: "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/medicine",
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
    sourceUrl: "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/medicine",
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
    sourceUrl: "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/medicine",
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

// ─── Verification registry ────────────────────────────────────────────────────
// One entry per specialty recording whether its scoring matrix above has been
// confirmed against the official recruitment source.
//
// As of the July 2026 audit NO matrix has been confirmed. The figures above were
// compiled without being checked against official sources, and several were
// found to be wrong or to describe something other than a self-assessment
// score. Each note below records what the audit established.
//
// To mark a specialty verified: replace its matrix above with the official one,
// then set status "verified", checkedOn to today, and cycle to the recruitment
// year the matrix belongs to.

export const SAS_VERIFICATION: Record<string, SASVerification> = {
  imt: {
    status: "verified",
    scoringModel: "self-assessment",
    checkedOn: "2026-07-19",
    cycle: "2026",
    note: "Domains, options and scores transcribed from the official IMT 2026 application scoring guidance; eligibility and interview scoring from the same site. Shortlisting is by rank against interview capacity, so there is no published pass mark — competitiveThreshold is deliberately null. msraRequired is false: the scoring page states shortlisting scores are generated in exactly two ways (self-assessment plus unique-applicant points) and neither the scoring nor eligibility guidance mentions the MSRA. NHS England states this guidance also applies to 2027, with the site due to be updated in autumn 2026. The shortlisting score does not carry into ranking — the assessment-methods guidance states the interview alone forms all marks used for the total score, and that neither the self-assessment nor the unique-applicant points contribute to the score used for offers. Achievements are still discussed at interview and contribute there. Assessment runs in three stages: longlisting on eligibility, shortlisting on the score out of 35, then interview. Nothing outstanding.",
  },
  cst: {
    status: "verified",
    scoringModel: "interview-portfolio",
    checkedOn: "2026-07-19",
    cycle: "2026",
    note: "Domain names and category structure taken from the official NHS England portfolio guidance for candidates. The 60-point numeric matrix with a 42-point threshold that this tool previously showed does not exist: CST grades five domains A-E, and assessors question you on two of them at interview. NHS England publishes the domains and category descriptors but not what each category scores, so no total is claimed here — the previous figures had no source. Outstanding: the point value of each category and the portfolio's share of the overall score.",
  },
  gp: {
    status: "unverified",
    scoringModel: "msra-only",
    checkedOn: null,
    cycle: null,
    note: "GP has no portfolio scored at any stage — ranking and offers come from the MSRA alone. The 100-point scoring this tool previously showed does not correspond to anything in GP recruitment.",
  },
  psychiatry: {
    status: "unverified",
    scoringModel: "msra-only",
    checkedOn: null,
    cycle: null,
    note: "Core Psychiatry selects on MSRA alone, with no interview and no portfolio. The 40-point scoring this tool previously showed does not correspond to anything in Psychiatry recruitment. Its sourceUrl was a dead link when checked in July 2026 and now points to the NHS England specialty hub rather than an invented deep link.",
  },
  paediatrics: {
    status: "unverified",
    scoringModel: "unknown",
    checkedOn: null,
    cycle: null,
    note: "Matrix not checked against the official source. Its sourceUrl was a dead link when checked in July 2026 and now points to the NHS England specialty hub rather than an invented deep link.",
  },
  og: {
    status: "verified",
    scoringModel: "interview-portfolio",
    checkedOn: "2026-07-19",
    cycle: "2026",
    note: "The 150 total is real but is 50 scaled MSRA marks plus a 100-mark online interview, not a portfolio self-assessment with a 100-point threshold as this tool previously showed. The portfolio is genuinely assessed, however: quality improvement, research and teaching, and leadership are each worth 10 marks of the structured interview, so 40 of the 150 marks turn on portfolio content — it is scored by the panel rather than declared on the form. Full breakdown from the NHS England ST1 O&G scoring overview, page last reviewed February 2026.",
  },
  anaesthetics: {
    status: "verified",
    scoringModel: "interview-portfolio",
    checkedOn: "2026-07-19",
    cycle: "2026",
    note: "CT1 Anaesthetics has no self-assessed portfolio. Shortlisting is on the MSRA and ranking on a two-station interview scored out of 100, transcribed from the official CT1 Interview Scoring Matrix 2026. The 50-point portfolio assessment this tool previously offered appears to have been taken from ST4 entry, which does have a verified self-assessment plus a Portfolio Organisation Score — a different application route several years further on. The entry also recorded that the MSRA was not required, which is the opposite of the case.",
  },
  em: {
    status: "unverified",
    scoringModel: "unknown",
    checkedOn: null,
    cycle: null,
    note: "Matrix not checked against the official source.",
  },
  radiology: {
    status: "verified",
    scoringModel: "self-assessment",
    checkedOn: "2026-07-19",
    cycle: "2026",
    note: "Five domains self-categorised A-E on Oriel, transcribed from the official ST1 Portfolio Review Guidance. Categories score A=4 down to E=0, with Commitment to Specialty double-weighted, giving a maximum of 24. The previous matrix reached the same 24 through invented domains: it scored Qualifications and Presentations, neither of which exists in the guidance, and omitted Commitment to Specialty entirely — the largest domain, worth a third of the portfolio. The original sourceUrl was also a dead link. Outstanding: the published weighting between the verified evidence score, MSRA and interview in the final rank.",
  },
  ophthalmology: {
    status: "unverified",
    scoringModel: "unknown",
    checkedOn: null,
    cycle: null,
    note: "Matrix not checked against the official source.",
  },
  orthopaedics: {
    status: "unverified",
    scoringModel: "unknown",
    checkedOn: null,
    cycle: null,
    note: "Matrix not checked against the official source. Its sourceUrl was a dead link when checked in July 2026 and now points to the NHS England specialty hub rather than an invented deep link.",
  },
  neurosurgery: {
    status: "unverified",
    scoringModel: "unknown",
    checkedOn: null,
    cycle: null,
    note: "Matrix not checked against the official source. Its sourceUrl was a dead link when checked in July 2026 and now points to the NHS England specialty hub rather than an invented deep link.",
  },
  // The six specialties below were added in one batch and all carry an
  // identical 32-point maximum, differing only in threshold. Real recruitment
  // matrices differ substantially between specialties, so this uniformity
  // indicates the figures were generated rather than sourced.
  dermatology: {
    status: "unverified",
    scoringModel: "unknown",
    checkedOn: null,
    cycle: null,
    note: "Part of a batch of six specialties sharing an identical 32-point maximum, which real recruitment matrices do not. Its sourceUrl was a dead link when checked in July 2026 and now points to the NHS England specialty hub rather than an invented deep link.",
  },
  cardiology: {
    status: "unverified",
    scoringModel: "unknown",
    checkedOn: null,
    cycle: null,
    note: "Part of a batch of six specialties sharing an identical 32-point maximum, which real recruitment matrices do not.",
  },
  neurology: {
    status: "unverified",
    scoringModel: "unknown",
    checkedOn: null,
    cycle: null,
    note: "Part of a batch of six specialties sharing an identical 32-point maximum, which real recruitment matrices do not.",
  },
  gastroenterology: {
    status: "unverified",
    scoringModel: "unknown",
    checkedOn: null,
    cycle: null,
    note: "Part of a batch of six specialties sharing an identical 32-point maximum, which real recruitment matrices do not. Its sourceUrl was a dead link when checked in July 2026 and now points to the NHS England specialty hub rather than an invented deep link.",
  },
  endocrinology: {
    status: "unverified",
    scoringModel: "unknown",
    checkedOn: null,
    cycle: null,
    note: "Part of a batch of six specialties sharing an identical 32-point maximum, which real recruitment matrices do not. Its sourceUrl was a dead link when checked in July 2026 and now points to the NHS England specialty hub rather than an invented deep link.",
  },
  respiratory: {
    status: "unverified",
    scoringModel: "unknown",
    checkedOn: null,
    cycle: null,
    note: "Part of a batch of six specialties sharing an identical 32-point maximum, which real recruitment matrices do not. Its sourceUrl was a dead link when checked in July 2026 and now points to the NHS England specialty hub rather than an invented deep link.",
  },
};

/**
 * Provenance for a specialty. A specialty with no registry entry is reported as
 * unverified rather than trusted, so adding a specialty without recording where
 * its figures came from cannot silently present them as official.
 */
export function getVerification(specialtyId: string): SASVerification {
  return (
    SAS_VERIFICATION[specialtyId] ?? {
      status: "unverified",
      scoringModel: "unknown",
      checkedOn: null,
      cycle: null,
      note: "No provenance recorded for this specialty.",
    }
  );
}

/** True when the matrix may be presented to users as official. */
export function isVerified(specialtyId: string): boolean {
  return getVerification(specialtyId).status === "verified";
}

/** True when the specialty has a portfolio the applicant can score themselves. */
export function isScorable(specialtyId: string): boolean {
  return !NON_SCORABLE_MODELS.includes(getVerification(specialtyId).scoringModel);
}
