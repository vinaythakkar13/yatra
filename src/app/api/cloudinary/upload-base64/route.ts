import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';

const uploadSchema = z.object({
  base64Image: z.string().min(1, 'Base64 image is required'),
  folder: z.string().optional(),
  public_id: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

interface CloudinaryUploadResponse {
  success: boolean;
  data?: {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
  };
  message?: string;
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const data = uploadSchema.parse(body);

    // Extract Cloudinary credentials from environment variables
    const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
    const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
      console.error('Cloudinary credentials not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'Cloudinary configuration missing',
        },
        { status: 500 }
      );
    }

    // Prepare upload parameters
    const uploadParams: Record<string, any> = {
      file: data.base64Image,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'unsigned',
    };

    // Add optional parameters
    if (data.folder) {
      uploadParams.folder = data.folder;
    }
    if (data.public_id) {
      uploadParams.public_id = data.public_id;
    }
    if (data.tags && data.tags.length > 0) {
      uploadParams.tags = data.tags.join(',');
    }

    // Build form data for Cloudinary API
    const formData = new URLSearchParams();
    Object.entries(uploadParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;
    
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Cloudinary upload error:', errorData);
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to upload image to Cloudinary',
        },
        { status: response.status }
      );
    }

    const cloudinaryResult = await response.json();

    // Return success response with image data
    return NextResponse.json({
      success: true,
      data: {
        secure_url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
        format: cloudinaryResult.format,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        bytes: cloudinaryResult.bytes,
      },
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: error.errors.map((e) => e.message).join(', '),
        },
        { status: 400 }
      );
    }

    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

