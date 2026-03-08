import type { ID } from "../../../shared/types/common.types";

export type TableStatus = "FREE" | "IN_PREPARATION" | "DISPATCHED";

export interface RestaurantTable {
  id: ID;
  number: number;
  status: TableStatus;
  currentOrderId: ID | null;
}