export const common = {
  // The brand name stays in Latin script. It is how the site is found, and how
  // it appears on anything the doctor might reference later.
  brand: "MedPath UK",
  company: "Healthcare Quality School",

  nav: {
    home: "الرئيسية",
    dashboard: "لوحتي",
    assessment: "التقييم الذاتي",
    roadmap: "خطتي",
    resources: "الأدلة والمصادر",
    workspaces: "مساحات العمل",
    links: "روابط مهمة",
    pricing: "الأسعار",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    register: "إنشاء حساب",
  },

  actions: {
    continue: "متابعة",
    back: "رجوع",
    next: "التالي",
    save: "حفظ",
    cancel: "إلغاء",
    close: "إغلاق",
    retry: "حاول مرة أخرى",
    start: "ابدأ",
    viewAll: "عرض الكل",
    learnMore: "اعرف أكثر",
  },

  states: {
    loading: "جارٍ التحميل…",
    saving: "جارٍ الحفظ…",
    empty: "لا يوجد شيء هنا بعد",
    error: "حدث خطأ ما",
    required: "مطلوب",
    optional: "اختياري",
  },

  language: {
    label: "اللغة",
    english: "English",
    arabic: "العربية",
    switchToArabic: "التحويل إلى العربية",
    switchToEnglish: "التحويل إلى الإنجليزية",
  },

  footer: {
    rights:
      "© 2026 Healthcare Quality School. دعم في التخطيط — وليس ضمانًا للحصول على مقعد تدريبي.",
    eligibility: "الأهلية تحددها جهات التوظيف الرسمية، ولا نحددها نحن.",
  },
} as const;
