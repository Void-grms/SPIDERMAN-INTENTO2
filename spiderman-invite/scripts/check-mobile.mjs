import { chromium, devices } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL = process.argv[2] || "http://localhost:5174/";
const OUT = path.resolve(__dirname, "..", ".shots");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 13"] });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(4200);
await page.screenshot({ path: path.join(OUT, "m1-hero.png") });

// RSVP: scroll y click en "Sí, voy" para ver confeti + confirmación
await page.locator("#rsvp").scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
// evitar que abra WhatsApp en una nueva pestaña real
await page.addInitScript(() => (window.open = () => null));
await page.getByText("Sí, voy").first().click({ force: true }).catch(() => {});
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(OUT, "m2-confetti.png") });
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(OUT, "m3-confirmed.png") });

await browser.close();
console.log(errors.length ? errors.join("\n") : "Mobile OK ✔");
