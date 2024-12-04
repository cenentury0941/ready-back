import { SESIntegration } from "@/integrations/sesIntegration";

export class EmailService {
  private sesIntegration: SESIntegration;

  constructor() {
    this.sesIntegration = new SESIntegration();
  }

  public async sendApprovalEmail(
    recipientEmail: string,
    userName: string = "User",
    bookName: string = "Book"
  ) {

    const emailParams = {
      Source: "notifications@ready.presidio.com",
      Destination: {
        ToAddresses: [recipientEmail],
      },
      Message: {
        Subject: {
          Data: "Book Approval Req - reg",
        },
        Body: {
          Html: {
            Data: `
              <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <h2>Book Approval Request</h2>
                  <p>${userName} has recommended a book named "${bookName}". Please click on the button below to review and approve the request.</p>
                  <a href="http://localhost:8080/admin/approvals" 
                     style="display: inline-block; padding: 10px 20px; margin-top: 10px; color: white; text-decoration: none; background-color: #007BFF; border-radius: 5px;">
                    Take Me to Request
                  </a>
                  <p>Thank you.</p>
                </body>
              </html>
            `,
          },
          Text: {
            Data: `User has uploaded a book, and the request is pending. Please visit: http://localhost:8080/admin/approvals`,
          },
        },
      },
    };

    const response = await this.sesIntegration.sendEmail(emailParams);

    return response;
  }
}
