// Aislado para poder cargarse con React.lazy (saca el runtime Lottie ~mid del
// bundle crítico). Renderer canvas (dotlottie-web) por defecto.
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LottiePlayer({ src, autoplay, loop = true, speed = 1, className, style }) {
  return (
    <DotLottieReact
      src={src}
      autoplay={autoplay}
      loop={loop}
      speed={speed}
      className={className}
      style={style}
    />
  );
}
