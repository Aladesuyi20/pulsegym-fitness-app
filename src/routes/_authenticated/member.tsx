import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import emailjs from "@emailjs/browser";
import ReactMarkdown from "react-markdown";
import {
  Plus,
  Trash2,
  Send,
  Loader2,
  LogOut,
  AlertTriangle,
  ShieldCheck,
  MessageSquare,
  ArrowLeft,
  Star,
} from "lucide-react";
import { getProfile } from "@/lib/profile.functions";
import {
  listThreads,
  createThread,
  deleteThread,
  getThreadMessages,
  sendChat,
} from "@/lib/chat.functions";
import trainer1Asset from "@/assets/aladesuyi-marvellous.jpg";
import trainer2Asset from "@/assets/ayodele-esther.jpg";
import trainer3Asset from "@/assets/godwin-john.jpg";

const EMAILJS_SERVICE_ID = "service_liri6br";
const EMAILJS_TEMPLATE_ID = "template_gg2mx7f";
const EMAILJS_PUBLIC_KEY = "nAsHaQs96w0LPCaSM";

const COACHES = [
  {
    key: "Aladesuyi Marvellous",
    role: "Head Strength Coach",
    img: trainer1Asset,
    bio: "Strength, hypertrophy and powerlifting. Builds the raw force behind every serious athlete.",
  },
  {
    key: "Ayodele Esther",
    role: "Performance Coach",
    img: trainer2Asset,
    bio: "Conditioning, fat loss, women's training and metabolic work. Turns effort into visible results.",
  },
  {
    key: "Godwin John",
    role: "Movement Specialist",
    img: trainer3Asset,
    bio: "Mobility, rehab, corrective exercise and injury recovery. Keeps you training pain-free for decades.",
  },
];

export const Route = createFileRoute("/_authenticated/member")({
  head: () => ({
    meta: [
      { title: "Member Area — PulseGym" },
      {
        name: "description",
        content: "Your PulseGym member dashboard, coach recommendations, and AI health coach.",
      },
    ],
  }),
  component: MemberPage,
});

type Thread = { id: string; title: string; updated_at: string };
type Message = {
  id: string;
  role: string;
  content: string;
  is_health_flag: boolean;
  created_at: string;
};

function MemberPage() {
  const navigate = useNavigate();
  const load = useServerFn(getProfile);
  const list = useServerFn(listThreads);
  const create = useServerFn(createThread);
  const del = useServerFn(deleteThread);
  const getMsgs = useServerFn(getThreadMessages);
  const send = useServerFn(sendChat);

  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getProfile>> | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [lastHealthSummary, setLastHealthSummary] = useState<string>("");
  const [notified, setNotified] = useState<Record<string, boolean>>({});
  const [notifying, setNotifying] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void (async () => {
      const [p, t] = await Promise.all([load(), list()]);
      setProfile(p);
      setThreads(t);
      if (t.length) {
        setActiveId(t[0].id);
      } else {
        const nt = await create();
        setThreads([nt]);
        setActiveId(nt.id);
      }
    })();
  }, [load, list, create]);

  useEffect(() => {
    if (!activeId) return;
    void getMsgs({ data: { threadId: activeId } }).then(setMessages);
    setLastHealthSummary("");
  }, [activeId, getMsgs]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  async function handleNewThread() {
    const nt = await create();
    setThreads((prev) => [nt, ...prev]);
    setActiveId(nt.id);
    setMessages([]);
  }

  async function handleDelete(id: string) {
    await del({ data: { threadId: id } });
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (activeId === id) {
      const remaining = threads.filter((t) => t.id !== id);
      if (remaining.length) setActiveId(remaining[0].id);
      else {
        const nt = await create();
        setThreads([nt]);
        setActiveId(nt.id);
      }
    }
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!activeId || !input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    // Optimistic user message
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      is_health_flag: false,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);

    try {
      const res = await send({ data: { threadId: activeId, message: text } });
      // Reload messages to include real IDs
      const fresh = await getMsgs({ data: { threadId: activeId } });
      setMessages(fresh);
      setLastHealthSummary(res.healthSummary ?? "");
      // Update thread list to reflect new title/order
      const nt = await list();
      setThreads(nt);
      if (res.recommendedCoach) {
        setProfile((p) => (p ? { ...p, recommended_coach: res.recommendedCoach } : p));
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ ${err instanceof Error ? err.message : "Something went wrong."}`,
          is_health_flag: false,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  async function notifyDoctor(messageId: string, assistantContent: string) {
    if (!profile?.doctor_email) {
      alert("Add your doctor's email in your profile first.");
      return;
    }
    setNotifying(messageId);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: `PulseGym AI Coach (for ${profile.full_name || "member"})`,
          from_email: "no-reply@pulsegym.local",
          subject: `Health alert regarding ${profile.full_name || "a PulseGym member"}`,
          message: `This alert is intended for Dr. ${profile.doctor_name || "(name not provided)"} at ${profile.doctor_email}.

Member: ${profile.full_name || "unknown"} (age ${profile.age ?? "?"}, ${profile.gender || "?"})
Goal: ${profile.fitness_goal || "n/a"}

Summary from PulseGym's AI health coach:
${lastHealthSummary || assistantContent}

— PulseGym Member Area`,
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      setNotified((n) => ({ ...n, [messageId]: true }));
    } catch (err) {
      alert("Could not send the alert: " + (err instanceof Error ? err.message : "unknown"));
    } finally {
      setNotifying(null);
    }
  }

  return (
    <main className="min-h-screen bg-[color:var(--bone)] text-[color:var(--ink)]">
      <header className="border-b border-black/10 bg-white">
        <div className="container-x flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-black/60 hover:text-black">
              <ArrowLeft size={18} />
            </Link>
            <div className="grid place-items-center w-9 h-9 bg-[color:var(--ink)] text-white font-display">
              P
            </div>
            <span className="font-display text-lg tracking-widest">
              PULSE<span className="text-[color:var(--blaze)]">GYM</span> · MEMBERS
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-sm hover:text-[color:var(--blaze)]"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </header>

      <section className="container-x pt-10 pb-6">
        <span className="eyebrow">Welcome back</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2">
          Hey {profile?.full_name || "athlete"}.
        </h1>
        <p className="mt-2 text-black/70 max-w-2xl">
          Your goal: <strong>{profile?.fitness_goal || "not set yet"}</strong>. Chat with our AI
          health coach below — it knows your profile and will suggest the best coach for you.
        </p>
      </section>

      {/* Coach explorer */}
      <section className="container-x pb-10">
        <h2 className="font-display text-2xl mb-4">Your coach options</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {COACHES.map((c) => {
            const recommended = profile?.recommended_coach === c.key;
            return (
              <article
                key={c.key}
                className={`bg-white border ${recommended ? "border-[color:var(--blaze)] ring-2 ring-[color:var(--blaze)]/30" : "border-black/10"} p-5 relative`}
              >
                {recommended && (
                  <div className="absolute -top-3 left-4 bg-[color:var(--blaze)] text-white text-[10px] font-display tracking-widest px-3 py-1 flex items-center gap-1">
                    <Star size={12} /> RECOMMENDED FOR YOU
                  </div>
                )}
                <div className="aspect-square overflow-hidden bg-black/5 mb-4">
                  <img src={c.img} alt={c.key} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-display text-xl">{c.key}</h3>
                <p className="text-xs font-display tracking-widest text-[color:var(--blaze)] mt-1">
                  {c.role.toUpperCase()}
                </p>
                <p className="text-sm text-black/70 mt-2 leading-relaxed">{c.bio}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Chatbot */}
      <section className="container-x pb-16">
        <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
          <MessageSquare size={22} /> AI Health Coach
        </h2>
        <div className="grid md:grid-cols-[240px_1fr] gap-4 bg-white border border-black/10 min-h-[520px]">
          {/* Thread sidebar */}
          <aside className="border-r border-black/10 flex flex-col">
            <button
              onClick={handleNewThread}
              className="flex items-center gap-2 p-4 text-sm font-display tracking-widest border-b border-black/10 hover:bg-black/5"
            >
              <Plus size={16} /> NEW CHAT
            </button>
            <div className="flex-1 overflow-y-auto max-h-[500px]">
              {threads.map((t) => (
                <div
                  key={t.id}
                  className={`group flex items-center justify-between gap-2 px-4 py-3 text-sm border-b border-black/5 cursor-pointer ${
                    activeId === t.id ? "bg-[color:var(--ink)] text-white" : "hover:bg-black/5"
                  }`}
                  onClick={() => setActiveId(t.id)}
                >
                  <span className="truncate flex-1">{t.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDelete(t.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-current/70 hover:text-[color:var(--blaze)]"
                    aria-label="Delete conversation"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </aside>

          {/* Chat panel */}
          <div className="flex flex-col min-h-[520px]">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[520px]">
              {messages.length === 0 && !sending && (
                <div className="text-center text-black/50 py-16 text-sm">
                  Ask about training, recovery, nutrition, mobility, or how you're feeling today.
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-[color:var(--ink)] text-white"
                        : m.is_health_flag
                          ? "bg-red-50 border-l-4 border-[color:var(--blaze)] text-[color:var(--ink)]"
                          : "bg-black/5 text-[color:var(--ink)]"
                    }`}
                  >
                    {m.role === "user" ? (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-headings:my-2">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    )}
                    {m.is_health_flag && m.role === "assistant" && (
                      <div className="mt-3 pt-3 border-t border-[color:var(--blaze)]/30">
                        <div className="flex items-center gap-2 text-xs text-[color:var(--blaze)] font-semibold mb-2">
                          <AlertTriangle size={14} /> Health flag detected
                        </div>
                        {notified[m.id] ? (
                          <div className="flex items-center gap-2 text-xs text-green-700">
                            <ShieldCheck size={14} /> Doctor has been notified.
                          </div>
                        ) : (
                          <button
                            onClick={() => notifyDoctor(m.id, m.content)}
                            disabled={notifying === m.id}
                            className="text-xs font-display tracking-widest bg-[color:var(--blaze)] text-white px-3 py-2 hover:bg-[color:var(--ink)] inline-flex items-center gap-2 disabled:opacity-60"
                          >
                            {notifying === m.id && <Loader2 size={12} className="animate-spin" />}
                            NOTIFY MY DOCTOR
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-black/5 px-4 py-3 text-sm text-black/60 inline-flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Thinking...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="border-t border-black/10 p-3 flex gap-2">
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="How are you feeling today? Ask anything about training, recovery, nutrition..."
                className="flex-1 border border-black/15 px-3 py-2.5 focus:border-[color:var(--ink)] outline-none text-sm"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="btn-primary text-xs disabled:opacity-50"
              >
                <Send size={14} /> Send
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
