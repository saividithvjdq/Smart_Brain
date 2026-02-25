import nodemailer from 'nodemailer'

/**
 * Create a reusable SMTP transporter
 * Uses Gmail SMTP — requires an App Password (NOT your regular Gmail password)
 *
 * How to get a Gmail App Password:
 * 1. Go to https://myaccount.google.com/apppasswords
 * 2. Select "Mail" and your device
 * 3. Copy the 16-character password
 * 4. Set it as SMTP_PASSWORD in .env
 */
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD, // Gmail App Password
    },
  })
}

/**
 * Send the Axon welcome email to a new user
 */
export async function sendWelcomeEmail(email: string, displayName?: string) {
  const firstName = displayName || email.split('@')[0]

  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn('SMTP not configured — skipping welcome email')
    return false
  }

  try {
    const transporter = createTransporter()

    await transporter.sendMail({
      from: `"Axon" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: `Welcome to Axon, ${firstName} 🧠`,
      html: getWelcomeHTML(firstName),
    })

    console.log(`Welcome email sent to ${email}`)
    return true
  } catch (err) {
    console.error('Failed to send welcome email:', err)
    return false
  }
}

function getWelcomeHTML(name: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0b;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background-color:#111113;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 36px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              <div style="font-size:28px;font-weight:800;letter-spacing:0.05em;background:linear-gradient(90deg,#7B5FFF,#B030E0,#E020B0);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">⬡ AXON</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f0f0f0;">
                Welcome, ${name}
              </h1>
              <p style="margin:0 0 24px;font-size:14px;color:#888;line-height:1.6;">
                Your second brain is ready. Here's what you can do.
              </p>

              <!-- Feature 1 -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;width:100%;">
                <tr>
                  <td width="36" valign="top" style="padding-top:2px;">
                    <span style="font-size:18px;">📝</span>
                  </td>
                  <td style="padding-left:8px;">
                    <div style="font-size:14px;font-weight:600;color:#e0e0e0;margin-bottom:2px;">Capture Knowledge</div>
                    <div style="font-size:13px;color:#777;line-height:1.5;">Save notes, links, and insights with smart tagging.</div>
                  </td>
                </tr>
              </table>

              <!-- Feature 2 -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;width:100%;">
                <tr>
                  <td width="36" valign="top" style="padding-top:2px;">
                    <span style="font-size:18px;">🤖</span>
                  </td>
                  <td style="padding-left:8px;">
                    <div style="font-size:14px;font-weight:600;color:#e0e0e0;margin-bottom:2px;">AI-Powered Recall</div>
                    <div style="font-size:13px;color:#777;line-height:1.5;">Ask questions and get answers sourced from your own notes.</div>
                  </td>
                </tr>
              </table>

              <!-- Feature 3 -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;width:100%;">
                <tr>
                  <td width="36" valign="top" style="padding-top:2px;">
                    <span style="font-size:18px;">✨</span>
                  </td>
                  <td style="padding-left:8px;">
                    <div style="font-size:14px;font-weight:600;color:#e0e0e0;margin-bottom:2px;">Auto-Summarize & Tag</div>
                    <div style="font-size:13px;color:#777;line-height:1.5;">AI generates summaries and tags so you can find anything fast.</div>
                  </td>
                </tr>
              </table>

              <!-- Feature 4 (subtle command palette mention) -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;width:100%;">
                <tr>
                  <td width="36" valign="top" style="padding-top:2px;">
                    <span style="font-size:18px;">⚡</span>
                  </td>
                  <td style="padding-left:8px;">
                    <div style="font-size:14px;font-weight:600;color:#e0e0e0;margin-bottom:2px;">Built for Speed</div>
                    <div style="font-size:13px;color:#777;line-height:1.5;">Power users love the keyboard shortcuts — try <span style="color:#B080FF;font-family:monospace;font-size:12px;background:rgba(120,80,255,0.1);padding:1px 6px;border-radius:4px;border:1px solid rgba(120,80,255,0.2);">Ctrl+K</span> once you're in.</div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <a href="${appUrl}/dashboard" 
                 style="display:block;text-align:center;padding:14px 24px;background:linear-gradient(135deg,#7B5FFF,#A030E8);color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:12px;letter-spacing:0.02em;">
                Open Your Brain →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px 28px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;font-size:11px;color:#555;line-height:1.5;">
                Axon — Your AI-Powered Second Brain<br>
                You received this because you signed up at Axon.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
