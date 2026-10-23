import type { NavKey } from "../../src/components";

const TITLES: Record<NavKey, string> = { conta: "Conta", cartoes: "Cartões", pix: "Pix", pagamentos: "Pagamentos", mais: "Mais" };

/** Abas sem tela no Figma (página Screens): mantêm a navegação funcionando. */
export function Placeholder({ tab }: { tab: NavKey }) {
  return (
    <div className="pix">
      <div className="proto-status-bar" />
      <div className="pix__content">
        <h1 className="t-h1">{TITLES[tab]}</h1>
        <div className="pix__empty">
          <h2 className="t-h4">Em breve no protótipo</h2>
          <p className="t-body-lg t-secondary">Esta tela ainda não foi desenhada na página Screens do Figma.</p>
        </div>
      </div>
    </div>
  );
}
