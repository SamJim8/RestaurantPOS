import { useMemo, useState } from "react";
import { initialTables } from "../../data/tables.data";
import "./tables-grid.css";
import { Modal } from "../../../../shared/components/Modal/Modal";
import { products, productCategories } from "../../data/products.data";
import type { OrderItem, ProductCategory } from "../../types/order.types";
import type { Order } from "../../types/order.types";



const statusLabel = {
  FREE: "Libre",
  IN_PREPARATION: "En Preparación",
  DISPATCHED: "Despachado"
} as const;

export function TablesGrid() {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [tables, setTables] = useState(initialTables);
  const [ordersByTableId, setOrdersByTableId] = useState<Record<string, Order>>({});
  const [draftCreatedAt, setDraftCreatedAt] = useState<string>("");





  const selectedTable = useMemo(
    () => tables.find((t) => t.id === selectedTableId) ?? null,
    [selectedTableId, tables]
  );
  const activeOrder = selectedTableId ? ordersByTableId[selectedTableId] : undefined;
  const activeOrderTotal = activeOrder
    ? activeOrder.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
    : 0;
  const getDate = useMemo(() => new Date().toLocaleString(), [])

  const isModalOpen = Boolean(selectedTableId);

  type ModalView = "TAKE_ORDER" | "ADD_PRODUCTS" | "ACTIVE_ORDER";

  const [modalView, setModalView] = useState<ModalView>("TAKE_ORDER");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("Bebidas");
  const [items, setItems] = useState<OrderItem[]>([]);

  const handleTableClick = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;

    if (table.status === "FREE") {
      openTakeOrder(table.id);
      return;
    }

    setSelectedTableId(table.id);
    setModalView("ACTIVE_ORDER");
  };

  const addProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setItems((prev) => {
      const exists = prev.find((i) => i.productId === product.id);
      if (exists) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          quantity: 1,
          notes: ""
        }
      ];
    });
  };

  const changeQty = (productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateNotes = (productId: string, notes: string) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, notes } : i))
    );
  };

  const total = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const cancelOrderDraft = () => {
    setItems([]);
    setPeopleCount(1);
    setModalView("TAKE_ORDER");
  };

  const openTakeOrder = (tableId: string) => {
    setSelectedTableId(tableId);
    setPeopleCount(1);
    setItems([]);
    setSelectedCategory("Bebidas");
    setModalView("TAKE_ORDER");
    setDraftCreatedAt(getDate);
  };

  const payOrder = () => {
    if (!selectedTableId) return;
    if (items.length === 0) {
      alert("Agrega al menos un producto antes de pagar.");
      return;
    }

    const table = tables.find((t) => t.id === selectedTableId);
    if (!table) return;

    const newOrder: Order = {
      id: crypto.randomUUID(),
      tableId: table.id,
      tableNumber: table.number,
      createdAt: draftCreatedAt || new Date().toISOString(),
      peopleCount,
      items
    };

    setOrdersByTableId((prev) => ({ ...prev, [table.id]: newOrder }));

    setTables((prev) =>
      prev.map((t) =>
        t.id === table.id
          ? { ...t, status: "IN_PREPARATION", currentOrderId: newOrder.id }
          : t
      )
    );

    // reset modal draft
    setSelectedTableId(null);
    setPeopleCount(1);
    setItems([]);
    setModalView("TAKE_ORDER");
    setDraftCreatedAt("");
  };

  const closeTakeOrderModal = () => {
    setSelectedTableId(null);
    setPeopleCount(1);
  };

  const markAsDispatched = () => {
    if (!selectedTableId) return;

    setTables((prev) =>
      prev.map((table) =>
        table.id === selectedTableId
          ? { ...table, status: "DISPATCHED" }
          : table
      )
    );
  };

  const markAsFree = () => {
    if (!selectedTableId) return;

    setTables((prev) =>
      prev.map((table) =>
        table.id === selectedTableId
          ? { ...table, status: "FREE", currentOrderId: null }
          : table
      )
    );

    setOrdersByTableId((prev) => {
      const next = { ...prev };
      delete next[selectedTableId];
      return next;
    });

    // reset modal
    setSelectedTableId(null);
    setModalView("TAKE_ORDER");
    setItems([]);
    setPeopleCount(1);
    setDraftCreatedAt("");
  };


  return (
    <section>
      <h2>Mesas</h2>

      <div className="tables-grid">
        {tables.map((table, index) => {
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
        isOpen={isModalOpen}
        title={`Tomar Pedido - Mesa ${selectedTable?.number ?? ""}`}
        onClose={closeTakeOrderModal}
      >
        {modalView === "TAKE_ORDER" && (
          <div className="take-order">
            <p><strong>Mesa:</strong> {selectedTable?.number}</p>
            <p><strong>Fecha:</strong> {draftCreatedAt ? new Date(draftCreatedAt).toLocaleString() : "-"}</p>


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
              {items.length === 0 ? (
                <p>Aún no hay productos.</p>
              ) : (
                <p>{items.length} producto(s) agregado(s)</p>
              )}
            </div>

            <button type="button" onClick={() => setModalView("ADD_PRODUCTS")}>
              Agregar Productos
            </button>
          </div>
        )}

        {modalView === "ADD_PRODUCTS" && (
          <div className="add-products-grid">
            <aside className="col">
              <h4>Categorías</h4>
              {productCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={cat === selectedCategory ? "is-active" : ""}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </aside>

            <section className="col">
              <h4>Productos</h4>
              {products
                .filter((p) => p.category === selectedCategory)
                .map((p) => (
                  <button key={p.id} type="button" onClick={() => addProduct(p.id)}>
                    {p.name} - ${p.price.toFixed(2)}
                  </button>
                ))}
            </section>

            <section className="col">
              <h4>Resumen</h4>
              {items.length === 0 && <p>Sin productos.</p>}

              {items.map((item) => (
                <div key={item.productId} className="item-row">
                  <p>{item.name}</p>
                  <p>${item.unitPrice.toFixed(2)} x {item.quantity}</p>
                  <p>Subtotal: ${(item.unitPrice * item.quantity).toFixed(2)}</p>

                  <div className="qty-actions">
                    <button type="button" onClick={() => changeQty(item.productId, -1)}>-</button>
                    <button type="button" onClick={() => changeQty(item.productId, +1)}>+</button>
                    <button type="button" onClick={() => removeItem(item.productId)}>Eliminar</button>
                  </div>

                  <input
                    type="text"
                    placeholder="Nota opcional"
                    value={item.notes ?? ""}
                    onChange={(e) => updateNotes(item.productId, e.target.value)}
                  />
                </div>
              ))}
            </section>
          </div>
        )}

        {modalView === "ADD_PRODUCTS" && (
          <div className="add-products-footer">
            <button type="button" onClick={cancelOrderDraft}>Cancelar Pedido</button>
            <strong>Total: ${total.toFixed(2)}</strong>
            <button type="button" onClick={payOrder} disabled={items.length === 0}>
              Pagar
            </button>

          </div>
        )}

        {modalView === "ACTIVE_ORDER" && selectedTable && activeOrder && (
          <div className="active-order">
            <p><strong>Mesa:</strong> {selectedTable.number}</p>
            <p><strong>Fecha:</strong> {new Date(activeOrder.createdAt).toLocaleString()}</p>
            <p><strong>Personas:</strong> {activeOrder.peopleCount}</p>

            <div className="active-order-list">
              {activeOrder.items.map((item) => (
                <div key={item.productId} className="active-order-item">
                  <p><strong>{item.name}</strong></p>
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
                <button type="button" onClick={markAsDispatched}>
                  Marcar como Despachado
                </button>
              ) : (
                <button type="button" onClick={markAsFree}>
                  Marcar como Libre
                </button>

              )}

            </div>
          </div>
        )}

        {modalView === "ACTIVE_ORDER" && (!selectedTable || !activeOrder) && (
          <p>No se encontró el pedido activo de esta mesa.</p>
        )}




      </Modal>


    </section>
  );
}
