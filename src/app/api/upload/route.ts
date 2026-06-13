import { NextResponse } from 'next/server';
import { uploadVideoToYouTube } from '@/lib/youtube';
import { supabaseAdmin } from '@/lib/supabase';

export const maxDuration = 60; // Configuración para Vercel: permite hasta 60s de ejecución

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || '';

    if (!file || !title) {
      return NextResponse.json({ error: 'Faltan campos requeridos (file, title)' }, { status: 400 });
    }

    const finalTitle = `${title.trim()} #losderyutu`;
    const finalDescription = description.trim() ? `${description.trim()}\n\n#losderyutu` : `#losderyutu`;

    // Validar el tamaño (500MB máximo backend)
    const MAX_SIZE = 500 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'El archivo excede el límite permitido' }, { status: 400 });
    }

    // Validar formato
    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'El archivo debe ser un video' }, { status: 400 });
    }

    // Convertir el archivo a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a YouTube (como privado)
    const youtubeVideoId = await uploadVideoToYouTube(buffer, finalTitle, finalDescription);

    // Guardar en Supabase con estado 'en_espera'
    const { data, error } = await supabaseAdmin
      .from('videos_ruleta')
      .insert([
        {
          youtube_video_id: youtubeVideoId,
          titulo: finalTitle,
          descripcion: finalDescription,
          estado: 'en_espera',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error al guardar en Supabase:', error);
      return NextResponse.json({ error: 'Error al registrar el video en la base de datos' }, { status: 500 });
    }

    return NextResponse.json({ success: true, video: data }, { status: 201 });
  } catch (error) {
    console.error('Error en /api/upload:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
