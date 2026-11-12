/* Gera marca/capa.jpg (1200 × 630), a imagem que aparece ao compartilhar o link.
   Uso: sirva a pasta (python3 -m http.server 8300) e rode `node ferramentas/gerar_capa.cjs`.
   Precisa do Playwright instalado. */
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  await pagina.goto((process.argv[2] || "http://127.0.0.1:8300/") + "ferramentas/capa.html");
  await pagina.waitForSelector("body[data-pronto]");
  await pagina.waitForTimeout(300);
  await (await pagina.$("#capa")).screenshot({ path: path.join(__dirname, "..", "marca", "capa.jpg") });
  await navegador.close();
})();
