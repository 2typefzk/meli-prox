import { ArrowRight, Copy, Lock, Phone, User, UserPlus } from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { TransactionItem } from "./TransactionItem";

export interface NearbyTransaction { title: string; kind: string; amount: number; date: string }
/** Quem foi tocado no "Perto de mim": contato (foto), aberto (iniciais) ou anônimo */
export type NearbyPerson =
  | { kind: "contact"; name: string; photo: string; phone: string; pixKey: string; history: NearbyTransaction[] }
  | { kind: "open"; initials: string; phonePrefix: string }
  | { kind: "anon" };

export interface NearbyDrawerProps {
  person: NearbyPerson;
  /** Chamado depois da animação de saída */
  onClose: () => void;
  onCopyPixKey?: (pixKey: string) => void;
  onTransfer?: () => void;
  onReceive?: () => void;
  /** Usuário aberto: o drawer fecha (com animação) logo depois */
  onAddContact?: () => void;
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const money = (v: number) => `${v < 0 ? "-" : "+"} ${brl.format(Math.abs(v)).replace(/\u00a0/g, " ")}`;
const initialsOf = (name: string) => name.split(" ").map((p) => p[0]).slice(0, 2).join("");

/**
 * Bottom drawer do "Perto de mim" (Figma: NearbyDrawer · Contato | Aberto | Anônimo).
 * Contato: nome, telefone completo, chave Pix com copiar, Transferir/Receber e últimas transações.
 * Aberto: iniciais, telefone parcial e "Adicionar aos contatos". Anônimo: sem interação.
 */
export function NearbyDrawer({ person, onClose, onCopyPixKey, onTransfer, onReceive, onAddContact }: NearbyDrawerProps) {
  return (
    <BottomSheet className="nearby-sheet" aria-label="Detalhes do usuário" onClose={onClose}>
      {(close) => (<>
        {person.kind === "contact" && (
          <>
            <div className="nearby-sheet__head">
              <img className="nearby-sheet__avatar" src={person.photo} alt="" />
              <div className="nearby-sheet__info">
                <h2 className="t-h3">{person.name}</h2>
                <p className="nearby-sheet__meta"><Phone size={16} aria-hidden /> {person.phone}</p>
              </div>
            </div>
            <label className="nearby-sheet__pix">
              <span className="t-caption t-secondary">Chave Pix</span>
              <span className="m-field__box">
                <input className="m-field__input" readOnly value={person.pixKey} aria-label="Chave Pix" />
                <IconButton icon={<Copy size={18} />} aria-label="Copiar chave Pix" onClick={() => onCopyPixKey?.(person.pixKey)} />
              </span>
            </label>
            <div className="nearby-sheet__actions">
              <Button fullWidth variant="secondary" onClick={onReceive}>Receber</Button>
              <Button fullWidth trailingIcon={<ArrowRight size={18} />} onClick={onTransfer}>Transferir</Button>
            </div>
            {person.history.length > 0 && (
              <div>
                <h3 className="t-h5 nearby-sheet__section">Últimas transações</h3>
                {person.history.map((t, i) => (
                  <TransactionItem key={i} thumb={<span className="nearby-sheet__thumb">{initialsOf(person.name)}</span>} title={t.title} kind={t.kind}
                    method={t.amount < 0 ? "Enviado" : "Recebido"} amount={money(t.amount)} date={t.date} />
                ))}
              </div>
            )}
          </>
        )}
        {person.kind === "open" && (
          <>
            <div className="nearby-sheet__head">
              <span className="nearby-sheet__avatar nearby-sheet__avatar--initials">{person.initials}</span>
              <div className="nearby-sheet__info">
                <h2 className="t-h3">{person.initials}</h2>
                <p className="nearby-sheet__meta"><Phone size={16} aria-hidden /> {person.phonePrefix}</p>
              </div>
            </div>
            <Button fullWidth icon={<UserPlus size={18} />} onClick={() => { onAddContact?.(); close(); }}>Adicionar aos contatos</Button>
          </>
        )}
        {person.kind === "anon" && (
          <div className="nearby-sheet__head">
            <span className="nearby-sheet__avatar nearby-sheet__avatar--anon"><User size={28} aria-hidden /></span>
            <div className="nearby-sheet__info">
              <h2 className="t-h3">Usuário Desconhecido</h2>
              <p className="nearby-sheet__meta"><Lock size={16} aria-hidden /> Não é possível interagir</p>
            </div>
          </div>
        )}
      </>)}
    </BottomSheet>
  );
}
