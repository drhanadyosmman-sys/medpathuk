import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  accessCodes,
  chatMessages,
  chatSessions,
  externalLinks,
  onboardingAssessments,
  roadmapMilestones,
  roadmaps,
  subscriptionPlans,
  tasks,
  users,
  sasResults,
  InsertSasResult,
  passwordResetTokens,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  // Always enforce admin role for the owner
  if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
    values.isActivated = true;
    updateSet.isActivated = true;
  } else if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  return result[0];
}

export async function createEmailUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  whatsappNumber?: string | null;
  graduationCountry?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const openId = `email:${data.email.toLowerCase()}`;
  await db.insert(users).values({
    openId,
    name: data.name,
    email: data.email.toLowerCase(),
    loginMethod: "email",
    passwordHash: data.passwordHash,
    whatsappNumber: data.whatsappNumber ?? null,
    graduationCountry: data.graduationCountry ?? null,
    isActivated: true,
    lastSignedIn: new Date(),
  });
  const created = await getUserByEmail(data.email.toLowerCase());
  return created!;
}

export async function updateUserProfile(userId: number, data: Partial<typeof users.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, userId));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

// ─── Access Codes ─────────────────────────────────────────────────────────────
export async function createAccessCode(data: typeof accessCodes.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const [result] = await db.insert(accessCodes).values(data);
  return (result as any).insertId as number;
}

export async function getAccessCodeByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(accessCodes).where(eq(accessCodes.code, code)).limit(1);
  return result[0];
}

export async function validateAndUseAccessCode(code: string, email: string, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");

  const result = await db.select().from(accessCodes).where(eq(accessCodes.code, code)).limit(1);
  const accessCode = result[0];

  if (!accessCode) return { valid: false, error: "Invalid access code." };
  if (accessCode.isUsed) return { valid: false, error: "This access code has already been used." };
  if (accessCode.email.toLowerCase() !== email.toLowerCase()) {
    return { valid: false, error: "This access code is not registered for this email address." };
  }
  if (accessCode.expiresAt && accessCode.expiresAt < new Date()) {
    return { valid: false, error: "This access code has expired." };
  }

  // Mark code as used
  await db.update(accessCodes).set({ isUsed: true, usedByUserId: userId, usedAt: new Date() }).where(eq(accessCodes.id, accessCode.id));

  // Activate user and set subscription tier
  await db.update(users).set({
    isActivated: true,
    accessCodeId: accessCode.id,
    subscriptionTier: accessCode.subscriptionTier,
  }).where(eq(users.id, userId));

  return { valid: true, tier: accessCode.subscriptionTier };
}

export async function getAllAccessCodes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(accessCodes).orderBy(desc(accessCodes.createdAt));
}

// ─── Onboarding Assessment ────────────────────────────────────────────────────
export async function saveOnboardingAssessment(data: typeof onboardingAssessments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const [result] = await db.insert(onboardingAssessments).values(data);
  return (result as any).insertId as number;
}

export async function getLatestAssessment(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(onboardingAssessments)
    .where(eq(onboardingAssessments.userId, userId))
    .orderBy(desc(onboardingAssessments.completedAt))
    .limit(1);
  return result[0];
}

// ─── Roadmaps ─────────────────────────────────────────────────────────────────
export async function saveRoadmap(data: typeof roadmaps.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const [result] = await db.insert(roadmaps).values(data);
  return (result as any).insertId as number;
}

export async function getActiveRoadmap(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(roadmaps)
    .where(and(eq(roadmaps.userId, userId), eq(roadmaps.isActive, true)))
    .orderBy(desc(roadmaps.createdAt))
    .limit(1);
  return result[0];
}

export async function saveMilestones(milestones: (typeof roadmapMilestones.$inferInsert)[]) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  if (milestones.length === 0) return;
  await db.insert(roadmapMilestones).values(milestones);
}

export async function getMilestonesByRoadmap(roadmapId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(roadmapMilestones).where(eq(roadmapMilestones.roadmapId, roadmapId)).orderBy(roadmapMilestones.orderIndex);
}

export async function updateMilestoneCompletion(milestoneId: number, userId: number, isCompleted: boolean) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(roadmapMilestones)
    .set({ isCompleted, completedAt: isCompleted ? new Date() : null })
    .where(and(eq(roadmapMilestones.id, milestoneId), eq(roadmapMilestones.userId, userId)));
}

// ─── Tasks ────────────────────────────────────────────────────────────────────
export async function getUserTasks(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(tasks.dueDate);
}

export async function createTask(data: typeof tasks.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const [result] = await db.insert(tasks).values(data);
  return (result as any).insertId as number;
}

export async function updateTaskCompletion(taskId: number, userId: number, isCompleted: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(tasks).set({ isCompleted, completedAt: isCompleted ? new Date() : null }).where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
}

export async function removeTask(taskId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(tasks).where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
export async function getOrCreateChatSession(userId: number, workspace: typeof chatSessions.$inferInsert["workspace"]) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");

  const existing = await db
    .select()
    .from(chatSessions)
    .where(and(eq(chatSessions.userId, userId), eq(chatSessions.workspace, workspace)))
    .orderBy(desc(chatSessions.updatedAt))
    .limit(1);

  if (existing[0]) return existing[0];

  const [result] = await db.insert(chatSessions).values({ userId, workspace, title: `${workspace} session` });
  const sessionId = (result as any).insertId as number;
  const newSession = await db.select().from(chatSessions).where(eq(chatSessions.id, sessionId)).limit(1);
  return newSession[0];
}

export async function getChatHistory(userId: number, workspace: string, limit = 30) {
  const db = await getDb();
  if (!db) return [];

  const session = await db
    .select()
    .from(chatSessions)
    .where(and(eq(chatSessions.userId, userId), eq(chatSessions.workspace, workspace as any)))
    .orderBy(desc(chatSessions.updatedAt))
    .limit(1);

  if (!session[0]) return [];

  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, session[0].id))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);

  return messages.reverse();
}

export async function saveChatMessage(data: typeof chatMessages.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(chatMessages).values(data);
}

// ─── External Links ───────────────────────────────────────────────────────────
export async function getExternalLinks(category?: string) {
  const db = await getDb();
  if (!db) return [];
  if (category) {
    return db.select().from(externalLinks).where(and(eq(externalLinks.category, category), eq(externalLinks.isActive, true))).orderBy(externalLinks.orderIndex);
  }
  return db.select().from(externalLinks).where(eq(externalLinks.isActive, true)).orderBy(externalLinks.category, externalLinks.orderIndex);
}

export async function upsertExternalLink(data: typeof externalLinks.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(externalLinks).values(data).onDuplicateKeyUpdate({ set: data });
}

// ─── Subscription Plans ───────────────────────────────────────────────────────
export async function getSubscriptionPlans() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
}

export async function seedInitialData() {
  const db = await getDb();
  if (!db) return;

  // Seed subscription plans
  const existing = await db.select().from(subscriptionPlans).limit(1);
  if (existing.length > 0) return;

  await db.insert(subscriptionPlans).values([
    {
      name: "Starter",
      tier: "free",
      priceMonthly: "0.00" as any,
      priceYearly: "0.00" as any,
      features: JSON.stringify(["Access code required", "Onboarding assessment", "Personal roadmap", "Basic AI workspace access", "Official resources center"]),
    },
    {
      name: "Professional",
      tier: "pro",
      priceMonthly: "29.99" as any,
      priceYearly: "299.99" as any,
      features: JSON.stringify(["Everything in Starter", "Full AI workspace access", "File upload & analysis", "Interview mock sessions", "Priority support"]),
    },
    {
      name: "Premium",
      tier: "premium",
      priceMonthly: "79.99" as any,
      priceYearly: "799.99" as any,
      features: JSON.stringify(["Everything in Professional", "1-to-1 mentoring sessions", "Personalised journal finder", "CV & portfolio review", "Unlimited AI interactions"]),
    },
  ]);

  // Seed external links
  const linksExisting = await db.select().from(externalLinks).limit(1);
  if (linksExisting.length > 0) return;

  await db.insert(externalLinks).values([
    { name: "GMC - General Medical Council", url: "https://www.gmc-uk.org", description: "UK medical licensing and registration authority", category: "registration", orderIndex: 1 },
    { name: "NHS Jobs", url: "https://www.jobs.nhs.uk", description: "Official NHS jobs portal", category: "jobs", orderIndex: 1 },
    { name: "Oriel - UK Training Applications", url: "https://www.oriel.nhs.uk", description: "Official portal for postgraduate medical training applications", category: "applications", orderIndex: 1 },
    { name: "OET Official", url: "https://www.occupationalenglishtest.org", description: "Occupational English Test for healthcare professionals", category: "english", orderIndex: 1 },
    { name: "Think. Check. Submit.", url: "https://thinkchecksubmit.org", description: "Helps researchers identify trusted journals", category: "research", orderIndex: 1 },
    { name: "ICMJE - International Committee of Medical Journal Editors", url: "https://www.icmje.org", description: "Authorship and publication standards", category: "research", orderIndex: 2 },
    { name: "UKRIO - UK Research Integrity Office", url: "https://ukrio.org", description: "Research integrity guidance for UK researchers", category: "research", orderIndex: 3 },
    { name: "Royal College of Physicians", url: "https://www.rcplondon.ac.uk", description: "MRCP exams and physician training", category: "colleges", orderIndex: 1 },
    { name: "Royal College of Surgeons", url: "https://www.rcseng.ac.uk", description: "MRCS exams and surgical training", category: "colleges", orderIndex: 2 },
    { name: "Royal College of GPs", url: "https://www.rcgp.org.uk", description: "MRCGP and GP training", category: "colleges", orderIndex: 3 },
    { name: "Health Education England", url: "https://www.hee.nhs.uk", description: "NHS workforce training and education", category: "training", orderIndex: 1 },
    { name: "PLAB - Professional and Linguistic Assessments Board", url: "https://www.gmc-uk.org/registration-and-licensing/join-the-register/plab", description: "PLAB exam information for IMGs", category: "exams", orderIndex: 1 },
  ]);
}

// ─── SAS Results ──────────────────────────────────────────────────────────────
export async function saveSasResult(data: InsertSasResult) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(sasResults).values(data);
  return result;
}

export async function getSasResults(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(sasResults)
    .where(eq(sasResults.userId, userId))
    .orderBy(desc(sasResults.createdAt));
}

export async function getLatestSasResult(userId: number, specialty: string) {
  const db = await getDb();
  if (!db) return null;
  const results = await db
    .select()
    .from(sasResults)
    .where(and(eq(sasResults.userId, userId), eq(sasResults.specialty, specialty)))
    .orderBy(desc(sasResults.createdAt))
    .limit(1);
  return results[0] ?? null;
}

// ─── Password Reset Tokens ────────────────────────────────────────────────────
export async function createPasswordResetToken(userId: number, token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  // Invalidate any existing tokens for this user
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));
  await db.insert(passwordResetTokens).values({ userId, token, expiresAt });
}

export async function getPasswordResetToken(token: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);
  return result[0] ?? null;
}

export async function markPasswordResetTokenUsed(token: string) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.token, token));
}

export async function updateUserPassword(userId: number, passwordHash: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}
