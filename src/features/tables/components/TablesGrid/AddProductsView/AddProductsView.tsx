import { products, productCategories } from "../../../data/products.data";
import type { OrderItem, ProductCategory } from "../../../types/order.types";
import "./add-products-view.css";

type AddProductsViewProps = {
  selectedCategory: ProductCategory;
  items: OrderItem[];
  onCategoryChange: (category: ProductCategory) => void;
  onAddProduct: (productId: string) => void;
  onChangeQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onUpdateNotes: (productId: string, notes: string) => void;
};

export function AddProductsView({
  selectedCategory,
  items,
  onCategoryChange,
  onAddProduct,
  onChangeQty,
  onRemoveItem,
  onUpdateNotes
}: AddProductsViewProps) {
  return (
    <div className="add-products-grid">
      <aside className="col">
        <h4>Categorías</h4>
        {productCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={cat === selectedCategory ? "is-active" : ""}
            onClick={() => onCategoryChange(cat)}
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
            <button key={p.id} type="button" onClick={() => onAddProduct(p.id)}>
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
            <p>
              ${item.unitPrice.toFixed(2)} x {item.quantity}
            </p>
            <p>Subtotal: ${(item.unitPrice * item.quantity).toFixed(2)}</p>

            <div className="qty-actions">
              <button
                type="button"
                onClick={() => onChangeQty(item.productId, -1)}
              >
                -
              </button>
              <button
                type="button"
                onClick={() => onChangeQty(item.productId, +1)}
              >
                +
              </button>
              <button type="button" onClick={() => onRemoveItem(item.productId)}>
                Eliminar
              </button>
            </div>

            <input
              type="text"
              placeholder="Nota opcional"
              value={item.notes ?? ""}
              onChange={(e) => onUpdateNotes(item.productId, e.target.value)}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
