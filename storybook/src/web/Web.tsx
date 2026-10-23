import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Search, MapPin, ShoppingCart, BedDouble, Zap } from "lucide-react";

export interface WebButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** loud = "Comprar agora"; quiet = "Adicionar ao carrinho" */
  hierarchy?: "loud" | "quiet";
  fullWidth?: boolean;
  children: ReactNode;
}
export function WebButton({ hierarchy = "loud", fullWidth, children, ...rest }: WebButtonProps) {
  return <button className={`w-btn w-btn--${hierarchy}${fullWidth ? " w-btn--full" : ""}`} {...rest}>{children}</button>;
}

export function WebHeader() {
  return (
    <header className="w-header">
      <div className="w-header__inner">
        <span className="w-logo">mercado livre</span>
        <form className="w-search" role="search" onSubmit={(e) => e.preventDefault()}>
          <input placeholder="Buscar produtos, marcas e muito mais…" aria-label="Buscar" />
          <button aria-label="Buscar"><Search size={18} /></button>
        </form>
        <span className="t-caption" style={{ fontFamily: "var(--font-web)" }}>Assine o meli+</span>
        <span className="w-header__nav" style={{ alignItems: "center", gap: 6 }}><MapPin size={16} /> Enviar para Felipe</span>
        <nav className="w-header__nav"><a href="#">Categorias</a><a href="#">Ofertas</a><a href="#">Cupons</a><a href="#">Supermercado</a><a href="#">Moda</a><a href="#">Vender</a></nav>
        <div className="w-header__user"><span>Minhas compras</span><span>Favoritos</span><ShoppingCart size={20} /></div>
      </div>
    </header>
  );
}

export interface ProductCardProps {
  title: string;
  price: string;
  cents?: string;
  oldPrice?: string;
  off?: string;
  installments?: string;
  shipping?: string;
  full?: boolean;
  pill?: { label: string; tone?: "blue" | "orange" };
}
export function ProductCard({ title, price, cents, oldPrice, off, installments, shipping, full, pill }: ProductCardProps) {
  return (
    <article className="w-pcard">
      <div className="w-pcard__img"><BedDouble size={96} strokeWidth={1} color="#9A99A8" /></div>
      <div className="w-pcard__body">
        {pill && <span className={`w-pill${pill.tone === "orange" ? " w-pill--orange" : ""}`}>{pill.label}</span>}
        <h3 className="w-pcard__title">{title}</h3>
        {oldPrice && <span className="w-pcard__old">R$ {oldPrice}</span>}
        <div className="w-pcard__price">
          <span>R$ {price}{cents && <sup>{cents}</sup>}</span>
          {off && <span className="w-pcard__off">{off}</span>}
        </div>
        {installments && <span className="w-pcard__inst">{installments}</span>}
        {shipping && <span className="w-pcard__ship">{shipping} {full && <span className="w-pcard__full"><Zap size={12} fill="currentColor" style={{ verticalAlign: -1 }} />FULL</span>}</span>}
      </div>
    </article>
  );
}

export function WebFooter() {
  return (
    <footer className="w-footer">
      <div className="w-footer__inner">
        <nav className="w-footer__links">
          {["Trabalhe conosco", "Termos e condições", "Como cuidamos da sua privacidade", "Acessibilidade", "Contato", "Informações sobre seguros", "Programa de Afiliados"].map((l) => <a key={l} href="#">{l}</a>)}
        </nav>
        <span>Copyright © Ebazar.com.br LTDA. — Av. das Nações Unidas, nº 3.003, Osasco/SP</span>
      </div>
    </footer>
  );
}
