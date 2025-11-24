const nodemailer = require('nodemailer');

// Debug environment variables
console.log('📧 Email Configuration:');
console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '***configured***' : 'MISSING');

// Create transporter
const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
      }
});

// Send verification email with OTP
module.exports.sendVerificationEmail = async (user, otp) => {
      console.log('🔔 Attempting to send verification email...');
      console.log('User:', user.username, user.email);
      console.log('Gmail password configured:', !!process.env.GMAIL_APP_PASSWORD);

      const mailOptions = {
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: 'Verify Your Email - Wanderlust',
            html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                        <style>
                              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                              .header { background: linear-gradient(135deg, #fe424d 0%, #ff6b6b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                              .otp-box { background: white; border: 2px dashed #fe424d; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                              .otp-code { font-size: 32px; font-weight: bold; color: #fe424d; letter-spacing: 8px; }
                              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                              .button { display: inline-block; padding: 12px 30px; background: #fe424d; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
                        </style>
                  </head>
                  <body>
                        <div class="container">
                              <div class="header">
                                    <h1>🌍 Wanderlust</h1>
                                    <p>Email Verification</p>
                              </div>
                              <div class="content">
                                    <h2>Hi ${user.username}!</h2>
                                    <p>Welcome to Wanderlust! Please verify your email address to activate your account.</p>
                                    
                                    <div class="otp-box">
                                          <p style="margin: 0; font-size: 14px; color: #666;">Your verification code is:</p>
                                          <div class="otp-code">${otp}</div>
                                          <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This code will expire in 10 minutes</p>
                                    </div>
                                    
                                    <p>If you didn't create an account with Wanderlust, please ignore this email.</p>
                                    
                                    <div class="footer">
                                          <p>Best regards,<br><strong>Bharat Dixit</strong><br>Wanderlust Team</p>
                                          <p style="margin-top: 20px;">This is an automated email. Please do not reply.</p>
                                    </div>
                              </div>
                        </div>
                  </body>
                  </html>
            `
      };

      try {
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Verification email sent successfully!', info.messageId);
            return info;
      } catch (error) {
            console.error('❌ Error sending verification email:', error);
            throw error;
      }
};

// Send admin request email
module.exports.sendAdminRequestEmail = async (user, approvalLink) => {
      console.log('📧 Sending admin request email...');
      console.log('User:', user.username, user.email);
      console.log('Approval link:', approvalLink);

      const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER, // Send to admin
            subject: 'New Admin Access Request - Wanderlust',
            html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                        <style>
                              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                              .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
                              .content { background: #f9f9f9; padding: 20px; }
                              .button { display: inline-block; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
                        </style>
                  </head>
                  <body>
                        <div class="container">
                              <div class="header">
                                    <h2>Admin Access Request</h2>
                              </div>
                              <div class="content">
                                    <p>A new user has requested admin access:</p>
                                    <ul>
                                          <li><strong>Username:</strong> ${user.username}</li>
                                          <li><strong>Email:</strong> ${user.email}</li>
                                    </ul>
                                    <p>Click the button below to approve this request:</p>
                                    <a href="${approvalLink}" class="button">Approve Admin Access</a>
                                    <p style="margin-top: 20px;">Best regards,<br><strong>Bharat Dixit</strong></p>
                              </div>
                        </div>
                  </body>
                  </html>
            `
      };

      try {
            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Admin request email sent successfully!', info.messageId);
            return info;
      } catch (error) {
            console.error('❌ Error sending admin request email:', error);
            throw error;
      }
};
