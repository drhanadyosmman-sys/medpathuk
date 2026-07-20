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
 *  - "application-assessed" Portfolio content is scored at shortlisting, but by
 *                          assessors reading written answers on the form rather
 *                          than by the applicant assigning their own category.
 *                          Again scorable in principle, not self-scorable.
 *  - "msra-only"           No portfolio is scored at any stage; ranking comes
 *                          from the MSRA exam alone. Distinct from the case
 *                          above, and the difference changes what an applicant
 *                          should spend their time on.
 *  - "unknown"             Not yet established. Treated as unverified.
 */
export type SASScoringModel =
  | "self-assessment"
  | "interview-portfolio"
  | "application-assessed"
  | "msra-only"
  | "unknown";

/**
 * Models where the applicant cannot put a number on themselves in advance.
 *
 * Note this includes "interview-portfolio", where the portfolio is scored but
 * by a panel on the day. Offering a self-assessed total there would be
 * inventing a figure that does not exist in the process.
 */
const NON_SCORABLE_MODELS: SASScoringModel[] = [
  "msra-only",
  "interview-portfolio",
  "application-assessed",
];

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

// ─── PHST shared self-assessment ──────────────────────────────────────────────
// Physician Higher Specialty Training runs one national round for the higher
// medical specialties, and every specialty in it is scored on the same
// self-assessment: 38 points across seven domains. Defined once here rather
// than copied per specialty, so a change to the matrix cannot leave some
// specialties on an old version — which is how the invented figures this file
// used to carry went unnoticed.
//
// Two things sit outside these 38 points and are deliberately not scored here:
//   - 2 marks for how well evidence documents are organised, awarded by
//     assessors; poor presentation can stop an application being shortlisted
//     outright.
//   - Commitment to specialty, worth 20 marks at shortlisting for the
//     specialties that assess it, judged by two assessors from the form. It
//     does not carry into the final ranking, and either assessor marking an
//     applicant unappointable stops them being shortlisted regardless of score.
// Both are recorded in each specialty's evidenceGuidance and interviewScoring.
//
// Source: https://phstrecruitment.org.uk — self-assessment and application
// scoring, verified July 2026.
function phstDomains(prefix: string): SASDomain[] {
  return [
    {
      id: `${prefix}_pg`,
      name: "Postgraduate Degrees & Qualifications",
      maxScore: 4,
      criteria: [
        {
          id: `${prefix}_pg1`,
          criterion: "Highest postgraduate degree or qualification",
          score: 0,
          evidence:
            "Qualification certificate, or a letter from the awarding body. This domain requires the evidence pro forma from the PHST Document Library. Intercalated degrees cannot be claimed anywhere. Teaching qualifications belong in Training in Teaching. MRCP(UK) is claimed in its own domain, not here.",
          options: [
            { label: "PhD or MD by research (can include non-medical qualifications)", score: 4 },
            { label: "Masters level degree e.g. MSc, MA, MRes (can include non-medical). Typically 8 months or longer, full-time equivalent", score: 3 },
            { label: "Other relevant postgraduate diploma or certificate, typically one to ten months whole-time equivalent — or an additional membership exam beyond the one required for entry, or specialist registration in another specialty", score: 1 },
            { label: "None of the above", score: 0 },
          ],
        },
      ],
    },
    {
      id: `${prefix}_mrcp`,
      name: "MRCP(UK)",
      maxScore: 8,
      criteria: [
        {
          id: `${prefix}_mrcp1`,
          criterion: "Progress through MRCP(UK), or the alternative stated on the person specification",
          score: 0,
          evidence:
            "Your MRCP(UK) certificate, a letter from the college confirming individual components, or a screenshot of your My MRCP(UK) account showing your name and what you have completed. Part 1 scores nothing — it is an eligibility requirement.",
          options: [
            { label: "Passed both Part 2 Written and PACES, or a stated alternative", score: 8 },
            { label: "Passed PACES but not Part 2 Written, or a stated alternative", score: 6 },
            { label: "Passed Part 2 Written but not PACES, or a stated alternative", score: 2 },
            { label: "Passed neither Part 2 Written nor PACES, nor a stated alternative", score: 0 },
          ],
        },
      ],
    },
    {
      id: `${prefix}_pres`,
      name: "Presentations / Posters",
      maxScore: 6,
      criteria: [
        {
          id: `${prefix}_pres1`,
          criterion: "Best presentation or poster at a medical meeting (first or second author only)",
          score: 0,
          evidence:
            "Confirmation the presentation or poster was accepted and included — a letter, certificate, or the meeting's abstracts book — plus the abstract and a copy of the slides or poster. National and international claims without an abstracts document may be downgraded. Requires the evidence pro forma.",
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
      id: `${prefix}_pub`,
      name: "Publications",
      maxScore: 8,
      criteria: [
        {
          id: `${prefix}_pub1`,
          criterion: "Best publication",
          score: 0,
          evidence:
            "A screenshot of the PubMed citation plus the link; for 'in press' items, confirmation of acceptance from the publisher. For books: cover page, contents, author list, ISBN and the publisher's website. Requires the evidence pro forma.",
          options: [
            { label: "First author, joint-first author or corresponding author of one or more PubMed-cited original research publication (or in press)", score: 8 },
            { label: "Co-author of one or more PubMed-cited original research publication (or in press)", score: 6 },
            { label: "Author or co-author of more than one PubMed-cited other publication (or in press) — editorials, reviews, abstracts, case reports, letters", score: 5 },
            { label: "Written one or more chapters of a book related to medicine (not self-published)", score: 5 },
            { label: "Author or co-author of one PubMed-cited other publication (or in press)", score: 3 },
            { label: "Published one or more abstracts, non peer-reviewed articles, or articles that are not PubMed-cited", score: 1 },
            { label: "None of the above", score: 0 },
          ],
        },
      ],
    },
    {
      id: `${prefix}_teach`,
      name: "Teaching Experience",
      maxScore: 5,
      criteria: [
        {
          id: `${prefix}_teach1`,
          criterion: "Teaching experience delivered",
          score: 0,
          evidence:
            "Evidence of formal feedback is required for every scoring option — senior observation, a Developing the Clinical Teacher or Teaching Observation form, or collected participant feedback with a summary. The top two options also need a letter from your tutor confirming your role, on headed paper, plus the programme timetable. Requires the evidence pro forma.",
          options: [
            { label: "Worked with local tutors to organise a teaching programme and taught on it regularly for approximately three months or longer, with evidence of formal feedback", score: 5 },
            { label: "Provided regular teaching as part of a defined programme or course for approximately three months or longer, with evidence of formal feedback", score: 3 },
            { label: "Taught medical students or healthcare professionals occasionally (at least three sessions), with evidence of formal feedback", score: 1 },
            { label: "None of the above", score: 0 },
          ],
        },
      ],
    },
    {
      id: `${prefix}_teachtrain`,
      name: "Training in Teaching",
      maxScore: 3,
      criteria: [
        {
          id: `${prefix}_teachtrain1`,
          criterion: "Training received in teaching methods",
          score: 0,
          evidence:
            "A certificate of completion from the course provider, or a letter confirming attendance, plus a course outline confirming duration and delivery.",
          options: [
            { label: "Higher qualification in teaching, e.g. PG Cert or PG Diploma (university accredited, graduate entry only, at least 60 credit points)", score: 3 },
            { label: "Training in teaching methods below PG Cert or PG Diploma level (at least six hours of live teaching, beyond your primary medical qualification)", score: 1 },
            { label: "No training in teaching methods", score: 0 },
          ],
        },
      ],
    },
    {
      id: `${prefix}_qi`,
      name: "Quality Improvement",
      maxScore: 4,
      criteria: [
        {
          id: `${prefix}_qi1`,
          criterion: "Involvement in quality improvement projects",
          score: 0,
          evidence:
            "A QIPAT form is preferred. Otherwise a headed document from your supervisor covering the topic and aims, the measures identified, the QI methodology used, change implementation with a run chart, evaluation against predictions, and future application. Requires the evidence pro forma.",
          options: [
            { label: "All aspects of two cycles of an original QI project, in a leadership capacity supervising other team members", score: 4 },
            { label: "All aspects of two cycles of a QI project", score: 3 },
            { label: "One aspect of a completed multi-cycle QI project, or two or more aspects of a single-cycle project", score: 1 },
            { label: "None of the above", score: 0 },
          ],
        },
      ],
    },
  ];
}

/**
 * Every specialty recruited through Physician Higher Specialty Training.
 *
 * PHST runs one national round at ST3 across all of them, scored on the shared
 * 38-point self-assessment in phstDomains(). What differs between specialties
 * is the interview: how many areas are scored (four, five or six), how those
 * areas are weighted, and whether commitment to specialty is also scored at
 * shortlisting. Those sit on each specialty's own page and are recorded as
 * outstanding rather than assumed here.
 *
 * Source: https://phstrecruitment.org.uk, verified July 2026.
 */
const PHST_SPECIALTY_LIST: { id: string; prefix: string; name: string; shortName: string }[] = [
  { id: "acute_internal_medicine", prefix: "aim", name: "Acute Internal Medicine", shortName: "Acute Med" },
  { id: "allergy", prefix: "allergy", name: "Allergy", shortName: "Allergy" },
  { id: "audiovestibular", prefix: "audio", name: "Audiovestibular Medicine", shortName: "Audiovestibular" },
  { id: "cardiology", prefix: "cardio", name: "Cardiology", shortName: "Cardio" },
  { id: "clinical_genetics", prefix: "genetics", name: "Clinical Genetics", shortName: "Clin Genetics" },
  { id: "clinical_neurophysiology", prefix: "neurophys", name: "Clinical Neurophysiology", shortName: "Neurophysiology" },
  { id: "clinical_oncology", prefix: "clinonc", name: "Clinical Oncology", shortName: "Clin Oncology" },
  { id: "clinical_pharmacology", prefix: "clinpharm", name: "Clinical Pharmacology & Therapeutics", shortName: "Clin Pharm" },
  { id: "combined_infection", prefix: "infection", name: "Combined Infection Training", shortName: "Infection" },
  { id: "dermatology", prefix: "derm", name: "Dermatology", shortName: "Derm" },
  { id: "endocrinology", prefix: "endo", name: "Endocrinology & Diabetes Mellitus", shortName: "Endo" },
  { id: "gastroenterology", prefix: "gastro", name: "Gastroenterology", shortName: "Gastro" },
  { id: "gim", prefix: "gim", name: "General Internal Medicine", shortName: "GIM" },
  { id: "genitourinary", prefix: "gum", name: "Genitourinary Medicine", shortName: "GUM" },
  { id: "geriatric_medicine", prefix: "geriatrics", name: "Geriatric Medicine", shortName: "Geriatrics" },
  { id: "haematology", prefix: "haem", name: "Haematology", shortName: "Haematology" },
  { id: "immunology", prefix: "immuno", name: "Immunology", shortName: "Immunology" },
  { id: "intensive_care", prefix: "icm", name: "Intensive Care Medicine", shortName: "ICM" },
  { id: "medical_microbiology", prefix: "micro", name: "Medical Microbiology", shortName: "Microbiology" },
  { id: "medical_oncology", prefix: "medonc", name: "Medical Oncology", shortName: "Med Oncology" },
  { id: "medical_ophthalmology", prefix: "medophth", name: "Medical Ophthalmology", shortName: "Med Ophth" },
  { id: "medical_virology", prefix: "virology", name: "Medical Virology", shortName: "Virology" },
  { id: "neurology", prefix: "neuro", name: "Neurology", shortName: "Neuro" },
  { id: "nuclear_medicine", prefix: "nuclear", name: "Nuclear Medicine", shortName: "Nuclear Med" },
  { id: "paediatric_cardiology", prefix: "paedcardio", name: "Paediatric Cardiology", shortName: "Paed Cardio" },
  { id: "palliative_medicine", prefix: "palliative", name: "Palliative Medicine", shortName: "Palliative" },
  { id: "pharmaceutical_medicine", prefix: "pharmmed", name: "Pharmaceutical Medicine", shortName: "Pharm Med" },
  { id: "rehabilitation_medicine", prefix: "rehab", name: "Rehabilitation Medicine", shortName: "Rehab Med" },
  { id: "renal_medicine", prefix: "renal", name: "Renal Medicine", shortName: "Renal" },
  { id: "respiratory", prefix: "resp", name: "Respiratory Medicine", shortName: "Resp" },
  { id: "rheumatology", prefix: "rheum", name: "Rheumatology", shortName: "Rheumatology" },
  { id: "sport_exercise_medicine", prefix: "sem", name: "Sport & Exercise Medicine", shortName: "Sport & Exercise" },
  { id: "stroke_medicine", prefix: "stroke", name: "Stroke Medicine / GIM", shortName: "Stroke" },
  { id: "tropical_medicine", prefix: "tropical", name: "Tropical Medicine", shortName: "Tropical Med" },
];

const PHST_SOURCE_URL = "https://phstrecruitment.org.uk";

const PHST_INTERVIEW_DESCRIPTION =
  "Two independent interviewers score each area from 1 to 5, against the standard expected of a UK core trainee one level below the post — CT3 for group 1 specialties, CT2 for group 2. A 3 is satisfactory and marks a candidate suitable for higher specialty training; 4 is above average and 5 highly performing. Specialties score four, five or six areas, giving a raw interview score out of 40, 50 or 60 respectively, and each weights its areas differently. Your weighted interview score is combined with your weighted application score to produce the ranking used for offers, so unlike some specialties the self-assessment above does carry forward.";

const PHST_APPOINTABILITY = [
  "None of your interview scores may be 1/5",
  "No more than two of your interview scores may be 2/5",
  "Your raw interview score must reach 60% of the maximum — 24 of 40 where four areas are scored, 30 of 50 for five, or 36 of 60 for six",
  "Either assessor marking you unappointable on commitment to specialty stops you being shortlisted, regardless of your self-assessment score",
];

const PHST_EVIDENCE_HARD_FAILS = [
  "Supplying no evidence, or none for a domain you scored yourself in, is likely to mean your application is not shortlisted",
  "Evidence organised poorly enough can stop an application being shortlisted regardless of score, and that judgement cannot be appealed",
];

const PHST_EVIDENCE_RULES = [
  "You are contacted after applications close to upload evidence — there is no need to supply anything at the time of applying, though you can prepare it.",
  "Assessors award a further 2 marks for how well your evidence is organised, on top of the 38 above.",
  "Verification can move your score either way: where an achievement is unclear or hard to verify, assessors are told to award only what they can confidently confirm.",
  "Five domains need an evidence pro forma from the PHST Document Library: postgraduate degrees and qualifications, presentations and posters, publications, teaching experience, and quality improvement.",
  "You cannot amend a submitted application, but you may upload evidence for achievements gained between submission and the upload deadline, and may flag a mistake with a short explanatory document.",
  "Anything not in English needs a certified, authenticated translation.",
  "Every application is assessed independently with no cross-referencing, so the same achievement can score differently in another specialty or round. That alone is not grounds for appeal.",
];

/** Builds a specialty from the shared PHST process. */
function phstSpecialty(s: {
  id: string;
  prefix: string;
  name: string;
  shortName: string;
}): SASSpecialty {
  return {
    id: s.id,
    name: s.name,
    shortName: s.shortName,
    applicationRoute: "Specialty Training",
    msraRequired: false,
    totalMaxScore: 38,
    competitiveThreshold: null,
    sourceUrl: PHST_SOURCE_URL,
    description: `${s.name} at ST3, recruited through Physician Higher Specialty Training. Applications are scored by self-assessment on Oriel — 38 points across seven domains, shared by every PHST specialty — then verified against your uploaded evidence, which can raise or lower the score.`,
    interviewScoring: {
      rawMaxScore: 0,
      shortlistingScoreCarriesForward: true,
      description: PHST_INTERVIEW_DESCRIPTION,
      appointabilityCriteria: PHST_APPOINTABILITY,
    },
    evidenceGuidance: {
      hardFails: PHST_EVIDENCE_HARD_FAILS,
      rules: PHST_EVIDENCE_RULES,
    },
    domains: phstDomains(s.prefix),
  };
}

const PHST_VERIFICATION_NOTE =
  "Verified against the PHST self-assessment and application scoring guidance. All higher medical specialties are recruited in one national round and share the same 38-point matrix, defined once in phstDomains(). Two things sit outside it: 2 marks for evidence organisation, and commitment to specialty worth 20 marks at shortlisting where a specialty assesses it, which does not carry into ranking but can block shortlisting outright. No competitive threshold is published, so none is claimed. Outstanding for this specialty: how many interview areas it scores, how they are weighted, and whether it assesses commitment to specialty at shortlisting — all stated per round on its own page.";

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
    description: "3-year GP training programme. Selection runs on the MSRA; no portfolio is scored at any stage, so there is nothing here to self-assess. Confirm the current round's process on the official site — recent cycles have changed how and whether candidates are assessed beyond the exam.",
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
    applicationRoute: "Run-through",
    msraRequired: false,
    totalMaxScore: 0,
    competitiveThreshold: null,
    sourceUrl: "https://www.rcpch.ac.uk/education-careers/apply-paediatrics/ST1",
    description: "Paediatric training from ST1, recruited by the RCPCH in National Round 1. There is no MSRA. Shortlisting is scored by assessors from written answers on the Oriel form — capped at 50 words per section — followed by a two-station online interview.",
    interviewScoring: {
      rawMaxScore: 0,
      shortlistingScoreCarriesForward: true,
      description:
        "Shortlisting is scored from your written application across five areas, each answered in no more than 50 words. Shortlisted candidates then attend a two-station multi-scenario interview on the Qpercom platform, 20 minutes per station, covering communication, career motivation, clinical reasoning and reflective practice. Offers combine your score ranking with your programme preferences.",
      appointabilityCriteria: [
        "Appointability is determined from the interview scores, with a threshold of 55% or more",
      ],
      weightedAreas: [
        { area: "Transferable clinical capabilities", weighting: "application, 50 words" },
        { area: "Personal achievements and reflection", weighting: "application, 50 words" },
        { area: "Quality Improvement Project / Audit", weighting: "application, 50 words" },
        { area: "Academic achievements", weighting: "application, 50 words" },
        { area: "Teaching", weighting: "application, 50 words" },
      ],
    },
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
    msraRequired: true,
    totalMaxScore: 0,
    competitiveThreshold: null,
    sourceUrl: "https://medical.hee.nhs.uk/medical-training-recruitment/medical-specialty-training/emergency-medicine/core-emergency-medicine/overview-of-core-training/applying-for-core-training",
    description: "ACCS Emergency Medicine from CT1/ST1. All eligible applicants sit the MSRA, which is weighted 40% of the total score against 60% for the online interview. Where applications exceed interview capacity, the MSRA score decides who is invited. There is no self-assessment.",
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







  // Every PHST specialty, built from the shared process above.
  ...PHST_SPECIALTY_LIST.map(phstSpecialty),
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
  // One entry per PHST specialty, generated from the shared process. Kept in
  // step with the specialty list by construction rather than by hand.
  ...Object.fromEntries(
    PHST_SPECIALTY_LIST.map((s) => [
      s.id,
      {
        status: "verified" as const,
        scoringModel: "self-assessment" as const,
        checkedOn: "2026-07-19",
        cycle: "2026",
        note: PHST_VERIFICATION_NOTE,
      },
    ])
  ),
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
    note: "No portfolio is scored at any stage, so the 100-point assessment with a 60-point threshold this tool previously showed corresponds to nothing in GP recruitment. Left unverified because the selection mechanism itself could not be confirmed: NHS England's own page on changes to GP recruitment still describes the 2021 and 2022 rounds and a Selection Centre suspended for COVID, so whether candidates face anything beyond the MSRA in the current cycle is not established by official sources. The absence of portfolio scoring is well supported across them; the rest is not.",
  },
  psychiatry: {
    status: "verified",
    scoringModel: "msra-only",
    checkedOn: "2026-07-19",
    cycle: "2026",
    note: "NHS England states directly that there are no face-to-face or online interviews for this round and that offers are based on MSRA scores only, with no portfolio component. The 40-point assessment with a 28-point threshold this tool previously showed corresponds to nothing in Psychiatry recruitment. Its sourceUrl was also a dead link when checked in July 2026 and now points to the NHS England specialty hub.",
  },
  paediatrics: {
    status: "verified",
    scoringModel: "application-assessed",
    checkedOn: "2026-07-19",
    cycle: "2026",
    note: "Shortlisting areas and the interview format come from the RCPCH ST1 applicant guidance. Nothing is self-scored: assessors mark written answers capped at 50 words per section, so the 25-point self-assessment with an 18-point threshold this tool previously offered had no counterpart in the process. RCPCH does not publish the marks behind each area, so none are claimed here. Entry is at ST1 rather than CT1 and there is no MSRA, both of which the previous entry had wrong. Outstanding: the marks available per shortlisting area.",
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
    checkedOn: "2026-07-19",
    cycle: "2026",
    note: "Partly checked. Confirmed from NHS England: the MSRA is weighted 40% and the interview 60%, the MSRA decides shortlisting when applications exceed interview capacity, and there is no self-assessment — so the 56-point assessment with a 38-point threshold this tool previously offered had no counterpart, and the entry's claim that no MSRA was required was wrong. Left unverified because what the interview actually scores is not published on any accessible official page, so whether portfolio evidence carries marks here is unestablished and not guessed at.",
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

/**
 * True when the specialty has a portfolio the applicant can score themselves.
 *
 * Also false where no maximum is published, whatever the model says. A
 * specialty whose points are unknown cannot produce a meaningful total, and
 * scoring one out of zero would render as a broken percentage rather than as
 * the honest answer, which is that the figures are not established.
 */
export function isScorable(specialtyId: string): boolean {
  if (NON_SCORABLE_MODELS.includes(getVerification(specialtyId).scoringModel)) {
    return false;
  }
  const specialty = getSpecialtyById(specialtyId);
  return !!specialty && specialty.totalMaxScore > 0;
}
