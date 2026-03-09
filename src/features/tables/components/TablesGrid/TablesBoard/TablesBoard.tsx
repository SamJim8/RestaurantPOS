import type { RestaurantTable } from "../../../types/table.types";
import { TableCardButton } from "../TableCardButton/TableCardButton";
import "./tables-board.css";

type TablesBoardProps = {
  tables: RestaurantTable[];
  onTableClick: (tableId: string) => void;
};

export function TablesBoard({ tables, onTableClick }: TablesBoardProps) {
  return (
    <div className="tables-grid">
      {tables.map((table, index) => (
        <TableCardButton
          key={table.id}
          table={table}
          index={index}
          onClick={onTableClick}
        />
      ))}
    </div>
  );
}
