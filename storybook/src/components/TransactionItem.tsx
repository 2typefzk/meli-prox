import type { ReactNode } from "react";

export interface TransactionItemProps {
  title: string;
  kind: string;
  method: string;
  methodIcon?: ReactNode;
  amount: string;
  date: string;
  thumb?: ReactNode;
}

export function TransactionItem({ title, kind, method, methodIcon, amount, date, thumb }: TransactionItemProps) {
  return (
    <div className="m-tx">
      <span className="m-tx__thumb">{thumb}</span>
      <div className="m-tx__main">
        <div className="m-tx__title">{title}</div>
        <div className="t-caption t-secondary">{kind}</div>
        <div className="m-tx__meta">{methodIcon}{method}</div>
      </div>
      <div>
        <div className="m-tx__amount">{amount}</div>
        <div className="m-tx__date">{date}</div>
      </div>
    </div>
  );
}
