// Verificación headless: carga la página, recoge errores de consola y captura
// screenshots del hero y tras hacer scroll. Uso: node scripts/check.mjs <url>
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL = process.argv[2] || "http://localhost:5174/";
const OUT = path.resolve(__dirname, "..", ".shots");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push("console.error: " + m.text());
});
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(4200); // deja pasar el preloader
import("node:fs").then((fs) => fs.mkdirSync(OUT, { recursive: true }));
await page.screenshot({ path: path.join(OUT, "1-hero.png") });

// scroll por las secciones
const sections = ["#reconnect", "#video", "#invitation", "#rsvp", "#closing"];
let n = 2;
for (const s of sections) {
  await page.locator(s).scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(1100);
  await page.screenshot({ path: path.join(OUT, `${n}-${s.slice(1)}.png`) });
  n++;
}

await browser.close();

console.log("\n=== Errores de consola/página ===");
if (errors.length === 0) console.log("Ninguno ✔");
else errors.forEach((e) => console.log(" ✗ " + e));
console.log(`\nScreenshots en ${OUT}`);
