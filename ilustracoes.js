/* As ilustrações animadas da página inicial (SVG feito aqui mesmo, sem imagem para baixar).

   Cada <div class="ilustracao" data-ilustracao="nome"> recebe o desenho do nome. As partes que se
   mexem levam uma classe ilu-* que o estilo anima; o botão "Parar as animações" do rodapé deixa
   tudo parado (classe sem-movimento, ver gatos.js). Os desenhos são decorativos: o texto do cartão
   diz a mesma coisa, então o leitor de tela pula o SVG.

   Também cuida da entrada suave dos cartões quando eles chegam na tela (classe .revelar). */

const SVG = "http://www.w3.org/2000/svg";
function s(tag, atributos = {}, filhos = []) {
  const el = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, String(v));
  for (const f of filhos) el.append(typeof f === "string" ? document.createTextNode(f) : f);
  return el;
}
const g = (classe, filhos, extra = {}) => s("g", { class: classe, ...extra }, filhos);
// Forma com o contorno escuro do desenho (a cor do contorno vem do estilo).
const c = (tag, a) => s(tag, { "stroke-width": 2.2, ...a, class: `ilu-contorno ${a.class || ""}`.trim() });
// Linha que fica sobre o fundo do cartão (clara no tema escuro, escura no claro).
const linha = (d, extra = {}) => s("path", { d, "stroke-width": 2.4, ...extra, class: `ilu-linha ${extra.class || ""}`.trim() });
// Linha com cor própria.
const traco = (d, cor, largura = 2.4, extra = {}) => s("path", { d, fill: "none", stroke: cor, "stroke-width": largura, "stroke-linecap": "round", "stroke-linejoin": "round", ...extra });

const VERMELHO = "#E3262E", AZUL = "#3D7FC4", AZUL_ESCURO = "#164194", VERDE = "#3FA86B", LARANJA = "#EE8A3C";
const AMARELO = "#F2C230", PRETO = "#22232A", BRANCO = "#F5F1E8", CONTORNO_GATO = "#6F685C", VIDRO = "rgba(170, 210, 255, 0.25)";

/* A cabeça do Dinger (arlequim: branco, uma orelha preta e outra laranja). */
function cabecaDoDinger(cx, cy, r = 14, olhos = "abertos") {
  const partes = [
    g("ilu-orelha", [c("path", { d: `M${cx - r * 0.95} ${cy - r * 0.3} L${cx - r * 1.05} ${cy - r * 1.45} L${cx - r * 0.15} ${cy - r * 0.85} Z`, fill: PRETO })]),
    c("path", { d: `M${cx + r * 0.95} ${cy - r * 0.3} L${cx + r * 1.05} ${cy - r * 1.45} L${cx + r * 0.15} ${cy - r * 0.85} Z`, fill: LARANJA }),
    c("circle", { cx, cy, r, fill: BRANCO }),
    s("path", { d: `M${cx + r * 0.25} ${cy - r * 0.95} Q${cx + r * 0.95} ${cy - r * 0.8} ${cx + r} ${cy - r * 0.1} Q${cx + r * 0.5} ${cy - r * 0.2} ${cx + r * 0.25} ${cy - r * 0.95} Z`, fill: LARANJA, opacity: 0.85 }),
    s("path", { d: `M${cx - 1.6} ${cy + r * 0.28} h3.2 l-1.6 1.9 z`, fill: "#F29BA7" }),
    traco(`M${cx} ${cy + r * 0.42} q-2 2.6 -4.4 1.2 M${cx} ${cy + r * 0.42} q2 2.6 4.4 1.2`, CONTORNO_GATO, 1.3),
  ];
  const ex = r * 0.4;
  if (olhos === "dormindo") partes.push(traco(`M${cx - ex - 3} ${cy - 1} q3 2.4 6 0 M${cx + ex - 3} ${cy - 1} q3 2.4 6 0`, CONTORNO_GATO, 1.6));
  else partes.push(g("ilu-pisca-olho", [
    s("circle", { cx: cx - ex, cy: cy - 1, r: r * 0.23, fill: "#D9A21B" }), s("circle", { cx: cx + ex, cy: cy - 1, r: r * 0.23, fill: "#D9A21B" }),
    s("ellipse", { cx: cx - ex, cy: cy - 1, rx: 1.1, ry: r * 0.17, fill: PRETO }), s("ellipse", { cx: cx + ex, cy: cy - 1, rx: 1.1, ry: r * 0.17, fill: PRETO }),
  ]));
  return partes;
}

function engrenagem(cx, cy, r, cor) {
  const dentes = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => s("rect", { x: cx - 2.6, y: cy - r - 3.4, width: 5.2, height: 6, rx: 1.2, fill: cor, transform: `rotate(${a} ${cx} ${cy})` }));
  return g("ilu-gira", [...dentes, s("circle", { cx, cy, r, fill: cor }), s("circle", { cx, cy, r: r * 0.38, fill: "var(--ilu-placa)" })]);
}

const DESENHOS = {
  /* ---------- como estudar ---------- */

  // O caderno fechado e a ideia acendendo no balão de pensamento.
  lembrar: () => [
    c("rect", { x: 12, y: 40, width: 44, height: 40, rx: 4, fill: AZUL_ESCURO }),
    traco("M20 40 V80", "#0E2A66", 3),
    s("rect", { x: 27, y: 50, width: 22, height: 8, rx: 2, fill: "#FFFFFF", opacity: 0.85 }),
    g("ilu-pop p1", [c("circle", { cx: 61, cy: 38, r: 3, fill: "var(--ilu-balao)" })]),
    g("ilu-pop p2", [c("circle", { cx: 69, cy: 30, r: 4.5, fill: "var(--ilu-balao)" })]),
    g("ilu-pop p3", [
      c("ellipse", { cx: 94, cy: 27, rx: 21, ry: 19, fill: "var(--ilu-balao)" }),
      g("ilu-raios", [traco("M94 11 v3 M83 16 l2.2 2.2 M105 16 l-2.2 2.2 M80 27 h3 M105 27 h3", AMARELO, 2.4)]),
      g("ilu-brilha", [c("circle", { cx: 94, cy: 26, r: 7.5, fill: AMARELO })]),
      c("rect", { x: 90, y: 33, width: 8, height: 6, rx: 1.5, fill: "#9AA0AA" }),
    ]),
  ],

  // Um calendário em que os dias vão ganhando o seu ✓.
  dia: () => {
    const casas = [];
    for (let i = 0; i < 7; i++) {
      const x = 26 + (i % 4) * 18, y = i < 4 ? 38 : 58;
      casas.push(s("rect", { x, y, width: 14, height: 14, rx: 3, fill: "var(--ilu-placa-2)" }));
      casas.push(traco(`M${x + 3} ${y + 7.5} l3 3.4 l5.2 -6.6`, VERDE, 3, { class: "ilu-check", style: `--i:${i}` }));
    }
    return [
      c("rect", { x: 18, y: 14, width: 84, height: 66, rx: 7, fill: "var(--ilu-balao)" }),
      c("path", { d: "M18 29 V21 Q18 14 25 14 H95 Q102 14 102 21 V29 Z", fill: VERMELHO }),
      c("rect", { x: 33, y: 8, width: 5, height: 11, rx: 2.5, fill: "#9AA0AA" }),
      c("rect", { x: 82, y: 8, width: 5, height: 11, rx: 2.5, fill: "#9AA0AA" }),
      ...casas,
    ];
  },

  // Três formas (as cores das três caixas) trocando de lugar sem parar.
  misture: () => [
    ...[30, 60, 90].map((x) => s("rect", { x: x - 14, y: 60, width: 28, height: 6, rx: 3, fill: "var(--ilu-placa-2)" })),
    g("ilu-roda r0", [c("circle", { cx: 30, cy: 47, r: 10, fill: VERMELHO })]),
    g("ilu-roda r1", [c("rect", { x: 20, y: 37, width: 20, height: 20, rx: 3, fill: AZUL })]),
    g("ilu-roda r2", [c("path", { d: "M30 36 L39.5 41.5 V52.5 L30 58 L20.5 52.5 V41.5 Z", fill: VERDE })]),
  ],

  // Explicando para o Dinger, que escuta de orelha em pé.
  explique: () => [
    c("path", { d: "M12 88 Q12 72 30 72 Q48 72 48 88 Z", fill: VERMELHO }),
    c("circle", { cx: 30, cy: 56, r: 14, fill: "#CC9066" }),
    c("path", { d: "M16 54 Q16 40 30 40 Q44 40 44 54 Q38 47 30 48 Q22 47 16 54 Z", fill: "#3B2A22" }),
    s("circle", { cx: 25, cy: 57, r: 1.8, fill: PRETO }), s("circle", { cx: 35, cy: 57, r: 1.8, fill: PRETO }),
    traco("M25 62 Q30 67 35 62", PRETO, 1.8),
    g("ilu-pop p1", [
      c("path", { d: "M46 10 H82 Q90 10 90 18 V27 Q90 35 82 35 H58 L49 43 L52 35 H46 Q38 35 38 27 V18 Q38 10 46 10 Z", fill: "var(--ilu-balao)" }),
      ...[52, 64, 76].map((x, i) => s("circle", { cx: x, cy: 22.5, r: 3, fill: AZUL_ESCURO, class: `ilu-pula d${i}` })),
    ]),
    ...cabecaDoDinger(96, 66, 14),
  ],

  // A trilha com o caminho errado (o X) e o certo (a bandeira); a lupa investiga o erro.
  erro: () => [
    linha("M10 78 C28 78 36 66 52 58", { class: "ilu-trilha" }),
    traco("M52 58 L71 32", VERMELHO, 3, { "stroke-dasharray": "2 6", opacity: 0.7 }),
    traco("M52 58 L98 68", VERDE, 3.4, { class: "ilu-desenha" }),
    traco("M68 22 l10 10 M78 22 l-10 10", VERMELHO, 4),
    c("path", { d: "M100 68 V44 L114 49 L100 54", fill: VERDE }),
    g("ilu-lupa", [
      c("circle", { cx: 73, cy: 27, r: 11, fill: VIDRO, "stroke-width": 3 }),
      traco("M81 35 L90 44", "#8A6A10", 5),
    ]),
  ],

  // Noite: o Dinger dormindo, as estrelas piscando e os zzz subindo.
  sono: () => [
    s("rect", { x: 6, y: 6, width: 108, height: 78, rx: 12, fill: "#1E2140" }),
    s("path", { d: "M94 14 a13 13 0 1 0 12 20 a10.5 10.5 0 1 1 -12 -20 Z", fill: AMARELO }),
    ...[[20, 18], [40, 12], [62, 22], [76, 12], [108, 50]].map(([x, y], i) => s("circle", { cx: x, cy: y, r: 1.6, fill: "#FFFFFF", class: `ilu-estrela d${i % 3}` })),
    c("path", { d: "M30 78 C22 62 44 52 64 54 C86 56 96 66 92 78 Z", fill: BRANCO }),
    s("path", { d: "M62 55 C76 56 86 62 89 70 L72 70 Z", fill: LARANJA, opacity: 0.9 }),
    traco("M92 78 C80 86 50 86 34 80", CONTORNO_GATO, 6),
    traco("M92 78 C80 86 50 86 34 80", BRANCO, 3.6),
    ...cabecaDoDinger(36, 62, 12, "dormindo"),
    ...["z", "z", "Z"].map((z, i) => s("text", { x: 54 + i * 10, y: 46 - i * 8, class: `ilu-zzz d${i}`, fill: "#BFE0FF", "font-size": 10 + i * 2.5, "font-weight": 700, "font-family": "Inter, Arial, sans-serif" }, [z])),
  ],

  /* ---------- a profissão ---------- */

  // A fábrica com a chaminé soltando fumaça e a engrenagem girando.
  industria: () => [
    ...[0, 1, 2].map((i) => s("circle", { cx: 89, cy: 18, r: 5 + i * 1.5, fill: "#C9CDD4", class: `ilu-fumaca d${i}` })),
    c("rect", { x: 84, y: 18, width: 10, height: 34, fill: "#8A8F98" }),
    c("path", { d: "M12 80 V50 L30 40 V50 L48 40 V50 L66 40 V50 H104 V80 Z", fill: "#B9BEC8" }),
    ...[20, 36].map((x) => s("rect", { x, y: 58, width: 10, height: 10, rx: 1.5, fill: "#5BA4F0" })),
    c("rect", { x: 84, y: 62, width: 13, height: 18, fill: "#5B6068" }),
    engrenagem(66, 64, 7, "#5B6068"),
    linha("M4 80 H116"),
  ],

  // Os tubos de ensaio na estante, a gota caindo e as bolhas subindo.
  analises: () => {
    const tubo = (x, cor, nivel, i) => [
      s("path", { d: `M${x - 6} ${nivel} H${x + 6} V70 Q${x + 6} 76.5 ${x} 76.5 Q${x - 6} 76.5 ${x - 6} 70 Z`, fill: cor, opacity: 0.85 }),
      s("circle", { cx: x - 1.5, cy: 70, r: 1.7, fill: "#FFFFFF", class: `ilu-bolha d${i}` }),
      s("circle", { cx: x + 2, cy: 67, r: 1.2, fill: "#FFFFFF", class: `ilu-bolha d${(i + 1) % 3}` }),
      c("path", { d: `M${x - 7} 32 V70 Q${x - 7} 78 ${x} 78 Q${x + 7} 78 ${x + 7} 70 V32`, fill: VIDRO }),
    ];
    return [
      ...tubo(36, VERMELHO, 54, 0), ...tubo(60, AZUL, 46, 1), ...tubo(84, VERDE, 58, 2),
      c("rect", { x: 22, y: 52, width: 76, height: 7, rx: 2, fill: "#C68A4E" }),
      c("path", { d: "M57 4 H63 V18 L61 26 H59 L57 18 Z", fill: VIDRO }),
      g("ilu-gota", [s("path", { d: "M60 27 Q63 32 60 34 Q57 32 60 27 Z", fill: AZUL })]),
    ];
  },

  // A folha, a gota caindo na água e as ondas correndo.
  ambiente: () => [
    c("path", { d: "M18 56 C18 32 40 18 64 16 C64 42 48 58 18 56 Z", fill: VERDE }),
    traco("M20 54 Q40 40 60 20", "#1B5E3A", 2),
    g("ilu-gota-cai", [c("path", { d: "M92 12 Q100 24 92 30 Q84 24 92 12 Z", fill: "#5BA4F0" })]),
    s("ellipse", { cx: 92, cy: 66, rx: 11, ry: 3.4, fill: "none", stroke: "#5BA4F0", "stroke-width": 2, class: "ilu-anel" }),
    g("ilu-ondas", [s("path", { d: "M-20 70 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V92 H-20 Z", fill: AZUL, opacity: 0.8 })]),
  ],

  // A impressão digital e a lupa passando por cima.
  pericia: () => [
    ...[5, 9, 13, 17, 21, 25].map((r, i) => linha(`M${56 - r} ${50 + (i % 2) * 2} A${r} ${r * 1.15} 0 0 1 ${56 + r} ${50 - (i % 2) * 2}`, { opacity: 0.75, "stroke-width": 2 })),
    ...[9, 17, 25].map((r) => linha(`M${56 - r} 54 Q${56 - r} ${60 + r * 0.5} ${56 - r * 0.3} ${64 + r * 0.4}`, { opacity: 0.6, "stroke-width": 2 })),
    g("ilu-varre", [
      c("circle", { cx: 50, cy: 44, r: 14, fill: VIDRO, "stroke-width": 3 }),
      traco("M60 54 L72 66", "#8A6A10", 5.5),
      traco("M41 37 Q45 33 51 33", "#FFFFFF", 2, { opacity: 0.8 }),
    ]),
  ],

  // O átomo de Rutherford, como na tela Modelos atômicos do Atomic Box: cada elétron corre na sua
  // órbita. Dois vaivéns (um na horizontal, outro na vertical, com um quarto de volta de diferença)
  // desenham a elipse, e a bolinha continua redonda; cada órbita tem a sua velocidade.
  pesquisa: () => [
    s("defs", {}, [s("radialGradient", { id: "ilu-nucleo" }, [
      s("stop", { offset: "0", "stop-color": "#FF5A61", "stop-opacity": 0.85 }),
      s("stop", { offset: "1", "stop-color": "#FF5A61", "stop-opacity": 0 }),
    ])]),
    ...[0, 60, -60].map((r, k) => s("g", { transform: `rotate(${r} 60 45)` }, [
      s("ellipse", { cx: 60, cy: 45, rx: 38, ry: 13, fill: "none", stroke: AZUL, "stroke-width": 2.2, opacity: 0.85 }),
      g(`ilu-ex o${k}`, [g(`ilu-ey o${k}`, [
        c("circle", { cx: 60, cy: 45, r: 4.2, fill: AMARELO, "stroke-width": 1.4 }),
        s("circle", { cx: 58.8, cy: 43.8, r: 1.2, fill: "#FFFFFF", opacity: 0.8 }),
      ])]),
    ])),
    g("ilu-nucleo-pulsa", [s("circle", { cx: 60, cy: 45, r: 11, fill: "url(#ilu-nucleo)" })]),
    c("circle", { cx: 60, cy: 45, r: 5, fill: VERMELHO, "stroke-width": 1.4 }),
    s("circle", { cx: 58.4, cy: 43.4, r: 1.5, fill: "#FFFFFF", opacity: 0.7 }),
  ],

  // O quadro com a equação aparecendo, como se fosse escrita a giz.
  aula: () => [
    s("defs", {}, [s("clipPath", { id: "ilu-quadro" }, [s("rect", { x: 15, y: 15, width: 90, height: 48 })])]),
    c("rect", { x: 10, y: 10, width: 100, height: 58, rx: 4, fill: "#C68A4E" }),
    s("rect", { x: 15, y: 15, width: 90, height: 48, rx: 2, fill: "#1F4D3A" }),
    g("", [
      s("text", { x: 60, y: 44, "text-anchor": "middle", fill: "#F4F4F5", "font-size": 12, "font-family": "'Exo 2', Inter, Arial, sans-serif", "font-style": "italic" }, ["2H₂ + O₂ → 2H₂O"]),
      g("ilu-escreve", [s("rect", { x: 15, y: 28, width: 92, height: 24, fill: "#1F4D3A" })]),
    ], { "clip-path": "url(#ilu-quadro)" }),
    c("rect", { x: 26, y: 70, width: 68, height: 5, rx: 2, fill: "#8C5A2E" }),
    s("rect", { x: 70, y: 66, width: 12, height: 4, rx: 1.5, fill: "#FFFFFF" }),
    s("rect", { x: 40, y: 66, width: 10, height: 4, rx: 1.5, fill: "#F9C6D8" }),
  ],

  /* ---------- caminhos de formação (ícones redondos) ---------- */

  livro: () => [
    c("path", { d: "M10 18 Q20 14 30 18 V44 Q20 40 10 44 Z", fill: "#FFFFFF" }),
    c("path", { d: "M30 18 Q40 14 50 18 V44 Q40 40 30 44 Z", fill: "#FFFFFF" }),
    traco("M14 24 Q20 22 26 24 M14 30 Q20 28 26 30 M34 24 Q40 22 46 24 M34 30 Q40 28 46 30", "#9AA0AA", 1.6),
  ],
  frasco: () => [
    s("path", { d: "M18 38 H42 L47 46 Q48 48 46 48 H14 Q12 48 13 46 Z", fill: VERDE }),
    c("path", { d: "M25 10 V24 L12 46 Q11 49 14 49 H46 Q49 49 48 46 L35 24 V10", fill: VIDRO }),
    traco("M22 10 H38", "var(--ilu-traco)", 2.4),
    s("circle", { cx: 28, cy: 42, r: 1.8, fill: "#FFFFFF", class: "ilu-bolha d0" }),
    s("circle", { cx: 33, cy: 44, r: 1.3, fill: "#FFFFFF", class: "ilu-bolha d1" }),
  ],
  capelo: () => [
    c("path", { d: "M19 30 V38 Q30 44 41 38 V30 Z", fill: PRETO }),
    c("path", { d: "M6 26 L30 16 L54 26 L30 36 Z", fill: "#2B2A33" }),
    g("ilu-pendulo", [traco("M46 29 L48 42", AMARELO, 2), s("circle", { cx: 48, cy: 44, r: 2.6, fill: AMARELO })]),
  ],
  cracha: () => [
    traco("M30 4 V14", VERMELHO, 4),
    c("rect", { x: 14, y: 12, width: 32, height: 40, rx: 5, fill: "#FFFFFF" }),
    s("path", { d: "M14 22 V17 Q14 12 19 12 H41 Q46 12 46 17 V22 Z", fill: VERMELHO }),
    s("circle", { cx: 30, cy: 32, r: 6, fill: "#CC9066" }),
    traco("M21 45 H39", "#9AA0AA", 2),
  ],

  /* ---------- o que as caixas têm em comum (ícones) ---------- */

  pista: () => [
    c("circle", { cx: 26, cy: 26, r: 15, fill: VIDRO, "stroke-width": 3 }),
    traco("M37 37 L50 50", "#8A6A10", 6),
    g("ilu-check-pulsa", [traco("M19 26 l5 5 l9 -11", VERDE, 3.6)]),
  ],
  offline: () => [
    c("rect", { x: 17, y: 6, width: 26, height: 48, rx: 5, fill: "#2B2A33" }),
    s("rect", { x: 20, y: 11, width: 20, height: 36, rx: 2, fill: "#5BA4F0" }),
    g("ilu-aviao", [s("path", { d: "M24 30 L36 26 L37 28 L31 31 L33 37 L31 38 L28 32 L25 33 Z", fill: "#FFFFFF" })]),
  ],
  cadeado: () => [
    g("ilu-abre", [traco("M20 28 V20 Q20 10 30 10 Q40 10 40 20 V22", "#9AA0AA", 5)]),
    c("rect", { x: 14, y: 28, width: 32, height: 24, rx: 5, fill: AMARELO }),
    s("circle", { cx: 30, cy: 38, r: 3, fill: "#8A6A10" }), s("rect", { x: 28.8, y: 39, width: 2.4, height: 7, rx: 1, fill: "#8A6A10" }),
  ],
  turma: () => [
    ...[[16, VERMELHO], [44, VERDE]].map(([x, cor]) => [c("path", { d: `M${x - 10} 54 Q${x - 10} 42 ${x} 42 Q${x + 10} 42 ${x + 10} 54 Z`, fill: cor }), c("circle", { cx: x, cy: 33, r: 7, fill: "#CC9066" })]).flat(),
    c("path", { d: "M18 56 Q18 40 30 40 Q42 40 42 56 Z", fill: AZUL }),
    c("circle", { cx: 30, cy: 28, r: 9, fill: "#9A6440" }),
    g("ilu-mao", [c("path", { d: "M40 44 L48 20", fill: "none", "stroke-width": 5 }), s("circle", { cx: 48.5, cy: 18, r: 3.6, fill: "#9A6440" })]),
  ],

  /* ---------- fale comigo (ícones) ---------- */

  // Duas peças de quebra-cabeça se encaixando.
  parceria: () => [
    g("ilu-encaixa", [c("path", { d: "M8 20 H22 Q21 14 26 14 Q31 14 30 20 H34 V32 Q40 31 40 36 Q40 41 34 40 V50 H8 Z", fill: AZUL })]),
    c("path", { d: "M34 20 H52 V50 H34 V40 Q40 41 40 36 Q40 31 34 32 Z", fill: VERDE }),
  ],
  // O coração com uma moeda caindo.
  doacao: () => [
    g("ilu-moeda", [c("circle", { cx: 30, cy: 12, r: 6, fill: AMARELO }), s("text", { x: 30, y: 15.5, "text-anchor": "middle", "font-size": 9, "font-weight": 700, fill: "#8A6A10", "font-family": "Inter, Arial, sans-serif" }, ["$"])]),
    g("ilu-bate", [c("path", { d: "M30 54 C10 40 8 30 12 24 C16 18 25 18 30 26 C35 18 44 18 48 24 C52 30 50 40 30 54 Z", fill: VERMELHO })]),
  ],
  // A tela com o botão de play, como um vídeo começando.
  canal: () => [
    c("rect", { x: 6, y: 12, width: 48, height: 34, rx: 9, fill: VERMELHO }),
    g("ilu-bate", [s("path", { d: "M25 21 L39 29 L25 37 Z", fill: "#FFFFFF" })]),
    s("rect", { x: 14, y: 50, width: 32, height: 4, rx: 2, fill: "var(--ilu-linha)", opacity: 0.6 }),
  ],
  // O balão de conversa com uma estrela.
  feedback: () => [
    c("path", { d: "M10 12 H50 Q54 12 54 16 V38 Q54 42 50 42 H26 L16 50 L18 42 H10 Q6 42 6 38 V16 Q6 12 10 12 Z", fill: "var(--ilu-balao)" }),
    g("ilu-brilha", [s("path", { d: "M30 17 L33 24 L41 24.5 L35 29.5 L37 37 L30 33 L23 37 L25 29.5 L19 24.5 L27 24 Z", fill: AMARELO, stroke: "#8A6A10", "stroke-width": 1.2, "stroke-linejoin": "round" })]),
  ],

  /* ---------- para professores ---------- */

  // A planilha da turma com as barras crescendo.
  planilha: () => {
    const linhas = [0, 1, 2, 3, 4].map((i) => s("path", { d: `M14 ${28 + i * 12} H226`, stroke: "var(--ilu-placa-2)", "stroke-width": 1.4 }));
    const barras = [52, 34, 70, 46, 62, 28, 56].map((h, i) => s("rect", { x: 30 + i * 28, y: 82 - h, width: 16, height: h, rx: 3, fill: [AZUL, VERDE, VERMELHO][i % 3], class: "ilu-barra", style: `--i:${i}` }));
    return [
      c("rect", { x: 8, y: 6, width: 224, height: 84, rx: 8, fill: "var(--ilu-balao)" }),
      s("rect", { x: 8, y: 6, width: 224, height: 14, rx: 8, fill: "var(--ilu-placa-2)" }),
      ...linhas, ...barras,
      ...cabecaDoDinger(212, 66, 11),
    ];
  },
};

const QUADROS = { canal: "0 0 60 60", parceria: "0 0 60 60", doacao: "0 0 60 60", feedback: "0 0 60 60", livro: "0 0 60 60", frasco: "0 0 60 60", capelo: "0 0 60 60", cracha: "0 0 60 60", pista: "0 0 60 60", offline: "0 0 60 60", cadeado: "0 0 60 60", turma: "0 0 60 60", planilha: "0 0 240 96" };

function desenhar(alvo) {
  const nome = alvo.dataset.ilustracao;
  if (!DESENHOS[nome]) return;
  const svg = s("svg", { viewBox: QUADROS[nome] || "0 0 120 90", "aria-hidden": "true", focusable: "false", class: `ilu ilu-${nome}` }, DESENHOS[nome]());
  alvo.replaceChildren(svg);
}

/* O contato só aparece com o link do formulário preenchido (data-formulario na seção). */
function ligarContato() {
  const secao = document.getElementById("contato");
  const link = secao && secao.dataset.formulario;
  if (!link || !/^https:\/\//.test(link)) return;
  document.getElementById("botao-contato").href = link;
  secao.hidden = false;
  document.querySelectorAll("[data-so-com-formulario]").forEach((el) => { el.hidden = false; });
  ligarCopiaDoPix();
}

/* O botão que copia a chave Pix. Sem acesso à área de transferência, seleciona a chave para o
   visitante copiar à mão. */
function ligarCopiaDoPix() {
  const botao = document.getElementById("copiar-pix");
  const chave = document.getElementById("chave-pix");
  const status = document.getElementById("pix-status");
  if (!botao || !chave) return;
  const selecionar = () => {
    const faixa = document.createRange();
    faixa.selectNodeContents(chave);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(faixa);
  };
  botao.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(chave.textContent.trim());
      status.textContent = "Chave copiada! Cole no app do seu banco, na opção Pix. Obrigado!";
    } catch (e) {
      selecionar();
      status.textContent = "A chave está selecionada: copie e cole no app do seu banco.";
    }
  });
}

function iniciar() {
  ligarContato();
  document.querySelectorAll("[data-ilustracao]").forEach(desenhar);
  // Os cartões entram suavemente quando chegam na tela.
  const revelar = document.querySelectorAll(".revelar");
  if (!("IntersectionObserver" in window)) { revelar.forEach((el) => el.classList.add("na-tela")); return; }
  document.documentElement.classList.add("com-revelar");
  const observador = new IntersectionObserver((entradas) => {
    for (const e of entradas) if (e.isIntersecting) { e.target.classList.add("na-tela"); observador.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px" });
  revelar.forEach((el) => observador.observe(el));
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
else iniciar();

export { DESENHOS };
