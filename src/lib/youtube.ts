import { google } from 'googleapis';
import { Readable } from 'stream';

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

// Establecemos las credenciales iniciales
oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

/**
 * Convierte un Buffer en un ReadableStream
 */
function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

/**
 * Sube un video a YouTube como 'private' o 'unlisted'
 * @param fileBuffer Buffer de video
 * @param title Título
 * @param description Descripción
 * @returns ID del video de YouTube
 */
export async function uploadVideoToYouTube(
  fileBuffer: Buffer,
  title: string,
  description: string
): Promise<string> {
  try {
    const res = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          tags: ['shorts', 'roulette', 'creators'],
          categoryId: '24', // Entertainment
        },
        status: {
          privacyStatus: 'private', // Sube como privado inicialmente
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: bufferToStream(fileBuffer),
      },
    });

    if (!res.data.id) {
      throw new Error('No se recibió el ID del video de YouTube');
    }

    return res.data.id;
  } catch (error) {
    console.error('Error al subir video a YouTube:', error);
    throw error;
  }
}

/**
 * Cambia el estado de privacidad de un video a 'public'
 * @param videoId ID de YouTube
 */
export async function makeVideoPublic(videoId: string): Promise<boolean> {
  try {
    const res = await youtube.videos.update({
      part: ['status'],
      requestBody: {
        id: videoId,
        status: {
          privacyStatus: 'public',
        },
      },
    });

    return res.data.status?.privacyStatus === 'public';
  } catch (error) {
    console.error('Error al hacer público el video de YouTube:', error);
    throw error;
  }
}
