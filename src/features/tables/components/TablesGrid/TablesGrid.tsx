import { useMemo, useState } from "react";
import { initialTables } from "../../data/tables.data";
import { Modal } from "../../../../shared/components/Modal/Modal";
import { products } from "../../data/products.data";
import type { OrderItem, ProductCategory } from "../../types/order.types";
import type { Order } from "../../types/order.types";
import { TablesBoard } from "./TablesBoard/TablesBoard";
import { TakeOrderView } from "./TakeOrderView/TakeOrderView";
import { AddProductsView } from "./AddProductsView/AddProductsView";
import { AddProductsFooter } from "./AddProductsFooter/AddProductsFooter";
import { ActiveOrderView } from "./ActiveOrderView/ActiveOrderView";

type ModalView = "TAKE_ORDER" | "ADD_PRODUCTS" | "ACTIVE_ORDER";

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

  const isModalOpen = Boolean(selectedTableId);

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
    setDraftCreatedAt(new Date().toISOString());
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

    setSelectedTableId(null);
    setModalView("TAKE_ORDER");
    setItems([]);
    setPeopleCount(1);
    setDraftCreatedAt("");
  };

  return (
    <section>
      <h2>Mesas</h2>

      <TablesBoard tables={tables} onTableClick={handleTableClick} />

      <Modal
        isOpen={isModalOpen}
        title={`Tomar Pedido - Mesa ${selectedTable?.number ?? ""}`}
        onClose={closeTakeOrderModal}
      >
        {modalView === "TAKE_ORDER" && (
          <TakeOrderView
            tableNumber={selectedTable?.number}
            draftCreatedAt={draftCreatedAt}
            peopleCount={peopleCount}
            itemsCount={items.length}
            onPeopleCountChange={setPeopleCount}
            onGoToAddProducts={() => setModalView("ADD_PRODUCTS")}
          />
        )}

        {modalView === "ADD_PRODUCTS" && (
          <AddProductsView
            selectedCategory={selectedCategory}
            items={items}
            onCategoryChange={setSelectedCategory}
            onAddProduct={addProduct}
            onChangeQty={changeQty}
            onRemoveItem={removeItem}
            onUpdateNotes={updateNotes}
          />
        )}

        {modalView === "ADD_PRODUCTS" && (
          <AddProductsFooter
            total={total}
            hasItems={items.length > 0}
            tableNumber={selectedTable?.number ?? 0}
            createdAt={draftCreatedAt}
            peopleCount={peopleCount}
            items={items}
            onCancelOrderDraft={cancelOrderDraft}
            onPayOrder={payOrder}
          />
        )}

        {modalView === "ACTIVE_ORDER" && selectedTable && activeOrder && (
          <ActiveOrderView
            selectedTable={selectedTable}
            activeOrder={activeOrder}
            activeOrderTotal={activeOrderTotal}
            onMarkAsDispatched={markAsDispatched}
            onMarkAsFree={markAsFree}
          />
        )}

        {modalView === "ACTIVE_ORDER" && (!selectedTable || !activeOrder) && (
          <p>No se encontró el pedido activo de esta mesa.</p>
        )}
      </Modal>
    </section>
  );
}
