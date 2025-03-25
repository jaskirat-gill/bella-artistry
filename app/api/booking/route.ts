import sgMail from "@sendgrid/mail";
import { formatDate, formatTimeTo12Hour } from "@/lib/utils";

// Set your SendGrid API Key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: Request) {
  try {
    // Expecting a JSON body with bookingData, artist, and service
    const { bookingData, artist, service } = await req.json();

    // Format the date for better readability
    const formattedDate = formatDate(bookingData.date);

    // Ensure you have an email to send the confirmation to
    const recipientEmail = bookingData.email || process.env.SEND_EMAIL;

    // Business details
    const businessName = "Bella Artistry";
    const businessPhone = process.env.SEND_PHONE || "+1234567890";
    const businessEmail = process.env.SEND_EMAIL || "contact@bellaartistry.com";
    const businessAddress = "Surrey, BC, Canada";
    const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "";

    // Compose the email message with styled HTML
    const msg = {
      to: recipientEmail,
      from: {
        email: process.env.SEND_EMAIL || "",
        name: businessName,
      },
      subject: `Booking Confirmation - ${service?.title}`,
      text: `Thank you for your booking, ${bookingData.firstName}!

Here are your booking details:
Artist: ${artist?.name}
Service: ${service?.title}
Date: ${formattedDate}
Time: ${bookingData.time}
Price: $${service?.price.toFixed(2)}

If you need to make changes, please reach out to us at ${businessPhone} or ${businessEmail}.`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Booking Confirmation</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    div[style*="margin: 16px 0;"] { margin: 0 !important; }
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .responsive-table { width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-center { text-align: center !important; }
      .logo { max-width: 120px !important; height: auto !important; }
    }
  </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #f8f8f8; font-family: 'Inter', Arial, sans-serif;">
  <!-- Main Container -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f8f8;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <!-- Email Container -->
        <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#FDF2F8" style="padding: 30px 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; color: #BE185D; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      ${businessName}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Booking Confirmation -->
          <tr>
            <td style="padding: 40px 30px 20px 30px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 20px 0; color: #BE185D; font-size: 24px; font-weight: 700;">
                      Booking Confirmation
                    </h2>
                    <p style="margin: 0 0 20px 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                      Hello ${bookingData.firstName},
                    </p>
                    <p style="margin: 0 0 30px 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                      Thank you for booking with us! Your appointment has been confirmed. Here are your booking details:
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Booking Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FDF2F8; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 25px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="150" style="color: #BE185D; font-size: 15px; font-weight: 600; padding-bottom: 15px;">
                          Service:
                        </td>
                        <td style="color: #4B5563; font-size: 15px; padding-bottom: 15px;">
                          ${service?.title}
                        </td>
                      </tr>
                      <tr>
                        <td width="150" style="color: #BE185D; font-size: 15px; font-weight: 600; padding-bottom: 15px;">
                          Artist:
                        </td>
                        <td style="color: #4B5563; font-size: 15px; padding-bottom: 15px;">
                          ${artist?.name}
                        </td>
                      </tr>
                      <tr>
                        <td width="150" style="color: #BE185D; font-size: 15px; font-weight: 600; padding-bottom: 15px;">
                          Date:
                        </td>
                        <td style="color: #4B5563; font-size: 15px; padding-bottom: 15px;">
                          ${formattedDate}
                        </td>
                      </tr>
                      <tr>
                        <td width="150" style="color: #BE185D; font-size: 15px; font-weight: 600; padding-bottom: 15px;">
                          Time:
                        </td>
                        <td style="color: #4B5563; font-size: 15px; padding-bottom: 15px;">
                          ${formatTimeTo12Hour(bookingData.time)}
                        </td>
                      </tr>
                      <tr>
                        <td width="150" style="color: #BE185D; font-size: 15px; font-weight: 600;">
                          Price:
                        </td>
                        <td style="color: #4B5563; font-size: 15px; font-weight: 600;">
                          $${service?.price.toFixed(2)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Notes Section -->
          ${
            bookingData.notes
              ? `
          <tr>
            <td style="padding: 0 30px 30px 30px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 15px 0; color: #BE185D; font-size: 18px; font-weight: 600;">
                      Your Notes:
                    </h3>
                    <p style="margin: 0; color: #4B5563; font-size: 15px; line-height: 24px; background-color: #F9FAFB; padding: 15px; border-radius: 6px; border-left: 3px solid #EC4899;">
                      ${bookingData.notes}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- Call to Action -->
          <tr>
            <td style="padding: 0 30px 40px 30px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 20px 0; color: #4B5563; font-size: 16px; line-height: 24px;">
                      Need to make changes to your booking?
                    </p>
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#EC4899" style="border-radius: 6px;">
                          <a href="${websiteUrl}/contact" target="_blank" style="display: inline-block; padding: 14px 30px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 6px;">
                            Contact Us
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="border-bottom: 1px solid #F3F4F6; font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px;" class="mobile-padding" bgcolor="#FDF2F8">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="color: #BE185D; font-size: 16px; font-weight: 600; margin-bottom: 10px;">
                    ${businessName}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 10px 0; color: #9CA3AF; font-size: 14px; line-height: 20px;">
                    ${businessAddress}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 20px; color: #9CA3AF; font-size: 14px; line-height: 20px;">
                    Phone: ${businessPhone} | Email: ${businessEmail}
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <a href="${websiteUrl}" target="_blank" style="color: #EC4899; font-size: 14px; text-decoration: none;">
                            Visit Our Website
                          </a>
                        </td>
                        <td style="font-size: 14px; color: #9CA3AF; padding: 0 10px;">|</td>
                        <td>
                          <a href="${websiteUrl}/book-now" target="_blank" style="color: #EC4899; font-size: 14px; text-decoration: none;">
                            Book Again
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Email Footer -->
        <table border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
            <td align="center" style="padding: 20px 0; color: #9CA3AF; font-size: 12px; line-height: 18px;">
              <p style="margin: 0;">
                This email was sent to ${bookingData.email}.<br>
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
    // Send the email using SendGrid
    await sgMail.send(msg);

    return new Response(
      JSON.stringify({ message: "Confirmation email sent!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error sending confirmation email:", error);
    const errorMessage = error instanceof Error ? error.message : "Error sending email";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
