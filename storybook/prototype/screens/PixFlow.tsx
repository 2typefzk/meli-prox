import { useState } from "react";
import { ArrowRight, Check, ChevronLeft } from "lucide-react";
import { Button, IconButton, InfoBanner, TextField } from "../../src/components";
import { RECIPIENT, formatBRL, type KeyType } from "../data";
import { AmountEntry } from "./AmountEntry";

const BankAvatar = ({ size = 40 }: { size?: number }) => (
  <span className="flow-bank" style={{ width: size, height: size, fontSize: size * 0.3 }} aria-hidden>itaú</span>
);
export const Back = ({ onClick }: { onClick: () => void }) => (
  <IconButton icon={<ChevronLeft size={22} />} aria-label="Voltar" onClick={onClick} />
);
const Field = ({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) => (
  <div className="flow-field"><span className="t-body t-secondary">{label}</span>{children ?? <span className="t-h5">{value}</span>}</div>
);

// Baseado em meli_ds_4 ("Confira a conta")
export function PixConfirm({ pixKey, keyType, onBack, onContinue, onChangeKey }: {
  pixKey: string; keyType: KeyType; onBack: () => void; onContinue: () => void; onChangeKey: () => void;
}) {
  return (
    <div className="flow">
      <div className="proto-status-bar" />
      <div className="flow__body">
        <Back onClick={onBack} />
        <h1 className="t-h2">Confira a conta</h1>
        <Field label="Nome"><span className="t-h3">{RECIPIENT.name}</span></Field>
        <InfoBanner>Este é seu primeiro Pix para esta conta. Verifique se o nome é da pessoa certa.</InfoBanner>
        <Field label={`Chave Pix · ${keyType}`} value={pixKey} />
        <Field label="CPF" value={RECIPIENT.document} />
        <Field label="Banco"><span className="flow-row"><BankAvatar size={20} /><span className="t-h5">{RECIPIENT.bank}</span></span></Field>
      </div>
      <div className="flow__footer">
        <Button fullWidth onClick={onContinue}>Continuar</Button>
        <Button fullWidth variant="secondary" onClick={onChangeKey}>Alterar chave</Button>
      </div>
    </div>
  );
}

// Baseado em meli_ds_3 ("Insira o valor")
export function PixAmount({ pixKey, balance, hideBalance, onToggleBalance, onBack, onConfirm }: {
  pixKey: string; balance: number; hideBalance: boolean; onToggleBalance: () => void; onBack: () => void; onConfirm: (amount: number, message?: string) => void;
}) {
  const [cents, setCents] = useState(0);
  const [showMsg, setShowMsg] = useState(false);
  const [message, setMessage] = useState("");
  const amount = cents / 100;
  const over = amount > balance;

  return (
    <div className="flow">
      <div className="proto-status-bar" />
      <div className="flow__body">
        <Back onClick={onBack} />
        <h1 className="t-h2">Insira o valor</h1>
        <div className="flow-row flow-row--top">
          <BankAvatar />
          <div className="flow-recipient">
            <span className="t-h4">{RECIPIENT.name}</span>
            <span className="t-body-lg">Chave Pix: {pixKey}</span>
            {!showMsg && (
              <button className="m-section-header__link" onClick={() => setShowMsg(true)}>Adicionar mensagem <ArrowRight size={16} /></button>
            )}
          </div>
        </div>
        {showMsg && <TextField label="Mensagem (opcional)" placeholder="Ex.: almoço de sexta" maxLength={140} value={message} onChange={(e) => setMessage(e.target.value)} autoFocus />}

        <AmountEntry label="Valor do Pix" cents={cents} onChange={setCents} balance={balance} hideBalance={hideBalance}
          onToggleBalance={onToggleBalance} autoFocus={!showMsg} />
      </div>
      <div className="flow__footer">
        <Button fullWidth disabled={!cents || over} onClick={() => onConfirm(amount, message.trim() || undefined)}>
          {cents && !over ? `Enviar ${formatBRL(amount)}` : "Continuar"}
        </Button>
      </div>
    </div>
  );
}

export function PixSuccess({ amount, message, onHome, onAnother }: { amount: number; message?: string; onHome: () => void; onAnother: () => void }) {
  return (
    <div className="flow flow--success">
      <div className="proto-status-bar" />
      <div className="flow__body flow__body--center">
        <span className="flow-check"><Check size={36} strokeWidth={3} /></span>
        <h1 className="t-h2">Pix enviado!</h1>
        <span className="t-display">{formatBRL(amount)}</span>
        <p className="t-body-lg t-secondary">para {RECIPIENT.name}<br />{RECIPIENT.bank}</p>
        {message && <p className="t-body flow-note">“{message}”</p>}
      </div>
      <div className="flow__footer">
        <Button fullWidth onClick={onHome}>Voltar ao início</Button>
        <Button fullWidth variant="secondary" onClick={onAnother}>Fazer outro Pix</Button>
      </div>
    </div>
  );
}
