import logging

import resend

from app.core.config import settings

logger = logging.getLogger(__name__)

resend.api_key = settings.RESEND_API_KEY


def send_password_reset_email(to_email: str, reset_link: str) -> None:
    """Sends the reset-password email via Resend. Failures are logged, not
    raised — the forgot-password endpoint always returns a generic success
    response regardless of whether the email actually goes out, so we don't
    leak whether an account exists and a bad email provider config doesn't
    surface a 500 to the user."""
    if not settings.RESEND_API_KEY:
        logger.warning(
            "RESEND_API_KEY not set — skipping email send. Reset link: %s", reset_link
        )
        return

    try:
        resend.Emails.send(
            {
                "from": settings.RESEND_FROM_EMAIL,
                "to": to_email,
                "subject": "Reset your VerifiNews password",
                "html": f"""
                    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 24px;">
                      <p style="font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #c2410c; font-weight: bold;">
                        Members Desk
                      </p>
                      <h2 style="font-size: 22px; margin: 8px 0 16px;">Reset your password</h2>
                      <p style="font-size: 14px; color: #444; line-height: 1.5;">
                        We received a request to reset your VerifiNews password. This link
                        expires in {settings.PASSWORD_RESET_EXPIRE_MINUTES} minutes.
                      </p>
                      <a href="{reset_link}"
                         style="display: inline-block; margin-top: 16px; padding: 12px 24px;
                                background: #c2410c; color: #fff; text-decoration: none;
                                border-radius: 8px; font-size: 14px;">
                        Reset Password
                      </a>
                      <p style="font-size: 12px; color: #888; margin-top: 24px;">
                        If you didn't request this, you can safely ignore this email.
                      </p>
                    </div>
                """,
            }
        )
    except Exception:
        logger.exception("Failed to send password reset email to %s", to_email)