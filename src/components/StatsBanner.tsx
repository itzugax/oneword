"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { Hourglass, FileVideo } from "lucide-react";

// Fetcher para SWR
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

  return (
    <>
      {/* Reloj Gigante de Fondo */}
      <div className="fixed inset-0 flex items-center justify-center -z-10 pointer-events-none select-none overflow-hidden">
        <span className="text-[18vw] md:text-[15vw] font-black text-[#0f172a]/[0.08] tracking-tighter tabular-nums whitespace-nowrap">
          {isLoading ? "--:--" : timeLeft}
        </span>
      </div>

      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col sm:flex-row gap-3 md:gap-4 scale-90 md:scale-100 origin-bottom-right">
        <div className="bg-white rounded-2xl p-4 md:p-5 flex items-center gap-3 float-shadow min-w-[180px] border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <FileVideo className="w-5 h-5 text-[#0056b3]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vídeos en cola</h3>
            <p className="text-xl font-black text-[#0f172a]">{isLoading ? "..." : queueCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-5 flex items-center gap-3 float-shadow min-w-[180px] border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Hourglass className="w-5 h-5 text-[#0056b3]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Próximo vídeo</h3>
            <p className="text-xl font-black text-[#0f172a] tabular-nums tracking-tight">{isLoading ? "--:--" : timeLeft}</p>
          </div>
        </div>
      </div>
    </>
  );
}
