import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BottomNav, type NavKey } from "./BottomNav";
import { AppHeader } from "./AppHeader";
import mpLogo from "../../prototype/assets/mercadopago-logo.png";

const meta: Meta = {
  title: "Components/Navegação",
  tags: ["autodocs"],
  parameters: { docs: { description: { component: "Header amarelo (home; botões brand em branco 70%) e Bottom Navigation de 5 itens com o Pix como FAB central elevado (teal quando inativo, anel índigo quando ativo). A tab ativa tem o marcador colado na borda superior; ícone e label ficam a 5px." } } },
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
export const HeaderComLogo: StoryObj = {
  name: "Header · avatar com logo (como no app)",
  render: () => <div style={{ width: 375 }}><AppHeader name="Felipe" notifications={7} avatar={<img src={mpLogo} alt="Mercado Pago" width={34} height={34} />} /></div>,
};
