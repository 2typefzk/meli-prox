import { useState, type FormEvent } from "react";
import { KeyRound, LayoutGrid, Nfc, ScanLine } from "lucide-react";
import { Button, IconButton, TextField } from "../../src/components";
import { classifyPixKey, type KeyType } from "../data";

export interface PixProps {
  onSubmitKey: (key: string, type: KeyType) => void;
  notify: (msg: string) => void;
  onOpenApproach: () => void;
}

// Figma: App · Pix (19:500)
export function Pix({ onSubmitKey, notify, onOpenApproach }: PixProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const type = classifyPixKey(value);
    if (!type) { setError("Chave inválida. Use CPF, celular (+55…), e-mail ou chave aleatória."); return; }
    onSubmitKey(value.trim(), type);
  };

  return (
    <form className="pix" onSubmit={submit} noValidate>
      <div className="proto-status-bar" />
      <div className="pix__content">
        <div className="pix__header">
          <h1 className="t-h1 home-grow">Pix</h1>
          <IconButton icon={<KeyRound size={22} />} label="Chaves" badge onClick={() => notify("Minhas chaves: disponível em breve")} type="button" />
          <IconButton icon={<LayoutGrid size={22} />} aria-label="Mais opções do Pix" onClick={() => notify("Mais opções: disponível em breve")} type="button" />
          <IconButton icon={<Nfc size={22} />} aria-label="Aproximar e pagar" onClick={() => onOpenApproach()} type="button" />
        </div>

        <div className="pix__search">
          <TextField placeholder="Informe chave" aria-label="Chave Pix" value={value} error={error} helper={value.trim() ? "CPF, celular com +55, e-mail ou chave aleatória" : undefined} autoComplete="off" enterKeyHint="go"
            onChange={(e) => { setValue(e.target.value); setError(undefined); }} />
          <IconButton size="lg" icon={<ScanLine size={22} />} aria-label="Ler QR Code" type="button" onClick={() => notify("Leitor de QR Code: disponível em breve")} />
        </div>

        {!value.trim() && (
          <div className="pix__empty">
            <h2 className="t-h4">Faça seu primeiro Pix</h2>
            <p className="t-body-lg t-secondary">Vamos guardar seus contatos aqui para facilitar os próximos envios.</p>
          </div>
        )}
      </div>
      {value.trim() && (
        <div className="pix__footer">
          <Button fullWidth type="submit">Continuar</Button>
        </div>
      )}
    </form>
  );
}
