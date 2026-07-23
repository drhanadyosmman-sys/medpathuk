export const questionnaire = {
  // "Step X of Y" badge in the header.
  stepBadge: "الخطوة {current} من {total}",

  // Step titles/descriptions, indexed to match the STEPS array order.
  steps: [
    { title: "خلفيتك", desc: "أخبرنا عن وضعك الحالي" },
    { title: "الإنجليزية والمسار", desc: "مستوى اللغة والمسار المستهدف" },
    { title: "حالة الملف", desc: "إنجازاتك الأكاديمية الحالية" },
    {
      title: "الامتحانات والمؤهلات",
      desc: "الامتحانات المكتملة والجارية",
    },
    { title: "الأهداف والجدول الزمني", desc: "ما تريد تحقيقه ومتى" },
  ],

  fields: {
    currentSpecialty: "التخصص الحالي",
    currentCareerLevel: "المستوى المهني الحالي",
    countryOfOrigin: "بلد المنشأ",
    countryPlaceholder: "مثال: مصر، باكستان، نيجيريا...",

    englishStatus: "مستوى اللغة الإنجليزية",
    oetStatus: "حالة OET",
    targetPathway: "المسار البريطاني المستهدف",
    targetSpecialty: "التخصص المستهدف (إن كان مختلفاً)",

    academicPortfolio: "الملف الأكاديمي",
    researchPapers: "الأبحاث المنشورة / المقدَّمة",
    clinicalAudits: "عمليات التدقيق السريري المكتملة",
    qips: "مشاريع تحسين الجودة (QIPs)",
    presentations: "العروض والملصقات في المؤتمرات",
    experience: "الخبرة",
    teaching: "خبرة في التدريس (رسمية أو غير رسمية)",
    leadership: "خبرة في القيادة أو الإدارة",

    examsPreparing: "الامتحانات التي تستعدّ لها حالياً",
    examsPassed: "الامتحانات التي اجتزتها",

    primaryGoal: "الهدف الأساسي",
    availableHours: "الساعات المتاحة أسبوعياً:",
    hoursValue: "{hours} ساعة",
    hoursMin: "2 ساعة",
    hoursMax: "40 ساعة",
    timeline: "الجدول الزمني:",
    monthsValue: "{months} شهراً",
    monthsMin: "3 أشهر",
    monthsMax: "36 شهراً",
    additionalInfo: "هل هناك أي شيء آخر تودّ إخبارنا به؟",
    additionalPlaceholder:
      "أي تحديات محددة، أو خبرة سابقة في بريطانيا، أو أهداف لم تُذكر أعلاه...",
  },

  buttons: {
    back: "رجوع",
    continue: "متابعة",
    generate: "أنشئ خطتي",
    generating: "جارٍ إنشاء الخطة...",
  },

  toasts: {
    saved: "تم حفظ التقييم! جارٍ إنشاء خطتك الشخصية...",
    ready: "خطتك الشخصية جاهزة! 🎉",
    error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
  },

  // Option labels. Keys are the EXACT English values stored in formData and
  // submitted to the API — never translate a key, only its displayed label.
  specialties: {
    "Internal Medicine": "الطب الباطني",
    Surgery: "الجراحة",
    Paediatrics: "طب الأطفال",
    "Obstetrics & Gynaecology": "أمراض النساء والولادة",
    Psychiatry: "الطب النفسي",
    "Emergency Medicine": "طب الطوارئ",
    Anaesthetics: "التخدير",
    Radiology: "الأشعة",
    Pathology: "علم الأمراض",
    "General Practice": "الممارسة العامة",
    Ophthalmology: "طب العيون",
    ENT: "الأنف والأذن والحنجرة",
    Orthopaedics: "جراحة العظام",
    Neurology: "طب الأعصاب",
    Cardiology: "أمراض القلب",
    Gastroenterology: "أمراض الجهاز الهضمي",
    Other: "أخرى",
  },

  careerLevels: {
    "Medical Student": "طالب طب",
    "Foundation Year 1 (FY1)": "سنة التأسيس الأولى (FY1)",
    "Foundation Year 2 (FY2)": "سنة التأسيس الثانية (FY2)",
    "Core Medical Training (CMT)": "التدريب الطبي الأساسي (CMT)",
    "Core Surgical Training (CST)": "التدريب الجراحي الأساسي (CST)",
    "Specialty Registrar (ST3+)": "طبيب تخصص مسجّل (ST3+)",
    Consultant: "استشاري",
    Other: "أخرى",
  },

  pathways: {
    "Foundation Programme": "برنامج التأسيس",
    "Core Training": "التدريب الأساسي",
    "Specialty Training (Run-through)": "التدريب التخصصي (المتواصل)",
    "Specialty Training (Uncoupled)": "التدريب التخصصي (المنفصل)",
    "GP Training": "تدريب الممارسة العامة (GP)",
    "Academic Clinical Fellowship": "الزمالة السريرية الأكاديمية",
    Other: "أخرى",
  },

  englishStatuses: {
    "Native English Speaker": "متحدث أصلي للإنجليزية",
    "OET Passed": "اجتزت OET",
    "IELTS Passed": "اجتزت IELTS",
    "Currently Preparing": "أستعدّ حالياً",
    "Not Started Yet": "لم أبدأ بعد",
  },

  oetStatuses: {
    "Not Applicable": "لا ينطبق",
    "Not Started": "لم أبدأ",
    "Currently Preparing": "أستعدّ حالياً",
    "Booked Exam": "حجزت الاختبار",
    "Passed (All Bands)": "اجتزت (كل المهارات)",
    "Passed (Some Bands)": "اجتزت (بعض المهارات)",
  },

  exams: {
    "PLAB 1": "PLAB 1",
    "PLAB 2": "PLAB 2",
    "MRCP Part 1": "MRCP الجزء 1",
    "MRCP Part 2 Written": "MRCP الجزء 2 (تحريري)",
    "MRCP PACES": "MRCP PACES",
    "MRCS Part A": "MRCS الجزء A",
    "MRCS Part B (OSCE)": "MRCS الجزء B (OSCE)",
    "MRCGP AKT": "MRCGP AKT",
    "MRCGP CSA/RCA": "MRCGP CSA/RCA",
    "FRCA Primary": "FRCA الأولي",
    "FRCR Part 1": "FRCR الجزء 1",
    Other: "أخرى",
  },

  goals: {
    "Secure a Foundation Programme post": "الحصول على وظيفة في برنامج التأسيس",
    "Enter Core Training": "الالتحاق بالتدريب الأساسي",
    "Enter Specialty Training": "الالتحاق بالتدريب التخصصي",
    "Become a GP": "أن أصبح طبيب ممارسة عامة (GP)",
    "Pursue Academic Medicine": "التوجّه نحو الطب الأكاديمي",
    "Build a strong portfolio": "بناء ملف إنجازات قوي",
    "Pass Royal College exams": "اجتياز امتحانات الكليات الملكية",
    "Improve my CV for applications": "تحسين سيرتي الذاتية للتقديم",
  },
} as const;
