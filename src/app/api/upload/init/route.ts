import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({ refresh_token: process.env.YOUTUBE_REFRESH_TOKEN });

export async function POST(req: Request) {
  try {
    const { title, description, fileSize, mimeType } = await req.json();

    if (!title || !fileSize || !mimeType) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const finalTitle = `${title.trim()} #losderyutu`;
    const finalDescription = description?.trim()
      ? `${description.trim()}\n\nSubido por la comunidad de losderyutu. Cualquiera puede aparecer aquí → ugaxbot.vercel.app\n\n#losderyutu #shorts`
      : `Subido por la comunidad de losderyutu. Cualquiera puede aparecer aquí → ugaxbot.vercel.app\n\n#losderyutu #shorts`;

    // Obtener access token fresco
    const { token } = await oauth2Client.getAccessToken();
    if (!token) throw new Error('No se pudo obtener el access token de YouTube');

    // Iniciar subida resumable directamente en YouTube
    const initRes = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Upload-Content-Type': mimeType,
          'X-Upload-Content-Length': String(fileSize),
        },
        body: JSON.stringify({
          snippet: {
            title: finalTitle,
            description: finalDescription,
            tags: ['losderyutu', 'shorts'],
            categoryId: '24',
          },
          status: {
            privacyStatus: 'private',
            selfDeclaredMadeForKids: false,
          },
        }),
      }
    );

    if (!initRes.ok) {
      const errText = await initRes.text();
      console.error('Error iniciando subida resumable:', errText);
      return NextResponse.json({ error: 'Error al iniciar la subida en YouTube' }, { status: 500 });
    }

    const uploadUrl = initRes.headers.get('location');
    if (!uploadUrl) {
      return NextResponse.json({ error: 'YouTube no devolvió URL de subida' }, { status: 500 });
    }

    return NextResponse.json({ uploadUrl, finalTitle, finalDescription });
  } catch (error) {
    console.error('Error en /api/upload/init:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
