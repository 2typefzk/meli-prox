import { useRef, useState } from "react";
import { ArrowRight, CircleX, CreditCard, Eye, EyeOff, Nfc, Percent, Search, Smartphone, Store, Wallet, Zap } from "lucide-react";
import { ActionTile, AppHeader, Button, SectionHeader, TransactionItem } from "../../src/components";
import { formatBRL, type Transaction } from "../data";
import { useDragScroll, usePullToRefresh, useScrolledPast } from "../hooks";
import { PayIllustration, TransferIllustration, type ApproachMode } from "./Approach";
import nubankLogo from "../assets/nubank-logo.png";
import mpLogo from "../assets/mercadopago-logo.png";

// Figma: Top > Tabs (19:53)
const TABS = [
  { key: "saldo", label: "Saldo" },
  { key: "cofrinhos", label: "Cofrinhos", value: 0, note: "Guarde dinheiro e renda 105% do CDI.", cta: "Criar cofrinho" },
  { key: "investimentos", label: "Investimentos", value: 0, note: "Comece a investir a partir de R$ 1.", cta: "Investir" },
  { key: "cripto", label: "Cripto", value: 0, note: "Compre Bitcoin e outras criptomoedas.", cta: "Comprar" },
] as const;

// Figma: Ferramentas > Tools (19:103). Ícones conforme o design.
const TOOLS = [
  { label: "Simulador de taxas", Icon: Percent },
  { label: "Point Tap", Icon: Smartphone },
  { label: "Link de pagamento", Icon: ArrowRight },
  { label: "Point", Icon: CreditCard },
  { label: "Taxas e parcelas", Icon: Store },
  { label: "QR ou Pix", Icon: Percent },
  { label: "Boleto", Icon: Percent },
  { label: "Planos de assinatura", Icon: Percent },
];

const METHOD_ICON = { transfer: Wallet, credit: CreditCard, pix: Zap, debit: CreditCard, nfc: Nfc };

export interface HomeProps {
  balance: number;
  transactions: Transaction[];
  hideBalance: boolean;
  onToggleBalance: () => void;
  onOpenApproach: (mode?: ApproachMode) => void;
  notify: (msg: string) => void;
  /** Configuração do protótipo: exibe o bloco "Aproximar" */
  showApproachBlock?: boolean;
  /** Card "Perto de mim" no bloco Aproximar (funcionalidade ligada em Mais) */
  onOpenNearby?: () => void;
}

/** Arte do card "Perto de mim": radar com contatos ao redor. */
function NearbyIllustration() {
  return (
    <svg viewBox="0 0 196 196" fill="none">
      <circle cx="98" cy="98" r="90" stroke="rgba(233,241,254,.18)" />
      <circle cx="98" cy="98" r="62" stroke="rgba(233,241,254,.24)" />
      <circle cx="98" cy="98" r="34" stroke="rgba(233,241,254,.32)" fill="rgba(67,76,229,.18)" />
      <circle cx="98" cy="98" r="7" fill="#fff" />
      <circle cx="98" cy="98" r="13" fill="rgba(255,255,255,.25)" />
      <circle cx="150" cy="70" r="11" fill="#FFE600" stroke="#fff" strokeWidth="2" />
      <circle cx="58" cy="128" r="9" fill="#00BCB4" stroke="#fff" strokeWidth="2" />
      <circle cx="128" cy="150" r="7" fill="rgba(233,241,254,.7)" />
      <circle cx="46" cy="64" r="6" fill="rgba(233,241,254,.5)" />
    </svg>
  );
}

export function Home({ balance, transactions, hideBalance, onToggleBalance, onOpenApproach, notify, showApproachBlock = false, onOpenNearby }: HomeProps) {
  const [tab, setTab] = useState(0);
  const [bankBanner, setBankBanner] = useState(true);
  const soon = (what: string) => () => notify(`${what}: disponível em breve no protótipo`);
  const current = TABS[tab];
  const money = (v: number) => (hideBalance ? "R$ ••••" : formatBRL(v));
  const EyeIcon = hideBalance ? EyeOff : Eye;

  const homeRef = useRef<HTMLDivElement>(null);
  const toolsRef = useDragScroll<HTMLDivElement>();
  const approachRef = useDragScroll<HTMLDivElement>();
  // Header compacto (barra de busca) depois que o header completo sai da tela
  const compact = useScrolledPast(homeRef, 104);
  const { pull, dragging, refreshing } = usePullToRefresh(homeRef, () => notify("Atualizado agora"));

  return (
    <div className="home" ref={homeRef}>
      <div className={`home-compact${compact ? " home-compact--visible" : ""}`} aria-hidden={!compact}>
        <div className="proto-status-bar" />
        <button className="home-compact__search" tabIndex={compact ? 0 : -1} onClick={soon("Busca")}>
          <Search size={20} />
          <span>Busque ajuda e mais</span>
        </button>
      </div>
      <div className="home-top">
        <div className="proto-status-bar" />
        <AppHeader name="Felipe" avatar={<img src={mpLogo} alt="Mercado Pago" width={34} height={34} />} onAction={(a) => (a === "nfc" ? onOpenApproach() : notify(a === "search" ? "Busca: disponível em breve" : "Sem notificações novas"))} />

        {/* Puxar para recarregar: o espaço abre entre o header e as abas */}
        <div className={`home-pull${dragging ? " home-pull--dragging" : ""}${refreshing ? " home-pull--refreshing" : ""}`} style={{ height: pull }} aria-hidden={!refreshing}>
          <span className="home-pull__spinner" role={refreshing ? "status" : undefined} aria-label={refreshing ? "Atualizando" : undefined}
            style={{ opacity: Math.min(1, pull / 64), transform: `rotate(${pull * 4}deg)` }} />
        </div>

        <div className="home-tabs" role="tablist">
          {TABS.map((t, i) => (
            <button key={t.key} role="tab" aria-selected={i === tab} className="home-tab" onClick={() => setTab(i)}>{t.label}</button>
          ))}
        </div>

        <div className="home-balance-wrap">
          <div className={`home-balance${tab === 0 ? " home-balance--first" : ""}`}>
            <div className="home-balance__row">
              <span className="t-h2">{money("value" in current ? current.value : balance)}</span>
              <button className="home-icon-link" aria-label={hideBalance ? "Mostrar valores" : "Ocultar valores"} onClick={onToggleBalance}>
                <EyeIcon size={20} />
              </button>
              <span className="home-spacer" />
              <button className="m-section-header__link" onClick={soon("Extrato")}>Extrato <ArrowRight size={16} /></button>
            </div>
            {current.key === "saldo" ? (
              <>
                <span className="home-yield">↑ 105% do CDI 🔥</span>
                <div className="home-yield-promo">
                  <span className="t-caption">Sua conta já rende 105% do CDI com Meli+. Aproveite!</span>
                  <Button size="md" className="home-btn-120" onClick={soon("Depositar")}>Depositar</Button>
                </div>
              </>
            ) : (
              <div className="home-yield-promo home-yield-promo--tint">
                <span className="t-caption">{current.note}</span>
                <Button size="md" className="home-btn-120" onClick={soon(current.label)}>{current.cta}</Button>
              </div>
            )}
          </div>
        </div>

        {bankBanner && (
          <div className="home-bank-wrap">
            <div className="home-bank">
              <img className="home-bank__logo" src={nubankLogo} alt="" width={24} height={24} />
              <button className="home-bank__label" onClick={soon("Conectar banco")}>Conectar banco</button>
              <button className="home-icon-link" aria-label="Dispensar" onClick={() => setBankBanner(false)}><CircleX size={20} /></button>
            </div>
          </div>
        )}
      </div>

      <div className="home-body">
        <section className="home-section home-section--bleed">
          <SectionHeader title="Ferramentas" />
          <div className="home-tools" ref={toolsRef}>
            {TOOLS.map(({ label, Icon }) => (
              <ActionTile key={label} compact icon={<Icon size={20} />} label={label} onClick={soon(label)} />
            ))}
          </div>
        </section>

        {/* Aproximar: banners que abrem a tela Aproxime já na aba certa (liga em Mais › Configurações do protótipo) */}
        {showApproachBlock && <section className="home-section home-section--bleed">
          <SectionHeader title="Aproximar" />
          <div className="home-approach" ref={approachRef}>
            {([
              { mode: "pay", title: "Pagar", text: "Débito ou Pix na maquininha", Art: PayIllustration },
              { mode: "transfer", title: "Transferir ou receber", text: "Encoste no celular da outra pessoa", Art: TransferIllustration },
            ] as const).map(({ mode, title, text, Art }) => (
              <button key={mode} className={`home-approach-card home-approach-card--${mode}`} onClick={() => onOpenApproach(mode)}>
                <span className="home-approach-card__art" aria-hidden><Art /></span>
                <span className="home-approach-card__copy">
                  <span className="home-approach-card__title">{title}</span>
                  <span className="home-approach-card__text">{text}</span>
                </span>
                <span className="home-approach-card__go" aria-hidden><ArrowRight size={18} /></span>
              </button>
            ))}
            {onOpenNearby && (
              <button className="home-approach-card home-approach-card--nearby" onClick={onOpenNearby}>
                <span className="home-approach-card__art" aria-hidden><NearbyIllustration /></span>
                <span className="home-approach-card__copy">
                  <span className="home-approach-card__title">Perto de mim</span>
                  <span className="home-approach-card__text">Contatos por perto para transferir ou receber</span>
                </span>
                <span className="home-approach-card__go" aria-hidden><ArrowRight size={18} /></span>
              </button>
            )}
          </div>
        </section>}

        <section className="home-section">
          <SectionHeader title="Empréstimos" link="Consultar" onLinkClick={soon("Empréstimos")} />
          <div className="home-card home-card--row">
            <p className="t-body home-grow">Peça a Linha de Crédito para comprar e pagar em até 24x sem cartão</p>
            <Button size="md" className="home-btn-120" onClick={soon("Linha de Crédito")}>Pedir</Button>
          </div>
        </section>

        <section className="home-section">
          <SectionHeader title="Cartão de crédito" />
          <div className="home-cc">
            <div className="home-cc__img" aria-hidden />
            <p className="home-cc__title">Sem anuidade.<br />Saiba como pedir seu cartão</p>
            <div className="home-cc__bottom">
              <span className="t-caption home-grow">Até 18x sem juros no Mercado Livre</span>
              <Button size="md" className="home-btn-120" onClick={soon("Pedir cartão")}>Pedir cartão</Button>
            </div>
          </div>
        </section>

        <section className="home-section">
          <SectionHeader title="Benefícios" link="Conhecer todos" onLinkClick={soon("Benefícios")} />
          <div className="home-benefits">
            <button className="home-benefit home-benefit--img" onClick={soon("Benefícios Mercado Pago")}>
              <span className="t-caption" style={{ fontWeight: 600 }}>Com Mercado Pago sempre tem vantagens</span>
            </button>
            <button className="home-benefit" onClick={soon("Descontos Mercado Livre")}>
              <span className="home-benefit__logo" aria-hidden />
              <span className="t-caption t-secondary">Mercado Livre</span>
              <span className="t-caption" style={{ fontWeight: 600 }}>Descontos exclusivos</span>
            </button>
          </div>
        </section>

        <section className="home-section">
          <SectionHeader title="Últimas atividades" link="Conferir todas" onLinkClick={soon("Atividades")} />
          <div>
            {transactions.slice(0, 3).map((t) => {
              const MIcon = METHOD_ICON[t.method];
              return (
                <TransactionItem key={t.id} thumb={<Store size={18} />} title={t.title} kind={t.kind}
                  method={t.methodLabel} methodIcon={<MIcon size={12} />}
                  amount={hideBalance ? "R$ ••••" : `${t.amount < 0 ? "-" : "+"} ${formatBRL(Math.abs(t.amount))}`} date={t.date} />
              );
            })}
          </div>
        </section>

        <section className="home-section">
          <SectionHeader title="Sugestões" />
          <div className="home-suggestion">
            <p className="home-suggestion__title">Você vende e o dinheiro cai na hora</p>
            <button className="home-suggestion__link" onClick={soon("Começar a vender")}>Começar a vender <ArrowRight size={16} /></button>
          </div>
        </section>
      </div>
    </div>
  );
}
