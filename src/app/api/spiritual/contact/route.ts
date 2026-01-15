import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  honeypot: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const data = contactSchema.parse(body);

    // Honeypot check
    if (data.honeypot) {
      // Likely a bot - return success to avoid revealing honeypot
      return NextResponse.json({ success: true });
    }

    // Here you would typically:
    // 1. Send an email notification
    // 2. Save to database
    // 3. Send to CRM

    // TODO: Implement email sending logic
    // Example with nodemailer or a service like SendGrid

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will contact you soon.',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

