import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Copy, Eye, Gauge, Phone, Radar, ShieldCheck, Sparkles, UserCheck, Vibrate, X } from "lucide-react";
import { NearbyAvatar } from "./NearbyAvatar";
import { BottomSheet } from "./BottomSheet";
import { SettingsCard, SettingsRow, ChoiceChips, RadioList, Toggle, LiveDot } from "./SettingsList";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import man from "../../prototype/assets/nearby-contact-man.jpg";
import woman from "../../prototype/assets/nearby-contact-woman.jpg";
import purple from "../../prototype/assets/nearby-contact-purple.jpg";

const meta: Meta = { title: "Components/Aproxime e Perto de mim", tags: ["autodocs"] };
export default meta;
type S = StoryObj;

/** Fundo escuro do Stand by / Perto de mim */
const Dark = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, padding: 24, borderRadius: 16, background: "radial-gradient(120% 70% at 50% 42%, #22324F 0%, var(--meli-card-navy) 45%, #0E1626 100%)" }}>
    {children}
  </div>
);

export const NearbyAvatarTipos: S = {
  name: "NearbyAvatar · tipos",
  parameters: { docs: { description: { story: "Contato = foto · Aberto (permite ser adicionado) = iniciais · Anônimo = placeholder. Todos clicáveis." } } },
  render: () => (
    <Dark>
      <NearbyAvatar kind="contact" photo={man} size={48} online aria-label="Rafael Monteiro (online)" />
      <NearbyAvatar kind="contact" photo={woman} size={48} aria-label="Ana Paula Souza" />
      <NearbyAvatar kind="open" initials="LS" size={32} aria-label="Pessoa LS" />
      <NearbyAvatar kind="anon" size={32} aria-label="Usuário anônimo" />
    </Dark>
  ),
};

export const NearbyAvatarSelecionado: S = {
  name: "NearbyAvatar · selecionado",
  render: () => {
    const [sel, setSel] = useState("purple");
    return (
      <Dark>
        {[["purple", purple], ["man", man], ["woman", woman]].map(([id, src]) => (
          <NearbyAvatar key={id} kind="contact" photo={src} size={48} selected={sel === id} onClick={() => setSel(id)} aria-label={id} />
        ))}
      </Dark>
    );
  },
};

/** Tela fake (position: relative) para o drawer se ancorar */
const Phone375 = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: "relative", width: 375, height: 560, overflow: "hidden", borderRadius: 24, background: "var(--color-bg-canvas)", boxShadow: "var(--shadow-elevation-2)" }}>{children}</div>
);

export const BottomSheetAnimado: S = {
  name: "BottomSheet · entrada e saída",
  parameters: { docs: { description: { story: "Entra subindo com ease-out. Ao tocar fora ou em Fechar, desce 50% da altura com fade-out (0,28 s) e só então chama `onClose`." } } },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <Phone375>
        <div style={{ padding: 24 }}><Button onClick={() => setOpen(true)}>Abrir drawer</Button></div>
        {open && (
          <BottomSheet aria-label="Mago, seu assistente" onClose={() => setOpen(false)}>
            {(close) => (
              <div className="sheet__head">
                <span className="sheet__spark"><Sparkles size={20} fill="currentColor" /></span>
                <div className="home-grow" style={{ flex: 1 }}>
                  <div className="t-h4">Mago, seu assistente</div>
                  <div className="t-caption t-secondary">Toque fora ou em Fechar.</div>
                </div>
                <IconButton icon={<X size={20} />} aria-label="Fechar" onClick={close} />
              </div>
            )}
          </BottomSheet>
        )}
      </Phone375>
    );
  },
};

export const DrawerContato: S = {
  name: "Drawer do Perto de mim · contato",
  render: () => (
    <Phone375>
      <BottomSheet aria-label="Detalhes do usuário" onClose={() => {}}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={man} alt="" width={56} height={56} style={{ borderRadius: "50%" }} />
            <div>
              <div className="t-h3">Rafael Monteiro</div>
              <div className="t-body t-secondary" style={{ display: "flex", gap: 6, alignItems: "center" }}><Phone size={16} /> (11) 98765-4321</div>
            </div>
          </div>
          <span className="m-field__box" style={{ paddingRight: 4 }}>
            <input className="m-field__input" readOnly value="rafael.monteiro@email.com" aria-label="Chave Pix" />
            <IconButton icon={<Copy size={18} />} aria-label="Copiar chave Pix" />
          </span>
          <div style={{ display: "flex", gap: 12 }}>
            <Button fullWidth variant="secondary">Receber</Button>
            <Button fullWidth>Transferir</Button>
          </div>
        </div>
      </BottomSheet>
    </Phone375>
  ),
};

export const ConfiguracoesCard: S = {
  name: "SettingsCard + SettingsRow",
  parameters: { layout: "padded", docs: { description: { story: "Padrão \"Informações do seu perfil\": título do card, linhas com ícone · valor + legenda · ação. Linhas com conteúdo expandem no lugar." } } },
  render: () => {
    const [double, setDouble] = useState(true);
    const [vibrate, setVibrate] = useState(true);
    const [limit, setLimit] = useState(500);
    const [vis, setVis] = useState<"contacts" | "coc">("contacts");
    const [findMe, setFindMe] = useState<number | null>(null);
    return (
      <div style={{ width: 375, display: "flex", flexDirection: "column", gap: 24, padding: 16, background: "var(--meli-ml-gray-100)" }}>
        <SettingsCard title="Transferir ou Receber">
          <SettingsRow icon={<ShieldCheck size={22} />} value="Dupla confirmação" caption="Sempre confirmar antes de transferir ou receber."
            trailing={<Toggle label="Dupla confirmação" checked={double} onChange={setDouble} />} />
          <SettingsRow icon={<Gauge size={22} />} value={`R$ ${limit.toLocaleString("pt-BR")}`} caption="Limite por aproximação." defaultOpen>
            <ChoiceChips label="Limite" value={limit} onChange={setLimit} options={[200, 500, 1000].map((v) => ({ value: v, label: `R$ ${v.toLocaleString("pt-BR")}` }))} />
          </SettingsRow>
          <SettingsRow icon={<Vibrate size={22} />} value="Vibrar ao aproximar" caption="Aviso tátil quando o outro celular for detectado."
            trailing={<Toggle label="Vibrar ao aproximar" checked={vibrate} onChange={setVibrate} />} />
        </SettingsCard>
        <SettingsCard title="Perto de mim">
          <SettingsRow icon={<Eye size={22} />} value={vis === "contacts" ? "Contatos" : "Contatos dos meus contatos"} caption="Ficar visível para.">
            <RadioList label="Ficar visível para" name="sb-vis" value={vis} onChange={setVis}
              options={[{ value: "contacts", label: "Contatos", text: "Padrão" }, { value: "coc", label: "Contatos dos meus contatos" }]} />
          </SettingsRow>
          <SettingsRow icon={<Radar size={22} />} value={findMe ? `Me encontre · ${findMe}s` : "Me encontre · desligado"} caption="As pessoas ao redor podem ver suas iniciais."
            trailing={findMe ? <LiveDot label="Ligado" /> : undefined}>
            {findMe ? <Button size="sm" variant="secondary" onClick={() => setFindMe(null)}>Desligar agora</Button>
              : <ChoiceChips label="Ligar por" value={null} onChange={setFindMe} options={[30, 60, 120].map((s) => ({ value: s, label: `Ligar por ${s < 60 ? `${s} s` : `${s / 60} min`}` }))} />}
          </SettingsRow>
          <SettingsRow icon={<UserCheck size={22} />} value="Mostrar quando estou online" caption="Exibe o indicador verde no seu avatar."
            trailing={<Toggle label="Mostrar online" checked onChange={() => {}} />} />
        </SettingsCard>
      </div>
    );
  },
};

export const ChoiceChipsStory: S = {
  name: "ChoiceChips",
  render: () => {
    const [v, setV] = useState("1min");
    return <ChoiceChips label="Duração" value={v} onChange={setV} options={[{ value: "30s", label: "30 s" }, { value: "1min", label: "1 min" }, { value: "2min", label: "2 min" }]} />;
  },
};
