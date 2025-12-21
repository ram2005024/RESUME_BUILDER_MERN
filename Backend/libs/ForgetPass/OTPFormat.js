export const OTPEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume Builder - Verify Your Email</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                padding: 20px;
                min-height: 100vh;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
            }
            
            .email-wrapper {
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
                padding: 50px 30px;
                text-align: center;
            }
            
            .logo {
                font-size: 32px;
                font-weight: 800;
                color: white;
                margin-bottom: 8px;
                letter-spacing: -1px;
            }
            
            .logo-accent {
                color: #3b82f6;
            }
            
            .tagline {
                color: #9ca3af;
                font-size: 12px;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                font-weight: 600;
                margin-top: 12px;
            }
            
            .content {
                padding: 50px 40px;
                text-align: center;
            }
            
            .greeting {
                font-size: 24px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 20px;
            }
            
            .description {
                color: #6b7280;
                font-size: 15px;
                line-height: 1.6;
                margin-bottom: 40px;
            }
            
            .otp-section {
                background: linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%);
                border: 2px solid #e0e7ff;
                border-radius: 12px;
                padding: 35px;
                margin-bottom: 30px;
            }
            
            .otp-label {
                color: #6b7280;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 600;
                margin-bottom: 15px;
                display: block;
            }
            
            .otp-box {
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 10px;
                padding: 20px;
                font-size: 42px;
                font-weight: 800;
                color: #3b82f6;
                letter-spacing: 12px;
                text-align: center;
                font-family: 'Courier New', monospace;
                word-spacing: 10px;
            }
            
            .validity {
                color: #9ca3af;
                font-size: 13px;
                margin-top: 15px;
            }
            
            .validity-strong {
                color: #ef4444;
                font-weight: 600;
            }
            
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                padding: 14px 40px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 15px;
                margin-bottom: 30px;
                transition: transform 0.3s ease;
            }
            
            .cta-button:hover {
                transform: translateY(-2px);
            }
            
            .footer {
                background: #f9fafb;
                padding: 30px 40px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
            }
            
            .footer-text {
                color: #6b7280;
                font-size: 13px;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            
            .footer-link {
                color: #3b82f6;
                text-decoration: none;
                font-weight: 600;
            }
            
            .divider {
                background: #e5e7eb;
                height: 1px;
                margin: 25px 0;
            }
            
            .company-info {
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
                border-radius: 10px;
                padding: 20px;
                margin-top: 20px;
            }
            
            .company-name {
                font-size: 16px;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 5px;
            }
            
            .company-detail {
                color: #9ca3af;
                font-size: 12px;
            }
            
            .developer-credit {
                color: #d1d5db;
                font-size: 11px;
                margin-top: 15px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="email-wrapper">
                <!-- Header -->
                <div class="header">
                    <div class="logo">Resume<span class="logo-accent">Builder</span></div>
                    <div class="tagline">by Cyrus</div>
                </div>
                
                <!-- Content -->
                <div class="content">
                    <div class="greeting">Welcome Back! 👋</div>
                    <div class="description">
                        Your email verification code is ready. Enter this code to secure your Resume Builder account and get started with creating your perfect resume.
                    </div>
                    
                    <!-- OTP Section -->
                    <div class="otp-section">
                        <label class="otp-label">Your Verification Code</label>
                        <div class="otp-box">${otp}</div>
                        <div class="validity">
                            Valid for <span class="validity-strong">10 minutes</span>
                        </div>
                    </div>
                    
                    
                    
                    <div class="footer-text">
                        If you didn't request this code, please ignore this email. Your account remains secure.
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                    <div class="company-info">
                        <div class="company-name">🚀 Cyrus</div>
                        <div class="company-detail">Professional Resume Building Platform</div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="footer-text">
                        Need help? <a href="#" class="footer-link">Contact Support</a> | 
                        <a href="#" class="footer-link">Privacy Policy</a> | 
                        <a href="#" class="footer-link">Terms of Service</a>
                    </div>
                    
                    <div class="developer-credit">
                        Developed with ❤️ by Ram | © 2024 Cyrus. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};
