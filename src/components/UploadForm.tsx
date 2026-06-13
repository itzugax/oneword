"use client";

import { useState, useCallback, useRef } from "react";
import { UploadCloud, Loader2, Info } from "lucide-react";
import Link from "next/link";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [status, setStatus] = useState<"idle" | "validating" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setStatus("validating");
    setErrorMessage("");
    setFile(null);

    // Validar tipo de archivo
    if (!selectedFile.type.startsWith('video/')) {
      setStatus("error");
      setErrorMessage("Solo se permiten archivos de video.");
      return;
    }

    // Validar video (Duración y Orientación)
    const videoURL = URL.createObjectURL(selectedFile);
    const video = document.createElement('video');
    video.src = videoURL;
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(videoURL);
      
      const isVertical = video.videoHeight > video.videoWidth;
      const isShort = video.duration <= 59.5; // Margen de medio segundo

      if (!isVertical) {
        setStatus("error");
        setErrorMessage("⚠️ Error: El video debe ser vertical (Formato Short 9:16). No se permiten videos horizontales.");
        return;
      }

      if (!isShort) {
        setStatus("error");
        setErrorMessage(`⚠️ Error: El video dura ${Math.floor(video.duration)}s. El máximo permitido es 59 segundos.`);
        return;
      }

      // Si pasa la validación
      setFile(selectedFile);
      setStatus("idle");
    };

    video.onerror = () => {
      URL.revokeObjectURL(videoURL);
      setStatus("error");
      setErrorMessage("No se pudo leer el archivo de video. Asegúrate de que no esté corrupto.");
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !termsAccepted) return;

    setStatus("uploading");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setStatus("success");
        setFile(null);
        setTitle("");
        setDescription("");
        setTermsAccepted(false);
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          throw new Error(res.error || "Error en el servidor al subir el archivo.");
        } catch (err: any) {
          setStatus("error");
          setErrorMessage(err.message || "Error desconocido al procesar la subida.");
        }
      }
    });

    xhr.addEventListener("error", () => {
      setStatus("error");
      setErrorMessage("Error de conexión. Verifica tu internet e inténtalo nuevamente.");
    });

    xhr.open("POST", "/api/upload", true);
    xhr.send(formData);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-[2rem] p-8 md:p-10 float-shadow relative overflow-hidden">
      
      {status === "validating" && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#0056b3] mb-4" />
          <p className="text-lg font-bold text-[#0f172a]">Comprobando video...</p>
        </div>
      )}

      {/* Botón Central Gigante si no hay archivo */}
      {!file ? (
        <div 
          className="flex flex-col items-center justify-center w-full min-h-[250px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="video/mp4,video/quicktime"
            className="hidden" 
          />
          
          <button 
            type="button"
            onClick={triggerFileSelect}
            className="w-full max-w-sm bg-[#0056b3] hover:bg-[#004494] text-white rounded-[1.5rem] py-4 px-6 text-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3"
          >
            <UploadCloud className="w-7 h-7" />
            Subir Vídeo
          </button>
          
          <p className="mt-4 text-sm text-gray-400 font-medium tracking-wide">(o arrástralo aquí)</p>
          
          {status === "error" && (
            <div className="mt-6 bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-center font-medium shadow-sm w-full">
              {errorMessage}
            </div>
          )}

          <div className="mt-6 text-xs text-gray-400 text-center flex flex-col items-center gap-1">
            <span>Solo videos verticales (9:16)</span>
            <span>Máximo 59 segundos</span>
          </div>
        </div>
      ) : (
        /* Formulario con el archivo ya seleccionado */
        <form onSubmit={handleUpload} className="space-y-6 relative z-10">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col truncate">
              <span className="font-semibold text-[#0056b3] truncate">{file.name}</span>
              <span className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(1)} MB - ✅ Video Vertical y Corto</span>
            </div>
            {status !== "uploading" && (
              <button 
                type="button" 
                onClick={() => { setFile(null); setStatus("idle"); }}
                className="text-gray-400 hover:text-red-500 text-sm font-medium self-end sm:self-auto shrink-0"
              >
                Cancelar
              </button>
            )}
          </div>

          <div>
            <input
              type="text"
              required
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={status === "uploading"}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-gray-800 text-lg focus:outline-none focus:border-[#0056b3] focus:ring-1 focus:ring-[#0056b3] transition-all placeholder-gray-400 font-medium"
              placeholder="Escribe un título para el vídeo"
            />
          </div>

          {/* Checkbox de Términos */}
          <div className="flex items-start gap-3 mt-4">
            <input 
              type="checkbox" 
              id="terms" 
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              disabled={status === "uploading"}
              className="mt-1.5 w-4 h-4 text-[#0056b3] rounded border-gray-300 focus:ring-[#0056b3] disabled:opacity-50"
            />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
              He leído y acepto los <Link href="/terminos" target="_blank" className="text-[#0056b3] hover:underline font-medium">Términos y Condiciones</Link> para la subida de contenido. Entiendo que el vídeo puede ser publicado públicamente.
            </label>
          </div>

          {status === "error" && <p className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-lg">{errorMessage}</p>}
          {status === "success" && <p className="text-green-600 text-lg font-bold text-center bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">¡El vídeo se ha subido correctamente a la cola!</p>}

          <button
            type="submit"
            disabled={!title || !termsAccepted || status === "uploading"}
            className="w-full bg-[#0056b3] hover:bg-[#004494] text-white rounded-xl py-3.5 text-lg font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
          >
            {/* Barra de progreso de fondo en el botón */}
            {status === "uploading" && (
              <div 
                className="absolute left-0 top-0 bottom-0 bg-[#003875] transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            )}
            
            <span className="relative z-10 flex items-center gap-2">
              {status === "uploading" ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Subiendo... {uploadProgress}%
                </>
              ) : (
                "Confirmar y Enviar"
              )}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
