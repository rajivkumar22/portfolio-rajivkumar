// Quick email test script
const fetch = require('node-fetch');

async function testEmail() {
  try {
    console.log('🧪 Testing email system...');
    
    const response = await fetch('http://localhost:5000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Portfolio Email Test',
        message: 'This is a test message to verify that your portfolio email system is working correctly. If you receive this, the system is functioning properly!'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Email test SUCCESSFUL!');
      console.log('📧 Message ID:', result.messageId);
      console.log('📨 Check your email at kumarrajiv12945@gmail.com');
    } else {
      console.log('❌ Email test FAILED:');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.log('💥 Test failed with error:', error.message);
  }
}

testEmail();