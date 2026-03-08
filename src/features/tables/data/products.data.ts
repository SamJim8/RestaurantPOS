import type { Product, ProductCategory } from "../types/order.types";

export const productCategories: ProductCategory[] = [
  "Bebidas",
  "Desayunos",
  "Asados",
  "Mariscos",
  "Criollo"
];

export const products: Product[] = [
  { id: "p1", name: "Café Americano", category: "Bebidas", price: 2.5 },
  { id: "p2", name: "Jugo Natural", category: "Bebidas", price: 3.0 },
  { id: "p3", name: "Tigrillo", category: "Desayunos", price: 5.5 },
  { id: "p4", name: "Bolón Mixto", category: "Desayunos", price: 4.75 },
  { id: "p5", name: "Parrillada Personal", category: "Asados", price: 12.0 },
  { id: "p6", name: "Pollo Asado", category: "Asados", price: 8.5 },
  { id: "p7", name: "Ceviche de Camarón", category: "Mariscos", price: 9.5 },
  { id: "p8", name: "Arroz Marinero", category: "Mariscos", price: 11.0 },
  { id: "p9", name: "Seco de Pollo", category: "Criollo", price: 7.0 },
  { id: "p10", name: "Guatita", category: "Criollo", price: 6.5 }
];
