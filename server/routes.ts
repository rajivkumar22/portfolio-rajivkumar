import type { Express } from "express";
import { createServer, type Server } from "http";
import nodemailer from "nodemailer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Direct email sending endpoint
  app.post("/api/send-email", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing required fields" 
        });
      }

      // Log the submission
      console.log('📧 New Contact Form Submission:');
      console.log('='.repeat(50));
      console.log(`Time: ${new Date().toISOString()}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Gmail User: ${process.env.GMAIL_USER ? 'SET' : 'NOT SET'}`);
      console.log(`Gmail Password: ${process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT SET'}`);
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log('='.repeat(50));

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
                📧 This message was sent from your portfolio website contact form.<br>
                💬 Reply directly to this email to respond to <strong>${name}</strong> at ${email}
              </p>
            </div>
          </div>
        `,
      };

      // Validate Gmail configuration
      if (!process.env.GMAIL_APP_PASSWORD) {
        console.log('❌ Gmail App Password not configured');
        console.log('Environment variables check:');
        console.log(`- GMAIL_USER: ${process.env.GMAIL_USER ? 'SET' : 'NOT SET'}`);
        console.log(`- GMAIL_APP_PASSWORD: ${process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT SET'}`);
        console.log('🚨 For Vercel: Add environment variables in Vercel dashboard');
        return res.status(500).json({ 
          success: false, 
          error: "Gmail App Password not configured. Please add GMAIL_APP_PASSWORD to environment variables." 
        });
      }

      // Send email
      console.log('📤 Attempting to send email via Gmail SMTP...');
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully!');
      console.log(`   Message ID: ${info.messageId}`);
      console.log(`   Accepted: ${info.accepted?.length || 0} recipients`);
      console.log(`   Rejected: ${info.rejected?.length || 0} recipients`);
      
      res.json({ 
        success: true, 
        messageId: info.messageId,
        message: `Email sent successfully to kumarrajiv12945@gmail.com`,
        details: {
          accepted: info.accepted?.length || 0,
          rejected: info.rejected?.length || 0
        }
      });
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to send email: " + (error instanceof Error ? error.message : 'Unknown error')
      });
    }
  });

  // Simple contact logging endpoint (backup)
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      console.log('📝 Contact form logged (backup):');
      console.log(`From: ${name} (${email})`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);

      res.json({ 
        success: true, 
        message: "Contact form logged successfully"
      });
    } catch (error) {
      console.error("Contact logging error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to log contact form" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
