import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, context, mode = 'plan' } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY no configurada' },
        { status: 500 }
      );
    }

    let systemPrompt = '';
    
    switch (mode) {
      case 'plan':
        systemPrompt = `Eres un planificador educativo experto de Anektia, una plataforma de aprendizaje de física y ciencias. 
Tu tarea es crear planes de estudio personalizados basados en el progreso del usuario y los artículos disponibles.
Responde en JSON con esta estructura:
{
  "title": "Título del plan",
  "description": "Descripción breve",
  "duration": "Duración estimada",
  "difficulty": "principiante|intermedio|avanzado",
  "goals": ["objetivo1", "objetivo2"],
  "modules": [
    {
      "title": "Título del módulo",
      "articles": ["slug1", "slug2"],
      "estimatedTime": "X horas",
      "objectives": ["objetivo1"]
    }
  ],
  "recommendations": ["consejo1", "consejo2"]
}`;
        break;
      case 'curriculum':
        systemPrompt = `Eres un diseñador curricular experto. Analiza los artículos disponibles y sugiere mejoras al plan de estudios.
Responde en JSON:
{
  "analysis": "Análisis del currículo actual",
  "gaps": ["laguna1", "laguna2"],
  "suggestions": [
    {
      "type": "new_article|improve|reorder",
      "description": "Descripción",
      "priority": "alta|media|baja"
    }
  ],
  "nextTopics": ["tema1", "tema2"]
}`;
        break;
      case 'recommend':
        systemPrompt = `Eres un tutor virtual de Anektia. Recomienda el siguiente artículo o actividad basado en el progreso del usuario.
Responde en JSON:
{
  "recommendedArticles": [
    { "slug": "slug", "reason": "razón de la recomendación", "priority": 1 }
  ],
  "nextSteps": ["paso1", "paso2"],
  "encouragement": "Mensaje motivacional"
}`;
        break;
      default:
        systemPrompt = 'Eres un asistente educativo de Anektia. Responde en JSON estructurado.';
    }

    const fullPrompt = `${systemPrompt}

Contexto del usuario y artículos disponibles:
${JSON.stringify(context, null, 2)}

Solicitud del usuario:
${prompt}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
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
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Try to parse JSON from response
    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = { raw: text };
      }
    } catch {
      parsed = { raw: text };
    }

    return NextResponse.json({ result: parsed, raw: text });
  } catch (error) {
    console.error('Error in planner API:', error);
    return NextResponse.json(
      { error: 'Error al generar plan' },
      { status: 500 }
    );
  }
}
