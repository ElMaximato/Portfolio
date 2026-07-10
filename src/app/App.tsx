import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import {User, Code2, Cpu, Briefcase, GraduationCap, Award, FileText, Mail,
       ChevronLeft, ChevronRight, ExternalLink, Github, X, Palette,
       Zap, Globe, Check, Download, Gamepad2, Wifi, BatteryFull,} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────
type ThemeKey = "light" | "dark" | "oledBlack";

interface ThemeDef {
  name: string;
  swatch: string;
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  border: string;
  borderBottom: string;
  borderBottom2: string;
  navBg: string;
  panelBg: string;
  headerBg: string;
  shadow: string;
  selectedGlow: string;
}

interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  colors: [string, string, string];
  emoji: string;
  // Ruta o URL de la carátula real del proyecto. Si viene vacía, se usa el
  // degradado + emoji como fallback (ver CartridgeCover más abajo).
  image?: string;
  tech: string[];
  year: string;
  role: string;
  github: string;
  demo: string;
  highlights: string[];
  overview: string;
  challenges: string;
}

// ─── THEME DEFINITIONS ───────────────────────────────────────────────────────

const THEMES: Record<ThemeKey, ThemeDef> = {
  light: {
    name: "Light", swatch: "#ffffff",
    bg: "#f0f0f6", surface: "#ffffff", surfaceAlt: "#f8f8fc",
    text: "#0a0a14", muted: "#72728a", accent: "#5046e5", accentText: "#ffffff",
    border: "rgba(255, 255, 255, 0)", navBg: "rgba(255,255,255,0.78)",
    borderBottom: "rgb(33, 33, 33)",
    borderBottom2: "rgba(180, 180, 180, 0.97)", 
    panelBg: "rgba(255,255,255,0.97)", headerBg: "rgba(240,240,246,0.84)",
    shadow: "0 16px 64px rgba(0,0,0,0.10), 0 2px 12px rgba(0,0,0,0.06)",
    selectedGlow: "0 0 0 3px rgba(65, 150, 250), 0 24px 64px rgba(80,70,229,0.2)",
  },
  dark: {
    name: "Dark", swatch: "#2d2d2d",

    bg: "#2d2d2d", surface: "#2d2d2d", surfaceAlt: "#2d2d2d",

    text: "#e6e6e6", muted: "#8888a8", accent: "#7c6fff", accentText: "#ffffff",

    border: "rgba(45, 45, 45, 0.97)", navBg: "#2d2d2d",     

    borderBottom: "rgba(45, 45, 45, 0.97)",                         //down navbar and lines
    borderBottom2: "rgba(154, 154, 154, 0.97)",                         //down navbar and lines

    panelBg: "rgba(45, 45, 45, 0.97)",headerBg: "rgba(45, 45, 45, 0.84)",

    shadow: "0 16px 64px rgba(0,0,0,0.40), 0 2px 12px rgba(0,0,0,0.25)",

    selectedGlow: "0 0 0 3px rgba(65, 150, 250), 0 24px 64px rgba(80,70,229,0.2)",  // glow de los proyectos
  },
  oledBlack: {
    name: "OLED Black", swatch: "#000000",
    bg: "#000000", surface: "#0d0d0d", surfaceAlt: "#111111",
    text: "#ffffff", muted: "#606060", accent: "#e0e0e0", accentText: "#000000",
    border: "rgba(255,255,255,0.05)", navBg: "rgba(13,13,13,0.92)",
    borderBottom: "rgba(255,255,255,0.05)",
    borderBottom2: "rgba(154, 154, 154, 0.97)", 
    panelBg: "rgba(8,8,8,0.98)", headerBg: "rgba(0,0,0,0.95)",
    shadow: "0 16px 64px rgba(0,0,0,0.85), 0 2px 12px rgba(0,0,0,0.6)",
    selectedGlow: "0 0 0 3px rgba(224,224,224,0.35), 0 24px 64px rgba(255,255,255,0.05)",
  },
};

const THEME_ORDER: ThemeKey[] = ["light", "dark", "oledBlack"];

// ─── PROFILE PICTURE ──────────────────────────────────────────────────────────
// Pon aquí la ruta o URL de tu foto (ej. "/avatar.png" si la guardas en /public
// de tu proyecto Vite). Si la dejas vacía, se usa el emoji 👤 como respaldo.
const PROFILE_IMAGE = "/linkk.png";

// ─── PROJECT DATA ─────────────────────────────────────────────────────────────
// Tip: pon la ruta de tu imagen en "image" (por ejemplo "/covers/neoshop.png"
// si la guardas en la carpeta /public de tu proyecto Vite). Si la dejas vacía
// ("") se usa automáticamente el degradado + emoji como respaldo.

const PROJECTS: Project[] = [
  {
    id: "neoshop",
    title: "TicketX",
    tagline: "Ticket sales platform",
    description: "",
    colors: ["#bdbdbd", "#397458", "#397458"],
    emoji: "🎫",
    image: "/TicketX10.png",
    tech: ["TypeScript", "MySQL", "Stripe API", "Tailwind CSS"],
    year: "2026",
    role: "Frontend Architect",
    github: "https://github.com/ChrisDjMh/ProyectoAurelioParte2",
    demo: "google.com",
    highlights: [""],
    overview: "Developed TicketX, a comprehensive full-stack ticketing platform designed for diverse events such as music concerts and stand-up comedy shows. The application manages the entire end-to-end purchase lifecycle, from real-time event browsing to secure checkout. By integrating the Stripe API, the platform ensures seamless and reliable payment processing, providing users with a fast and trustworthy experience while enabling administrators to efficiently track sales and manage event inventory.",
    challenges: "The primary technical challenge involved implementing a secure and atomic payment flow using Stripe, ensuring that ticket inventory is correctly updated only upon successful transaction confirmation. I had to manage asynchronous state updates to prevent overbooking while maintaining a smooth user experience during high-traffic moments. Furthermore, protecting the integrity of the checkout process required rigorous server-side validation to prevent manipulation of ticket pricing or quantities, as well as handling webhook events to accurately synchronize payment status with the internal database.",
  },
  {
    id: "pulsar",
    title: "Sistema de Objetos Perdidos para Hoteles Mirra",
    tagline: "Real-time data intelligence",
    description: "Live analytics dashboard processing 10M+ events per day with pixel-perfect charts.",
    colors: ["#114799", "#114799", "#114799"],
    emoji: "📊",
    image: "/araiza.png",
    tech: ["React", "TypeScript", "Node.js", "Figma", "MySQL"],
    year: "2026",
    role: "Frontend Architect",
    github: "https://github.com/ElMaximato/Objetos_Perdidos_Hotel",
    demo: "https://hotelfer.utportfolio.cloud/",
    highlights: [""],
    overview: "Developed a centralized Lost & Found management system for the Mirra hotel chain. This platform streamlines the recovery process by allowing users to report and track their missing belongings efficiently. The system features a robust administrative dashboard for hotel staff to manage and categorize items, complemented by a secure public-facing portal. It ensures data integrity through rigorous validation processes and restricted access controls, providing both guests and administrators with a reliable and transparent solution for item recovery.",
    challenges: "Deploying this application presented unique technical hurdles, primarily in ensuring the security and privacy of sensitive guest data. I implemented strict role-based access controls to differentiate between guest submissions and administrative management, ensuring that only authorized personnel can handle item records. Handling file uploads for item images required implementing optimized storage solutions and strict server-side validation to maintain system performance and security. Additionally, managing database relationships between multiple hotel branches and user reports required careful indexing to ensure fast search capabilities across the entire chain",
  },
  {
    id: "aetherui",
    title: "Sitio Web Riu Padel",
    tagline: "Sitio Web de la Riu Padel",
    description: "Sitio para el complex de la Riu Padel de San Luis Rio Colorado",
    colors: ["#58b41e", "#3057cc", "#58b41e"],
    emoji: "🎾",
    image: "/riu.jpg",
    tech: ["React", "TypeScript", "CSS-in-JS", "Figma API"],
    year: "2026",
    role: "Fullstack",
    github: "https://github.com/ElMaximato/NovaShip-Landing",
    demo: "https://fernando.utportfolio.cloud/",
    highlights: [""],
    overview: "Development of a comprehensive web platform for the Rui Padel sports complex. The site offers an intuitive user experience where players can explore the facilities, check pricing, and discover exclusive promotions. Additionally, it integrates a dynamic court booking system, centralizing all key information about the complex into a modern and accessible interface.",
    challenges: "Deploying this full-stack application to a VPS involved overcoming several key challenges, including ensuring environment consistency for Node.js and npm versions between local development and the production server. I configured Nginx as a reverse proxy to handle traffic routing and secure the connection, while implementing PM2 to guarantee that the backend service remains stable and runs reliably in the background. Additionally, I prioritized system security by configuring firewalls and properly managing environment variables to protect sensitive data and API keys.",
  },
  {
    id: "",
    title: "",
    tagline: "",
    description: "",
    colors: ["#dddddd", "#dddddd", "#dddddd"],
    emoji: "",
    image: "",
    tech: [""],
    year: "",
      role: "",
      github: "",
      demo: "",
      highlights: [""],
      overview: "",
      challenges: "",
    },
     {
    id: "",
    title: "",
    tagline: "",
    description: "",
    colors: ["#dddddd", "#dddddd", "#dddddd"],
    emoji: "",
    image: "",
    tech: [""],
    year: "",
      role: "",
      github: "",
      demo: "",
      highlights: [""],
      overview: "",
      challenges: "",
    },
     {
    id: "",
    title: "",
    tagline: "",
    description: "",
    colors: ["#dddddd", "#dddddd", "#dddddd"],
    emoji: "",
    image: "",
    tech: [""],
    year: "",
      role: "",
      github: "",
      demo: "",
      highlights: [""],
      overview: "",
      challenges: "",
    },
  ];

// ─── NAVIGATION ITEMS ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "about",      Icon: User,           label: "About Me",      color: "#5046e5" },
  { id: "skills",     Icon: Code2,          label: "Skills",        color: "#059669" },
  { id: "tech",       Icon: Cpu,            label: "Technologies",  color: "#dc2626" },
  { id: "experience", Icon: Briefcase,      label: "Experience",    color: "#d9af06" },
  { id: "education",  Icon: GraduationCap,  label: "Education",     color: "#7c3aed" },
  { id: "certs",      Icon: Award,          label: "Certifications",color: "#0891b2" },
  { id: "resume",     Icon: FileText,       label: "Resume",        color: "#be123c" },
  { id: "contact",    Icon: Mail,           label: "Contact",       color: "#a0a0a0" },
] as const;

type NavId = "about" | "skills" | "tech" | "experience" | "education" | "certs" | "resume" | "contact" | "settings" | "profile";

// ─── SPRING CONFIG ────────────────────────────────────────────────────────────

const spring = { type: "spring" as const, stiffness: 320, damping: 30 };
const springFast = { type: "spring" as const, stiffness: 400, damping: 35 };
const springGentle = { type: "spring" as const, stiffness: 200, damping: 28 };

// ─── CARTRIDGE COVER ──────────────────────────────────────────────────────────
// Si el proyecto trae una imagen real (project.image), se muestra a pantalla
// completa dentro del cartucho — como una carátula real de Switch — y se
// omiten el emoji/degradado/badge, porque el título ya se muestra arriba
// vía el componente SwitchTitle. Si no hay imagen, se conserva el diseño
// original con degradado + emoji como respaldo.

function CartridgeCover({ project }: { project: Project }) {
  if (project.image) {
    return (
      <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
        <img
          src={project.image}
          alt={project.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }

  const [c1, c2, c3] = project.colors;
  return (
    <div style={{
      background: `linear-gradient(145deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`,
      width: "100%", height: "100%",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      {/* Noise grain */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
        mixBlendMode: "overlay",
      }} />
      {/* Top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        padding: "10px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 9, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase" }}>
          Portfolio
        </span>
        <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>
          {project.year}
        </span>
      </div>
      {/* Decorative rings */}
      <div style={{
        position: "absolute", top: "18%", right: "-20%",
        width: 120, height: 120, borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.12)",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "-15%",
        width: 90, height: 90, borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.10)",
      }} />
      {/* Emoji icon */}
      <div style={{
        fontSize: 52, lineHeight: 1, marginBottom: 10,
        filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.25))",
      }}>
        {project.emoji}
      </div>
      {/* Title */}
      <div style={{
        color: "rgba(255,255,255,0.95)",
        fontWeight: 900, fontSize: 17,
        letterSpacing: -0.5,
        textShadow: "0 2px 12px rgba(0,0,0,0.25)",
        textAlign: "center", padding: "0 12px",
      }}>
        {project.title}
      </div>
      {/* Bottom badge */}
      <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{
          background: "rgba(0,0,0,0.22)",
          backdropFilter: "blur(10px)",
          borderRadius: 20, padding: "3px 11px",
          fontSize: 9, color: "rgba(255,255,255,0.85)",
          fontWeight: 700, letterSpacing: 0.5,
        }}>
          {project.role}
        </div>
      </div>
      {/* Shine overlay */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "45%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.13) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ─── PROJECT PAGE ─────────────────────────────────────────────────────────────

function ProjectPage({ project, theme, onClose }: { project: Project; theme: ThemeDef; onClose: () => void }) {
  const [c1, c2, c3] = project.colors;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 20 }}
      transition={springGentle}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: theme.bg,
        overflowY: "auto",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Hero */}
      <div style={{
        height: 340,
        background: `linear-gradient(145deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`,
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end", padding: "0 40px 36px",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }} />
        <div style={{ position: "absolute", top: "15%", right: "8%", fontSize: 120, opacity: 0.15, lineHeight: 1 }}>
          {project.emoji}
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
            {project.year} · {project.role}
          </div>
          <h1 style={{ color: "#fff", fontSize: 44, fontWeight: 900, letterSpacing: -1.5, margin: 0, lineHeight: 1 }}>
            {project.title}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 18, fontWeight: 400, marginTop: 10, marginBottom: 0 }}>
            {project.tagline}
          </p>
        </div>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 20, right: 20,
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(0,0,0,0.22)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px 80px" }}>
        {/* Highlights */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
          {project.highlights.map((h) => (
            <div key={h} style={{
              background: `${c1}18`,
              border: `1px solid ${c1}30`,
              borderRadius: 20, padding: "6px 16px",
              fontSize: 13, fontWeight: 700,
              color: theme.text,
            }}>
              <Check size={12} style={{ display: "inline", marginRight: 6, color: c1 }} />
              {h}
            </div>
          ))}
        </div>

        {/* Overview */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ color: theme.text, fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 14 }}>
            Overview
          </h2>
          <p style={{ color: theme.muted, fontSize: 15, lineHeight: 1.75, margin: 0 }}>
            {project.overview}
          </p>
        </section>

        {/* Challenges */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ color: theme.text, fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 14 }}>
            Technical Challenges
          </h2>
          <p style={{ color: theme.muted, fontSize: 15, lineHeight: 1.75, margin: 0 }}>
            {project.challenges}
          </p>
        </section>

        {/* Tech Stack */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ color: theme.text, fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 14 }}>
            Tech Stack
          </h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {project.tech.map((t) => (
              <span key={t} style={{
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 10, padding: "6px 14px",
                fontSize: 13, fontWeight: 600,
                color: theme.text,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href={project.demo} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: 8,
            background: `linear-gradient(135deg, ${c1}, ${c2})`,
            color: "#fff", padding: "12px 24px",
            borderRadius: 12, fontWeight: 700, fontSize: 14,
            textDecoration: "none", boxShadow: `0 8px 24px ${c1}40`,
          }}>
            <Globe size={16} /> Live Demo
          </a>
          <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: 8,
            background: theme.surface, color: theme.text,
            border: `1px solid ${theme.border}`,
            padding: "12px 24px", borderRadius: 12,
            fontWeight: 700, fontSize: 14, textDecoration: "none",
            boxShadow: theme.shadow,
          }}>
            <Github size={16} /> View Code
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── XP METER ─────────────────────────────────────────────────────────────────

function XPMeter({ theme }: { theme: ThemeDef }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: theme.text, lineHeight: 1.1, letterSpacing: -0.2 }}>

        </div>
        <div style={{ fontSize: 9.5, fontWeight: 600, color: theme.muted, letterSpacing: 0.3 }}>

        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <div style={{
          width: 64, height: 10, borderRadius: 5,
          background: theme.border, overflow: "hidden",
          border: `1px solid ${theme.border}`,
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "82%" }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: "100%", borderRadius: 5,
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}aa)`,
            }}
          />
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, color: theme.muted }}>82% XP</div>
      </div>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}88)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Zap size={13} color={theme.accentText} />
      </div>
    </div>
  );
}

// ─── PANEL CONTENT COMPONENTS ─────────────────────────────────────────────────

function SkillBar({ name, pct, color, theme }: { name: string; pct: number; color: string; theme: ThemeDef }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{name}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: theme.muted }}>{pct}%</span>
      </div>
      <div style={{ height: 7, background: theme.border, borderRadius: 4, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{ height: "100%", background: color, borderRadius: 4 }}
        />
      </div>
    </div>
  );
}

function AboutPanel({ theme }: { theme: ThemeDef }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 20, marginBottom: 28, alignItems: "flex-start" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, ${theme.accent}, #f093fb)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32,
        }}>
          👤
        </div>
        <div>
          <h2 style={{ color: theme.text, fontSize: 22, fontWeight: 800, margin: "0 0 4px", letterSpacing: -0.5 }}>Fernando Velazquez Flores</h2>
          <p style={{ color: theme.accent, fontSize: 14, fontWeight: 600, margin: "0 0 8px" }}>Software developer</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[["📍", "Yuma, Arizona"], ["🗓️", "2 years exp"], ["☕", "Open to work"]].map(([icon, text]) => (
              <span key={text} style={{ fontSize: 12, color: theme.muted, display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                {icon} {text}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p style={{ color: theme.muted, fontSize: 14, lineHeight: 1.75, marginBottom: 20 }}>
        I build fast, accessible, and beautiful web experiences. My focus is on the intersection of great engineering and great design — creating interfaces that feel as good as they perform. I love React, TypeScript, and the web platform deeply.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {["React", "TypeScript", "Figma", "Node.js"].map((t) => (
          <span key={t} style={{
            background: `${theme.accent}14`, border: `1px solid ${theme.accent}25`,
            borderRadius: 8, padding: "4px 12px",
            fontSize: 12, fontWeight: 600, color: theme.text,
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function SkillsPanel({ theme }: { theme: ThemeDef }) {
  const skills = [
    { name: "React", pct: 80, color: "#61dafb" },
    { name: "TypeScript", pct: 80, color: "#3178c6" },
    { name: "CSS / Tailwind", pct: 65, color: "#06b6d4" },
    { name: "Node.js", pct: 80, color: "#68a063" },

  ];
  return (
    <div>
      <h2 style={{ color: theme.text, marginLeft: 160, fontSize: 20, fontWeight: 800, marginBottom: 20, letterSpacing: -0.4 }}>Skill Proficiency</h2>
      <div style={{ marginLeft: 160 }}>
      {skills.map((s) => <SkillBar key={s.name} {...s} theme={theme} />)}
    </div>
      </div>  
  );
}

function TechPanel({ theme }: { theme: ThemeDef }) {
  const stacks = [
    { cat: "Frontend", items: ["React", "TypeScript", "Tailwind CSS"] },
    { cat: "Backend", items: ["Node.js", "FastAPI", "Stripe API", "ExpressJS"] },
    { cat: "Data & Cloud", items: ["MySQL", "MongoDB"] },
    { cat: "Tooling", items: ["Figma", "GitHub Actions", "AI"] },
  ];
  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 800, marginBottom: 20, letterSpacing: -0.4 }}>Tech Stack</h2>
      {stacks.map((s) => (
        <div key={s.cat} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: theme.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
            {s.cat}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {s.items.map((item) => (
              <span key={item} style={{
                background: theme.surfaceAlt, border: `1px solid ${theme.border}`,
                borderRadius: 8, padding: "5px 12px",
                fontSize: 12, fontWeight: 600, color: theme.text,
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperiencePanel({ theme }: { theme: ThemeDef }) {
  const jobs = [
    {
      company: "Hoteles Mirra", role: "Full Stack", period: "2025 – Present",
      desc: "Developed a Hotel lost and found project, providing a platform for hotel guests to find their lost items.",
      color: "#000000",
    },
    {
      company: "Age Recovery", role: "Frontend Developer", period: "2024 – 2025",
      desc: "Developed a user-friendly interface for the Age Recovery app, enabling users to agend and track their medication schedules.",
      color: "#96bf48",
    },
    {
      company: "Spindle Cooling", role: "Quality Control Technician", period: "2025 – 2025",
      desc: "Quality control technician for the Spindle Cooling system, ensuring the quality of fruits and vegetables delivered to customers.",
      color: "#0051ff",
    },
  ];
  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 800, marginBottom: 20, marginLeft: 160, letterSpacing: -0.4 }}>Work Experience</h2>
      {jobs.map((j, i) => (
        <div key={j.company} style={{ marginLeft: 160, display: "flex", gap: 16, marginBottom: i < jobs.length - 1 ? 24 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${j.color}18`, border: `1.5px solid ${j.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
              💼
            </div>
            {i < jobs.length - 1 && <div style={{ width: 1.5, flex: 1, background: theme.border, marginTop: 8 }} />}
          </div>
          <div style={{ paddingBottom: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: theme.text, letterSpacing: -0.3 }}>{j.company}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.accent, marginBottom: 2 }}>{j.role}</div>
            <div style={{ fontSize: 11, color: theme.muted, fontWeight: 600, marginBottom: 6, letterSpacing: 0.3 }}>{j.period}</div>
            <p style={{ fontSize: 13, color: theme.muted, lineHeight: 1.6, margin: 0 }}>{j.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function EducationPanel({ theme }: { theme: ThemeDef }) {
  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 800, marginLeft:160,marginBottom: 20, letterSpacing: -0.4 }}>Education</h2>
      <div style={{ background: theme.surfaceAlt, border: `1px solid ${theme.border}`, borderRadius: 16, marginLeft: 160, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>🎓</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: theme.text, marginBottom: 4, letterSpacing: -0.3 }}>
          Universidad Tecnológica de San Luis Rio Colorado
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: theme.accent, marginBottom: 4 }}>
          Software Development Ingeneering
        </div>
        <div style={{ fontSize: 12, color: theme.muted, fontWeight: 600, marginBottom: 10 }}>
          2022 – 2027 · Grade: 9.8
        </div>
        <p style={{ fontSize: 13, color: theme.muted, lineHeight: 1.65, margin: 0 }}>
          Engeneering degree in Computer Science. Thesis on adaptive UI personalization using reinforcement learning. Recipient of the Gates Computer Science Scholarship.
        </p>
      </div>
      <div style={{ background: theme.surfaceAlt, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 20, marginLeft: 160 }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>🏫</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: theme.text, marginBottom: 4 }}>
          Colegio de Bachilleres del Estado de Sonora
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: theme.accent, marginBottom: 4 }}>
          Humanidades
        </div>
        <div style={{ fontSize: 12, color: theme.muted, fontWeight: 600 }}>2019 - 2022</div>
      </div>
    </div>
  );
}

function CertsPanel({ theme }: { theme: ThemeDef }) {
  const certs = [
    { name: "TSU Superior Univeristy Technician", issuer: "Universidad Tecnologica de San Luis Rio Colorado", year: "2025", emoji: "🧑‍💻", color: "#15ff00" },
    { name: "High School Certificate", issuer: "Colegio de Bachilleres del Estado de Sonora", year: "2022", emoji: "🎓", color: "#f46642" },
  ];
  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 800, marginBottom: 20, letterSpacing: -0.4, marginLeft: 160 }}>Certifications</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {certs.map((c) => (
          <div key={c.name} style={{
            background: theme.surfaceAlt, border: `1px solid ${theme.border}`,
            borderRadius: 14, padding: 16, marginLeft: 160,
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{c.emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: theme.text, lineHeight: 1.3, marginBottom: 4 }}>
              {c.name}
            </div>
            <div style={{ fontSize: 11, color: theme.muted, fontWeight: 600, marginBottom: 2 }}>{c.issuer}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: 10, color: "#10b981", fontWeight: 700 }}>Active · {c.year}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumePanel({ theme }: { theme: ThemeDef }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px 0", marginLeft: 160 }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>📄</div>
      <h2 style={{ color: theme.text, fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>
        Fernando Velazquez Flores — Resume
      </h2>
      <p style={{ color: theme.muted, fontSize: 14, lineHeight: 1.65, marginBottom: 28, maxWidth: 320 }}>
        5 years of experience in software development, with a focus on React, TypeScript, and performance-critical web applications.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: theme.accent, color: theme.accentText,
          border: "none", padding: "12px 24px", borderRadius: 12,
          fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>
          <Download size={16} /> Download PDF
        </button>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: theme.surfaceAlt, color: theme.text,
          border: `1px solid ${theme.border}`,
          padding: "12px 24px", borderRadius: 12,
          fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>
          <ExternalLink size={16} /> View Online
        </button>
      </div>
    </div>
  );
}

function ContactPanel({ theme }: { theme: ThemeDef }) {
  const links = [
    { icon: Mail, label: "Email", value: "ferbashpro@gmail.com", href: "mailto:ferbashpro@gmail.com" },
    { icon: Github, label: "GitHub", value: "El Maximato", href: "https://github.com/ElMaximato" },
    { icon: ExternalLink, label: "Youtube", value: "Youtube.com/ElMaximato", href: "https://www.youtube.com/@elmaximato869" },
    { icon: Globe, label: "Phone", value: "653136416"}
  ];
  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 800, marginBottom: 6, letterSpacing: -0.4 }}>Get in Touch</h2>
      <p style={{ color: theme.muted, fontSize: 13, lineHeight: 1.65, marginBottom: 24 }}>
        Always happy to chat about interesting projects, collaborations, or opportunities.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {links.map(({ icon: Icon, label, value, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: 14,
            background: theme.surfaceAlt, border: `1px solid ${theme.border}`,
            borderRadius: 14, padding: "12px 16px", textDecoration: "none",
            transition: "opacity 0.15s",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${theme.accent}14`, border: `1px solid ${theme.accent}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon size={16} color={theme.accent} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: theme.muted, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontSize: 13, color: theme.text, fontWeight: 600 }}>{value}</div>
            </div>
            <ExternalLink size={14} color={theme.muted} style={{ marginLeft: "auto" }} />
          </a>
        ))}
      </div>
    </div>
  );
}

function PanelContent({ panel, theme }: { panel: NavId; theme: ThemeDef }) {
  switch (panel) {
    case "about":      return <AboutPanel theme={theme} />;
    case "skills":     return <SkillsPanel theme={theme} />;
    case "tech":       return <TechPanel theme={theme} />;
    case "experience": return <ExperiencePanel theme={theme} />;
    case "education":  return <EducationPanel theme={theme} />;
    case "certs":      return <CertsPanel theme={theme} />;
    case "resume":     return <ResumePanel theme={theme} />;
    case "contact":    return <ContactPanel theme={theme} />;
    default:           return null;
  }
}

// ─── PROFILE PAGE (estilo página de usuario de Switch) ────────────────────────
// Se abre al hacer clic en el avatar del header. Sidebar a la izquierda con
// secciones, panel de resumen a la derecha (foto grande + nombre en un
// recuadro "editable" + actividad), y el resto de secciones reutiliza los
// paneles que ya existían (Skills, Experience, Education, Certs, Resume,
// Contact) para no duplicar información.

const PROFILE_SECTIONS = [
  { id: "profile",    label: "Profile" },
  { id: "skills",     label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education",  label: "Education" },
  { id: "certs",      label: "Certifications" },
  { id: "resume",     label: "Resume" },
  { id: "contact",    label: "Contact" },
] as const;

type ProfileSectionId = typeof PROFILE_SECTIONS[number]["id"];

function ProfileOverview({ theme }: { theme: ThemeDef }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 28, marginLeft: 160, marginBottom: 44, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Foto grande, como la carátula del perfil de Switch */}
        <div style={{
          width: 220, height: 220, borderRadius: 2, overflow: "hidden", flexShrink: 0,
          background: PROFILE_IMAGE ? "transparent" : `linear-gradient(135deg, ${theme.accent}, #f093fb)`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64,
          boxShadow: theme.shadow,
        }}>
          {PROFILE_IMAGE ? (
            <img src={PROFILE_IMAGE} alt="Fernando Velazquez Flores" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            "👤"
          )}
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          {/* Caja unificada: nombre / estado / rol, con líneas divisoras internas, igual que el de Switch */}
          <div style={{ borderTop: `2px solid ${theme.borderBottom2}` }} />
          <div style={{
            
            border: `0px solid ${theme.accent}`,
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 14,
          }}>
            <div style={{ padding: "14px 18px", fontSize: 22, fontWeight: 450, color: theme.text }}>
              Fernando Velazquez Flores
            </div>
            <div style={{ borderTop: `2px solid ${theme.borderBottom2}` }} />
            <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 8, marginTop: 20, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>Open to work</span>
            </div>
            <div style={{ borderTop: `2px solid ${theme.borderBottom2}` }} />
            <div style={{ padding: "12px 18px" }}>
              <span style={{ color: theme.accent, fontSize: 14, fontWeight: 600 }}>Software developer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad, equivalente al "Play Activity" de Switch */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8,marginTop: 70, marginBottom: 14, marginLeft: 160 }}>
          <div style={{ width: 3, height: 16, background: theme.accent, borderRadius: 2 }} />
          <h3 style={{ fontSize: 15, fontWeight: 800, color: theme.text, margin: 0 }}>Featured Projects</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {PROJECTS.slice(0, 5).map((p) => (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", gap: 14, marginLeft: 160,
              padding: "12px 8px",
              borderBottom: `2px solid ${theme.borderBottom2}`,
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: 2, overflow: "hidden", flexShrink: 0,
                background: `linear-gradient(145deg, ${p.colors[0]}, ${p.colors[2]})`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>
                {p.image ? (
                  <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  p.emoji
                )}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{p.title}</div>
                <div style={{ fontSize: 12, color: theme.muted, fontWeight: 500 }}>{p.role} · {p.year}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ theme, onClose }: { theme: ThemeDef; onClose: () => void }) {
  const [section, setSection] = useState<ProfileSectionId>("profile");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: theme.bg,
        display: "flex", flexDirection: "column",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Barra superior, estilo "stegsaurus's Page" */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "18px 28px", flexShrink: 0,
        width: "calc(100% - 64px)", 
        margin: "0 auto", // <--- No olvides esto para centrarla
        borderBottom: `1px solid ${theme.borderBottom}`,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
          background: PROFILE_IMAGE ? "transparent" : `linear-gradient(135deg, ${theme.accent}, #f093fb)`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>
          {PROFILE_IMAGE ? (
            <img src={PROFILE_IMAGE} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            "👤"
          )}
        </div>
        <span style={{ fontSize: 20, fontWeight: 450, color: theme.text, letterSpacing: -0.3 }}>
          Fernando's Page
        </span>
        <button
          onClick={onClose}
          style={{
            marginLeft: "auto", width: 36, height: 36, borderRadius: "50%",
            background: theme.surfaceAlt, border: `1px solid ${theme.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: theme.muted,
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Cuerpo: sidebar + contenido */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", marginLeft: 60, }}>
        {/* Sidebar */}
        <div style={{
          width: 220, flexShrink: 0,
          borderRight: `1px solid ${theme.border}`,
          padding: "20px 0", overflowY: "auto",
          display: "flex", flexDirection: "column", alignItems: "flex-start", // centra el bloque en la columna
          gap: 20, // más aire entre cada opción
        }}>
          {PROFILE_SECTIONS.map((s) => {
            const active = section === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                style={{
                  display: "block", textAlign: "center",
                  padding: "10px 26px",
                  background: "none", border: "none",
                  borderBottom: active ? `2px solid ${theme.accent}` : "2px solid transparent",
                  color: active ? theme.accent : theme.text,
                  fontSize: 18, fontWeight: active ? 450 : 450,
                  cursor: "pointer",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
          {section === "profile" ? (
            <ProfileOverview theme={theme} />
          ) : (
            <div style={{ maxWidth: 640 }}>
              <PanelContent panel={section as NavId} theme={theme} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── INFO PANEL (BOTTOM SHEET) ────────────────────────────────────────────────

function InfoPanel({
  panel, theme, onClose,
}: {
  panel: NavId | null;
  theme: ThemeDef;
  onClose: () => void;
}) {
  const navItem = NAV_ITEMS.find((n) => n.id === panel);

  return (
    <AnimatePresence>
      {panel && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 90,
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(4px)",
            }}
          />
          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring}
            style={{
              position: "fixed", bottom: 0, left: "50%", zIndex: 100,
              width: "min(560px, 100vw)",
              transform: "translateX(-50%)",
              background: theme.panelBg,
              backdropFilter: "blur(24px)",
              borderRadius: "24px 24px 0 0",
              border: `1px solid ${theme.border}`,
              borderBottom: "none",
              boxShadow: theme.shadow,
              maxHeight: "78vh",
              display: "flex", flexDirection: "column",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {/* Handle + header */}
            <div style={{ padding: "14px 24px 0", flexShrink: 0 }}>
              <div style={{ width: 40, height: 4, background: theme.border, borderRadius: 2, margin: "0 auto 16px" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {navItem && (
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${navItem.color}18`, border: `1px solid ${navItem.color}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <navItem.Icon size={18} color={navItem.color} />
                    </div>
                  )}
                  <span style={{ fontSize: 17, fontWeight: 800, color: theme.text, letterSpacing: -0.4 }}>
                    {navItem?.label}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: theme.border, border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: theme.muted,
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            {/* Scrollable content */}
            <div style={{ overflowY: "auto", padding: "0 24px 32px", flex: 1 }}>
              {panel && <PanelContent panel={panel} theme={theme} />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


// ─── THEME PICKER ─────────────────────────────────────────────────────────────

function ThemePicker({
  current, onSelect, theme,
}: {
  current: ThemeKey;
  onSelect: (k: ThemeKey) => void;
  theme: ThemeDef;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", right: 20, top: "76%", transform: "translateY(-50%)", zIndex: 80 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 10 }}
            transition={springFast}
            style={{
              position: "absolute", right: "calc(100% + 12px)", top: "50%",
              transform: "translateY(-50%)",
              background: theme.panelBg, backdropFilter: "blur(20px)",
              border: `1px solid ${theme.border}`,
              borderRadius: 16, padding: 8,
              boxShadow: theme.shadow,
              display: "flex", flexDirection: "column", gap: 6,
              minWidth: 160,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 800, color: theme.muted, letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 8px 2px" }}>
              Theme
            </div>
            {THEME_ORDER.map((key) => {
              const t = THEMES[key];
              return (
                <button
                  key={key}
                  onClick={() => { onSelect(key); setOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: current === key ? `${theme.accent}12` : "transparent",
                    border: `1px solid ${current === key ? theme.accent + "30" : "transparent"}`,
                    borderRadius: 10, padding: "8px 10px",
                    cursor: "pointer", width: "100%", textAlign: "left",
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: t.swatch,
                    border: "2px solid rgba(128,128,128,0.2)",
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{t.name}</span>
                  {current === key && <Check size={14} color={theme.accent} style={{ marginLeft: "auto" }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: 44, height: 44, borderRadius: "50%",
          background: theme.surface,
          border: `1.5px solid ${theme.border}`,
          boxShadow: theme.shadow,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", outline: "none",
        }}
      >
        <Palette size={18} color={theme.muted} />
      </motion.button>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────

function Header({ theme, onAvatarClick }: { theme: ThemeDef; onAvatarClick?: () => void }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = time.getHours().toString().padStart(2, "0");
  const mm = time.getMinutes().toString().padStart(2, "0");

  return (
    <div style={{
      position: "relative", top: 0, left: 0, right: 0, zIndex: 60,
      height: 68,
      background: theme.headerBg,
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${theme.border}`,
      display: "flex", alignItems: "center",
      padding: "10px 24px 0 24px",
      justifyContent: "space-between",
      fontFamily: "Inter, sans-serif",
    }}>
      {/* Left: Avatar + identity */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          onClick={onAvatarClick}
          role="button"
          aria-label="Abrir perfil"
          style={{
          width: 48, height: 48, borderRadius: "90%",
          background: PROFILE_IMAGE ? "transparent" : `linear-gradient(135deg, ${theme.accent} 0%, #f093fb 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0, overflow: "hidden",
          boxShadow: `0 0 0 2.5px ${theme.surface}, 0 0 0 4px ${theme.accent}40`,
          position: "relative",
          top: 17,      // negativo = sube, positivo = baja
          left: 20,     // negativo = va a la izquierda, positivo = a la derecha
          cursor: "pointer",
        }}>
          {PROFILE_IMAGE ? (
            <img src={PROFILE_IMAGE} alt="Fernando Velazquez Flores" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            "👤"
          )}
        </div>
        <div>
        </div>
      </div>

      {/* Right: status bar — hora + wifi + batería, estilo Switch */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginRight:30, marginTop:30 }}>
        <span style={{ fontSize: 21, fontWeight: 600, color: theme.text, letterSpacing: -0.3 }}>
          {hh}:{mm}
        </span>
        <Wifi size={24} color={theme.text}/>
        <BatteryFull size={33} color={theme.text} />
        
      </div>
    </div>
  );
}




// ─── SWITCH-STYLE MARQUEE TITLE ────────────────────────────────────────────────

function SwitchTitle({ title, theme }: { title: string; theme: ThemeDef }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [metrics, setMetrics] = useState({ textWidth: 0, gap: 40 });
  const controls = useAnimation();

  useEffect(() => {
    controls.stop();
    controls.set({ x: 0 });
    setIsOverflowing(false);

    let isMounted = true;
    let startTimer: ReturnType<typeof setTimeout> | null = null;

    // Aumentamos a 250ms para que la fuente cargue y la animación spring del cartucho se estabilice
    const measureTimer = setTimeout(() => {
      if (!isMounted || !containerRef.current || !textRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const textWidth = textRef.current.offsetWidth;

      // Evitamos el falso positivo en la primera carga de la página
      if (containerWidth === 0) return;

      // La regla de oro de Nintendo Switch: Solo gira si NO cabe en la pantalla
      if (textWidth > containerWidth) {
        setMetrics({ textWidth, gap: 40 });

        startTimer = setTimeout(() => {
          if (isMounted) setIsOverflowing(true);
        }, 300);
      }
    }, 600);

    return () => {
      isMounted = false;
      clearTimeout(measureTimer);
      if (startTimer) clearTimeout(startTimer);
    };
  }, [title, controls]);

  useEffect(() => {
    if (!isOverflowing) return;

    let isMounted = true;
    const distance = metrics.textWidth + metrics.gap;
    const duration = distance / 30;

    const runMarquee = async () => {
      while (isMounted) {
        await controls.start({
          x: -distance,
          transition: { duration, ease: "linear" }
        });

        if (!isMounted) break;
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!isMounted) break;
        controls.set({ x: 0 });

        await new Promise(resolve => setTimeout(resolve, 800));
      }
    };

    runMarquee();

    return () => {
      isMounted = false;
      controls.stop();
    };
  }, [isOverflowing, metrics, controls]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        display: "flex",
        justifyContent: isOverflowing ? "flex-start" : "center",
        fontFamily: '"Inter", "-apple-system", sans-serif',
        fontSize: 15,
        fontWeight: 800,
        letterSpacing: 0.2,
        color: theme.text,
      }}
    >
      <motion.div
        animate={controls}
        style={{
          display: "flex",
          justifyContent: isOverflowing ? "flex-start" : "center",
          width: isOverflowing ? "max-content" : "100%",
          gap: `${metrics.gap}px`
        }}
      >
        <span ref={textRef} style={{ display: "inline-block" }}>{title}</span>
        {isOverflowing && <span style={{ display: "inline-block" }}>{title}</span>}
      </motion.div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>("light");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [activePanel, setActivePanel] = useState<NavId | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[themeKey];

  // Refs to each cartridge card, used to read the selected card's exact
  // on-screen position/width so the title can be glued precisely above it.
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [titleRect, setTitleRect] = useState({ left: 0, width: 0 });
  const carouselWrapperRef = useRef<HTMLDivElement>(null); // Añade esta línea

  // FIX BUG NAVEGACIÓN: bandera para distinguir un scroll disparado por
  // nosotros mismos (teclado, flechas, clic en la carta) de un scroll
  // manual del usuario (arrastre con mouse/trackpad). Sin esto, el
  // resync de "carta más cercana al centro" (más abajo, en
  // handleRowScroll) peleaba contra la navegación programática y te
  // regresaba siempre a la misma carta sin dejarte retroceder.
  const isProgrammaticScroll = useRef(false);

  const updateTitleRect = useCallback(() => {
  const wrapper = carouselWrapperRef.current; // Usamos el wrapper sin padding
  const card = cardRefs.current[selectedIdx];

  if (!wrapper || !card) return;

  const wrapperBox = wrapper.getBoundingClientRect();
  const cardBox = card.getBoundingClientRect();

  // Ahora calculamos la posición relativa al wrapper, no al contenedor con padding
  setTitleRect({
    left: cardBox.left - wrapperBox.left,
    width: cardBox.width
  });
}, [selectedIdx]);

  useLayoutEffect(() => {
    updateTitleRect();
  }, [selectedIdx, updateTitleRect]);

  useEffect(() => {
    window.addEventListener("resize", updateTitleRect);
    return () => window.removeEventListener("resize", updateTitleRect);
  }, [updateTitleRect]);

  // Marquee only starts once the carousel has actually stopped moving,
  // plus a short pause — matches the Switch HOME menu behavior.
  const marqueeIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [marqueeActive, setMarqueeActive] = useState(false);

  const armMarqueeTimer = useCallback(() => {
    if (marqueeIdleTimer.current) clearTimeout(marqueeIdleTimer.current);
    marqueeIdleTimer.current = setTimeout(() => setMarqueeActive(true), 300);
  }, []);

  // Finds whichever card is currently closest to the row's center —
  // used both to keep the title glued while dragging and to resync
  // selectedIdx after a manual (trackpad/touch) scroll.
  const getNearestIndex = useCallback(() => {
    const wrapper = carouselWrapperRef.current;
    if (!wrapper) return selectedIdx;
    const wrapperBox = wrapper.getBoundingClientRect();
    const center = wrapperBox.left + wrapperBox.width / 2;
    let nearest = selectedIdx;
    let minDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cardBox = card.getBoundingClientRect();
      const cardCenter = cardBox.left + cardBox.width / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < minDist) { minDist = dist; nearest = i; }
    });
    return nearest;
  }, [selectedIdx]);

  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRowScroll = useCallback(() => {
    // Follow whatever is nearest to center in real time, even mid-drag,
    // so the title never lags behind a manual trackpad/touch scroll.
    const wrapper = carouselWrapperRef.current;
    const nearest = getNearestIndex();
    const card = cardRefs.current[nearest];
    if (wrapper && card) {
      const wrapperBox = wrapper.getBoundingClientRect();
      const cardBox = card.getBoundingClientRect();
      setTitleRect({ left: cardBox.left - wrapperBox.left, width: cardBox.width });
    }
    setMarqueeActive(false);
    armMarqueeTimer();

    // Once scrolling actually stops, sync selectedIdx to whatever ended
    // up centered — this is what keeps clicks/keyboard/glow all in sync
    // after a free trackpad swipe.
    if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(() => {
      // FIX BUG NAVEGACIÓN: si este scroll lo disparamos nosotros
      // (navegación por teclado/flechas/clic), NO reescribimos
      // selectedIdx — así dejamos de pelearnos con tu propia navegación
      // y ya puedes regresar a cartas anteriores sin que te empuje
      // de vuelta hacia adelante.
      if (isProgrammaticScroll.current) return;
      const settled = getNearestIndex();
      setSelectedIdx((cur) => (cur === settled ? cur : settled));
    }, 120);
  }, [getNearestIndex, armMarqueeTimer]);

  // Scroll selected card into view
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const card = el.children[selectedIdx] as HTMLElement | undefined;
    if (!card) return;
    const containerW = el.offsetWidth;
    const cardW = card.offsetWidth;
    const target = card.offsetLeft - (containerW - cardW) / 2;

    // FIX BUG NAVEGACIÓN: marcamos que el scroll que viene es programático
    // (causado por este mismo efecto, no por el usuario arrastrando),
    // y lo desmarcamos un poco después de que el scroll "smooth" debería
    // haber terminado.
    isProgrammaticScroll.current = true;
    el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    const clearFlag = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 500);

    return () => clearTimeout(clearFlag);
  }, [selectedIdx]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (openProject || activePanel) return;
      if (e.key === "ArrowLeft") setSelectedIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setSelectedIdx((i) => Math.min(PROJECTS.length - 1, i + 1));
      if (e.key === "Enter") handleLaunch(PROJECTS[selectedIdx]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openProject, activePanel, selectedIdx]);

  const handleLaunch = useCallback((project: Project) => {
    if (launching) return;
    setLaunching(true);
    setTimeout(() => {
      setOpenProject(project);
      setLaunching(false);
    }, 180);
  }, [launching]);

  const handleThemeChange = (key: ThemeKey) => {
    setTransitioning(true);
    setThemeKey(key);
    setTimeout(() => setTransitioning(false), 500);
  };

  const handlePanelToggle = (id: NavId) => {
    setActivePanel((cur) => (cur === id ? null : id));
  };

  const selected = PROJECTS[selectedIdx];

    return (
      <div
      className={transitioning ? "theme-transitioning" : ""}
      style={{
        height: "100vh", // Forzamos altura de pantalla completa
        width: "100vw",
        background: theme.bg,
        fontFamily: "Inter, sans-serif",
        overflow: "hidden", // Quitamos el scroll de la página
        display: "flex",
        flexDirection: "column", // Layout vertical estricto
        position: "relative",
      }}
      >
        {/* Header */}
        <Header theme={theme} onAvatarClick={() => setProfileOpen(true)} />

        {/* 2. Área Central (Proyectos) - Ocupa todo el espacio disponible.
            Ahora anclado hacia abajo (flex-end) para que los cartuchos
            queden más cerca de los íconos circulares, como en el menú
            Home de Switch. */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // "center" reparte el espacio arriba/abajo — ya no pega todo al fondo
        alignItems: "center",
        overflow: "hidden",
        paddingTop: 80, // compensa el header fijo
      }}>

          {/* Switch-style title — a fixed-height slot in normal flow, so it
              never disturbs the arrow buttons' vertical centering below. */}
          <div style={{ position: "relative", width: "100%", height: 24, marginBottom: 6, pointerEvents: "none" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: titleRect.left,
                width: titleRect.width,
                height: "100%",
                overflow: "hidden",
                transition: "left 0.08s ease-out, width 0.08s ease-out",
              }}
            >
              {/* El atributo key obliga a React a desmontar y remontar el componente de forma limpia */}
              <SwitchTitle key={selected.id} title={selected.title} theme={theme} />
            </div>
          </div>

          {/* Cartridge Row */}
          <div style={{ width: "100%", position: "relative" }} ref={carouselWrapperRef}>

            {/* Left arrow */}
            {selectedIdx > 0 && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedIdx((i) => Math.max(0, i - 1))}
                style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  zIndex: 10, width: 40, height: 40, borderRadius: "50%",
                  background: theme.surface, border: `1px solid ${theme.border}`,
                  boxShadow: theme.shadow,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", outline: "none",
                }}
              >
                <ChevronLeft size={20} color={theme.text} />
              </motion.button>
            )}

            {/* Scrollable cards — padding vertical reducido para acercar los
                cartuchos a la barra inferior */}
            <div
              ref={rowRef}
              onScroll={handleRowScroll}
              style={{
                display: "flex",
                gap: 12,
                padding: "36px 80px 8px 120px", // antes: "60px 80px"
                overflowX: "auto",
                scrollSnapType: "x mandatory",
              }}
            >
                {PROJECTS.map((project, i) => {
                  const isSelected = i === selectedIdx;
                  return (
                    <motion.div
                      key={project.id}
                      ref={(el) => { cardRefs.current[i] = el; }}

                      // 1. AGREGA ESTO: Esto garantiza que se recalcule el título
                      // JUSTO cuando la animación de escala termina.
                      onAnimationComplete={() => {
                        if (isSelected) updateTitleRect();
                      }}

                      onClick={() => {
                        if (isSelected) {
                          handleLaunch(project);
                        } else {
                          setSelectedIdx(i);
                        }
                      }}
                      animate={{
                        scale: isSelected ? 1.15 : 1,
                        y: isSelected ? -10 : 0,
                        opacity: isSelected ? 1 : 0.72,
                      }}
                      whileHover={!isSelected ? { scale: 0.99, opacity: 0.88 } : {}}
                      whileTap={{ scale: isSelected ? 1.12 : 0.93 }}
                      transition={spring}

                      style={{
                          width: "255px",
                          aspectRatio: "1/1",
                          flexShrink: 0,
                          borderRadius: 2,
                          overflow: "hidden",
                          position: "relative",
                          zIndex: isSelected ? 10 : 1,
                          boxShadow: isSelected ? theme.selectedGlow : theme.shadow,
                        }}
                      >
                      <CartridgeCover project={project} />
                      {/* Launch hint on selected */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
                            padding: "20px 12px 10px",
                            display: "flex", justifyContent: "center",
                          }}
                        >

                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Right arrow */}
              {selectedIdx < PROJECTS.length - 1 && (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => setSelectedIdx((i) => Math.min(PROJECTS.length - 1, i + 1))}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    zIndex: 10, width: 40, height: 40, borderRadius: "50%",
                    background: theme.surface, border: `1px solid ${theme.border}`,
                    boxShadow: theme.shadow,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", outline: "none",
                  }}
                >
                  <ChevronRight size={20} color={theme.text} />
                </motion.button>
              )}
            </div>
          </div>



      {/* 3. Footer Navigation (Siempre abajo) */}
    <div style={{ paddingBottom: 28 }}>
      <BottomNav theme={theme} activePanel={activePanel} onSelect={handlePanelToggle} />
    </div>

      {/* Theme Picker */}
      <ThemePicker current={themeKey} onSelect={handleThemeChange} theme={theme} />

      {/* Info Panel */}
      <InfoPanel panel={activePanel} theme={theme} onClose={() => setActivePanel(null)} />

      {/* Project Page */}
      <AnimatePresence>
        {openProject && (
          <ProjectPage
            key={openProject.id}
            project={openProject}
            theme={theme}
            onClose={() => setOpenProject(null)}
          />
        )}
      </AnimatePresence>

      {/* Profile Page (abre al hacer clic en el avatar del header) */}
      <AnimatePresence>
        {profileOpen && (
          <ProfilePage theme={theme} onClose={() => setProfileOpen(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}

// ─── BOTTOM NAVIGATION (Única y Unificada, estilo Switch) ────────────────────
// Estructura tipo Home de Switch:
//  1) Fila de íconos circulares (pegada a los cartuchos)
//  2) Línea divisora delgada de borde a borde
//  3) Barra inferior sin fondo: ícono de control a la izquierda,
//     "− Options" y "A Start" a la derecha (círculos con solo borde,
//     sin relleno, sin texto sobre pastillas — igual que la referencia).
function BottomNav({ theme, activePanel, onSelect }: {
  theme: ThemeDef;
  activePanel: NavId | null;
  onSelect: (id: NavId) => void
}) {
  return (
    <div style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 5px",
    }}>

      {/* NIVEL 1: Iconos circulares, ahora más grandes */}
      <div style={{ display: "flex", gap: 16, marginBottom: 60 }}>
        {NAV_ITEMS.map((item) => (  
          <button
            key={item.id}
            onClick={() => onSelect(item.id as NavId)}
            style={{
              width: 67, height: 67, borderRadius: "50%",
              // Nota: Si quieres que el círculo se quede blanco siempre, cambia `theme.accent` por `theme.surface` aquí abajo
              background: activePanel === item.id ? theme.accent : theme.surface,
              border: activePanel === item.id ? `2px solid ${item.color}` : `1px solid ${theme.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", 
              color: activePanel === item.id ? theme.accentText : theme.text,
              transition: "all 0.2s",
            }}
          >
            {/* Usamos directamente item.Icon y le pasamos el color */}
            <item.Icon size={26} color={item.color} />
          </button>
        ))}
      </div>

      {/* NIVEL 2: Barra inferior estilo Switch — línea divisora + ícono de
          control (izquierda) + "− Options" / "A Start" (derecha), sin
          fondo de pastilla, calcado del HOME menu. Sección más alta:
          más padding vertical y textos/círculos más grandes. */}
        <div style={{ 
          flexShrink: 0, 
          width: "calc(100% - 64px)", 
          margin: "0 auto", // <--- No olvides esto para centrarla
          borderTop: `2px solid ${theme.borderBottom}`, // <--- ¡Sin espacio en el 2px!
          paddingTop: 20, 
          paddingBottom: 0 
        }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 32px",
        }}>
          {/* Ícono de control, esquina inferior izquierda como en Switch */}
          <Gamepad2 size={35} color={theme.muted} />

          {/* Acciones a la derecha */}
          <div style={{ display: "flex", alignItems: "center", gap: 34, marginRight:40 }}>
            <button
              onClick={() => onSelect("settings")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10,
                color: theme.text, fontSize: 16, fontWeight: 600,
              }}
            >
              <span style={{
                width: 24, height: 24, borderRadius: "50%",
                border: `1.5px solid ${theme.muted}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, lineHeight: 1, color: theme.muted,
              }}>−</span>
              Options
            </button>

            <button
              onClick={() => onSelect("profile")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10,
                color: theme.text, fontSize: 16, fontWeight: 600,
              }}
            >
              <span style={{
                width: 24, height: 24, borderRadius: "50%",
                border: `1.5px solid ${theme.muted}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, lineHeight: 1, color: theme.muted,
              }}>A</span>
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}