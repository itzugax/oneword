"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, RefreshCw, Zap, Play } from "lucide-react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [config, setConfig] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [intervalInput, setIntervalInput] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin', {
        headers: { 'Authorization': `Bearer ${password}` }
      });
      if (res.ok) {
        setIsAuthenticated(true);
        fetchData(password);
      } else {
        alert("Contraseña incorrecta");
      }
    } catch (e) {
      alert("Error de conexión");
    }
    setLoading(false);
  };

  const fetchData = async (pwd: string) => {
    const res = await fetch('/api/admin', {
      headers: { 'Authorization': `Bearer ${pwd}` }
    });
    if (res.ok) {
      const data = await res.json();
      setConfig(data.config);
      setVideos(data.videos);
      setIntervalInput(data.config.minutos_entre_ruletas.toString());
    }
  };

  const updateInterval = async () => {
    const newVal = parseInt(intervalInput);
    if (isNaN(newVal) || newVal < 1) return alert("Valor inválido");
    
    setLoading(true);
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${password}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'update_interval', interval: newVal })
    });
    if (res.ok) {
      alert("Intervalo actualizado");
      fetchData(password);
    }
    setLoading(false);
  };

  const forceRoulette = async () => {
    if (!confirm("¿Estás seguro de forzar la publicación de un video AHORA MISMO?")) return;
    
    setLoading(true);
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${password}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'force_roulette' })
    });
    
    const data = await res.json();
    alert(data.message || "Ruleta ejecutada");
    fetchData(password);
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white px-4">
        <form onSubmit={login} className="max-w-md w-full glass-panel p-8 rounded-2xl flex flex-col items-center space-y-6">
          <ShieldAlert className="w-12 h-12 text-gray-400" />
          <h1 className="text-2xl font-bold">Acceso Restringido</h1>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña de Administrador"
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-center focus:outline-none focus:border-white transition-colors"
          />
          <button 
            disabled={loading || !password}
            className="w-full bg-white text-black py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-gray-200 transition-colors"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex justify-between items-center border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldAlert className="w-8 h-8" />
            Centro de Control
          </h1>
          <button onClick={() => fetchData(password)} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Configuración */}
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Intervalo de Ruleta
            </h2>
            <p className="text-sm text-gray-400">
              Define cada cuántos minutos se publicará un video. El Cron Job revisará esta configuración continuamente.
            </p>
            <div className="flex gap-4">
              <input 
                type="number" 
                value={intervalInput}
                onChange={(e) => setIntervalInput(e.target.value)}
                min="1"
                className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-white"
              />
              <button 
                onClick={updateInterval}
                disabled={loading}
                className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
              >
                Guardar
              </button>
            </div>
            {config && (
              <p className="text-xs text-gray-500">Última ruleta ejecutada: {new Date(config.ultima_ruleta).toLocaleString()}</p>
            )}
          </div>

          {/* Control Manual */}
          <div className="glass-panel p-6 rounded-2xl space-y-6 flex flex-col justify-center items-center text-center">
            <h2 className="text-xl font-semibold">Liberación Manual</h2>
            <p className="text-sm text-gray-400">
              Presiona este botón para saltarte la espera y lanzar un video a YouTube de manera inmediata.
            </p>
            <button 
              onClick={forceRoulette}
              disabled={loading}
              className="bg-red-600 hover:bg-red-500 text-white w-full py-4 rounded-xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              <Play className="w-6 h-6 fill-current" />
              ¡Forzar Ruleta Ahora!
            </button>
          </div>
        </div>

        {/* Lista de Videos */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-6">Todos los Videos ({videos.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-3">Título</th>
                  <th className="p-3">ID YouTube</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {videos.map((v) => (
                  <tr key={v.id} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-medium truncate max-w-[200px]">{v.titulo}</td>
                    <td className="p-3 text-gray-400">
                      <a href={`https://youtube.com/watch?v=${v.youtube_video_id}`} target="_blank" className="hover:text-white underline">
                        {v.youtube_video_id}
                      </a>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${v.estado === 'publicado' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {v.estado}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{new Date(v.creado_en).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
