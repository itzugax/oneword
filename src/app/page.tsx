import Navbar from "@/components/Navbar";
import UploadForm from "@/components/UploadForm";
import StatsBanner from "@/components/StatsBanner";
import { UserPlus, Upload, List, Share2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col font-sans text-[#0f172a]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center px-4 pt-10 pb-20">
        
        {/* Hero Section */}
        <div className="text-center w-full max-w-4xl mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-[#0f172a] leading-tight">
            Aparece en el canal<br/>de YouTube de todos.
          </h1>
          <p className="text-base md:text-lg text-[#4b5563] font-medium mb-6 max-w-2xl mx-auto leading-relaxed">
            Sube tu vídeo y entrará a una lista de espera. El sistema publicará automáticamente un vídeo al azar en la cuenta comunitaria cada vez que el reloj llegue a cero.
          </p>
          <a 
            href="https://www.youtube.com/@losderyutu" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Ver canal de YouTube 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        </div>

        {/* Upload Card */}
        <div className="w-full mb-16 z-10">
          <UploadForm />
        </div>

        <StatsBanner />

        {/* Vertical Steps - Cómo funciona */}
        <div id="como-funciona" className="w-full max-w-3xl flex flex-col items-center scroll-mt-24">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-[#0f172a] tracking-tight">Cómo funciona youtubebot</h2>
            <p className="text-[#4b5563] mt-2">El primer YouTube del mundo gestionado por su propia gente.</p>
          </div>

          <div className="flex flex-col gap-6 w-full">
            
            <div className="bg-white rounded-[2rem] p-8 md:p-10 flex items-start gap-6 float-shadow">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-[#0056b3]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">1. Selecciona tu vídeo</h3>
                <p className="text-[#4b5563] leading-relaxed">
                  Elige un vídeo desde tu dispositivo. Asegúrate de que no infrinja las normas de la comunidad para evitar ser penalizado.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 md:p-10 flex items-start gap-6 float-shadow">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#0056b3]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">2. Añade un título y acepta</h3>
                <p className="text-[#4b5563] leading-relaxed">
                  Escribe un título llamativo, lee y acepta los términos de uso. Es necesario para mantener el orden en la grada y evitar contenido inapropiado.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 md:p-10 flex items-start gap-6 float-shadow">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center">
                <List className="w-6 h-6 text-[#0056b3]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">3. Directo a la cola</h3>
                <p className="text-[#4b5563] leading-relaxed">
                  Una vez enviado, el bot lo pondrá en la lista de espera. Dependiendo del intervalo configurado, el bot selecciona y publica un vídeo.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 md:p-10 flex items-start gap-6 float-shadow">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-[#0056b3]" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">4. ¡Ya estás en YouTube!</h3>
                <p className="text-[#4b5563] leading-relaxed">
                  El vídeo será público para todo el mundo en nuestro canal comunitario. ¡Así de fácil!
                </p>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
