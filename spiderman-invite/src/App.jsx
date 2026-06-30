import { useEffect, useState } from "react";
import { ScrollTrigger } from "./lib/gsap";
import { useLenis } from "./hooks/useLenis";

import Preloader from "./components/Preloader";
import Hero from "./components/Hero";
import Reconnect from "./components/Reconnect";
import VideoSection from "./components/VideoSection";
import Invitation from "./components/Invitation";
import Rsvp from "./components/Rsvp";
import Closing from "./components/Closing";

import Cursor from "./components/ui/Cursor";
import SoundToggle from "./components/ui/SoundToggle";
import ScrollThread from "./components/ui/ScrollThread";

export default function App() {
  const [loading, setLoading] = useState(true);
  useLenis();

  // Bloquea el scroll mientras el preloader está activo.
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    if (!loading) {
      // recalcula posiciones tras revelar el contenido
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [loading]);

  return (
    <>
      {loading && <Preloader onDone={() => setLoading(false)} />}

      {/* Capa global */}
      <Cursor />
      <SoundToggle />
      <ScrollThread />
      <div className="grain-overlay" />

      <main>
        <Hero />
        <Reconnect />
        <VideoSection />
        <Invitation />
        <Rsvp />
        <Closing />
      </main>
    </>
  );
}
