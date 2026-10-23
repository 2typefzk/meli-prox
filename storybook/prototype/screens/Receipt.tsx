import { Share2, X } from "lucide-react";
import { Badge, IconButton, ReceiptRow, ReceiptSection, ZigzagDivider } from "../../src/components";
import { formatBRL } from "../data";

export interface ReceiptData {
  kicker: string;
  status: string;
  title: string;
  date: string;
  amount: number;
  sections: { title: string; lines: string[] }[];
}

/** Comprovante de pagamento / transferência / recebimento (Figma: Comprovante · *). */
export function Receipt({ data, onClose, notify }: { data: ReceiptData; onClose: () => void; notify: (msg: string) => void }) {
  return (
    <div className="receipt">
      <div className="proto-status-bar" />
      <div className="receipt__topbar">
        <IconButton icon={<X size={22} />} aria-label="Fechar comprovante" onClick={onClose} />
        <IconButton icon={<Share2 size={22} />} aria-label="Compartilhar comprovante" onClick={() => notify("Compartilhar: disponível em breve")} />
      </div>
      <div className="receipt__summary">
        <span className="t-body-lg">{data.kicker}</span>
        <Badge tone="positive" emphasis="quiet">{data.status}</Badge>
        <div>
          <h1 className="t-h2">{data.title}</h1>
          <p className="t-body t-secondary">{data.date}</p>
        </div>
        <div>
          <ReceiptRow label="Valor" value={formatBRL(data.amount)} />
          <ReceiptRow label="Valor total" value={formatBRL(data.amount)} emphasis="total" />
        </div>
      </div>
      <ZigzagDivider />
      <div className="receipt__details">
        {data.sections.map((s, i) => (
          <ReceiptSection key={s.title} title={s.title} lines={s.lines} divider={i > 0 && i < data.sections.length - 1} />
        ))}
      </div>
      <footer className="receipt__footer">
        <div>
          <p className="t-h6">Mercado Pago · Instituição de pagamento</p>
          <p className="t-body t-secondary">CNPJ: 00.000.000/0001-00</p>
        </div>
        <p className="t-body t-secondary">Para verificar a validade deste comprovante, acesse Ajuda no app ou fale com o nosso suporte.</p>
      </footer>
    </div>
  );
}
