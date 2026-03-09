import { useMemo, useState } from "react";
import { initialTables } from "../../data/tables.data";
import "./tables-grid.css";
import { Modal } from "../../../../shared/components/Modal/Modal";

const statusLabel = {
  FREE: "Libre",
  IN_PREPARATION: "En Preparación",
  DISPATCHED: "Despachado"
} as const;

export function TablesGrid() {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const selectedTable = useMemo(
    () => initialTables.find((t) => t.id === selectedTableId) ?? null,
    [selectedTableId]
  );
  const getDate = useMemo(() => new Date().toLocaleString(), [])

  const isTakeOrderOpen = selectedTable?.status === "FREE";


  const handleTableClick = (tableId: string) => {
    const table = initialTables.find((t) => t.id === tableId);
    if (!table) return;

    if (table.status === "FREE") {
      setSelectedTableId(table.id);
      setPeopleCount(1);
      return;
    }

   // TODO mostrar pedido activo
  };

  const closeTakeOrderModal = () => {
    setSelectedTableId(null);
    setPeopleCount(1);
  };

  return (
    <section>
      <h2>Mesas</h2>

      <div className="tables-grid">
        {initialTables.map((table, index) => {
          const layoutClass = `layout-${(index % 4) + 1}`;

          return (
            <button
              key={table.id}
              type="button"
              className={`table-card table-card--${table.status} ${layoutClass}`}
              onClick={() => handleTableClick(table.id)}
            >
              <span className="table-card__number">Mesa {table.number}</span>
              <span className="table-card__status">{statusLabel[table.status]}</span>
            </button>
          );
        })}
      </div>

      <Modal
        isOpen={Boolean(isTakeOrderOpen)}
        title={`Tomar Pedido - Mesa ${selectedTable?.number ?? ""}`}
        onClose={closeTakeOrderModal}
      >
        <div className="take-order">
          <p><strong>Mesa:</strong> {selectedTable?.number}</p>
          <p><strong>Fecha:</strong> {getDate}</p>

          <label htmlFor="peopleCount">Número de personas</label>
          <input
            id="peopleCount"
            type="number"
            min={1}
            value={peopleCount}
            onChange={(e) => setPeopleCount(Number(e.target.value) || 1)}
          />

          <div className="order-summary">
            <p><strong>Resumen del pedido</strong></p>
            <p>Aún no hay productos.</p>
          </div>

          <button type="button" onClick={() => alert("Paso 8: Agregar Productos")}>
            Agregar Productos
          </button>
        </div>
      </Modal>
    </section>
  );
}
