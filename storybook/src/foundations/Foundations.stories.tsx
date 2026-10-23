import type { Meta, StoryObj } from "@storybook/react";
import tokens from "../../../tokens/figma-variables.json";

const meta: Meta = { title: "Foundations/Tokens", parameters: { layout: "padded" } };
export default meta;
type S = StoryObj;

const col = (name: string) => tokens.collections.find((c) => c.name === name)!;

const Swatch = ({ name, value, sub }: { name: string; value: string; sub?: string }) => (
  <div className="doc-swatch">
    <div className="doc-swatch__chip"><div style={{ background: value }} /></div>
    <div className="doc-swatch__meta"><b>{name}</b><code>{value}</code>{sub && <code>{sub}</code>}</div>
  </div>
);

export const Primitivas: S = {
  name: "Cores · Primitivas",
  render: () => {
    const groups: Record<string, { name: string; hex: string }[]> = {};
    for (const v of col("Primitives").variables as { name: string; hex: string }[]) {
      const [, g, s] = v.name.split("/");
      (groups[g] ??= []).push({ name: s, hex: v.hex });
    }
    return (
      <>
        {Object.entries(groups).map(([g, list]) => (
          <section key={g}>
            <h3 className="doc-h">{g}</h3>
            <div className="doc-grid">{list.map((c) => <Swatch key={c.name} name={`${g}/${c.name}`} value={c.hex} />)}</div>
          </section>
        ))}
      </>
    );
  },
};

export const Semanticas: S = {
  name: "Cores · Semânticas (3 modos)",
  render: () => {
    const c = col("Semantic");
    return (
      <table className="doc-table">
        <thead><tr><th>Token</th>{c.modes.map((m) => <th key={m}>{m}</th>)}</tr></thead>
        <tbody>
          {(c.variables as { name: string; values: Record<string, { alias: string; resolved: string }> }[]).map((v) => (
            <tr key={v.name}>
              <td><code>{v.name}</code></td>
              {c.modes.map((m) => (
                <td key={m}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: v.values[m].resolved, border: "1px solid rgba(0,0,0,.1)" }} />
                    <code style={{ fontSize: 11 }}>{v.values[m].alias.replace("color/", "")}</code>
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};

export const Gradientes: S = {
  render: () => <div className="doc-grid">{Object.entries(tokens.gradients).map(([k, v]) => <Swatch key={k} name={k} value={v} sub="" />)}</div>,
};

export const Tipografia: S = {
  render: () => (
    <table className="doc-table">
      <thead><tr><th>Estilo</th><th>Amostra</th><th>Spec</th></tr></thead>
      <tbody>
        {tokens.textStyles.map((t) => (
          <tr key={t.name}>
            <td><code>{t.name}</code></td>
            <td style={{ font: `${t.fontWeight} ${t.fontSize}px/${t.lineHeight.value}px ${t.fontFamily === "Inter" ? "var(--font-app)" : "var(--font-web)"}`, letterSpacing: t.letterSpacing.value }}>
              {t.name.startsWith("display") || t.name.includes("price") ? "R$ 1.299,90" : t.name.startsWith("overline") ? "VIRTUAL" : "Faça seu primeiro Pix"}
            </td>
            <td className="t-caption t-secondary">{t.fontFamily} {t.fontStyle} · {t.fontSize}/{t.lineHeight.value} · ls {t.letterSpacing.value}px</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Espacamento: S = {
  name: "Espaçamento (base 4)",
  render: () => (
    <div style={{ display: "grid", gap: 8 }}>
      {(col("Spacing").variables as { name: string; values: { Value: number } }[]).map((v) => (
        <div key={v.name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <code style={{ width: 90 }}>{v.name}</code>
          <div style={{ width: v.values.Value, height: 16, background: "var(--color-action-primary-default)", borderRadius: 2 }} />
          <span className="t-caption t-secondary">{v.values.Value}px</span>
        </div>
      ))}
    </div>
  ),
};

export const Raios: S = {
  name: "Border radius",
  render: () => (
    <div className="doc-row">
      {(col("Radius").variables as { name: string; values: { Value: number } }[]).map((v) => (
        <div key={v.name} style={{ textAlign: "center" }}>
          <div style={{ width: 88, height: 88, borderRadius: Math.min(v.values.Value, 44), background: "var(--color-surface-tint)", border: "2px solid var(--color-action-primary-default)" }} />
          <div className="t-caption" style={{ marginTop: 6 }}><code>{v.name}</code> · {v.values.Value}px</div>
        </div>
      ))}
    </div>
  ),
};

export const Sombras: S = {
  name: "Sombras & glows",
  render: () => (
    <div className="doc-row" style={{ gap: 32, padding: 24, background: "var(--color-bg-subtle)", borderRadius: 16 }}>
      {tokens.effectStyles.map((e) => (
        <div key={e.name} style={{ textAlign: "center" }}>
          <div style={{ width: 120, height: 80, borderRadius: 12, background: "var(--color-surface-default)", boxShadow: `var(--shadow-${e.name.replace("/", "-")})` }} />
          <div className="t-caption" style={{ marginTop: 10 }}><code>{e.name}</code></div>
        </div>
      ))}
    </div>
  ),
};
