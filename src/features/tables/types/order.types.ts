import type { ID, ISODateString } from "../../../shared/types/common.types";

export type ProductCategory =
  | "Bebidas"
  | "Desayunos"
  | "Asados"
  | "Mariscos"
  | "Criollo";

export interface Product {
  id: ID;
  name: string;
  category: ProductCategory;
  price: number;
}

export interface OrderItem {
  productId: ID;
  name: string;
  unitPrice: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: ID;
  tableId: ID;
  tableNumber: number;
  createdAt: ISODateString;
  peopleCount: number;
  items: OrderItem[];
}
