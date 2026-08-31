import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callAiChat, type ChatMessage } from "@/lib/ai-provider";
import { z } from "zod";

const COACHES = [
  {
    key: "Aladesuyi Marvellous",
    role: "Head Strength Coach",
    focus: "Strength, hypertrophy, powerlifting, athletic base building.",
  },
  {
    key: "Ayodele Esther",
    role: "Performance Coach",
    focus: "Conditioning, weight loss, women's training, HIIT & metabolic work.",
  },
  {
    key: "Godwin John",
    role: "Movement Specialist",
    focus: "Mobility, rehab, injury recovery, corrective exercise, posture.",
  },
];

// ---------- Threads ----------

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .select("id, title, updated_at")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .insert({ user_id: context.userId, title: "New conversation" })
      .select("id, title, updated_at")
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { threadId: string }) => data)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("chat_threads")
      .delete()
      .eq("id", data.threadId)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getThreadMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { threadId: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("chat_messages")
      .select("id, role, content, is_health_flag, created_at")
      .eq("thread_id", data.threadId)
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

// ---------- Send chat ----------

const SendInput = z.object({
  threadId: z.string().uuid(),
  message: z.string().trim().min(1).max(4000),
});

type AiReply = {
  reply: string;
  isHealthFlag: boolean;
  healthSummary?: string;
  recommendedCoach?: string | null;
};

export const sendChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SendInput.parse(data))
  .handler(async ({ data, context }) => {
    // Verify thread ownership
    const { data: thread } = await context.supabase
      .from("chat_threads")
      .select("id, title")
      .eq("id", data.threadId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!thread) throw new Error("Thread not found");

    // Load profile
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("full_name, age, gender, fitness_goal, doctor_name, doctor_email")
      .eq("user_id", context.userId)
      .maybeSingle();

    // Load previous messages
    const { data: prior } = await context.supabase
      .from("chat_messages")
      .select("role, content")
      .eq("thread_id", data.threadId)
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true })
      .limit(30);

    // Persist user message first
    const { error: insertUserErr } = await context.supabase.from("chat_messages").insert({
      thread_id: data.threadId,
      user_id: context.userId,
      role: "user",
      content: data.message,
    });
    if (insertUserErr) throw new Error(insertUserErr.message);

    const coachList = COACHES.map((c) => `- ${c.key} (${c.role}): ${c.focus}`).join("\n");
    const system = `You are PulseGym's AI Health & Training Coach.
Member profile:
- Name: ${profile?.full_name || "unknown"}
- Age: ${profile?.age ?? "unknown"}
- Gender: ${profile?.gender || "unknown"}
- Goal: ${profile?.fitness_goal || "unknown"}
- Doctor on file: ${profile?.doctor_name || "none"} (${profile?.doctor_email || "no email"})

Available coaches:
${coachList}

Your job: give warm, practical, evidence-based guidance on training, recovery, nutrition, mobility, and mindset. Personalize to the profile. When it fits, recommend the single best coach from the list.

CRITICAL — detect health red flags. Set isHealthFlag=true when the user reports any of: chest pain, shortness of breath at rest, dizziness/fainting, sharp joint pain, sudden severe headache, persistent injury, signs of overtraining that could be serious, or anything you'd want a doctor to review. In your reply, gently advise them to consider notifying their doctor and let them know a button will appear to do so.

Always respond as STRICT JSON — no prose outside the JSON — with this exact shape:
{
  "reply": "your markdown-friendly answer to the member",
  "isHealthFlag": boolean,
  "healthSummary": "one short paragraph the doctor should see, only if isHealthFlag is true, else empty string",
  "recommendedCoach": "exactly one of ${COACHES.map((c) => `"${c.key}"`).join(", ")}, or null if no recommendation this turn"
}`;

    const messages: ChatMessage[] = [
      { role: "system", content: system },
      ...(prior ?? []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user", content: data.message },
    ];

    let ai: AiReply = {
      reply: "Sorry — I couldn't reach the AI service. Please try again.",
      isHealthFlag: false,
      recommendedCoach: null,
    };

    try {
      const result = await callAiChat(messages);
      if (!result.ok) {
        ai.reply = result.error;
      } else {
        try {
          const parsed = JSON.parse(result.text);
          ai = {
            reply: typeof parsed.reply === "string" ? parsed.reply : "…",
            isHealthFlag: Boolean(parsed.isHealthFlag),
            healthSummary: typeof parsed.healthSummary === "string" ? parsed.healthSummary : "",
            recommendedCoach:
              typeof parsed.recommendedCoach === "string" &&
              COACHES.some((c) => c.key === parsed.recommendedCoach)
                ? parsed.recommendedCoach
                : null,
          };
        } catch {
          ai.reply = result.text;
        }
      }
    } catch (e) {
      ai.reply = `AI service error: ${e instanceof Error ? e.message : "unknown"}.`;
    }

    // Persist assistant message
    const { data: assistantRow, error: aErr } = await context.supabase
      .from("chat_messages")
      .insert({
        thread_id: data.threadId,
        user_id: context.userId,
        role: "assistant",
        content: ai.reply,
        is_health_flag: ai.isHealthFlag,
      })
      .select("id, role, content, is_health_flag, created_at")
      .single();
    if (aErr) throw new Error(aErr.message);

    // Update thread title from first user message (if still default)
    if (thread.title === "New conversation") {
      const title = data.message.slice(0, 60);
      await context.supabase
        .from("chat_threads")
        .update({ title, updated_at: new Date().toISOString() })
        .eq("id", data.threadId)
        .eq("user_id", context.userId);
    } else {
      await context.supabase
        .from("chat_threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", data.threadId)
        .eq("user_id", context.userId);
    }

    // Save coach recommendation to profile
    if (ai.recommendedCoach) {
      await context.supabase
        .from("profiles")
        .update({ recommended_coach: ai.recommendedCoach, updated_at: new Date().toISOString() })
        .eq("user_id", context.userId);
    }

    return {
      assistant: assistantRow,
      healthSummary: ai.healthSummary ?? "",
      recommendedCoach: ai.recommendedCoach ?? null,
    };
  });
