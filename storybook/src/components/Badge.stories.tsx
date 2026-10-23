import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = { title: "Components/Badge", component: Badge, tags: ["autodocs"], args: { children: "Grátis", tone: "positive" } };
export default meta;
type S = StoryObj<typeof Badge>;

export const Positive: S = {};
export const Info: S = { args: { tone: "info", children: "Configurar" } };
export const MeliPlus: S = { args: { tone: "meli-plus", children: "meli+" } };
export const Todos: S = {
  render: () => (
    <div className="doc-row">
      <Badge>Grátis</Badge><Badge>Sem taxas</Badge><Badge tone="info">Configurar</Badge>
      <Badge tone="meli-plus">meli+</Badge><Badge tone="negative">Vencido</Badge><Badge tone="neutral">Em breve</Badge>
      <Badge emphasis="quiet">↑ 105% do CDI</Badge><Badge tone="info" emphasis="quiet">Novo</Badge>
    </div>
  ),
};
