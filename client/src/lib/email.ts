interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendEmail(formData: ContactFormData): Promise<{ success: boolean; method: string }> {
  try {
    console.log('Sending email directly to kumarrajiv12945@gmail.com...');
    
    // Send email directly via our server
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('Email sent successfully via server');
      return { success: true, method: 'direct' };
    } else {
      console.error('Server email failed:', result.error);
      throw new Error(result.error || 'Server email failed');
    }
  } catch (error) {
    console.error('Direct email failed:', error);
    
    // Fallback: Log the message and show user instructions
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      return { success: false, method: 'logged' };
    } catch (logError) {
      console.error('Logging also failed:', logError);
      return { success: false, method: 'failed' };
    }
  }
}
