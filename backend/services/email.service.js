const nodemailer = require('nodemailer');

/**
 * Email service configuration
 */
let transporter = null;

// Only create transporter if email credentials are configured
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_USER !== 'demo@example.com') {
  try {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    console.log('✅ Email service configured');
  } catch (error) {
    console.warn('⚠️  Email service configuration failed:', error.message);
  }
} else {
  console.warn('⚠️  Email service not configured (using demo mode)');
}

/**
 * Send OTP email
 */
const sendOTP = async (email, otp, fullName = 'User') => {
  if (!transporter) {
    console.warn('⚠️  Email not sent - service not configured. OTP:', otp);
    return { success: true, message: 'Email service not configured (demo mode)' };
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Creator Control Hub" <noreply@creatorhub.com>',
    to: email,
    subject: 'Your OTP Code - Creator Control Hub',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .content {
            padding: 40px;
            text-align: center;
          }
          .otp-box {
            background: #f8f9fa;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #667eea;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Creator Control Hub</h1>
          </div>
          <div class="content">
            <h2>Hello ${fullName}!</h2>
            <p>Your one-time password (OTP) for authentication is:</p>
            <div class="otp-box">${otp}</div>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2026 Creator Control Hub. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (email, fullName) => {
  if (!transporter) {
    console.warn('⚠️  Welcome email not sent - service not configured');
    return { success: true, message: 'Email service not configured' };
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Creator Control Hub" <noreply@creatorhub.com>',
    to: email,
    subject: 'Welcome to Creator Control Hub! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
          .content { padding: 40px; }
          .feature { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Welcome to Creator Control Hub!</h1>
          </div>
          <div class="content">
            <h2>Hi ${fullName},</h2>
            <p>Thank you for joining Creator Control Hub - your all-in-one platform for:</p>
            <div class="feature">📱 <strong>Social Media Management</strong> - Multi-platform scheduling & analytics</div>
            <div class="feature">🎬 <strong>YouTube Studio</strong> - Complete video workflow</div>
            <div class="feature">✅ <strong>Productivity System</strong> - Tasks, habits & focus mode</div>
            <div class="feature">📊 <strong>Project Management</strong> - Track all your projects</div>
            <div class="feature">🤖 <strong>AI Copilot</strong> - Smart content generation</div>
            <p>Ready to take control of your creator journey? Log in and start exploring!</p>
            <p>Best regards,<br>The Creator Control Hub Team</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Welcome email failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send notification email
 */
const sendNotificationEmail = async (email, title, message, actionUrl = null) => {
  if (!transporter) {
    console.warn('⚠️  Notification email not sent - service not configured');
    return { success: true, message: 'Email service not configured' };
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Creator Control Hub" <noreply@creatorhub.com>',
    to: email,
    subject: title,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px;">
          <h2>${title}</h2>
          <p>${message}</p>
          ${actionUrl ? `<a href="${actionUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Take Action</a>` : ''}
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Notification email failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTP,
  sendWelcomeEmail,
  sendNotificationEmail
};
