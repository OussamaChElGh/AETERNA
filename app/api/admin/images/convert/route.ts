import { NextRequest, NextResponse } from 'next/server';
import { convertMultipleToWebP, deleteOriginalPng } from '@/lib/image-optimizer';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paths, quality = 80, lossless = false, deleteOriginal = false } = body;

    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { error: 'paths array is required' },
        { status: 400 }
      );
    }

    // Convert relative paths to absolute paths
    const absolutePaths = paths.map((p: string) => {
      // Remove leading slash if present
      const cleanPath = p.startsWith('/') ? p.slice(1) : p;
      return path.join(process.cwd(), 'public', cleanPath);
    });

    // Validate all paths exist
    const fs = await import('fs');
    for (const absPath of absolutePaths) {
      if (!fs.existsSync(absPath)) {
        return NextResponse.json(
          { error: `File not found: ${absPath}` },
          { status: 404 }
        );
      }
    }

    // Convert images
    const results = await convertMultipleToWebP(absolutePaths, quality, lossless);

    // Delete originals if requested
    if (deleteOriginal) {
      for (const result of results) {
        if (result.success) {
          await deleteOriginalPng(result.originalPath);
        }
      }
    }

    // Calculate totals
    const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalWebp = results.reduce((sum, r) => sum + r.webpSize, 0);
    const totalSavings = totalOriginal - totalWebp;

    return NextResponse.json({
      success: true,
      converted: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      totalOriginal,
      totalWebp,
      totalSavings,
      savingsPercent: (totalSavings / totalOriginal) * 100,
      results,
    });
  } catch (error) {
    console.error('Error converting images:', error);
    return NextResponse.json(
      { error: 'Failed to convert images' },
      { status: 500 }
    );
  }
}
