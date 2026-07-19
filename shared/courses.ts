// Health Care Quality School training courses.
//
// These are the platform operator's own commercial courses, not independent
// recommendations, and every surface that shows one must say so — see the
// "Our course" badge in Links.tsx and SASAssessment.tsx.
//
// They are matched to a specialty's weak scoring domains so a suggestion only
// appears where it answers a gap the applicant actually has. A course shown
// against a domain the applicant already maxed is an advert; shown against a
// domain they scored nothing in, it is an answer to the question the results
// page just raised.

export interface Course {
  id: string;
  title: string;
  url: string;
  /** What the course covers, in the applicant's terms. */
  blurb: string;
}

const SCHOOL = "https://www.healthcarequalityschools.com/p";

/** Courses that apply regardless of specialty. */
export const GENERAL_COURSES: Record<string, Course> = {
  qip: {
    id: "qip",
    title: "Quality Improvement Project in Healthcare",
    url: `${SCHOOL}/quality-improvement-project-in-healthcare512244112131`,
    blurb: "Running a QI project end to end, including the PDSA cycles recruitment scoring asks you to evidence.",
  },
  audit: {
    id: "audit",
    title: "Clinical Audit Training",
    url: `${SCHOOL}/clinical-audit-training`,
    blurb: "Designing and closing an audit loop, and documenting your own role in it.",
  },
};

/**
 * Research and publication courses, one per specialty. Keyed by the SAS
 * specialty id so a suggestion matches the pathway being assessed; specialties
 * with no matching course simply get no suggestion rather than a generic one.
 */
export const RESEARCH_COURSES: Record<string, Course> = {
  imt: {
    id: "research-im",
    title: "Medical Research Methodology and Publication — Internal Medicine",
    url: `${SCHOOL}/clinical-research-training31111112122`,
    blurb: "Taking an internal medicine project from methodology through to publication.",
  },
  respiratory: {
    id: "research-resp",
    title: "Research Methodology and Publication — Respiratory Medicine",
    url: `${SCHOOL}/clinical-research-training311111121211312111`,
    blurb: "Taking a respiratory project from methodology through to publication.",
  },
  endocrinology: {
    id: "research-endo",
    title: "Research Methodology and Publication — Endocrinology",
    url: `${SCHOOL}/clinical-research-training811441121`,
    blurb: "Taking an endocrinology project from methodology through to publication.",
  },
  paediatrics: {
    id: "research-paeds",
    title: "Medical Research Methodology and Publication — Paediatrics",
    url: `${SCHOOL}/clinical-research-training81144313`,
    blurb: "Taking a paediatric project from methodology through to publication.",
  },
  orthopaedics: {
    id: "research-ortho",
    title: "Medical Research Methodology and Publication — Orthopaedics",
    url: `${SCHOOL}/clinical-research-training81144521211122`,
    blurb: "Taking an orthopaedic project from methodology through to publication.",
  },
  og: {
    id: "research-og",
    title: "Research and Publication — Obstetrics and Gynaecology",
    url: `${SCHOOL}/clinical-research-training82121121`,
    blurb: "Taking an O&G project from methodology through to publication.",
  },
  cst: {
    id: "research-surgery",
    title: "Medical Research Methodology and Publication — Surgery",
    url: `${SCHOOL}/clinical-research-training811321`,
    blurb: "Taking a surgical project from methodology through to publication.",
  },
  neurosurgery: {
    id: "research-surgery",
    title: "Medical Research Methodology and Publication — Surgery",
    url: `${SCHOOL}/clinical-research-training811321`,
    blurb: "Taking a surgical project from methodology through to publication.",
  },
};

/** Domain-name patterns that each general course speaks to. */
const DOMAIN_MATCHERS: { course: Course; pattern: RegExp }[] = [
  { course: GENERAL_COURSES.qip, pattern: /quality improvement|\bqip\b/i },
  { course: GENERAL_COURSES.audit, pattern: /audit/i },
];

const RESEARCH_PATTERN = /publication|research/i;

/**
 * The course that answers a given weak domain, if there is one.
 *
 * Returns null when nothing matches, which is the common case — most domains
 * (teaching, presentations, postgraduate degrees) have no course behind them
 * and should not be padded with an unrelated suggestion.
 */
export function courseForDomain(
  specialtyId: string,
  domainName: string
): Course | null {
  if (RESEARCH_PATTERN.test(domainName)) {
    return RESEARCH_COURSES[specialtyId] ?? null;
  }
  for (const { course, pattern } of DOMAIN_MATCHERS) {
    if (pattern.test(domainName)) return course;
  }
  return null;
}
