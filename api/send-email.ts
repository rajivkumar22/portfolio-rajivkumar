import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required fields" 
      });
    }

    // Log the submission
    console.log('📧 Vercel Contact Form Submission:');
    console.log('='.repeat(50));
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`Gmail User: ${process.env.GMAIL_USER ? 'SET' : 'NOT SET'}`);
    console.log(`Gmail Password: ${process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT SET'}`);
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('='.repeat(50));

    // Validate Gmail configuration
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.log('❌ Gmail App Password not configured on Vercel');
      return res.status(500).json({ 
        success: false, 
        error: "Email service not configured. Please add GMAIL_APP_PASSWORD to Vercel environment variables." 
      });
    }

    // Create Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'kumarrajiv12945@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: '"Rajiv Kumar Portfolio" <kumarrajiv12945@gmail.com>',
      to: 'kumarrajiv12945@gmail.com',
      replyTo: email,
      subject: `🔔 New Portfolio Message: ${subject} - from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">
            New Portfolio Contact Message
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Contact Information:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 2px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #f0f9ff; border-left: 4px solid #8b5cf6;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              📧 This message was sent from your portfolio website contact form via Vercel.<br>
              💬 Reply directly to this email to respond to <strong>${name}</strong> at ${email}
            </p>
          </div>
        </div>
      `,
    };

    // Send email
    console.log('📤 Attempting to send email via Gmail SMTP on Vercel...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully from Vercel!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Accepted: ${info.accepted?.length || 0} recipients`);
    console.log(`   Rejected: ${info.rejected?.length || 0} recipients`);
    
    res.status(200).json({ 
      success: true, 
      messageId: info.messageId,
      message: `Email sent successfully to kumarrajiv12945@gmail.com via Vercel`,
      details: {
        accepted: info.accepted?.length || 0,
        rejected: info.rejected?.length || 0,
        platform: 'vercel'
      }
    });
  } catch (error) {
    console.error("❌ Vercel email sending failed:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to send email: " + (error instanceof Error ? error.message : 'Unknown error'),
      platform: 'vercel'
    });
  }
}