import type { Meta, StoryObj } from "@storybook/react";
import { WebButton, WebHeader, ProductCard, WebFooter } from "./Web";

const meta: Meta = {
  title: "Web (Mercado Livre)/Componentes",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Componentes do marketplace web (Andes UI). Valores lidos do CSS de produção de mercadolivre.com.br: Proxima Nova, azul #3483FA, botão 48px/raio 6px, card raio 6px + elevation/1." } } },
  globals: { theme: "ml-light" },
};
export default meta;

export const Botoes: StoryObj = {
  name: "Botões (loud / quiet / disabled)",
  render: () => (
    <div style={{ width: 320, display: "grid", gap: 8 }}>
      <WebButton fullWidth>Comprar agora</WebButton>
      <WebButton hierarchy="quiet" fullWidth>Adicionar ao carrinho</WebButton>
      <WebButton fullWidth disabled>Sem estoque</WebButton>
    </div>
  ),
};

export const Header: StoryObj = { render: () => <WebHeader />, parameters: { layout: "fullscreen" } };

export const CardDeProduto: StoryObj<typeof ProductCard> = {
  name: "Card de produto (poly-card)",
  args: {
    title: "Colchão de Solteiro Violeta D20 088x188x12 Cinza Estampado",
    oldPrice: "299,90", price: "189", cents: "90", off: "36% OFF",
    installments: "em 10x R$ 18,99 sem juros", shipping: "Chegará grátis amanhã", full: true,
    pill: { label: "MAIS VENDIDO", tone: "orange" },
  },
  render: (a) => <ProductCard {...a} />,
};

export const Footer: StoryObj = { render: () => <WebFooter />, parameters: { layout: "fullscreen" } };
