import { Switch } from "../../src/components";

export interface ProtoSettings {
  /** Bloco "Aproxime" (banners) na Home — desligado por padrão */
  approachBlock: boolean;
  /** Funcionalidade "Perto de mim" (radar no Aproxime, bloco em Configurações e card na Home) — desligada por padrão */
  nearby: boolean;
}
export const DEFAULT_PROTO_SETTINGS: ProtoSettings = { approachBlock: false, nearby: false };

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
            <Switch label="Bloco “Aproxime” na Home" description="Mostra os atalhos Pagar e Transferir ou receber depois de Ferramentas."
              checked={settings.approachBlock} onChange={(approachBlock) => onChange({ ...settings, approachBlock })} />
          </li>
          <li>
            <Switch label="Perto de mim" description="Mostra o ícone de radar no Aproxime, o bloco em Configurações e o card no bloco “Aproxime” da Home."
              checked={settings.nearby} onChange={(nearby) => onChange({ ...settings, nearby })} />
          </li>
        </ul>
      </div>
    </div>
  );
}
