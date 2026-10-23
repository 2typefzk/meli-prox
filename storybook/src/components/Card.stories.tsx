import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRight } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";

const meta: Meta<typeof Card> = { title: "Components/Card", component: Card, tags: ["autodocs"], decorators: [(S) => <div style={{ width: 343 }}><S /></div>] };
export default meta;
type S = StoryObj<typeof Card>;

export const Outlined: S = {
  render: () => (
    <Card variant="outlined" style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <p className="t-body" style={{ flex: 1 }}>Peça a Linha de Crédito para comprar e pagar em até 24x sem cartão</p>
      <Button size="sm">Pedir</Button>
    </Card>
  ),
};
export const Saldo: S = {
  name: "Elevated (Saldo)",
  render: () => (
    <Card variant="elevated" style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="t-h2">R$ 0</span>
        <a className="t-body t-accent" style={{ fontWeight: 600, display: "inline-flex", gap: 4, alignItems: "center" }}>Extrato <ArrowRight size={16} /></a>
      </div>
      <Badge emphasis="quiet">↑ 105% do CDI</Badge>
      <div style={{ background: "var(--color-feedback-positive-soft)", borderRadius: 12, padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
        <span className="t-caption" style={{ flex: 1 }}>Sua conta já rende 105% do CDI com Meli+. Aproveite!</span>
        <Button size="sm">Depositar</Button>
      </div>
    </Card>
  ),
};
export const Tint: S = { render: () => <Card variant="tint"><b className="t-h6">Mercado Livre</b><p className="t-caption t-secondary">Descontos exclusivos</p></Card> };
export const Dark: S = {
  name: "Dark (promo cartão)",
  render: () => (
    <Card variant="dark" style={{ display: "grid", gap: 16, minHeight: 150 }}>
      <span className="t-h4">Sem anuidade.<br />Saiba como pedir seu cartão</span>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <span className="t-caption">Até 18x sem juros no Mercado Livre</span>
        <Button size="sm">Pedir cartão</Button>
      </div>
    </Card>
  ),
};
