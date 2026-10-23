import type { Meta, StoryObj } from "@storybook/react";
import { ScanLine } from "lucide-react";
import { TextField } from "./TextField";
import { IconButton } from "./IconButton";

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: { placeholder: "Informe nome" },
  parameters: { docs: { description: { component: "Campo outlined 48px, borda 1px border/strong, raio 12. Foco: borda 2px índigo (sem glow). Erro: borda e helper em vermelho." } } },
  decorators: [(S) => <div style={{ width: 343 }}><S /></div>],
};
export default meta;
type S = StoryObj<typeof TextField>;

export const Default: S = {};
export const ComLabelEHelper: S = { args: { label: "Chave Pix", helper: "CPF, celular, e-mail ou chave aleatória", placeholder: "Informe chave" } };
export const Erro: S = { args: { label: "Chave Pix", defaultValue: "123.456.789", error: "Chave inválida. Confira e tente novamente." } };
export const Disabled: S = { args: { label: "Nome", defaultValue: "Felipe Marinelli", disabled: true } };
export const ComAcaoAoLado: S = {
  name: "Busca Pix + botão QR",
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <TextField placeholder="Informe chave" />
      <IconButton size="lg" icon={<ScanLine size={22} />} aria-label="Ler QR Code" />
    </div>
  ),
};
