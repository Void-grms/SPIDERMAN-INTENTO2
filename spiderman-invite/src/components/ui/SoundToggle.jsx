import { useEffect, useState } from "react";
import { isSoundOn, toggleSound, onSoundChange, sfx } from "../../lib/sound";
import { IconSoundOn, IconSoundOff } from "./Icons";

// Toggle de sonido discreto, off por defecto, operable por teclado.
export default function SoundToggle() {
  const [on, setOn] = useState(isSoundOn());

  useEffect(() => onSoundChange(setOn), []);

  return (
    <button
      onClick={() => {
        const now = toggleSound();
        if (now) sfx.click();
      }}
      aria-pressed={on}
      aria-label={on ? "Silenciar sonido" : "Activar sonido"}
      className="fixed right-4 top-4 z-[70] flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-surface-1/60 text-text-secondary backdrop-blur-md transition-colors duration-300 hover:text-text-primary hover:border-white/25 md:right-6 md:top-6"
    >
      {on ? <IconSoundOn width={20} height={20} /> : <IconSoundOff width={20} height={20} />}
    </button>
  );
}
