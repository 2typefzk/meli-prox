import type { Meta, StoryObj } from "@storybook/react";
import { Globe, Wallet, Lock, XCircle, Calculator, Smartphone, Link2, CreditCard, ShieldCheck, BarChart3, Store, Percent, Package, ShoppingBag } from "lucide-react";
import { ActionTile } from "./ActionTile";
import { ListItem, ListDivider } from "./ListItem";
import { InfoBanner } from "./InfoBanner";
import { Checkbox } from "./Checkbox";
import { AssistantFab } from "./AssistantFab";
import { PageDots } from "./PageDots";
import { TransactionItem } from "./TransactionItem";
import { PaymentCard } from "./PaymentCard";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { SectionHeader } from "./SectionHeader";
import { SegmentedControl } from "./SegmentedControl";
import { ReceiptRow, ReceiptSection, ZigzagDivider } from "./Receipt";
import { Switch } from "./Switch";
import { useState } from "react";

const meta: Meta = { title: "Components/Coleção", tags: ["autodocs"] };
export default meta;
type S = StoryObj;

export const ActionTiles: S = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 108px)", gap: 12 }}>
      <ActionTile icon={<Globe size={26} />} label="Compras internacionais" tag="Sem taxas" />
      <ActionTile icon={<Wallet size={26} />} label="Carteiras digitais" />
      <ActionTile icon={<Lock size={26} />} label="Bloquear cartão" />
      <ActionTile icon={<XCircle size={26} />} label="Cancelar e criar novo" />
    </div>
  ),
};
export const ToolTiles: S = {
  name: "ActionTile compacto (Ferramentas de venda)",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 76px)", gap: 8 }}>
      <ActionTile compact icon={<Calculator size={20} />} label="Simulador de taxas" />
      <ActionTile compact icon={<Smartphone size={20} />} label="Point Tap" />
      <ActionTile compact icon={<Link2 size={20} />} label="Link de pagamento" />
      <ActionTile compact icon={<CreditCard size={20} />} label="Point" />
    </div>
  ),
};
export const Lista: S = {
  name: "ListItem (menu Mais)",
  render: () => (
    <ul className="m-list" style={{ width: 360 }}>
      <ListItem icon={<ShieldCheck size={20} />} label="Segurança" />
      <ListDivider />
      <ListItem icon={<BarChart3 size={20} />} label="Gestão" />
      <ListItem icon={<Store size={20} />} label="Conta Negócio" />
      <ListItem icon={<Percent size={20} />} label="Taxas e parcelas" />
      <ListItem icon={<Package size={20} />} label="Aproxime e pague" trailing={<Badge tone="info">Configurar</Badge>} />
      <ListItem icon={<Globe size={20} />} label="Transferência entre países" trailing={<Badge>Grátis</Badge>} />
    </ul>
  ),
};
export const Banner: S = {
  name: "InfoBanner",
  render: () => (
    <div style={{ width: 343, display: "grid", gap: 12 }}>
      <InfoBanner>Este é seu primeiro Pix para esta conta. Verifique se o nome é da pessoa certa.</InfoBanner>
      <InfoBanner tone="positive" action={<Button size="sm">Depositar</Button>}>Sua conta já rende 105% do CDI.</InfoBanner>
    </div>
  ),
};
export const CheckboxStory: S = {
  name: "Checkbox",
  render: () => (
    <div style={{ width: 343, display: "grid", gap: 16 }}>
      <Checkbox defaultChecked>Autorizo a consulta ao SCR e aceito os <a href="#">Termos e condições</a></Checkbox>
      <Checkbox>Lembrar este dispositivo</Checkbox>
      <Checkbox disabled>Opção indisponível</Checkbox>
    </div>
  ),
};
export const Assistente: S = { name: "AssistantFab (IA)", render: () => <AssistantFab /> };
export const Paginacao: S = { name: "PageDots", render: () => <PageDots count={6} active={0} /> };
export const Transacoes: S = {
  name: "TransactionItem",
  render: () => (
    <div style={{ width: 343 }}>
      <TransactionItem thumb={<ShoppingBag size={18} />} title="Mercado Livre" kind="Compra" method="Via transferência" amount="- R$ 215,99" date="15/out" />
      <TransactionItem thumb={<ShoppingBag size={18} />} title="Mercado Livre" kind="Compra" method="Mastercard crédito" methodIcon={<CreditCard size={12} />} amount="- R$ 49,99" date="14/out" />
    </div>
  ),
};
export const Cartoes: S = {
  name: "PaymentCard",
  render: () => <div className="doc-row"><PaymentCard /><PaymentCard type="credit" label="mercado pago" finish="graphite" last4="1029" /></div>,
};

export const SectionHeaderStory: S = {
  name: "SectionHeader",
  render: () => (
    <div style={{ width: 343, display: "grid", gap: 24 }}>
      <SectionHeader title="Empréstimos" link="Consultar" />
      <SectionHeader title="Ferramentas" />
    </div>
  ),
};

export const SegmentedControlStory: S = {
  name: "SegmentedControl",
  render: () => {
    const [v, setV] = useState<"pay" | "transfer">("pay");
    return (
      <div style={{ width: 343 }}>
        <SegmentedControl aria-label="Modo de aproximação" value={v} onChange={setV}
          options={[{ value: "pay", label: "Pagar" }, { value: "transfer", label: "Transferir ou Receber" }]} />
      </div>
    );
  },
};

export const ReceiptStory: S = {
  name: "Receipt (Row · Section · Zigzag)",
  render: () => (
    <div style={{ width: 343 }}>
      <ReceiptRow label="Valor" value="R$ 25,00" />
      <ReceiptRow label="Valor total" value="R$ 25,00" emphasis="total" />
      <ZigzagDivider />
      <ReceiptSection title="Origem" lines={["Nome: Felipe Marinelli", "CPF: ***.456.789-**"]} divider />
      <ReceiptSection title="Destino" lines={["Nome: Giuliana Cecilio", "Instituição: Mercado Pago"]} />
    </div>
  ),
};

export const SwitchStory: S = {
  name: "Switch",
  render: () => {
    const [on, setOn] = useState(false);
    return <div style={{ width: 343 }}><Switch label="Bloco Aproxime na Home" description="Mostra os atalhos de aproximação" checked={on} onChange={setOn} /></div>;
  },
};
