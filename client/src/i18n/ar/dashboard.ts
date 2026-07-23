export const dashboard = {
  gate: {
    title: "سجّل الدخول للوصول إلى لوحتك",
    body: "لوحتك المهنية الشخصية في انتظارك.",
    signIn: "تسجيل الدخول",
  },

  loading: "جارٍ تحميل لوحتك…",

  nav: {
    dashboard: "لوحتي",
    roadmap: "خطتي",
    sasTool: "أداة SAS",
    workspaces: "مساحات العمل الذكية",
    resources: "الأدلة والمصادر",
    links: "الروابط الرسمية",
  },

  tiers: {
    free: "المبتدئ",
    pro: "الاحترافي",
    premium: "المتميّز",
  },

  welcome: "أهلاً بعودتك يا {name} 👋",
  defaultName: "دكتور",
  journeyDefault: "رحلتك المهنية في بريطانيا مستمرة.",

  onboarding: {
    title: "أكمل تقييمك",
    body: "أجب عن بضعة أسئلة لتوليد خطتك المهنية الشخصية.",
    cta: "ابدأ التقييم",
  },

  roadmapCard: {
    title: "تقدّم الخطة المهنية",
    viewAll: "عرض الكل",
    milestones: "{done} من {total} مراحل مكتملة",
    emptyBody: "لا توجد خطة بعد. أكمل تقييمك لتوليد واحدة.",
    generate: "توليد الخطة",
  },

  workspacesCard: {
    title: "مساحات العمل الذكية",
    all: "كل المساحات",
    items: {
      research: "البحث العلمي",
      qip: "مشاريع تحسين الجودة",
      audit: "التدقيق السريري",
      interview: "المقابلات",
      cv: "السيرة الذاتية والملف",
      oet: "الاستعداد لـ OET",
    },
  },

  tasksCard: {
    title: "مهامي",
    pending: "{count} قيد الإنجاز",
    allDone: "كل المهام مكتملة!",
    priority: {
      high: "عالية",
      medium: "متوسطة",
      low: "منخفضة",
    },
  },

  profile: {
    specialty: "التخصص",
    level: "المستوى",
    country: "البلد",
    readiness: "درجة الجاهزية",
  },

  subscription: {
    planSuffix: "الباقة",
    freeBody: "ارتقِ للحصول على وصول كامل لمساحات العمل الذكية، ومراجعة السيرة الذاتية، وتدريب المقابلات.",
    freeCta: "ترقية الباقة",
    proBody: "ارتقِ إلى المتميّز للحصول على إرشاد فردي وتفاعلات ذكية غير محدودة.",
    proCta: "اشترك في المتميّز",
    premiumBody: "لديك وصول كامل لكل الميزات بما فيها الإرشاد الفردي.",
  },

  quickLinks: {
    title: "روابط سريعة",
    roadmap: "خطتي",
    sas: "أداة تقييم SAS",
    workspaces: "مساحات العمل الذكية",
    resources: "مكتبة المصادر",
    links: "الروابط البريطانية الرسمية",
  },

  signOut: "تسجيل الخروج",
} as const;
