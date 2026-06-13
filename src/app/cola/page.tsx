"use client";

import Navbar from "@/components/Navbar";
import useSWR from "swr";
import { ListVideo } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ColaPage() {
  const { data, error } = useSWR('/api/cola', fetcher, { refreshInterval: 5000 });

  const isLoading = !data && !error;
  const videos = data?.videos || [];

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col font-sans text-[#0f172a]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center px-4 pt-10 pb-32">
        <div className="w-full max-w-3xl text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#0f172a]">
            Lista de Espera
          </h1>
          <p className="text-[#4b5563] text-lg font-medium">
            Estos son los videos que están esperando su turno para ser publicados.
          </p>
        </div>

        <div className="w-full max-w-3xl bg-white rounded-[2rem] p-6 md:p-10 float-shadow min-h-[400px]">
          
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <ListVideo className="w-5 h-5 text-[#0056b3]" />
            </div>
            <h2 className="text-xl font-bold">En Cola ({videos.length})</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-[#0056b3] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-medium">
              No hay videos en la cola actualmente. ¡Sube el tuyo!
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((v: any, index: number) => (
                <div key={v.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="font-semibold text-gray-800 truncate">{v.titulo}</p>
                    <p className="text-sm text-gray-400">{new Date(v.creado_en).toLocaleString()}</p>
                  </div>
                  <div className="hidden sm:block px-3 py-1 bg-blue-50 text-[#0056b3] text-xs font-bold rounded-full uppercase tracking-wide">
                    En Espera
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
