import type { Meta, StoryObj } from "@storybook/react";
import { ChevronLeft, KeyRound, LayoutGrid, ScanLine, Nfc, Search, Copy } from "lucide-react";
import { IconButton } from "./IconButton";

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { icon: <ChevronLeft size={22} />, "aria-label": "Voltar" },
  parameters: { docs: { description: { component: "Botão quadrado 40px (raio 12) com fundo tint. Usado em Voltar, QR Code, Copiar e no atalho \"Chaves\" com indicador de alerta." } } },
};
export default meta;
type S = StoryObj<typeof IconButton>;

export const Voltar: S = {};
export const ComLabelEBadge: S = { name: "Com label + badge (Chaves)", args: { icon: <KeyRound size={20} />, label: "Chaves", badge: true } };
export const Surface: S = { args: { variant: "surface", icon: <Nfc size={20} /> } };
export const Galeria: S = {
  render: () => (
    <div className="doc-row">
      <IconButton icon={<ChevronLeft size={22} />} aria-label="Voltar" />
      <IconButton icon={<KeyRound size={20} />} label="Chaves" badge />
      <IconButton icon={<LayoutGrid size={20} />} aria-label="Mais" />
      <IconButton size="lg" icon={<ScanLine size={22} />} aria-label="Ler QR" />
      <IconButton icon={<Copy size={20} />} aria-label="Copiar" />
      <IconButton variant="surface" icon={<Nfc size={20} />} aria-label="Aproximar" />
      <div style={{ background: "var(--meli-yellow-500)", padding: 8, borderRadius: 12 }}>
        <IconButton variant="brand" icon={<Search size={20} />} aria-label="Buscar" badge={2} />
      </div>
    </div>
  ),
};
