/* Gera os SVG parados de marca/ (logo, ícone e os gatos nas caixas) a partir do desenho vivo de
   gatos.js, para o logo e a página sem JavaScript ficarem iguais aos gatos animados.
   Uso: sirva a pasta (python3 -m http.server 8300) e rode `node ferramentas/gerar_marca.cjs`.
   Precisa do Playwright instalado. */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ARQUIVOS = [
  ["schrodinger", "caixa", "marca/caixaquimica.svg", "Dinger, o gato da Caixa Química"],
  ["schrodinger", "caixa", "favicon.svg", "Caixa Química"],
  ["schrodinger", "feliz", "marca/gato-schrodinger.svg", "Dinger, o gato arlequim da Caixa Química"],
  ["bohr", "caixa", "marca/gato-atomic.svg", "Bohr, o gato preto da Atomic Box"],
  ["avogato", "caixa", "marca/gato-molbox.svg", "Avogato, o gato laranja do Molbox"],
  ["kekule", "caixa", "marca/gato-organic.svg", "Kekulé, o gato branco da Organic Box"],
];

(async () => {
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage();
  await pagina.goto(process.argv[2] || "http://127.0.0.1:8300/");
  for (const [gato, pose, arquivo, rotulo] of ARQUIVOS) {
    const svg = await pagina.evaluate(async ([g, p, r]) => {
      const { desenhoDoGato } = await import("./gatos.js");
      const el = desenhoDoGato(g, p, r);
      el.removeAttribute("class");
      el.setAttribute("width", "120"); el.setAttribute("height", "120");
      return new XMLSerializer().serializeToString(el);
    }, [gato, pose, rotulo]);
    fs.writeFileSync(path.join(__dirname, "..", arquivo), svg + "\n");
  }
  await navegador.close();
})();
