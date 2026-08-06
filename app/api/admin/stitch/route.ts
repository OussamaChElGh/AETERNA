import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const targetPath = formData.get('targetPath') as string || '';
    const customPrompt = formData.get('prompt') as string || '';

    if (!image) {
      return NextResponse.json(
        { error: 'No se proporcionó imagen' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY no configurada' },
        { status: 500 }
      );
    }

    // Convert image to base64
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = buffer.toString('base64');
    const mimeType = image.type || 'image/png';

    const defaultPrompt = `Analyze this UI design screenshot. Generate a COMPLETE, WORKING React component with TypeScript and Tailwind CSS that EXACTLY replicates this design. 
Use font-serif for titles, font-mono for labels. Match all colors, spacing, layout, and text exactly. 
Use lucide-react for icons, motion/react for animations. 
Just output the raw .tsx code without markdown fences.`;

    const prompt = customPrompt || defaultPrompt;

    const body = {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: base64 } }
        ]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8000,
      },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return NextResponse.json(
        { error: 'Error en la API de IA', details: error },
        { status: 502 }
      );
    }

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json(
        { error: data.error.message },
        { status: 502 }
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      return NextResponse.json(
        { error: 'Respuesta vacía de la IA' },
        { status: 502 }
      );
    }

    // Clean up code (remove markdown fences if present)
    let code = text;
    const codeMatch = text.match(/```(?:tsx?|typescript)?\n?([\s\S]*?)```/);
    if (codeMatch) {
      code = codeMatch[1].trim();
    }

    // Save to file if target path provided
    let savedPath = '';
    if (targetPath) {
      const fullPath = path.join(process.cwd(), targetPath);
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, code, 'utf8');
      savedPath = targetPath;
    }

    return NextResponse.json({
      success: true,
      code,
      savedPath,
      charCount: code.length,
    });
  } catch (error) {
    console.error('Error in stitch-to-code API:', error);
    return NextResponse.json(
      { error: 'Error al generar código' },
      { status: 500 }
    );
  }
}
