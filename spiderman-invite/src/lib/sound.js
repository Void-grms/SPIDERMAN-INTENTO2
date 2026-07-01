// Gestor de sonido mínimo, sin archivos: SFX sintetizados con WebAudio.
// Off por defecto; el estado persiste en localStorage. Respeta el toggle.
const KEY = "sm-sound-on";
let ctx = null;
let enabled =
  typeof localStorage !== "undefined" && localStorage.getItem(KEY) === "1";

const listeners = new Set();
let userToggled = false;

export const isSoundOn = () => enabled;
export const hasUserToggledSound = () => userToggled;

export function onSoundChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function setEnabled(next) {
  if (enabled === next) return enabled;
  enabled = next;
  try {
    localStorage.setItem(KEY, enabled ? "1" : "0");
  } catch {
    /* almacenamiento no disponible */
  }
  if (enabled) ensureCtx();
  listeners.forEach((fn) => fn(enabled));
  return enabled;
}

// Toggle manual (botón de volumen). Marca que el usuario ajustó el sonido.
export function toggleSound() {
  userToggled = true;
  return setEnabled(!enabled);
}

// Fuerza un estado (p. ej. al darle play al video). No cuenta como ajuste manual.
export function setSoundOn(on) {
  return setEnabled(on);
}

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx && ctx.state === "suspended") ctx.resume();
  return ctx;
}

function blip({ freq = 440, dur = 0.08, type = "sine", gain = 0.06, slide = 0 }) {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (slide) osc.frequency.exponentialRampToValueAtTime(freq + slide, c.currentTime + dur);
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + dur);
}

export const sfx = {
  click: () => blip({ freq: 320, dur: 0.06, type: "triangle", gain: 0.05 }),
  hover: () => blip({ freq: 660, dur: 0.04, type: "sine", gain: 0.025 }),
  // "thwip" del web-shot: barrido rápido descendente
  webShot: () => {
    blip({ freq: 900, dur: 0.18, type: "sawtooth", gain: 0.05, slide: -600 });
    setTimeout(() => blip({ freq: 1200, dur: 0.12, type: "sine", gain: 0.03, slide: -800 }), 30);
  },
};
