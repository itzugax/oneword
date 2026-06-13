import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Helper to validate admin password
function isAuthenticated(req: Request) {
  const authHeader = req.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
    return false;
  }
  return true;
}

export async function GET(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get config
    const { data: config } = await supabaseAdmin
      .from('configuracion')
      .select('*')
      .eq('id', 1)
      .single();

    // Get videos stats
    const { data: videos } = await supabaseAdmin
      .from('videos_ruleta')
      .select('*')
      .order('creado_en', { ascending: false });

    return NextResponse.json({
      config: config || { minutos_entre_ruletas: 10 },
      videos: videos || []
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action, interval } = await req.json();

    if (action === 'update_interval') {
      if (typeof interval !== 'number' || interval < 1) {
        return NextResponse.json({ error: 'Invalid interval' }, { status: 400 });
      }

      await supabaseAdmin
        .from('configuracion')
        .update({ minutos_entre_ruletas: interval })
        .eq('id', 1);

      return NextResponse.json({ success: true, message: 'Intervalo actualizado' });
    }

    if (action === 'force_roulette') {
      // Usamos fetch local para simular la llamada del cron job
      const cronUrl = new URL('/api/cron/roulette', req.url);
      const cronSecret = process.env.CRON_SECRET || '';
      
      const res = await fetch(cronUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${cronSecret}`,
          'X-Force-Roulette': 'true'
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to force roulette');

      return NextResponse.json({ success: true, message: 'Ruleta forzada exitosamente', data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin POST Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
