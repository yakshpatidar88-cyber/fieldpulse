export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  description?: string;
  category: string;
  unitPrice: number;
  quantityAvailable: number;
  quantityReserved: number;
  minimumThreshold: number;
  warehouseLocation: string;
  lowStock: boolean;
}

export interface JobPart {
  jobPartId: number;
  jobId: number;
  jobNumber: string;
  inventoryItemId: number;
  sku: string;
  partName: string;
  quantityRequired: number;
  unitPrice: number;
  totalPrice: number;
  status: 'REQUESTED' | 'RESERVED' | 'CONSUMED' | 'RELEASED';
  reservedAt?: string;
  consumedAt?: string;
}

export interface LowStockAlert {
  itemId: number;
  sku: string;
  name: string;
  category: string;
  quantityAvailable: number;
  quantityReserved: number;
  minimumThreshold: number;
  deficit: number;
  warehouseLocation: string;
  unitPrice: number;
}

export interface InventoryAdjustmentRequest {
  itemId: number;
  quantityChange: number;
  reason?: string;
  warehouseLocation?: string;
}
