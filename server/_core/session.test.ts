import { describe, expect, it } from "vitest";
import { sdk } from "./sdk";

/**
 * A session that is signed must verify.
 *
 * This is here because it once did not. Tokens carried an appId taken from
 * VITE_APP_ID, a Manus variable that does not exist off Manus, so the field was
 * empty — and verification rejected any token whose appId was empty. Login
 * succeeded, the cookie was set, and the very next request came back
 * unauthenticated. Nobody could stay signed in to the deployed site, and
 * nothing in the logs said why: a rejected session looks identical to never
 * having signed in.
 *
 * The round trip is the property worth testing. Sign, verify, get the same
 * user back — regardless of which optional fields the environment supplies.
 */
describe("session tokens", () => {
  it("verifies a token it just signed", async () => {
    const token = await sdk.createSessionToken("user-123", { name: "Dr Test" });

    const session = await sdk.verifySession(token);

    expect(session).not.toBeNull();
    expect(session?.openId).toBe("user-123");
    expect(session?.name).toBe("Dr Test");
  });

  it("verifies a token whose appId is empty", async () => {
    // Exactly the token the deployed server was producing.
    const token = await sdk.signSession({
      openId: "user-456",
      appId: "",
      name: "",
    });

    const session = await sdk.verifySession(token);

    expect(session?.openId).toBe("user-456");
  });

  it("rejects a token with no openId", async () => {
    const token = await sdk.signSession({
      openId: "",
      appId: "medpath-uk",
      name: "",
    });

    expect(await sdk.verifySession(token)).toBeNull();
  });

  it("rejects a tampered token", async () => {
    const token = await sdk.createSessionToken("user-789");
    const tampered = token.slice(0, -4) + "aaaa";

    expect(await sdk.verifySession(tampered)).toBeNull();
  });

  it("rejects a missing cookie", async () => {
    expect(await sdk.verifySession(undefined)).toBeNull();
    expect(await sdk.verifySession("")).toBeNull();
  });
});
