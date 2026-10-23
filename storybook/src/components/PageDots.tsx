export interface PageDotsProps {
  count: number;
  active: number;
}

export function PageDots({ count, active }: PageDotsProps) {
  return (
    <div className="m-dots" role="tablist" aria-label="Paginação">
      {Array.from({ length: count }, (_, i) => <span key={i} data-active={i === active} role="tab" aria-selected={i === active} />)}
    </div>
  );
}
