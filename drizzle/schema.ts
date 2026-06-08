import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
} from "drizzle-orm/mysql-core";

// ─── Access Codes ─────────────────────────────────────────────────────────────
export const accessCodes = mysqlTable("access_codes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull(),
  isUsed: boolean("isUsed").default(false).notNull(),
  usedByUserId: int("usedByUserId"),
  usedAt: timestamp("usedAt"),
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "pro", "premium"]).default("pro").notNull(),
  expiresAt: timestamp("expiresAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AccessCode = typeof accessCodes.$inferSelect;
export type InsertAccessCode = typeof accessCodes.$inferInsert;

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Access control
  isActivated: boolean("isActivated").default(false).notNull(),
  accessCodeId: int("accessCodeId"),
  // Subscription
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "pro", "premium"]).default("free").notNull(),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "cancelled", "expired", "trialing"]).default("active").notNull(),
  subscriptionExpiresAt: timestamp("subscriptionExpiresAt"),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  // Professional profile
  specialty: varchar("specialty", { length: 64 }),
  careerLevel: varchar("careerLevel", { length: 64 }),
  currentHospital: varchar("currentHospital", { length: 256 }),
  targetSpecialty: varchar("targetSpecialty", { length: 64 }),
  country: varchar("country", { length: 64 }),
  availableHoursPerWeek: int("availableHoursPerWeek"),
  goalTimelineMonths: int("goalTimelineMonths"),
  onboardingCompleted: boolean("onboardingCompleted").default(false).notNull(),
  readinessScore: int("readinessScore"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Onboarding Assessment ────────────────────────────────────────────────────
export const onboardingAssessments = mysqlTable("onboarding_assessments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  // Background
  specialty: varchar("specialty", { length: 64 }),
  careerLevel: varchar("careerLevel", { length: 64 }),
  country: varchar("country", { length: 64 }),
  targetSpecialty: varchar("targetSpecialty", { length: 64 }),
  targetPathway: varchar("targetPathway", { length: 64 }),
  // English language
  englishStatus: varchar("englishStatus", { length: 64 }),
  oetStatus: varchar("oetStatus", { length: 64 }),
  // Portfolio readiness
  researchCount: int("researchCount").default(0),
  auditCount: int("auditCount").default(0),
  qipCount: int("qipCount").default(0),
  teachingExperience: boolean("teachingExperience").default(false),
  leadershipExperience: boolean("leadershipExperience").default(false),
  presentationsCount: int("presentationsCount").default(0),
  // Exams
  currentExams: json("currentExams"),
  examsPassed: json("examsPassed"),
  // Goals
  mainGoal: varchar("mainGoal", { length: 128 }),
  availableHoursPerWeek: int("availableHoursPerWeek"),
  goalTimelineMonths: int("goalTimelineMonths"),
  additionalInfo: text("additionalInfo"),
  // Computed
  readinessScore: int("readinessScore"),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type OnboardingAssessment = typeof onboardingAssessments.$inferSelect;

// ─── Roadmaps ─────────────────────────────────────────────────────────────────
export const roadmaps = mysqlTable("roadmaps", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  assessmentId: int("assessmentId"),
  title: varchar("title", { length: 256 }).notNull(),
  summary: text("summary"),
  totalDurationMonths: int("totalDurationMonths"),
  generatedContent: json("generatedContent"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Roadmap = typeof roadmaps.$inferSelect;

// ─── Roadmap Milestones ───────────────────────────────────────────────────────
export const roadmapMilestones = mysqlTable("roadmap_milestones", {
  id: int("id").autoincrement().primaryKey(),
  roadmapId: int("roadmapId").notNull(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["research", "audit", "qip", "exam", "interview", "cv", "teaching", "leadership", "presentation", "oet", "application", "other"]).notNull(),
  dueDate: timestamp("dueDate"),
  orderIndex: int("orderIndex").default(0).notNull(),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  priority: mysqlEnum("priority", ["high", "medium", "low"]).default("medium").notNull(),
  resources: json("resources"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RoadmapMilestone = typeof roadmapMilestones.$inferSelect;

// ─── Tasks ────────────────────────────────────────────────────────────────────
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  milestoneId: int("milestoneId"),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  dueDate: timestamp("dueDate"),
  isCompleted: boolean("isCompleted").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  priority: mysqlEnum("priority", ["high", "medium", "low"]).default("medium").notNull(),
  category: varchar("category", { length: 64 }),
  reminderSent: boolean("reminderSent").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;

// ─── AI Chat Sessions (per workspace) ────────────────────────────────────────
export const chatSessions = mysqlTable("chat_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workspace: mysqlEnum("workspace", ["research", "qip", "audit", "teaching", "presentation", "interview", "oet", "cv", "pathway", "general"]).notNull(),
  title: varchar("title", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatSession = typeof chatSessions.$inferSelect;

export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  attachments: json("attachments"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;

// ─── External Links ───────────────────────────────────────────────────────────
export const externalLinks = mysqlTable("external_links", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  url: varchar("url", { length: 512 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 64 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  orderIndex: int("orderIndex").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExternalLink = typeof externalLinks.$inferSelect;

// ─── SAS (Self Assessment Score) Results ────────────────────────────────────
export const sasResults = mysqlTable("sas_results", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  specialty: varchar("specialty", { length: 64 }).notNull(),
  specialtyName: varchar("specialtyName", { length: 128 }),
  totalScore: int("totalScore").notNull(),
  maxScore: int("maxScore").notNull(),
  percentageScore: decimal("percentageScore", { precision: 5, scale: 2 }),
  sectionScores: json("sectionScores"), // { sectionName: { score, maxScore } }
  answers: json("answers"),             // { questionId: { value, score } }
  feedback: text("feedback"),
  competitiveLevel: mysqlEnum("competitiveLevel", ["excellent", "competitive", "borderline", "needs_improvement"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SasResult = typeof sasResults.$inferSelect;
export type InsertSasResult = typeof sasResults.$inferInsert;

// ─── Subscription Plans ───────────────────────────────────────────────────────
export const subscriptionPlans = mysqlTable("subscription_plans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  tier: mysqlEnum("tier", ["free", "pro", "premium"]).notNull().unique(),
  priceMonthly: decimal("priceMonthly", { precision: 10, scale: 2 }),
  priceYearly: decimal("priceYearly", { precision: 10, scale: 2 }),
  stripePriceIdMonthly: varchar("stripePriceIdMonthly", { length: 128 }),
  stripePriceIdYearly: varchar("stripePriceIdYearly", { length: 128 }),
  features: json("features"),
  isActive: boolean("isActive").default(true).notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
