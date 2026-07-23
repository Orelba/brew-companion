import { fileURLToPath } from 'node:url'
import { PASSWORD_RESET_EXPIRY_MINUTES } from '../constants/auth.js'

const logoCid = 'brew-companion-logo@brewcompanion.app'
const logoPath = fileURLToPath(
  new URL('../assets/brew-companion-logo.png', import.meta.url)
)

const emailCopy = {
  en: {
    direction: 'ltr',
    subject: 'Reset your Brew Companion password',
    preheader: (expiresInMinutes) =>
      `Your password reset link expires in ${expiresInMinutes} minutes.`,
    heading: 'Reset your password',
    greeting: (username) => `Hi ${username},`,
    instructions:
      'We received a request to reset your Brew Companion password. Use the button below to choose a new one.',
    button: 'Reset my password',
    securityLabel: 'For your security:',
    securityNotice: (expiresInMinutes) =>
      `this link expires in ${expiresInMinutes} minutes and can only be used once.`,
    ignoreNotice:
      'If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.',
    fallbackLink:
      'Button not working? Copy and paste this link into your browser:',
    resetLinkLabel: 'Reset your password',
    supportPrompt: 'Need help?',
    supportLink: 'Contact support',
    footer: 'Track your brews. Remember what worked.',
    signoff: '— Brew Companion',
  },
  he: {
    direction: 'rtl',
    subject: 'איפוס הסיסמה שלך ב-Brew Companion',
    preheader: (expiresInMinutes) =>
      `הקישור לאיפוס הסיסמה יהיה בתוקף למשך ${expiresInMinutes} דקות.`,
    heading: 'איפוס הסיסמה',
    greeting: (username) => `היי ${username},`,
    instructions:
      'קיבלנו בקשה לאיפוס הסיסמה שלך ב-Brew Companion. יש ללחוץ על הכפתור הבא כדי לבחור סיסמה חדשה.',
    button: 'איפוס הסיסמה',
    securityLabel: 'למען אבטחת החשבון,',
    securityNotice: (expiresInMinutes) =>
      `הקישור יהיה בתוקף למשך ${expiresInMinutes} דקות וניתן להשתמש בו פעם אחת בלבד.`,
    ignoreNotice:
      'אם לא ביקשת לאפס את הסיסמה, אפשר להתעלם מההודעה. הסיסמה שלך תישאר ללא שינוי.',
    fallbackLink: 'הכפתור לא עובד? אפשר להעתיק ולהדביק את הקישור בדפדפן:',
    resetLinkLabel: 'איפוס הסיסמה',
    supportPrompt: 'צריך עזרה?',
    supportLink: 'צור איתנו קשר',
    footer: 'החליטה המושלמת. בכל יום מחדש.',
    signoff: '— Brew Companion',
  },
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const normalizeLocale = (locale) => (locale === 'he' ? 'he' : 'en')

const createPasswordResetEmail = ({
  resetUrl,
  username,
  expiresInMinutes = PASSWORD_RESET_EXPIRY_MINUTES,
  appUrl,
  locale = 'en',
}) => {
  const normalizedLocale = normalizeLocale(locale)
  const copy = emailCopy[normalizedLocale]
  const textAlign = copy.direction === 'rtl' ? 'right' : 'left'
  const safeResetUrl = escapeHtml(resetUrl)
  const safeUsername = escapeHtml(username)
  const safeAppUrl = escapeHtml(appUrl)

  const text = `${copy.greeting(username)}

${copy.instructions}

${copy.resetLinkLabel}: ${resetUrl}

${copy.securityLabel} ${copy.securityNotice(expiresInMinutes)}

${copy.ignoreNotice}

${copy.supportPrompt} ${appUrl}/contact

${copy.signoff}`

  const html = `<!doctype html>
<html lang="${normalizedLocale}" dir="${copy.direction}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>${copy.subject}</title>
    <style>
      @media screen and (max-width: 480px) {
        .email-shell {
          padding: 20px 10px !important;
        }

        .email-logo {
          padding: 14px 24px 8px !important;
        }

        .email-logo img {
          width: 143px !important;
          height: auto !important;
        }

        .email-content {
          padding: 4px 24px 28px !important;
        }

        .email-heading {
          margin-bottom: 14px !important;
          font-size: 24px !important;
          line-height: 30px !important;
        }

        .email-instructions {
          margin-bottom: 20px !important;
        }

        .email-button-row {
          padding-bottom: 20px !important;
        }

        .email-button {
          padding: 12px 20px !important;
          font-size: 15px !important;
        }

        .email-security {
          margin-bottom: 18px !important;
        }

        .email-security-cell {
          padding: 12px 14px !important;
        }

        .email-ignore {
          margin-bottom: 16px !important;
        }

        .email-footer {
          padding: 18px 24px !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f1ec; color: #332a24; direction: ${copy.direction}; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">
      ${copy.preheader(expiresInMinutes)}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" dir="${copy.direction}" style="width: 100%; background-color: #f5f1ec; direction: ${copy.direction};">
      <tr>
        <td align="center" class="email-shell" style="padding: 40px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style="width: 100%; max-width: 600px; background-color: #ffffff; border: 1px solid #e6ddd5; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(58, 50, 12, 0.08);">
            <tr>
              <td style="height: 6px; background-color: #ba8460; font-size: 0; line-height: 0;">&nbsp;</td>
            </tr>
            <tr>
              <td align="center" class="email-logo" bgcolor="#ffffff" style="padding: 26px 32px 14px; background-color: #ffffff;">
                <img src="cid:${logoCid}" width="163" height="76" alt="Brew Companion" style="display: block; width: 163px; max-width: 100%; height: auto; border: 0;">
              </td>
            </tr>
            <tr>
              <td class="email-content" style="padding: 6px 40px 40px; text-align: ${textAlign};">
                <h1 class="email-heading" style="margin: 0 0 18px; color: #332a24; font-size: 28px; line-height: 36px; text-align: center;">${copy.heading}</h1>
                <p style="margin: 0 0 14px; color: #4e443d; font-size: 16px; line-height: 25px;">${copy.greeting(safeUsername)}</p>
                <p class="email-instructions" style="margin: 0 0 26px; color: #4e443d; font-size: 16px; line-height: 25px;">${copy.instructions}</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" class="email-button-row" style="padding: 0 0 26px;">
                      <a href="${safeResetUrl}" class="email-button" style="display: inline-block; padding: 14px 26px; border-radius: 8px; background-color: #694227; color: #ffffff; font-size: 16px; font-weight: 700; line-height: 20px; text-decoration: none;">${copy.button}</a>
                    </td>
                  </tr>
                </table>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="email-security" style="margin-bottom: 24px; border-radius: 10px; background-color: #f8f4f0;">
                  <tr>
                    <td class="email-security-cell" style="padding: 15px 17px; color: #5d4a3c; font-size: 14px; line-height: 21px; text-align: ${textAlign};">
                      <strong style="color: #694227;">${copy.securityLabel}</strong> ${copy.securityNotice(expiresInMinutes)}
                    </td>
                  </tr>
                </table>
                <p class="email-ignore" style="margin: 0 0 20px; color: #6d625b; font-size: 14px; line-height: 22px;">${copy.ignoreNotice}</p>
                <p style="margin: 0 0 8px; color: #6d625b; font-size: 12px; line-height: 18px;">${copy.fallbackLink}</p>
                <p dir="ltr" style="margin: 0; font-size: 12px; line-height: 18px; text-align: left; word-break: break-all;"><a href="${safeResetUrl}" style="color: #694227; text-decoration: underline;">${safeResetUrl}</a></p>
              </td>
            </tr>
            <tr>
              <td align="center" class="email-footer" style="padding: 24px 32px; border-top: 1px solid #eee7e1; background-color: #fcfaf8; color: #6d625b; font-size: 12px; line-height: 19px; text-align: center;">
                ${copy.supportPrompt} <a href="${safeAppUrl}/contact" style="color: #694227; font-weight: 700; text-decoration: none;">${copy.supportLink}</a><br>
                ${copy.footer}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const attachments = [
    {
      filename: 'brew-companion-logo.png',
      path: logoPath,
      cid: logoCid,
    },
  ]

  return { subject: copy.subject, text, html, attachments }
}

export { createPasswordResetEmail }
