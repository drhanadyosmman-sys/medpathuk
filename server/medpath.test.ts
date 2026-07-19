import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(tier: "free" | "pro" | "premium" = "free"): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-doctor-001",
    email: "doctor@nhs.uk",
    name: "Dr. Ahmed",
    loginMethod: "manus",
    role: "user",
    isActivated: true,
    accessCodeId: null,
    subscriptionTier: tier,
    subscriptionStatus: "active",
    subscriptionExpiresAt: null,
    specialty: "Internal Medicine",
    careerLevel: "core_training",
    targetSpecialty: "Cardiology",
    currentHospital: "Royal London Hospital",
    country: "UK",
    availableHoursPerWeek: 10,
    goalTimelineMonths: 12,
    onboardingCompleted: false,
    readinessScore: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

describe("auth.logout", () => {
  it("clears session cookie and returns success", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
  });
});

describe("auth.me", () => {
  it("returns current user when authenticated", async () => {
    const { ctx } = createAuthContext("pro");
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).not.toBeNull();
    expect(user?.email).toBe("doctor@nhs.uk");
    expect(user?.subscriptionTier).toBe("pro");
  });

  it("returns null when not authenticated", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: () => {} } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toBeNull();
  });
});

describe("user.getProfile", () => {
  it("returns user profile for authenticated user", async () => {
    const { ctx } = createAuthContext("premium");
    const caller = appRouter.createCaller(ctx);
    const profile = await caller.user.getProfile();
    expect(profile.name).toBe("Dr. Ahmed");
    expect(profile.subscriptionTier).toBe("premium");
  });
});

describe("subscription tiers", () => {
  it("free tier user has correct tier level", async () => {
    const { ctx } = createAuthContext("free");
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user?.subscriptionTier).toBe("free");
  });

  it("pro tier user has correct tier level", async () => {
    const { ctx } = createAuthContext("pro");
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user?.subscriptionTier).toBe("pro");
  });

  it("premium tier user has correct tier level", async () => {
    const { ctx } = createAuthContext("premium");
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user?.subscriptionTier).toBe("premium");
  });
});
