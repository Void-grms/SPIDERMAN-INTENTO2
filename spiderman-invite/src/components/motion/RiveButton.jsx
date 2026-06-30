import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

// Pieza estrella (Capa 3). Botón RSVP como máquina de estados Rive.
// CONTRATO que debe cumplir el archivo /rive/rsvp.riv (ver public/rive/LEEME.txt):
//   · State Machine:  "RSVP"
//   · Inputs:  hover (Boolean) · fire (Trigger) · success (Boolean)
// Se carga sólo cuando el .riv existe (lo decide RsvpButton). Si falla la carga,
// avisa por onError para que el wrapper muestre el botón GSAP de respaldo.
export default function RiveButton({ onConfirm, onError, ariaLabel = "Sí, voy" }) {
  const { rive, RiveComponent } = useRive({
    src: "/rive/rsvp.riv",
    stateMachines: "RSVP",
    autoplay: true,
    onLoadError: () => onError?.(),
  });

  const hover = useStateMachineInput(rive, "RSVP", "hover");
  const fire = useStateMachineInput(rive, "RSVP", "fire");
  const success = useStateMachineInput(rive, "RSVP", "success");

  const handleClick = (e) => {
    if (fire) fire.fire();
    if (success) success.value = true;
    onConfirm?.(e);
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      data-cursor="grow"
      onClick={handleClick}
      onMouseEnter={() => hover && (hover.value = true)}
      onMouseLeave={() => hover && (hover.value = false)}
      className="relative h-[72px] w-[240px] overflow-hidden rounded-full"
    >
      <RiveComponent style={{ width: "100%", height: "100%" }} />
    </button>
  );
}
