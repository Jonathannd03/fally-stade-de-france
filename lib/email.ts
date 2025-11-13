import { Resend } from 'resend';

// Use placeholder value during build if env var is missing
const resendApiKey = process.env.RESEND_API_KEY || 'placeholder-resend-key';

if (resendApiKey === 'placeholder-resend-key') {
  console.warn('Missing RESEND_API_KEY. Email notifications will not work.');
}

const resend = new Resend(resendApiKey);

export async function sendAdminCreatedEmail(adminData: {
  username: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Fally Ipupa Admin <onboarding@resend.dev>', // Will be replaced with your domain
      to: ['ndingajonathan96@gmail.com'],
      subject: '🔔 New Admin User Created - Fally Ipupa SDF',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .info-box {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #f97316;
              }
              .info-row {
                display: flex;
                padding: 10px 0;
                border-bottom: 1px solid #f3f4f6;
              }
              .info-row:last-child {
                border-bottom: none;
              }
              .info-label {
                font-weight: 600;
                color: #6b7280;
                width: 120px;
              }
              .info-value {
                color: #111827;
                flex: 1;
              }
              .alert {
                background: #fef3c7;
                border: 1px solid #fbbf24;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #6b7280;
                font-size: 14px;
                border-top: 1px solid #e5e7eb;
              }
              .badge {
                display: inline-block;
                background: #10b981;
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎵 New Admin User Created</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Fally Ipupa - Stade de France 2026</p>
            </div>

            <div class="content">
              <p>Hello,</p>
              <p>A new admin user has been registered for the Fally Ipupa Setlist Voting system.</p>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #f97316;">Admin User Details</h3>

                <div class="info-row">
                  <span class="info-label">Username:</span>
                  <span class="info-value"><strong>${adminData.username}</strong></span>
                </div>

                <div class="info-row">
                  <span class="info-label">Full Name:</span>
                  <span class="info-value">${adminData.full_name || 'Not provided'}</span>
                </div>

                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${adminData.email || 'Not provided'}</span>
                </div>

                <div class="info-row">
                  <span class="info-label">Status:</span>
                  <span class="info-value"><span class="badge">Active</span></span>
                </div>

                <div class="info-row">
                  <span class="info-label">Created:</span>
                  <span class="info-value">${new Date(adminData.created_at).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                  })}</span>
                </div>
              </div>

              <div class="alert">
                <strong>⚠️ Security Notice</strong><br>
                If you did not create this admin user, please review your admin_users table immediately and disable any unauthorized accounts.
              </div>

              <p style="margin-top: 30px;">
                <strong>Quick Actions:</strong>
              </p>
              <ul>
                <li>View all admin users in your Supabase dashboard</li>
                <li>Check recent login activity</li>
                <li>Review security logs</li>
              </ul>
            </div>

            <div class="footer">
              <p>This is an automated notification from your Fally Ipupa Admin System</p>
              <p style="font-size: 12px; color: #9ca3af;">
                Fally Ipupa - L'Aigle • The Eagle<br>
                Stade de France 2026
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send admin created email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending admin created email:', error);
    return { success: false, error };
  }
}
