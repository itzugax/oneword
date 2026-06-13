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
        {/* Centro */}
        <span className="absolute top-[38%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black tracking-tighter tabular-nums whitespace-nowrap text-[#0f172a] opacity-[0.05]">
          {display}
        </span>

        {/* Arriba-izquierda */}
        <span className="absolute top-[5%] left-[-4%] text-[11vw] font-black tracking-tighter tabular-nums whitespace-nowrap text-[#0f172a] opacity-[0.025] -rotate-[12deg]">
          {display}
        </span>

        {/* Arriba-derecha */}
        <span className="absolute top-[8%] right-[-2%] text-[8vw] font-black tracking-tighter tabular-nums whitespace-nowrap text-[#0f172a] opacity-[0.02] rotate-[8deg]">
          {display}
        </span>

        {/* Abajo-izquierda */}
        <span className="absolute bottom-[12%] left-[4%] text-[7vw] font-black tracking-tighter tabular-nums whitespace-nowrap text-[#0f172a] opacity-[0.03] rotate-[25deg]">
          {display}
        </span>

        {/* Abajo-derecha */}
        <span className="absolute bottom-[8%] right-[2%] text-[10vw] font-black tracking-tighter tabular-nums whitespace-nowrap text-[#0f172a] opacity-[0.025] -rotate-[6deg]">
          {display}
        </span>

        {/* Lateral izquierdo medio */}
        <span className="absolute top-[62%] left-[-1%] text-[5vw] font-black tracking-tighter tabular-nums whitespace-nowrap text-[#0f172a] opacity-[0.035] rotate-[40deg]">
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
