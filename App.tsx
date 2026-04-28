import { useState, useEffect, useRef } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const TOTAL_PHOTOS = 13;

// Ahmedabad → Patna coordinates
const AHMEDABAD: [number, number] = [23.0225, 72.5714];
const PATNA: [number, number] = [25.5941, 85.1376];

const QUIZ_QUESTIONS = [
  { q: "What would we eat on a date?", o: ["Pizza", "Ice Cream", "Pasta", "Momos"], a: 1 },
  { q: "Where would we like to go?", o: ["Mall", "Garden", "Cafe", "Movie Theatre"], a: 1 },
  { q: "What do I like the most?", o: ["Roasting you", "Arguing with you", "Teasing you", "Listening to you"], a: 0 },
  { q: "Which movie will we watch together?", o: ["Action", "Comedy", "Horror or Romantic", "Sci-Fi"], a: 2 },
  { q: "How did we meet?", o: ["Through school", "On Instagram", "It was grammer", "Through a friend"], a: 2 },
];

const WALL_OF_LOVE = [
  { msg: "You're the sister I never had 💕", emoji: "👭" },
  { msg: "Life is sweeter because of you 🍯", emoji: "🌸" },
  { msg: "Together we're unstoppable! 💪", emoji: "✨" },
  { msg: "Thank you for every laugh 😂", emoji: "💝" },
  { msg: "You make ordinary days extraordinary 🌟", emoji: "🌺" },
];

const SONGS = [
  { name: "Maan Meri Jaan", artist: "King", file: "1.mp3" },
  { name: "Tu Hai Kahan", artist: "AUR", file: "2.mp3" },
  { name: "Tera Ban Jaunga", artist: "Akhil Sachdeva", file: "3.mp3" },
  { name: "Raabta", artist: "Arijit Singh", file: "4.mp3" },
  { name: "Tum Hi Ho", artist: "Arijit Singh", file: "5.mp3" },
  { name: "Pehla Pyaar", artist: "Armaan Malik", file: "6.mp3" },
  { name: "Hasi Ban Gaye", artist: "Shreya Ghoshal", file: "7.mp3" },
  { name: "Ishq Wala Love", artist: "Vishal-Shekhar", file: "8.mp3" },
  { name: "Kesariya", artist: "Arijit Singh", file: "9.mp3" },
  { name: "Apna Bana Le", artist: "Arijit Singh", file: "10.mp3" },
];

// ─── Floating Particles ─────────────────────────────────────────────────────
function FloatingHearts() {
  const symbols = ["♥", "✿", "❀", "✧", "♡", "✦", "🌸", "💖", "💕", "🦋", "🌺", "✨"];
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${18 + Math.random() * 25}s`,
            fontSize: `${10 + Math.random() * 28}px`,
          }}
        >
          <span className="block opacity-15">{symbols[i % symbols.length]}</span>
        </div>
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translateY(110vh) rotate(0deg) scale(0.8); opacity: 0; }
          10% { opacity: 0.15; }
          90% { opacity: 0.15; }
          100% { transform: translateY(-100px) rotate(720deg) scale(1.2); opacity: 0; }
        }
        .animate-float { animation: float linear infinite; }
      `}</style>
    </div>
  );
}

// ─── Sparkle Cursor ─────────────────────────────────────────────────────────
function SparkleCursor() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const sparkle = document.createElement("div");
      sparkle.className = "pointer-events-none fixed z-[100] text-2xl animate-sparkle";
      sparkle.textContent = ["✨", "💖", "🌟", "💕", "🌸", "💫"][Math.floor(Math.random() * 6)];
      sparkle.style.left = `${e.clientX}px`;
      sparkle.style.top = `${e.clientY}px`;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1000);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <style>{`
      @keyframes sparkleFade {
        0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-80px) scale(1.5) rotate(180deg); opacity: 0; }
      }
      .animate-sparkle { animation: sparkleFade 1s ease-out forwards; }
    `}</style>
  );
}

// ─── Background Music Player ────────────────────────────────────────────────
function BgMusicPlayer({ 
  isMuted, 
  onToggleMute, 
  shouldPause,
  audioRef 
}: { 
  isMuted: boolean; 
  onToggleMute: () => void; 
  shouldPause: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}) {
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (shouldPause || isMuted) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
    }
  }, [shouldPause, isMuted, audioRef]);

  return (
    <div className="fixed top-20 right-4 z-50">
      <button
        onClick={onToggleMute}
        className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isMuted
            ? "bg-slate-800/80 border border-slate-600 text-slate-400 hover:bg-slate-700/80"
            : "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/40 hover:shadow-pink-500/60 hover:scale-110"
        }`}
        title={isMuted ? "Unmute background music" : "Mute background music"}
      >
        {!isMuted && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-pink-400" />
        )}
        {isMuted ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        )}
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isMuted ? "Unmute 🎵" : "Mute 🔇"}
        </span>
      </button>
    </div>
  );
}

// ─── Animated Route Map ─────────────────────────────────────────────────────
function RouteMap() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 0.3, 100));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const toSvgX = (lng: number) => ((lng - 68) / 22) * 100;
  const toSvgY = (lat: number) => ((35 - lat) / 25) * 100;

  const startX = toSvgX(AHMEDABAD[1]);
  const startY = toSvgY(AHMEDABAD[0]);
  const endX = toSvgX(PATNA[1]);
  const endY = toSvgY(PATNA[0]);

  const midX = (startX + endX) / 2 - 8;
  const midY = (startY + endY) / 2 - 5;
  const pathD = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

  const getDotPosition = () => {
    const t = progress / 100;
    const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
    const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * endY;
    return { x, y };
  };

  const dotPos = getDotPosition();

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-500/30 px-5 py-2 rounded-full text-fuchsia-300 text-sm mb-4">
            <span>🗺️</span><span>Our Journey</span><span>🗺️</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
            Connected by Heart
          </h2>
          <p className="text-slate-400 text-lg">From Ahmedabad to Patna — distance means nothing when someone means everything 💕</p>
        </div>

        <div className="relative bg-gradient-to-br from-slate-900/80 via-purple-900/50 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl shadow-pink-500/10 overflow-hidden">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="absolute z-10 flex flex-col items-center" style={{ left: `${startX}%`, top: `${startY}%`, transform: "translate(-50%, -50%)" }}>
              <div className="relative">
                <div className="w-5 h-5 bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-full shadow-lg shadow-fuchsia-400/50 animate-pulse" />
                <div className="absolute inset-0 w-5 h-5 bg-fuchsia-400 rounded-full animate-ping opacity-30" />
              </div>
              <span className="mt-2 text-xs font-bold text-fuchsia-300 bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur border border-fuchsia-500/30">🏠 Ahmedabad</span>
            </div>

            <div className="absolute z-10 flex flex-col items-center" style={{ left: `${endX}%`, top: `${endY}%`, transform: "translate(-50%, -50%)" }}>
              <div className="relative">
                <div className="w-5 h-5 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full shadow-lg shadow-pink-400/50 animate-pulse" />
                <div className="absolute inset-0 w-5 h-5 bg-pink-400 rounded-full animate-ping opacity-30" />
              </div>
              <span className="mt-2 text-xs font-bold text-pink-300 bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur border border-pink-500/30">🎯 Patna</span>
            </div>

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d946ef" stopOpacity="0.2" />
                  <stop offset="25%" stopColor="#ec4899" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#f43f5e" stopOpacity="1" />
                  <stop offset="75%" stopColor="#ec4899" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#d946ef" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                <filter id="strongGlow"><feGaussianBlur stdDeviation="4" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <path d={pathD} fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="1.5" strokeDasharray="3 5" />
              <path d={pathD} fill="none" stroke="url(#routeGlow)" strokeWidth="2.5" strokeDasharray={progress > 0 ? `${progress * 1.5} 200` : "0 200"} strokeLinecap="round" filter="url(#glow)" style={{ transition: "stroke-dasharray 0.1s linear" }} />
              <path d={pathD} fill="none" stroke="#f472b6" strokeWidth="5" strokeDasharray={progress > 0 ? `${progress * 1.5} 200` : "0 200"} strokeLinecap="round" opacity="0.2" filter="url(#strongGlow)" style={{ transition: "stroke-dasharray 0.1s linear" }} />
              <circle cx={dotPos.x} cy={dotPos.y} r="3.5" fill="#f472b6" filter="url(#strongGlow)"><animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" /></circle>
              <circle cx={dotPos.x} cy={dotPos.y} r="2" fill="#fff" />
            </svg>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-fuchsia-300 font-medium">Ahmedabad</span>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  <span className="text-white font-bold">~1,200 km</span>
                  <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
                <span className="text-pink-300 font-medium">Patna</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-fuchsia-400" /> Journey begins</span>
              <span className="text-pink-400 font-semibold">❤️ {Math.round(progress)}% complete</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-400" /> Almost there</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 rounded-full transition-all duration-200 relative" style={{ width: `${progress}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-white rounded-full shadow-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm italic">✨ No matter the distance, our hearts are always together ✨</p>
        </div>
      </div>
    </section>
  );
}

// ─── Photo Album ─────────────────────────────────────────────────────────────
function PhotoAlbum() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [albumOpen, setAlbumOpen] = useState(false);

  const handleImageError = (num: number) => setFailedImages((prev) => new Set([...prev, num]));
  const visiblePhotos = Array.from({ length: TOTAL_PHOTOS }, (_, i) => i + 1).filter((n) => !failedImages.has(n));

  if (!albumOpen) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 px-5 py-2 rounded-full text-pink-300 text-sm mb-4">
            <span>📸</span><span>Memories</span><span>📸</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">Our Memory Album</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">Every photo holds a beautiful story. Let's relive those precious moments together...</p>
          <button onClick={() => setAlbumOpen(true)} className="group relative px-10 py-5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full font-semibold text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all hover:scale-105 overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-3 text-lg">📖 Open the Album</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 px-5 py-2 rounded-full text-pink-300 text-sm mb-4">
            <span>📸</span><span>{visiblePhotos.length} Memories</span><span>📸</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">Our Beautiful Moments</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Click on any photo to view it full size ✨</p>
        </div>

        <div className="relative mb-12 mx-auto max-w-lg group">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-pink-500/20 border-2 border-pink-400/30 transition-transform duration-500 group-hover:scale-[1.02]">
            <img src="/images/album-cover.png" alt="Album Cover" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 px-8 py-3 rounded-full text-white font-bold shadow-xl whitespace-nowrap animate-pulse">✨ Our Story ✨</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
          {visiblePhotos.map((num, idx) => (
            <div key={num} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-pink-500/40" style={{ animationDelay: `${idx * 0.08}s` }} onClick={() => setSelectedPhoto(num)}>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-600/90 via-pink-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10" />
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-pink-400 transition-colors z-20" />
              <div className="absolute top-2 left-2 z-30 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-pink-600 shadow-lg">#{num}</div>
              <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"><span className="text-xl">💕</span></div>
              <img src={`/images/${num}.jpg`} alt={`Memory ${num}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={() => handleImageError(num)} />
              <div className="absolute inset-0 flex items-end justify-center pb-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"><span className="text-white font-bold text-sm flex items-center gap-2"><span>View Memory</span><span className="text-lg">💕</span></span></div>
            </div>
          ))}
        </div>

        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedPhoto(null)}>
            <button onClick={() => setSelectedPhoto(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all flex items-center justify-center z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); const prev = visiblePhotos[visiblePhotos.indexOf(selectedPhoto) - 1]; if (prev) setSelectedPhoto(prev); }} className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all flex items-center justify-center z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); const next = visiblePhotos[visiblePhotos.indexOf(selectedPhoto) + 1]; if (next) setSelectedPhoto(next); }} className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all flex items-center justify-center z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <img src={`/images/${selectedPhoto}.jpg`} alt={`Memory ${selectedPhoto}`} className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500/90 to-rose-500/90 backdrop-blur-md px-6 py-3 rounded-full text-white font-medium flex items-center gap-2">
              <span>📷</span><span>Memory #{selectedPhoto} of {TOTAL_PHOTOS}</span>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }.animate-fadeIn { animation: fadeIn 0.3s ease-out; }`}</style>
    </section>
  );
}

// ─── Love Meter ──────────────────────────────────────────────────────────────
function LoveMeter() {
  const [level, setLevel] = useState(0);
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    let count = 0;
    const interval = setInterval(() => { count++; setLevel(count); if (count >= 100) clearInterval(interval); }, 25);
  };

  const getMood = () => {
    if (level === 0) return { text: "😊 Press to see!", emoji: "🤔" };
    if (level < 25) return { text: "🌱 Growing stronger...", emoji: "💫" };
    if (level < 50) return { text: "🌸 Beautiful friendship!", emoji: "🌺" };
    if (level < 75) return { text: "💕 So much love!", emoji: "💖" };
    if (level < 100) return { text: "🔥 Almost infinite!", emoji: "💗" };
    return { text: "💖 INFINITE LOVE FOREVER!!! 💖", emoji: "🔥" };
  };

  const mood = getMood();

  return (
    <section className="py-20 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 px-5 py-2 rounded-full text-pink-300 text-sm mb-4">
          <span>💝</span><span>Love Calculator</span><span>💝</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-8">How Much I Care?</h2>
        <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-pink-500/10">
          <div className="absolute top-4 left-4 text-2xl opacity-30">💕</div>
          <div className="absolute top-4 right-4 text-2xl opacity-30">💖</div>
          <div className="absolute bottom-4 left-4 text-2xl opacity-30">💗</div>
          <div className="absolute bottom-4 right-4 text-2xl opacity-30">💕</div>
          <div className="relative w-56 h-56 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 blur-xl" />
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="8" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="url(#loveGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(level / 100) * 276} 276`} className="transition-all duration-100" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
              <defs><linearGradient id="loveGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f43f5e" /><stop offset="50%" stopColor="#d946ef" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-6xl mb-2">{mood.emoji}</span>
              <span className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">{level}%</span>
            </div>
          </div>
          <p className={`text-xl mb-6 font-semibold transition-all duration-300 ${level >= 100 ? "text-pink-400 animate-pulse" : "text-slate-300"}`}>{mood.text}</p>
          {!pressed ? (
            <button onClick={handleClick} className="group relative px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full font-semibold text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all hover:scale-105 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">💖 Click to Measure!</span>
            </button>
          ) : (
            <div className="text-sm text-slate-400 bg-white/5 rounded-full px-6 py-3 inline-block"><span className="text-pink-300 font-semibold">It's off the charts!</span> 😄💕</div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Quiz ────────────────────────────────────────────────────────────────────
function FriendshipQuiz() {
  const [started, setStarted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const currentQ = QUIZ_QUESTIONS[qIdx];

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === currentQ.a) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx + 1 < QUIZ_QUESTIONS.length) { setQIdx((i) => i + 1); setSelectedAnswer(null); }
      else setFinished(true);
    }, 700);
  };

  if (!started) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-5 py-2 rounded-full text-purple-300 text-sm mb-4">
            <span>🎮</span><span>Fun Time</span><span>🎮</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">Friendship Quiz</h2>
          <p className="text-slate-400 mb-8 text-lg">How well do you know us? Let's find out! 💕</p>
          <button onClick={() => setStarted(true)} className="group px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105">🎯 Start Quiz!</button>
        </div>
      </section>
    );
  }

  if (finished) {
    const grade = score >= 4 ? { emoji: "🏆", text: "BEST FRIENDS FOREVER!", color: "from-yellow-400 to-amber-400" } : score >= 2 ? { emoji: "🌟", text: "Good Friends!", color: "from-purple-400 to-pink-400" } : { emoji: "🌱", text: "Still Learning!", color: "from-green-400 to-emerald-400" };
    return (
      <section className="py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <span className="text-7xl mb-6 block animate-bounce">{grade.emoji}</span>
          <h2 className="text-3xl font-bold text-white mb-6">Quiz Complete!</h2>
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <p className={`text-6xl font-bold bg-gradient-to-r ${grade.color} bg-clip-text text-transparent mb-4`}>{score}/{QUIZ_QUESTIONS.length}</p>
            <p className={`text-2xl font-bold bg-gradient-to-r ${grade.color} bg-clip-text text-transparent`}>{grade.text}</p>
            <button onClick={() => { setStarted(false); setQIdx(0); setScore(0); setFinished(false); setSelectedAnswer(null); }} className="mt-8 px-8 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all flex items-center gap-2 mx-auto">🔄 Play Again</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <span className="text-sm text-slate-500">Question {qIdx + 1} of {QUIZ_QUESTIONS.length}</span>
          <div className="h-2 bg-slate-800 rounded-full mt-2 overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300" style={{ width: `${((qIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <h3 className="text-xl font-semibold text-white text-center mb-8 leading-relaxed">{currentQ.q}</h3>
          <div className="space-y-3">
            {currentQ.o.map((opt, idx) => {
              let bg = "bg-white/5 hover:bg-white/10 border-white/10 hover:border-purple-400/50";
              if (selectedAnswer !== null) {
                if (idx === currentQ.a) bg = "bg-emerald-500/20 border-emerald-400 text-emerald-300";
                else if (idx === selectedAnswer) bg = "bg-rose-500/20 border-rose-400 text-rose-300";
                else bg = "bg-white/5 border-white/10 opacity-40";
              }
              return (
                <button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedAnswer !== null} className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${bg}`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedAnswer !== null && idx === currentQ.a ? "bg-emerald-500 text-white" : selectedAnswer !== null && idx === selectedAnswer ? "bg-rose-500 text-white" : "bg-white/10 text-slate-400"}`}>{String.fromCharCode(65 + idx)}</span>
                  <span className="text-white flex-1">{opt}</span>
                  {selectedAnswer !== null && idx === currentQ.a && <span className="text-xl">✅</span>}
                  {selectedAnswer !== null && idx === selectedAnswer && idx !== currentQ.a && <span className="text-xl">❌</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Wall of Love ────────────────────────────────────────────────────────────
function WallOfLove() {
  const [messages, setMessages] = useState(WALL_OF_LOVE);
  const [newMsg, setNewMsg] = useState("");
  const addMessage = () => {
    if (!newMsg.trim()) return;
    const emojis = ["💖", "💕", "💗", "💓", "🌸", "🌺", "✨", "🌟", "💝", "🌷", "🦋", "💫"];
    setMessages((prev) => [...prev, { msg: newMsg, emoji: emojis[Math.floor(Math.random() * emojis.length)] }]);
    setNewMsg("");
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/30 px-5 py-2 rounded-full text-amber-300 text-sm mb-4">
            <span>📝</span><span>Messages</span><span>📝</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent mb-4">Wall of Love</h2>
          <p className="text-slate-400 text-lg">Drop a sweet message for her! 💕</p>
        </div>
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl mb-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addMessage()} placeholder="Write something sweet..." className="flex-1 bg-slate-800/50 text-white placeholder-slate-500 rounded-2xl px-5 py-4 border border-white/10 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all text-lg" />
            <button onClick={addMessage} className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl font-semibold text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all hover:scale-105 whitespace-nowrap flex items-center justify-center gap-2"><span>💌</span><span>Send Love</span></button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {messages.map((item, i) => (
            <div key={i} className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-pink-400/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-500/10" style={{ animation: `fadeUp 0.5s ease-out ${i * 0.08}s both` }}>
              <div className="flex items-start gap-3"><span className="text-3xl group-hover:scale-110 transition-transform duration-300">{item.emoji}</span><p className="text-slate-200 leading-relaxed flex-1">{item.msg}</p></div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </section>
  );
}

// ─── Music Player (Local MP3 Files) ─────────────────────────────────────────
function MusicPlayer({ onPlayChange, onPause }: { onPlayChange: () => void; onPause: () => void }) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setCurrentTrack((prev) => (prev + 1) % SONGS.length);
      setIsPlaying(true);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().then(() => onPlayChange()).catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      onPause();
    }
  }, [isPlaying, currentTrack, onPlayChange, onPause]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % SONGS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = parseFloat(e.target.value);
      setProgress(audio.currentTime);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-5 py-2 rounded-full text-green-300 text-sm mb-4">
          <span>🎵</span><span>Playlist</span><span>🎵</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">Our Songs</h2>
        <p className="text-slate-400 mb-8 text-lg">A playlist made with love — click play and enjoy!</p>

        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
          {/* Hidden audio element */}
          <audio ref={audioRef} src={`/music/${SONGS[currentTrack].file}`} preload="metadata" />

          {/* Album art placeholder */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg shadow-green-500/10 border border-white/5">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`text-8xl transition-all duration-500 ${isPlaying ? "scale-110 animate-pulse" : "scale-100"}`}>🎵</div>
            </div>
            {isPlaying && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full">
                <span className="text-xs text-green-400 font-medium">Playing</span>
                <span className="flex gap-0.5">
                  {[1, 2, 3].map((n) => (
                    <span key={n} className="w-1 bg-green-400 rounded-full animate-equalizer" style={{ height: `${8 + n * 4}px`, animationDelay: `${n * 0.15}s` }} />
                  ))}
                </span>
              </div>
            )}
            {/* Rotating vinyl effect */}
            <div className={`absolute inset-0 rounded-2xl border-2 border-green-500/20 ${isPlaying ? "animate-spin-slow" : ""}`} style={{ animationDuration: "3s" }} />
          </div>

          {/* Song info */}
          <div className="mb-5">
            <p className="text-xl font-bold text-white mb-1">{SONGS[currentTrack].name}</p>
            <p className="text-sm text-slate-400">{SONGS[currentTrack].artist}</p>
          </div>

          {/* Progress bar with seek */}
          <div className="mb-6">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-green-400"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playlist */}
          <div className="mb-6 max-h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-2">
            {SONGS.map((song, i) => (
              <button
                key={i}
                onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                  i === currentTrack ? "bg-green-500/20 border border-green-500/40 text-green-300" : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <span className="text-lg">{i === currentTrack && isPlaying ? "▶️" : "🎵"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{song.name}</p>
                  <p className="text-xs text-slate-500">{song.artist}</p>
                </div>
                {i === currentTrack && isPlaying && (
                  <span className="flex gap-0.5 items-end">
                    {[1, 2, 3].map((n) => (
                      <span key={n} className="w-1 bg-green-400 rounded-full animate-equalizer" style={{ height: `${6 + n * 3}px`, animationDelay: `${n * 0.15}s` }} />
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <button onClick={prevTrack} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
            </button>
            <button onClick={handlePlayPause} className="w-18 h-18 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-400/40 hover:shadow-green-400/60 hover:scale-105 transition-all">
              {isPlaying ? <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
            </button>
            <button onClick={nextTrack} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-4">Add MP3 files to public/music/ folder (1.mp3 to 10.mp3) 🎧</p>
      </div>

      <style>{`
        @keyframes equalizer { 0%, 100% { transform: scaleY(0.5); } 50% { transform: scaleY(1); } }
        .animate-equalizer { animation: equalizer 0.8s ease-in-out infinite; display: inline-block; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow linear infinite; }
      `}</style>
    </section>
  );
}

// ─── Decorated Letter (Personalized from Jatin) ─────────────────────────────
function DecoratedLetter() {
  const [isVisible, setIsVisible] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.15 });
    if (letterRef.current) observer.observe(letterRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-4" ref={letterRef}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 px-5 py-2 rounded-full text-amber-300 text-sm mb-4">
            <span>💌</span><span>For You</span><span>💌</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-rose-400 to-pink-400 bg-clip-text text-transparent mb-4">A Letter For You</h2>
          <p className="text-slate-400 text-lg">Words from my heart to yours 💝</p>
        </div>

        <div className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Corner decorations */}
          <div className="absolute -top-6 -left-6 text-4xl animate-bounce" style={{ animationDuration: "2s" }}>💝</div>
          <div className="absolute -top-6 -right-6 text-4xl animate-bounce" style={{ animationDuration: "2s", animationDelay: "0.5s" }}>💝</div>
          <div className="absolute -bottom-6 -left-6 text-4xl animate-bounce" style={{ animationDuration: "2s", animationDelay: "1s" }}>💝</div>
          <div className="absolute -bottom-6 -right-6 text-4xl animate-bounce" style={{ animationDuration: "2s", animationDelay: "1.5s" }}>💝</div>

          {/* Letter body */}
          <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg, #fef7f0 0%, #fff5f5 50%, #fdf2f8 100%)", boxShadow: "0 25px 50px -12px rgba(244, 63, 94, 0.2), 0 0 0 1px rgba(244, 63, 94, 0.15)" }}>
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img src="/images/letter-bg.png" alt="" className="absolute top-0 left-0 w-48 opacity-25 -rotate-12" />
              <img src="/images/letter-bg.png" alt="" className="absolute bottom-0 right-0 w-48 opacity-25 rotate-12 scale-x-[-1]" />
              <div className="absolute top-4 right-8 text-6xl opacity-8">🌸</div>
              <div className="absolute bottom-4 left-8 text-6xl opacity-8 rotate-180">🌸</div>
              <div className="absolute top-1/4 left-4 text-4xl opacity-8">✨</div>
              <div className="absolute bottom-1/4 right-4 text-4xl opacity-8">✨</div>
            </div>

            {/* Letter content */}
            <div className="relative z-10">
              {/* Header badge */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-100 to-rose-100 px-8 py-3 rounded-full border border-pink-200 shadow-md">
                  <span className="text-xl">✨</span>
                  <span className="text-pink-600 font-bold text-sm uppercase tracking-widest">With Love</span>
                  <span className="text-xl">✨</span>
                </div>
              </div>

              {/* Letter text */}
              <div className="space-y-6 text-slate-700 leading-relaxed" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                {/* Opening */}
                <p className="text-lg font-semibold text-pink-600">Hey Beta,</p>
                
                <p className="text-base">
                  It's me, your Jatin. I have made this letter to just tell you how much I love you. Words sometimes fall short, but I want you to know that you mean everything to me. 💕
                </p>

                {/* Birthday Wish */}
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 my-8 border border-pink-200">
                  <p className="text-xl font-bold text-center text-pink-600 mb-2">🎂 Happiest Birthday Beta! 🎂</p>
                  <p className="text-center text-slate-600">May you get fulfilled your each and every wish, and lots of love from far... 💝</p>
                </div>

                {/* English Lines */}
                <div className="space-y-4">
                  <p className="text-base italic text-center text-pink-600 font-semibold">
                    "In the garden of life, you are the most beautiful flower that blooms in my heart forever." 🌸
                  </p>
                  
                  <p className="text-base">
                    Beta, you are not just a friend to me — you are my family, my confidant, my partner in crime, and the person who makes every moment special. Your smile lights up my darkest days, and your laughter is the sweetest melody I know.
                  </p>

                  <p className="text-base">
                    Distance may separate us physically, but our hearts are connected by an unbreakable bond. Every memory we've shared is a treasure I hold close to my soul. From our silly jokes to our deep conversations, everything with you is precious.
                  </p>

                  <p className="text-base italic text-center text-pink-600 font-semibold">
                    "You are the reason I believe in magic, because how else could someone as wonderful as you exist?" ✨
                  </p>
                </div>

                {/* Hindi Lines */}
                <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl p-6 my-8 border border-amber-200">
                  <p className="text-center text-lg font-semibold text-amber-700 mb-4">🌺 कुछ ख़ास आपके लिए 🌺</p>
                  
                  <p className="text-base text-center text-slate-700 leading-loose">
                    "तुम हो तो हर पल खूबसूरत लगता है,<br/>
                    तुम्हारी यादों से हर दिन सूरत लगता है,<br/>
                    दूरियां तो बस मिटाफे की लकीरें हैं,<br/>
                    दिल से दिल का रिश्ता तो और भी मज़बूत लगता है..." 💕
                  </p>

                  <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto my-6" />

                  <p className="text-base text-center text-slate-700 leading-loose">
                    "फूलों ने अमृत का जाम भेजा है,<br/>
                    सूरज ने गगन से सलाम भेजा है,<br/>
                    मुबारक हो आपको ये ख़ास दिन,<br/>
                    तहे-दिल से हमने ये पैगाम भेजा है..." 🎂
                  </p>

                  <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto my-6" />

                  <p className="text-base text-center text-slate-700 leading-loose">
                    "दूर रहकर भी पास हो तुम,<br/>
                    मेरे दिल के सबसे खास हो तुम,<br/>
                    भगवान करे खुशियां तुम्हारे कदम चूमें,<br/>
                    क्योंकि दोस्ती में सबसे अनमोल हो तुम..." 💖
                  </p>
                </div>

                {/* More English Lines */}
                <div className="space-y-4">
                  <p className="text-base">
                    Beta, on this special day of yours, I want you to know that you are loved more than words can express. You bring so much joy, warmth, and light into the lives of everyone around you. Never forget how special you are.
                  </p>

                  <p className="text-base italic text-center text-pink-600 font-semibold">
                    "May your birthday be as beautiful and extraordinary as you are!" 🌟
                  </p>

                  <p className="text-base">
                    I pray that this year brings you endless happiness, success in everything you do, good health, and all the love your heart can hold. May every dream you chase find its way to you, and may every challenge make you stronger.
                  </p>

                  <p className="text-base">
                    Remember, no matter where you are or what you're going through, I'm always here for you. Our bond is eternal, and my love for you is unconditional. You will always have a home in my heart.
                  </p>

                  <p className="text-base italic text-center text-pink-600 font-semibold">
                    "Stars shine bright because you were born, and the world became a better place that day!" ⭐
                  </p>
                </div>

                {/* Closing */}
                <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-pink-300 to-transparent mx-auto my-10" />

                <p className="text-center"><span className="text-4xl">🌷 🌷 🌷</span></p>

                <p className="text-lg italic text-center text-pink-600">"Friends are the family we choose for ourselves."</p>

                <div className="text-right mt-12">
                  <p className="text-lg font-semibold text-slate-600">Forever & Always,</p>
                  <p className="text-3xl font-bold text-pink-500 mt-3">Your Jatin 💗</p>
                  <div className="mt-6 text-5xl">💋</div>
                  <p className="text-sm text-slate-500 mt-4">With all my love and blessings 🙏</p>
                </div>
              </div>

              {/* Bottom hearts */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-4">
                  {["💖", "💕", "💗", "💕", "💖"].map((emoji, i) => (
                    <span key={i} className="text-3xl animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>{emoji}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isBgMuted, setIsBgMuted] = useState(true); // Start muted by default
  const [isMusicPlayerActive, setIsMusicPlayerActive] = useState(false);
  const bgAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const sections = [
    { id: "album", label: "Album", emoji: "📸" },
    { id: "route", label: "Route", emoji: "🗺️" },
    { id: "meter", label: "Love", emoji: "💝" },
    { id: "quiz", label: "Quiz", emoji: "🎮" },
    { id: "wall", label: "Wall", emoji: "📝" },
    { id: "music", label: "Music", emoji: "🎵" },
    { id: "letter", label: "Letter", emoji: "💌" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/50 to-slate-950 text-slate-100 overflow-x-hidden">
      <FloatingHearts />
      <SparkleCursor />

      {/* Background Music (Looping) */}
      <audio ref={bgAudioRef} src="/music/2.mp3" loop />

      {/* Background Music Player Control */}
      <BgMusicPlayer
        isMuted={isBgMuted}
        onToggleMute={() => setIsBgMuted(!isBgMuted)}
        shouldPause={isMusicPlayerActive}
        audioRef={bgAudioRef}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-pink-500/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <span className="text-xl">💕</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">For You</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm overflow-x-auto pb-1 max-w-2xl">
            {sections.map((s) => (
              <button key={s.id} onClick={() => scrollTo(s.id)} className="px-3 py-2 rounded-xl text-slate-400 hover:text-pink-400 hover:bg-white/5 transition-all whitespace-nowrap flex items-center gap-1.5">
                <span>{s.emoji}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 relative">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-8 inline-flex items-center gap-3 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 px-6 py-3 rounded-full text-pink-300 text-sm animate-pulse shadow-lg shadow-pink-500/10">
            <span>✨</span><span className="font-medium">Something Special For You</span><span>✨</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">For My Dear</span>
            <br />
            <span className="text-white">Best Friend</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            This is my way of saying thank you for being the most amazing friend anyone could ever ask for. You mean the world to me. 💕
          </p>
          <div className="flex items-center justify-center gap-4 mb-12 text-5xl">
            {["💖", "💕", "💗", "💓", "💖"].map((e, i) => (
              <span key={i} className="animate-bounce inline-block" style={{ animationDelay: `${i * 0.12}s` }}>{e}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button onClick={() => scrollTo("album")} className="group px-10 py-5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full font-bold text-white text-lg shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 transition-all hover:scale-105 flex items-center gap-3">
              <span>📸</span><span>View Our Memories</span>
            </button>
            <button onClick={() => scrollTo("letter")} className="group px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full font-bold text-white text-lg hover:bg-white/20 transition-all hover:scale-105 flex items-center gap-3">
              <span>💌</span><span>Read My Letter</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <span className="text-sm font-medium">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-1">
              <div className="w-1.5 h-3 bg-pink-400 rounded-full animate-scroll" />
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <div id="album"><PhotoAlbum /></div>
      <div id="route"><RouteMap /></div>
      <div id="meter"><LoveMeter /></div>
      <div id="quiz"><FriendshipQuiz /></div>
      <div id="wall"><WallOfLove /></div>
      <div id="music"><MusicPlayer onPlayChange={() => setIsMusicPlayerActive(true)} onPause={() => setIsMusicPlayerActive(false)} /></div>
      <div id="letter"><DecoratedLetter /></div>

      {/* Footer */}
      <footer className="py-16 text-center border-t border-white/10 bg-slate-950/50">
        <div className="space-y-6">
          <div className="text-5xl animate-pulse">💕</div>
          <p className="text-slate-300 text-lg">Made with infinite love by Jatin, just for you</p>
          <p className="text-sm text-slate-600">Our friendship is forever ✨</p>
          <div className="flex items-center justify-center gap-2 text-slate-600 text-xs">
            <span>Built with</span><span className="text-pink-400">💖</span><span>• React + Tailwind</span>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-2xl shadow-pink-500/40 flex items-center justify-center text-white hover:scale-110 transition-all">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
        </button>
      )}

      <style>{`@keyframes scroll { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(8px); opacity: 0; } }.animate-scroll { animation: scroll 1.5s ease-in-out infinite; }`}</style>
    </div>
  );
}
