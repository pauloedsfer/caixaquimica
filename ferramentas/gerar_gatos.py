"""Gera os gatos das caixas (marca/gato-*.svg): o mesmo desenho, cada um com a pelagem e a caixa
do seu aplicativo. Rodar: python3 ferramentas/gerar_gatos.py"""
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# Emblemas na frente da caixa, centrados em (32, 47).
ATOMO = '''<g fill="none" stroke="#FFFFFF" stroke-width="1.5">
    <ellipse cx="32" cy="47" rx="10" ry="4"/>
    <ellipse cx="32" cy="47" rx="10" ry="4" transform="rotate(60 32 47)"/>
    <ellipse cx="32" cy="47" rx="10" ry="4" transform="rotate(-60 32 47)"/>
  </g>
  <circle cx="32" cy="47" r="2.6" fill="#E3262E"/>'''
MOL = '''<rect x="22" y="40" width="20" height="15" rx="3.2" fill="none" stroke="#FFFFFF" stroke-width="1.8"/>
  <path d="M22.5 44.6 H41.5" stroke="#FFFFFF" stroke-width="1.5"/>
  <circle cx="27.3" cy="50.2" r="1.6" fill="#6FC5F0"/>
  <circle cx="32" cy="50.2" r="2.3" fill="#E84910"/>
  <circle cx="36.7" cy="50.2" r="1.6" fill="#6FC5F0"/>'''
HEXAGONO = '''<polygon points="32,39.5 38.5,43.25 38.5,50.75 32,54.5 25.5,50.75 25.5,43.25" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linejoin="round"/>
  <circle cx="32" cy="47" r="3.6" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>'''

GATOS = {
    # Atomic Box: gato preto numa caixa de metal escuro; o vermelho fica no nariz e na coleira.
    "atomic": dict(nome="Bohr, o gato da Super Atomic Box", pelo="#1E1F24", contorno="#7A7F88", orelha="#5B5F68",
                   olho="#F4F4F5", pupila="#121316", nariz="#E3262E", coleira="#E3262E",
                   caixa="url(#metal)", borda="#8A8F98", emblema=ATOMO, mancha=None),
    # MOLBOX: gato laranja (o laranja da marca) numa caixa azul.
    "molbox": dict(nome="Avogato, o gato da Super Molbox", pelo="#EE8A3C", contorno="#B85A16", orelha="#F7C3A0",
                   olho="#FFFFFF", pupila="#1A1B1F", nariz="#B85A16", coleira="#6FC5F0",
                   caixa="#164194", borda="#0F2E6B", emblema=MOL, mancha="#C9661E"),
    # Organic Box: gato branco de olhos verdes numa caixa verde.
    "organic": dict(nome="Kekulé, o gato da Super Organic Box", pelo="#F5F1E8", contorno="#B9B2A3", orelha="#F29BA7",
                    olho="#FFFFFF", pupila="#1F6B42", nariz="#E77F8F", coleira="#8FD07A",
                    caixa="#1B5E3A", borda="#103C25", emblema=HEXAGONO, mancha=None),
}

MODELO = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="{nome}">
  <title>{nome}</title>
  <defs>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#43464D"/><stop offset="0.5" stop-color="#16171A"/><stop offset="1" stop-color="#2E3035"/>
    </linearGradient>
  </defs>
  <g stroke="{contorno}" stroke-width="1.2" stroke-linejoin="round">
    <polygon points="15,27 18,9 28,19" fill="{pelo}"/>
    <polygon points="49,27 46,9 36,19" fill="{pelo}"/>
    <ellipse cx="32" cy="28" rx="17" ry="13" fill="{pelo}"/>
  </g>
  <polygon points="18.5,22 19.8,13.5 25,19" fill="{orelha}"/>
  <polygon points="45.5,22 44.2,13.5 39,19" fill="{orelha}"/>
  {listras}
  <ellipse cx="25" cy="27" rx="4.2" ry="4.8" fill="{olho}"/>
  <ellipse cx="39" cy="27" rx="4.2" ry="4.8" fill="{olho}"/>
  <ellipse cx="25.8" cy="27.8" rx="2.1" ry="3" fill="{pupila}"/>
  <ellipse cx="39.8" cy="27.8" rx="2.1" ry="3" fill="{pupila}"/>
  <circle cx="26.6" cy="26.3" r="0.9" fill="#FFFFFF"/>
  <circle cx="40.6" cy="26.3" r="0.9" fill="#FFFFFF"/>
  <path d="M30.4 32.6 h3.2 l-1.6 1.8 z" fill="{nariz}"/>
  <path d="M22 38.5 Q32 41.5 42 38.5" fill="none" stroke="{coleira}" stroke-width="2.4" stroke-linecap="round"/>
  <rect x="7" y="35" width="50" height="25" rx="5" fill="{caixa}" stroke="{borda}" stroke-width="1.5"/>
  <path d="M7 39 H57" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1.2"/>
  {emblema}
  <g fill="{pelo}" stroke="{contorno}" stroke-width="1.2">
    <ellipse cx="20" cy="35.5" rx="4" ry="2.6"/>
    <ellipse cx="44" cy="35.5" rx="4" ry="2.6"/>
  </g>
</svg>
'''

for chave, g in GATOS.items():
    listras = ""
    if g["mancha"]:
        m = g["mancha"]
        listras = (f'<path d="M29 16.5 q3 3 6 0" fill="none" stroke="{m}" stroke-width="1.6" stroke-linecap="round"/>'
                   f'<path d="M27.5 20 q4.5 3 9 0" fill="none" stroke="{m}" stroke-width="1.6" stroke-linecap="round"/>')
    svg = MODELO.format(listras=listras, **{k: v for k, v in g.items() if k != "mancha"})
    (RAIZ / "marca" / f"gato-{chave}.svg").write_text(svg, encoding="utf-8")
    print("marca/gato-%s.svg" % chave)
