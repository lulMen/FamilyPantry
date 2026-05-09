export type Measurement =
  | "pounds"
  | "grams"
  | "ounces"
  | "cups"
  | "teaspoons"
  | "tablespoons"
  | "each"
  | "kilograms"
  | "liters"
  | "pieces";

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
