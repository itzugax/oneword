import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const revalidate = 10; // Revalidar cada 10s

export async function GET() {
  try {
    // Obtener cantidad en espera
    const { count, error: countError } = await supabaseAdmin
      .from('videos_ruleta')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'en_espera');

    if (countError) throw countError;

    // Obtener configuración de tiempo
    const { data: config, error: configError } = await supabaseAdmin
      .from('configuracion')
      .select('minutos_entre_ruletas, ultima_ruleta')
      .eq('id', 1)
      .single();

    if (configError) throw configError;

    return NextResponse.json({ 
      queueCount: count || 0,
      config: config 
    });
  } catch (error) {
    console.error('Error en /api/stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
