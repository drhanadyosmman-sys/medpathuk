import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import { sendWelcomeEmail, sendPasswordResetEmail } from "./email";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM, invokeLLMJson, languageInstruction } from "./_core/llm";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createAccessCode,
  createEmailUser,
  createTask,
  getAllAccessCodes,
  getAllUsers,
  getActiveRoadmap,
  getChatHistory,
  getExternalLinks,
  getLatestAssessment,
  getMilestonesByRoadmap,
  getOrCreateChatSession,
  getSubscriptionPlans,
  getUserByEmail,
  removeTask,
  saveChatMessage,
  saveMilestones,
  saveOnboardingAssessment,
  saveRoadmap,
  seedInitialData,
  updateMilestoneCompletion,
  updateTaskCompletion,
  updateUserProfile,
  validateAndUseAccessCode,
  saveSasResult,
  getSasResults,
  createPasswordResetToken,
  getPasswordResetToken,
  markPasswordResetTokenUsed,
  updateUserPassword,
  promoteToAdminByEmail,
} from "./db";
import { ENV } from "./_core/env";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getTierLevel(tier: string): number {
  const levels: Record<string, number> = { free: 0, pro: 1, premium: 2 };
  return levels[tier] ?? 0;
}

function generateCode(length = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const appRouter = router({
  system: systemRouter,

  // ─── Auth ─────────────────────────────────────────────────────────────────
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    register: publicProcedure
      .input(z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        whatsappNumber: z.string().optional(),
        graduationCountry: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await getUserByEmail(input.email);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "An account with this email already exists." });
        }
        const passwordHash = await bcrypt.hash(input.password, 12);
        const user = await createEmailUser({
          name: input.name,
          email: input.email,
          passwordHash,
          whatsappNumber: input.whatsappNumber || null,
          graduationCountry: input.graduationCountry || null,
        });
        const sessionToken = await sdk.createSessionToken(user.openId, { name: user.name || "", expiresInMs: ONE_YEAR_MS });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        // Send welcome email (non-blocking)
        sendWelcomeEmail(user.email!, user.name || "Doctor").catch(console.error);
        return { success: true, user: { id: user.id, name: user.name, email: user.email } };
      }),
    login: publicProcedure
      .input(z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await getUserByEmail(input.email);
        if (!user || !user.passwordHash) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
        }
        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
        }
        // The owner becomes an admin on sign-in — role is read fresh from the
        // database on every request, so the admin panel is available from here
        // on without a database edit or a re-login.
        if (
          ENV.ownerEmail &&
          user.email?.toLowerCase() === ENV.ownerEmail &&
          user.role !== "admin"
        ) {
          await promoteToAdminByEmail(user.email);
        }
        const sessionToken = await sdk.createSessionToken(user.openId, { name: user.name || "", expiresInMs: ONE_YEAR_MS });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        return { success: true, user: { id: user.id, name: user.name, email: user.email } };
      }),
    forgotPassword: publicProcedure
      .input(z.object({
        email: z.string().email("Invalid email address"),
        origin: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const user = await getUserByEmail(input.email);
        // Always return success to prevent email enumeration
        if (!user) return { success: true };
        const token = nanoid(48);
        await createPasswordResetToken(user.id, token);
        const origin = input.origin || "https://medpathuk.hcqsai.uk";
        sendPasswordResetEmail(user.email!, user.name || "Doctor", token, origin).catch(console.error);
        return { success: true };
      }),
    resetPassword: publicProcedure
      .input(z.object({
        token: z.string().min(1),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }))
      .mutation(async ({ input }) => {
        const resetToken = await getPasswordResetToken(input.token);
        if (!resetToken) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid or expired reset link." });
        }
        if (resetToken.usedAt) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "This reset link has already been used." });
        }
        if (new Date() > resetToken.expiresAt) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "This reset link has expired. Please request a new one." });
        }
        const passwordHash = await bcrypt.hash(input.password, 12);
        await updateUserPassword(resetToken.userId, passwordHash);
        await markPasswordResetTokenUsed(input.token);
        return { success: true };
      }),
  }),

  // ─── User Profile ─────────────────────────────────────────────────────────
  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return ctx.user;
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        specialty: z.string().optional(),
        careerLevel: z.string().optional(),
        currentHospital: z.string().optional(),
        targetSpecialty: z.string().optional(),
        country: z.string().optional(),
        availableHoursPerWeek: z.number().optional(),
        goalTimelineMonths: z.number().optional(),
        name: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // ─── Access Code ──────────────────────────────────────────────────────────
  accessCode: router({
    validate: protectedProcedure
      .input(z.object({ code: z.string(), email: z.string().email() }))
      .mutation(async ({ ctx, input }) => {
        const result = await validateAndUseAccessCode(input.code.trim().toUpperCase(), input.email.trim(), ctx.user.id);
        if (!result.valid) {
          throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
        }
        return { success: true, tier: result.tier };
      }),
  }),

  // ─── Onboarding Assessment ────────────────────────────────────────────────
  onboarding: router({
    getLatest: protectedProcedure.query(async ({ ctx }) => {
      return getLatestAssessment(ctx.user.id);
    }),
    submit: protectedProcedure
      .input(z.object({
        specialty: z.string().optional(),
        careerLevel: z.string().optional(),
        country: z.string().optional(),
        targetSpecialty: z.string().optional(),
        targetPathway: z.string().optional(),
        englishStatus: z.string().optional(),
        oetStatus: z.string().optional(),
        researchCount: z.number().default(0),
        auditCount: z.number().default(0),
        qipCount: z.number().default(0),
        teachingExperience: z.boolean().default(false),
        leadershipExperience: z.boolean().default(false),
        presentationsCount: z.number().default(0),
        currentExams: z.array(z.string()).optional(),
        examsPassed: z.array(z.string()).optional(),
        mainGoal: z.string().optional(),
        availableHoursPerWeek: z.number().optional(),
        goalTimelineMonths: z.number().optional(),
        additionalInfo: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Compute readiness score
        let score = 0;
        if (input.researchCount && input.researchCount > 0) score += Math.min(input.researchCount * 10, 20);
        if (input.auditCount && input.auditCount > 0) score += Math.min(input.auditCount * 10, 15);
        if (input.qipCount && input.qipCount > 0) score += Math.min(input.qipCount * 10, 15);
        if (input.teachingExperience) score += 10;
        if (input.leadershipExperience) score += 10;
        if (input.presentationsCount && input.presentationsCount > 0) score += Math.min(input.presentationsCount * 5, 10);
        if (input.examsPassed && input.examsPassed.length > 0) score += Math.min(input.examsPassed.length * 10, 20);
        score = Math.min(score, 100);

        const assessmentId = await saveOnboardingAssessment({
          userId: ctx.user.id,
          ...input,
          currentExams: input.currentExams ? JSON.stringify(input.currentExams) : null,
          examsPassed: input.examsPassed ? JSON.stringify(input.examsPassed) : null,
          readinessScore: score,
        });

        await updateUserProfile(ctx.user.id, {
          specialty: input.specialty,
          careerLevel: input.careerLevel,
          country: input.country,
          targetSpecialty: input.targetSpecialty,
          availableHoursPerWeek: input.availableHoursPerWeek,
          goalTimelineMonths: input.goalTimelineMonths,
          onboardingCompleted: true,
          readinessScore: score,
        });

        return { assessmentId, readinessScore: score };
      }),
  }),

  // ─── Roadmap ──────────────────────────────────────────────────────────────
  roadmap: router({
    getActive: protectedProcedure.query(async ({ ctx }) => {
      const roadmap = await getActiveRoadmap(ctx.user.id);
      if (!roadmap) return null;
      const milestones = await getMilestonesByRoadmap(roadmap.id);
      // Exclude generatedContent to avoid sending large JSON string to frontend
      const { generatedContent: _gc, ...roadmapWithoutContent } = roadmap as any;
      return { ...roadmapWithoutContent, milestones };
    }),

    generate: protectedProcedure
      .input(z.object({
        assessmentId: z.number(),
        language: z.enum(["en", "ar"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const assessment = await getLatestAssessment(ctx.user.id);
        if (!assessment) throw new TRPCError({ code: "BAD_REQUEST", message: "Please complete the onboarding assessment first." });

        const tier = ctx.user.subscriptionTier ?? "free";
        const milestoneCount = tier === "premium" ? 20 : tier === "pro" ? 15 : 10;

        const prompt = `You are an expert UK medical career advisor. Create a detailed, personalized career roadmap for a healthcare professional with the following profile:

Specialty: ${assessment.specialty || "General"}
Career Level: ${assessment.careerLevel || "Foundation"}
Country of Origin: ${assessment.country || "International"}
Target Specialty: ${assessment.targetSpecialty || "Not specified"}
Target Pathway: ${assessment.targetPathway || "UK Training"}
English Status: ${assessment.englishStatus || "Unknown"}
Research Count: ${assessment.researchCount || 0}
Audit Count: ${assessment.auditCount || 0}
QIP Count: ${assessment.qipCount || 0}
Teaching Experience: ${assessment.teachingExperience ? "Yes" : "No"}
Leadership Experience: ${assessment.leadershipExperience ? "Yes" : "No"}
Presentations: ${assessment.presentationsCount || 0}
Main Goal: ${assessment.mainGoal || "Get a training post"}
Available Hours/Week: ${assessment.availableHoursPerWeek || 10}
Goal Timeline: ${assessment.goalTimelineMonths || 12} months
Readiness Score: ${assessment.readinessScore || 0}/100

Generate a roadmap with exactly ${milestoneCount} milestones. Each milestone must be specific, actionable, and relevant to UK medical career progression.

Return ONLY valid JSON in this exact format:
{
  "title": "Your Personalised UK Career Roadmap",
  "summary": "2-3 sentence summary of the plan",
  "totalDurationMonths": number,
  "milestones": [
    {
      "title": "Milestone title",
      "description": "Detailed description with specific actions",
      "category": "one of: research|audit|qip|exam|interview|cv|teaching|leadership|presentation|oet|application|other",
      "dueMonths": number (months from now),
      "orderIndex": number (1-based),
      "priority": "high|medium|low",
      "resources": [{"title": "Resource name", "url": "https://..."}]
    }
  ]
}${languageInstruction(input.language)}`;

        let roadmapData: { title: string; summary: string; totalDurationMonths: number; milestones: any[] };
        try {
          roadmapData = await invokeLLMJson({
            messages: [{ role: "user", content: prompt }],
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                summary: { type: "string" },
                totalDurationMonths: { type: "integer" },
                milestones: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      category: { type: "string" },
                      dueMonths: { type: "integer" },
                      orderIndex: { type: "integer" },
                      priority: { type: "string" },
                      resources: { type: "array", items: { type: "object", properties: { title: { type: "string" }, url: { type: "string" } }, required: ["title", "url"], additionalProperties: false } },
                    },
                    required: ["title", "description", "category", "dueMonths", "orderIndex", "priority", "resources"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["title", "summary", "totalDurationMonths", "milestones"],
              additionalProperties: false,
            },
          });
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Failed to generate roadmap",
          });
        }

        // Deactivate old roadmaps
        const { getDb } = await import("./db");
        const { roadmaps: roadmapsTable } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const db = await getDb();
        if (db) {
          await db.update(roadmapsTable).set({ isActive: false }).where(eq(roadmapsTable.userId, ctx.user.id));
        }

        const roadmapId = await saveRoadmap({
          userId: ctx.user.id,
          assessmentId: input.assessmentId,
          title: roadmapData.title,
          summary: roadmapData.summary,
          totalDurationMonths: roadmapData.totalDurationMonths,
          generatedContent: JSON.stringify(roadmapData),
          isActive: true,
        });

        const now = new Date();
        const milestones = roadmapData.milestones.map((m: any) => {
          const dueDate = new Date(now);
          dueDate.setMonth(dueDate.getMonth() + m.dueMonths);
          return {
            roadmapId,
            userId: ctx.user.id,
            title: m.title,
            description: m.description,
            category: m.category,
            dueDate,
            orderIndex: m.orderIndex,
            priority: m.priority,
            resources: JSON.stringify(m.resources),
            isCompleted: false,
          };
        });

        await saveMilestones(milestones);
        return { roadmapId, title: roadmapData.title, summary: roadmapData.summary };
      }),

    toggleMilestone: protectedProcedure
      .input(z.object({ milestoneId: z.number(), isCompleted: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        await updateMilestoneCompletion(input.milestoneId, ctx.user.id, input.isCompleted);
        return { success: true };
      }),
  }),

  // ─── Tasks ────────────────────────────────────────────────────────────────
  tasks: router({
    list: protectedProcedure.query(async ({ ctx }) => getUserTasks(ctx.user.id)),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        dueDate: z.string().optional(),
        priority: z.enum(["high", "medium", "low"]).default("medium"),
        category: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await createTask({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          priority: input.priority,
          category: input.category,
        });
        return { id };
      }),
    toggle: protectedProcedure
      .input(z.object({ taskId: z.number(), isCompleted: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        await updateTaskCompletion(input.taskId, ctx.user.id, input.isCompleted);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ taskId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await removeTask(input.taskId, ctx.user.id);
        return { success: true };
      }),
  }),

  // ─── External Links ───────────────────────────────────────────────────────
  links: router({
    getAll: publicProcedure.query(async () => getExternalLinks()),
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => getExternalLinks(input.category)),
  }),

  // ─── Subscription Plans ───────────────────────────────────────────────────
  plans: router({
    getAll: publicProcedure.query(async () => getSubscriptionPlans()),
  }),
  // ─── Subscription ─────────────────────────────────────────────────────────
  subscription: router({
    upgrade: protectedProcedure
      .input(z.object({ tier: z.enum(["pro", "premium"]) }))
      .mutation(async ({ ctx, input }) => {
        await updateUserProfile(ctx.user.id, { subscriptionTier: input.tier });
        return { success: true, tier: input.tier };
      }),
  }),

  // ─── AI Chat (per workspace) ──────────────────────────────────────────────
  chat: router({
    getHistory: protectedProcedure
      .input(z.object({ workspace: z.string() }))
      .query(async ({ ctx, input }) => {
        return getChatHistory(ctx.user.id, input.workspace);
      }),

    sendMessage: protectedProcedure
      .input(z.object({
        workspace: z.enum(["research", "qip", "audit", "teaching", "presentation", "interview", "oet", "cv", "pathway", "general"]),
        message: z.string().max(4000),
        language: z.enum(["en", "ar"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const tier = ctx.user.subscriptionTier ?? "free";

        // Get or create session
        const session = await getOrCreateChatSession(ctx.user.id, input.workspace);

        // Save user message
        await saveChatMessage({ sessionId: session.id, userId: ctx.user.id, role: "user", content: input.message });

        // Get recent history
        const history = await getChatHistory(ctx.user.id, input.workspace, 10);
        const messages: { role: "user" | "assistant"; content: string }[] = history.slice(-10).map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

        const workspacePrompts: Record<string, string> = {
          research: `You are an expert Research Assistant for UK healthcare professionals. You help with: research topic selection, study design, manuscript writing, journal selection (aligned with Think. Check. Submit. principles), authorship planning (following ICMJE guidelines), and publication strategy. Always provide scientifically accurate, evidence-based guidance. When suggesting journals, remind users to verify requirements at the official journal website.`,
          qip: `You are a Quality Improvement Project (QIP) specialist for NHS healthcare professionals. You help with: QI project design, PDSA cycles, baseline measurement, SMART goals, run charts, project timelines, and converting work into portfolio evidence or conference presentations. Use NHS improvement methodology and respond in a structured, scientific manner.`,
          audit: `You are a Clinical Audit specialist for NHS healthcare professionals. You help with: audit topic selection, standard setting, data collection planning, gap analysis, re-audit planning, timelines, and converting audit work into portfolio evidence. Follow NHS clinical audit methodology.`,
          teaching: `You are a Medical Education and Teaching specialist. You help healthcare professionals with: planning teaching sessions, writing learning objectives, building session outlines, creating teaching portfolios, designing feedback forms, planning online teaching (YouTube/webinars), and producing documentation for portfolio use.`,
          presentation: `You are a Medical Presentations and Conference specialist. You help with: preparing oral presentations, designing conference posters, analyzing conference submission criteria, structuring abstracts, adapting content to event requirements, and planning conference participation. Help users create professional, scientifically accurate presentations.`,
          interview: `You are an expert NHS Interview Coach. You help healthcare professionals prepare for NHS and specialty training interviews. You provide: role-specific question generation, STAR-method coaching, mock interview simulations, scoring rubrics, communication coaching, and official-style preparation guidance. Always base advice on the specific role and person specification provided. NHS interviews vary by employer and role, so always encourage users to verify current requirements with the official employer.`,
          oet: `You are an OET (Occupational English Test) preparation specialist for healthcare professionals. You help with: understanding OET structure, practice by sub-test (Listening, Reading, Writing, Speaking), preparation planning, writing task review, and speaking practice. Always direct users to the official OET website (occupationalenglishtest.org) for official sample materials and current exam requirements.`,
          cv: `You are a Medical CV and Portfolio specialist for UK healthcare professionals. You help with: improving medical CV structure, building role-targeted versions, mapping evidence to applications, identifying missing portfolio elements, and generating action plans for strengthening professional profiles. Follow UK medical CV conventions.`,
          pathway: `You are a UK Medical Pathway specialist. You help healthcare professionals navigate: PLAB licensing, Royal College exam pathways (MRCP, MRCS, MRCGP, etc.), Oriel training applications, NHS Jobs applications, and GMC registration. Always direct users to official sources: GMC (gmc-uk.org), Oriel (oriel.nhs.uk), NHS Jobs (jobs.nhs.uk). Provide accurate, up-to-date guidance based on official UK medical training pathways.`,
          general: `You are a comprehensive UK Medical Career Advisor for healthcare professionals. You have expertise in all aspects of UK medical career development including training pathways, portfolio building, examinations, applications, and professional development. Provide accurate, professional, and supportive guidance.`,
        };

        const systemPrompt = `${workspacePrompts[input.workspace] || workspacePrompts.general}

Current user: ${ctx.user.name || "Healthcare Professional"} | Subscription: ${tier} | Specialty: ${ctx.user.specialty || "Not specified"} | Career Level: ${ctx.user.careerLevel || "Not specified"}

${tier === "free" ? "Provide helpful general guidance. For detailed personalised support, mention that premium plans offer more comprehensive assistance." : ""}
${tier === "premium" ? "Provide comprehensive, detailed, personalised guidance with specific resources, timelines, and step-by-step action plans." : ""}

IMPORTANT: Be professional, supportive, and evidence-based. If you reference official sources, provide the correct website URLs. Always add a closing reminder to verify current requirements with the official source before taking action.${languageInstruction(input.language) || "\n\nRespond in English."}`;

        let assistantMessage: string;
        try {
          assistantMessage = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
              { role: "user" as const, content: input.message },
            ],
          });
        } catch (error) {
          // Surface the reason rather than a generic apology — an unset API key
          // and a declined request need very different responses from the user.
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "The assistant is unavailable",
          });
        }

        await saveChatMessage({ sessionId: session.id, userId: ctx.user.id, role: "assistant", content: assistantMessage });

        return { message: assistantMessage };
      }),
  }),

  // ─── Admin ────────────────────────────────────────────────────────────────
  admin: router({
    getUsers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return getAllUsers();
    }),
    getCodes: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return getAllAccessCodes();
    }),
    generateCode: protectedProcedure
      .input(z.object({
        email: z.string().email(),
        tier: z.enum(["free", "pro", "premium"]).default("pro"),
        notes: z.string().optional(),
        expiresInDays: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const code = generateCode();
        const expiresAt = input.expiresInDays
          ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
          : undefined;
        await createAccessCode({
          code,
          email: input.email.toLowerCase(),
          subscriptionTier: input.tier,
          notes: input.notes,
          expiresAt,
        });
        return { code };
      }),
  }),

  // ─── SAS Assessment ────────────────────────────────────────────────────────
  sas: router({
    saveResult: protectedProcedure
      .input(z.object({
        specialty: z.string(),
        specialtyName: z.string(),
        totalScore: z.number(),
        maxScore: z.number(),
        percentageScore: z.number(),
        answers: z.string(), // JSON string of answers
        sectionScores: z.string(), // JSON string of section breakdown
        competitiveLevel: z.enum(["excellent", "competitive", "borderline", "needs_improvement"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await saveSasResult({
          userId: ctx.user.id,
          specialty: input.specialty,
          specialtyName: input.specialtyName,
          totalScore: input.totalScore,
          maxScore: input.maxScore,
          percentageScore: input.percentageScore.toFixed(2),
          answers: JSON.parse(input.answers),
          sectionScores: JSON.parse(input.sectionScores),
          competitiveLevel: input.competitiveLevel,
        });
        return { success: true };
      }),
    getResults: protectedProcedure.query(async ({ ctx }) => {
      return getSasResults(ctx.user.id);
    }),

    saveMilestonesToRoadmap: protectedProcedure
      .input(z.object({
        specialtyName: z.string(),
        milestones: z.array(z.object({
          domain: z.string(),
          priority: z.enum(["high", "medium", "low"]),
          title: z.string(),
          description: z.string(),
          steps: z.array(z.string()),
          timeframe: z.string(),
          resources: z.array(z.object({ title: z.string(), url: z.string() })),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        // Get or create an active roadmap for the user
        let roadmap = await getActiveRoadmap(ctx.user.id);
        let roadmapId: number;

        if (!roadmap) {
          // Create a new roadmap seeded from SAS suggestions
          roadmapId = await saveRoadmap({
            userId: ctx.user.id,
            title: `${input.specialtyName} Improvement Plan`,
            summary: `Personalised improvement roadmap generated from SAS assessment for ${input.specialtyName}. Focus on the highlighted weak domains to reach the competitive threshold.`,
            totalDurationMonths: 12,
            isActive: true,
          });
        } else {
          roadmapId = roadmap.id;
        }

        // Get current highest orderIndex so we append after existing milestones
        const existingMilestones = await getMilestonesByRoadmap(roadmapId);
        const maxOrder = existingMilestones.reduce((max, m) => Math.max(max, m.orderIndex ?? 0), 0);

        // Map SAS milestones to roadmap milestone rows
        const now = new Date();
        const rows = input.milestones.map((m, idx) => {
          const dueDate = new Date(now);
          // Parse timeframe like "3-6 months" → use upper bound
          const match = m.timeframe.match(/(\d+)/g);
          const months = match ? parseInt(match[match.length - 1]) : 6;
          dueDate.setMonth(dueDate.getMonth() + months);

          // Map domain name to a category
          const domainLower = m.domain.toLowerCase();
          const category = domainLower.includes("research") || domainLower.includes("publication")
            ? "research"
            : domainLower.includes("audit")
            ? "audit"
            : domainLower.includes("qip") || domainLower.includes("quality")
            ? "qip"
            : domainLower.includes("teach")
            ? "teaching"
            : domainLower.includes("leader")
            ? "leadership"
            : domainLower.includes("present")
            ? "presentation"
            : domainLower.includes("exam") || domainLower.includes("qualification")
            ? "exam"
            : "other";

          return {
            roadmapId,
            userId: ctx.user.id,
            title: `[SAS] ${m.title}`,
            description: `${m.description}\n\nSteps:\n${m.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
            category: category as any,
            dueDate,
            orderIndex: maxOrder + idx + 1,
            priority: m.priority,
            resources: JSON.stringify(m.resources),
            isCompleted: false,
          };
        });

        await saveMilestones(rows);
        return { roadmapId, count: rows.length };
      }),

    generateRoadmapSuggestions: protectedProcedure
      .input(z.object({
        specialtyName: z.string(),
        totalScore: z.number(),
        maxScore: z.number(),
        percentageScore: z.number(),
        competitiveLevel: z.string(),
        sectionScores: z.string(), // JSON string: { domainId: { name, score, maxScore } }
        language: z.enum(["en", "ar"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const sectionScores = JSON.parse(input.sectionScores) as Record<string, { name: string; score: number; maxScore: number }>;

        // Identify weak domains (scoring < 50% of their max)
        const weakDomains = Object.entries(sectionScores)
          .filter(([, v]) => v.score / v.maxScore < 0.5)
          .sort((a, b) => (a[1].score / a[1].maxScore) - (b[1].score / b[1].maxScore))
          .slice(0, 4) // Focus on up to 4 weakest domains
          .map(([id, v]) => ({ id, name: v.name, score: v.score, maxScore: v.maxScore, percentage: Math.round((v.score / v.maxScore) * 100) }));

        const moderateDomains = Object.entries(sectionScores)
          .filter(([, v]) => v.score / v.maxScore >= 0.5 && v.score / v.maxScore < 0.75)
          .map(([id, v]) => ({ id, name: v.name, score: v.score, maxScore: v.maxScore, percentage: Math.round((v.score / v.maxScore) * 100) }));

        const domainSummary = Object.entries(sectionScores)
          .map(([, v]) => `${v.name}: ${v.score}/${v.maxScore} (${Math.round((v.score / v.maxScore) * 100)}%)`)
          .join("\n");

        const prompt = `You are a UK medical career advisor helping a doctor improve their specialty training application score.

Specialty: ${input.specialtyName}
Overall Score: ${input.totalScore}/${input.maxScore} (${input.percentageScore.toFixed(1)}%) — ${input.competitiveLevel.replace("_", " ")}

Domain Scores:
${domainSummary}

Weakest domains (< 50%):
${weakDomains.map(d => `- ${d.name}: ${d.score}/${d.maxScore} (${d.percentage}%)`).join("\n") || "None — well balanced portfolio!"}

Moderate domains (50–74%):
${moderateDomains.map(d => `- ${d.name}: ${d.score}/${d.maxScore} (${d.percentage}%)`).join("\n") || "None"}

Generate a personalised improvement roadmap with specific, actionable milestones. For each weak or moderate domain, provide 2–3 concrete steps the doctor can take in the next 6–12 months. Be specific, realistic, and encouraging. Reference official UK resources where relevant (e.g., PubMed, NHS, Royal Colleges, NIHR, Oriel).

Return a JSON object with this exact structure:
{
  "summary": "2-3 sentence overall assessment and encouragement",
  "overallAdvice": "1-2 sentences of strategic advice",
  "milestones": [
    {
      "domain": "domain name",
      "priority": "high" | "medium" | "low",
      "currentScore": number,
      "maxScore": number,
      "title": "short action title",
      "description": "detailed description of what to do and why",
      "steps": ["step 1", "step 2", "step 3"],
      "timeframe": "e.g. 3-6 months",
      "resources": [{ "title": "resource name", "url": "https://..." }]
    }
  ]
}${languageInstruction(input.language)}`;

        // The schema is enforced by the API, so the prompt no longer has to ask
        // for "valid JSON only, no markdown" — that instruction existed to work
        // around a model that could return prose around the payload.
        return await invokeLLMJson({
          messages: [
            { role: "system", content: "You are an expert UK medical career advisor." },
            { role: "user", content: prompt },
          ],
          schema: {
                type: "object",
                properties: {
                  summary: { type: "string" },
                  overallAdvice: { type: "string" },
                  milestones: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        domain: { type: "string" },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                        currentScore: { type: "number" },
                        maxScore: { type: "number" },
                        title: { type: "string" },
                        description: { type: "string" },
                        steps: { type: "array", items: { type: "string" } },
                        timeframe: { type: "string" },
                        resources: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              title: { type: "string" },
                              url: { type: "string" },
                            },
                            required: ["title", "url"],
                            additionalProperties: false,
                          },
                        },
                      },
                      required: ["domain", "priority", "currentScore", "maxScore", "title", "description", "steps", "timeframe", "resources"],
                      additionalProperties: false,
                    },
                  },
                },
            required: ["summary", "overallAdvice", "milestones"],
            additionalProperties: false,
          },
        }) as {
          summary: string;
          overallAdvice: string;
          milestones: Array<{
            domain: string;
            priority: "high" | "medium" | "low";
            currentScore: number;
            maxScore: number;
            title: string;
            description: string;
            steps: string[];
            timeframe: string;
            resources: Array<{ title: string; url: string }>;
          }>;
        };
      }),
  }),

  // ─── Seed ─────────────────────────────────────────────────────────────────
  seed: router({
    run: publicProcedure.mutation(async () => {
      await seedInitialData();
      return { success: true };
    }),
  }),
});

async function getUserTasks(userId: number) {
  const { getUserTasks: _getUserTasks } = await import("./db");
  return _getUserTasks(userId);
}

export type AppRouter = typeof appRouter;
