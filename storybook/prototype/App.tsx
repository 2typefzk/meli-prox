import { useCallback, useEffect, useState } from "react";
import { AssistantFab, BottomNav, type NavKey } from "../src/components";
import { Home } from "./screens/Home";
import { Pix } from "./screens/Pix";
import { PixConfirm, PixAmount, PixSuccess } from "./screens/PixFlow";
import { Placeholder } from "./screens/Placeholder";
import { AssistantSheet, type AssistantAction } from "./screens/AssistantSheet";
import { PrototypeSettings, loadProtoSettings, saveNames, nameOr, type ProtoSettings } from "./screens/PrototypeSettings";
import { Approach, type ApproachMode } from "./screens/Approach";
import { StandBy } from "./screens/StandBy";
import { NfcTransfer } from "./screens/NfcTransfer";
import { Receipt, type ReceiptData } from "./screens/Receipt";
import { Nearby } from "./screens/Nearby";
import { Settings, DEFAULT_SETTINGS, type AppSettings } from "./screens/Settings";
import { INITIAL_BALANCE, INITIAL_TRANSACTIONS, ME, NFC_MERCHANT, NFC_RECIPIENT, NFC_SENDER, receiptDate, transactionId, type KeyType, type Transaction } from "./data";

type NfcFlow =
  | { screen: "pay" }
  | { screen: "transfer-amount" }
  | { screen: "transfer-standby"; amount: number }
  | { screen: "transfer-confirm"; amount: number }
  | { screen: "receive"; from: "approach" | "amount" }
  | { screen: "receive-confirm"; amount: number }
  | { screen: "receipt"; data: ReceiptData };

type PixFlow =
  | { step: "confirm"; key: string; keyType: KeyType }
  | { step: "amount"; key: string; keyType: KeyType }
  | { step: "success"; key: string; keyType: KeyType; amount: number; message?: string };

export function App() {
  const [tab, setTab] = useState<NavKey>("conta");
  const [flow, setFlow] = useState<PixFlow | null>(null);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [hideBalance, setHideBalance] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [approachOpen, setApproachOpen] = useState(false);
  const [approachMode, setApproachMode] = useState<ApproachMode>("pay");
  const [nfc, setNfc] = useState<NfcFlow | null>(null);
  const [nearbyOpen, setNearbyOpen] = useState<false | "approach" | "home">(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [protoSettings, setProtoSettings] = useState<ProtoSettings>(loadProtoSettings);
  useEffect(() => saveNames(protoSettings), [protoSettings.recipientName, protoSettings.senderName]); // eslint-disable-line react-hooks/exhaustive-deps
  // Contrapartes das operações por aproximação (nomes editáveis em Mais)
  const recipient = { ...NFC_RECIPIENT, name: nameOr(protoSettings.recipientName, NFC_RECIPIENT.name) };
  const sender = { ...NFC_SENDER, name: nameOr(protoSettings.senderName, NFC_SENDER.name) };

  const notify = useCallback((msg: string) => setToast(msg), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const goTab = (k: NavKey) => { setFlow(null); setNfc(null); setApproachOpen(false); setNearbyOpen(false); setSettingsOpen(false); setTab(k); };
  const openApproach = (mode?: ApproachMode) => { setApproachMode(mode === "transfer" ? "transfer" : "pay"); setApproachOpen(true); };

  // Mago: atalhos diretos para os fluxos
  const pickAssistant = (action: AssistantAction) => {
    setAssistantOpen(false);
    if (action === "nfc-pay") setNfc({ screen: "pay" });
    else if (action === "nfc-transfer") setNfc({ screen: "transfer-amount" });
    else if (action === "nfc-receive") setNfc({ screen: "receive", from: "approach" });
    else if (action === "pix") goTab("pix");
    else notify("Disponível em breve no protótipo");
  };

  const sendPix = (amount: number, message?: string) => {
    if (flow?.step !== "amount") return;
    setBalance((b) => Math.round((b - amount) * 100) / 100);
    setTransactions((list) => [
      { id: `pix-${Date.now()}`, title: "Ana Paula Souza", kind: "Pix enviado", method: "pix", methodLabel: "Pix", amount: -amount, date: "Hoje" },
      ...list,
    ]);
    setFlow({ step: "success", key: flow.key, keyType: flow.keyType, amount, message });
  };

  // Registra a operação por aproximação (saldo + atividades) e abre o comprovante
  const completeNfc = (kind: "pay" | "transfer" | "receive", amount: number) => {
    const signed = kind === "receive" ? amount : -amount;
    const id = transactionId();
    const meta = {
      pay: { title: NFC_MERCHANT.name, kind: "Pagamento", label: "Débito por aproximação" },
      transfer: { title: recipient.name, kind: "Transferência enviada", label: "Pix por aproximação" },
      receive: { title: sender.name, kind: "Transferência recebida", label: "Pix por aproximação" },
    }[kind];
    setBalance((b) => Math.round((b + signed) * 100) / 100);
    setTransactions((list) => [{ id, title: meta.title, kind: meta.kind, method: "nfc", methodLabel: meta.label, amount: signed, date: "Hoje" }, ...list]);
    const me = [`Nome: ${ME.name}`, `CPF: ${ME.document}`, "Instituição: Mercado Pago"];
    const data: Record<typeof kind, ReceiptData> = {
      pay: { kicker: "Comprovante de pagamento", status: "Pago", title: NFC_MERCHANT.name, date: `Pago em ${receiptDate()}`, amount,
        sections: [{ title: "Forma de pagamento", lines: ["Débito por aproximação", "Cartão virtual •••• 6872"] }, { title: "Origem", lines: me.slice(0, 2) },
          { title: "Destino", lines: [`Nome: ${NFC_MERCHANT.legal}`, `CNPJ: ${NFC_MERCHANT.document}`, "Maquininha Point"] }, { title: "Identificação", lines: ["ID da transação", id] }] },
      transfer: { kicker: "Comprovante de transferência", status: "Concluída", title: "Transferência por aproximação", date: `Realizada em ${receiptDate()}`, amount,
        sections: [{ title: "Forma de pagamento", lines: ["Saldo em conta", "Pix por aproximação"] }, { title: "Origem", lines: me },
          { title: "Destino", lines: [`Nome: ${recipient.name}`, `CPF: ${recipient.document}`, "Instituição: Mercado Pago"] }, { title: "Identificação", lines: ["ID da transação", id] }] },
      receive: { kicker: "Comprovante de recebimento", status: "Recebido", title: "Recebimento por aproximação", date: `Recebido em ${receiptDate()}`, amount,
        sections: [{ title: "Forma de recebimento", lines: ["Pix por aproximação"] }, { title: "Origem", lines: [`Nome: ${sender.name}`, `CPF: ${sender.document}`, "Instituição: Mercado Pago"] },
          { title: "Destino", lines: me }, { title: "Identificação", lines: ["ID da transação", id] }] },
    };
    setNfc({ screen: "receipt", data: data[kind] });
  };

  let screen: JSX.Element;
  if (nfc?.screen === "pay") {
    screen = <StandBy state="action" icon="nfc" title="Aproxime para Pagar" text="Débito ou Pix" successOnDetect
      onDetected={() => completeNfc("pay", NFC_MERCHANT.amount)} onBack={() => setNfc(null)} />;
  } else if (nfc?.screen === "transfer-amount") {
    screen = <NfcTransfer balance={balance} hideBalance={hideBalance} onToggleBalance={() => setHideBalance((h) => !h)}
      onBack={() => setNfc(null)} onReceive={() => setNfc({ screen: "receive", from: "amount" })}
      onTransfer={(amount) => setNfc({ screen: "transfer-standby", amount })} />;
  } else if (nfc?.screen === "transfer-standby") {
    const amount = nfc.amount;
    // Sem dupla confirmação, a detecção já conclui a transferência (variação Sucesso → comprovante)
    screen = <StandBy state="action" icon="send" title="Aproxime para Transferir" amount={amount} text="Aguardando destinatário"
      successOnDetect={!settings.doubleConfirm}
      onDetected={() => settings.doubleConfirm ? setNfc({ screen: "transfer-confirm", amount }) : completeNfc("transfer", amount)} onBack={() => setNfc({ screen: "transfer-amount" })} />;
  } else if (nfc?.screen === "transfer-confirm") {
    const amount = nfc.amount;
    screen = <StandBy state="confirm" icon="send" action="Transferir" processingLabel="Transferindo" amount={amount} preposition="Para" counterpart={recipient.name}
      onConfirm={() => completeNfc("transfer", amount)} onBack={() => setNfc({ screen: "transfer-standby", amount })} />;
  } else if (nfc?.screen === "receive") {
    screen = <StandBy state="action" icon="receive" title="Aproxime para Receber" text="Peça para a outra pessoa encostar o celular dela no seu."
      successOnDetect={!settings.doubleConfirm}
      onDetected={() => settings.doubleConfirm ? setNfc({ screen: "receive-confirm", amount: NFC_SENDER.amount }) : completeNfc("receive", NFC_SENDER.amount)}
      onBack={() => setNfc(nfc.from === "amount" ? { screen: "transfer-amount" } : null)} />;
  } else if (nfc?.screen === "receive-confirm") {
    const amount = nfc.amount;
    screen = <StandBy state="confirm" icon="receive" action="Receber" processingLabel="Recebendo" amount={amount} preposition="De" counterpart={sender.name}
      onConfirm={() => completeNfc("receive", amount)} onBack={() => setNfc({ screen: "receive", from: "approach" })} />;
  } else if (nfc?.screen === "receipt") {
    screen = <Receipt data={nfc.data} notify={notify} onClose={() => goTab("conta")} />;
  } else if (nearbyOpen) {
    screen = <Nearby notify={notify} settings={settings} onOpenSettings={() => setSettingsOpen(true)}
      onBack={() => { if (nearbyOpen === "home") setApproachOpen(false); setNearbyOpen(false); }}
      onTransfer={() => { setNearbyOpen(false); setApproachMode("transfer"); setNfc({ screen: "transfer-amount" }); }}
      onReceive={() => { setNearbyOpen(false); setApproachMode("transfer"); setNfc({ screen: "receive", from: "approach" }); }} />;
  } else if (approachOpen) {
    screen = <Approach notify={notify} initialMode={approachMode}
      onSelect={(m) => { setApproachMode(m); setNfc({ screen: m === "pay" ? "pay" : "transfer-amount" }); }}
      onReceive={() => { setApproachMode("transfer"); setNfc({ screen: "receive", from: "approach" }); }}
      onOpenNearby={protoSettings.nearby ? () => setNearbyOpen("approach") : undefined} onOpenSettings={() => setSettingsOpen(true)} />;
  } else if (flow?.step === "confirm") {
    screen = <PixConfirm pixKey={flow.key} keyType={flow.keyType} onBack={() => setFlow(null)} onChangeKey={() => setFlow(null)}
      onContinue={() => setFlow({ ...flow, step: "amount" })} />;
  } else if (flow?.step === "amount") {
    screen = <PixAmount pixKey={flow.key} balance={balance} hideBalance={hideBalance} onToggleBalance={() => setHideBalance((h) => !h)}
      onBack={() => setFlow({ ...flow, step: "confirm" })} onConfirm={sendPix} />;
  } else if (flow?.step === "success") {
    screen = <PixSuccess amount={flow.amount} message={flow.message} onHome={() => goTab("conta")} onAnother={() => { setFlow(null); setTab("pix"); }} />;
  } else if (tab === "conta") {
    screen = <Home balance={balance} transactions={transactions} hideBalance={hideBalance} onToggleBalance={() => setHideBalance((h) => !h)}
      notify={notify} showApproachBlock={protoSettings.approachBlock}
      onOpenNearby={protoSettings.nearby ? () => { setApproachOpen(true); setNearbyOpen("home"); } : undefined} onOpenApproach={(m?: ApproachMode) => openApproach(m)} />;
  } else if (tab === "pix") {
    screen = <Pix notify={notify} onOpenApproach={(m?: ApproachMode) => openApproach(m)} onSubmitKey={(key, keyType) => setFlow({ step: "confirm", key, keyType })} />;
  } else {
    screen = tab === "mais"
      ? <PrototypeSettings settings={protoSettings} onChange={setProtoSettings} />
      : <Placeholder tab={tab} />;
  }

  return (
    <div className="proto-stage">
      <div className="proto-phone" data-theme="mp-light">
        <div className="proto-screen">{screen}</div>
        {!flow && !nfc && !nearbyOpen && (
          <>
            {tab === "conta" && !approachOpen && (
              <div className="proto-fab"><AssistantFab onClick={() => setAssistantOpen(true)} /></div>
            )}
            {/* Aproxime faz parte do Pix: a tab Pix fica ativa */}
            <BottomNav active={approachOpen ? "pix" : tab} onChange={goTab} />
          </>
        )}
        {settingsOpen && <Settings settings={settings} nearby={protoSettings.nearby} onChange={setSettings} onClose={() => setSettingsOpen(false)} />}
        {assistantOpen && (
          <AssistantSheet onClose={() => setAssistantOpen(false)}
            onPick={pickAssistant} />
        )}
        {toast && <div className="proto-toast" role="status">{toast}</div>}
      </div>
    </div>
  );
}
