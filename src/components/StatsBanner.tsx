"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { Hourglass, FileVideo } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StatsBanner() {
  const { data, error } = useSWR('/api/stats', fetcher, { 
    refreshInterval: 2000,
    revalidateOnFocus: true
  });

  const [timeLeft, setTimeLeft] = useState<string>("--:--");

  useEffect(() => {
    if (!data?.config) return;

    const updateTimer = () => {
      if (data.queueCount === 0) {
        setTimeLeft("Sin vídeos");
        return;
      }

      const { ultima_ruleta, minutos_entre_ruletas } = data.config;
      const ahora = new Date().getTime();
      const ultima = new Date(ultima_ruleta).getTime();
      const proxima = ultima + (minutos_entre_ruletas * 60 * 1000);
      
      const diff = proxima - ahora;
      if (diff <= 0) {
        setTimeLeft("Procesando...");
      } else {
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timerInterval);
  }, [data?.config, data?.queueCount]);

  const isLoading = !data && !error;
  const queueCount = data?.queueCount ?? "--";
  const display = isLoading ? "--:--" : timeLeft;

  return (
    <>
      {/* ── Fondo artístico: relojes dispersos ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 overflow-hidden pointer-events-none select-none"
        style={{ zIndex: 0 }}
      >
        {/* Centro — el más grande y sutil */}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[22vw] font-black tracking-tighter tabular-nums whitespace-nowrap text-[#0f172a] opacity-[0.045]">
          {display}
        </span>

        {/* Arriba-izquierda, inclinado */}
        <span className="absolute -top-4 -left-8 text-[18vw] font-black tracking-tighter tabular-nums whitespace-nowrap text-[#0f172a] opacity-[0.025] -rotate-[15deg]">
          {display}
        </span>

        {/* Arriba-derecha, inclinado al otro lado */}
        <span className="absolute -top-6 right-[-12%] text-[14vw] font-black tracking-tighter tabular-nums whitespace-nowrap text-[#0f172a] opacity-[0.02] rotate-[10deg]">
          {display}
        </span>

        {/* Abajo-izquierda, pequeño y rotado */}
        <span className="absolute bottom-[8%] left-[5%] text-[9vw] font-black tracking-tighter tabular-nums whitespace-nowrap text-[#0f172a] opacity-[0.035] rotate-[30deg]">
          {display}
        </span>

        {/* Abajo-derecha, mediano */}
        <span className="absolute bottom-[5%] right-[3%] text-[16vw] font-black tracking-tighter tabular-nums whitespace-nowrap text-[#0f172a] opacity-[0.025] -rotate-[8deg]">
          {display}
        </span>

        {/* Centro-izquierda, pequeñísimo */}
        <span className="absolute top-[40%] left-[2%] text-[6vw] font-black tracking-tighter tabular-nums whitespace-nowrap text-[#0f172a] opacity-[0.04] rotate-[45deg]">
          {display}
        </span>
      </div>

      {/* ── Tarjetas flotantes — SIEMPRE ENCIMA ── */}
      <div
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col sm:flex-row gap-3 md:gap-4 scale-90 md:scale-100 origin-bottom-right"
        style={{ zIndex: 9999 }}
      >
        <div className="bg-white rounded-2xl p-4 md:p-5 flex items-center gap-3 float-shadow min-w-[175px] border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <FileVideo className="w-5 h-5 text-[#0056b3]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vídeos en cola</h3>
            <p className="text-xl font-black text-[#0f172a]">{isLoading ? "..." : queueCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-5 flex items-center gap-3 float-shadow min-w-[175px] border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Hourglass className="w-5 h-5 text-[#0056b3]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Próximo vídeo</h3>
            <p className="text-xl font-black text-[#0f172a] tabular-nums tracking-tight">{display}</p>
          </div>
        </div>
      </div>
    </>
  );
}
