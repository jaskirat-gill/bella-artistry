import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: Request) {
  try {
    // Expecting a JSON body with contact form fields: name, email, phone, and message
    const { name, email, phone, message } = await req.json();

    // Business details (configure via env variables as needed)
    const businessName = "Bella Artistry";
    const businessPhone = process.env.SEND_PHONE || "+1234567890";
    const businessEmail = process.env.SEND_EMAIL || "contact@bellaartistry.com";
    const businessAddress = "Surrey, BC, Canada";
    const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "";

    const msg = {
      to: businessEmail, // sending to ourselves
      from: {
        email: businessEmail, // must be a verified sender
        name: businessName,
      },
      subject: `New Contact Message from ${name}`,
      text: `You have received a new message from the contact form.

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}

-----------------------------
Business Details:
${businessName}
Phone: ${businessPhone}
Email: ${businessEmail}
Address: ${businessAddress}
Website: ${websiteUrl}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New Contact Message</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { margin: 0; padding: 0; background-color: #f8f8f8; width: 100% !important; }
  </style>
</head>
<body style="font-family: 'Inter', Arial, sans-serif; background-color: #f8f8f8; margin: 0; padding: 0;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#FDF2F8" style="padding: 30px 0;">
              <h1 style="margin: 0; color: #BE185D; font-size: 28px; font-weight: 700;">
                ${businessName}
              </h1>
            </td>
          </tr>
          <!-- Message Intro -->
          <tr>
            <td style="padding: 40px 30px 20px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #BE185D; font-size: 24px; font-weight: 700;">
                New Contact Message
              </h2>
              <p style="margin: 0 0 20px 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                You have received a new message from your website contact form.
              </p>
            </td>
          </tr>
          <!-- Contact Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FDF2F8; border-radius: 8px;">
                <tr>
                  <td style="padding: 25px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="150" style="color: #BE185D; font-size: 15px; font-weight: 600; padding-bottom: 15px;">
                          Name:
                        </td>
                        <td style="color: #4B5563; font-size: 15px; padding-bottom: 15px;">
                          ${name}
                        </td>
                      </tr>
                      <tr>
                        <td width="150" style="color: #BE185D; font-size: 15px; font-weight: 600; padding-bottom: 15px;">
                          Email:
                        </td>
                        <td style="color: #4B5563; font-size: 15px; padding-bottom: 15px;">
                          ${email}
                        </td>
                      </tr>
                      <tr>
                        <td width="150" style="color: #BE185D; font-size: 15px; font-weight: 600; padding-bottom: 15px;">
                          Phone:
                        </td>
                        <td style="color: #4B5563; font-size: 15px; padding-bottom: 15px;">
                          ${phone}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #BE185D; font-size: 15px; font-weight: 600; padding-top: 10px;">
                          Message:
                        </td>
                        <td style="color: #4B5563; font-size: 15px; padding-top: 10px;">
                          ${message}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer Note -->
          <tr>
            <td style="padding: 0 30px 30px 30px;" bgcolor="#FDF2F8">
              <p style="margin: 0; color: #9CA3AF; font-size: 14px; text-align: center;">
                This message was sent from the contact form on your website.
              </p>
            </td>
          </tr>
          <!-- Email Footer -->
          <tr>
            <td align="center" style="padding: 20px 0; color: #9CA3AF; font-size: 12px;">
              <p style="margin: 0;">
                © ${new Date().getFullYear()} ${businessName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    };

    await sgMail.send(msg);
    console.log("Contact form email sent!");

    return new Response(
      JSON.stringify({ message: "Contact form email sent!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error sending contact form email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error sending email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
