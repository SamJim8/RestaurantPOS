import type { Order } from "../../../types/order.types";
import type { RestaurantTable } from "../../../types/table.types";
import "./active-order-view.css";

type ActiveOrderViewProps = {
  selectedTable: RestaurantTable;
  activeOrder: Order;
  activeOrderTotal: number;
  onMarkAsDispatched: () => void;
  onMarkAsFree: () => void;
};

export function ActiveOrderView({
  selectedTable,
  activeOrder,
  activeOrderTotal,
  onMarkAsDispatched,
  onMarkAsFree
}: ActiveOrderViewProps) {
  return (
    <div className="active-order">
      <p>
        <strong>Mesa:</strong> {selectedTable.number}
      </p>
      <p>
        <strong>Fecha:</strong> {new Date(activeOrder.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Personas:</strong> {activeOrder.peopleCount}
      </p>

      <div className="active-order-list">
        {activeOrder.items.map((item) => (
          <div key={item.productId} className="active-order-item">
            <p>
              <strong>{item.name}</strong>
            </p>
            <p>Cantidad: {item.quantity}</p>
            <p>Precio unitario: ${item.unitPrice.toFixed(2)}</p>
            <p>Subtotal: ${(item.unitPrice * item.quantity).toFixed(2)}</p>
            {item.notes ? <p>Nota: {item.notes}</p> : null}
          </div>
        ))}
      </div>

      <div className="active-order-footer">
        <strong>Total: ${activeOrderTotal.toFixed(2)}</strong>
        {selectedTable.status === "IN_PREPARATION" ? (
          <button
            type="button"
            className="active-order-action active-order-action--dispatch"
            onClick={onMarkAsDispatched}
          >
            Marcar como Despachado
          </button>
        ) : (
          <button
            type="button"
            className="active-order-action active-order-action--free"
            onClick={onMarkAsFree}
          >
            Marcar como Libre
          </button>
        )}
      </div>
    </div>
  );
}
