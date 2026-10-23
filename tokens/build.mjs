// Fonte única dos tokens do Meli DS (engenharia reversa: app Mercado Pago + web Mercado Livre).
// Gera:
//   tokens/figma-variables.json  -> coleções/modos/aliases no formato da Figma Variables API (use_figma / plugin)
//   tokens/tokens.dtcg.json      -> W3C Design Tokens (Tokens Studio, Style Dictionary)
//   tokens/tokens.css            -> CSS custom properties consumidas pelo Storybook
// Uso: node tokens/build.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = dirname(fileURLToPath(import.meta.url));

/* ---------------------------------------------------------------- primitives */
const primitives = {
  indigo: {
    50: "#F2F5FF", 100: "#E9F1FE", 150: "#DCE5FD", 200: "#C6CBF7", 300: "#9EA5F2",
    400: "#7A8CF2", 500: "#434CE5", 600: "#3740CC", 700: "#2C33A8", 800: "#1B2855", 900: "#121A3D",
  },
  lavender: { 200: "#D1D4E7", 400: "#8C8DA9", 600: "#504E66" },
  neutral: {
    0: "#FFFFFF", 25: "#F7F7F9", 50: "#F0F1F5", 75: "#E7EAF3", 100: "#E2E1E6", 200: "#D5D4D9",
    300: "#B9B8C4", 400: "#9A99A8", 500: "#757388", 600: "#575763", 700: "#3C3C46",
    800: "#2A2937", 850: "#222133", 900: "#1E1E24", 950: "#121118",
  },
  yellow: { 50: "#FFFDE6", 100: "#FFF8B5", 300: "#FFF159", 500: "#FFE600", 600: "#F2D500", 700: "#D9BE00" },
  green: { 50: "#DFFCE0", 100: "#AAF1AB", 500: "#00A650", 600: "#198A2C", 700: "#008744" },
  red: { 50: "#FDE7EA", 500: "#F23D4F", 600: "#D12440" },
  orange: { 500: "#FF7733", 600: "#E6540B", 700: "#E54302" },
  pink: { 500: "#F5016C", 700: "#B11954" },
  teal: { 400: "#43D5BE", 500: "#32BCAD" },
  card: { navy: "#1B273F", graphite: "#222133", debit: "#0078BD" },
  // Andes (web Mercado Livre) — valores lidos do CSS de produção
  "ml-blue": {
    100: "rgba(65,137,230,0.10)", 150: "rgba(65,137,230,0.15)", 200: "rgba(65,137,230,0.20)",
    300: "rgba(65,137,230,0.30)", 400: "rgba(65,137,230,0.40)", 500: "#3483FA", 600: "#2968C8", 700: "#1F4E96",
  },
  "ml-gray": {
    0: "#FFFFFF", 50: "#F5F5F5", 100: "#EDEDED", 150: "#EBEBEB", 200: "#E6E6E6", 300: "#BFBFBF",
    500: "#737373", 600: "#666666", 700: "#333333", 900: "#1A1A1A",
  },
  "black-alpha": { 5: "rgba(0,0,0,0.05)", 10: "rgba(0,0,0,0.10)", 25: "rgba(0,0,0,0.25)", 55: "rgba(0,0,0,0.55)", 90: "rgba(0,0,0,0.90)" },
  "white-alpha": { 10: "rgba(255,255,255,0.10)", 60: "rgba(255,255,255,0.60)", 100: "#FFFFFF" },
};

/* ---------------------------------------------------- semantic (3 modes) */
// Valores são referências "grupo/step" para primitivas.
const MODES = ["MP Light", "MP Dark", "ML Light"];
const semantic = {
  "bg/canvas":          ["neutral/0", "neutral/900", "ml-gray/100"],
  "bg/subtle":          ["neutral/75", "neutral/950", "ml-gray/50"],
  "bg/brand":           ["yellow/500", "yellow/500", "yellow/500"],
  "surface/default":    ["neutral/0", "neutral/850", "ml-gray/0"],
  "surface/raised":     ["neutral/0", "neutral/800", "ml-gray/0"],
  "surface/tint":       ["indigo/100", "indigo/800", "ml-blue/150"],
  "surface/inverse":    ["neutral/900", "neutral/0", "ml-gray/900"],
  "text/primary":       ["neutral/900", "neutral/0", "black-alpha/90"],
  "text/secondary":     ["neutral/600", "neutral/300", "black-alpha/55"],
  "text/tertiary":      ["neutral/500", "neutral/400", "ml-gray/500"],
  "text/disabled":      ["lavender/400", "neutral/500", "black-alpha/25"],
  "text/on-accent":     ["neutral/0", "neutral/0", "ml-gray/0"],
  "text/on-brand":      ["neutral/900", "neutral/900", "ml-gray/700"],
  "text/accent":        ["indigo/500", "indigo/400", "ml-blue/500"],
  "text/positive":      ["green/600", "green/100", "green/500"],
  "text/negative":      ["red/600", "red/500", "red/500"],
  "border/default":     ["neutral/200", "neutral/700", "black-alpha/10"],
  "border/strong":      ["neutral/400", "neutral/500", "black-alpha/25"],
  "border/divider":     ["neutral/100", "neutral/800", "ml-gray/200"],
  "border/focus":       ["indigo/500", "indigo/400", "ml-blue/600"],
  "action/primary/default":  ["indigo/500", "indigo/500", "ml-blue/500"],
  "action/primary/hover":    ["indigo/600", "indigo/400", "ml-blue/600"],
  "action/primary/pressed":  ["indigo/700", "indigo/300", "ml-blue/700"],
  "action/primary/disabled": ["lavender/200", "neutral/700", "black-alpha/10"],
  "action/primary/text":     ["neutral/0", "neutral/0", "ml-gray/0"],
  "action/primary/text-disabled": ["lavender/400", "neutral/500", "black-alpha/25"],
  "action/secondary/default": ["indigo/100", "indigo/800", "ml-blue/150"],
  "action/secondary/hover":   ["indigo/150", "indigo/900", "ml-blue/200"],
  "action/secondary/pressed": ["indigo/200", "indigo/900", "ml-blue/300"],
  "action/secondary/text":    ["indigo/500", "neutral/0", "ml-blue/500"],
  "feedback/positive/fill": ["green/600", "green/600", "green/500"],
  "feedback/positive/soft": ["green/50", "green/700", "green/50"],
  "feedback/negative/fill": ["red/500", "red/500", "red/500"],
  "feedback/caution/fill":  ["orange/700", "orange/500", "orange/500"],
  "feedback/info/fill":     ["indigo/500", "indigo/400", "ml-blue/500"],
  "feedback/info/soft":     ["indigo/100", "indigo/800", "ml-blue/100"],
  "brand/yellow":     ["yellow/500", "yellow/500", "yellow/500"],
  "brand/meli-plus":  ["pink/500", "pink/500", "pink/500"],
  "brand/pix":        ["teal/400", "teal/400", "teal/500"],
};

/* ------------------------------------------------------------- dimensions */
const spacing = { 0: 0, 0.5: 2, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64, 20: 80 };
const radius = { none: 0, xs: 2, sm: 4, md: 6, lg: 8, xl: 12, "2xl": 16, "3xl": 20, "4xl": 28, full: 999 };
const size = {
  "control/sm": 32, "control/md": 40, "control/lg": 48, "icon/sm": 16, "icon/md": 24, "icon/lg": 32,
  "avatar/md": 40, "fab/md": 56, "nav/bottom": 64, "header/web": 100, "container/max": 1200, "container/content": 1180,
};

/* ------------------------------------------------------------- typography */
const fonts = {
  app: "Inter, 'Proxima Nova', -apple-system, Roboto, Arial, sans-serif",
  web: "'Proxima Nova', -apple-system, Roboto, Arial, sans-serif",
};
// [família, tamanho, peso, line-height, letter-spacing(px)]
const textStyles = {
  "display/amount": ["app", 40, 700, 48, -0.8],
  "heading/h1":     ["app", 28, 600, 34, -0.4],
  "heading/h2":     ["app", 24, 600, 30, -0.3],
  "heading/h3":     ["app", 20, 600, 26, -0.2],
  "heading/h4":     ["app", 18, 600, 24, -0.1],
  "heading/h5":     ["app", 16, 600, 20, 0],
  "heading/h6":     ["app", 14, 600, 18, 0],
  "body/lg":        ["app", 16, 400, 24, 0],
  "body/md":        ["app", 14, 400, 20, 0],
  "body/md-strong": ["app", 14, 600, 20, 0],
  "label/button":   ["app", 16, 600, 20, 0],
  "label/md":       ["app", 13, 500, 16, 0],
  "caption/md":     ["app", 12, 400, 16, 0],
  "caption/strong": ["app", 12, 600, 16, 0],
  "overline/card":  ["app", 12, 600, 16, 2.4],
  "web/price-lg":   ["web", 36, 300, 44, 0],
  "web/price-md":   ["web", 32, 400, 40, 0],
  "web/title-pdp":  ["web", 22, 600, 26, 0],
  "web/heading":    ["web", 24, 400, 30, 0],
  "web/card-title": ["web", 16, 600, 20, 0],
  "web/body":       ["web", 16, 400, 20, 0],
  "web/body-sm":    ["web", 14, 400, 18, 0],
  "web/shipping":   ["web", 14, 600, 18, 0],
  "web/caption":    ["web", 12, 400, 15, 0],
  "web/button-lg":  ["web", 16, 600, 48, 0],
};

/* --------------------------------------------------------- effects/shadow */
const shadows = {
  "elevation/0": [],
  "elevation/1": [[0, 1, 2, 0, "rgba(0,0,0,0.12)"]],
  "elevation/2": [[0, 6, 16, 0, "rgba(0,0,0,0.10)"]],
  "elevation/3": [[0, 8, 16, 0, "rgba(0,0,0,0.10)"]],
  "elevation/modal": [[0, -1, 30, 0, "rgba(0,0,0,0.20)"], [0, 2, 3, 0, "rgba(0,0,0,0.10)"]],
  "elevation/bottom-nav": [[0, -2, 12, 0, "rgba(16,16,48,0.06)"]],
  "glow/assistant": [[0, 0, 24, 2, "rgba(255,230,0,0.55)"], [0, 4, 12, 0, "rgba(242,213,0,0.35)"]],
  "glow/pix": [[0, 4, 16, 0, "rgba(67,213,190,0.45)"]],
  "focus/ring": [[0, 0, 0, 2, "#FFFFFF"], [0, 0, 0, 4, "rgba(67,76,229,0.45)"]],
};
const gradients = {
  "assistant-fab": "radial-gradient(circle at 35% 30%, #FFFBC2 0%, #FFEE4D 45%, #F2D500 100%)",
  "assistant-border": "linear-gradient(90deg, #A9AEF0 0%, #C9C6E8 50%, #F0ED90 100%)",
  "card-graphite": "linear-gradient(135deg, #2E2D40 0%, #1A1926 60%, #0E0D16 100%)",
  "card-navy": "linear-gradient(160deg, #22324F 0%, #1B273F 50%, #0E1626 100%)",
  "brand-header": "linear-gradient(180deg, #FFE600 0%, #FFE600 85%, #FFF159 100%)",
  "media-scrim": "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.35) 100%)",
};

/* ================================================================ helpers */
const resolve = (ref) => {
  const [g, s] = ref.split("/");
  const v = primitives[g]?.[s];
  if (!v) throw new Error(`Primitiva inexistente: ${ref}`);
  return v;
};
const toRGBA = (c) => {
  if (c.startsWith("#")) {
    const h = c.slice(1);
    return { r: parseInt(h.slice(0, 2), 16) / 255, g: parseInt(h.slice(2, 4), 16) / 255, b: parseInt(h.slice(4, 6), 16) / 255, a: 1 };
  }
  const [r, g, b, a] = c.match(/[\d.]+/g).map(Number);
  return { r: r / 255, g: g / 255, b: b / 255, a: a ?? 1 };
};
const round = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Math.round(v * 1000) / 1000]));
const cssName = (s) => s.replace(/\//g, "-").replace(/\./g, "_");
const shadowCss = (list) => (list.length ? list.map(([x, y, b, s, c]) => `${x}px ${y}px ${b}px ${s}px ${c}`).join(", ") : "none");

/* ======================================================= figma variables */
const primVars = [];
for (const [g, steps] of Object.entries(primitives))
  for (const [s, v] of Object.entries(steps))
    primVars.push({ name: `color/${g}/${s}`, type: "COLOR", hex: v, values: { Value: round(toRGBA(v)) } });

const figma = {
  $schema: "meli-ds/figma-variables@1",
  meta: {
    name: "Meli DS",
    source: "Engenharia reversa — app Mercado Pago (Android) + mercadolivre.com.br",
    howToImport:
      "Para cada collection: figma.variables.createVariableCollection(name); renomeie o modo padrão para modes[0] e addMode() para os demais. Crie as variáveis com createVariable(name, collection, type) e setValueForMode. Valores {alias} devem virar figma.variables.createVariableAlias(variávelPrimitiva). textStyles -> figma.createTextStyle(); effectStyles -> figma.createEffectStyle().",
  },
  collections: [
    { name: "Primitives", modes: ["Value"], variables: primVars },
    {
      name: "Semantic",
      modes: MODES,
      variables: Object.entries(semantic).map(([name, refs]) => ({
        name: `color/${name}`,
        type: "COLOR",
        values: Object.fromEntries(MODES.map((m, i) => [m, { alias: `color/${refs[i]}`, resolved: resolve(refs[i]) }])),
      })),
    },
    { name: "Spacing", modes: ["Value"], variables: Object.entries(spacing).map(([k, v]) => ({ name: `space/${String(k).replace(".", "_")}`, type: "FLOAT", scopes: ["GAP", "WIDTH_HEIGHT"], values: { Value: v } })) },
    { name: "Radius", modes: ["Value"], variables: Object.entries(radius).map(([k, v]) => ({ name: `radius/${k}`, type: "FLOAT", scopes: ["CORNER_RADIUS"], values: { Value: v } })) },
    { name: "Size", modes: ["Value"], variables: Object.entries(size).map(([k, v]) => ({ name: `size/${k}`, type: "FLOAT", scopes: ["WIDTH_HEIGHT"], values: { Value: v } })) },
  ],
  textStyles: Object.entries(textStyles).map(([name, [fam, fs, fw, lh, ls]]) => ({
    name,
    fontFamily: fam === "app" ? "Inter" : "Proxima Nova",
    fallbackFamily: fam === "app" ? "Inter" : "Roboto",
    fontWeight: fw,
    fontStyle: { 300: "Light", 400: "Regular", 500: "Medium", 600: "Semi Bold", 700: "Bold" }[fw],
    fontSize: fs,
    lineHeight: { unit: "PIXELS", value: lh },
    letterSpacing: { unit: "PIXELS", value: ls },
  })),
  effectStyles: Object.entries(shadows).map(([name, list]) => ({
    name,
    effects: list.map(([x, y, b, s, c]) => ({ type: "DROP_SHADOW", offset: { x, y }, radius: b, spread: s, color: round(toRGBA(c)), visible: true, blendMode: "NORMAL" })),
  })),
  gradients,
};
writeFileSync(join(OUT, "figma-variables.json"), JSON.stringify(figma, null, 2));

/* ================================================================== DTCG */
const dtcg = { color: {}, semantic: {}, space: {}, radius: {}, size: {}, typography: {}, shadow: {}, gradient: {} };
for (const [g, steps] of Object.entries(primitives))
  dtcg.color[g] = Object.fromEntries(Object.entries(steps).map(([s, v]) => [s, { $type: "color", $value: v }]));
MODES.forEach((m, i) => {
  const key = m.toLowerCase().replace(" ", "-");
  dtcg.semantic[key] = {};
  for (const [name, refs] of Object.entries(semantic)) {
    const path = name.split("/");
    let node = dtcg.semantic[key];
    path.slice(0, -1).forEach((p) => (node = node[p] ??= {}));
    node[path.at(-1)] = { $type: "color", $value: `{color.${refs[i].replace("/", ".")}}` };
  }
});
for (const [k, v] of Object.entries(spacing)) dtcg.space[k] = { $type: "dimension", $value: `${v}px` };
for (const [k, v] of Object.entries(radius)) dtcg.radius[k] = { $type: "dimension", $value: `${v}px` };
for (const [k, v] of Object.entries(size)) dtcg.size[k.replace("/", "-")] = { $type: "dimension", $value: `${v}px` };
for (const [k, [fam, fs, fw, lh, ls]] of Object.entries(textStyles))
  dtcg.typography[k.replace("/", "-")] = { $type: "typography", $value: { fontFamily: fonts[fam], fontSize: `${fs}px`, fontWeight: fw, lineHeight: `${lh}px`, letterSpacing: `${ls}px` } };
for (const [k, list] of Object.entries(shadows))
  dtcg.shadow[k.replace("/", "-")] = { $type: "shadow", $value: list.map(([x, y, b, s, c]) => ({ offsetX: `${x}px`, offsetY: `${y}px`, blur: `${b}px`, spread: `${s}px`, color: c })) };
for (const [k, v] of Object.entries(gradients)) dtcg.gradient[k] = { $type: "gradient", $value: v };
writeFileSync(join(OUT, "tokens.dtcg.json"), JSON.stringify(dtcg, null, 2));

/* =================================================================== CSS */
const L = ["/* Gerado por tokens/build.mjs — não edite manualmente. */", ":root {"];
for (const [g, steps] of Object.entries(primitives))
  for (const [s, v] of Object.entries(steps)) L.push(`  --meli-${g}-${s}: ${v};`);
for (const [k, v] of Object.entries(spacing)) L.push(`  --space-${cssName(String(k))}: ${v}px;`);
for (const [k, v] of Object.entries(radius)) L.push(`  --radius-${k}: ${v}px;`);
for (const [k, v] of Object.entries(size)) L.push(`  --size-${cssName(k)}: ${v}px;`);
L.push(`  --font-app: ${fonts.app};`, `  --font-web: ${fonts.web};`);
for (const [k, [fam, fs, fw, lh, ls]] of Object.entries(textStyles)) {
  const n = cssName(k);
  // --font-scale (padrão 1) permite reduzir/ampliar toda a tipografia de uma superfície sem mexer nos tokens
  L.push(`  --type-${n}: ${fw} calc(${fs}px * var(--font-scale, 1))/calc(${lh}px * var(--font-scale, 1)) var(--font-${fam});`, `  --type-${n}-tracking: ${ls}px;`);
}
for (const [k, list] of Object.entries(shadows)) L.push(`  --shadow-${cssName(k)}: ${shadowCss(list)};`);
for (const [k, v] of Object.entries(gradients)) L.push(`  --gradient-${k}: ${v};`);
L.push("}");
MODES.forEach((m, i) => {
  const sel = m.toLowerCase().replace(" ", "-");
  L.push("", `${i === 0 ? ":root, " : ""}[data-theme="${sel}"] {`);
  for (const [name, refs] of Object.entries(semantic)) L.push(`  --color-${cssName(name)}: var(--meli-${refs[i].replace("/", "-")});`);
  L.push(`  --font-base: var(--font-${m.startsWith("ML") ? "web" : "app"});`, "}");
});
writeFileSync(join(OUT, "tokens.css"), L.join("\n") + "\n");

/* ======================================== script Plugin API (use_figma) */
// Autocontido: cole/execute no contexto do arquivo Figma (MCP use_figma ou plugin "Scripter").
const importer = `// Gerado por tokens/build.mjs — cria Variables, Text Styles e Effect Styles do Meli DS.
const DATA = ${JSON.stringify({ collections: figma.collections, textStyles: figma.textStyles, effectStyles: figma.effectStyles })};
const byName = {};
for (const col of DATA.collections) {
  const c = figma.variables.createVariableCollection(col.name);
  c.renameMode(c.modes[0].modeId, col.modes[0]);
  const modeIds = { [col.modes[0]]: c.modes[0].modeId };
  for (const m of col.modes.slice(1)) modeIds[m] = c.addMode(m);
  for (const v of col.variables) {
    const variable = figma.variables.createVariable(v.name, c, v.type);
    if (v.scopes) variable.scopes = v.scopes;
    for (const [mode, val] of Object.entries(v.values)) {
      const value = val && val.alias ? figma.variables.createVariableAlias(byName[val.alias]) : val;
      variable.setValueForMode(modeIds[mode], value);
    }
    byName[v.name] = variable;
  }
}
const loaded = new Set();
for (const t of DATA.textStyles) {
  let font = { family: t.fontFamily, style: t.fontStyle };
  try { await figma.loadFontAsync(font); } catch (e) { font = { family: "Inter", style: t.fontStyle }; await figma.loadFontAsync(font); }
  const s = figma.createTextStyle();
  s.name = t.name; s.fontName = font; s.fontSize = t.fontSize; s.lineHeight = t.lineHeight; s.letterSpacing = t.letterSpacing;
}
for (const e of DATA.effectStyles) {
  const s = figma.createEffectStyle();
  s.name = e.name; s.effects = e.effects;
}
return "Meli DS: " + Object.keys(byName).length + " variables, " + DATA.textStyles.length + " text styles, " + DATA.effectStyles.length + " effect styles";
`;
writeFileSync(join(OUT, "figma-import.generated.js"), importer);

console.log(`✔ ${primVars.length} primitivas, ${Object.keys(semantic).length} semânticas × ${MODES.length} modos, ${Object.keys(textStyles).length} text styles, ${Object.keys(shadows).length} effects`);
