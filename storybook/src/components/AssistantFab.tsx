import { Sparkles } from "lucide-react";

export interface AssistantFabProps {
  onClick?: () => void;
}

/** Botão flutuante do assistente de IA ("Mago"): esfera amarela com brilho e ícone de faísca índigo. */
export function AssistantFab({ onClick }: AssistantFabProps) {
  return (
    <button className="m-fab-ai" aria-label="Abrir assistente" onClick={onClick}>
      <Sparkles size={26} fill="currentColor" strokeWidth={1.5} />
    </button>
  );
}
