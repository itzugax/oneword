import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { youtubeVideoId, title, description } = await req.json();

    if (!youtubeVideoId || !title) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('videos_ruleta')
      .insert([
        {
          youtube_video_id: youtubeVideoId,
          titulo: title,
          descripcion: description || '',
          estado: 'en_espera',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error al guardar en Supabase:', error);
      return NextResponse.json({ error: 'Error al registrar el video' }, { status: 500 });
    }

    return NextResponse.json({ success: true, video: data }, { status: 201 });
  } catch (error) {
    console.error('Error en /api/upload/complete:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
