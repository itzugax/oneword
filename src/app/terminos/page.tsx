import Navbar from "@/components/Navbar";
import { ShieldCheck, Scale, AlertTriangle, Info } from "lucide-react";

export default function Terminos() {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col font-sans text-[#0f172a]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center px-4 pt-10 pb-32">
        <div className="w-full max-w-4xl text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#0f172a]">
            Términos y Condiciones
          </h1>
          <p className="text-[#4b5563] text-lg font-medium">
            Lo que necesitas saber antes de subir un vídeo.
          </p>
        </div>

        <div className="w-full max-w-3xl flex flex-col gap-6">
          
          <div className="bg-white rounded-[2rem] p-8 md:p-10 flex items-start gap-6 float-shadow">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#0056b3]" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3">1. Aceptación de los Términos</h2>
              <p className="text-[#4b5563] leading-relaxed">
                Al utilizar este servicio y subir un vídeo, aceptas que el contenido será almacenado temporalmente en nuestra base de datos y publicado de forma pública en un canal de YouTube comunitario. <strong>No puedes revocar esta acción</strong> una vez que el vídeo ha sido procesado por el sistema.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 md:p-10 flex items-start gap-6 float-shadow">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Scale className="w-6 h-6 text-[#0056b3]" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3">2. Propiedad Intelectual</h2>
              <p className="text-[#4b5563] leading-relaxed">
                Al subir contenido, declaras y garantizas que posees todos los derechos de autor sobre el material enviado, o cuentas con el permiso explícito. Otorgas a la plataforma una licencia no exclusiva para publicar dicho contenido en el canal comunitario.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 md:p-10 flex items-start gap-6 float-shadow border border-red-100">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3 text-red-600">3. Contenido Estrictamente Prohibido</h2>
              <ul className="text-[#4b5563] leading-relaxed list-disc pl-5 space-y-2">
                <li>Material explícito para adultos o desnudez de cualquier tipo.</li>
                <li>Violencia, gore, acoso, bullying o material que promueva daños.</li>
                <li>Material comercial, spam o estafas.</li>
                <li>Música o clips protegidos por derechos de autor sin autorización.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 md:p-10 flex items-start gap-6 float-shadow">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Info className="w-6 h-6 text-[#0056b3]" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-3">4. Renuncia de Responsabilidad</h2>
              <p className="text-[#4b5563] leading-relaxed">
                Este sistema opera de forma 100% automatizada. No garantizamos un plazo específico para la publicación de tu vídeo ni nos hacemos responsables por la eliminación del canal o del vídeo por parte de YouTube si infringe sus normas de la comunidad.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
