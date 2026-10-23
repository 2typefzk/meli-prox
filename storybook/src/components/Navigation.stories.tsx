import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BottomNav, type NavKey } from "./BottomNav";
import { AppHeader } from "./AppHeader";

const meta: Meta = {
  title: "Components/Navegação",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Header amarelo (home) e Bottom Navigation de 5 itens com o Pix como FAB central elevado (teal quando inativo, anel índigo quando ativo)." } } },
};
export default meta;

export const BottomNavigation: StoryObj = {
  render: () => {
    const [k, setK] = useState<NavKey>("cartoes");
    return <div style={{ width: 375, paddingTop: 40 }}><BottomNav active={k} onChange={setK} /></div>;
  },
};
export const BottomNavPixAtivo: StoryObj = { render: () => <div style={{ width: 375, paddingTop: 40 }}><BottomNav active="pix" /></div> };
export const Header: StoryObj = { render: () => <div style={{ width: 375 }}><AppHeader name="Felipe" notifications={2} /></div> };
