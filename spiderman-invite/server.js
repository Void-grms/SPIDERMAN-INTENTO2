// Servidor estático para producción (Railway/Render/etc).
// Sirve dist/ con fallback SPA, lee PORT y escucha en 0.0.0.0.
import http from "node:http";
import handler from "serve-handler";

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) =>
  handler(req, res, {
    public: "dist",
    cleanUrls: true,
    rewrites: [{ source: "**", destination: "/index.html" }],
  })
);

server.listen(port, "0.0.0.0", () => {
  console.log(`Sirviendo dist/ en http://0.0.0.0:${port}`);
});
