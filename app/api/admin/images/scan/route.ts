import { NextRequest, NextResponse } from 'next/server';
import { scanImages } from '@/lib/image-optimizer';

export async function GET(request: NextRequest) {
  try {
    const result = await scanImages();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error scanning images:', error);
    return NextResponse.json(
      { error: 'Failed to scan images' },
      { status: 500 }
    );
  }
}
