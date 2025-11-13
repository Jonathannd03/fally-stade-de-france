# Email Notifications Setup Guide

This guide will help you set up email notifications for admin user registration using Resend.

## Overview

When a new admin user is created, an email notification is automatically sent to **ndingajonathan96@gmail.com** with:
- Username
- Full name
- Email address
- Creation timestamp
- Security alert

---

## Step 1: Create a Resend Account

1. Go to https://resend.com
2. Click **"Sign Up"** (it's free for up to 3,000 emails/month)
3. Sign up with your email or GitHub
4. Verify your email address

---

## Step 2: Get Your API Key

1. In the Resend Dashboard, go to **API Keys**
2. Click **"Create API Key"**
3. Give it a name like "Fally Ipupa Admin"
4. Choose permission: **"Sending access"**
5. Click **"Create"**
6. **Copy the API key** (you'll only see it once!)

---

## Step 3: Add API Key to Environment Variables

Add this to your `.env.local` file:

```env
# Existing variables...
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_SETUP_KEY=your-setup-key

# NEW: Add Resend API Key
RESEND_API_KEY=re_123456789_YourActualAPIKeyHere
```

---

## Step 4: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C)
# Then start again
npm run dev
```

---

## Step 5: Test Email Notifications

### Option A: Using the Secret Registration Form (Easiest)

1. Navigate to: **`http://localhost:3000/admin/secret-register-2026`**
2. Fill in the form:
   - **Username**: `testadmin`
   - **Full Name**: `Test Administrator`
   - **Email**: `test@example.com`
   - **Password**: `TestPassword123!`
   - **Confirm Password**: `TestPassword123!`
   - **Setup Key**: (paste your `ADMIN_SETUP_KEY` from `.env.local`)
3. Click **"Create Admin User"**
4. Check **ndingajonathan96@gmail.com** for the notification email!

### Option B: Using the API (Advanced)

```javascript
fetch('/api/admin/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testadmin2',
    password: 'SecurePass123!',
    email: 'test2@example.com',
    full_name: 'Test Admin 2',
    setup_key: 'your-setup-key-from-env'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## What the Email Looks Like

The notification email includes:

### Email Header
```
Subject: 🔔 New Admin User Created - Fally Ipupa SDF
From: Fally Ipupa Admin <onboarding@resend.dev>
To: ndingajonathan96@gmail.com
```

### Email Content
- **Username**: Shows the new admin username
- **Full Name**: Shows the full name (or "Not provided")
- **Email**: Shows the email (or "Not provided")
- **Status**: Shows "Active" badge
- **Created**: Shows timestamp with timezone
- **Security Alert**: Warning to review if unauthorized

---

## Important Notes

### Development vs Production

**Development (current setup):**
- Uses Resend's test email: `onboarding@resend.dev`
- Works immediately, no domain setup needed
- Emails may go to spam

**Production (when deploying):**
- You should verify your own domain
- Update `lib/email.ts` line 9:
  ```typescript
  from: 'Admin Alerts <admin@yourdomain.com>',
  ```
- Follow Resend's domain verification guide

---

## Customizing the Email Recipient

To change who receives the notifications:

1. Open `lib/email.ts`
2. Find line 10:
   ```typescript
   to: ['ndingajonathan96@gmail.com'],
   ```
3. Change to your desired email(s):
   ```typescript
   to: ['youremail@example.com'],
   // or multiple recipients:
   to: ['admin1@example.com', 'admin2@example.com'],
   ```

---

## Troubleshooting

### Error: "Missing Resend API key"

**Solution:** Make sure `RESEND_API_KEY` is in `.env.local` and restart your dev server.

---

### Email not received

**Check:**
1. Spam folder
2. Resend dashboard → Logs → Check if email was sent
3. Verify API key is correct
4. Check console for errors

---

### Email sent but looks broken

- The email is HTML formatted
- Some email clients may display it differently
- Gmail, Outlook, and Apple Mail should display it correctly

---

### Error: "Failed to send email notification"

**This won't stop admin creation!**
- The admin user is still created successfully
- Only the notification fails
- Check the console for the specific error
- Verify your Resend API key

---

## Security Best Practices

### Protect the Registration URL

1. **Keep it secret**: Don't share `/admin/secret-register-2026`
2. **Change the URL**: Rename the folder to something harder to guess
   ```
   app/[locale]/admin/secret-register-2026/
   →
   app/[locale]/admin/your-secret-path-12345/
   ```

3. **Delete after setup**: Once you've created all admins, you can delete the registration page entirely

---

### Monitor Email Notifications

- Always check your email when you get a notification
- If you didn't create an admin user, check your database immediately
- Consider setting up email alerts on your phone

---

## Advanced: Custom Email Templates

To customize the email design, edit `lib/email.ts`:

```typescript
export async function sendAdminCreatedEmail(adminData) {
  // ... your custom HTML template here
}
```

The email uses:
- Inline CSS for compatibility
- Responsive design
- Gradient headers (orange to red)
- Security alert box

---

## Secret Registration Page Features

**URL:** `/admin/secret-register-2026`

### Features:
✅ Beautiful, responsive form
✅ Password confirmation
✅ Real-time validation
✅ Success/error messages
✅ Auto-redirect to login after success
✅ Setup key protection
✅ Loading states
✅ Dark mode support

### Fields:
- **Username** (required)
- **Full Name** (optional)
- **Email** (optional)
- **Password** (required, min 8 chars)
- **Confirm Password** (required)
- **Setup Key** (required - from .env.local)

---

## Resend Pricing (as of 2024)

**Free Tier:**
- 3,000 emails/month
- Perfect for small admin teams
- No credit card required

**Paid Plans:** Start at $20/month for 50,000 emails

For a small admin team, the free tier is more than enough!

---

## Next Steps

Once everything is working:

1. ✅ Create your admin users via the secret form
2. ✅ Verify emails are being sent
3. ✅ Test login with your new credentials
4. 🔒 Consider deleting the registration page after setup
5. 📧 Monitor notifications for unauthorized access

You're all set! 🎉
