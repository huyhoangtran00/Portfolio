import sendgrid
from sendgrid.helpers.mail import Mail, Email, To
from config import settings

async def send_email(to_email: str, subject: str, html_content: str):
    try:
        if not settings.EMAIL_SERVICE_API_KEY:
            print("EMAIL_SERVICE_API_KEY not set. Skipping email sending.")
            return False

        sg = sendgrid.SendGridAPIClient(settings.EMAIL_SERVICE_API_KEY)
        from_email = Email(settings.SENDER_EMAIL)
        to_email_obj = To(to_email)
        message = Mail(from_email, to_email_obj, subject, html_content)
        response = sg.client.mail.send.post(request_body=message.get())
        print(f"Email sent to {to_email}. Status Code: {response.status_code}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False