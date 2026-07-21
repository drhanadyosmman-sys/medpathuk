import { Resend } from "resend";

const FROM_EMAIL = "MedPath UK <support@hcqsai.uk>";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not set — emails will not be sent");
    return null;
  }
  return new Resend(apiKey);
}

// ─── Welcome Email ────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to MedPath UK 🎉",
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f0a1e;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0a1e;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1030;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6d28d9,#4c1d95);padding:40px 40px 30px;text-align:center;">
            <div style="width:56px;height:56px;background:rgba(255,255,255,0.15);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
              <span style="font-size:28px;">🩺</span>
            </div>
            <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;">MedPath UK</h1>
            <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:14px;">Your UK Medical Career Platform</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h2 style="color:#e2d9f3;margin:0 0 16px;font-size:22px;">Welcome, Dr. ${name}! 👋</h2>
            <p style="color:#a89bc2;line-height:1.7;margin:0 0 24px;font-size:15px;">
              Your account has been created successfully. You now have access to all the tools you need to navigate your UK medical career journey.
            </p>
            <!-- Features -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              ${[
                ["🎯", "SAS Assessment", "Score yourself across 18 UK specialties using official NHS Oriel criteria"],
                ["🤖", "AI Roadmap", "Get a personalised career roadmap targeting your weakest domains"],
                ["💬", "AI Workspaces", "10 specialised AI workspaces for research, CV, interviews & more"],
                ["📚", "Official Resources", "Curated links to GMC, NHS Jobs, Oriel, OET and Royal Colleges"],
              ].map(([icon, title, desc]) => `
              <tr>
                <td style="padding:12px;background:#241840;border-radius:10px;margin-bottom:10px;display:block;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="40" style="vertical-align:top;padding-right:12px;">
                        <div style="width:36px;height:36px;background:#3b1f6e;border-radius:8px;text-align:center;line-height:36px;font-size:18px;">${icon}</div>
                      </td>
                      <td>
                        <p style="color:#e2d9f3;margin:0 0 4px;font-size:14px;font-weight:600;">${title}</p>
                        <p style="color:#8b7aaa;margin:0;font-size:13px;">${desc}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr><td style="height:8px;"></td></tr>
              `).join("")}
            </table>
            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="https://medpathuk.hcqsai.uk/dashboard" style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:700;font-size:16px;">
                    Go to My Dashboard →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #2d1f50;text-align:center;">
            <p style="color:#6b5a8a;margin:0;font-size:13px;">
              © 2025 MedPath UK · <a href="https://medpathuk.hcqsai.uk" style="color:#9b7fd4;text-decoration:none;">medpathuk.hcqsai.uk</a>
            </p>
            <p style="color:#6b5a8a;margin:8px 0 0;font-size:12px;">
              This email was sent to ${to} because you registered on MedPath UK.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
      `,
    });
    console.log(`[Email] Welcome email sent to ${to}`);
  } catch (error) {
    console.error("[Email] Failed to send welcome email:", error);
  }
}

// ─── Password Reset Email ─────────────────────────────────────────────────────
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetToken: string,
  origin: string
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const resetUrl = `${origin}/reset-password?token=${resetToken}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Reset Your MedPath UK Password",
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0f0a1e;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0a1e;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1030;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6d28d9,#4c1d95);padding:40px 40px 30px;text-align:center;">
            <div style="font-size:48px;margin-bottom:12px;">🔐</div>
            <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">Password Reset Request</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="color:#e2d9f3;font-size:16px;margin:0 0 16px;">Hi ${name},</p>
            <p style="color:#a89bc2;line-height:1.7;margin:0 0 24px;font-size:15px;">
              We received a request to reset your MedPath UK password. Click the button below to create a new password. This link expires in <strong style="color:#e2d9f3;">1 hour</strong>.
            </p>
            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td align="center">
                  <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#6d28d9,#4c1d95);color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:700;font-size:16px;">
                    Reset My Password →
                  </a>
                </td>
              </tr>
            </table>
            <p style="color:#8b7aaa;font-size:13px;line-height:1.6;margin:0 0 8px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="background:#241840;border-radius:8px;padding:12px;color:#9b7fd4;font-size:12px;word-break:break-all;margin:0 0 24px;">
              ${resetUrl}
            </p>
            <p style="color:#6b5a8a;font-size:13px;margin:0;">
              If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #2d1f50;text-align:center;">
            <p style="color:#6b5a8a;margin:0;font-size:13px;">
              © 2025 MedPath UK · <a href="https://medpathuk.hcqsai.uk" style="color:#9b7fd4;text-decoration:none;">medpathuk.hcqsai.uk</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
      `,
    });
    console.log(`[Email] Password reset email sent to ${to}`);
  } catch (error) {
    console.error("[Email] Failed to send password reset email:", error);
  }
}
