import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const filePath = path.join(ARTICLES_DIR, `${slug}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);

    return NextResponse.json(json);
  } catch (error) {
    console.error('Error reading article:', error);
    return NextResponse.json(
      { error: 'Error al leer artículo' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const filePath = path.join(ARTICLES_DIR, `${slug}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    // Validar estructura mínima
    if (!body.metadata || !body.metadata.title || !body.metadata.slug) {
      return NextResponse.json(
        { error: 'Estructura inválida: se requiere metadata.title y metadata.slug' },
        { status: 400 }
      );
    }

    // Asegurar que el slug no cambie
    if (body.metadata.slug !== slug) {
      return NextResponse.json(
        { error: 'No se puede cambiar el slug del artículo' },
        { status: 400 }
      );
    }

    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf8');

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Error al actualizar artículo' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();
    
    if (!body.metadata || !body.metadata.slug) {
      return NextResponse.json(
        { error: 'Se requiere metadata.slug' },
        { status: 400 }
      );
    }

    const slug = body.metadata.slug;
    const filePath = path.join(ARTICLES_DIR, `${slug}.json`);

    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'El artículo ya existe. Use PUT para actualizar.' },
        { status: 409 }
      );
    }

    // Estructura mínima para nuevo artículo
    const newArticle = {
      metadata: {
        title: body.metadata.title || 'Nuevo artículo',
        description: body.metadata.description || '',
        slug: slug,
        author: body.metadata.author || 'Anektia',
        category: body.metadata.category || 'ciencias_naturales',
        subcategory: body.metadata.subcategory || 'fisica',
        tags: body.metadata.tags || [],
        image: body.metadata.image || '',
        date: body.metadata.date || new Date().toISOString().split('T')[0],
        nivel: body.metadata.nivel || 1,
        orden: body.metadata.orden || 1,
        tipo: body.metadata.tipo || 'theory',
      },
      introduccion: '',
      secciones: [],
      conclusion: '',
    };

    fs.writeFileSync(filePath, JSON.stringify(newArticle, null, 2), 'utf8');

    return NextResponse.json({ success: true, slug }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Error al crear artículo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const filePath = path.join(ARTICLES_DIR, `${slug}.json`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Error al eliminar artículo' },
      { status: 500 }
    );
  }
}
