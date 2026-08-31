import { createFileRoute, Link } from "@tanstack/react-router";
import { FreeConsultCard } from "./programs.$slug";
import { useEffect, useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import {
  ArrowRight,
  ArrowDown,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Dumbbell,
  HeartPulse,
  Users,
  Activity,
  Send,
  Quote,
  Check,
  ChevronRight,
} from "lucide-react";
import heroVideoAsset from "@/assets/hero-neural-body.mp4";
import classesImg from "@/assets/gym-classes.jpg";
import personalImg from "@/assets/gym-personal.jpg";
import rehabImg from "@/assets/gym-rehab.jpg";
import trainer1Asset from "@/assets/aladesuyi-marvellous.jpg";
import trainer2Asset from "@/assets/ayodele-esther.jpg";
import trainer3Asset from "@/assets/godwin-john.jpg";
const trainer1 = trainer1Asset;
const trainer2 = trainer2Asset;
const trainer3 = trainer3Asset;

const EMAILJS_SERVICE_ID = "service_liri6br";
const EMAILJS_TEMPLATE_ID = "template_gg2mx7f";
const EMAILJS_PUBLIC_KEY = "nAsHaQs96w0LPCaSM";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PulseGym — Fitness · Strength · Lifestyle" },
      {
        name: "description",
        content:
          "PulseGym is a premium personal-training studio. Strength, conditioning, rehab, and coaching that transforms.",
      },
      { property: "og:title", content: "PulseGym — Fitness · Strength · Lifestyle" },
      {
        property: "og:description",
        content:
          "Premium personal-training studio. Strength, conditioning, rehab, and coaching built to transform.",
      },
    ],
  }),
  component: PulseGym,
});

const nav = [
  { label: "Classes", href: "#classes" },
  { label: "Training", href: "#training" },
  { label: "Team", href: "#team" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

function PulseGym() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-background text-foreground">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container-x flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2">
            <div className="grid place-items-center w-9 h-9 bg-[color:var(--ink)] text-white font-display text-lg">
              P
            </div>
            <span
              className={`relative font-display text-xl tracking-widest ${scrolled ? "text-[color:var(--ink)]" : "text-white"}`}
            >
              PULSE<span className="text-[color:var(--blaze)]">GYM</span>
              <svg
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[110%] -ml-[5%] h-8 overflow-visible pointer-events-none"
                viewBox="0 0 440 32"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="ecgPattern"
                    x="0"
                    y="0"
                    width="220"
                    height="32"
                    patternUnits="userSpaceOnUse"
                    className="ecg-pattern"
                  >
                    <path
                      d="M0,16 L60,16 L72,4 L92,28 L104,16 L140,16 L152,6 L172,26 L184,16 L220,16"
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="heartbeat-strike"
                    />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="440" height="32" fill="url(#ecgPattern)" />
              </svg>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {nav.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className={`font-display text-sm tracking-[0.2em] transition hover:text-[color:var(--blaze)] ${
                  scrolled ? "text-[color:var(--ink)]" : "text-white"
                }`}
              >
                {n.label.toUpperCase()}
              </a>
            ))}
            <Link to="/auth" className="btn-primary text-xs">
              Join Now <ArrowRight size={14} />
            </Link>
          </nav>
          <button
            className={`md:hidden ${scrolled ? "text-[color:var(--ink)]" : "text-white"}`}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="md:hidden bg-white border-t border-black/10">
            <div className="container-x py-6 flex flex-col gap-4">
              {nav.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="font-display tracking-widest text-[color:var(--ink)]"
                >
                  {n.label.toUpperCase()}
                </a>
              ))}
              <Link to="/auth" onClick={() => setOpen(false)} className="btn-primary self-start">
                Join Now
              </Link>
            </div>
          </div>
        )}
      </header>

      <Hero />
      <Marquee />
      <About />
      <Offer />
      <Training />
      <Team />
      <Pricing />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section id="home" className="relative h-[100svh] w-full overflow-hidden bg-black">
      <video
        src={heroVideoAsset}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-90 scale-125"
      />
      {/* mask over bottom-right Pika watermark, in case scale doesn't fully crop it */}
      <div className="absolute bottom-0 right-0 h-16 w-40 bg-black pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.8)_90%)] pointer-events-none" />
      <div className="relative z-10 h-full container-x flex flex-col justify-end pb-24 pt-32">
        <div className="max-w-4xl animate-rise">
          <span className="eyebrow text-white/80">Fitness · Strength · Lifestyle</span>
          <h1 className="mt-6 font-display text-white text-6xl sm:text-7xl md:text-[8rem] leading-[0.9]">
            Train hard.
            <br />
            <span className="text-[color:var(--blaze)]">Live strong.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-white/85 leading-relaxed">
            A premium personal-training studio built around five pillars: strength, conditioning,
            rehab, mobility, and mindset. No fluff — just real coaching that gets you real results.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/auth" className="btn-primary">
              Book a trial <ArrowRight size={16} />
            </Link>
            <a href="#training" className="btn-ghost">
              Explore programs
            </a>
          </div>
        </div>
      </div>
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/80 animate-bounce-down"
        aria-label="Scroll down"
      >
        <ArrowDown />
      </a>
    </section>
  );
}

function Marquee() {
  const items = [
    "STRENGTH",
    "MOBILITY",
    "REHAB",
    "CONDITIONING",
    "NUTRITION",
    "MINDSET",
    "COMMUNITY",
  ];
  const row = [...items, ...items, ...items];
  return (
    <div className="bg-[color:var(--ink)] text-white py-6 overflow-hidden border-y border-white/10">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span
            key={i}
            className="font-display text-3xl md:text-4xl tracking-[0.3em] flex items-center gap-16"
          >
            {t}
            <span className="text-[color:var(--blaze)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container-x grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-5">
          <span className="eyebrow">About PulseGym</span>
          <h2 className="mt-4 font-display text-5xl md:text-6xl leading-[0.95]">
            More than a gym.
            <br />A movement.
          </h2>
        </div>
        <div className="md:col-span-7 space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            PulseGym was founded on one belief — that every person deserves a strong body, a sharp
            mind, and unshakeable confidence. We build our programs around five key pillars:{" "}
            <strong className="text-foreground">Strength</strong>,{" "}
            <strong className="text-foreground">Conditioning</strong>,{" "}
            <strong className="text-foreground">Rehab</strong>,{" "}
            <strong className="text-foreground">Mobility</strong>, and{" "}
            <strong className="text-foreground">Mindset</strong>.
          </p>
          <p>
            Our floor is stocked with world-class equipment. Our coaches are certified, patient, and
            relentless. Whether you're chasing your first pull-up or your first hundred, we meet you
            where you are — and take you further than you thought possible.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
            {[
              { k: "10+", v: "Expert coaches" },
              { k: "500+", v: "Members trained" },
              { k: "8", v: "Years strong" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-4xl md:text-5xl text-[color:var(--ink)]">
                  {s.k}
                </div>
                <div className="text-sm uppercase tracking-widest text-muted-foreground mt-2">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Offer() {
  const cards = [
    {
      title: "Personal Training",
      copy: "1-on-1 coaching built around your body, your goals, your schedule.",
      img: personalImg,
      tag: "Most popular",
      slug: "personal-training",
    },
    {
      title: "Group Classes",
      copy: "High-energy small-group sessions — kettlebell, HIIT, mobility.",
      img: classesImg,
      slug: "group-classes",
    },
    {
      title: "Rehab & Recovery",
      copy: "Physio-led recovery to get you back stronger than before.",
      img: rehabImg,
      slug: "rehab-recovery",
    },
  ];
  return (
    <section id="classes" className="py-24 md:py-32 bg-[color:var(--bone)]">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="eyebrow">What we offer</span>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-[0.95]">
              Programs that
              <br />
              actually work.
            </h2>
          </div>
          <a
            href="#training"
            className="font-display tracking-widest text-sm text-[color:var(--ink)] hover:text-[color:var(--blaze)] transition inline-flex items-center gap-2"
          >
            View all training <ChevronRight size={16} />
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <Link
              to="/programs/$slug"
              params={{ slug: c.slug }}
              key={c.title}
              className="group relative overflow-hidden bg-white aspect-[3/4] cursor-pointer block"
            >
              <img
                src={c.img}
                alt={c.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              {c.tag && (
                <span className="absolute top-6 left-6 bg-[color:var(--blaze)] text-white text-[11px] uppercase tracking-widest px-3 py-1 font-display">
                  {c.tag}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <h3 className="font-display text-3xl">{c.title}</h3>
                <p className="mt-3 text-sm text-white/80 leading-relaxed">{c.copy}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase border-b border-white/60 pb-1 group-hover:border-[color:var(--blaze)] group-hover:text-[color:var(--blaze)] transition">
                  Learn more <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Free consultation glowing card */}
        <div className="mt-10">
          <FreeConsultCard />
        </div>
      </div>
    </section>
  );
}

function Training() {
  const pillars = [
    {
      icon: Dumbbell,
      title: "Strength & Conditioning",
      copy: "Structured barbell and kettlebell programs to build raw strength and full-body power.",
    },
    {
      icon: HeartPulse,
      title: "Rehab & Prehab",
      copy: "Physio-led movement screening and recovery protocols that keep you training pain-free.",
    },
    {
      icon: Activity,
      title: "Mobility & Movement",
      copy: "Restore range of motion, fix imbalances, and move like an athlete — at any age.",
    },
    {
      icon: Users,
      title: "Small Group Coaching",
      copy: "Capped at 6. Personalised attention with the energy of a team session.",
    },
  ];
  return (
    <section id="training" className="py-24 md:py-32 bg-[color:var(--ink)] text-white">
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="eyebrow">Our five pillars</span>
          <h2 className="mt-4 font-display text-5xl md:text-6xl leading-[0.95] text-white">
            Every program.
            <br />
            Every body. Every goal.
          </h2>
        </div>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="border-t border-white/20 pt-8 group">
              <Icon
                className="text-[color:var(--blaze)] mb-6 group-hover:scale-110 transition-transform"
                size={40}
                strokeWidth={1.5}
              />
              <h3 className="font-display text-2xl text-white">{title}</h3>
              <p className="mt-4 text-white/70 text-sm leading-relaxed">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  const trainers = [
    {
      name: "Aladesuyi Marvellous",
      role: "Head Strength Coach",
      img: trainer1,
      tags: ["Powerlifting", "Barbell"],
    },
    {
      name: "Ayodele Esther",
      role: "Performance Coach",
      img: trainer2,
      tags: ["Conditioning", "Women's Health"],
    },
    {
      name: "Godwin John",
      role: "Movement Specialist",
      img: trainer3,
      tags: ["Mobility", "Rehab"],
    },
  ];
  return (
    <section id="team" className="py-24 md:py-32 bg-background">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="eyebrow">Meet the team</span>
            <h2 className="mt-4 font-display text-5xl md:text-6xl leading-[0.95]">
              Coaches who
              <br />
              take it seriously.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Certified, patient, and obsessed with the craft. Every trainer at PulseGym has spent
            years refining their eye for movement.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {trainers.map((t) => (
            <div key={t.name} className="group">
              <div className="relative overflow-hidden aspect-[4/5] bg-muted">
                <img
                  src={t.img}
                  alt={t.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
              </div>
              <div className="mt-6">
                <h3 className="font-display text-2xl">{t.name}</h3>
                <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
                  {t.role}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] uppercase tracking-widest border border-border px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Drop-in",
      price: "₦8,000",
      per: "single session",
      features: ["Access to any group class", "Full facility access", "No commitment"],
    },
    {
      name: "Monthly",
      price: "₦45,000",
      per: "per month",
      featured: true,
      features: [
        "Unlimited group classes",
        "1 personal-training session",
        "Nutrition guidance",
        "Recovery lounge",
      ],
    },
    {
      name: "PT Pro",
      price: "₦120,000",
      per: "per month",
      features: [
        "8 personal-training sessions",
        "Unlimited group classes",
        "Custom nutrition plan",
        "Priority booking",
      ],
    },
  ];
  return (
    <section id="pricing" className="py-24 md:py-32 bg-[color:var(--bone)]">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow">Membership</span>
          <h2 className="mt-4 font-display text-5xl md:text-6xl leading-[0.95]">
            Simple pricing.
            <br />
            Serious results.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`p-10 flex flex-col ${
                p.featured
                  ? "bg-[color:var(--ink)] text-white md:-translate-y-4 shadow-2xl"
                  : "bg-white border border-border"
              }`}
            >
              {p.featured && (
                <span className="self-start bg-[color:var(--blaze)] text-white text-[11px] uppercase tracking-widest px-3 py-1 font-display mb-6">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-3xl">{p.name}</h3>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-6xl">{p.price}</span>
                <span
                  className={`text-sm uppercase tracking-widest ${p.featured ? "text-white/60" : "text-muted-foreground"}`}
                >
                  /{p.per}
                </span>
              </div>
              <ul className="mt-8 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check
                      size={18}
                      className={
                        p.featured ? "text-[color:var(--blaze)]" : "text-[color:var(--ink)]"
                      }
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                search={{ plan: p.name as "Drop-in" | "Monthly" | "PT Pro" }}
                className={`mt-10 inline-flex items-center justify-center gap-2 py-4 font-display tracking-widest text-xs transition ${
                  p.featured
                    ? "bg-[color:var(--blaze)] text-white hover:bg-white hover:text-[color:var(--ink)]"
                    : "bg-[color:var(--ink)] text-white hover:bg-[color:var(--blaze)]"
                }`}
              >
                Choose {p.name} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      q: "PulseGym is the first place I've trained where I actually feel seen. The coaching is unmatched.",
      n: "Chidera A.",
      r: "Member since 2022",
    },
    {
      q: "I came in for weight loss. I stayed for the community. Down 18kg and stronger than I've ever been.",
      n: "Yusuf B.",
      r: "Member since 2021",
    },
    {
      q: "The rehab program got me squatting pain-free after two years of avoiding the gym. Life-changing.",
      n: "Aisha O.",
      r: "Member since 2023",
    },
  ];
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container-x">
        <div className="max-w-3xl mb-16">
          <span className="eyebrow">Testimonials</span>
          <h2 className="mt-4 font-display text-5xl md:text-6xl leading-[0.95]">
            Real people.
            <br />
            Real transformations.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <blockquote key={q.n} className="bg-[color:var(--bone)] p-10">
              <Quote className="text-[color:var(--blaze)]" size={32} />
              <p className="mt-6 text-lg leading-relaxed">"{q.q}"</p>
              <footer className="mt-8 pt-6 border-t border-black/10">
                <div className="font-display text-lg">{q.n}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                  {q.r}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: data.get("name"),
          from_email: data.get("email"),
          subject: data.get("subject") || "PulseGym enquiry",
          message: data.get("message"),
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      setStatus("sent");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-[color:var(--ink)] text-white">
      <div className="container-x grid md:grid-cols-2 gap-16">
        <div>
          <span className="eyebrow">Get in touch</span>
          <h2 className="mt-4 font-display text-5xl md:text-6xl leading-[0.95] text-white">
            Ready to
            <br />
            train with us?
          </h2>
          <p className="mt-6 text-white/70 max-w-md leading-relaxed">
            Book a free intro session and we'll walk you through the floor, meet your coach, and
            design a plan around your goals.
          </p>
          <div className="mt-10 space-y-5">
            <a href="mailto:oemma5422@gmail.com" className="flex items-center gap-4 group">
              <div className="grid place-items-center w-12 h-12 border border-white/20 group-hover:bg-[color:var(--blaze)] group-hover:border-[color:var(--blaze)] transition">
                <Mail size={18} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-white/50">Email</div>
                <div className="text-white">oemma5422@gmail.com</div>
              </div>
            </a>
            <a href="tel:+2347088118226" className="flex items-center gap-4 group">
              <div className="grid place-items-center w-12 h-12 border border-white/20 group-hover:bg-[color:var(--blaze)] group-hover:border-[color:var(--blaze)] transition">
                <Phone size={18} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-white/50">Phone</div>
                <div className="text-white">+234 708 811 8226</div>
              </div>
            </a>
            <div className="flex items-center gap-4">
              <div className="grid place-items-center w-12 h-12 border border-white/20">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-white/50">Studio</div>
                <div className="text-white">Ibadan, Nigeria</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <Field name="name" label="Name" required />
            <Field name="email" label="Email" type="email" required />
          </div>
          <Field name="subject" label="Subject" />
          <div>
            <label className="text-xs uppercase tracking-widest text-white/60">Message</label>
            <textarea
              name="message"
              required
              rows={5}
              className="mt-2 w-full bg-transparent border-b border-white/30 focus:border-[color:var(--blaze)] outline-none py-3 text-white resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {status === "sending"
              ? "Sending..."
              : status === "sent"
                ? "Message sent ✓"
                : "Send message"}
            {status !== "sent" && status !== "sending" && <Send size={16} />}
          </button>
          {status === "error" && (
            <p className="text-sm text-[color:var(--blaze)]">
              Something went wrong. Please try again or email us directly.
            </p>
          )}
          {status === "sent" && (
            <p className="text-sm text-green-400">Thanks! We'll be in touch within 24 hours.</p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-white/60">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full bg-transparent border-b border-white/30 focus:border-[color:var(--blaze)] outline-none py-3 text-white"
      />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white/70 py-16">
      <div className="container-x grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="grid place-items-center w-9 h-9 bg-white text-black font-display text-lg">
              P
            </div>
            <span className="font-display text-xl tracking-widest text-white">
              PULSE<span className="text-[color:var(--blaze)]">GYM</span>
            </span>
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed">
            A premium personal-training studio in Ibadan. Fitness · Strength · Lifestyle.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid place-items-center w-10 h-10 border border-white/20 hover:bg-[color:var(--blaze)] hover:border-[color:var(--blaze)] transition"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="font-display text-white tracking-widest mb-4">Explore</div>
          <ul className="space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-white transition">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-display text-white tracking-widest mb-4">Hours</div>
          <ul className="space-y-2 text-sm">
            <li>Mon–Fri · 5:30am–10pm</li>
            <li>Sat · 7am–8pm</li>
            <li>Sun · 8am–4pm</li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-12 pt-6 border-t border-white/10 text-xs flex flex-col md:flex-row justify-between gap-3">
        <span>© {new Date().getFullYear()} PulseGym. All rights reserved.</span>
        <span>Built with strength in Ibadan.</span>
      </div>
    </footer>
  );
}
