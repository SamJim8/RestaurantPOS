import { useState } from "react";
import type { OrderItem } from "../../../types/order.types";
import { BillingDocumentModal } from "../BillingDocumentModal/BillingDocumentModal";
import "./add-products-footer.css";

type AddProductsFooterProps = {
  total: number;
  hasItems: boolean;
  tableNumber: number;
  createdAt: string;
  peopleCount: number;
  items: OrderItem[];
  onCancelOrderDraft: () => void;
  onPayOrder: () => void;
};

export function AddProductsFooter({
  total,
  hasItems,
  tableNumber,
  createdAt,
  peopleCount,
  items,
  onCancelOrderDraft,
  onPayOrder
}: AddProductsFooterProps) {
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  return (
    <>
      <div className="add-products-footer">
        <button type="button" onClick={onCancelOrderDraft}>
          Cancelar Pedido
        </button>
        <strong>Total: ${total.toFixed(2)}</strong>
        <button
          type="button"
          onClick={() => setIsBillingModalOpen(true)}
          disabled={!hasItems}
        >
          Pagar
        </button>
      </div>

      <BillingDocumentModal
        isOpen={isBillingModalOpen}
        tableNumber={tableNumber}
        createdAt={createdAt}
        peopleCount={peopleCount}
        items={items}
        total={total}
        onClose={() => setIsBillingModalOpen(false)}
        onConfirmPayment={onPayOrder}
      />
    </>
  );
}
