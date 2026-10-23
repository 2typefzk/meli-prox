import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRight } from "lucide-react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Continuar", variant: "primary", size: "lg" },
  parameters: { docs: { description: { component: "CTA principal do app. Altura 48px, raio 12px, label 16/600. Em telas de fluxo ocupa a largura total (margem 16px) e fica ancorado no rodapé; o secundário (tint) vai logo abaixo, com 12px de gap." } } },
};
export default meta;
type S = StoryObj<typeof Button>;

export const Primary: S = {};
export const Secondary: S = { args: { variant: "secondary", children: "Alterar chave" } };
export const Transparent: S = { args: { variant: "transparent", children: "Adicionar mensagem", icon: undefined } };
export const OnDark: S = { args: { variant: "on-dark", size: "md", children: "Alterar" }, globals: { theme: "mp-dark" } };
export const Disabled: S = { args: { disabled: true } };
export const Loading: S = { args: { loading: true } };

export const Estados: S = {
  name: "Matriz de estados",
  render: () => (
    <table className="doc-table" style={{ maxWidth: 760 }}>
      <thead><tr><th>Variante</th><th>Default</th><th>Hover / Pressed</th><th>Disabled</th></tr></thead>
      <tbody>
        {(["primary", "secondary", "transparent"] as const).map((v) => (
          <tr key={v}>
            <td>{v}</td>
            <td><Button variant={v} size="md">Continuar</Button></td>
            <td className="t-caption t-secondary">passe o mouse / clique</td>
            <td><Button variant={v} size="md" disabled>Continuar</Button></td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Tamanhos: S = {
  render: () => (
    <div className="doc-row">
      <Button size="lg">Large 48</Button>
      <Button size="md">Medium 40</Button>
      <Button size="sm">Small 32</Button>
      <Button size="sm" variant="secondary" icon={<ArrowRight size={14} />}>Depositar</Button>
    </div>
  ),
};

export const FooterDeFluxo: S = {
  name: "Rodapé de fluxo (Continuar + Alterar)",
  render: () => (
    <div style={{ width: 343, display: "grid", gap: 12 }}>
      <Button fullWidth>Continuar</Button>
      <Button fullWidth variant="secondary">Alterar chave</Button>
    </div>
  ),
};
