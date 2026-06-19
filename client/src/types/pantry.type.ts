export type Measurement =
  | "pound"
  | "gram"
  | "ounce"
  | "cup"
  | "teaspoon"
  | "tablespoon"
  | "each"
  | "kilogram"
  | "liter"
  | "piece";

export type StorageType =
  | "Canned"
  | "Fresh"
  | "Frozen"
  | "Dry"
  | "Refrigerated";

export interface PantryItem {
  _id: string;
  name: string;
  quantity: number;
  measurement: Measurement;
  acquiredDate: string;
  expirationDate: string;
  storageType: StorageType;
  storageLocation: string;
  minStockLevel: number;
  trackStock: boolean;
  cost: number;
  createdBy: string;
  updatedBy: string;
}

// Used for pantry item grouping (stretch requirement #5) — multiple lots
// sharing the same name (case-insensitive) collapse into one PantryGroup.
export interface PantryGroup {
  key: string;
  name: string;
  items: PantryItem[];
  totalQuantity: number;
  measurement: Measurement;
  soonestExpiration?: string;
  soonestAcquired?: string;
  isLowStock: boolean;
}

export type PantryRow =
  | { type: "single"; item: PantryItem }
  | { type: "group"; group: PantryGroup };
