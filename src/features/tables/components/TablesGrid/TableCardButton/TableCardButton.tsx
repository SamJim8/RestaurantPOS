import type { RestaurantTable } from "../../../types/table.types";
import "./table-card-button.css";

const statusLabel = {
  FREE: "Libre",
  IN_PREPARATION: "En Preparación",
  DISPATCHED: "Despachado"
} as const;

type TableCardButtonProps = {
  table: RestaurantTable;
  index: number;
  onClick: (tableId: string) => void;
};

export function TableCardButton({ table, index, onClick }: TableCardButtonProps) {
  const layoutClass = `layout-${(index % 4) + 1}`;

  return (
    <button
      type="button"
      className={`table-card table-card--${table.status} ${layoutClass}`}
      onClick={() => onClick(table.id)}
    >
      <span className="table-card__number">Mesa {table.number}</span>
      <span className="table-card__status">{statusLabel[table.status]}</span>
    </button>
  );
}
