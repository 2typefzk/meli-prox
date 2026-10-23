import { ArrowRight } from "lucide-react";

export interface SectionHeaderProps {
  title: string;
  /** Texto do link de ação ("Consultar", "Conferir todas"). Omitir esconde o link. */
  link?: string;
  onLinkClick?: () => void;
}

/** Título de seção da home (18/600) com link de ação índigo + seta. */
export function SectionHeader({ title, link, onLinkClick }: SectionHeaderProps) {
  return (
    <div className="m-section-header">
      <h2 className="m-section-header__title">{title}</h2>
      {link && (
        <button className="m-section-header__link" onClick={onLinkClick}>
          {link} <ArrowRight size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
