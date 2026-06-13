-- Tabla para la Ruleta Rusa de Creadores
CREATE TABLE IF NOT EXISTS videos_ruleta (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_video_id text NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  estado text DEFAULT 'en_espera' CHECK (estado IN ('en_espera', 'publicado')),
  creado_en timestamp with time zone DEFAULT now()
);

-- Tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS configuracion (
  id integer PRIMARY KEY DEFAULT 1,
  minutos_entre_ruletas integer NOT NULL DEFAULT 10,
  ultima_ruleta timestamp with time zone DEFAULT now()
);

-- Asegurarse de que exista una fila de configuración inicial
INSERT INTO configuracion (id, minutos_entre_ruletas)
VALUES (1, 10)
ON CONFLICT (id) DO NOTHING;
