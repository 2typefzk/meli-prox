import { ChevronRight, Eye, X, Gauge, Lock, Radar, ShieldCheck, UserCheck, Vibrate } from "lucide-react";
import { Button, ChoiceChips, IconButton, LiveDot, RadioList, SettingsCard, SettingsRow, Toggle } from "../../src/components";
import { formatCountdown, useLeave, useSecondsLeft } from "../hooks";

export type Visibility = "contacts" | "contacts-of-contacts";
export interface AppSettings {
  /** Etapa "Confirmar" depois da aproximação (transferir e receber) */
  doubleConfirm: boolean;
  /** Valor máximo por aproximação sem pedir senha */
  nfcLimit: 200 | 500 | 1000;
  vibrate: boolean;
  /** Perto de mim: quem pode ver nome, foto e telefone */
  visibility: Visibility;
  showOnline: boolean;
  /** "Me encontre": visível para pessoas ao redor até este instante (ms) */
  findMeUntil: number | null;
}
export const DEFAULT_SETTINGS: AppSettings = {
  doubleConfirm: true, nfcLimit: 500, vibrate: true, visibility: "contacts", showOnline: true, findMeUntil: null,
};

const LIMITS: AppSettings["nfcLimit"][] = [200, 500, 1000];
const brl = (v: number) => `R$ ${v.toLocaleString("pt-BR")}`;
const FIND_ME = [{ s: 30, label: "30 s" }, { s: 60, label: "1 min" }, { s: 120, label: "2 min" }];
const VISIBILITY: { value: Visibility; label: string; text: string }[] = [
  { value: "contacts", label: "Contatos", text: "Padrão" },
  { value: "contacts-of-contacts", label: "Contatos dos meus contatos", text: "Inclui pessoas que têm um contato em comum com você" },
];

/** Configurações do Aproxime (abre como página sobre a tela atual). */
export function Settings({ settings, onChange, onClose, nearby = true }: {
  settings: AppSettings; onChange: (s: AppSettings) => void; onClose: () => void;
  /** Funcionalidade "Perto de mim" ligada (mostra o bloco) */
  nearby?: boolean;
}) {
  const [leaving, leave] = useLeave(onClose);
  const set = <K extends keyof AppSettings>(k: K, v: AppSettings[K]) => onChange({ ...settings, [k]: v });
  const left = useSecondsLeft(settings.findMeUntil);
  const visibility = VISIBILITY.find((o) => o.value === settings.visibility)!;

  return (
    <div className={`settings-page${leaving ? " is-leaving" : ""}`} role="dialog" aria-modal="true" aria-label="Configurações">
      <div className="proto-status-bar" />
      <div className="settings">
        <div className="settings__top">
          <nav className="settings__crumbs" aria-label="Você está em">
            <button type="button" className="settings__crumb-link" onClick={leave}>Aproxime</button>
            <ChevronRight size={16} aria-hidden />
            <span aria-current="page">Configurações</span>
          </nav>
          <IconButton icon={<X size={22} />} aria-label="Fechar" onClick={leave} />
        </div>
        <header className="settings__head">
          <h1 className="settings__title">Configurações</h1>
          <p className="settings__lead">{nearby ? "Você pode ajustar como transferir, receber e aparecer para as pessoas por perto." : "Você pode ajustar como pagar, transferir e receber por aproximação."}</p>
        </header>

        <SettingsCard title="Transferir ou Receber">
          <SettingsRow icon={<ShieldCheck size={22} />} value="Dupla confirmação" caption="Sempre confirmar antes de transferir ou receber."
            trailing={<Toggle label="Dupla confirmação" checked={settings.doubleConfirm} onChange={(v) => set("doubleConfirm", v)} />} />
          <SettingsRow icon={<Gauge size={22} />} value={brl(settings.nfcLimit)} caption="Limite por aproximação. Acima disso, pedimos sua senha.">
            <ChoiceChips label="Limite por aproximação" value={settings.nfcLimit} onChange={(v) => set("nfcLimit", v)}
              options={LIMITS.map((v) => ({ value: v, label: brl(v) }))} />
          </SettingsRow>
          <SettingsRow icon={<Vibrate size={22} />} value="Vibrar ao aproximar" caption="Aviso tátil quando o outro celular for detectado."
            trailing={<Toggle label="Vibrar ao aproximar" checked={settings.vibrate} onChange={(v) => set("vibrate", v)} />} />
        </SettingsCard>

        {nearby && <><SettingsCard title="Perto de mim">
          <SettingsRow icon={<Eye size={22} />} value={visibility.label} caption="Ficar visível para: quem pode ver suas informações pessoais.">
            <RadioList label="Ficar visível para" name="visibility" options={VISIBILITY} value={settings.visibility} onChange={(v) => set("visibility", v)} />
          </SettingsRow>
          <SettingsRow icon={<Radar size={22} />}
            value={left > 0 ? <>Me encontre · <strong>{formatCountdown(left)}</strong></> : "Me encontre · desligado"}
            caption="As pessoas ao redor podem ver suas iniciais e te adicionar aos Contatos."
            trailing={left > 0 ? <LiveDot label="Ligado" /> : undefined}>
            {left > 0
              ? <Button size="sm" variant="secondary" onClick={() => set("findMeUntil", null)}>Desligar agora</Button>
              : <ChoiceChips label="Ligar por" value={null} onChange={(sec) => set("findMeUntil", Date.now() + sec * 1000)}
                  options={FIND_ME.map((o) => ({ value: o.s, label: `Ligar por ${o.label}` }))} />}
          </SettingsRow>
          <SettingsRow icon={<UserCheck size={22} />} value="Mostrar quando estou online" caption="Exibe o indicador verde no seu avatar."
            trailing={<Toggle label="Mostrar quando estou online" checked={settings.showOnline} onChange={(v) => set("showOnline", v)} />} />
        </SettingsCard>

        <p className="settings-note"><Lock size={14} aria-hidden /> Sua localização exata nunca é compartilhada, só a distância aproximada. "Me encontre" desliga sozinho ao fim do tempo escolhido.</p></>}
      </div>
    </div>
  );
}
