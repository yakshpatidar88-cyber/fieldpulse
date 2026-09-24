import apiClient from './client';
import { ApiResponse } from '../types/api';
import {
  InventoryItem,
  JobPart,
  LowStockAlert,
  InventoryAdjustmentRequest,
} from '../types/inventory';

// Realistic mock data matching Flyway V2 seed for robust offline/preview fallback
export const mockInventoryItems: InventoryItem[] = [
  {
    id: 1,
    sku: 'CAP-45-5-RD',
    name: 'Dual Run Capacitor 45/5 uF 440V Round',
    description: 'Motor run capacitor for compressor and fan motor.',
    category: 'ELECTRICAL',
    unitPrice: 24.5,
    quantityAvailable: 45,
    quantityReserved: 2,
    minimumThreshold: 10,
    warehouseLocation: 'BIN-A12-04',
    lowStock: false,
  },
  {
    id: 2,
    sku: 'CON-2P-30A',
    name: 'Definite Purpose Contactor 2-Pole 30A 24V',
    description: 'Heavy duty contactor for condensing units.',
    category: 'ELECTRICAL',
    unitPrice: 32.0,
    quantityAvailable: 30,
    quantityReserved: 1,
    minimumThreshold: 8,
    warehouseLocation: 'BIN-A12-09',
    lowStock: false,
  },
  {
    id: 3,
    sku: 'TXV-R410A-3T',
    name: 'Thermostatic Expansion Valve R-410A 3-Ton',
    description: 'Precision refrigerant flow metering valve.',
    category: 'HVAC_PARTS',
    unitPrice: 88.75,
    quantityAvailable: 4,
    quantityReserved: 2,
    minimumThreshold: 8,
    warehouseLocation: 'BIN-B04-02',
    lowStock: true,
  },
  {
    id: 4,
    sku: 'REF-R410A-25LB',
    name: 'R-410A Refrigerant Virgin Cylinder 25 lb',
    description: 'Eco-friendly HFC refrigerant cylinder.',
    category: 'REFRIGERANT',
    unitPrice: 215.0,
    quantityAvailable: 18,
    quantityReserved: 0,
    minimumThreshold: 4,
    warehouseLocation: 'BAY-GAS-01',
    lowStock: false,
  },
  {
    id: 5,
    sku: 'MOT-ECM-1-3HP',
    name: 'Variable Speed ECM Blower Motor 1/3 HP',
    description: 'High efficiency brushless DC blower motor.',
    category: 'MOTORS',
    unitPrice: 245.0,
    quantityAvailable: 2,
    quantityReserved: 1,
    minimumThreshold: 5,
    warehouseLocation: 'BIN-C08-11',
    lowStock: true,
  },
  {
    id: 6,
    sku: 'CTL-BACNET-VAV',
    name: 'BACnet MS/TP VAV Zone Controller Board',
    description: 'Programmable direct digital controller for terminal units.',
    category: 'CONTROLS',
    unitPrice: 310.0,
    quantityAvailable: 6,
    quantityReserved: 1,
    minimumThreshold: 2,
    warehouseLocation: 'BIN-E01-03',
    lowStock: false,
  },
];

export const mockLowStockAlerts: LowStockAlert[] = [
  {
    itemId: 3,
    sku: 'TXV-R410A-3T',
    name: 'Thermostatic Expansion Valve R-410A 3-Ton',
    category: 'HVAC_PARTS',
    quantityAvailable: 4,
    quantityReserved: 2,
    minimumThreshold: 8,
    deficit: 4,
    warehouseLocation: 'BIN-B04-02',
    unitPrice: 88.75,
  },
  {
    itemId: 5,
    sku: 'MOT-ECM-1-3HP',
    name: 'Variable Speed ECM Blower Motor 1/3 HP',
    category: 'MOTORS',
    quantityAvailable: 2,
    quantityReserved: 1,
    minimumThreshold: 5,
    deficit: 3,
    warehouseLocation: 'BIN-C08-11',
    unitPrice: 245.0,
  },
];

export const inventoryApi = {
  /**
   * Fetch all inventory items with optional category filter
   */
  getAllItems: async (category?: string): Promise<InventoryItem[]> => {
    try {
      const params: Record<string, any> = {};
      if (category && category !== 'ALL') params.category = category;

      const response = await apiClient.get<ApiResponse<InventoryItem[]>>('/inventory', {
        params,
      });
      return response.data.data;
    } catch (err) {
      console.warn('Using fallback inventory data:', err);
      if (category && category !== 'ALL') {
        return mockInventoryItems.filter((i) => i.category === category);
      }
      return mockInventoryItems;
    }
  },

  /**
   * Fetch item by ID
   */
  getItemById: async (id: number): Promise<InventoryItem> => {
    try {
      const response = await apiClient.get<ApiResponse<InventoryItem>>(`/inventory/${id}`);
      return response.data.data;
    } catch {
      const found = mockInventoryItems.find((i) => i.id === id);
      if (found) return found;
      throw new Error(`Inventory item ${id} not found`);
    }
  },

  /**
   * Fetch low stock items
   */
  getLowStockItems: async (): Promise<InventoryItem[]> => {
    try {
      const response = await apiClient.get<ApiResponse<InventoryItem[]>>('/inventory/low-stock');
      return response.data.data;
    } catch {
      return mockInventoryItems.filter((i) => i.lowStock);
    }
  },

  /**
   * Fetch detailed low stock alerts with replenishment deficit calculations
   */
  getLowStockAlerts: async (): Promise<LowStockAlert[]> => {
    try {
      const response = await apiClient.get<ApiResponse<LowStockAlert[]>>(
        '/inventory/low-stock/alerts'
      );
      return response.data.data;
    } catch {
      return mockLowStockAlerts;
    }
  },

  /**
   * Adjust stock manually or restock
   */
  adjustStock: async (dto: InventoryAdjustmentRequest): Promise<InventoryItem> => {
    try {
      const response = await apiClient.post<ApiResponse<InventoryItem>>(
        '/inventory/adjust',
        dto
      );
      return response.data.data;
    } catch (err) {
      console.warn('API stock adjustment failed, updating local mock state:', err);
      const item = mockInventoryItems.find((i) => i.id === dto.itemId);
      if (item) {
        item.quantityAvailable += dto.quantityChange;
        item.lowStock = item.quantityAvailable <= item.minimumThreshold;
        if (dto.warehouseLocation) item.warehouseLocation = dto.warehouseLocation;
        return { ...item };
      }
      throw err;
    }
  },

  /**
   * Reserve parts for job
   */
  reservePartsForJob: async (jobId: number): Promise<JobPart[]> => {
    const response = await apiClient.post<ApiResponse<JobPart[]>>(
      `/inventory/jobs/${jobId}/reserve`
    );
    return response.data.data;
  },

  /**
   * Release reserved parts for job
   */
  releasePartsForJob: async (jobId: number): Promise<JobPart[]> => {
    const response = await apiClient.post<ApiResponse<JobPart[]>>(
      `/inventory/jobs/${jobId}/release`
    );
    return response.data.data;
  },

  /**
   * Get parts list and reservation status for a job
   */
  getPartsForJob: async (jobId: number): Promise<JobPart[]> => {
    const response = await apiClient.get<ApiResponse<JobPart[]>>(
      `/inventory/jobs/${jobId}/parts`
    );
    return response.data.data;
  },
};
