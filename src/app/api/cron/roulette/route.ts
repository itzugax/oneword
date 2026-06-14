import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { makeVideoPublic } from '@/lib/youtube';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: Request) {
  try {
    // Validar token de cron (Header o Query Parameter)
    const url = new URL(req.url);
    const querySecret = url.searchParams.get('secret');
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Header opcional para saltarse la validación de tiempo (manual desde el admin panel)
    const forceRoulette = req.headers.get('x-force-roulette') === 'true';

    if (!cronSecret || (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 1. Obtener la configuración de tiempo
    const { data: config } = await supabaseAdmin
      .from('configuracion')
      .select('*')
      .eq('id', 1)
      .single();

    if (!config) {
      return NextResponse.json({ error: 'Configuración no encontrada' }, { status: 500 });
    }

    const { minutos_entre_ruletas, ultima_ruleta } = config;

    // Si NO es forzado, verificamos si ya pasó el tiempo necesario
    if (!forceRoulette) {
      const ahora = new Date();
      const ultima = new Date(ultima_ruleta);
      const diferenciaMinutos = (ahora.getTime() - ultima.getTime()) / (1000 * 60);

      // Si no ha pasado suficiente tiempo, salimos temprano silenciosamente (200 OK para el Cron)
      if (diferenciaMinutos < minutos_entre_ruletas) {
        return NextResponse.json({ message: 'Aún no es tiempo de lanzar la ruleta.' }, { status: 200 });
      }
    }

    // 2. Obtener un video al azar 'en_espera'
    const { data: videos, error: fetchError } = await supabaseAdmin
      .from('videos_ruleta')
      .select('*')
      .eq('estado', 'en_espera')
      .limit(100);

    if (fetchError) {
      console.error('Error obteniendo videos:', fetchError);
      return NextResponse.json({ error: 'Error al consultar la base de datos' }, { status: 500 });
    }

    if (!videos || videos.length === 0) {
      return NextResponse.json({ message: 'No hay videos en espera.' }, { status: 200 });
    }

    // Elegir uno al azar
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    // 3. Hacer público el video en YouTube
    const success = await makeVideoPublic(randomVideo.youtube_video_id);

    if (!success) {
      return NextResponse.json({ error: 'Error al cambiar la privacidad en YouTube' }, { status: 500 });
    }

    // 4. Actualizar estado en Supabase a 'publicado'
    await supabaseAdmin
      .from('videos_ruleta')
      .update({ estado: 'publicado' })
      .eq('id', randomVideo.id);

    // 5. Actualizar la última hora de ejecución en configuración
    await supabaseAdmin
      .from('configuracion')
      .update({ ultima_ruleta: new Date().toISOString() })
      .eq('id', 1);

    return NextResponse.json({ 
      success: true, 
      message: `El video ${randomVideo.youtube_video_id} ahora es público!` 
    }, { status: 200 });

  } catch (error) {
    console.error('Error en Cron Job:', error);
    return NextResponse.json({ error: 'Error interno del Cron' }, { status: 500 });
  }
}
