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
