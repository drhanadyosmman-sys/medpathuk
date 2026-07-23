// Arabic display layer for the SAS scoring data.
//
// ADDITIVE ONLY. The authoritative English lives in shared/sas-data.ts and is
// never translated in place. This file provides Arabic strings, keyed by the
// SAME ids (specialty id, domain id, criterion id) used there, to be shown
// ABOVE the English in the UI while the English stays visible. A missing entry
// just shows English, which is safe.
//
// Faithfulness rules honoured here:
//  - Meaning is translated exactly; no point value or number is ever changed,
//    dropped or rounded (numbers live in the English data, not here — options[]
//    below are label text only, one Arabic string per option INDEX, same order).
//  - Exam names, official bodies and English abbreviations are kept in English
//    inside the Arabic (MRCP(UK), PACES, PubMed, PhD, MD, MSc, QIPAT, Oriel,
//    MSRA, PG Cert, ATLS, etc.).
//  - No criterion is invented that is not in sas-data.ts.

export interface SASArEntry {
  name?: string;
  description?: string;
  criterion?: string;
  evidence?: string;
  options?: string[];
}

// ─── PHST shared self-assessment (mirrors phstDomains in sas-data.ts) ─────────
// Every PHST specialty shares the same seven-domain, 38-point matrix; only the
// id prefix differs. Generated once here for the same reason it is defined once
// there — so the Arabic cannot drift between specialties.
function phstArDomains(prefix: string): Record<string, SASArEntry> {
  return {
    [`${prefix}_pg`]: {
      name: "الدرجات والمؤهلات العليا (postgraduate)",
    },
    [`${prefix}_pg1`]: {
      criterion: "أعلى درجة أو مؤهل عليا (postgraduate)",
      evidence:
        "شهادة المؤهل، أو خطاب من الجهة المانحة. يتطلب هذا المجال نموذج الأدلة (evidence pro forma) من PHST Document Library. لا يمكن المطالبة بالدرجات المتخللة (intercalated) في أي مكان. مؤهلات التدريس تُدرَج في مجال Training in Teaching. تُطالب بـ MRCP(UK) في مجالها الخاص، لا هنا.",
      options: [
        "PhD أو MD بحثية (يمكن أن تشمل مؤهلات غير طبية)",
        "درجة ماجستير مثل MSc أو MA أو MRes (يمكن أن تشمل غير الطبية). عادةً 8 أشهر أو أطول بدوام كامل مكافئ",
        "دبلوم أو شهادة عليا (postgraduate) أخرى ذات صلة، عادةً من شهر إلى عشرة أشهر بدوام كامل مكافئ — أو امتحان عضوية إضافي يتجاوز المطلوب للالتحاق، أو تسجيل كأخصائي في تخصص آخر",
        "لا شيء مما سبق",
      ],
    },
    [`${prefix}_mrcp`]: {
      name: "MRCP(UK)",
    },
    [`${prefix}_mrcp1`]: {
      criterion:
        "التقدّم في MRCP(UK)، أو البديل المذكور في مواصفات الشخص (person specification)",
      evidence:
        "شهادة MRCP(UK) الخاصة بك، أو خطاب من الكلية يؤكد المكونات الفردية، أو لقطة شاشة من حساب My MRCP(UK) تُظهر اسمك وما أنجزته. Part 1 لا يمنح أي درجة — فهو شرط أهلية.",
      options: [
        "اجتزت كلاً من Part 2 Written وPACES، أو بديلاً مذكوراً",
        "اجتزت PACES لكن ليس Part 2 Written، أو بديلاً مذكوراً",
        "اجتزت Part 2 Written لكن ليس PACES، أو بديلاً مذكوراً",
        "لم تجتز Part 2 Written ولا PACES ولا بديلاً مذكوراً",
      ],
    },
    [`${prefix}_pres`]: {
      name: "العروض التقديمية / الملصقات (Posters)",
    },
    [`${prefix}_pres1`]: {
      criterion:
        "أفضل عرض تقديمي أو ملصق (poster) في اجتماع طبي (المؤلف الأول أو الثاني فقط)",
      evidence:
        "تأكيد أن العرض أو الملصق قُبِل وأُدرِج — خطاب أو شهادة أو كتاب ملخصات (abstracts) الاجتماع — إضافة إلى الملخّص ونسخة من الشرائح أو الملصق. قد تُخفَّض المطالبات الوطنية والدولية بدون وثيقة ملخصات. يتطلب نموذج الأدلة (evidence pro forma).",
      options: [
        "عرض شفهي، مؤلف أول أو ثانٍ، في اجتماع طبي وطني أو دولي",
        "ملصق (poster)، مؤلف أول أو ثانٍ، عُرِض في اجتماع طبي وطني أو دولي",
        "عرض شفهي، مؤلف أول أو ثانٍ، في اجتماع طبي إقليمي",
        "عرض شفهي، مؤلف أول أو ثانٍ، في اجتماع طبي محلي",
        "ملصق (poster)، مؤلف أول أو ثانٍ، عُرِض في اجتماع طبي إقليمي أو محلي",
        "لا شيء مما سبق",
      ],
    },
    [`${prefix}_pub`]: {
      name: "المنشورات",
    },
    [`${prefix}_pub1`]: {
      criterion: "أفضل منشور",
      evidence:
        "لقطة شاشة لاستشهاد PubMed مع الرابط؛ وللأعمال «قيد الطبع» (in press)، تأكيد القبول من الناشر. للكتب: صفحة الغلاف والمحتويات وقائمة المؤلفين وISBN وموقع الناشر. يتطلب نموذج الأدلة (evidence pro forma).",
      options: [
        "مؤلف أول، أو مؤلف أول مشارك، أو مؤلف مراسِل لمنشور بحثي أصلي واحد أو أكثر مُستشهَد به في PubMed (أو قيد الطبع)",
        "مؤلف مشارك لمنشور بحثي أصلي واحد أو أكثر مُستشهَد به في PubMed (أو قيد الطبع)",
        "مؤلف أو مؤلف مشارك لأكثر من منشور آخر مُستشهَد به في PubMed (أو قيد الطبع) — افتتاحيات، مراجعات، ملخصات، تقارير حالة، رسائل",
        "كتبتَ فصلاً واحداً أو أكثر من كتاب متعلق بالطب (غير منشور ذاتياً)",
        "مؤلف أو مؤلف مشارك لمنشور آخر واحد مُستشهَد به في PubMed (أو قيد الطبع)",
        "نشرتَ ملخصاً واحداً أو أكثر، أو مقالات غير محكّمة، أو مقالات غير مُستشهَد بها في PubMed",
        "لا شيء مما سبق",
      ],
    },
    [`${prefix}_teach`]: {
      name: "خبرة التدريس",
    },
    [`${prefix}_teach1`]: {
      criterion: "خبرة التدريس التي قدّمتها",
      evidence:
        "يُطلب دليل على تقييم رسمي (formal feedback) لكل خيار تسجيل — ملاحظة من طبيب أقدم، أو نموذج Developing the Clinical Teacher أو Teaching Observation، أو تقييمات مجمّعة من المشاركين مع ملخّص. يتطلب الخياران الأعلى أيضاً خطاباً من مُوجِّهك (tutor) يؤكد دورك، على ورق رسمي، إضافة إلى جدول البرنامج. يتطلب نموذج الأدلة (evidence pro forma).",
      options: [
        "عملتَ مع مُوجِّهين محليين لتنظيم برنامج تدريسي ودرّست فيه بانتظام لمدة ثلاثة أشهر تقريباً أو أطول، مع دليل على تقييم رسمي",
        "قدّمتَ تدريساً منتظماً ضمن برنامج أو دورة محددة لمدة ثلاثة أشهر تقريباً أو أطول، مع دليل على تقييم رسمي",
        "درّستَ طلاب الطب أو ممارسي الرعاية الصحية أحياناً (ثلاث جلسات على الأقل)، مع دليل على تقييم رسمي",
        "لا شيء مما سبق",
      ],
    },
    [`${prefix}_teachtrain`]: {
      name: "التدريب على التدريس",
    },
    [`${prefix}_teachtrain1`]: {
      criterion: "التدريب الذي تلقيته في طرق التدريس",
      evidence:
        "شهادة إتمام من مقدّم الدورة، أو خطاب يؤكد الحضور، إضافة إلى مخطط الدورة يؤكد مدتها وطريقة تقديمها.",
      options: [
        "مؤهل أعلى في التدريس، مثل PG Cert أو PG Diploma (معتمد جامعياً، لخريجين فقط، 60 نقطة معتمدة على الأقل)",
        "تدريب على طرق التدريس دون مستوى PG Cert أو PG Diploma (ست ساعات على الأقل من التدريس المباشر، بخلاف مؤهلك الطبي الأساسي)",
        "لا تدريب على طرق التدريس",
      ],
    },
    [`${prefix}_qi`]: {
      name: "تحسين الجودة (Quality Improvement)",
    },
    [`${prefix}_qi1`]: {
      criterion: "المشاركة في مشاريع تحسين الجودة",
      evidence:
        "يُفضَّل نموذج QIPAT. وإلا فوثيقة رسمية من مشرفك تغطي الموضوع والأهداف، والمقاييس المحددة، ومنهجية تحسين الجودة (QI) المستخدمة، وتنفيذ التغيير مع مخطط تتبّع (run chart)، والتقييم مقابل التوقعات، والتطبيق المستقبلي. يتطلب نموذج الأدلة (evidence pro forma).",
      options: [
        "جميع جوانب دورتين من مشروع QI أصلي، بصفة قيادية تشرف على أعضاء الفريق الآخرين",
        "جميع جوانب دورتين من مشروع QI",
        "جانب واحد من مشروع QI متعدد الدورات مكتمل، أو جانبان أو أكثر من مشروع ذي دورة واحدة",
        "لا شيء مما سبق",
      ],
    },
  };
}

// Arabic specialty name + shared description for each PHST specialty. The
// description mirrors the generated English one in sas-data.ts, with the Arabic
// name interpolated.
const PHST_AR_SPECIALTIES: { id: string; prefix: string; name: string }[] = [
  { id: "acute_internal_medicine", prefix: "aim", name: "الطب الباطني الحاد (Acute Internal Medicine)" },
  { id: "allergy", prefix: "allergy", name: "الحساسية (Allergy)" },
  { id: "audiovestibular", prefix: "audio", name: "طب السمع والاتزان (Audiovestibular Medicine)" },
  { id: "cardiology", prefix: "cardio", name: "أمراض القلب (Cardiology)" },
  { id: "clinical_genetics", prefix: "genetics", name: "الوراثة السريرية (Clinical Genetics)" },
  { id: "clinical_neurophysiology", prefix: "neurophys", name: "الفيزيولوجيا العصبية السريرية (Clinical Neurophysiology)" },
  { id: "clinical_oncology", prefix: "clinonc", name: "الأورام السريرية (Clinical Oncology)" },
  { id: "clinical_pharmacology", prefix: "clinpharm", name: "علم الأدوية السريري والعلاجات (Clinical Pharmacology & Therapeutics)" },
  { id: "combined_infection", prefix: "infection", name: "التدريب المشترك للأمراض المعدية (Combined Infection Training)" },
  { id: "dermatology", prefix: "derm", name: "الأمراض الجلدية (Dermatology)" },
  { id: "endocrinology", prefix: "endo", name: "الغدد الصماء والسكري (Endocrinology & Diabetes Mellitus)" },
  { id: "gastroenterology", prefix: "gastro", name: "أمراض الجهاز الهضمي (Gastroenterology)" },
  { id: "gim", prefix: "gim", name: "الطب الباطني العام (General Internal Medicine)" },
  { id: "genitourinary", prefix: "gum", name: "طب المسالك البولية التناسلية (Genitourinary Medicine)" },
  { id: "geriatric_medicine", prefix: "geriatrics", name: "طب المسنّين (Geriatric Medicine)" },
  { id: "haematology", prefix: "haem", name: "أمراض الدم (Haematology)" },
  { id: "immunology", prefix: "immuno", name: "المناعة (Immunology)" },
  { id: "intensive_care", prefix: "icm", name: "طب العناية المركّزة (Intensive Care Medicine)" },
  { id: "medical_microbiology", prefix: "micro", name: "الأحياء الدقيقة الطبية (Medical Microbiology)" },
  { id: "medical_oncology", prefix: "medonc", name: "الأورام الطبية (Medical Oncology)" },
  { id: "medical_ophthalmology", prefix: "medophth", name: "طب العيون الباطني (Medical Ophthalmology)" },
  { id: "medical_virology", prefix: "virology", name: "علم الفيروسات الطبي (Medical Virology)" },
  { id: "neurology", prefix: "neuro", name: "طب الأعصاب (Neurology)" },
  { id: "nuclear_medicine", prefix: "nuclear", name: "الطب النووي (Nuclear Medicine)" },
  { id: "paediatric_cardiology", prefix: "paedcardio", name: "أمراض قلب الأطفال (Paediatric Cardiology)" },
  { id: "palliative_medicine", prefix: "palliative", name: "الطب التلطيفي (Palliative Medicine)" },
  { id: "pharmaceutical_medicine", prefix: "pharmmed", name: "الطب الصيدلاني (Pharmaceutical Medicine)" },
  { id: "rehabilitation_medicine", prefix: "rehab", name: "طب التأهيل (Rehabilitation Medicine)" },
  { id: "renal_medicine", prefix: "renal", name: "طب الكلى (Renal Medicine)" },
  { id: "respiratory", prefix: "resp", name: "طب الجهاز التنفسي (Respiratory Medicine)" },
  { id: "rheumatology", prefix: "rheum", name: "الروماتيزم (Rheumatology)" },
  { id: "sport_exercise_medicine", prefix: "sem", name: "طب الرياضة والتمارين (Sport & Exercise Medicine)" },
  { id: "stroke_medicine", prefix: "stroke", name: "طب السكتة الدماغية / GIM (Stroke Medicine)" },
  { id: "tropical_medicine", prefix: "tropical", name: "طب المناطق الحارة (Tropical Medicine)" },
];

function phstArDescription(arName: string): string {
  return `${arName} عند مستوى ST3، يُوظَّف عبر Physician Higher Specialty Training (PHST). تُقيَّم الطلبات بالتقييم الذاتي على Oriel — 38 نقطة عبر سبعة مجالات، مشتركة بين كل تخصصات PHST — ثم تُتحقَّق مقابل الأدلة التي ترفعها، وهو ما قد يرفع الدرجة أو يخفضها.`;
}

// Build every PHST specialty's entries (specialty name + description, plus the
// shared seven domains and their criteria).
const PHST_AR: Record<string, SASArEntry> = PHST_AR_SPECIALTIES.reduce(
  (acc, s) => {
    acc[s.id] = { name: s.name, description: phstArDescription(s.name) };
    Object.assign(acc, phstArDomains(s.prefix));
    return acc;
  },
  {} as Record<string, SASArEntry>
);

export const SAS_AR: Record<string, SASArEntry> = {
  // ─── Internal Medicine Training (IMT) — fully translated ──────────────────
  imt: {
    name: "التدريب في الطب الباطني (IMT)",
    description:
      "برنامج تدريب طبي أساسي مدته 3 سنوات (IMT1-3)، حلّ محل Core Medical Training في 2019. تُقدَّم الطلبات عبر Oriel وتُدرَج في القائمة المختصرة بناءً على درجة تقييم ذاتي من 30، إضافة إلى 5 نقاط للتقديم على IMT/ACCS-IM فقط في Round 1.",
  },
  imt_unique: { name: "متقدّم حصري لـ IMT" },
  imt_u1: {
    criterion: "الطلبات المقدَّمة في Round 1 من التوظيف الوطني",
    evidence:
      "لا يلزم دليل — تُمنح تلقائياً من طلباتك الفعّالة عند تاريخ الإغلاق",
    options: [
      "تقدّمتُ فقط للشاغر المشترك IMT/ACCS-IM في Round 1",
      "لديّ طلبات فعّالة على تخصص إضافي واحد أو أكثر",
    ],
  },
  imt_qualifications: { name: "الدرجات والمؤهلات العليا (postgraduate)" },
  imt_q1: {
    criterion: "أعلى درجة أو مؤهل عليا (postgraduate)",
    evidence:
      "شهادة المؤهل، أو خطاب من الجهة المانحة يؤكده. لا يمكن المطالبة بالدرجات المتخللة (intercalated). لا يمكن المطالبة بـ MRCP(UK) ولا امتحانات العضوية الأخرى. مؤهلات التدريس تُدرَج في مجال Training in Teaching.",
    options: [
      "PhD أو MD بحثية (يمكن أن تشمل مؤهلات غير طبية ذات صلة)",
      "درجة ماجستير مثل MSc أو MA أو MRes (يمكن أن تشمل غير الطبية). عادةً 8 أشهر أو أطول بدوام كامل مكافئ",
      "دبلوم أو شهادة عليا (postgraduate) أخرى ذات صلة، تستمر عادةً بين شهر وعشرة أشهر بدوام كامل مكافئ",
      "لا شيء مما سبق",
    ],
  },
  imt_presentations: { name: "العروض التقديمية / الملصقات (Posters)" },
  imt_p1: {
    criterion:
      "أفضل عرض تقديمي أو ملصق (poster) في اجتماع طبي (المؤلف الأول أو الثاني فقط)",
    evidence:
      "تأكيد أن العرض/الملصق قُبِل وأُدرِج في الاجتماع (خطاب أو شهادة أو كتاب الملخصات)، إضافة إلى الملخّص ونسخة من الشرائح أو الملصق.",
    options: [
      "عرض شفهي، مؤلف أول أو ثانٍ، في اجتماع طبي وطني أو دولي",
      "ملصق (poster)، مؤلف أول أو ثانٍ، عُرِض في اجتماع طبي وطني أو دولي",
      "عرض شفهي، مؤلف أول أو ثانٍ، في اجتماع طبي إقليمي",
      "عرض شفهي، مؤلف أول أو ثانٍ، في اجتماع طبي محلي",
      "ملصق (poster)، مؤلف أول أو ثانٍ، عُرِض في اجتماع طبي إقليمي أو محلي",
      "لا شيء مما سبق",
    ],
  },
  imt_publications: { name: "المنشورات" },
  imt_pub1: {
    criterion: "أفضل منشور",
    evidence:
      "لقطة شاشة لاستشهاد PubMed ورابط PubMed. للأعمال «قيد الطبع» (in press)، تأكيد القبول من الناشر. للكتب: صفحة الغلاف والمحتويات وقائمة المؤلفين وISBN.",
    options: [
      "مؤلف أول، أو مؤلف أول مشارك، أو مؤلف مراسِل لمنشور بحثي أصلي واحد أو أكثر مُستشهَد به في PubMed (أو قيد الطبع)",
      "مؤلف مشارك لمنشور بحثي أصلي واحد أو أكثر مُستشهَد به في PubMed (أو قيد الطبع)",
      "مؤلف أو مؤلف مشارك لأكثر من منشور آخر مُستشهَد به في PubMed (أو قيد الطبع) — افتتاحيات، مراجعات، ملخصات، تقارير حالة، رسائل",
      "كتبتَ فصلاً واحداً أو أكثر من كتاب متعلق بالطب (غير منشور ذاتياً)",
      "مؤلف أو مؤلف مشارك لمنشور آخر واحد مُستشهَد به في PubMed (أو قيد الطبع) — افتتاحية، مراجعة، ملخص، تقرير حالة، رسالة",
      "نشرتَ ملخصاً واحداً أو أكثر، أو مقالات غير محكّمة، أو مقالات غير مُستشهَد بها في PubMed",
      "لا شيء مما سبق",
    ],
  },
  imt_teaching: { name: "خبرة التدريس" },
  imt_t1: {
    criterion: "خبرة التدريس التي قدّمتها",
    evidence:
      "يُطلب دليل على تقييم رسمي (formal feedback) لكل خيار تسجيل. للخيارين الأعلى تحتاج أيضاً خطاباً من مُوجِّهك/مؤسستك يؤكد دورك، إضافة إلى جدول البرنامج أو مخططه.",
    options: [
      "عملتَ مع مُوجِّهين محليين لتنظيم برنامج تدريسي لممارسي الرعاية الصحية أو طلاب الطب، ودرّست فيه بانتظام لمدة ثلاثة أشهر تقريباً أو أطول، مع دليل على تقييم رسمي",
      "قدّمتَ تدريساً منتظماً ضمن برنامج أو دورة محددة لمدة ثلاثة أشهر تقريباً أو أطول، مع دليل على تقييم رسمي",
      "درّستَ طلاب الطب أو ممارسي رعاية صحية آخرين أحياناً (ثلاث جلسات على الأقل)، مع دليل على تقييم رسمي",
      "لا شيء مما سبق",
    ],
  },
  imt_teaching_training: { name: "التدريب على التدريس" },
  imt_tt1: {
    criterion: "التدريب الذي تلقيته في طرق التدريس",
    evidence:
      "شهادة إتمام من مقدّم الدورة (أو خطاب يؤكد الحضور)، إضافة إلى مخطط الدورة يؤكد مدتها وطريقة تقديمها.",
    options: [
      "مؤهل أعلى في التدريس، مثل PG Cert أو PG Diploma (معتمد جامعياً، لخريجين فقط، يعادل 60 نقطة معتمدة على الأقل)",
      "تدريب على طرق التدريس دون مستوى PG Cert أو PG Diploma (ست ساعات على الأقل من وقت التدريس المباشر، بخلاف مؤهلك الطبي الأساسي)",
      "لا تدريب على طرق التدريس",
    ],
  },
  imt_qi: { name: "تحسين الجودة (Quality Improvement)" },
  imt_qi1: {
    criterion: "المشاركة في مشاريع تحسين الجودة",
    evidence:
      "يُفضَّل نموذج QIPAT. وإلا فوثيقة رسمية من مشرفك تغطي الموضوع والأهداف، والمقاييس المحددة، ومنهجية QI المستخدمة، وتنفيذ التغيير، والتقييم، والتطبيق المستقبلي.",
    options: [
      "المشاركة في جميع مراحل دورتين من مشروع تحسين الجودة",
      "المشاركة في بعض مراحل دورتين، أو جميع مراحل دورة واحدة، من مشروع تحسين الجودة",
      "المشاركة في بعض مراحل دورة واحدة من مشروع تحسين الجودة",
      "لا شيء مما سبق",
    ],
  },

  // ─── Clinical Radiology — fully translated ────────────────────────────────
  radiology: {
    name: "الأشعة السريرية (Clinical Radiology)",
    description:
      "تدريب تخصصي في الأشعة مدته 5 سنوات من ST1. تصنّف نفسك ذاتياً من A إلى E عبر خمسة مجالات في الملف على Oriel وتقدّم قطعة دليل واحدة لكلٍّ منها. يجمع الترتيب النهائي درجة MSRA، ودرجة الأدلة المُتحقَّق منها، ودرجة مقابلتك.",
  },
  rad_commitment: { name: "الالتزام بالتخصص" },
  rad_c1: {
    criterion: "أقوى دليل لديك على الالتزام بالأشعة (هذا المجال مضاعف الوزن)",
    evidence:
      "قطعة دليل واحدة: خطاب يؤكد حضور فترة تعريفية (taster) أو تدريب، أو شهادة دورة، أو تسجيل في مؤتمر.",
    options: [
      "A — تعرّضات مهمة متعددة لعمل قسم أشعة سريرية",
      "B — تعرّض مهم واحد لعمل قسم أشعة",
      "C — حضور دورة قائمة على الأشعة مدتها يوم واحد على الأقل",
      "D — حضور مؤتمر متعلق بالأشعة",
      "E — لا شيء مما سبق",
    ],
  },
  rad_leadership: { name: "القيادة والإدارة" },
  rad_l1: {
    criterion: "أعلى دور قيادي أو إداري لديك",
    evidence:
      "قطعة دليل واحدة تؤكد الدور ونطاقه، مثل خطاب من المؤسسة أو اللجنة.",
    options: [
      "A — دور قيادي أو إداري على المستوى الوطني يتضمّن الأشعة",
      "B — دور صحي وطني خارج الأشعة، أو دور أشعة محلي أو إقليمي",
      "C — دور وطني خارج الرعاية الصحية، أو دور صحي محلي خارج الأشعة",
      "D — دور قيادي أو إداري محلي أو إقليمي خارج الرعاية الصحية",
      "E — لا شيء مما سبق",
    ],
  },
  rad_teaching: { name: "التدريس والتدريب" },
  rad_t1: {
    criterion: "أقوى مؤهل أو إسهام لديك في التدريس",
    evidence:
      "قطعة دليل واحدة: شهادة مؤهل، أو تأكيد دورك في برنامج تدريسي، أو شهادة دورة.",
    options: [
      "A — مؤهل تدريس رسمي مُنِح على مستوى الدراسات العليا (postgraduate)",
      "B — إسهام كبير في برنامج تدريسي وطني أو دولي",
      "C — تدريب آخر على طرق التدريس بعد دراسة يومين على الأقل",
      "D — دليل على تقديم تدريس إقليمي",
      "E — لا شيء مما سبق",
    ],
  },
  rad_audit: { name: "التدقيق وتحسين الجودة" },
  rad_a1: {
    criterion: "أقوى مشاركة لديك في التدقيق أو تحسين الجودة",
    evidence:
      "دليل على المشروع ودورك فيه. الفئة A هي المجال الوحيد الذي يقبل قطعتي دليل، لأنها تتطلب مشروعين.",
    options: [
      "A — قدتَ عمليتي تدقيق أو مشروعي تحسين جودة أو أكثر متعلقة بالأشعة",
      "B — قدتَ عملية تدقيق أو مشروع تحسين جودة متعلقاً بالأشعة",
      "C — قدتَ عملية تدقيق أو مشروع تحسين جودة خارج الأشعة",
      "D — أسهمتَ في عملية تدقيق أو مشروع تحسين جودة دون قيادته",
      "E — لا شيء مما سبق",
    ],
  },
  rad_academic: { name: "الإنجازات الأكاديمية" },
  rad_ac1: {
    criterion: "أقوى إنجاز أكاديمي لديك",
    evidence:
      "قطعة دليل واحدة: شهادة الدرجة، أو استشهاد المنشور، أو تأكيد العرض التقديمي.",
    options: [
      "A — درجة بحثية عليا (postgraduate)، أو منشور في الأشعة كمؤلف أول",
      "B — منشور في الأشعة كمؤلف مشارك، أو منشور في غير الأشعة كمؤلف أول، أو تقرير حالة في الأشعة",
      "C — منشور كمؤلف مشارك، أو تقرير حالة في غير الأشعة، أو عرض إقليمي",
      "D — عرض في غير الأشعة، أو مشاركة في بحث",
      "E — لا شيء مما سبق",
    ],
  },

  // ─── Trauma & Orthopaedic Surgery (T&O) — fully translated ────────────────
  orthopaedics: {
    name: "جراحة الرضوح والعظام (Trauma & Orthopaedic Surgery)",
    description:
      "جراحة الرضوح والعظام عند مستوى ST3، تُوظَّف وطنياً عبر Yorkshire and Humber. اثنا عشر سؤالاً تقييماً ذاتياً تغطي الخبرة، وسجل العمليات (logbook)، والمنشورات، والعروض، والتدقيق، والدرجات العليا، والقيادة، والتدريس. يُطبَّق ترجيح منشور على الأعداد التي تسجّلها قبل أن تصل إلى درجتك النهائية.",
  },
  to_experience: { name: "الخبرة بعد Foundation" },
  to_q1: {
    criterion:
      "عدد الأشهر في أي وظيفة طبية بعد Foundation، بحلول نهاية يوليو أو إتمام التدريب الأساسي إن كان لاحقاً",
    evidence:
      "دليل إتمام وظائف تدريبية. للوظائف غير التدريبية، الصفحة الأولى من عقد عملك تُظهر تاريخي البدء والانتهاء؛ وإن لم تُظهرهما معاً، خطاب من الموارد البشرية أو رئيس الخدمة أو الاستشاري المشرف عليك.",
    options: [
      "77 شهراً أو أكثر",
      "64 إلى 76 شهراً",
      "52 إلى 63 شهراً",
      "40 إلى 51 شهراً",
      "0 إلى 39 شهراً",
    ],
  },
  to_specialty_time: { name: "المدة في جراحة الرضوح والعظام" },
  to_q2: {
    criterion:
      "عدد الأشهر في تدريب رئيسي في T&O بعد Foundation، في أي بلد",
    evidence:
      "كما في الخبرة بعد Foundation. لاحظ أن التسجيل ليس خطياً — من 10 إلى 42 شهراً يحصل على أعلى درجة، والفترات الأطول تحصل على درجة أقل تدريجياً.",
    options: [
      "10 إلى 42 شهراً",
      "43 إلى 59 شهراً",
      "4 إلى 9 أشهر",
      "60 شهراً أو أكثر",
      "0 إلى 3 أشهر",
    ],
  },
  to_complementary: { name: "التخصصات المكمّلة" },
  to_q3: {
    criterion:
      "4 أشهر على الأقل في جراحة التجميل، أو جراحة الأعصاب، أو الأوعية الدموية، أو ENT (الأنف والأذن والحنجرة)، أو جراحة القلب والصدر، أو طب الطوارئ، أو ITU، أو المسالك البولية، أو OMFS (جراحة الوجه والفكين)، أو جراحة الأطفال، أو الجراحة العامة منذ Foundation",
    evidence:
      "دليل إتمام وظائف تدريبية، أو الصفحات الأولى من العقود للوظائف غير التدريبية.",
    options: [
      "4 أشهر على الأقل في وظائف في تخصصين أو أكثر من هذه التخصصات",
      "4 أشهر على الأقل في وظيفة في أحد هذه التخصصات",
      "لن أكون قد قضيتُ 4 أشهر في أيٍّ من هذه التخصصات",
    ],
  },
  to_operative: { name: "الخبرة الجراحية" },
  to_q4: {
    criterion:
      "عمليات مكتملة بالكامل لكسر عنق عظم الفخذ أُجريت بصفة STS أو STU",
    evidence:
      "صفحات تجميع سجل العمليات (logbook) المصدّقة من استشاري. يجب تسجيلها في سجل عمليات مصدّق من استشاري لتُحتسب.",
    options: ["18 أو أكثر", "7 إلى 17", "0 إلى 6"],
  },
  to_first_author: { name: "منشورات كمؤلف أول" },
  to_q5: {
    criterion:
      "منشورات كمؤلف أول مُفهرَسة في PubMed، باستثناء الملخصات وتقارير الحالة والرسائل والنصائح التقنية (نقطتان لكل ورقة، قبل الترجيح)",
    evidence:
      "رقم PMID لكل ورقة. لا تُحتسب أسماء المجموعات التعاونية كتأليف أول.",
    options: [
      "3 أوراق أو أكثر كمؤلف أول",
      "ورقتان كمؤلف أول",
      "ورقة واحدة كمؤلف أول",
      "لا شيء",
    ],
  },
  to_other_pubs: { name: "منشورات أخرى" },
  to_q6: {
    criterion:
      "منشورات أخرى مُفهرَسة في PubMed، باستثناء الملخصات وتقارير الحالة والرسائل والنصائح التقنية (نقطة واحدة لكل ورقة، قبل الترجيح)",
    evidence:
      "رقم PMID لكل ورقة. لا يُحتسب العمل التعاوني إلا بدليل واضح على دور مهم — تصميم الدراسة أو تحليل البيانات أو الكتابة.",
    options: [
      "3 أوراق أخرى أو أكثر",
      "ورقتان أخريان",
      "ورقة أخرى واحدة",
      "لا شيء",
    ],
  },
  to_presentations: { name: "العروض الوطنية والدولية" },
  to_q7: {
    criterion:
      "عروض وطنية ودولية لعمل أنت مؤلف مُدرَج عليه، باستثناء الملصقات (posters) (نقطة واحدة لكل مشروع، قبل الترجيح)",
    evidence:
      "الصفحة ذات الصلة من برنامج كل اجتماع. يُحتسب كل مشروع مرة واحدة مهما بلغ عدد الاجتماعات التي عُرِض فيها. يحتاج العمل التعاوني إلى دليل واضح على دور مهم.",
    options: [
      "3 مشاريع مَعروضة أو أكثر",
      "مشروعان مَعروضان",
      "مشروع واحد مَعروض",
      "لا شيء",
    ],
  },
  to_audit: { name: "التدقيق وتحسين الجودة" },
  to_q8: {
    criterion:
      "عمليات تدقيق مقابل معيار منشور، أو مشاريع QI، أدّت إلى عرض النتائج",
    evidence:
      "دليل موثّق على الإتمام والعرض — شهادة مصدّقة أو خطاب من الطبيب المسؤول عن التدقيق. لا تقدّم شرائح أو جداول أعمال اجتماعات. تُحتسب دورتا الحلقة المغلقة كلٌّ على حدة. الدرجة الموزونة لهذا السؤال محدودة بحدٍّ أقصى 2.",
    options: [
      "عمليتا تدقيق أو مشروعا QI مَعروضان أو أكثر",
      "عملية تدقيق أو مشروع QI واحد مَعروض",
      "لا شيء",
    ],
  },
  to_degree: { name: "درجة عليا" },
  to_q9: {
    criterion:
      "درجة عليا بريطانية مستقلة أو ما يعادلها تُمتحَن بأطروحة أو رسالة (الدرجات المتخللة intercalated لا تُحتسب)",
    evidence:
      "شهادة درجتك. للدرجات المأخوذة خارج المملكة المتحدة، دليل على المعادلة — خطاب من المؤسسة يؤكد أنها اتبعت أطروحة بحثية وامتحاناً كاملاً، إضافة إلى كشف درجاتك وترجمة إن لزم.",
    options: [
      "PhD أو MD",
      "ماجستير (مثل MSc أو MMedEd أو MS أو MCh(Orth) أو ChM)",
      "لا شيء",
    ],
  },
  to_leadership: { name: "القيادة والإدارة" },
  to_q10: {
    criterion:
      "أعلى دور قيادي أو إداري لديك منذ بدء كلية الطب، داخل الطب أو خارجه",
    evidence: "دليل يدعم إجابتك، مثل خطاب موقّع من جهة معترف بها.",
    options: [
      "دور قيادي أو إداري رسمي وطني أو دولي",
      "دور قيادي أو إداري محلي أو إقليمي",
      "لا دليل على المشاركة في القيادة أو الإدارة",
    ],
  },
  to_teaching: { name: "خبرة التدريس" },
  to_q11: {
    criterion: "خبرتك في التدريس",
    evidence:
      "نماذج ملاحظة التدريس (Observation of Teaching) أو تقييمات الحضور. يجب أن يكون الدور التدريسي خلال السنوات الخمس الأخيرة واستمر ستة أشهر على الأقل. حضور دورات مثل ATLS Instructor أو Training the Trainer لا يُحتسب.",
    options: [
      "مؤهل تدريس رسمي (PG Masters أو Diploma أو Certificate أو ما يعادل 60 نقطة جامعية معتمدة)، أو دور تدريسي رسمي جوهري",
      "تدريس رسمي منتظم خلال العامين الأخيرين (4 جلسات أو أكثر سنوياً) مع دليل في الملف",
      "قليل أو لا شيء",
    ],
  },
  to_evidence_org: { name: "تنظيم الأدلة" },
  to_q12: {
    criterion: "هل ستقدّم أدلتك بطريقة منظّمة كما هو موجَّه؟",
    evidence:
      "يجب أن تكون الصفحة الأولى من الأدلة لكل مجال صفحة ملخّص تُظهر بوضوح مكان كل قطعة دليل ذات صلة.",
    options: ["نعم", "لا"],
  },

  // ─── Name + description for the remaining specialties ──────────────────────
  // These render the NotPortfolioScored / selector-card path, where the domain
  // matrix is not displayed to the user; the card name and description are.
  cst: {
    name: "التدريب الجراحي الأساسي (CST)",
    description:
      "تدريب جراحي أساسي مدته سنتان. تصنّف نفسك من A إلى E عبر خمسة مجالات في الملف وترفع الأدلة، التي تُقيَّم بعد ذلك في المقابلة — يُستكشَف مجالان منها عبر أسئلة منظّمة. القيم النقطية خلف الفئات غير منشورة.",
  },
  gp: {
    name: "التدريب التخصصي في طب الأسرة (GP)",
    description:
      "برنامج تدريب في طب الأسرة (GP) مدته 3 سنوات. يعتمد الاختيار على MSRA؛ ولا يُقيَّم أي ملف في أي مرحلة، فلا شيء هنا للتقييم الذاتي. تأكّد من عملية الجولة الحالية على الموقع الرسمي — غيّرت الدورات الأخيرة كيف وما إذا كان المتقدمون يُقيَّمون بما يتجاوز الامتحان.",
  },
  psychiatry: {
    name: "التدريب الأساسي في الطب النفسي (CT1)",
    description:
      "تدريب أساسي في الطب النفسي مدته 3 سنوات. يعتمد الاختيار على درجة MSRA وحدها — لا توجد مقابلة ولا تقييم للملف.",
  },
  paediatrics: {
    name: "طب الأطفال وصحة الطفل (Paediatrics and Child Health)",
    description:
      "تدريب طب الأطفال من ST1، يُوظَّف عبر RCPCH في National Round 1. لا يوجد MSRA. تُسجَّل القائمة المختصرة من قِبل المقيّمين من الإجابات المكتوبة على نموذج Oriel — بحدٍّ أقصى 50 كلمة لكل قسم — تتبعها مقابلة إلكترونية من محطتين.",
  },
  og: {
    name: "أمراض النساء والتوليد (O&G)",
    description:
      "تدريب تخصصي في أمراض النساء والتوليد (O&G) من ST1. الترتيب من 150: MSRA مُحجَّمة إلى 0-50 إضافة إلى مقابلة إلكترونية من 100 علامة. يُقيَّم ملفك — تحسين الجودة، والبحث والتدريس، والقيادة مجالات مُسجَّلة في المقابلة المنظّمة — لكن من قِبل اللجنة يوم المقابلة لا على نموذج الطلب.",
  },
  anaesthetics: {
    name: "التخدير / ACCS (Anaesthesia)",
    description:
      "تخدير CT1 أو ACCS Anaesthetics، يُوظَّف وطنياً عبر ANRO من خلال Oriel. تعتمد القائمة المختصرة على MSRA؛ والترتيب على مقابلة كفاءة من محطتين تُسجَّل من 100. لا يوجد ملف بتقييم ذاتي عند CT1 — ذلك ينطبق عند الالتحاق بـ ST4.",
  },
  em: {
    name: "طب الطوارئ (Emergency Medicine)",
    description:
      "ACCS طب الطوارئ من CT1/ST1. يؤدّي جميع المتقدمين المؤهلين MSRA، الذي يُرجَّح بنسبة 40% من الدرجة الكلية مقابل 60% للمقابلة الإلكترونية. حين تتجاوز الطلبات سعة المقابلات، تحدّد درجة MSRA من يُدعى. لا يوجد تقييم ذاتي.",
  },
  ophthalmology: {
    name: "طب العيون (Ophthalmology)",
    description:
      "تدريب متواصل (run-through) في طب العيون مدته 7 سنوات من ST1، مع استخدام MSRA للقائمة المختصرة. يدير التوظيف Ophthalmology National Recruitment Office بدلاً من الإعلان المركزي.",
  },
  neurosurgery: {
    name: "جراحة الأعصاب ST1 (Neurosurgery)",
    description:
      "تدريب متواصل (run-through) في جراحة الأعصاب مدته 8 سنوات من ST1 وST2، يُوظَّف وطنياً عبر Yorkshire and Humber لإنجلترا واسكتلندا وويلز وأيرلندا الشمالية. يؤدّي جميع المتقدمين MSRA، الذي يحمل 40% من درجة القائمة المختصرة؛ ويأتي الباقي من مصفوفة قائمة مختصرة منشورة.",
  },

  // ─── Every PHST specialty (name + description + shared seven domains) ──────
  ...PHST_AR,
};

/** Arabic entry for a specialty / domain / criterion id, if one exists. */
export function sasAr(id: string): SASArEntry | undefined {
  return SAS_AR[id];
}
