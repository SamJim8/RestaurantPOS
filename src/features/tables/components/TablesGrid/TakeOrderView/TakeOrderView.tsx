import "./take-order-view.css";

type TakeOrderViewProps = {
  tableNumber?: number;
  draftCreatedAt: string;
  peopleCount: number;
  itemsCount: number;
  onPeopleCountChange: (value: number) => void;
  onGoToAddProducts: () => void;
};

export function TakeOrderView({
  tableNumber,
  draftCreatedAt,
  peopleCount,
  itemsCount,
  onPeopleCountChange,
  onGoToAddProducts
}: TakeOrderViewProps) {
  return (
    <div className="take-order">
      <p>
        <strong>Mesa:</strong> {tableNumber}
      </p>
      <p>
        <strong>Fecha:</strong>{" "}
        {draftCreatedAt ? new Date(draftCreatedAt).toLocaleString() : "-"}
      </p>

      <label htmlFor="peopleCount">Número de personas</label>
      <input
        id="peopleCount"
        type="number"
        min={1}
        value={peopleCount}
        onChange={(e) => onPeopleCountChange(Number(e.target.value) || 1)}
      />

      <div className="order-summary">
        <p>
          <strong>Resumen del pedido</strong>
        </p>
        {itemsCount === 0 ? (
          <p>Aún no hay productos.</p>
        ) : (
          <p>{itemsCount} producto(s) agregado(s)</p>
        )}
      </div>

      <button type="button" onClick={onGoToAddProducts}>
        Agregar Productos
      </button>
    </div>
  );
}
