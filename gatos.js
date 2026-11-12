/* Os gatos da Caixa Química, no mesmo desenho dos aplicativos (SVG, sem imagem para baixar).

   Schrödinger é o gato arlequim (branco, preto e laranja: as cores dos outros três) que cuida das
   três caixas; o Bohr (preto) mora na Atomic Box, o
   Avogato (laranja) no Molbox e o Kekulé (branco) na Organic Box. Nesta página eles ficam
   escondidos: só as orelhas aparecem na beira de um cartão. Um toque e o gato sobe com uma frase
   para animar o estudo (cada toque, a próxima). A seta do balão, um toque fora ou Esc o escondem.

   Sem JavaScript a página continua inteira: as imagens de marca/ já mostram os gatos parados. */

const SVG = "http://www.w3.org/2000/svg";
function s(tag, atributos, filhos) {
  const el = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(atributos || {})) el.setAttribute(k, String(v));
  for (const f of filhos || []) el.append(f);
  return el;
}
function criar(tag, props, filhos) {
  const el = Object.assign(document.createElement(tag), props || {});
  for (const f of filhos || []) el.append(f);
  return el;
}
const texto = (t) => document.createTextNode(t);

const PELAGENS = {
  // Arlequim: o branco do Kekulé com manchas no preto do Bohr e no laranja do Avogato.
  schrodinger: { pelo: "#F5F1E8", luz: "#FFFFFF", contorno: "#6F685C", orelha: "#F29BA7", iris: "#D9A21B", coleira: "#E3262E", bigode: "#8C8577",
    manchas: true, preto: "#22232A", laranja: "#EE8A3C" },
  bohr: { pelo: "#22232A", luz: "#383A44", contorno: "#9AA0AA", orelha: "#8A4A56", iris: "#F6C945", coleira: "#E3262E", bigode: "#C9CDD4" },
  avogato: { pelo: "#EE8A3C", luz: "#F9B981", contorno: "#A8500F", orelha: "#F7C3A0", iris: "#3E8E5A", coleira: "#164194", bigode: "#FFF3E6" },
  kekule: { pelo: "#F5F1E8", luz: "#FFFFFF", contorno: "#A79F8F", orelha: "#F29BA7", iris: "#2E8B57", coleira: "#1B5E3A", bigode: "#8C8577" },
};
const TRACO = 1.5;

/* ---------- as peças do gato (quadro 120×120, chão em y = 114) ---------- */

function rabo(c) {
  const d = "M80 106 C106 108 112 86 101 74 C96 68 100 60 107 60";
  return s("g", { class: "gato-rabo" }, [
    s("path", { d, fill: "none", stroke: c.contorno, "stroke-width": 10.5, "stroke-linecap": "round" }),
    s("path", { d, fill: "none", stroke: c.manchas ? c.laranja : c.pelo, "stroke-width": 7.5, "stroke-linecap": "round" }),
    ...(c.manchas ? [s("path", { d: "M101 74 C96 68 100 60 107 60", fill: "none", stroke: c.preto, "stroke-width": 7.5, "stroke-linecap": "round" })] : []),
  ]);
}

/* As manchas do arlequim, recortadas pela forma (cabeça ou tronco) em que ficam. */
let recortes = 0;
function manchas(forma, desenhos) {
  const id = `cq-recorte-${++recortes}`;
  return [
    s("clipPath", { id }, [s("path", { d: forma })]),
    s("g", { "clip-path": `url(#${id})` }, desenhos),
  ];
}

function pata(c, cx, cy = 110) {
  return s("g", {}, [
    s("ellipse", { cx, cy, rx: 8.5, ry: 5.5, fill: c.pelo, stroke: c.contorno, "stroke-width": TRACO }),
    s("path", { d: `M${cx - 2.6} ${cy - 1} v4 M${cx + 2.6} ${cy - 1} v4`, stroke: c.contorno, "stroke-width": 1, "stroke-linecap": "round" }),
  ]);
}

function olhos(c, tipo, olhar = [0, 0]) {
  const linha = { fill: "none", stroke: c.iris, "stroke-width": 2.4, "stroke-linecap": "round", "stroke-linejoin": "round" };
  if (tipo === "felizes") return [s("path", { d: "M42 51 Q48 43 54 51", ...linha }), s("path", { d: "M66 51 Q72 43 78 51", ...linha })];
  const [dx, dy] = olhar;
  const olho = (cx) => s("g", {}, [
    s("ellipse", { cx, cy: 50, rx: 7, ry: 8, fill: c.iris, stroke: "#0E0F12", "stroke-width": 1 }),
    s("ellipse", { cx: cx + dx, cy: 50.5 + dy, rx: 3, ry: 6, fill: "#0E0F12" }),
    s("circle", { cx: cx + dx - 1.8, cy: 47 + dy, r: 1.7, fill: "#FFFFFF" }),
  ]);
  return [s("g", { class: "gato-olhos" }, [olho(48), olho(72)])];
}

const CABECA = "M34 50 C34 34 46 26 60 26 C74 26 86 34 86 50 C86 54 85 57 83 60 L88 63 L81 64 C76 70 68 72 60 72 C52 72 44 70 39 64 L32 63 L37 60 C35 57 34 54 34 50 Z";
const TRONCO = "M40 113 C32 96 40 72 60 70 C80 72 88 96 80 113 Z";

function cabeca(c, { tipoOlhos = "abertos", olhar } = {}) {
  const pelo = { fill: c.pelo, stroke: c.contorno, "stroke-width": TRACO, "stroke-linejoin": "round" };
  return [
    s("path", { d: "M37 40 L34 12 Q35 9 38 11 L57 28 Z", ...pelo, ...(c.manchas ? { fill: c.preto } : {}) }),
    s("path", { d: "M83 40 L86 12 Q85 9 82 11 L63 28 Z", ...pelo, ...(c.manchas ? { fill: c.laranja } : {}) }),
    s("path", { d: "M40 34 L38.5 17 L51 28 Z", fill: c.orelha }),
    s("path", { d: "M80 34 L81.5 17 L69 28 Z", fill: c.orelha }),
    s("path", { d: CABECA, ...pelo }),
    ...(c.manchas ? [...manchas(CABECA, [
      s("path", { d: "M28 20 H57 Q63 38 54 49 Q44 60 28 54 Z", fill: c.preto }),
      s("path", { d: "M65 20 H92 V46 Q80 50 72 42 Q65 33 65 20 Z", fill: c.laranja }),
    ]), s("path", { d: CABECA, fill: "none", stroke: c.contorno, "stroke-width": TRACO, "stroke-linejoin": "round" })] : []),
    s("path", { d: "M46 31 Q60 26 74 31", fill: "none", stroke: c.luz, "stroke-width": 3, "stroke-linecap": "round", opacity: 0.7 }),
    ...olhos(c, tipoOlhos, olhar),
    s("path", { d: "M57.4 57 h5.2 q1 0 .3 1 l-2.2 2.6 q-.7 .8 -1.4 0 l-2.2 -2.6 q-.7 -1 .3 -1 z", fill: "#E3262E" }),
    s("path", { d: "M60 61 Q57 66 52.5 63.5 M60 61 Q63 66 67.5 63.5", fill: "none", stroke: c.bigode, "stroke-width": 1.3, "stroke-linecap": "round" }),
    s("path", { d: "M41 58 L24 55 M41 61 L25 63 M79 58 L96 55 M79 61 L95 63", stroke: c.bigode, "stroke-width": 1, "stroke-linecap": "round", opacity: 0.9 }),
  ];
}

function sentado(c, rosto = {}) {
  const pelo = { fill: c.pelo, stroke: c.contorno, "stroke-width": TRACO, "stroke-linejoin": "round" };
  return [
    rabo(c),
    s("path", { d: TRONCO, ...pelo }),
    ...(c.manchas ? [...manchas(TRONCO, [
      s("path", { d: "M30 82 Q50 84 52 99 Q50 112 30 116 Z", fill: c.laranja }),
      s("path", { d: "M92 74 Q70 78 71 91 Q75 101 92 99 Z", fill: c.preto }),
    ]), s("path", { d: TRONCO, fill: "none", stroke: c.contorno, "stroke-width": TRACO, "stroke-linejoin": "round" })] : []),
    s("ellipse", { cx: 60, cy: 92, rx: 9, ry: 13, fill: c.luz, opacity: 0.55 }),
    pata(c, 51), pata(c, 69),
    s("path", { d: "M44 70.5 Q60 78 76 70.5", fill: "none", stroke: c.coleira, "stroke-width": 4.2, "stroke-linecap": "round" }),
    s("circle", { cx: 60, cy: 78.5, r: 3.4, fill: "#F2C230", stroke: "#8A6A10", "stroke-width": 0.9 }),
    s("g", { class: "gato-cabeca" }, cabeca(c, rosto)),
  ];
}

/* ---------- as caixas: cada gato espia de dentro da sua ---------- */

const FRENTES = {
  // Caixa Química: as três caixas lado a lado, na ordem da escada.
  quimica: () => [
    s("rect", { x: 14, y: 70, width: 92, height: 46, rx: 8, fill: "#1B1C1F", stroke: "#9AA0AA", "stroke-width": 2 }),
    s("rect", { x: 20, y: 78, width: 25, height: 32, rx: 4, fill: "#33363C" }),
    s("rect", { x: 47.5, y: 78, width: 25, height: 32, rx: 4, fill: "#164194" }),
    s("rect", { x: 75, y: 78, width: 25, height: 32, rx: 4, fill: "#1B5E3A" }),
    s("circle", { cx: 32.5, cy: 94, r: 4.2, fill: "#E3262E" }),
    s("circle", { cx: 60, cy: 94, r: 4.2, fill: "#FFFFFF" }),
    s("path", { d: "M87.5 87 L93.6 90.5 V97.5 L87.5 101 L81.4 97.5 V90.5 Z", fill: "none", stroke: "#FFFFFF", "stroke-width": 2, "stroke-linejoin": "round" }),
  ],
  // Atomic Box: metal escuro com o átomo.
  atomic: () => [
    s("defs", {}, [s("linearGradient", { id: "cq-metal", x1: "0", y1: "0", x2: "1", y2: "1" }, [
      s("stop", { offset: "0", "stop-color": "#5A5D66" }), s("stop", { offset: "0.5", "stop-color": "#17181C" }), s("stop", { offset: "1", "stop-color": "#3A3C44" })])]),
    s("rect", { x: 14, y: 70, width: 92, height: 46, rx: 8, fill: "url(#cq-metal)", stroke: "#B9BEC8", "stroke-width": 2 }),
    s("path", { d: "M14 79 H106", stroke: "#FFFFFF", "stroke-opacity": 0.2, "stroke-width": 1.5 }),
    s("g", { fill: "none", stroke: "#FFFFFF", "stroke-width": 1.6 }, [0, 60, -60].map((r) => s("ellipse", { cx: 60, cy: 97, rx: 15, ry: 6, transform: `rotate(${r} 60 97)` }))),
    s("circle", { cx: 60, cy: 97, r: 3.8, fill: "#E3262E" }),
  ],
  // Molbox: a caixa azul com o "mol".
  molbox: () => [
    s("rect", { x: 14, y: 70, width: 92, height: 46, rx: 8, fill: "#0F2F6E", stroke: "#FFFFFF", "stroke-width": 2 }),
    s("path", { d: "M14 79 H106", stroke: "#FFFFFF", "stroke-opacity": 0.25, "stroke-width": 1.5 }),
    s("text", { x: 60, y: 106, "text-anchor": "middle", fill: "#FFFFFF", "font-size": 22, "font-weight": 700, "font-style": "italic", "font-family": "'Exo 2', Inter, Arial, sans-serif" }, [texto("mol")]),
    s("circle", { cx: 92, cy: 88, r: 3.4, fill: "#E84910" }),
  ],
  // Organic Box: a caixa verde com o anel do benzeno.
  organic: () => [
    s("rect", { x: 14, y: 70, width: 92, height: 46, rx: 8, fill: "#123F27", stroke: "#FFFFFF", "stroke-width": 2 }),
    s("path", { d: "M14 79 H106", stroke: "#FFFFFF", "stroke-opacity": 0.25, "stroke-width": 1.5 }),
    s("path", { d: "M60 84 L71.3 90.5 V103.5 L60 110 L48.7 103.5 V90.5 Z", fill: "none", stroke: "#FFFFFF", "stroke-width": 2.2, "stroke-linejoin": "round" }),
    s("circle", { cx: 60, cy: 97, r: 6.4, fill: "none", stroke: "#8FD07A", "stroke-width": 2 }),
  ],
};

function naCaixa(c, frente) {
  return [
    s("g", { transform: "translate(0 4)" }, [s("g", { class: "gato-cabeca" }, cabeca(c, { olhar: [0, 1] }))]),
    ...FRENTES[frente](),
    pata(c, 36, 71), pata(c, 84, 71),
  ];
}

const GATOS = {
  schrodinger: { nome: "Schrödinger", frente: "quimica" },
  bohr: { nome: "Bohr", frente: "atomic" },
  avogato: { nome: "Avogato", frente: "molbox" },
  kekule: { nome: "Kekulé", frente: "organic" },
};

/* `pose`: "caixa" (espiando de dentro da caixa), "sentado" ou "feliz". */
function desenhoDoGato(gato, pose = "sentado", rotulo = "") {
  const c = PELAGENS[gato] || PELAGENS.schrodinger;
  const atributos = { xmlns: SVG, viewBox: "0 0 120 120", class: "gato-desenho" };
  if (rotulo) { atributos.role = "img"; atributos["aria-label"] = rotulo; } else atributos["aria-hidden"] = "true";
  const partes = pose === "caixa" ? naCaixa(c, GATOS[gato].frente) : sentado(c, pose === "feliz" ? { tipoOlhos: "felizes" } : {});
  return s("svg", atributos, partes);
}

/* ---------- as frases ---------- */

const FRASES = {
  schrodinger: [
    "Enquanto a caixa está fechada, você sabe e não sabe a matéria ao mesmo tempo. Abre e descobre!",
    "Psiu: 15 minutos de estudo hoje valem mais que 3 horas na véspera da prova.",
    "A curiosidade não matou o gato. Fez dele um cientista.",
    "Ninguém nasce sabendo Química. Nem eu, e olha que eu moro na caixa.",
    "Não entendeu de primeira? Normal. Entender de segunda também vale.",
  ],
  bohr: [
    "Eu só salto de nível quando ganho energia. Você também: dez minutinhos de treino por dia.",
    "Errou? Ótimo, agora você sabe onde olhar. Tenta de novo!",
    "Todo químico já foi iniciante. O primeiro degrau é aqui.",
    "Um degrau por dia e, quando você vê, já está no topo da escada.",
  ],
  avogato: [
    "Um mol de passos começa com o primeiro.",
    "Conta difícil? Faz um pedaço de cada vez. Eu espero aqui.",
    "Tenho 6,02 × 10²³ motivos para você treinar hoje. Tá bom, um já basta.",
    "Quem treina um pouco todo dia não precisa virar a noite antes da prova.",
  ],
  kekule: [
    "Cadeia comprida se nomeia igual a qualquer outra: um carbono de cada vez.",
    "O carbono faz quatro ligações. Você só precisa de uma: com o estudo de hoje.",
    "Não decora, entende. Aí o nome da molécula sai sozinho.",
    "Contam que o anel do benzeno apareceu num sonho. Descansa bem, e depois treina!",
  ],
};

/* ---------- o gato escondido ---------- */

function gatoEscondido(gato, onde = "direita") {
  const falas = FRASES[gato];
  const nome = GATOS[gato].nome;
  let i = -1;
  let relogio = 0;
  const frase = criar("span", {});
  frase.setAttribute("aria-live", "polite");
  const voltar = criar("button", { type: "button", className: "gato-voltar", textContent: "▼" });
  voltar.setAttribute("aria-label", `Esconder o ${nome} de novo`);
  const balao = criar("div", { className: "balao-gato", hidden: true }, [
    criar("div", {}, [criar("strong", { textContent: `${nome}: ` }), frase]), voltar,
  ]);
  const botao = criar("button", { type: "button", className: "gato-escondido" }, [desenhoDoGato(gato, "sentado")]);
  botao.setAttribute("aria-label", `${nome} está escondido aqui: toque para ouvir o que ele tem a dizer`);
  botao.setAttribute("aria-expanded", "false");
  const caixa = criar("div", { className: `esconderijo ${onde}` }, [balao, botao]);

  function esconder() {
    clearTimeout(relogio);
    botao.classList.remove("aparecendo");
    botao.setAttribute("aria-expanded", "false");
    balao.hidden = true;
    document.removeEventListener("pointerdown", foraDoGato, true);
    document.removeEventListener("keydown", teclaEsc, true);
  }
  function foraDoGato(e) { if (!caixa.contains(e.target)) esconder(); }
  function teclaEsc(e) { if (e.key === "Escape") { esconder(); botao.focus(); } }

  botao.addEventListener("click", () => {
    i = (i + 1) % falas.length;
    botao.classList.add("aparecendo");
    botao.setAttribute("aria-expanded", "true");
    balao.hidden = false;
    frase.textContent = falas[i];
    document.addEventListener("pointerdown", foraDoGato, true);
    document.addEventListener("keydown", teclaEsc, true);
    clearTimeout(relogio);
    relogio = setTimeout(esconder, Math.max(8000, falas[i].length * 90));
  });
  voltar.addEventListener("click", () => { esconder(); botao.focus(); });
  return caixa;
}

/* ---------- liga tudo na página ---------- */

function iniciar() {
  // As imagens paradas viram o desenho vivo (o gato pisca).
  for (const img of document.querySelectorAll("img[data-gato]")) {
    const svg = desenhoDoGato(img.dataset.gato, img.dataset.pose || "caixa", img.alt);
    svg.classList.add(...img.classList);
    img.replaceWith(svg);
  }
  ligarBotaoDoMovimento();
  // Os esconderijos: <div data-esconderijo="bohr" data-onde="direita">.
  for (const lugar of document.querySelectorAll("[data-esconderijo]")) {
    lugar.classList.add("com-gato");
    lugar.append(gatoEscondido(lugar.dataset.esconderijo, lugar.dataset.onde || "direita"));
  }
}

/* As animações vêm ligadas; o botão do rodapé desliga e guarda a escolha neste aparelho. */
const CHAVE_MOVIMENTO = "caixaquimica.movimento";
function movimentoLigado() {
  try { return localStorage.getItem(CHAVE_MOVIMENTO) !== "nao"; } catch (e) { return true; }
}
function ligarBotaoDoMovimento() {
  const botao = document.getElementById("botao-movimento");
  const aplicar = () => {
    document.documentElement.classList.toggle("sem-movimento", !movimentoLigado());
    if (botao) botao.textContent = movimentoLigado() ? "⏸ Parar as animações" : "▶ Ligar as animações";
  };
  aplicar();
  if (!botao) return;
  botao.hidden = false;
  botao.addEventListener("click", () => {
    try { localStorage.setItem(CHAVE_MOVIMENTO, movimentoLigado() ? "nao" : "sim"); } catch (e) { /* vale só agora */ }
    aplicar();
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
}

export { desenhoDoGato, gatoEscondido, FRASES, GATOS };
