import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Lock } from "lucide-react";

/* Acesso ao protótipo: tela preta + senha fixa. É só uma cortina no cliente (o bundle é público),
 * não uma proteção real. Guardamos o hash SHA-256 em vez da senha em texto. */
const HASH = "3c1843d8b9c81ae5a00861b1792c4e61c26c6181840ef727cfc550491368cef1";
const KEY = "meli-prox:unlocked";

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
const read = () => { try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; } };

export function Gate({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(read);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [leaving, setLeaving] = useState(false);

  if (open) return <>{children}</>;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if ((await sha256(value.trim())) !== HASH) { setError(true); setValue(""); return; }
    try { sessionStorage.setItem(KEY, "1"); } catch { /* sem storage: pede de novo na próxima visita */ }
    setLeaving(true);
    setTimeout(() => setOpen(true), 350);
  };

  return (
    <div className={`gate${leaving ? " is-leaving" : ""}`}>
      <form className="gate__form" onSubmit={submit}>
        <Lock size={22} className="gate__icon" aria-hidden />
        <label htmlFor="gate-pass" className="gate__label">Senha de acesso</label>
        <div className={`gate__field${error ? " is-error" : ""}`}>
          <input id="gate-pass" type="password" autoFocus autoComplete="off" value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }} aria-invalid={error} aria-describedby="gate-msg" />
          <button type="submit" aria-label="Entrar" disabled={!value}><ArrowRight size={20} /></button>
        </div>
        <p id="gate-msg" className="gate__msg" role="alert">{error ? "Senha incorreta" : " "}</p>
      </form>
    </div>
  );
}
