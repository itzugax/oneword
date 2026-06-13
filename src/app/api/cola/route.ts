import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const revalidate = 0; // Evitar cache para esta ruta

export async function GET() {
  try {
    const { data: videos, error } = await supabaseAdmin
      .from('videos_ruleta')
      .select('id, titulo, creado_en')
      .eq('estado', 'en_espera')
      .order('creado_en', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Error al consultar la base de datos' }, { status: 500 });
    }

    return NextResponse.json({ videos: videos || [] });
  } catch (error) {
    console.error('Error fetching cola:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
