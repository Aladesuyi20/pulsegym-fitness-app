import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flame,
  Target,
  Salad,
  Wrench,
  LineChart,
  Sparkles,
  Users,
  Music2,
  Repeat,
  HeartHandshake,
  Trophy,
  Stethoscope,
  Activity,
  ShieldCheck,
  HandHeart,
  Dumbbell,
} from "lucide-react";
import classesImg from "@/assets/gym-classes.jpg";
import personalImg from "@/assets/gym-personal.jpg";
import rehabImg from "@/assets/gym-rehab.jpg";

type Program = {
  slug: string;
  eyebrow: string;
  title: string;
  tagline: string;
  hero: string;
  intro: string[];
  audienceTitle: string;
  audience: string[];
  featuresTitle: string;
  features: { icon: LucideIcon; title: string; copy: string }[];
  whyTitle: string;
  whyCopy: string;
  bullets?: { icon: LucideIcon; text: string }[];
  resultsTitle?: string;
  results?: string[];
  ctaLabel: string;
  ctaHref: string;
  closing: string;
};

const PROGRAMS: Record<string, Program> = {
  "personal-training": {
    slug: "personal-training",
    eyebrow: "Personal Training",
    title: "Train Smarter. Achieve Faster. 🔥",
    tagline: "Every session tailored to your body, your goals, your lifestyle.",
    hero: personalImg,
    intro: [
      "Whether you're taking your first step into fitness or chasing your next personal best, our Personal Training program is designed entirely around you.",
      "No generic workout plans. No guesswork. No wasted effort. Every rep, every set, every session moves you closer to the result you actually want.",
    ],
    audienceTitle: "Who is this for?",
    audience: [
      "You want to lose weight effectively",
      "You want to build lean muscle",
      "You need real accountability",
      "You're new to the gym",
      "You want expert guidance",
      "You're preparing for an event or competition",
      "You've struggled to stay consistent",
    ],
    featuresTitle: "What you'll receive",
    features: [
      {
        icon: Target,
        title: "Personalized Training Plan",
        copy: "Your coach designs a program specifically for your goals, experience level, and fitness assessment.",
      },
      {
        icon: Salad,
        title: "Nutrition Guidance",
        copy: "Training is only part of the equation. Get practical nutrition advice that supports your transformation.",
      },
      {
        icon: Wrench,
        title: "Technique Correction",
        copy: "Proper form maximises results and slashes injury risk. We watch every rep.",
      },
      {
        icon: LineChart,
        title: "Progress Tracking",
        copy: "Every milestone measured — strength, endurance, body composition, and overall fitness.",
      },
      {
        icon: Flame,
        title: "Continuous Motivation",
        copy: "Your coach keeps you accountable, adjusts the plan when needed, and keeps you consistent.",
      },
    ],
    whyTitle: "Why choose Personal Training?",
    whyCopy:
      "Because your fitness journey is unique. Instead of following random workouts online, you'll have a certified coach who understands your body, monitors your progress, and keeps you focused every step of the way. Your success becomes our mission.",
    ctaLabel: "Book Your First Session",
    ctaHref: "/auth?plan=PT%20Pro",
    closing:
      "Ready to transform? Invest in yourself today and experience training designed around you. 🔥",
  },
  "group-classes": {
    slug: "group-classes",
    eyebrow: "Group Classes",
    title: "Sweat Together. Grow Together. 🔥",
    tagline:
      "Expert coaching, energetic music, and teammates who push you harder than you'd push yourself.",
    hero: classesImg,
    intro: [
      "Fitness becomes more exciting when you're surrounded by people who motivate and challenge you.",
      "Our Group Classes combine expert coaching, energetic music, and supportive teammates to create workouts you'll actually look forward to. Burn calories, build endurance, and improve mobility — all in one high-energy room.",
    ],
    audienceTitle: "Perfect for",
    audience: [
      "Busy professionals",
      "Friends training together",
      "Beginners seeking motivation",
      "Anyone who enjoys community workouts",
      "People wanting variety in their week",
    ],
    featuresTitle: "What you'll experience",
    features: [
      {
        icon: Flame,
        title: "High-Energy Workouts",
        copy: "Every class is designed to keep you moving from the first beat to the final cool-down.",
      },
      {
        icon: Users,
        title: "Professional Coaching",
        copy: "Certified instructors ensure everyone performs every movement safely and effectively.",
      },
      {
        icon: Repeat,
        title: "Variety Every Week",
        copy: "HIIT, Functional Training, Strength Circuits, Kettlebells, Mobility, Core Conditioning, Cardio. No workout ever feels repetitive.",
      },
      {
        icon: Music2,
        title: "An Atmosphere You'll Miss On Rest Days",
        copy: "Curated playlists, real coaching cues, and a room that lifts you up.",
      },
      {
        icon: HeartHandshake,
        title: "Real Community",
        copy: "Friendly competition, shared wins, and friendships that outlast the workout.",
      },
    ],
    whyTitle: "Why members love Group Classes",
    whyCopy:
      "Fun atmosphere. Increased motivation. Friendly competition. Affordable coaching. Massive calorie burn. Strong community. The energy in the room pushes everyone to work harder than they would alone.",
    bullets: [
      { icon: CheckCircle2, text: "Fun atmosphere" },
      { icon: CheckCircle2, text: "Increased motivation" },
      { icon: CheckCircle2, text: "Friendly competition" },
      { icon: CheckCircle2, text: "Affordable coaching" },
      { icon: CheckCircle2, text: "Great calorie burn" },
      { icon: CheckCircle2, text: "Strong community" },
    ],
    resultsTitle: "Results you can expect",
    results: [
      "Increased fitness",
      "Better endurance",
      "Improved strength",
      "Sustainable weight loss",
      "Greater confidence",
      "New friendships",
    ],
    ctaLabel: "Reserve Your Spot Today",
    ctaHref: "/auth?plan=Monthly",
    closing: "Join the community. Experience the motivation only group training can deliver. 🔥",
  },
  "rehab-recovery": {
    slug: "rehab-recovery",
    eyebrow: "Rehab & Recovery",
    title: "Recover Stronger. Move Better. 🔥",
    tagline: "Fitness isn't only about pushing harder — it's about recovering smarter.",
    hero: rehabImg,
    intro: [
      "Our Rehab & Recovery program helps reduce pain, restore movement, prevent injuries, and accelerate recovery so you can return to training with confidence.",
      "Whether you're recovering from surgery, sports injuries, muscle strains, or chronic pain, our recovery specialists build a plan designed specifically for your body.",
    ],
    audienceTitle: "Who is it for?",
    audience: [
      "Sports injuries",
      "Back pain",
      "Knee pain",
      "Shoulder pain",
      "Muscle tightness",
      "Poor mobility",
      "Post-surgery rehabilitation",
      "Joint stiffness",
    ],
    featuresTitle: "Our recovery services",
    features: [
      {
        icon: Stethoscope,
        title: "Injury Assessment",
        copy: "Understand the root cause of the pain before treatment begins.",
      },
      {
        icon: Dumbbell,
        title: "Guided Rehabilitation",
        copy: "Safe, progressive exercises designed to rebuild strength and mobility.",
      },
      {
        icon: Activity,
        title: "Mobility Improvement",
        copy: "Restore flexibility and healthy movement patterns for daily life and sport.",
      },
      {
        icon: HandHeart,
        title: "Pain Management",
        copy: "Reduce discomfort using evidence-based recovery techniques.",
      },
      {
        icon: ShieldCheck,
        title: "Injury Prevention",
        copy: "Strengthen vulnerable areas to minimise future injuries.",
      },
    ],
    whyTitle: "Why recovery matters",
    whyCopy:
      "Many people stop training because of pain. We believe recovery should be part of every fitness journey — not something you think about only after getting injured. Recovering correctly today helps you perform better tomorrow.",
    bullets: [
      { icon: Trophy, text: "Recover safely" },
      { icon: Trophy, text: "Move confidently" },
      { icon: Trophy, text: "Train pain-free" },
      { icon: Trophy, text: "Return stronger than before" },
    ],
    ctaLabel: "Schedule Your Recovery Session",
    ctaHref: "/auth?plan=Monthly",
    closing:
      "Don't let pain control your life. Book your assessment and begin your journey back to strength. 🔥",
  },
};

export const Route = createFileRoute("/programs/$slug")({
  loader: ({ params }) => {
    const program = PROGRAMS[params.slug];
    if (!program) throw notFound();
    return { program };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Program not found — PulseGym" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.program;
    const title = `${p.eyebrow} — PulseGym`;
    const description = p.tagline;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProgramPage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-[color:var(--bone)] text-[color:var(--ink)]">
      <div className="text-center">
        <h1 className="font-display text-4xl mb-4">Program not found</h1>
        <Link to="/" className="text-[color:var(--blaze)] underline">
          Back to home
        </Link>
      </div>
    </div>
  ),
});

function ProgramPage() {
  const { program: p } = Route.useLoaderData() as { program: Program };
  return (
    <main className="min-h-screen bg-[color:var(--bone)] text-[color:var(--ink)]">
      {/* Header */}
      <header className="border-b border-black/10 bg-white sticky top-0 z-40">
        <div className="container-x flex items-center justify-between py-4">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="grid place-items-center w-9 h-9 bg-[color:var(--ink)] text-white font-display">
              P
            </div>
            <span className="font-display text-lg tracking-widest">
              PULSE<span className="text-[color:var(--blaze)]">GYM</span>
            </span>
          </Link>
          <Link
            to="/"
            hash="classes"
            className="inline-flex items-center gap-2 text-sm hover:text-[color:var(--blaze)]"
          >
            <ArrowLeft size={16} /> All programs
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={p.hero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[color:var(--bone)]" />
        </div>
        <div className="relative container-x py-24 md:py-32 text-white">
          <span className="eyebrow text-[color:var(--blaze)]">{p.eyebrow}</span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl leading-[0.95] max-w-4xl">
            {p.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">{p.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={p.ctaHref} className="btn-primary">
              {p.ctaLabel} <ArrowRight size={16} />
            </Link>
            <a
              href="#consult"
              className="btn-ghost text-white border-white/40 hover:border-[color:var(--blaze)]"
            >
              Free consultation
            </a>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container-x py-16 md:py-20">
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-black/80">
          {p.intro.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </section>

      {/* Audience */}
      <section className="bg-white border-y border-black/10 py-16 md:py-20">
        <div className="container-x">
          <span className="eyebrow">{p.audienceTitle}</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl mb-10">Is this you? 🔥</h2>
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {p.audience.map((a) => (
              <li
                key={a}
                className="flex items-start gap-3 p-4 border border-black/10 bg-[color:var(--bone)] hover:border-[color:var(--blaze)] hover:-translate-y-0.5 transition"
              >
                <CheckCircle2 className="text-[color:var(--blaze)] shrink-0 mt-0.5" size={20} />
                <span className="text-sm leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="container-x py-16 md:py-24">
        <span className="eyebrow">{p.featuresTitle}</span>
        <h2 className="mt-3 font-display text-4xl md:text-5xl mb-12">Everything included.</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {p.features.map(({ icon: Icon, title, copy }) => (
            <article
              key={title}
              className="group p-7 bg-white border border-black/10 hover:border-[color:var(--blaze)] hover:shadow-[0_20px_60px_-30px_rgba(255,60,40,0.6)] transition-all"
            >
              <div className="grid place-items-center w-12 h-12 bg-[color:var(--ink)] text-[color:var(--blaze)] mb-5 group-hover:bg-[color:var(--blaze)] group-hover:text-white transition-colors">
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 text-sm text-black/70 leading-relaxed">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Why + bullets */}
      <section className="bg-[color:var(--ink)] text-white py-20 md:py-28">
        <div className="container-x grid md:grid-cols-2 gap-12 items-start">
          <div>
            <span className="eyebrow text-[color:var(--blaze)]">Why it matters</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl leading-[1.05]">{p.whyTitle}</h2>
          </div>
          <div>
            <p className="text-white/80 text-lg leading-relaxed">{p.whyCopy}</p>
            {p.bullets && (
              <ul className="mt-8 grid sm:grid-cols-2 gap-3">
                {p.bullets.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 border-t border-white/15 pt-3">
                    <Icon className="text-[color:var(--blaze)]" size={18} />
                    <span className="text-sm">{text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      {p.results && (
        <section className="container-x py-16 md:py-20">
          <span className="eyebrow">{p.resultsTitle}</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl mb-10">
            Show up. Watch it change. 🔥
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {p.results.map((r) => (
              <div key={r} className="p-6 bg-white border border-black/10 flex items-center gap-3">
                <Flame className="text-[color:var(--blaze)]" size={20} />
                <span className="font-display text-xl">{r}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Free consultation glowing card */}
      <section id="consult" className="container-x py-16 md:py-24">
        <FreeConsultCard />
      </section>

      {/* CTA */}
      <section className="bg-[color:var(--blaze)] text-white py-20">
        <div className="container-x text-center">
          <h2 className="font-display text-4xl md:text-6xl leading-[1.02] max-w-3xl mx-auto">
            {p.closing}
          </h2>
          <Link
            to={p.ctaHref}
            className="mt-8 inline-flex items-center gap-2 bg-[color:var(--ink)] text-white px-8 py-4 font-display tracking-widest text-sm hover:bg-black transition"
          >
            {p.ctaLabel} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export function FreeConsultCard() {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-[color:var(--blaze)] via-orange-400 to-[color:var(--blaze)] opacity-70 blur-2xl group-hover:opacity-100 animate-pulse rounded-none" />
      <div className="relative bg-[color:var(--ink)] text-white p-8 md:p-12 border border-[color:var(--blaze)]/50 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[color:var(--blaze)]/30 blur-3xl rounded-full" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-8 justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-[color:var(--blaze)] text-xs font-display tracking-widest">
              <Sparkles size={14} /> FREE · NO COMMITMENT · 30 MINS
            </div>
            <h3 className="mt-3 font-display text-4xl md:text-5xl leading-[1.02]">
              Get a Free Fitness Consultation 🔥
            </h3>
            <p className="mt-4 text-white/75 leading-relaxed">
              Sit down with one of our head coaches. We'll assess your goals, review your movement,
              and design a roadmap tailored to you — before you spend a naira.
            </p>
          </div>
          <Link
            to="/auth"
            className="shrink-0 inline-flex items-center gap-2 bg-[color:var(--blaze)] hover:bg-white hover:text-[color:var(--ink)] text-white font-display tracking-widest text-sm px-7 py-4 shadow-[0_20px_60px_-15px_rgba(255,60,40,0.8)] transition-colors"
          >
            Claim my free session <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
