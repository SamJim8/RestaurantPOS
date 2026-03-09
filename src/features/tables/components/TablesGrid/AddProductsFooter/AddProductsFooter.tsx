import "./add-products-footer.css";

type AddProductsFooterProps = {
  total: number;
  hasItems: boolean;
  onCancelOrderDraft: () => void;
  onPayOrder: () => void;
};

export function AddProductsFooter({
  total,
  hasItems,
  onCancelOrderDraft,
  onPayOrder
}: AddProductsFooterProps) {
  return (
    <div className="add-products-footer">
      <button type="button" onClick={onCancelOrderDraft}>
        Cancelar Pedido
      </button>
      <strong>Total: ${total.toFixed(2)}</strong>
      <button type="button" onClick={onPayOrder} disabled={!hasItems}>
        Pagar
      </button>
    </div>
  );
}
