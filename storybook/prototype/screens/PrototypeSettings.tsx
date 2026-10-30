import { Switch, TextField } from "../../src/components";
import { NFC_RECIPIENT, NFC_SENDER } from "../data";

export interface ProtoSettings {
  /** Bloco "Aproximar" (banners) na Home — ligado por padrão */
  approachBlock: boolean;
  /** Funcionalidade "Perto de mim" (radar no Aproxime, bloco em Configurações e card na Home) — ligada por padrão */
  nearby: boolean;
  /** Quem recebe quando eu transfiro por aproximação */
  recipientName: string;
  /** Quem me envia quando eu recebo por aproximação */
  senderName: string;
}
export const DEFAULT_PROTO_SETTINGS: ProtoSettings = {
  approachBlock: true, nearby: true, recipientName: NFC_RECIPIENT.name, senderName: NFC_SENDER.name,
};

// Só os nomes ficam salvos no aparelho (localStorage); as chaves voltam ao padrão a cada visita
const NAMES_KEY = "meli-prox:names";
type Names = Pick<ProtoSettings, "recipientName" | "senderName">;
export function loadProtoSettings(): ProtoSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(NAMES_KEY) ?? "null") as Partial<Names> | null;
    return { ...DEFAULT_PROTO_SETTINGS, ...(saved ?? {}) };
  } catch { return DEFAULT_PROTO_SETTINGS; }
}
export function saveNames({ recipientName, senderName }: Names) {
  try { localStorage.setItem(NAMES_KEY, JSON.stringify({ recipientName, senderName })); } catch { /* sem storage: vale só nesta sessão */ }
}
/** Nome digitado ou, se vazio, o padrão */
export const nameOr = (name: string, fallback: string) => name.trim() || fallback;

/** Aba "Mais" no protótipo: chaves para testar variações (não faz parte do app). */
export function PrototypeSettings({ settings, onChange }: { settings: ProtoSettings; onChange: (s: ProtoSettings) => void }) {
  return (
    <div className="pix">
      <div className="proto-status-bar" />
      <div className="pix__content">
        <div>
          <h1 className="t-h1">Mais</h1>
          <p className="t-body t-secondary" style={{ margin: "4px 0 0" }}>Configurações do protótipo</p>
        </div>
        <ul className="m-list proto-settings">
          <li>
            <Switch label="Bloco “Aproximar” na Home" description="Mostra os atalhos Pagar e Transferir ou receber depois de Ferramentas."
              checked={settings.approachBlock} onChange={(approachBlock) => onChange({ ...settings, approachBlock })} />
          </li>
          <li>
            <Switch label="Perto de mim" description="Mostra o ícone de radar no Aproxime, o bloco em Configurações e o card no bloco “Aproximar” da Home."
              checked={settings.nearby} onChange={(nearby) => onChange({ ...settings, nearby })} />
          </li>
        </ul>
        <section className="proto-names">
          <div>
            <h2 className="t-h5">Nomes no protótipo</h2>
            <p className="t-caption t-secondary proto-names__lead">Aparecem na confirmação, nas atividades e nos comprovantes. Ficam salvos neste aparelho.</p>
          </div>
          <TextField label="Quem recebe (quando você transfere)" value={settings.recipientName} placeholder={NFC_RECIPIENT.name} maxLength={40} autoComplete="off"
            onChange={(e) => onChange({ ...settings, recipientName: e.target.value })} />
          <TextField label="Quem envia (quando você recebe)" value={settings.senderName} placeholder={NFC_SENDER.name} maxLength={40} autoComplete="off"
            onChange={(e) => onChange({ ...settings, senderName: e.target.value })} />
        </section>
      </div>
    </div>
  );
}
