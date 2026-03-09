import type { RestaurantTable } from "../../../types/table.types";
import "./table-card-button.css";

const statusLabel = {
  FREE: "Libre",
  IN_PREPARATION: "En Preparación",
  DISPATCHED: "Despachado"
} as const;

type TableCardButtonProps = {
  table: RestaurantTable;
  onClick: (tableId: string) => void;
};

export function TableCardButton({ table, onClick }: TableCardButtonProps) {
  return (
    <button
      type="button"
      className={`table-card table-card--${table.status}`}
      onClick={() => onClick(table.id)}
    >
      <span className="table-card__label">Mesa</span>
      <span className="table-card__number">{table.number}</span>
      <span
        className={`table-card__status-badge table-card__status-badge--${table.status}`}
      >
        {statusLabel[table.status]}
      </span>
    </button>
  );
}
