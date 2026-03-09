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
  const dateLabel = draftCreatedAt
    ? new Date(draftCreatedAt).toLocaleString()
    : "-";

  const decreasePeople = () => {
    onPeopleCountChange(Math.max(1, peopleCount - 1));
  };

  const increasePeople = () => {
    onPeopleCountChange(peopleCount + 1);
  };

  return (
    <div className="take-order">
      <section className="take-order__header-card">
        <p className="take-order__eyebrow">Nueva Comanda</p>
        <h4 className="take-order__table-title">Mesa {tableNumber}</h4>
        <p className="take-order__date">Creado: {dateLabel}</p>
      </section>

      <section className="take-order__section">
        <label htmlFor="peopleCount" className="take-order__label">
          Número de personas
        </label>
        <div className="take-order__counter">
          <button type="button" onClick={decreasePeople} aria-label="Reducir personas">
            -
          </button>
          <input
            id="peopleCount"
            type="number"
            min={1}
            value={peopleCount}
            onChange={(e) => onPeopleCountChange(Number(e.target.value) || 1)}
          />
          <button type="button" onClick={increasePeople} aria-label="Aumentar personas">
            +
          </button>
        </div>
      </section>

      <section className="order-summary">
        <p className="order-summary__title">Resumen del pedido</p>
        {itemsCount === 0 ? (
          <p className="order-summary__detail">Aún no hay productos.</p>
        ) : (
          <p className="order-summary__detail">{itemsCount} producto(s) agregado(s)</p>
        )}
      </section>

      <button type="button" className="take-order__cta" onClick={onGoToAddProducts}>
        Agregar Productos
      </button>
    </div>
  );
}
