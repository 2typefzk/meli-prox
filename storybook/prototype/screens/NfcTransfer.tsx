import { useState } from "react";
import { HandCoins } from "lucide-react";
import { Button } from "../../src/components";
import { AmountEntry } from "./AmountEntry";
import { Back } from "./PixFlow";
import { formatBRL } from "../data";

export interface NfcTransferProps {
  balance: number;
  hideBalance: boolean;
  onToggleBalance: () => void;
  onBack: () => void;
  onReceive: () => void;
  onTransfer: (amount: number) => void;
}

/** "Transferir" por aproximação: digitação do valor (padrão da aba Transferir ou Receber). */
export function NfcTransfer({ balance, hideBalance, onToggleBalance, onBack, onReceive, onTransfer }: NfcTransferProps) {
  const [cents, setCents] = useState(0);
  const amount = cents / 100;
  const valid = cents > 0 && amount <= balance;

  return (
    <div className="flow">
      <div className="proto-status-bar" />
      <div className="flow__body">
        <div className="flow-topbar">
          <Back onClick={onBack} />
          <Button size="md" variant="secondary" icon={<HandCoins size={18} />} onClick={onReceive}>Receber</Button>
        </div>
        <div className="flow-field">
          <h1 className="t-h2">Insira o valor</h1>
          <p className="t-body-lg t-secondary">Depois, encoste seu celular no da outra pessoa para transferir.</p>
        </div>
        <AmountEntry label="Valor da transferência" cents={cents} onChange={setCents} balance={balance} hideBalance={hideBalance} onToggleBalance={onToggleBalance} />
      </div>
      <div className="flow__footer">
        <Button fullWidth disabled={!valid} onClick={() => onTransfer(amount)}>
          {valid ? `Transferir ${formatBRL(amount)}` : "Transferir"}
        </Button>
      </div>
    </div>
  );
}
