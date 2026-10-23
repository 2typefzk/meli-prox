import type { Meta, StoryObj } from "@storybook/react";
import { KeyRound, LayoutGrid, ScanLine, ChevronLeft, ArrowRight, Eye, Copy, Globe, Wallet, Lock, XCircle, Gift, Truck, ShieldCheck, BarChart3, Store, Percent, Smartphone, Sparkles, X, ArrowUpRight } from "lucide-react";
import { Button, IconButton, TextField, BottomNav, AssistantFab, InfoBanner, ActionTile, ListItem, ListDivider, Badge, Checkbox, Card, AppHeader, PaymentCard, PageDots } from "../components";

const meta: Meta = {
  title: "Patterns/Telas do app",
  parameters: { layout: "centered", docs: { description: { component: "Recomposição das telas de referência usando apenas componentes e tokens do DS — serve como teste de cobertura do sistema." } } },
};
export default meta;
type S = StoryObj;

const Phone = ({ children, bg }: { children: React.ReactNode; bg?: string }) => (
  <div className="doc-phone" style={{ height: 760, display: "flex", flexDirection: "column", background: bg }}>{children}</div>
);
const Body = ({ children }: { children: React.ReactNode }) => <div style={{ flex: 1, overflow: "auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 24 }}>{children}</div>;
const Fab = () => <div style={{ position: "absolute", right: 16, bottom: 96 }}><AssistantFab /></div>;

export const PixInicio: S = {
  name: "Pix — início (empty state)",
  render: () => (
    <Phone>
      <Body>
        <div className="m-screen-head">
          <h1 className="t-h1">Pix</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <IconButton icon={<KeyRound size={20} />} label="Chaves" badge />
            <IconButton icon={<LayoutGrid size={20} />} aria-label="Mais opções" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <TextField placeholder="Informe nome" />
          <IconButton size="lg" icon={<ScanLine size={22} />} aria-label="Ler QR Code" />
        </div>
        <div style={{ textAlign: "center", display: "grid", gap: 8 }}>
          <h2 className="t-h4">Faça seu primeiro Pix</h2>
          <p className="t-body-lg t-secondary">Vamos guardar seus contatos aqui para facilitar os próximos envios.</p>
        </div>
      </Body>
      <BottomNav active="pix" />
    </Phone>
  ),
};

export const ConfiraConta: S = {
  name: "Pix — confira a conta",
  render: () => (
    <Phone>
      <Body>
        <IconButton className="m-back" icon={<ChevronLeft size={22} />} aria-label="Voltar" />
        <h1 className="t-h2">Confira a conta</h1>
        <div><div className="t-body t-secondary">Nome</div><div className="t-h3">Felipe Marinelli</div></div>
        <InfoBanner>Este é seu primeiro Pix para esta conta. Verifique se o nome é da pessoa certa.</InfoBanner>
        <div><div className="t-body t-secondary">Chave Pix</div><div className="t-h5">123.456.789-09</div></div>
        <div><div className="t-body t-secondary">CPF</div><div className="t-h5">***.764.098-**</div></div>
        <div><div className="t-body t-secondary">Banco</div><div className="t-h5">Itaú Unibanco S.A.</div></div>
      </Body>
      <Fab />
      <div style={{ padding: 16, display: "grid", gap: 12 }}>
        <Button fullWidth>Continuar</Button>
        <Button fullWidth variant="secondary">Alterar chave</Button>
      </div>
    </Phone>
  ),
};

export const InsiraValor: S = {
  name: "Pix — insira o valor",
  render: () => (
    <Phone>
      <Body>
        <IconButton className="m-back" icon={<ChevronLeft size={22} />} aria-label="Voltar" />
        <h1 className="t-h2">Insira o valor</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <span className="m-avatar" style={{ border: "1px solid var(--color-border-default)", color: "#EC7000", fontSize: 12 }}>itaú</span>
          <div>
            <div className="t-h4">Felipe Marinelli</div>
            <div className="t-body-lg">Chave Pix: 123.456.789-09</div>
            <a className="t-body t-accent" style={{ fontWeight: 600, display: "inline-flex", gap: 6, alignItems: "center" }}>Adicionar mensagem <ArrowRight size={16} /></a>
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          <div className="t-display" style={{ color: "var(--meli-lavender-600)" }}>R$ 0,00</div>
          <div className="t-body t-secondary" style={{ display: "flex", gap: 6, alignItems: "center" }}>Saldo disponível: <b style={{ color: "var(--color-text-primary)" }}>R$ 0,00</b> <Eye size={16} className="t-accent" /></div>
        </div>
        <Button fullWidth disabled>Continuar</Button>
      </Body>
    </Phone>
  ),
};

export const Cartoes: S = {
  name: "Cartões — débito virtual (bottom sheet)",
  render: () => (
    <Phone bg="var(--color-bg-subtle)">
      <div style={{ padding: "24px 16px 0", display: "flex", justifyContent: "space-between" }}>
        <h1 className="t-h1">Cartões</h1>
        <IconButton variant="surface" icon={<Smartphone size={20} />} aria-label="Aproximar" />
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16, height: 70, overflow: "hidden" }}><PaymentCard /></div>
      <div style={{ flex: 1, background: "var(--color-surface-default)", borderRadius: "28px 28px 0 0", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ width: 32, height: 4, borderRadius: 4, background: "var(--color-text-tertiary)", alignSelf: "center" }} />
        <div><h2 className="t-h3">Débito virtual</h2><div className="t-body-lg t-secondary">Mercado Pago</div></div>
        <Card variant="outlined" style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 20 }}>
          <span className="t-h3" style={{ flex: 1 }}>•••• 6872</span>
          <IconButton icon={<Copy size={20} />} aria-label="Copiar" />
          <Button size="md" variant="secondary">Ver dados</Button>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          <ActionTile icon={<Globe size={24} />} label="Compras internacionais" tag="Sem taxas" />
          <ActionTile icon={<Wallet size={24} />} label="Carteiras digitais" />
          <ActionTile icon={<Lock size={24} />} label="Bloquear cartão" />
          <ActionTile icon={<XCircle size={24} />} label="Cancelar e criar novo" />
        </div>
      </div>
      <BottomNav active="cartoes" />
    </Phone>
  ),
};

export const HomeConta: S = {
  name: "Conta — home",
  render: () => (
    <Phone bg="var(--color-bg-subtle)">
      <div style={{ flex: 1, overflow: "auto" }}>
        <AppHeader name="Felipe" notifications={2} />
        <div style={{ padding: 16, display: "grid", gap: 24 }}>
          <Card variant="elevated" style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="t-h2">R$ 0</span>
              <a className="t-body t-accent" style={{ fontWeight: 600, display: "inline-flex", gap: 4, alignItems: "center" }}>Extrato <ArrowRight size={16} /></a>
            </div>
            <InfoBanner tone="positive" action={<Button size="sm">Depositar</Button>}>Sua conta já rende 105% do CDI com Meli+.</InfoBanner>
          </Card>
          <section style={{ display: "grid", gap: 12 }}>
            <h2 className="t-h4">Ferramentas de venda</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              <ActionTile compact icon={<Percent size={20} />} label="Simulador de taxas" />
              <ActionTile compact icon={<Smartphone size={20} />} label="Point Tap" />
              <ActionTile compact icon={<ArrowUpRight size={20} />} label="Link de pagamento" />
              <ActionTile compact icon={<Store size={20} />} label="Point" />
            </div>
          </section>
          <Card variant="dark" style={{ display: "grid", gap: 16 }}>
            <span className="t-h4">Sem anuidade.<br />Saiba como pedir seu cartão</span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 8 }}>
              <span className="t-caption">Até 18x sem juros no Mercado Livre</span>
              <Button size="sm">Pedir cartão</Button>
            </div>
          </Card>
        </div>
      </div>
      <BottomNav active="conta" />
    </Phone>
  ),
};

export const MenuMais: S = {
  name: "Mais — menu",
  render: () => (
    <Phone>
      <div style={{ flex: 1, overflow: "auto" }}>
        <div className="m-app-header" style={{ paddingBottom: 20 }}>
          <div className="m-app-header__row"><span className="m-avatar">FM</span><span className="t-h4">Felipe</span></div>
          <div style={{ background: "var(--color-brand-meli-plus)", color: "#fff", borderRadius: 12, padding: "8px 12px", display: "flex", gap: 8, alignItems: "center" }}>
            <b>meli+</b><span className="t-caption" style={{ flex: 1 }}>Ganhe mais dinheiro com seus Cofrinhos</span><ArrowRight size={16} />
          </div>
        </div>
        <div style={{ margin: 16, padding: 2, borderRadius: 18, background: "var(--gradient-assistant-border)" }}>
          <div style={{ background: "var(--color-surface-default)", borderRadius: 16, padding: 14, display: "flex", gap: 10 }}>
            <Sparkles size={20} className="t-accent" />
            <div><div className="t-h5">Mago, seu assistente</div><div className="t-caption t-secondary">Transfira de forma rápida e segura.</div></div>
          </div>
        </div>
        <ul className="m-list">
          <ListItem icon={<ShieldCheck size={20} />} label="Segurança" />
          <ListDivider />
          <ListItem icon={<BarChart3 size={20} />} label="Gestão" />
          <ListItem icon={<Store size={20} />} label="Conta Negócio" />
          <ListItem icon={<Percent size={20} />} label="Taxas e parcelas" />
          <ListItem icon={<Smartphone size={20} />} label="Aproxime e pague" trailing={<Badge tone="info">Configurar</Badge>} />
          <ListItem icon={<Globe size={20} />} label="Transferência entre países" trailing={<Badge>Grátis</Badge>} />
        </ul>
      </div>
      <BottomNav active="mais" />
    </Phone>
  ),
};

export const AnaliseDark: S = {
  name: "Cartão de crédito — análise (dark)",
  globals: { theme: "mp-dark" },
  render: () => (
    <Phone>
      <Body>
        <IconButton className="m-back" icon={<ChevronLeft size={22} />} aria-label="Voltar" style={{ background: "var(--meli-indigo-800)", color: "#fff" }} />
        <div style={{ display: "grid", gap: 8 }}>
          <h1 className="t-h2">Vamos continuar analisando seu perfil</h1>
          <p className="t-body-lg t-secondary">Se aprovado em até 6 meses, te avisaremos e o cartão será seu automaticamente.</p>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Gift size={24} />
          <div className="t-body-lg"><div className="t-secondary">Benefícios do cartão</div><b>• Até 5% de cashback</b> <Badge tone="meli-plus">meli+</Badge><br /><b>• Até 18x sem juros no Mercado Livre</b><br /><b>• Anuidade grátis</b></div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <Truck size={24} />
          <div className="t-body-lg" style={{ flex: 1 }}><div className="t-secondary">Envio do cartão físico</div><b>Rua Exemplo 123, São Paulo – SP</b></div>
          <Button variant="on-dark" size="md">Alterar</Button>
        </div>
      </Body>
      <div style={{ padding: 16, display: "grid", gap: 12 }}>
        <Checkbox defaultChecked>Autorizo a consulta ao SCR e aceito os <a href="#">Termos e condições do produto</a></Checkbox>
        <Button fullWidth loading />
        <Button fullWidth variant="transparent" style={{ color: "#fff" }}>Enviar dados depois</Button>
      </div>
    </Phone>
  ),
};

export const Onboarding: S = {
  name: "Cartões — onboarding (carrossel)",
  render: () => (
    <Phone bg="var(--color-bg-subtle)">
      <Body>
        <h1 className="t-h1">Cartões</h1>
        <div style={{ position: "relative", height: 420, borderRadius: 24, overflow: "hidden", background: "var(--gradient-media-scrim), linear-gradient(135deg,#8a7a63,#3d3a36)", color: "#fff", padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span className="t-h3">Aproxime seu celular e pague com um toque</span>
            <IconButton icon={<X size={20} />} aria-label="Fechar" style={{ background: "rgba(30,30,36,.8)", color: "#fff" }} />
          </div>
          <Button fullWidth>Configurar celular</Button>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}><PageDots count={6} active={0} /></div>
      </Body>
      <BottomNav active="cartoes" />
    </Phone>
  ),
};
