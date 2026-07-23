export const roadmap = {
  nav: {
    dashboard: "لوحتي",
    roadmap: "خطتي",
    workspaces: "مساحات العمل الذكية",
    resources: "الأدلة والمصادر",
    links: "الروابط الرسمية",
  },

  tiers: {
    free: "المبتدئ",
    pro: "الاحترافي",
    premium: "المتميّز",
  },

  gate: {
    title: "سجّل الدخول لعرض خطتك",
    signIn: "تسجيل الدخول",
  },

  header: {
    title: "خطتك المهنية",
    subtitle: "مراحل مخصّصة لتحقيق أهدافك المهنية في بريطانيا",
  },

  generate: {
    idle: "توليد الخطة",
    generating: "جارٍ التوليد…",
  },

  empty: {
    title: "لا توجد خطة بعد",
    bodyReady: "اضغط الزر أعلاه لتوليد خطتك الذكية المخصّصة.",
    bodyOnboard: "أكمل تقييم التهيئة أولاً لتوليد خطة مخصّصة.",
    startAssessment: "ابدأ التقييم",
  },

  progress: {
    complete: "مكتمل",
    milestones: "{done} من {total} مراحل مكتملة",
    monthPlan: "خطة من {months} شهراً",
  },

  filter: {
    all: "الكل",
  },

  // Display labels for the fixed milestone category enum. The underlying key
  // (research/audit/…) stays in English in the data; only the label shown to a
  // reader is translated.
  categories: {
    research: "البحث العلمي",
    audit: "التدقيق السريري",
    qip: "تحسين الجودة",
    exam: "الامتحانات",
    interview: "المقابلات",
    cv: "السيرة الذاتية والملف",
    teaching: "التدريس",
    leadership: "القيادة",
    oet: "OET",
    application: "التقديم",
    other: "أخرى",
  },

  priority: {
    high: "عالية",
    medium: "متوسطة",
    low: "منخفضة",
  },

  milestone: {
    due: "الموعد النهائي:",
    step: "الخطوة {n}",
    resourceFallback: "مصدر {n}",
  },

  upsell: {
    title: "افتح خطتك الكاملة",
    body: "ارتقِ إلى الاحترافي أو المتميّز للحصول على ما يصل إلى 20 مرحلة مفصّلة مع المصادر وإرشاد فردي.",
    cta: "ارتقِ الآن",
  },

  toast: {
    milestoneCompleted: "تم إنجاز المرحلة! 🎉",
    generated: "تم توليد الخطة بنجاح!",
    generateFailed: "تعذّر توليد الخطة",
  },
} as const;
