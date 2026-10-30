# Meli DS — Design System (engenharia reversa)

**Versão 1.1.0** · Storybook: [meli-prox.vercel.app/storybook](https://meli-prox.vercel.app/storybook/) · histórico na [seção 9](#9-histórico-de-versões)

> **Fontes analisadas**
> - **Ref 1:** 9 screenshots do app Mercado Pago Android (`meli_ds_1…9.jpeg`), capturadas em ~2× (738 px ≈ 360 dp). Cores amostradas por pixel e medidas convertidas para dp.
> - **Ref 2:** `mercadolivre.com.br`, com CSS de produção da home (Andes UI, `navigation-desktop.css` e `home.desktop.css`) e estilos computados no navegador. A **PDP** (`/p/MLB52069531`) redireciona para verificação de conta quando acessada de forma automatizada, então os valores de PDP abaixo seguem os componentes Andes da home (botões, money-amount, poly-card), que são os mesmos usados na PDP.
>
> **Grau de confiança:** 🟢 lido do CSS · 🔵 amostrado do pixel · 🟡 inferido/derivado (estados hover/pressed, escala completa).

**Arquivos gerados (fonte única: `tokens/build.mjs`)**

| Arquivo | Uso |
|---|---|
| `tokens/figma-variables.json` | Coleções, modos, aliases, text e effect styles no formato da Figma Variables API |
| `tokens/figma-import.generated.js` | Script Plugin API autocontido: rode via **Figma MCP `use_figma`** (ou Scripter) e ele cria tudo no arquivo |
| `tokens/tokens.dtcg.json` | W3C Design Tokens (Tokens Studio / Style Dictionary) |
| `tokens/tokens.css` | CSS custom properties (temas `mp-light`, `mp-dark`, `ml-light`) |
| `storybook/` | Documentação viva (`npm run storybook`) |

---

## 1. Tokens de cor

### 1.1 Marca

| Token | HEX | RGB | Uso | |
|---|---|---|---|---|
| `yellow/500` **Meli Yellow** | `#FFE600` | 255, 230, 0 | Header da home/menu, nav web, FAB de IA | 🟢🔵 |
| `yellow/100` | `#FFF8B5` | 255, 248, 181 | Faixa "Mercado Livre" no header do menu | 🔵 |
| `indigo/500` **MP Indigo** (primária de ação) | `#434CE5` | 67, 76, 229 | CTA, links, ícones ativos, checkbox | 🔵 |
| `ml-blue/500` **ML Blue** (primária web) | `#3483FA` | 52, 131, 250 | Botões e links Andes | 🟢 |
| `pink/500` **meli+** | `#F5016C` | 245, 1, 108 | Selo/banner do programa meli+ | 🔵 |
| `teal/400` **Pix** | `#43D5BE` | 67, 213, 190 | FAB Pix na bottom nav | 🔵 |

### 1.2 Primária: Indigo (app)

| Step | HEX | Uso |
|---|---|---|
| 50 | `#F2F5FF` | Hover leve 🟡 |
| **100** | `#E9F1FE` | **Tint**: botão secundário, tiles, banners informativos, botão voltar 🔵 |
| 150 | `#DCE5FD` | Hover do tint 🟡 |
| 200 | `#C6CBF7` | Pressed do tint 🟡 |
| 300 | `#9EA5F2` | Pressed em dark 🟡 |
| 400 | `#7A8CF2` | Links em dark mode 🔵 |
| **500** | `#434CE5` | **Primária** 🔵 |
| 600 | `#3740CC` | Hover 🟡 |
| 700 | `#2C33A8` | Pressed 🟡 |
| 800 | `#1B2855` | Botão secundário em dark ("Alterar") 🔵 |
| 900 | `#121A3D` | Hover em dark 🟡 |

### 1.3 Primária: Andes Blue (web) 🟢

| Token | Valor |
|---|---|
| `ml-blue/100…400` | `rgba(65,137,230, .10 / .15 / .20 / .30 / .40)` (fundos quiet, focus halo) |
| `ml-blue/500` | `#3483FA` (default) |
| `ml-blue/600` | `#2968C8` (hover, anel de foco) |
| `ml-blue/700` | `#1F4E96` (pressed) |

### 1.4 Neutros

**App (cinzas frios, levemente azulados)** 🔵

| Step | HEX | Uso |
|---|---|---|
| 0 | `#FFFFFF` | Superfície/canvas |
| 25 | `#F7F7F9` | Fundo de seção |
| 75 | `#E7EAF3` | Fundo da tela Cartões (`bg/subtle`) |
| 100 | `#E2E1E6` | Divisores |
| 200 | `#D5D4D9` | Borda de card |
| 400 | `#9A99A8` | Borda de input (`border/strong`) |
| 500 | `#757388` | Placeholder, texto terciário |
| 600 | `#575763` | Texto secundário/labels |
| 800 | `#2A2937` | Fundo dark |
| 850 | `#222133` | Superfície dark / cartão grafite |
| 900 | `#1E1E24` | Texto primário |
| lavender/200 · 400 · 600 | `#D1D4E7` · `#8C8DA9` · `#504E66` | Botão desabilitado (fundo · texto), valor monetário vazio |

**Web (Andes)** 🟢 `#FFFFFF`, `#F5F5F5`, `#EDEDED` (fundo da página), `#EBEBEB`, `#E6E6E6`, `#BFBFBF`, `#737373`, `#666666`, `#333333`, `#1A1A1A`. O texto usa **alpha sobre preto**: `rgba(0,0,0,.9)` primário, `.55` secundário, `.25` desabilitado e `.1` para bordas.

### 1.5 Feedback

| Papel | App | Web 🟢 |
|---|---|---|
| Positivo | `#198A2C` (selo "Grátis") · soft `#DFFCE0` | `#00A650` · on-complex `#008744` |
| Negativo | `#D12440` | `#F23D4F` · `#D12440` |
| Atenção | `#E54302` (badge "!") | `#FF7733` · `#E6540B` |
| Informativo | `#434CE5` · soft `#E9F1FE` | `#3483FA` |

### 1.6 Tokens semânticos (3 modos)

| Token | MP Light | MP Dark | ML Light |
|---|---|---|---|
| `bg/canvas` | neutral/0 | neutral/900 | ml-gray/100 |
| `bg/subtle` | neutral/75 | neutral/950 | ml-gray/50 |
| `surface/default` | neutral/0 | neutral/850 | #FFF |
| `surface/tint` | indigo/100 | indigo/800 | ml-blue/150 |
| `text/primary` | neutral/900 | neutral/0 | black-α 90 |
| `text/secondary` | neutral/600 | neutral/300 | black-α 55 |
| `text/accent` | indigo/500 | indigo/400 | ml-blue/500 |
| `border/default` | neutral/200 | neutral/700 | black-α 10 |
| `border/strong` | neutral/400 | neutral/500 | black-α 25 |
| `action/primary/default · hover · pressed` | indigo 500·600·700 | indigo 500·400·300 | ml-blue 500·600·700 |
| `action/primary/disabled` | lavender/200 | neutral/700 | black-α 10 |
| `action/secondary/default` | indigo/100 | indigo/800 | ml-blue/150 |
| `brand/pix · meli-plus · yellow` | teal/400 · pink/500 · yellow/500 | idem | teal/500 · idem |

A lista completa, com 39 tokens, está em `tokens/figma-variables.json` (coleção **Semantic**).

### 1.7 Gradientes

| Token | Valor | Onde |
|---|---|---|
| `assistant-fab` | `radial-gradient(circle at 35% 30%, #FFFBC2 0%, #FFEE4D 45%, #F2D500 100%)` + glow amarelo | FAB do assistente de IA ("Mago") |
| `assistant-border` | `linear-gradient(90deg, #A9AEF0, #C9C6E8, #F0ED90)` | Borda 2px do card "Mago, seu assistente" |
| `card-graphite` | `linear-gradient(135deg, #2E2D40, #1A1926 60%, #0E0D16)` | Card promo do cartão de crédito |
| `card-navy` | `linear-gradient(160deg, #22324F, #1B273F 50%, #0E1626)` | Cartão de débito virtual |
| `brand-header` | `linear-gradient(180deg, #FFE600 85%, #FFF159)` | Header amarelo |
| `media-scrim` | escurecimento topo e base sobre foto | Cards de onboarding com imagem |

---

## 2. Tipografia

| | App Mercado Pago | Web Mercado Livre |
|---|---|---|
| Família principal | Grotesca neo-humanista de traço uniforme e "a" de dois andares. O visual é muito próximo de **Inter**, usada como substituta aberta. | **Proxima Nova** 🟢 |
| Fallback | `-apple-system, Roboto, Arial, sans-serif` | `-apple-system, Roboto, Arial, sans-serif` 🟢 |
| Pesos | 400 · 500 · 600 · 700 | 300 · 400 · 600 · 700 🟢 |
| Base | 16 dp | 16 px (body com 13–14 px nos componentes) |

### 2.1 Escala do app (dp)

| Estilo | Tamanho | Peso | Line-height | Letter-spacing | Exemplo |
|---|---|---|---|---|---|
| `display/amount` | 40 | 700 | 48 | −0.8 px | "R$ 0,00" |
| **H1** `heading/h1` | 28 | 600 | 34 | −0.4 px | "Pix", "Cartões" |
| **H2** `heading/h2` | 24 | 600 | 30 | −0.3 px | "Confira a conta", "Insira o valor" |
| **H3** `heading/h3` | 20 | 600 | 26 | −0.2 px | "Débito virtual", títulos de seção |
| **H4** `heading/h4` | 18 | 600 | 24 | −0.1 px | "Felipe Marinelli", "Faça seu primeiro Pix" |
| **H5** `heading/h5` | 16 | 600 | 20 | 0 | Valores em lista, títulos de card |
| **H6** `heading/h6` | 14 | 600 | 18 | 0 | Rótulos fortes |
| `body/lg` | 16 | 400 | 24 | 0 | Parágrafos, empty states |
| `body/md` | 14 | 400 | 20 | 0 | Labels ("Nome", "Chave Pix") |
| `label/button` | 16 | 600 | 20 | 0 | Botões grandes |
| `label/md` | 13 | 500 | 16 | 0 | Bottom nav |
| `caption/md` | 12 | 400 | 16 | 0 | Datas, metadados |
| `caption/strong` | 12 | 600 | 16 | 0 | Badges |
| `overline/card` | 12 | 600 | 16 | **+2.4 px (0.2em)** | "VIRTUAL" no cartão |

### 2.2 Escala web (px) 🟢

| Estilo | Spec |
|---|---|
| Preço PDP | 36 / 44 · **300 (Light)** |
| Preço card | 32 / 40 · 400 (centavos em `<sup>` ~50%) |
| Título PDP | 22 / 26 · 600 |
| Título de card de acesso | 16 / 20 · 600 |
| Título de produto | 16 / 20 · 400 (2 linhas, clamp) |
| Body pequeno / frete | 14 / 18 · 400 / **600 verde** |
| Caption / preço antigo | 12 / 15 · 400 · `rgba(0,0,0,.55)`, riscado |
| Botão | 16 / 48 · 600 |

### 2.3 Escala por superfície (`--font-scale`)

Os estilos `--type-*` multiplicam tamanho e line-height por `var(--font-scale, 1)`. Sem a variável, a escala é a do DS (tabela 2.1). Uma superfície pode reduzir ou ampliar toda a tipografia de uma vez sem mexer nos tokens: o protótipo do Aproxime usa `:root { --font-scale: .9 }` (10% menor). Tamanhos fixos em componentes (badge, iniciais de avatar, chips) também usam `calc(Npx * var(--font-scale, 1))`.

---

## 3. Espaçamento e grid

**Base de 4 px**, com ritmo predominante de 8.

| Token | 0 | 0.5 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| px | 0 | 2 | 4 | 8 | 12 | **16** | 20 | **24** | 32 | 40 | 48 | 64 | 80 |

**Regras observadas no app**
- Margem lateral da tela: **16 dp**.
- Entre blocos de conteúdo: **24 dp**. Entre label e valor: **4 dp**.
- Gap entre CTAs empilhados: **12 dp**. Gap entre tiles: **12 dp** (8 dp nos compactos).
- Lista do menu: linha de **56 dp**, ícone 20 dp + 12 dp de gap, divisor de grupo com 8 dp de respiro.
- Bottom nav: **64 dp** + FAB Pix 56 dp elevado −28 dp.

**Grid**

| Breakpoint | Colunas | Margem | Gutter | Container |
|---|---|---|---|---|
| Mobile (< 768) | 4 | 16 | 12 | fluido |
| Tablet (768–1023) | 8 | 24 | 16 | fluido |
| Desktop (≥ 1024) | 12 | auto | 16 | **max 1200 px** (conteúdo 1180) 🟢 |

O header web tem **100 px** 🟢 de altura e busca com **max-width 720 px** 🟢.

---

## 4. Bordas e sombras

### 4.1 Border-radius

| Token | px | App | Web 🟢 |
|---|---|---|---|
| `xs` | 2 | — | Search input |
| `sm` | 4 | Checkbox | Botão small |
| `md` | 6 | — | **Botão large, cards** |
| `lg` | 8 | Botões md/sm | Assistente, cards dinâmicos |
| `xl` | **12** | **Botões lg, inputs, icon buttons** | — |
| `2xl` | 16 | Cards | Componentes de home |
| `3xl` | 20 | Tiles de ação, banners, header inferior | — |
| `4xl` | 28 | Bottom sheet, topo da bottom nav | — |
| `full` | 999 | Badges, avatar, FABs, page dots | Pills 24 px |

### 4.2 Bordas e divisores

- Card outlined: `1px solid border/default` (`#D5D4D9` no app, `rgba(0,0,0,.1)` na web).
- Input: `1px solid border/strong`. No foco passa a `2px indigo/500` (inset), sem glow.
- Divisor de lista: `1px border/divider` (`#E2E1E6`), sempre de borda a borda, separando **grupos** e nunca linhas individuais.
- Web: divisores `#E6E6E6`/`#EDEDED`.

### 4.3 Sombras (`box-shadow`)

| Token | Valor | Uso |
|---|---|---|
| `elevation/1` 🟢 | `0 1px 2px 0 rgba(0,0,0,.12)` | Cards web, card de saldo |
| `elevation/2` 🟢 | `0 6px 16px 0 rgba(0,0,0,.10)` | Hover de card, dropdown |
| `elevation/3` 🟢 | `0 8px 16px 0 rgba(0,0,0,.10)` | Card de produto em hover, cartões |
| `elevation/modal` 🟢 | `0 -1px 30px 0 rgba(0,0,0,.2), 0 2px 3px 0 rgba(0,0,0,.1)` | Modais e sheets web |
| `elevation/bottom-nav` 🟡 | `0 -2px 12px 0 rgba(16,16,48,.06)` | Bottom nav |
| `glow/assistant` 🔵 | `0 0 24px 2px rgba(255,230,0,.55), 0 4px 12px rgba(242,213,0,.35)` | FAB de IA |
| `glow/pix` 🔵 | `0 4px 16px 0 rgba(67,213,190,.45)` | FAB Pix |
| `focus/ring` (app) 🟡 | `0 0 0 2px #FFF, 0 0 0 4px rgba(67,76,229,.45)` | Foco de teclado |
| `focus/ring` (web) 🟢 | `0 0 0 2px #fff, 0 0 0 3px #2968C8, 0 0 0 5px rgba(65,137,230,.3)` | Foco Andes |

> O app é **quase plano**: a hierarquia vem de *tint* e cor, não de sombra. Sombra aparece só em elementos flutuantes (FABs, nav, sheet) e no card de saldo.

---

## 5. Componentes

### 5.1 Botão

| Variante | Fundo | Texto | Hover | Pressed | Disabled |
|---|---|---|---|---|---|
| **Primary** | `#434CE5` | `#FFFFFF` | `#3740CC` | `#2C33A8` | fundo `#D1D4E7`, texto `#8C8DA9` |
| **Secondary** (tint) | `#E9F1FE` | `#434CE5` | `#DCE5FD` | `#C6CBF7` | idem primary |
| **Transparent** | — | `#434CE5` | fundo `#E9F1FE` | — | texto `#8C8DA9` |
| **On-dark** | `#1B2855` | `#FFFFFF` | `#121A3D` | — | — |
| **Loading** | primário com spinner branco 20 px; label oculto | | | | |
| **Web loud** 🟢 | `#3483FA` | `#FFF` | `#2968C8` | `#1F4E96` | `rgba(0,0,0,.1)` / `rgba(0,0,0,.25)` |
| **Web quiet** 🟢 | `rgba(65,137,230,.15)` | `#3483FA` | `.2` | `.3` | idem |

| Tamanho | Altura | Padding X | Raio (app / web) | Fonte |
|---|---|---|---|---|
| Large | 48 | 24 | 12 / 6 | 16/600 |
| Medium | 40 (web 32) | 16 (web 12) | 8 / 5 | 14/600 |
| Small | 32 (web 24) | 12 (web 8) | 8 / 4 | 12/600 |

**Regra de uso:** em telas de fluxo, o CTA primário ocupa a largura total e fica ancorado no rodapé, com o secundário (tint) logo abaixo. Transição: `.18s ease-out` em background/color 🟢.

### 5.2 Icon Button
40×40 (48 no lg), raio 12, fundo tint e ícone índigo 20–22 px. Variações: **com label** ("Chaves", padding 16), **surface** (branco + elevation/1), **brand** (branco 70% sobre amarelo, como no app). Badge de alerta: círculo 16 px `#E54302` com "!" ou contador.

### 5.3 Inputs
- **TextField outlined:** 48 dp de altura, padding 16, raio 12, borda 1px `#9A99A8`, placeholder `#757388` 16/400.
- **Estados:** hover com borda `text/tertiary`; foco com borda 2px índigo; erro com borda e helper `#D12440`; disabled com fundo `bg/subtle` e texto `#8C8DA9`.
- **Padrão "campo + ação":** input flexível e IconButton 48 de QR Code ao lado, com gap de 8.
- **Checkbox:** 24 px, raio 4, marcado com fundo índigo e check branco. O texto legal fica em `text/secondary` com links sublinhados em índigo.
- **Busca web** 🟢: 40 px, raio 2, `box-shadow 0 1px 2px rgba(0,0,0,.2)`, padding `10px 60px 10px 15px`.

### 5.4 Cards

| Variante | Spec | Exemplo |
|---|---|---|
| Outlined | `#FFF`, borda 1px `#D5D4D9`, raio 16, padding 16 | Linha de crédito, Score, número do cartão (raio 20) |
| Elevated | `#FFF`, `elevation/1`, raio 16 | Card de saldo |
| Tint | `#E9F1FE` (ou cinza `#F0F1F5`), raio 16 | Benefícios |
| Dark | gradiente grafite, texto branco, CTA primário sm | Promo do cartão de crédito |
| Banner info/positivo | tint índigo ou verde `#DFFCE0`, raio 20, ícone 24 preenchido | "Este é seu primeiro Pix…" |
| **ActionTile** | tint, raio 20, ícone 24–26 + label 14/600 índigo centralizado, badge sobreposto à borda inferior | Ações do cartão |
| Web poly-card 🟢 | `#FFF`, raio 6, `elevation/1` (hover `elevation/3`), imagem 1:1, body padding 16 | Vitrine/PDP |

### 5.5 Navegação

**Header do app (home):** fundo `#FFE600` arredondado embaixo (raio 20), avatar 40 branco com o logo do Mercado Pago (iniciais como fallback), saudação 16/600, selo meli+, 3 icon buttons à direita. Abaixo vêm tabs ("Saldo · Cofrinhos · Investimentos · Cripto"), com a ativa em um "folder tab" branco.

**Header de tela interna:** botão voltar 40×40 tint no topo esquerdo e H2 24/600 abaixo, alinhado à margem de 16.

**Bottom navigation:** 5 itens (Conta · Cartões · **Pix** · Pagamentos · Mais), 64 dp, superfície branca com topo arredondado de 28 e ícones outline 24 + label 12/500 (um ponto abaixo de `label/md`).
- **Espaçamento:** 5 entre ícone e label nas tabs comuns (a label fica alinhada à da tab Pix).
- **Ativo:** cor índigo e barra indicadora 32×4 **colada na borda superior** da barra, com só os cantos de baixo arredondados.
- **Pix:** FAB central de 56, elevado −28. Em repouso é teal `#43D5BE` com glow; quando ativo, branco com anel 3px índigo.

**FAB Assistente (IA):** 56, esfera amarela em gradiente radial com glow e faísca índigo. Fica flutuando a 16 da borda direita, acima da nav.

**Web:** header amarelo de 100 px com logo, busca central, "Enviar para…", categorias (14/400 `rgba(0,0,0,.55)`) e área de usuário. O footer é branco, com links 14 px `#333` (hover azul) e copyright 13 px `#999` 🟢.

### 5.6 Outros
- **Badge/Tag:** pill de 20 px com 12/600. Tons: positivo `#198A2C`, info `#434CE5`, meli+ `#F5016C` (700), quiet com fundo soft.
- **List item (menu):** linha de 56 com ícone 20 neutro, label 14/500, trailing (badge) e chevron índigo 20.
- **Transaction item:** thumb circular de 40 com borda; título 14/600, tipo e meio de pagamento 12; valor à direita 14/600 com data 12.
- **Payment card:** razão 1.586, raio 20, gradiente navy, chip "Débito" `#0078BD` em pill, "VIRTUAL" com tracking de 0.2em.
- **Page dots:** container pill branco; ponto de 8 px; ativo vira pílula de 24×8 escura.
- **Bottom sheet:** superfície branca com raio superior 28 e handle 32×4, sobre scrim `rgba(18,17,24,.45)`.
  - **Entrada:** sobe 100% → 0 em 0,38 s com ease-out (`cubic-bezier(.22,1,.36,1)`); o scrim entra com fade.
  - **Saída:** ao tocar fora, no X ou ao arrastar, desce 50% da própria altura com fade-out em 0,28 s, também ease-out; só então o conteúdo é desmontado.
  - **Arrastar para fechar:** o drawer acompanha o dedo e o scrim clareia junto. Passou de 96 px ou foi "jogado" (> 0,5 px/ms), fecha; antes disso, volta ao lugar. Com rolagem interna, o arrasto começa pela alça.

### 5.7 Aproxime e Perto de mim

| Componente | Spec |
|---|---|
| **ContactlessIllustration** | Disco 140 (NFC 144) com anel de 6 sobre navy; sucesso cresce para 152. **Pagar (NFC):** ondas brancas → verde Pix com check. **Transferir (Send):** amarelo; a seta sobe em loop (0,46 s entra · 1 s parada · 0,46 s sai, ciclo 1,92 s) e no sucesso vira 💸. **Receber (Receive):** azul `feedback/info` → verde Pix com 🤑. A seta continua em loop durante o processamento. |
| **Stand by** (template) | Fundo radial navy, anéis que crescem e somem (2,4 s, nunca encolhem). Estados: aguardando (2,5 s até detectar) → confirmação (Confirmar) → processando ("Transferindo…"/"Recebendo…" no botão, 2 s) → sucesso (2 s) → comprovante. Sem dupla confirmação, a detecção vai direto ao sucesso. |
| **Card de banner Aproxime** | 58% da largura, 168 de altura, raio 16, gradiente da ação (índigo · teal · navy) + scrim inferior, botão circular de 32 com seta no topo esquerdo, título `heading/h4` e legenda `caption/md` em branco. Slider com arrastar e snap, sangrando até a borda. |
| **NearbyAvatar** | Botão circular. **Contato:** foto, borda 1px `border/strong`, ponto online 28% verde `#17B26A` com borda branca. **Aberto:** iniciais 12/600 `#717680` sobre `#F5F5F5`. **Anônimo:** ícone de usuário sobre branco 14%. **Selecionado:** anel de 5 índigo + véu índigo 50%. Entra com "pop" (escala 0 → 1, overshoot). |
| **Área do Perto de mim** | Plano 300×401 (área de busca) desenhado em CSS 3D. Em perspectiva: `rotateX(62°)`, perspectiva 327, escala .685, só os 3 avatares mais próximos. Arrastar para baixo leva a 0° / escala 1 (visão de cima) e revela os demais do mais perto ao mais longe; a borda mais próxima ocupa a largura − 2×32. Sem rolagem dentro da área. |
| **NearbyDrawer** | Sobre o BottomSheet. **Contato:** avatar 56, nome `heading/h3`, telefone com ícone, chave Pix em campo somente leitura com IconButton de copiar, Receber (secondary) + Transferir (primary) e últimas transações. **Aberto:** iniciais, telefone parcial ("(15) 997..."), "Adicionar aos contatos". **Anônimo:** "Usuário Desconhecido" + cadeado "Não é possível interagir". |
| **SettingsCard / SettingsRow** | Padrão "Informações do seu perfil": card branco raio 6 com `elevation/1`, título 20/600 separado por divisória de ponta a ponta; linhas com ícone 22 · valor `body/lg` + legenda `body/md` secundária · ação à direita (Toggle ou chevron). Linhas com conteúdo expandem no lugar (grid 0fr → 1fr, 0,32 s) e o chevron gira 90°. Fundo da página `#EDEDED`, breadcrumb + Fechar no topo. |
| **ChoiceChips** | Pílulas de 8×14, borda `border/strong`; a escolhida vira índigo com texto branco. |
| **RadioList** | Bolinha de 20 (anel índigo com miolo branco quando marcada) + label `body/lg` e descrição. |
| **Toggle / Switch** | Trilho 52×32 (`border/strong` → índigo), thumb branco de 24. |
| **LiveDot** | Ponto verde de 10 com pulso (algo está ligado agora, ex.: "Me encontre"). |

---

## 6. Diretrizes de estilo / personalidade

**Tom visual:** fintech amigável, limpa e confiante. É minimalista sem ser fria: muito branco, cantos generosos (12–28) e uma paleta de três cores-assinatura, com amarelo para marca, índigo para ação e teal para Pix. Existe **dark mode** nos fluxos de crédito, com superfícies `#2A2937` e ações índigo. O marketplace web é **utilitário e denso**, com fundo cinza `#EDEDED`, cards brancos com sombra mínima e azul para ação.

**Princípios**
1. **Uma ação principal por tela**, em CTA índigo de largura total no rodapé.
2. **Tint antes de sombra.** Secundários, tiles e banners usam índigo 100.
3. **Leitura em dois níveis.** O label secundário vem em cima e o valor forte embaixo ("Nome" / "Felipe Marinelli").
4. **Amarelo é marca, não ação.** Fica reservado a header, nav web e assistente de IA.
5. **Feedback por cor + ícone**, nunca apenas cor.

**Ícones**
- Estilo **outline**, traço de 1.5–2 px, terminações arredondadas, grid de 24 (20 em listas).
- Cor neutra (`#3C3C46`) em listas e índigo em tiles e ações. O preenchimento aparece só em estados (info "i" preenchido, faísca da IA).
- Equivalente open-source próximo: **Lucide** (usado no Storybook).

**Imagens e ilustração**
- Fotografia real e calorosa (pessoas, POS amarelo Point), com cantos de 20–24 e scrim escuro para texto branco.
- Renders 3D/foto de cartões (preto fosco, navy) e moedas/cofrinhos em dourado.
- Logos de bancos em avatar circular de 40 com borda fina.

**Voz:** segunda pessoa, direta e encorajadora ("Faça seu primeiro Pix", "Vamos continuar analisando seu perfil"), com títulos no imperativo.

**Acessibilidade (atenção)**
- Índigo `#434CE5` sobre branco tem contraste de 6.2:1 (AA ✔). Índigo sobre tint `#E9F1FE` tem ~5.4:1 (AA ✔).
- Disabled `#8C8DA9` sobre `#D1D4E7` fica em 2.2:1. É aceitável por ser disabled, mas não deve ser usado para informação.
- O verde de frete web `#00A650` sobre branco fica em 3.2:1, o que só passa em texto ≥ 14 bold/18 regular.
- O glifo branco sobre o FAB Pix teal `#43D5BE` tem só 1.8:1. Como é ícone com label "Pix" abaixo, passa como decorativo, mas não use teal como fundo de texto.

---

## 7. Importar no Figma via MCP

**Opção A (recomendada):** use o Figma MCP (`use_figma`) com o arquivo de destino aberto e execute o conteúdo de `tokens/figma-import.generated.js`. Ele cria:
- 5 coleções de variáveis: **Primitives** (79), **Semantic** (39 × modos *MP Light / MP Dark / ML Light*, com aliases), **Spacing**, **Radius** e **Size**, todas com *scopes*;
- 25 **Text Styles** (com fallback para Inter se Proxima Nova não estiver instalada);
- 9 **Effect Styles**.

**Opção B:** importe `tokens/tokens.dtcg.json` no plugin **Tokens Studio**.

Para alterar um token, edite `tokens/build.mjs` e rode `node tokens/build.mjs`. Isso regenera o JSON do Figma, o DTCG e o CSS do Storybook juntos.

## 8. Storybook

```bash
cd storybook && npm install && npm run storybook
```

Seções: **Introdução** · **Foundations** (primitivas, semânticas por modo, gradientes, tipografia, espaçamento, raios, sombras) · **Components** (Button, IconButton, Badge, TextField, Card, ActionTile, ListItem, InfoBanner, Checkbox, Switch, SegmentedControl, SectionHeader, AssistantFab, PageDots, TransactionItem, PaymentCard, Receipt, BottomNav, AppHeader; e, em **Aproxime e Perto de mim**: ContactlessIllustration, NearbyAvatar, NearbyDrawer, BottomSheet, SettingsCard/SettingsRow, ChoiceChips, RadioList, Toggle, LiveDot) · **Web (Mercado Livre)** (botões Andes, header, poly-card, footer) · **Patterns** (8 telas do app recompostas só com o DS). Use a toolbar **Tema** para alternar entre MP Light, MP Dark e ML Web.

Versão publicada: **https://meli-prox.vercel.app/storybook/** (o protótipo fica na raiz do mesmo site).

## 9. Histórico de versões

### 1.1.0 · 2026-10-30
- **Novos componentes:** ContactlessIllustration (+ ContactlessMark), NearbyAvatar, NearbyDrawer, BottomSheet, SettingsCard, SettingsRow, ChoiceChips, RadioList, Toggle e LiveDot, com stories em *Components › Aproxime e Perto de mim*.
- **BottomSheet:** entrada/saída com ease-out e fechar arrastando para baixo.
- **Bottom navigation:** label 12/500, 5 entre ícone e label, marcador colado na borda superior.
- **IconButton brand:** fundo branco 70%. **AppHeader:** avatar com logo (story "Header · avatar com logo").
- **Tipografia:** `--font-scale` nos estilos `--type-*` (padrão 1, sem mudança para quem não define).
- **Figma:** componentes Switch, ChoiceChip, SettingsRow e NearbyDrawer; ícones radar, phone, user, user-plus, user-check, refresh-cw, gauge, vibrate e chevron-down; variantes de sucesso do IllustrationContactless corrigidas (SendSuccess amarelo com 💸).

### 1.0.0 · 2026-10-20
- Tokens (cor, tipografia, espaçamento, raio, sombra, gradiente) em CSS, DTCG e Figma Variables; componentes base do app e da web; Storybook com Foundations, Components, Web e Patterns.

