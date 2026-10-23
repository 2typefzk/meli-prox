// Dados fictícios do protótipo (nenhum dado real de cliente).
export interface Transaction {
  id: string;
  title: string;
  kind: string;
  method: "transfer" | "credit" | "pix" | "debit" | "nfc";
  methodLabel: string;
  amount: number;
  date: string;
}

export const INITIAL_BALANCE = 1251;

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "t1", title: "Mercado Livre", kind: "Compra", method: "transfer", methodLabel: "Via transferência", amount: -215.99, date: "15/out" },
  { id: "t2", title: "Mercado Livre", kind: "Compra", method: "credit", methodLabel: "Mastercard crédito", amount: -49.99, date: "14/out" },
  { id: "t3", title: "Mercado Livre", kind: "Compra", method: "credit", methodLabel: "Mastercard crédito", amount: -23.99, date: "14/out" },
];

export const RECIPIENT = { name: "Ana Paula Souza", bank: "Itaú Unibanco S.A.", document: "***.482.193-**" };

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const formatBRL = (v: number) => brl.format(v).replace(/ /g, " ");

export type KeyType = "CPF" | "Celular" | "E-mail" | "Chave aleatória";

/** Classifica a chave Pix digitada; null quando inválida. */
export function classifyPixKey(raw: string): KeyType | null {
  const v = raw.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "E-mail";
  const digits = v.replace(/\D/g, "");
  if (/^\+/.test(v) && digits.length >= 12 && digits.length <= 13) return "Celular";
  if (digits.length === 11 && /^[\d.\-\s]+$/.test(v)) return "CPF";
  if (/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(v)) return "Chave aleatória";
  return null;
}

// Aproximação (NFC) — contrapartes fictícias usadas no protótipo
export const ME = { name: "Felipe Marinelli", document: "***.456.789-**" };
export const NFC_MERCHANT = { name: "Padaria Pão Dourado", legal: "Padaria Pão Dourado LTDA", document: "00.000.000/0001-00", amount: 18.9 };
export const NFC_RECIPIENT = { name: "Giuliana Cecilio", document: "***.123.456-**" };
export const NFC_SENDER = { name: "Felipe Marinelli", document: "***.482.193-**", amount: 25 };

/** "21/10/2026 às 15:04" */
export function receiptDate(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} às ${p(d.getHours())}:${p(d.getMinutes())}`;
}
export const transactionId = () => `E${Date.now()}${Math.floor(Math.random() * 1e6).toString().padStart(6, "0")}`;
