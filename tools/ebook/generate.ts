/**
 * MedPath UK reference e-book generator.
 *
 * Reads the SAME data the site uses (scoring matrices, Arabic layer, resources,
 * links) and emits two self-contained, print-ready HTML files — one English
 * (LTR), one Arabic (RTL). Open either in a browser and Print → Save as PDF, or
 * run the puppeteer step to get PDFs directly.
 *
 *   npx tsx tools/ebook/generate.ts
 *
 * It never invents a score: only specialties verified against an official source
 * get a scoring matrix; the rest are listed as "no published score", exactly as
 * the site treats them.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  SAS_SPECIALTIES,
  getVerification,
  isVerified,
  isScorable,
  type SASSpecialty,
  type SASDomain,
  type SASCriterion,
} from "../../shared/sas-data";
import { sasAr } from "../../shared/sas-i18n-ar";
import { resources as enResources } from "../../client/src/i18n/en/resources";
import { resources as arResources } from "../../client/src/i18n/ar/resources";

type Lang = "en" | "ar";

const EDITION = "2026";

// ── Official links (canonical set, mirrors the DB seed) ──────────────────────
const LINKS: { name: string; url: string; description: string; category: string }[] = [
  { name: "GMC — General Medical Council", url: "https://www.gmc-uk.org", description: "UK medical licensing and registration authority", category: "registration" },
  { name: "NHS Jobs", url: "https://www.jobs.nhs.uk", description: "Official NHS jobs portal", category: "jobs" },
  { name: "Oriel — UK Training Applications", url: "https://www.oriel.nhs.uk", description: "Official portal for postgraduate medical training applications", category: "applications" },
  { name: "OET Official", url: "https://www.occupationalenglishtest.org", description: "Occupational English Test for healthcare professionals", category: "english" },
  { name: "Think. Check. Submit.", url: "https://thinkchecksubmit.org", description: "Helps researchers identify trusted journals", category: "research" },
  { name: "ICMJE", url: "https://www.icmje.org", description: "Authorship and publication standards", category: "research" },
  { name: "UKRIO — UK Research Integrity Office", url: "https://ukrio.org", description: "Research integrity guidance for UK researchers", category: "research" },
  { name: "Royal College of Physicians", url: "https://www.rcplondon.ac.uk", description: "MRCP exams and physician training", category: "colleges" },
  { name: "Royal College of Surgeons", url: "https://www.rcseng.ac.uk", description: "MRCS exams and surgical training", category: "colleges" },
  { name: "Royal College of GPs", url: "https://www.rcgp.org.uk", description: "MRCGP and GP training", category: "colleges" },
  { name: "Health Education England", url: "https://www.hee.nhs.uk", description: "NHS workforce training and education", category: "training" },
  { name: "PLAB", url: "https://www.gmc-uk.org/registration-and-licensing/join-the-register/plab", description: "PLAB exam information for IMGs", category: "exams" },
];

// ── Bilingual framing text ───────────────────────────────────────────────────
const T = {
  en: {
    htmlLang: "en", dir: "ltr" as const,
    title: "Planning Your UK Specialty Training",
    subtitle: "A reference guide to how UK specialty recruitment is scored, specialty by specialty",
    brand: "MedPath UK", by: "Healthcare Quality School (HCQS)", edition: `Edition ${EDITION}`,
    tocTitle: "Contents",
    toc: ["About this guide", "How UK recruitment scoring works", "Priority for UK graduates (2026)", "Specialty scoring reference", "Building your portfolio", "Official links", "Sources & provenance"],
    aboutTitle: "About this guide",
    about: [
      "This guide explains how recruitment into UK postgraduate medical training is scored, and sets out — specialty by specialty — the published criteria your application is measured against. It is written for international and UK medical graduates planning their route into Core or Specialty Training.",
      "Every scoring matrix in this book is taken from that specialty's official recruitment source for the stated cycle. Where a specialty has not published a self-assessment scoring matrix, or its source could not be verified, it is listed honestly as having no published score — no figure is invented. A plausible guess is worse than showing nothing, because a doctor may spend a year collecting evidence against it.",
      "Recruitment criteria change from year to year. Always confirm the current requirements against the official source before making decisions. This guide is a study aid, not an official document, and is not affiliated with or endorsed by the GMC, NHS England, Health Education England, or any Royal College.",
    ],
    aboutOwner: "Published by Healthcare Quality School (HCQS). ICO reference ZC149125 · UKPRN 10101333.",
    ch1Title: "How UK recruitment scoring works",
    ch1: [
      "When you apply for UK specialty training through Oriel, your application is ranked. How that rank is produced differs by specialty — and knowing which model applies to your specialty tells you exactly where your effort pays off.",
      "There are four models you will meet:",
    ],
    models: [
      ["Self-assessment", "You score your own portfolio on the application form against a published points matrix, and that score is used to rank you (then verified against your evidence). These are the specialties this guide can show you a full matrix for — you can work out your score in advance."],
      ["Interview-portfolio", "Your portfolio is scored, but by a panel at interview rather than on the form. It matters enormously — it simply cannot be self-scored in advance. This guide shows what the panel marks instead of a self-score."],
      ["Application-assessed", "Your written answers are scored at shortlisting by assessors, not self-assigned. Scorable in principle, but not something you total up yourself."],
      ["MSRA-only", "No portfolio is scored at any stage; your rank comes from the MSRA exam alone. Here your time is best spent on the exam, not on portfolio points that are not counted."],
    ],
    ch1After: [
      "The MSRA (Multi-Specialty Recruitment Assessment) is a computer-based exam used by many specialties. Where it applies, it is noted on each specialty below.",
      "Across the self-assessment specialties, the domains that carry marks are consistent: research and publications, quality improvement, clinical audit, teaching, presentations, leadership, and the required Royal College exams. Research and publications are among the most heavily weighted and the slowest to build — start there.",
    ],
    ch2Title: "Priority for UK graduates (2026)",
    ch2: [
      "The Medical Training (Prioritisation) Act became law on 5 March 2026. It gives priority in recruitment to a defined group, and you should read the full list to place yourself accurately rather than assume you are excluded.",
      "Priority applies to: graduates of the UK and Ireland; graduates of Iceland, Liechtenstein, Norway and Switzerland; doctors completing relevant UK training; British and Irish citizens; those with Commonwealth right of abode; those with indefinite leave to remain (ILR); and holders of EU Settlement Scheme status.",
      "It is applied at the offer stage in 2026, and at shortlisting as well from 2027. Note that an international medical graduate who holds British citizenship or ILR is prioritised — which is why the full list matters. Eligibility is decided by the recruiting bodies, not by this guide.",
    ],
    ch3Title: "Specialty scoring reference",
    ch3Intro: "The specialties below have published criteria verified against an official source. Each shows its application route, whether the MSRA is required, its scoring model, and — where self-assessed — the full points matrix. Specialties without a published self-assessment score are listed at the end of this chapter.",
    ch4Title: "Building your portfolio",
    ch4Intro: "These are the domains that earn marks across most specialties, with practical guidance for each. They are drawn from the MedPath UK resource library.",
    ch5Title: "Official links",
    ch5Intro: "The official sources you will use throughout your journey. Always prefer these over third-party summaries.",
    appxTitle: "Sources & provenance",
    appxIntro: "Every specialty in this guide, with its verification status, scoring model, the cycle checked, and the date checked. Specialties marked unverified are shown without a score.",
    labels: {
      route: "Application route", msra: "MSRA required", model: "Scoring model", maxScore: "Maximum self-assessed score",
      threshold: "Competitive threshold", source: "Official source", yes: "Yes", no: "No", points: "pts", max: "max",
      noScore: "No published self-assessment score — see scoring model above.",
      noPublished: "Specialties without a published self-assessment score",
      noPublishedNote: "These specialties did not have a self-assessment scoring matrix that could be verified against an official source at the time of writing. They are ranked by other means (for example the MSRA), or their criteria were not published. Confirm the current process on the official source.",
      verified: "Verified", unverified: "Not verified", checked: "Checked", cycle: "Cycle", na: "—",
      specialty: "Specialty", status: "Status", interviewContext: "Interview / panel scoring",
    },
    categories: { registration: "Registration & licensing", jobs: "Jobs", applications: "Applications", english: "English language", research: "Research", colleges: "Royal Colleges", training: "Training & education", exams: "Exams" } as Record<string, string>,
    footer: "MedPath UK — Healthcare Quality School",
  },
  ar: {
    htmlLang: "ar", dir: "rtl" as const,
    title: "التخطيط للتدريب التخصصي في بريطانيا",
    subtitle: "دليل مرجعي لكيفية احتساب درجات القبول في التخصصات البريطانية، تخصصاً تخصصاً",
    brand: "MedPath UK", by: "Healthcare Quality School (HCQS)", edition: `إصدار ${EDITION}`,
    tocTitle: "المحتويات",
    toc: ["عن هذا الدليل", "كيف تُحتسب درجات القبول في بريطانيا", "أولوية خرّيجي بريطانيا (2026)", "المرجع الكامل لدرجات التخصصات", "بناء ملفك المهني", "الروابط الرسمية", "المصادر والتوثيق"],
    aboutTitle: "عن هذا الدليل",
    about: [
      "يشرح هذا الدليل كيف تُحتسب درجات القبول في التدريب الطبي العليا في بريطانيا، ويعرض — تخصصاً تخصصاً — المعايير المنشورة التي يُقاس عليها طلبك. وهو موجَّه للأطباء خرّيجي الخارج وخرّيجي بريطانيا الذين يخطّطون لدخول التدريب الأساسي (Core) أو التخصصي (Specialty Training).",
      "كل مصفوفة درجات في هذا الكتاب مأخوذة من المصدر الرسمي لذلك التخصص للدورة المذكورة. وحين لا يكون لتخصصٍ مصفوفة تقييم ذاتي منشورة، أو تعذّر التحقق من مصدره، يُذكر بصدق أنه بلا درجة منشورة — ولا نخترع أي رقم. فالتخمين المعقول أسوأ من عدم عرض شيء، لأن الطبيب قد يقضي عاماً في جمع أدلة بناءً عليه.",
      "معايير القبول تتغيّر من سنة لأخرى. تأكّد دائماً من المتطلبات الحالية من المصدر الرسمي قبل اتخاذ أي قرار. هذا الدليل أداة دراسية وليس وثيقة رسمية، وليس تابعاً لـ GMC أو NHS England أو Health Education England أو أي كلية ملكية ولا معتمَداً منها.",
    ],
    aboutOwner: "صادر عن Healthcare Quality School (HCQS). مرجع ICO رقم ZC149125 · UKPRN رقم 10101333.",
    ch1Title: "كيف تُحتسب درجات القبول في بريطانيا",
    ch1: [
      "عند التقديم للتدريب التخصصي البريطاني عبر Oriel، يُرتَّب طلبك تنافسياً. وطريقة احتساب هذا الترتيب تختلف حسب التخصص — ومعرفة النموذج المطبَّق على تخصصك تدلّك بالضبط على أين يثمر مجهودك.",
      "هناك أربعة نماذج ستقابلها:",
    ],
    models: [
      ["التقييم الذاتي (Self-assessment)", "تُقيّم ملفك بنفسك في نموذج الطلب مقابل مصفوفة نقاط منشورة، وتُستخدم هذه الدرجة لترتيبك (ثم يُتحقَّق منها مقابل أدلتك). هذه هي التخصصات التي يعرض لك هذا الدليل مصفوفتها كاملة — تقدر تحسب درجتك مسبقاً."],
      ["ملف يقيّمه المُقابِلون (Interview-portfolio)", "يُقيَّم ملفك لكن من لجنة في المقابلة لا في النموذج. وهو مهم جداً، لكنه ببساطة لا يُقيَّم ذاتياً مسبقاً. يعرض الدليل ما تقيّمه اللجنة بدل درجة ذاتية."],
      ["يُقيَّم عند الفرز (Application-assessed)", "تُقيَّم إجاباتك المكتوبة عند الفرز من مُقيّمين، لا تُحتسب ذاتياً. قابلة للتقييم مبدئياً، لكنها ليست شيئاً تجمعه بنفسك."],
      ["MSRA فقط", "لا يُقيَّم أي ملف في أي مرحلة؛ ترتيبك من امتحان MSRA وحده. هنا وقتك يُصرَف على الامتحان، لا على نقاط ملف لا تُحتسب."],
    ],
    ch1After: [
      "امتحان MSRA (Multi-Specialty Recruitment Assessment) امتحان حاسوبي تستخدمه تخصصات كثيرة. وحيثما ينطبق، مذكور عند كل تخصص أدناه.",
      "عبر تخصصات التقييم الذاتي، المجالات التي تحمل الدرجات ثابتة: البحث والمنشورات، تحسين الجودة، التدقيق السريري، التدريس، العروض، القيادة، وامتحانات الكليات الملكية المطلوبة. البحث والمنشورات من أكثرها وزناً وأبطئها بناءً — ابدأ منها.",
    ],
    ch2Title: "أولوية خرّيجي بريطانيا (2026)",
    ch2: [
      "أصبح قانون التدريب الطبي (الأولوية) — Medical Training (Prioritisation) Act — نافذاً في 5 مارس 2026. يمنح القانون أولوية في القبول لفئة محدَّدة، والأفضل أن تقرأ القائمة كاملة لتُحدّد موقعك بدقة بدل افتراض استبعادك.",
      "تشمل الأولوية: خرّيجي بريطانيا وأيرلندا؛ خرّيجي آيسلندا وليختنشتاين والنرويج وسويسرا؛ الأطباء الذين يُكملون تدريباً بريطانياً ذا صلة؛ المواطنين البريطانيين والأيرلنديين؛ أصحاب حق الإقامة الكومنولثي؛ حاملي الإقامة الدائمة (ILR)؛ وحاملي وضع EU Settlement Scheme.",
      "يُطبَّق عند مرحلة العرض في 2026، وعند الفرز أيضاً اعتباراً من 2027. لاحظ أن خرّيج الخارج الذي يحمل الجنسية البريطانية أو ILR تُطبَّق عليه الأولوية — ولهذا تهمّ القائمة كاملة. الأهلية تقرّرها جهات القبول، لا هذا الدليل.",
    ],
    ch3Title: "المرجع الكامل لدرجات التخصصات",
    ch3Intro: "التخصصات التالية لها معايير منشورة تم التحقق منها مقابل مصدر رسمي. يعرض كل تخصص مسار التقديم، وهل MSRA مطلوب، ونموذج التقييم، و — حيث يكون ذاتياً — مصفوفة النقاط كاملة. أما التخصصات بلا درجة تقييم ذاتي منشورة فمذكورة في آخر هذا الفصل.",
    ch4Title: "بناء ملفك المهني",
    ch4Intro: "هذه هي المجالات التي تكسب الدرجات في معظم التخصصات، مع إرشاد عملي لكل منها، مأخوذة من مكتبة مصادر MedPath UK.",
    ch5Title: "الروابط الرسمية",
    ch5Intro: "المصادر الرسمية التي ستستخدمها طوال رحلتك. فضّلها دائماً على الملخّصات من أطراف أخرى.",
    appxTitle: "المصادر والتوثيق",
    appxIntro: "كل تخصص في هذا الدليل، مع حالة التحقق، ونموذج التقييم، والدورة التي رُوجعت، وتاريخ المراجعة. التخصصات غير المُتحقَّق منها معروضة بلا درجة.",
    labels: {
      route: "مسار التقديم", msra: "MSRA مطلوب", model: "نموذج التقييم", maxScore: "أقصى درجة تقييم ذاتي",
      threshold: "الحد التنافسي", source: "المصدر الرسمي", yes: "نعم", no: "لا", points: "نقطة", max: "الأقصى",
      noScore: "لا توجد درجة تقييم ذاتي منشورة — راجع نموذج التقييم أعلاه.",
      noPublished: "تخصصات بلا درجة تقييم ذاتي منشورة",
      noPublishedNote: "هذه التخصصات لم يكن لها مصفوفة تقييم ذاتي يمكن التحقق منها مقابل مصدر رسمي وقت الكتابة. تُرتَّب بوسائل أخرى (مثل MSRA)، أو أن معاييرها لم تُنشَر. تأكّد من العملية الحالية من المصدر الرسمي.",
      verified: "مُتحقَّق منه", unverified: "غير مُتحقَّق", checked: "روجِع", cycle: "الدورة", na: "—",
      specialty: "التخصص", status: "الحالة", interviewContext: "تقييم المقابلة / اللجنة",
    },
    categories: { registration: "التسجيل والترخيص", jobs: "الوظائف", applications: "التقديم", english: "اللغة الإنجليزية", research: "البحث", colleges: "الكليات الملكية", training: "التدريب والتعليم", exams: "الامتحانات" } as Record<string, string>,
    footer: "MedPath UK — Healthcare Quality School",
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function esc(s: string): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Arabic display value for an element by id, with English fallback.
function arText(id: string, field: "name" | "description" | "criterion" | "evidence", fallback: string): string {
  const e = sasAr(id) as any;
  return (e && e[field]) ? e[field] : fallback;
}
function arOptionLabel(id: string, index: number, fallback: string): string {
  const e = sasAr(id) as any;
  return (e && Array.isArray(e.options) && e.options[index]) ? e.options[index] : fallback;
}

function modelLabel(lang: Lang, model: string): string {
  const map: Record<Lang, Record<string, string>> = {
    en: { "self-assessment": "Self-assessment", "interview-portfolio": "Interview-portfolio", "application-assessed": "Application-assessed", "msra-only": "MSRA-only", "unknown": "Not established" },
    ar: { "self-assessment": "تقييم ذاتي", "interview-portfolio": "ملف يقيّمه المُقابِلون", "application-assessed": "يُقيَّم عند الفرز", "msra-only": "MSRA فقط", "unknown": "غير محدَّد" },
  };
  return map[lang][model] ?? model;
}

// Render a resources item's \n-delimited content string into HTML.
function renderContent(content: string): string {
  const lines = content.split("\n").map(l => l.trim()).filter(Boolean);
  let html = "", listBuf: string[] = [], listType: "ul" | "ol" | null = null;
  const flush = () => {
    if (listBuf.length) { html += `<${listType}>${listBuf.map(li => `<li>${esc(li)}</li>`).join("")}</${listType}>`; listBuf = []; listType = null; }
  };
  for (const line of lines) {
    if (/^\d+\.\s/.test(line)) { if (listType !== "ol") flush(); listType = "ol"; listBuf.push(line.replace(/^\d+\.\s/, "")); }
    else if (/^-\s/.test(line)) { if (listType !== "ul") flush(); listType = "ul"; listBuf.push(line.replace(/^-\s/, "")); }
    else if (line.endsWith(":")) { flush(); html += `<p class="subhead">${esc(line)}</p>`; }
    else { flush(); html += `<p>${esc(line)}</p>`; }
  }
  flush();
  return html;
}

// ── Specialty rendering ──────────────────────────────────────────────────────
function renderCriterion(lang: Lang, c: SASCriterion, L: typeof T["en"]["labels"]): string {
  const critText = lang === "ar" ? arText(c.id, "criterion", c.criterion) : c.criterion;
  const evidence = lang === "ar" ? arText(c.id, "evidence", c.evidence || "") : (c.evidence || "");
  let pointsCell = "";
  let optionsHtml = "";
  if (c.options && c.options.length) {
    const maxOpt = Math.max(...c.options.map(o => o.score));
    pointsCell = `0–${maxOpt} ${L.points}`;
    optionsHtml = `<ul class="options">${c.options.map((o, i) => {
      const label = lang === "ar" ? arOptionLabel(c.id, i, o.label) : o.label;
      return `<li><span class="opt-pts">${o.score}</span> ${esc(label)}</li>`;
    }).join("")}</ul>`;
  } else {
    pointsCell = `${c.score} ${L.points}`;
  }
  return `<tr>
    <td class="crit"><div class="crit-text">${esc(critText)}</div>${evidence ? `<div class="evidence">${esc(evidence)}</div>` : ""}${optionsHtml}</td>
    <td class="pts">${esc(pointsCell)}</td>
  </tr>`;
}

function renderDomain(lang: Lang, d: SASDomain, L: typeof T["en"]["labels"]): string {
  const dName = lang === "ar" ? arText(d.id, "name", d.name) : d.name;
  return `<div class="domain">
    <h4 class="domain-h">${esc(dName)} <span class="domain-max">${d.maxScore} ${L.max}</span></h4>
    <table class="crit-table"><tbody>${d.criteria.map(c => renderCriterion(lang, c, L)).join("")}</tbody></table>
  </div>`;
}

function renderSpecialty(lang: Lang, s: SASSpecialty, tt: typeof T["en"]): string {
  const L = tt.labels;
  const name = lang === "ar" ? arText(s.id, "name", s.name) : s.name;
  const desc = lang === "ar" ? arText(s.id, "description", s.description) : s.description;
  const model = getVerification(s.id).scoringModel;
  const scorable = isScorable(s.id);
  const rows: string[] = [];
  rows.push(`<tr><th>${L.route}</th><td>${esc(s.applicationRoute)}</td></tr>`);
  rows.push(`<tr><th>MSRA</th><td>${s.msraRequired ? L.yes : L.no}</td></tr>`);
  rows.push(`<tr><th>${L.model}</th><td>${esc(modelLabel(lang, model))}</td></tr>`);
  if (scorable && s.totalMaxScore > 0) rows.push(`<tr><th>${L.maxScore}</th><td>${s.totalMaxScore} ${L.points}</td></tr>`);
  if (s.competitiveThreshold != null) rows.push(`<tr><th>${L.threshold}</th><td>${s.competitiveThreshold}</td></tr>`);
  rows.push(`<tr><th>${L.source}</th><td><a href="${esc(s.sourceUrl)}">${esc(s.sourceUrl)}</a></td></tr>`);

  let body = "";
  if (scorable) {
    body = s.domains.map(d => renderDomain(lang, d, L)).join("");
  } else {
    body = `<p class="note">${esc(L.noScore)}</p>`;
    if (s.interviewScoring?.description) {
      body += `<div class="domain"><h4 class="domain-h">${esc(L.interviewContext)}</h4><p>${esc(s.interviewScoring.description)}</p></div>`;
    }
  }

  return `<section class="specialty">
    <h3 class="spec-h">${esc(name)} <span class="spec-short">${esc(s.shortName)}</span></h3>
    <p class="spec-desc">${esc(desc)}</p>
    <table class="meta"><tbody>${rows.join("")}</tbody></table>
    ${body}
  </section>`;
}

// ── Chapters ─────────────────────────────────────────────────────────────────
function chapter(num: string, title: string, inner: string): string {
  return `<section class="chapter"><div class="ch-num">${num}</div><h2 class="ch-title">${esc(title)}</h2>${inner}</section>`;
}
function paras(list: string[]): string { return list.map(p => `<p>${esc(p)}</p>`).join(""); }

function buildBody(lang: Lang): string {
  const tt = T[lang];
  const L = tt.labels;

  const verified = SAS_SPECIALTIES.filter(s => isVerified(s.id));
  const scorable = verified.filter(s => isScorable(s.id)).sort((a, b) => a.name.localeCompare(b.name));
  const nonScorable = verified.filter(s => !isScorable(s.id)).sort((a, b) => a.name.localeCompare(b.name));
  const unverified = SAS_SPECIALTIES.filter(s => !isVerified(s.id)).sort((a, b) => a.name.localeCompare(b.name));

  // Ch1
  const ch1 = chapter("1", tt.ch1Title,
    paras(tt.ch1) +
    `<div class="models">${tt.models.map(([h, b]) => `<div class="model"><h4>${esc(h)}</h4><p>${esc(b)}</p></div>`).join("")}</div>` +
    paras(tt.ch1After));

  // Ch2
  const ch2 = chapter("2", tt.ch2Title, paras(tt.ch2));

  // Ch3 — specialties
  const ch3Body =
    `<p class="ch-intro">${esc(tt.ch3Intro)}</p>` +
    scorable.map(s => renderSpecialty(lang, s, tt)).join("") +
    nonScorable.map(s => renderSpecialty(lang, s, tt)).join("") +
    `<h3 class="subch">${esc(L.noPublished)}</h3><p class="note">${esc(L.noPublishedNote)}</p>` +
    unverified.map(s => {
      const name = lang === "ar" ? arText(s.id, "name", s.name) : s.name;
      const desc = lang === "ar" ? arText(s.id, "description", s.description) : s.description;
      return `<section class="specialty compact"><h3 class="spec-h">${esc(name)} <span class="spec-short">${esc(s.shortName)}</span></h3><p class="spec-desc">${esc(desc)}</p><table class="meta"><tbody><tr><th>${L.model}</th><td>${esc(modelLabel(lang, getVerification(s.id).scoringModel))}</td></tr><tr><th>${L.source}</th><td>${s.sourceUrl ? `<a href="${esc(s.sourceUrl)}">${esc(s.sourceUrl)}</a>` : L.na}</td></tr></tbody></table></section>`;
    }).join("");
  const ch3 = chapter("3", tt.ch3Title, ch3Body);

  // Ch4 — resources
  const res = (lang === "ar" ? arResources : enResources) as any;
  const ch4Body = `<p class="ch-intro">${esc(tt.ch4Intro)}</p>` + res.sections.map((sec: any) =>
    `<div class="res-section"><h3 class="subch">${esc(sec.title)}</h3><p class="res-desc">${esc(sec.description)}</p>` +
    sec.items.map((it: any) => `<div class="res-item"><h4>${esc(it.title)}</h4>${renderContent(it.content)}</div>`).join("") +
    `</div>`).join("");
  const ch4 = chapter("4", tt.ch4Title, ch4Body);

  // Ch5 — links
  const byCat: Record<string, typeof LINKS> = {};
  for (const l of LINKS) (byCat[l.category] ||= []).push(l);
  const ch5Body = `<p class="ch-intro">${esc(tt.ch5Intro)}</p>` + Object.entries(byCat).map(([cat, links]) =>
    `<div class="link-group"><h3 class="subch">${esc(tt.categories[cat] || cat)}</h3>` +
    links.map(l => `<div class="link"><div class="link-name">${esc(l.name)}</div><div class="link-desc">${esc(l.description)}</div><a href="${esc(l.url)}">${esc(l.url)}</a></div>`).join("") +
    `</div>`).join("");
  const ch5 = chapter("5", tt.ch5Title, ch5Body);

  // Appendix — provenance
  const allSorted = [...SAS_SPECIALTIES].sort((a, b) => a.name.localeCompare(b.name));
  const appxRows = allSorted.map(s => {
    const v = getVerification(s.id);
    const name = lang === "ar" ? arText(s.id, "name", s.name) : s.name;
    return `<tr><td>${esc(name)}</td><td>${v.status === "verified" ? L.verified : L.unverified}</td><td>${esc(modelLabel(lang, v.scoringModel))}</td><td>${esc(v.cycle || L.na)}</td><td>${esc(v.checkedOn || L.na)}</td></tr>`;
  }).join("");
  const appx = chapter("A", tt.appxTitle,
    `<p class="ch-intro">${esc(tt.appxIntro)}</p>` +
    `<table class="provenance"><thead><tr><th>${L.specialty}</th><th>${L.status}</th><th>${L.model}</th><th>${L.cycle}</th><th>${L.checked}</th></tr></thead><tbody>${appxRows}</tbody></table>`);

  // About
  const about = chapter("", tt.aboutTitle, paras(tt.about) + `<p class="owner">${esc(tt.aboutOwner)}</p>`);

  // TOC
  const toc = `<section class="toc"><h2>${esc(tt.tocTitle)}</h2><ol>${tt.toc.map(x => `<li>${esc(x)}</li>`).join("")}</ol></section>`;

  return about + toc + ch1 + ch2 + ch3 + ch4 + ch5 + appx;
}

// ── Page shell ───────────────────────────────────────────────────────────────
function html(lang: Lang): string {
  const tt = T[lang];
  const fontStack = lang === "ar"
    ? `'Cairo', 'Segoe UI', Tahoma, sans-serif`
    : `'Lora', Georgia, 'Times New Roman', serif`;
  const body = buildBody(lang);
  return `<!doctype html>
<html lang="${tt.htmlLang}" dir="${tt.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(tt.title)} — ${esc(tt.brand)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>
  :root { --ink:#1a1a2e; --muted:#5b5b73; --line:#dcdce6; --accent:#6d28d9; --accent-soft:#f3effe; --page:#ffffff; }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; }
  body { font-family:${fontStack}; color:var(--ink); background:#e9e9f0; line-height:1.6; font-size:11pt; }
  a { color:var(--accent); text-decoration:none; word-break:break-word; }

  /* Screen: paginated look. Print: real A4 pages. */
  .page-wrap { max-width:820px; margin:0 auto; padding:24px 0; }
  @page { size:A4; margin:20mm 18mm; }
  @media print {
    body { background:#fff; }
    .page-wrap { max-width:none; margin:0; padding:0; }
    .cover, .chapter, .toc { page-break-after:always; }
    .specialty { page-break-inside:avoid; }
    a { color:var(--ink); }
  }

  .sheet { background:var(--page); }
  @media screen { .sheet { box-shadow:0 2px 18px rgba(0,0,0,.12); margin-bottom:22px; padding:40px 48px; border-radius:2px; } }
  @media print { .sheet { padding:0; } }

  /* Cover */
  .cover { min-height:88vh; display:flex; flex-direction:column; justify-content:center; text-align:center; padding:60px 48px; }
  .cover .brand { color:var(--accent); font-weight:700; letter-spacing:.05em; font-size:14pt; margin-bottom:28px; }
  .cover h1 { font-size:30pt; line-height:1.25; margin:0 0 18px; }
  .cover .sub { color:var(--muted); font-size:13pt; max-width:34em; margin:0 auto 40px; }
  .cover .meta { color:var(--muted); font-size:11pt; border-top:1px solid var(--line); padding-top:20px; display:inline-block; }

  h2.ch-title { font-size:21pt; margin:.1em 0 .6em; color:var(--ink); }
  .ch-num { color:var(--accent); font-weight:700; font-size:12pt; letter-spacing:.15em; }
  .ch-intro { color:var(--muted); font-size:11.5pt; margin-bottom:1.4em; }
  .subch { font-size:14pt; margin:1.6em 0 .5em; color:var(--accent); border-bottom:1px solid var(--line); padding-bottom:.25em; }
  h4 { margin:1em 0 .4em; font-size:12pt; }
  p { margin:.5em 0; }
  .owner { color:var(--muted); font-size:10pt; border-top:1px solid var(--line); padding-top:12px; margin-top:20px; }

  .toc h2 { font-size:19pt; }
  .toc ol { font-size:12.5pt; line-height:2; padding-inline-start:1.4em; }

  .models { margin:1em 0; }
  .model { background:var(--accent-soft); border-radius:8px; padding:12px 16px; margin:10px 0; }
  .model h4 { margin:0 0 .2em; color:var(--accent); }
  .model p { margin:0; font-size:10.5pt; }

  /* Specialty */
  .specialty { margin:0 0 22px; padding-top:8px; }
  .spec-h { font-size:15pt; margin:.6em 0 .2em; border-bottom:2px solid var(--accent); padding-bottom:.2em; }
  .spec-short { color:var(--muted); font-size:10pt; font-weight:400; }
  .spec-desc { font-size:10.5pt; color:var(--muted); margin:.3em 0 .7em; }
  table.meta { width:100%; border-collapse:collapse; margin:.4em 0 .9em; font-size:10pt; }
  table.meta th { text-align:start; width:42%; color:var(--muted); font-weight:600; vertical-align:top; padding:3px 8px; border-bottom:1px solid var(--line); }
  table.meta td { padding:3px 8px; border-bottom:1px solid var(--line); vertical-align:top; }

  .domain { margin:.8em 0; }
  .domain-h { font-size:11.5pt; margin:.6em 0 .3em; background:var(--accent-soft); padding:5px 10px; border-radius:5px; }
  .domain-max { float:inline-end; color:var(--accent); font-size:9.5pt; font-weight:600; }
  table.crit-table { width:100%; border-collapse:collapse; font-size:10pt; }
  table.crit-table td { padding:6px 10px; border-bottom:1px solid var(--line); vertical-align:top; }
  td.crit { width:82%; }
  td.pts { text-align:end; white-space:nowrap; color:var(--accent); font-weight:600; font-size:9.5pt; }
  .crit-text { font-weight:600; }
  .evidence { color:var(--muted); font-size:9pt; margin-top:2px; }
  ul.options { margin:.35em 0 0; padding-inline-start:1.1em; list-style:none; }
  ul.options li { font-size:9.5pt; margin:2px 0; color:var(--ink); }
  .opt-pts { display:inline-block; min-width:1.6em; text-align:center; background:var(--accent); color:#fff; border-radius:4px; font-size:8.5pt; font-weight:700; padding:0 4px; margin-inline-end:6px; }
  .note { background:#fff7ed; border-inline-start:3px solid #f59e0b; padding:8px 12px; font-size:10pt; border-radius:4px; }

  .res-desc, .link-desc { color:var(--muted); font-size:10pt; }
  .res-item { margin:.6em 0 1em; }
  .subhead { font-weight:700; margin-top:.6em; }
  .link { padding:8px 0; border-bottom:1px solid var(--line); }
  .link-name { font-weight:700; }
  .link a { font-size:9.5pt; }

  table.provenance { width:100%; border-collapse:collapse; font-size:9.5pt; }
  table.provenance th { background:var(--accent-soft); text-align:start; padding:6px 8px; border-bottom:2px solid var(--accent); }
  table.provenance td { padding:5px 8px; border-bottom:1px solid var(--line); }
</style>
</head>
<body>
<div class="page-wrap">
  <div class="sheet cover">
    <div class="brand">${esc(tt.brand)}</div>
    <h1>${esc(tt.title)}</h1>
    <div class="sub">${esc(tt.subtitle)}</div>
    <div class="meta">${esc(tt.by)} · ${esc(tt.edition)}</div>
  </div>
  <div class="sheet">${body}</div>
</div>
</body>
</html>`;
}

// ── Write ────────────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "dist");
mkdirSync(outDir, { recursive: true });
for (const lang of ["en", "ar"] as Lang[]) {
  const file = join(outDir, `medpath-guide-${lang}.html`);
  writeFileSync(file, html(lang), "utf8");
  console.log("wrote", file);
}
console.log("done");
