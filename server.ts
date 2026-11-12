import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Genres definition for Dominican Republic production
export const GENEROS_RD: Record<string, { bpm: string; base: string; prompt: string; key: string }> = {
  "Dembow Dominicano": {
    bpm: "120-135",
    base: "808 pesado, kick dembow, guira, tambora, flow callejero RD",
    prompt: "Dominican Dembow, 128 BPM, heavy 808, dembow riddim, guira, tambora, male RD flow, Los Frailes street energy",
    key: "F# Minor",
  },
  "Dembow Navidad + Perico Ripiao": {
    bpm: "125-140",
    base: "Dembow + merengue típico, acordeón, güira, tambora, campana navideña",
    prompt: "Dominican Dembow Christmas, perico ripiao accordion, guira, tambora, festive RD navidad, 130 BPM",
    key: "A Major",
  },
  "Perico Ripiao / Merengue Típico": {
    bpm: "140-160",
    base: "Acordeón, güira, tambora, marimba, típico Cibao",
    prompt: "Perico Ripiao tipico, accordion lead, guira, tambora, 150 BPM, Cibao Dominican folk",
    key: "D Major",
  },
  "Merengue Clásico": {
    bpm: "130-150",
    base: "Saxo, trompeta, tambora, güira, piano",
    prompt: "Classic Dominican Merengue, brass section, tambora, guira, 140 BPM, danceable",
    key: "C Major",
  },
  "Merengue de Calle / Mambo": {
    bpm: "135-145",
    base: "Mambo callejero, sintetizadores, tambora electrónica",
    prompt: "Merengue de calle mambo, electronic synth, tambora, 138 BPM, urban RD",
    key: "G Minor",
  },
  "Bachata Tradicional": {
    bpm: "120-132",
    base: "Guitarra requinto, bongo, maracas, bajo, amargue",
    prompt: "Traditional Bachata, requinto guitar, bongo, maracas, romantic amargue, 126 BPM",
    key: "E Minor",
  },
  "Bachata Moderna / Urbana": {
    bpm: "128-135",
    base: "Bachata + R&B + trap, guitarra eléctrica, 808 suave",
    prompt: "Modern Urban Bachata, R&B fusion, electric guitar, 808, 130 BPM, romantic",
    key: "B Minor",
  },
  "Bachata Navidad": {
    bpm: "125",
    base: "Bachata + villancicos, campana, guitarra",
    prompt: "Bachata Christmas, villancico melody, guitar, bongo, festive RD",
    key: "G Major",
  },
  "Salsa Dominicana": {
    bpm: "170-190",
    base: "Congas, timbales, piano montuno, trompetas",
    prompt: "Dominican Salsa, congas, timbales, piano montuno, brass, 180 BPM",
    key: "D Minor",
  },
  "Reggaeton RD": {
    bpm: "95-100",
    base: "Dembow beat + reggaeton, 808, dembow loop",
    prompt: "Reggaeton RD, dembow loop, 95 BPM, urban Dominican flow",
    key: "A Minor",
  },
  "Trap Dominicano": {
    bpm: "140-150",
    base: "Trap 808, hi-hats rápidos, piano oscuro, flow RD",
    prompt: "Dominican Trap, 140 BPM, dark 808, fast hi-hats, RD trap flow",
    key: "C# Minor",
  },
  "Drill RD": {
    bpm: "140-145",
    base: "Drill UK + dembow, 808 deslizante",
    prompt: "RD Drill, sliding 808, dark drill, Dominican slang",
    key: "F Minor",
  },
  "Afrobeat RD / Afro-Dembow": {
    bpm: "105-115",
    base: "Afrobeat + dembow, log drum, percusión africana",
    prompt: "Afro-Dembow, afrobeat log drum, dembow, 110 BPM, dance",
    key: "G# Minor",
  },
  "R&B Dominicano": {
    bpm: "80-95",
    base: "R&B suave, piano, guitarra, voz melódica RD",
    prompt: "Dominican R&B, smooth piano, 90 BPM, soulful RD vocals",
    key: "Eb Major",
  },
  "Pop Urbano RD": {
    bpm: "100-110",
    base: "Pop + dembow suave, sintetizadores brillantes",
    prompt: "RD Urban Pop, bright synth, dembow light, 105 BPM, catchy",
    key: "F Major",
  },
  "Gaga / Palo / Atabales": {
    bpm: "110-130",
    base: "Palos, atabales, tambores ancestrales, coro",
    prompt: "Dominican Palo Gaga, atabales drums, ancestral chant, 120 BPM",
    key: "D Minor",
  },
  "Son / Bolero RD": {
    bpm: "85-95",
    base: "Son cubano-dominicano, tres, maracas, bolero",
    prompt: "Dominican Son Bolero, tres guitar, maracas, romantic 90 BPM",
    key: "C Major",
  },
  "Kizomba / Zouk RD": {
    bpm: "95-100",
    base: "Kizomba sensual, bajo suave, percusión",
    prompt: "Kizomba RD, sensual, 98 BPM, smooth bass",
    key: "Bb Minor",
  },
  "Kompa / Zouk": {
    bpm: "110-120",
    base: "Kompa haitiano-dominicano, guitarra, teclado",
    prompt: "Kompa Zouk, guitar, keyboard, 115 BPM, Caribbean",
    key: "Ab Major",
  },
  "Jazz Latino RD": {
    bpm: "90-120",
    base: "Jazz + merengue, saxo, piano, tambora suave",
    prompt: "Latin Jazz RD, sax, piano, tambora soft, 110 BPM",
    key: "Eb Minor",
  },
  "Dembow Romántico": {
    bpm: "110-120",
    base: "Dembow suave + bachata, piano, voz melódica",
    prompt: "Romantic Dembow, soft 808, piano, melodic RD love",
    key: "Db Major",
  },
  "Dembow Rulay / Bellaco": {
    bpm: "130-140",
    base: "Dembow bellaco, 808 agresivo, flow rulay",
    prompt: "Rulay Dembow bellaco, aggressive 808, 135 BPM, street RD",
    key: "G Minor",
  },
  "Villancico RD / Aguinaldo": {
    bpm: "120",
    base: "Aguinaldo, tambora, güira, coro navideño",
    prompt: "Dominican Aguinaldo Villancico, tambora, guira, choir, Christmas",
    key: "G Major",
  },
};

// In-memory catalog state with initial seed hits
let catalogData = [
  {
    id: "track-1",
    ranking: 1,
    titulo: "SE ACERCA EL DOBLE",
    genero: "Dembow Navidad + Perico Ripiao",
    protagonista: "Lic. Pedro Baldera x El Forense",
    lugar: "Los Frailes, Santo Domingo Este",
    bpm: "132 BPM",
    reproducciones: 128400,
    likes: 15900,
    estado: "ÉXITO 🔥 #1",
    distribuido: true,
    fecha: "2026-11-01",
  },
  {
    id: "track-2",
    ranking: 2,
    titulo: "DICIEMBRE RULAY",
    genero: "Dembow Rulay / Bellaco",
    protagonista: "El Forense",
    lugar: "Los Frailes",
    bpm: "136 BPM",
    reproducciones: 24500,
    likes: 4100,
    estado: "ÉXITO 🔥",
    distribuido: true,
    fecha: "2026-11-04",
  },
  {
    id: "track-3",
    ranking: 3,
    titulo: "CÓGELO AHÍ",
    genero: "Dembow Dominicano",
    protagonista: "Lic. Pedro Baldera",
    lugar: "Los Frailes",
    bpm: "128 BPM",
    reproducciones: 11200,
    likes: 2200,
    estado: "ÉXITO 🔥",
    distribuido: true,
    fecha: "2026-11-06",
  },
  {
    id: "track-4",
    ranking: 4,
    titulo: "BACHATA AMARGUE EN LA VECINA",
    genero: "Bachata Tradicional",
    protagonista: "El Forense",
    lugar: "Santo Domingo Este",
    bpm: "126 BPM",
    reproducciones: 8900,
    likes: 1800,
    estado: "Subiendo 📈",
    distribuido: false,
    fecha: "2026-11-08",
  },
  {
    id: "track-5",
    ranking: 5,
    titulo: "PERICO DE LOS FRAILES",
    genero: "Perico Ripiao / Merengue Típico",
    protagonista: "Crew 4 IA x Baldera",
    lugar: "Los Frailes",
    bpm: "148 BPM",
    reproducciones: 6700,
    likes: 1400,
    estado: "Subiendo 📈",
    distribuido: true,
    fecha: "2026-11-10",
  },
];

// Production track generator endpoint with Gemini AI + offline Dominican fallback
app.post('/api/crew-ai/generate', async (req: Request, res: Response) => {
  try {
    const {
      historia = "Se acerca el doble, carro no prende, goma pinchada, vecina rulay, lechón asado, Los Frailes prendío.",
      protagonista = "El Forense",
      lugar = "Los Frailes, Santo Domingo Este",
      genero = "Dembow Navidad + Perico Ripiao",
      modoProd = "full", // "full", "letra", "prompt"
      cantidad = 1,
    } = req.body;

    const genreInfo = GENEROS_RD[genero] || GENEROS_RD["Dembow Dominicano"];
    const results = [];

    for (let i = 0; i < Math.min(Math.max(1, cantidad), 10); i++) {
      let letra = '';
      let promptSuno = '';
      let structureNotes = '';

      if (ai) {
        try {
          const prompt = `Eres el productor de música urbana y folclórica dominicana más cotizado de Los Frailes, Santo Domingo Este (BASA AUDIO VISUAL V11 ULTRA, en colaboración directa con Lic. Pedro Baldera y El Forense).
Genera una producción musical completa con estilo 100% auténtico dominicano callejero y profesional.
Parámetros:
- Género RD: ${genero} (BPM sugerido: ${genreInfo.bpm}, Base: ${genreInfo.base})
- Historia / Premisa: ${historia}
- Protagonista: ${protagonista}
- Ubicación / Barrio: ${lugar}
- Tema #${i + 1} del lote de producción.

Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "titulo": "TÍTULO EN MAYÚSCULAS",
  "bpm": "${genreInfo.bpm}",
  "tonalidad": "${genreInfo.key}",
  "letra": "Letra completa con [Intro], [Verso 1], [Pre-Coro], [Coro - Pegajoso], [Verso 2], [Puente/Mambo], [Outro]. Usa jerga dominicana auténtica de Los Frailes (rulay, pampara, que lo que, de lo mío, coro, doble sueldo, freidora, lechón).",
  "promptSuno": "Prompt en inglés para Suno/Udio que garantice instrumentación exacta: ${genreInfo.prompt}, Story: ${historia}, BPM: ${genreInfo.bpm}, Dominican vocal cadence, radio mix, punchy master",
  "estructura": "Resumen técnico de la instrumentación y arreglos para estudio",
  "potencial": "🔥 Hit Radial / Viral TikTok"
}`;

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Gemini API timeout')), 4500)
          );

          const geminiCall = ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });

          const geminiRes = await Promise.race([geminiCall, timeoutPromise]);
          const parsed = JSON.parse(geminiRes.text || '{}');
          if (parsed.letra && parsed.promptSuno) {
            results.push({
              numero: i + 1,
              titulo: parsed.titulo || `TEMA #${i + 1} - ${genero.toUpperCase()}`,
              bpm: parsed.bpm || genreInfo.bpm,
              tonalidad: parsed.tonalidad || genreInfo.key,
              base: genreInfo.base,
              letra: parsed.letra,
              promptSuno: parsed.promptSuno,
              estructura: parsed.estructura || "Arreglo optimizado para streaming y radio 24/7",
              potencial: parsed.potencial || "🔥 Viral RD",
              genero,
              protagonista,
              lugar,
            });
            continue;
          }
        } catch (genError) {
          console.warn('Gemini generate fallback used:', genError);
        }
      }

      // High-octane authentic Dominican fallback generator
      const titulosPapeleta = [
        "SE ACERCA EL DOBLE",
        "LOS FRAILES PRENDÍO",
        "LA VECINA RULAY",
        "EL LECHÓN EN LA CAJA",
        "LA FREIDORA ENCENDÍA",
        "BAMBAZO DE DICIEMBRE",
        "CORO CON EL FORENSE",
        "PAMPARA EN LOS FRAILES",
      ];
      const selTitulo = titulosPapeleta[(i + Math.floor(Math.random() * 3)) % titulosPapeleta.length];

      letra = `[Intro - ${genero}]
(¡Atención Los Frailes! BASA AUDIO VISUAL V11 ULTRA en los controles)
(Lic. Pedro Baldera x El Forense... ¡esto es producción pura!)
Llegó ${protagonista} marcando territorio en ${lugar},
Se siente el bajo en el pecho, nadie se va a sentar.

[Verso 1]
${historia}
El carro no prendió pero el piquete está intacto,
La güira raspando al tiro, la tambora dando impacto.
Los tigueres en la esquina ya prendieron la bocina,
Y el sazón dominicano se le pega a la vecina.

[Pre-Coro]
Diciembre trae el mambo, la calle huele a fiesta,
El que tenga problema hoy no se molesta.
¡Suelta la tambora, que suene el metal!
¡Que en Los Frailes esto es fiesta nacional!

[Coro - Pegajoso & Radial]
¡Prendan la freidora, llegó la bendición!
${protagonista} en la pista, ¡esto es un vacilón!
${lugar} entero cantando esta canción,
BASA V11 ULTRA, ¡pura producción!
(¡Pégalo ahí! ¡Cúbrete!)

[Verso 2 - Flow Dominicano]
Con el doble en el bolsillo ya no hay drama ni lamento,
El lechón ya ta dorando con to el condimento.
La vecina ta rulay bailando en la acera,
Con Baldera y El Forense aquí nadie se queda afuera.
Goma pinchá pero con flow de un millón,
¡Así se vive y goza en el corazón de la nación!

[Puente - ${genreInfo.base.includes('acordeón') ? 'Solo de Acordeón Típico' : 'Corte de 808 & Mambo'}]
(¡Riiiipia! ¡Jala el fuelle! ¡Dale hasta abajo!)
(Esto no es copia, esto es calibre de Los Frailes)

[Outro]
BASA AUDIO VISUAL V11 ULTRA
Lic. Pedro Baldera x El Forense
Los Frailes, Santo Domingo Este, República Dominicana 🇩🇴
24/7 en vivo... ¡Y esto sigue sin parar!`;

      promptSuno = `${genreInfo.prompt}, Story: ${historia}, Protagonist: ${protagonista}, Location: ${lugar}, BPM ${genreInfo.bpm}, Dominican urban slang, super catchy hook, studio radio master, Los Frailes energy, crisp brass and percussion`;

      results.push({
        numero: i + 1,
        titulo: `${selTitulo} (Vol. ${i + 1})`,
        bpm: genreInfo.bpm,
        tonalidad: genreInfo.key,
        base: genreInfo.base,
        letra,
        promptSuno,
        estructura: `Intro 15s → Verso 1 (8 barras) → Coro (16 barras) → Verso 2 → Corte instrumental ${genreInfo.base} → Outro`,
        potencial: i === 0 ? "🔥 Hit Radial #1" : "🚀 Viral TikTok RD",
        genero,
        protagonista,
        lugar,
      });
    }

    res.json({ success: true, count: results.length, tracks: results });
  } catch (error) {
    console.error('Error generating tracks:', error);
    res.status(500).json({ success: false, error: 'Error generating tracks' });
  }
});

// Catalog endpoints
app.get('/api/catalog', (req: Request, res: Response) => {
  res.json({ success: true, catalog: catalogData });
});

app.post('/api/catalog', (req: Request, res: Response) => {
  const { titulo, genero, reproducciones = 0, likes = 0, protagonista = "El Forense", lugar = "Los Frailes" } = req.body;
  if (!titulo || !genero) {
    return res.status(400).json({ error: "Título y género son obligatorios" });
  }

  const genreInfo = GENEROS_RD[genero] || { bpm: "130 BPM" };

  const newTrack = {
    id: `track-${Date.now()}`,
    ranking: catalogData.length + 1,
    titulo: String(titulo).toUpperCase(),
    genero,
    protagonista,
    lugar,
    bpm: genreInfo.bpm,
    reproducciones: Number(reproducciones) || 0,
    likes: Number(likes) || 0,
    estado: "Nuevo 🆕",
    distribuido: false,
    fecha: new Date().toISOString().split('T')[0],
  };

  catalogData.push(newTrack);
  res.json({ success: true, track: newTrack, total: catalogData.length });
});

// Update like count or track status
app.patch('/api/catalog/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const track = catalogData.find((t) => t.id === id);
  if (!track) {
    return res.status(404).json({ error: "Track no encontrado" });
  }

  if (req.body.like) {
    track.likes += 1;
  }
  if (req.body.reproducciones) {
    track.reproducciones += Number(req.body.reproducciones);
  }
  if (req.body.distribuido !== undefined) {
    track.distribuido = Boolean(req.body.distribuido);
  }
  if (req.body.estado) {
    track.estado = String(req.body.estado);
  }

  res.json({ success: true, track });
});

// Monitor data endpoint
app.get('/api/monitor', (req: Request, res: Response) => {
  const now = new Date();
  const baseListeners = 420;
  const minuteVariation = Math.floor(Math.sin(now.getMinutes() / 5) * 80);
  const randomJitter = Math.floor(Math.random() * 40 - 20);
  const activeListeners = Math.max(180, baseListeners + minuteVariation + randomJitter);

  res.json({
    timestamp: now.toISOString(),
    formattedTime: now.toLocaleTimeString('es-DO', { hour12: true }),
    station: "BASA AUDIO VISUAL V11 ULTRA",
    location: "Los Frailes, Santo Domingo Este, RD 🇩🇴",
    producers: "Lic. Pedro Baldera x El Forense",
    listenersNow: activeListeners,
    listenersDelta: "+18% vs hora previa",
    playsToday: 18450 + Math.floor(now.getSeconds() * 3.5),
    playsDelta: "+24% tendencia alta",
    newFollowers: 86 + Math.floor(now.getMinutes() / 2),
    estimatedRevenueUsd: 142.50 + (now.getHours() * 3.2),
    estimatedRevenueDop: (142.50 + (now.getHours() * 3.2)) * 60.5,
    queueCount: 6,
    activeTransmission: "24/7 EN VIVO ININTERRUMPIDO",
    healthStatus: "100% OPERACIONAL - TASA DE BIT: 320 KBPS AAC+",
  });
});

// Mount Vite or serve production build
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 BASA AUDIO VISUAL V11 ULTRA server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
