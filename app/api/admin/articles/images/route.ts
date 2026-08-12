import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ARTICLES_IMG_DIR = path.join(process.cwd(), 'public', 'images', 'articles');

function sanitizeSlug(slug: string): string {
  return slug.replace(/[^a-z0-9-_]/gi, '').toLowerCase();
}

function getArticleDir(slug: string): string {
  const safe = sanitizeSlug(slug);
  if (!safe) throw new Error('Slug inválido');
  return path.join(ARTICLES_IMG_DIR, safe);
}

// GET /api/admin/articles/images?slug=xyz → list images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Parámetro slug requerido' }, { status: 400 });
    }

    const dir = getArticleDir(slug);
    if (!fs.existsSync(dir)) {
      return NextResponse.json({ images: [] });
    }

    const files = fs.readdirSync(dir)
      .filter(f => /\.(png|jpe?g|webp|gif)$/i.test(f))
      .map(f => ({
        name: f,
        url: `/images/articles/${sanitizeSlug(slug)}/${f}`,
        size: fs.statSync(path.join(dir, f)).size,
        ext: path.extname(f).replace('.', '').toUpperCase(),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ images: files });
  } catch (error) {
    console.error('Error listing article images:', error);
    return NextResponse.json({ error: 'Error al listar imágenes' }, { status: 500 });
  }
}

// POST /api/admin/articles/images → upload multipart (file + slug), converts to WebP
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const slug = formData.get('slug') as string | null;

    if (!file || !slug) {
      return NextResponse.json({ error: 'Se requieren file y slug' }, { status: 400 });
    }

    const dir = getArticleDir(slug);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name || '').toLowerCase();
    const base = (file.name || `img-${Date.now()}`).replace(/\.[^.]+$/, '');
    const safeBase = base.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();

    // Convert to WebP if source is raster (png/jpg), else keep format
    const isRaster = /\.(png|jpe?g)$/i.test(ext);
    const filename = isRaster
      ? `${safeBase}-${Date.now()}.webp`
      : `${safeBase}-${Date.now()}${ext || '.png'}`;

    const filePath = path.join(dir, filename);

    if (isRaster) {
      const outBuffer = await sharp(buffer).webp({ quality: 82 }).toBuffer();
      fs.writeFileSync(filePath, outBuffer);
    } else {
      fs.writeFileSync(filePath, buffer);
    }

    const url = `/images/articles/${sanitizeSlug(slug)}/${filename}`;

    return NextResponse.json({
      success: true,
      name: filename,
      url,
      markdown: `![${safeBase}](${url})`,
    });
  } catch (error) {
    console.error('Error uploading article image:', error);
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 });
  }
}

// DELETE /api/admin/articles/images?slug=xyz&file=img.webp
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const file = searchParams.get('file');

    if (!slug || !file) {
      return NextResponse.json({ error: 'Se requieren slug y file' }, { status: 400 });
    }

    const dir = getArticleDir(slug);
    const filePath = path.join(dir, path.basename(file));

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article image:', error);
    return NextResponse.json({ error: 'Error al borrar imagen' }, { status: 500 });
  }
}
