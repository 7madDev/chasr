import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Chasr <noreply@announcify.app>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://open.announcify.app";

export async function sendConfirmationEmail(
  to: string,
  goalSlug: string,
  productName: string
) {
  const goalUrl = `${APP_URL}/goals/${goalSlug}`;
  const dashboardUrl = `${APP_URL}/dashboard`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your goal for ${productName} is live! 🚀`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
        <h1 style="font-size: 20px; font-weight: 600; color: #111; margin-bottom: 16px;">Your goal is live!</h1>
        <p style="color: #444; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          You just publicly committed to a revenue goal for <strong>${productName}</strong>. That takes guts. Now go make it happen.
        </p>
        <div style="margin-bottom: 24px;">
          <a href="${goalUrl}" style="display: inline-block; background: #F59E0B; color: #fff; font-weight: 600; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px;">
            View your public page →
          </a>
        </div>
        <p style="color: #666; font-size: 13px; line-height: 1.5;">
          Update your progress anytime from your <a href="${dashboardUrl}" style="color: #F59E0B; text-decoration: underline;">dashboard</a>.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;" />
        <p style="color: #999; font-size: 12px;">
          Powered by <a href="https://announcify.app" style="color: #999; text-decoration: underline;">Announcify</a>
        </p>
      </div>
    `,
  });
}

export async function sendReminderEmail(
  to: string,
  productName: string
) {
  const dashboardUrl = `${APP_URL}/dashboard`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `How's ${productName} doing? 📊`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
        <h1 style="font-size: 20px; font-weight: 600; color: #111; margin-bottom: 16px;">Time for an update?</h1>
        <p style="color: #444; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          It's been a week since you updated <strong>${productName}</strong>'s goal — how's it going? Even small progress counts.
        </p>
        <div style="margin-bottom: 24px;">
          <a href="${dashboardUrl}" style="display: inline-block; background: #F59E0B; color: #fff; font-weight: 600; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px;">
            Update your progress →
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;" />
        <p style="color: #999; font-size: 12px;">
          Powered by <a href="https://announcify.app" style="color: #999; text-decoration: underline;">Announcify</a>
        </p>
      </div>
    `,
  });
}

export async function sendMilestoneEmail(
  to: string,
  productName: string,
  goalSlug: string
) {
  const goalUrl = `${APP_URL}/goals/${goalSlug}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `🎉 You hit your goal for ${productName}!`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #111; margin-bottom: 16px;">🎉 You did it!</h1>
        <p style="color: #444; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          <strong>${productName}</strong> just hit its revenue goal. You publicly committed to it and you followed through. That's rare.
        </p>
        <div style="margin-bottom: 24px;">
          <a href="${goalUrl}" style="display: inline-block; background: #F59E0B; color: #fff; font-weight: 600; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px;">
            Share your win →
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;" />
        <p style="color: #999; font-size: 12px;">
          Powered by <a href="https://announcify.app" style="color: #999; text-decoration: underline;">Announcify</a>
        </p>
      </div>
    `,
  });
}
