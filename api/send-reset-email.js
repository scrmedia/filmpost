import crypto from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

function supabaseHeaders() {
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  };
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email required" });

  // Always respond with success regardless of whether the email exists (security)
  const SUCCESS = { message: "If an account exists for that email, a reset link is on its way." };

  try {
    // Look up user by email
    const lookupRes = await fetch(
      `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id,email`,
      { headers: supabaseHeaders() }
    );
    const users = await lookupRes.json();
    if (!Array.isArray(users) || users.length === 0) return res.status(200).json(SUCCESS);

    const user = users[0];

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const now = new Date().toISOString();

    // Store token against the user record
    await fetch(
      `${SUPABASE_URL}/rest/v1/users?id=eq.${user.id}`,
      {
        method: "PATCH",
        headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify({ reset_token: token, reset_token_created_at: now }),
      }
    );

    // Send reset email via Resend
    const resetUrl = `https://filmpost.app/reset-password?token=${token}`;
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #f0f0f0;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#111;">FilmPost</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.6;">
                You requested a password reset. Click the button below to choose a new password.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td style="background:#111;border-radius:6px;">
                    <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
                This link expires in 1 hour. If you did not request this, you can ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "FilmPost <noreply@filmpost.app>",
        to: [email],
        subject: "Reset your FilmPost password",
        html,
      }),
    });

    return res.status(200).json(SUCCESS);
  } catch (e) {
    console.error("[FilmPost] send-reset-email error:", e.message);
    // Still return success to avoid leaking information
    return res.status(200).json(SUCCESS);
  }
}
