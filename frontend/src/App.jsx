import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  Sparkles,
  Gift,
  Wand2,
  Star,
  Smile,
  ArrowRight,
  Home,
  Music,
  VolumeX,
  Lock,
  Bot,
} from "lucide-react";
import axios from "axios";
import "./index.css";

const API_URL = "http://127.0.0.1:8000";

const pages = ["home", "message", "surprise", "reasons", "ai", "secret", "final"];

const floatingHearts = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  delay: `${Math.random() * 3}s`,
  size: `${12 + Math.random() * 16}px`,
}));

function App() {
  const [page, setPage] = useState("home");
  const [surprise, setSurprise] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [secretTaps, setSecretTaps] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReply, setAiReply] = useState("");

  const audioRef = useRef(null);

  const burst = () => {
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.78 } });
  };

  const bigBurst = () => {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.7 } });
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsMusicPlaying(true);
      } catch {
        console.log("Music blocked.");
      }
    }
  };

  const nextPage = () => {
    burst();
    const currentIndex = pages.indexOf(page);
    setPage(pages[(currentIndex + 1) % pages.length]);
  };

  const openSurprise = () => {
    bigBurst();

    const surprises = [
      "You are loved more than words can explain 💕",
      "You make everything better ✨",
      "You are my happiness 🌸",
      "Your smile is everything ☀️",
      "You are the softest part of my world 💫",
    ];

    setSurprise(surprises[Math.floor(Math.random() * surprises.length)]);
  };

  const secretTap = () => {
    const next = secretTaps + 1;
    setSecretTaps(next);

    if (next >= 5) {
      setSecretUnlocked(true);
      setPage("secret");
      bigBurst();
    }
  };

  const runAI = async (action) => {
    if (aiLoading) return;

    burst();
    setAiLoading(true);
    setAiReply("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      const res = await axios.post(`${API_URL}/ai-action`, {
        action,
        secret_mode: secretUnlocked,
      });

      setAiReply(res.data.reply);
    } catch {
      setAiReply(
        "AI is busy for a moment, but this little website still thinks you are magical 💖"
      );
    }

    setAiLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-[#120617] text-white overflow-hidden">
      <audio ref={audioRef} loop>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      <button
        onClick={secretTap}
        className="fixed bottom-5 right-5 z-50 opacity-20 hover:opacity-100 active:scale-90 transition text-2xl"
      >
        ✨
      </button>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/40 via-purple-950/70 to-black" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-pink-500/25 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-purple-500/25 rounded-full blur-3xl" />

        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-pink-300"
            style={{
              left: heart.left,
              top: heart.top,
              fontSize: heart.size,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.15, 0.45, 0.15],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              delay: heart.delay,
            }}
          >
            💖
          </motion.div>
        ))}
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 px-3 pt-4">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-3 shadow-xl flex justify-between items-center">
          <button
            onClick={() => setPage("home")}
            className="flex items-center gap-2 text-pink-200 font-bold"
          >
            <Heart className="w-5 h-5 fill-pink-400" />
            Magic by Manushka 
          </button>

          <div className="flex gap-2">
            <button
              onClick={toggleMusic}
              className="px-3 py-2 rounded-full bg-white/10 text-sm flex items-center gap-2 active:scale-95"
            >
              {isMusicPlaying ? <VolumeX size={16} /> : <Music size={16} />}
            </button>

            <button
              onClick={nextPage}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-sm font-bold flex items-center gap-1 active:scale-95 shadow-lg shadow-pink-500/30"
            >
              Next <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 min-h-screen flex items-start justify-center px-4 pt-24 pb-14">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {page === "home" && (
              <Page key="home">
                <Card>
                  <Icon icon={<Heart size={40} className="fill-pink-400" />} />
                  <p className="text-xs tracking-[0.3em] text-pink-200 mb-3">
                    MADE BY BABE ONLY FOR YOU
                  </p>
                  <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-pink-200 to-yellow-100 text-transparent bg-clip-text">
                    Happy Birthday Babe, <br />
                    I love you 
                  </h1>
                  <p className="text-pink-100 mb-6">
                    A magical little world just for you 💖
                  </p>
                  <Btn onClick={() => setPage("message")}>Open</Btn>
                </Card>
              </Page>
            )}

            {page === "message" && (
              <Page key="message">
                <Card>
                  <Icon icon={<Sparkles size={40} />} />
                  <h2 className="text-3xl font-black mb-4">
                    A Message For You
                  </h2>
                  <div className="min-h-44 w-full bg-white/10 rounded-2xl mb-6 border border-white/10 p-5 text-left text-pink-50">
                    {/* Write your personal birthday message here later */}
                  </div>
                  <Btn onClick={() => setPage("surprise")}>Open Surprise</Btn>
                </Card>
              </Page>
            )}

            {page === "surprise" && (
              <Page key="surprise">
                <Card>
                  <Icon icon={<Gift size={40} />} />
                  <h2 className="text-3xl font-black mb-4">Tap The Gift</h2>

                  <button
                    onClick={openSurprise}
                    className="text-7xl mb-6 active:scale-75 transition"
                  >
                    🎁
                  </button>

                  {surprise && (
                    <p className="mb-6 text-xl bg-white/10 p-5 rounded-2xl">
                      {surprise}
                    </p>
                  )}

                  <Btn onClick={() => setPage("reasons")}>Next</Btn>
                </Card>
              </Page>
            )}

            {page === "reasons" && (
              <Page key="reasons">
                <Card>
                  <Icon icon={<Star size={40} className="fill-yellow-300" />} />
                  <h2 className="text-3xl font-black mb-5">
                    Why You Are Special
                  </h2>

                  <div className="grid gap-3 w-full">
                    {[
                      "Your smile makes everything better",
                      "You have the most beautiful heart",
                      "You make life feel softer and happier",
                      "You are my favorite person",
                    ].map((x, i) => (
                      <motion.div
                        whileTap={{ scale: 0.96 }}
                        key={i}
                        className="bg-white/10 border border-white/10 rounded-2xl p-4"
                      >
                        💖 {x}
                      </motion.div>
                    ))}
                  </div>

                  <Btn onClick={() => setPage("ai")}>Open AI Magic</Btn>
                </Card>
              </Page>
            )}

            {page === "ai" && (
              <Page key="ai">
                <div className="relative bg-[#17131f]/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden">
                  <div className="p-6 border-b border-white/10 bg-white/[0.04] text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                        <Bot size={26} />
                      </div>

                      <h2 className="text-2xl font-black">Birthday Magic AI</h2>
                      <p className="text-xs text-pink-100/70">
                        Tap a button and let AI create something special 💖
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <AIButton disabled={aiLoading} onClick={() => runAI("wish")}>
                        🎂 Wish
                      </AIButton>

                      <AIButton
                        disabled={aiLoading}
                        onClick={() => runAI("compliment")}
                      >
                        💖 Compliment
                      </AIButton>

                      <AIButton disabled={aiLoading} onClick={() => runAI("poem")}>
                        🌙 Poem
                      </AIButton>

                      <AIButton
                        disabled={aiLoading}
                        onClick={() => runAI("surprise")}
                      >
                        ✨ Surprise
                      </AIButton>
                    </div>

                    <div className="mt-8 min-h-52 rounded-3xl bg-black/30 border border-white/10 p-6 flex items-center justify-center text-center">
                      {aiLoading ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-pink-200 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-pink-200 rounded-full animate-bounce [animation-delay:0.15s]" />
                            <span className="w-2 h-2 bg-pink-200 rounded-full animate-bounce [animation-delay:0.3s]" />
                          </div>
                          <p className="text-sm text-white/60">
                            Creating magic...
                          </p>
                        </div>
                      ) : aiReply ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-lg leading-relaxed text-pink-50 whitespace-pre-wrap"
                        >
                          {aiReply}
                        </motion.div>
                      ) : (
                        <p className="text-white/40 text-sm">
                          Tap a button above ✨
                        </p>
                      )}
                    </div>

                    <div className="flex justify-center mt-6">
                      <Btn onClick={() => setPage("final")}>Final</Btn>
                    </div>
                  </div>
                </div>
              </Page>
            )}

            {page === "secret" && (
              <Page key="secret">
                <Card>
                  <Icon icon={<Lock size={40} />} />
                  <h2 className="text-3xl font-black mb-4">Secret Unlocked</h2>
                  <p className="text-lg bg-white/10 rounded-2xl p-5 mb-4">
                    You found the hidden magic button. That means you get one
                    extra secret:
                  </p>
                  <p className="text-2xl font-bold text-pink-200">
                    You are my once-in-a-lifetime person 💖
                  </p>
                  <Btn onClick={() => setPage("ai")}>Open Secret AI Magic</Btn>
                  <Btn onClick={() => setPage("final")}>Final Surprise</Btn>
                </Card>
              </Page>
            )}

            {page === "final" && (
              <Page key="final">
                <Card>
                  <Icon icon={<Smile size={40} />} />
                  <h2 className="text-3xl font-black mb-4">
                    One Last Thing...
                  </h2>
                  <p className="mb-6 text-xl">I love you the most Manushka💖</p>
                  <Btn
                    onClick={() => {
                      bigBurst();
                      setPage("home");
                    }}
                  >
                    <Home size={18} /> Restart
                  </Btn>
                </Card>
              </Page>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 pb-5 text-center text-xs text-white/45">
        All rights reserved @ Atharv Kadam
      </footer>
    </div>
  );
}

const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -25, scale: 0.98 }}
    transition={{ duration: 0.35 }}
  >
    {children}
  </motion.div>
);

const Card = ({ children }) => (
  <div className="relative bg-white/10 backdrop-blur-2xl rounded-[2rem] p-6 shadow-2xl border border-white/15 flex flex-col items-center text-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-pink-500/10 pointer-events-none" />
    <div className="relative z-10 w-full flex flex-col items-center">
      {children}
    </div>
  </div>
);

const Icon = ({ icon }) => (
  <div className="mb-4 p-4 bg-pink-500/20 rounded-full text-pink-200 border border-pink-200/20 shadow-lg">
    {icon}
  </div>
);

const Btn = ({ children, onClick }) => (
  <button
    onClick={() => {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
      onClick();
    }}
    className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-full font-bold active:scale-90 transition shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2"
  >
    {children}
  </button>
);

const AIButton = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`rounded-2xl px-4 py-5 border border-white/10 font-bold active:scale-95 transition ${
      disabled
        ? "bg-white/5 text-white/40 cursor-not-allowed"
        : "bg-white/10 hover:bg-white/15 text-white"
    }`}
  >
    {children}
  </button>
);

export default App;