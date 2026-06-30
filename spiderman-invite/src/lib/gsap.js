// Registro central de GSAP + plugins (todos gratis desde GSAP 3.13).
// Importa SIEMPRE gsap desde aquí para garantizar el registro único.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(
  ScrollTrigger,
  DrawSVGPlugin,
  MorphSVGPlugin,
  MotionPathPlugin,
  Physics2DPlugin,
  SplitText
);

export {
  gsap,
  ScrollTrigger,
  DrawSVGPlugin,
  MorphSVGPlugin,
  MotionPathPlugin,
  Physics2DPlugin,
  SplitText,
  useGSAP,
};
