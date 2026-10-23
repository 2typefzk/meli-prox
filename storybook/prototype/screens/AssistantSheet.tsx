import { HandCoins, Nfc, PiggyBank, Receipt, Sparkles, X, Zap } from "lucide-react";
import { BottomSheet, IconButton, ListItem } from "../../src/components";

export type AssistantAction = "nfc-pay" | "nfc-transfer" | "nfc-receive" | "pix" | "bill" | "save";

/** Bottom sheet do assistente ("Mago"), aberto pelo AssistantFab. */
export function AssistantSheet({ onClose, onPick }: { onClose: () => void; onPick: (a: AssistantAction) => void }) {
  return (
    <BottomSheet aria-label="Mago, seu assistente" onClose={onClose}>
      {(close) => (<>
        <div className="sheet__head">
          <span className="sheet__spark"><Sparkles size={20} fill="currentColor" /></span>
          <div className="home-grow">
            <div className="t-h4">Mago, seu assistente</div>
            <div className="t-caption t-secondary">Transfira de forma rápida e segura.</div>
          </div>
          <IconButton icon={<X size={20} />} aria-label="Fechar" onClick={close} />
        </div>
        <ul className="m-list">
          <ListItem icon={<Nfc size={20} />} label="Aproximar para pagar" onClick={() => onPick("nfc-pay")} />
          <ListItem icon={<Nfc size={20} />} label="Aproximar para transferir" onClick={() => onPick("nfc-transfer")} />
          <ListItem icon={<HandCoins size={20} />} label="Aproximar para receber" onClick={() => onPick("nfc-receive")} />
          <ListItem icon={<Zap size={20} />} label="Fazer um Pix" onClick={() => onPick("pix")} />
          <ListItem icon={<Receipt size={20} />} label="Pagar um boleto" onClick={() => onPick("bill")} />
          <ListItem icon={<PiggyBank size={20} />} label="Guardar dinheiro no Cofrinho" onClick={() => onPick("save")} />
        </ul>
      </>)}
    </BottomSheet>
  );
}
