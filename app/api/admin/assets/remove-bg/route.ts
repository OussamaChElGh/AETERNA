import { NextRequest, NextResponse } from 'next/server';
import { removeImageBackground } from '@/lib/removeBackground';
import fs from 'fs';
import path from 'path';

const ASSETS_FILE = path.join(process.cwd(), 'data', 'assets.json');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, assetId } = body;

    if (!imageUrl || !assetId) {
      return NextResponse.json(
        { error: 'imageUrl y assetId son requeridos' },
        { status: 400 }
      );
    }

    const urlPath = imageUrl.startsWith('/')
      ? imageUrl
      : `/${imageUrl}`;

    const fullPath = path.join(process.cwd(), 'public', urlPath);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: `Imagen no encontrada: ${fullPath}` },
        { status: 404 }
      );
    }

    const inputBuffer = fs.readFileSync(fullPath);
    const { buffer, removedPercent } = await removeImageBackground(inputBuffer);

    fs.writeFileSync(fullPath, buffer);

    let assetUpdated = false;
    try {
      const raw = await fs.promises.readFile(ASSETS_FILE, 'utf-8');
      const assets = JSON.parse(raw);
      const index = assets.assets.findIndex((a: any) => a.id === assetId);
      if (index !== -1) {
        assets.assets[index].updatedAt = Date.now();
        await fs.promises.writeFile(ASSETS_FILE, JSON.stringify(assets, null, 2));
        assetUpdated = true;
      }
    } catch {
      // non-fatal
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      removedPercent,
      assetUpdated,
      message: `Fondo eliminado (${removedPercent}% de píxeles transparentados)`,
    });
  } catch (error) {
    console.error('Error removing background:', error);
    return NextResponse.json(
      { error: 'Error al quitar fondo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
