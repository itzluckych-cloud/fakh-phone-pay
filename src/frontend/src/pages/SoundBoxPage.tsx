import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Transaction } from "../backend";
import { useActor } from "../hooks/useActor";

const LANGUAGES = [
  { value: "en", label: "English", greeting: "Payment received" },
  { value: "yo", label: "Yoruba", greeting: "E kaabo, isanwo ti wole" },
  { value: "ha", label: "Hausa", greeting: "Barka, an karbi biyan kudi" },
];

const GRILLE_DOTS = Array.from({ length: 48 }, (_, i) => `dot-${i}`);
const WAVE_HEIGHTS = [0.4, 0.7, 1, 0.7, 0.5, 0.85, 1, 0.6, 0.4];

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateBigInt: bigint) {
  const ms = Number(dateBigInt) / 1_000_000;
  return new Date(ms).toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SpeakerGrille() {
  return (
    <div className="flex flex-wrap gap-[5px] p-4 justify-center">
      {GRILLE_DOTS.map((id) => (
        <div
          key={id}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.12)" }}
        />
      ))}
    </div>
  );
}

function SoundWave({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {WAVE_HEIGHTS.map((h, i) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: static array, index is stable
          key={i}
          className="w-1 rounded-full"
          style={{
            height: 32,
            background: active ? "oklch(0.72 0.2 152)" : "oklch(0.4 0.04 152)",
          }}
          animate={
            active
              ? {
                  scaleY: [h, h * 0.3, h * 1.2, h * 0.5, h],
                  transition: {
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.08,
                    ease: "easeInOut",
                  },
                }
              : { scaleY: 0.15 }
          }
          initial={{ scaleY: 0.15 }}
        />
      ))}
    </div>
  );
}

export default function SoundBoxPage() {
  const { actor, isFetching } = useActor();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [latestTx, setLatestTx] = useState<Transaction | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [language, setLanguage] = useState("en");
  const knownIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  const speak = useCallback(
    (text: string) => {
      if (isMuted || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [isMuted],
  );

  const buildAnnouncement = useCallback(
    (tx: Transaction) => {
      const lang = LANGUAGES.find((l) => l.value === language);
      const greeting = lang?.greeting ?? "Payment received";
      const amount = tx.amount.toFixed(2);
      if (language === "en") {
        return `${greeting}. ${amount} Naira from ${tx.provider} to ${tx.phoneNumber}`;
      }
      return `${greeting}. ${amount} Naira. ${tx.provider}. ${tx.phoneNumber}`;
    },
    [language],
  );

  const fetchAndCheck = useCallback(async () => {
    if (!actor) return;
    try {
      const result = await actor.getTransactionHistory();
      const sorted = [...result].sort((a, b) => Number(b.date - a.date));
      setTransactions(sorted.slice(0, 3));

      if (!initialized.current) {
        for (const tx of sorted) knownIds.current.add(String(tx.id));
        initialized.current = true;
        if (sorted.length > 0) setLatestTx(sorted[0]);
        return;
      }

      const newTxs = sorted.filter(
        (tx) => !knownIds.current.has(String(tx.id)),
      );
      if (newTxs.length > 0) {
        const newest = newTxs[0];
        setLatestTx(newest);
        for (const tx of newTxs) knownIds.current.add(String(tx.id));
        speak(buildAnnouncement(newest));
      }
    } catch (err) {
      console.error("SoundBox poll error", err);
    }
  }, [actor, speak, buildAnnouncement]);

  useEffect(() => {
    if (!actor || isFetching) return;
    fetchAndCheck();
    const interval = setInterval(fetchAndCheck, 5000);
    return () => clearInterval(interval);
  }, [actor, isFetching, fetchAndCheck]);

  const handleTestSound = () => {
    const sampleTx: Transaction = {
      id: BigInt(0),
      status: "paid" as any,
      provider: "MTN Nigeria",
      phoneNumber: "0803 456 7890",
      amount: 1500,
      date: BigInt(Date.now()) * BigInt(1_000_000),
    };
    speak(buildAnnouncement(sampleTx));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ background: "oklch(0.14 0.02 245)" }}
    >
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.25 0.02 245) 0%, oklch(0.18 0.02 245) 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.06), 0 24px 64px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Status bar */}
          <div
            className="flex items-center justify-between px-5 pt-5 pb-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "oklch(0.72 0.2 152)" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{
                  color: "oklch(0.72 0.2 152)",
                  fontFamily: "monospace",
                }}
                data-ocid="soundbox.panel"
              >
                Sound Box Active
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((b) => (
                <div
                  key={b}
                  className="rounded-sm"
                  style={{
                    width: b * 3 + 2,
                    height: 8,
                    background:
                      b <= 3 ? "oklch(0.72 0.2 152)" : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Device screen */}
          <div
            className="mx-4 mt-4 rounded-2xl p-4"
            style={{
              background: "oklch(0.1 0.02 245)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[10px] tracking-[0.3em] uppercase font-bold"
                style={{ color: "oklch(0.65 0.11 174)" }}
              >
                Fakh Phone Pay
              </span>
              <SoundWave active={isSpeaking} />
            </div>

            <AnimatePresence mode="wait">
              {latestTx ? (
                <motion.div
                  key={String(latestTx.id)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="text-3xl font-bold mb-1 tracking-wider"
                    style={{
                      fontFamily: "'Courier New', 'JetBrains Mono', monospace",
                      color: "oklch(0.9 0.18 152)",
                      textShadow: "0 0 20px oklch(0.72 0.2 152 / 0.6)",
                    }}
                    data-ocid="soundbox.card"
                  >
                    {formatAmount(latestTx.amount)}
                  </div>
                  <div
                    className="text-xs mb-0.5"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {latestTx.provider} &middot; {latestTx.phoneNumber}
                  </div>
                  <div
                    className="text-[10px]"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {formatDate(latestTx.date)}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-4"
                >
                  <div
                    className="text-2xl font-bold tracking-widest"
                    style={{
                      fontFamily: "'Courier New', monospace",
                      color: "rgba(255,255,255,0.15)",
                    }}
                  >
                    &#x20A6; - - - - -
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                    data-ocid="soundbox.empty_state"
                  >
                    Awaiting payment...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="my-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            />

            <div
              className="text-[9px] font-semibold tracking-[0.25em] uppercase mb-2"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Recent
            </div>
            <div className="space-y-1.5" data-ocid="soundbox.list">
              {transactions.length === 0 ? (
                <div
                  className="text-[10px]"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  No transactions yet
                </div>
              ) : (
                transactions.map((tx, idx) => (
                  <motion.div
                    key={String(tx.id)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="flex items-center justify-between"
                    data-ocid={`soundbox.item.${idx + 1}`}
                  >
                    <span
                      className="text-[10px] truncate max-w-[120px]"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {tx.provider} &middot; {tx.phoneNumber}
                    </span>
                    <span
                      className="text-[10px] font-bold"
                      style={{
                        fontFamily: "monospace",
                        color:
                          idx === 0
                            ? "oklch(0.85 0.15 152)"
                            : "rgba(255,255,255,0.4)",
                      }}
                    >
                      &#x20A6;{tx.amount.toLocaleString()}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <SpeakerGrille />

          {/* Controls */}
          <div
            className="px-5 pb-5 space-y-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-3 pt-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger
                  className="flex-1 h-9 text-xs border-0"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                  data-ocid="soundbox.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl shrink-0"
                aria-label={isMuted ? "Unmute sound box" : "Mute sound box"}
                style={{
                  background: isMuted
                    ? "rgba(255,80,80,0.15)"
                    : "rgba(255,255,255,0.07)",
                  color: isMuted ? "rgb(255,100,100)" : "rgba(255,255,255,0.7)",
                }}
                onClick={() => setIsMuted((m) => !m)}
                data-ocid="soundbox.toggle"
              >
                {isMuted ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-label="Muted"
                    role="img"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-label="Unmuted"
                    role="img"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </Button>
            </div>

            <Button
              className="w-full h-10 text-sm font-semibold rounded-xl"
              style={{
                background: "oklch(0.62 0.18 152)",
                color: "white",
                boxShadow: isSpeaking
                  ? "0 0 20px oklch(0.72 0.2 152 / 0.5)"
                  : "none",
              }}
              onClick={handleTestSound}
              disabled={isSpeaking}
              data-ocid="soundbox.primary_button"
            >
              {isSpeaking ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{
                      duration: 0.8,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    &#x1F50A;
                  </motion.span>
                  Announcing...
                </span>
              ) : (
                "\u25B6 Test Sound"
              )}
            </Button>
          </div>

          <div
            className="flex items-center justify-center gap-2 py-3"
            style={{
              background: "rgba(0,0,0,0.3)",
              borderTop: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {isMuted && (
              <Badge
                className="text-[9px] px-2 py-0.5 font-semibold tracking-wider uppercase"
                style={{
                  background: "rgba(255,80,80,0.15)",
                  color: "rgb(255,120,120)",
                  border: "1px solid rgba(255,80,80,0.3)",
                }}
              >
                MUTED
              </Badge>
            )}
            <span
              className="text-[9px] tracking-[0.4em] uppercase"
              style={{
                color: "rgba(255,255,255,0.2)",
                fontFamily: "monospace",
              }}
            >
              FPP &middot; SB-1
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs mt-6"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Polls every 5 seconds &middot; Web Speech API
        </motion.p>
      </div>
    </div>
  );
}
