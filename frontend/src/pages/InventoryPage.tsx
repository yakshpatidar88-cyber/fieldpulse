import React, { useEffect, useState, useMemo } from 'react';
import {
  Boxes,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Warehouse,
  Tag,
  DollarSign,
  ArrowUpDown,
  Filter,
  PackageCheck,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { inventoryApi } from '../api/inventory';
import { InventoryItem, LowStockAlert, InventoryAdjustmentRequest } from '../types/inventory';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'ELECTRICAL', label: 'Electrical' },
  { id: 'HVAC_PARTS', label: 'HVAC Parts' },
  { id: 'REFRIGERANT', label: 'Refrigerant' },
  { id: 'MOTORS', label: 'Motors' },
  { id: 'CONTROLS', label: 'Controls' },
];

export const InventoryPage: React.FC = () => {
  const { hasRole, isAdmin, isDispatcher } = useAuth();
  const canAdjustStock = isAdmin || isDispatcher || hasRole('ROLE_ADMIN') || hasRole('ROLE_DISPATCHER');

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Adjustment Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItemForAdjust, setSelectedItemForAdjust] = useState<InventoryItem | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'ADD' | 'SUBTRACT'>('ADD');
  const [quantityInput, setQuantityInput] = useState<number>(5);
  const [reasonInput, setReasonInput] = useState<string>('Standard Restock PO');
  const [locationInput, setLocationInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setErrorBanner(null);
      const [itemsData, alertsData] = await Promise.all([
        inventoryApi.getAllItems(selectedCategory),
        inventoryApi.getLowStockAlerts(),
      ]);
      setItems(itemsData);
      setLowStockAlerts(alertsData);
    } catch (err: any) {
      console.error('Failed to load inventory:', err);
      setErrorBanner('Failed to load inventory catalog.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdjustModal = (item?: InventoryItem) => {
    const target = item || items[0] || null;
    setSelectedItemForAdjust(target);
    setAdjustmentType('ADD');
    setQuantityInput(5);
    setReasonInput('Restock PO replenishment');
    setLocationInput(target?.warehouseLocation || '');
    setIsModalOpen(true);
  };

  const handleQuickRestock = (alert: LowStockAlert) => {
    const item = items.find((i) => i.id === alert.itemId);
    setSelectedItemForAdjust(item || null);
    setAdjustmentType('ADD');
    setQuantityInput(alert.deficit > 0 ? alert.deficit + 5 : 10);
    setReasonInput(`Urgent Low-Stock Replenishment (Deficit: ${alert.deficit})`);
    setLocationInput(alert.warehouseLocation);
    setIsModalOpen(true);
  };

  const handleConfirmAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForAdjust) return;

    try {
      setIsSubmitting(true);
      setErrorBanner(null);
      const change = adjustmentType === 'ADD' ? Math.abs(quantityInput) : -Math.abs(quantityInput);

      const request: InventoryAdjustmentRequest = {
        itemId: selectedItemForAdjust.id,
        quantityChange: change,
        reason: reasonInput,
        warehouseLocation: locationInput || undefined,
      };

      await inventoryApi.adjustStock(request);
      setSuccessBanner(
        `Successfully updated stock for ${selectedItemForAdjust.name} (${change > 0 ? '+' : ''}${change} units).`
      );
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      console.error('Failed to adjust stock:', err);
      setErrorBanner(err?.response?.data?.message || 'Inventory adjustment transaction failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.warehouseLocation.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchesSearch;
    });
  }, [items, searchQuery]);

  const totalSKUs = items.length;
  const totalUnitsAvailable = items.reduce((acc, i) => acc + i.quantityAvailable, 0);
  const totalUnitsReserved = items.reduce((acc, i) => acc + i.quantityReserved, 0);
  const activeAlertsCount = lowStockAlerts.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Boxes className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            Parts &amp; Inventory Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time warehouse stock levels, pessimistic reservation lock guarding, and low-stock replenishment.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          {canAdjustStock && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenAdjustModal()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Stock Adjustment
            </Button>
          )}
        </div>
      </div>

      {/* Success / Error Banners */}
      {successBanner && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="p-1 rounded hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorBanner && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 flex items-center justify-between text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorBanner(null)}
            className="p-1 rounded hover:bg-rose-500/20 text-rose-600 dark:text-rose-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Tracked SKUs</span>
            <Tag className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalSKUs}
          </div>
          <div className="text-[11px] text-slate-400">Unique parts cataloged</div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Available Units</span>
            <PackageCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {totalUnitsAvailable}
          </div>
          <div className="text-[11px] text-slate-400">Ready for job dispatch</div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Reserved Units</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {totalUnitsReserved}
          </div>
          <div className="text-[11px] text-slate-400">Pessimistically locked</div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {activeAlertsCount}
          </div>
          <div className="text-[11px] text-slate-400">Below minimum safety line</div>
        </div>
      </div>

      {/* Low Stock Urgent Replenishment Notice */}
      {lowStockAlerts.length > 0 && (
        <Card
          title="Automated Replenishment Watchlist"
          subtitle="Parts whose available count is below safety reorder threshold"
          className="border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
            {lowStockAlerts.map((alert) => (
              <div
                key={alert.itemId}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-amber-400/40 dark:border-amber-700/50 shadow-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      {alert.sku}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                      {alert.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Avail: <strong className="text-rose-600 dark:text-rose-400">{alert.quantityAvailable}</strong> / Safety Min: {alert.minimumThreshold} &bull; Deficit: <span className="font-bold text-rose-500">{alert.deficit}</span> units
                  </p>
                  <p className="text-[10px] text-slate-400">Location: {alert.warehouseLocation}</p>
                </div>

                {canAdjustStock && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickRestock(alert)}
                    className="border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 text-xs shrink-0"
                  >
                    Restock Now
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Catalog Search & Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU, part, or bin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
          />
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Part / SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Warehouse Bin</th>
                <th className="py-3 px-4 text-center">Stock Levels</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-center">Health Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="w-7 h-7 border-3 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mx-auto mb-2" />
                    Loading parts inventory catalog...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    No inventory items found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.lowStock || item.quantityAvailable <= item.minimumThreshold;
                  const total = item.quantityAvailable + item.quantityReserved;
                  const availPercent = total > 0 ? (item.quantityAvailable / total) * 100 : 0;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 inline-block">
                            {item.sku}
                          </span>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="default" size="sm">
                          {item.category.replace('_', ' ')}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-300">
                          <Warehouse className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.warehouseLocation}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {item.quantityAvailable} avail
                            </span>
                            <span className="text-slate-400">&bull;</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                              {item.quantityReserved} reserved
                            </span>
                          </div>
                          {/* Mini Progress bar */}
                          <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                            <div
                              style={{ width: `${availPercent}%` }}
                              className={`h-full ${
                                isLow ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                            />
                            <div
                              style={{ width: `${100 - availPercent}%` }}
                              className="h-full bg-indigo-500"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Min Safety: {item.minimumThreshold}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                        ${item.unitPrice.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {item.quantityAvailable === 0 ? (
                          <Badge variant="danger" size="sm">
                            Depleted
                          </Badge>
                        ) : isLow ? (
                          <Badge variant="warning" size="sm">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="success" size="sm">
                            Adequate
                          </Badge>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {canAdjustStock && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenAdjustModal(item)}
                            className="text-xs"
                          >
                            Adjust
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {isModalOpen && selectedItemForAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-teal-500" />
                  Manual Stock Adjustment
                </h3>
                <p className="text-xs text-slate-400">Pessimistic write locking on row</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjustment} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="font-mono text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
                  {selectedItemForAdjust.sku}
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedItemForAdjust.name}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Current Stock: <strong>{selectedItemForAdjust.quantityAvailable}</strong> avail &bull;{' '}
                  <strong>{selectedItemForAdjust.quantityReserved}</strong> reserved
                </p>
              </div>

              {/* Adjustment Mode Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustmentType('ADD')}
                  className={`p-2 rounded-lg font-semibold border text-center transition-all ${
                    adjustmentType === 'ADD'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  + Add / Restock
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentType('SUBTRACT')}
                  className={`p-2 rounded-lg font-semibold border text-center transition-all ${
                    adjustmentType === 'SUBTRACT'
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  - Deduct / Variance
                </button>
              </div>

              {/* Quantity Input */}
              <div className="space-y-1">
                <label className="font-medium text-slate-700 dark:text-slate-300">
                  Quantity ({adjustmentType === 'ADD' ? 'Incoming Units' : 'Units to Deduct'}):
                </label>
                <input
                  type="number"
                  min={1}
                  max={9999}
                  required
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Reason Input */}
              <div className="space-y-1">
                <label className="font-medium text-slate-700 dark:text-slate-300">
                  Transaction Reason / PO Reference:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PO-9912 Restock delivery from vendor"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Bin Location */}
              <div className="space-y-1">
                <label className="font-medium text-slate-700 dark:text-slate-300">
                  Warehouse Bin Location:
                </label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                >
                  Confirm Adjustment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
