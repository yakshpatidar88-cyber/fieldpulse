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
  ArrowUpDown,
  PackageCheck,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
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
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-sage-300" />
            Parts &amp; Inventory Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time warehouse stock levels, pessimistic reservation lock guarding, and automated replenishment.
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
        <div className="bg-[#131D21] border border-sage-300/40 rounded-xl p-3 flex items-center justify-between text-sage-300 text-xs shadow-md">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-sage-300 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorBanner && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-center justify-between text-rose-300 text-xs shadow-md">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorBanner(null)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#131D21] border border-[#22353A] border-t-2 border-t-sage-300/40 rounded-xl p-4 space-y-1 shadow-md hover:border-[#2f4950] transition-all duration-80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Tracked SKUs</span>
            <Tag className="w-4 h-4 text-sage-300" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {totalSKUs}
          </div>
          <div className="text-[11px] text-slate-500">Unique parts cataloged</div>
        </div>

        <div className="bg-[#131D21] border border-[#22353A] border-t-2 border-t-sage-300/50 rounded-xl p-4 space-y-1 shadow-md hover:border-[#2f4950] transition-all duration-80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Available Units</span>
            <PackageCheck className="w-4 h-4 text-sage-300" />
          </div>
          <div className="text-2xl font-mono font-bold text-sage-300">
            {totalUnitsAvailable}
          </div>
          <div className="text-[11px] text-slate-500">Ready for dispatch</div>
        </div>

        <div className="bg-[#131D21] border border-[#22353A] border-t-2 border-t-cyan-500/50 rounded-xl p-4 space-y-1 shadow-md hover:border-[#2f4950] transition-all duration-80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Reserved Units</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-cyan-300">
            {totalUnitsReserved}
          </div>
          <div className="text-[11px] text-slate-500">Pessimistically locked</div>
        </div>

        <div className="bg-[#131D21] border border-[#22353A] border-t-2 border-t-amber-500/50 rounded-xl p-4 space-y-1 shadow-md hover:border-[#2f4950] transition-all duration-80">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400">
            {activeAlertsCount}
          </div>
          <div className="text-[11px] text-slate-500">Below minimum safety line</div>
        </div>
      </div>

      {/* Low Stock Urgent Replenishment Notice */}
      {lowStockAlerts.length > 0 && (
        <div className="bg-[#131D21] border border-amber-500/40 rounded-xl p-5 shadow-xl">
          <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#22353A]">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Automated Replenishment Watchlist
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lowStockAlerts.map((alert) => (
              <div
                key={alert.itemId}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0C1215] border border-amber-500/30 shadow-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      {alert.sku}
                    </span>
                    <span className="text-xs font-semibold text-white truncate max-w-[180px]">
                      {alert.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Avail: <strong className="text-rose-400">{alert.quantityAvailable}</strong> / Safety Min: {alert.minimumThreshold} &bull; Deficit: <span className="font-bold text-rose-400">{alert.deficit}</span>
                  </p>
                  <p className="text-[10px] font-mono text-slate-500">Bin: {alert.warehouseLocation}</p>
                </div>

                {canAdjustStock && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickRestock(alert)}
                    className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs shrink-0"
                  >
                    Restock Now
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
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
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all duration-80 ${
                selectedCategory === cat.id
                  ? 'bg-sage-300 text-[#0C1215] font-bold shadow-sm'
                  : 'bg-[#131D21] border border-[#22353A] text-slate-400 hover:text-white hover:border-[#2f4950]'
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
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#131D21] border border-[#22353A] text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-sage-300 focus:border-sage-300 transition-all duration-80"
          />
        </div>
      </div>

      {/* Main Inventory: Elevated Floating Cards (Option C) */}
      <div className="space-y-2">
        {/* Table Header Labels */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
          <div className="col-span-3">Part / SKU</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Warehouse Bin</div>
          <div className="col-span-2 text-center">Stock Levels</div>
          <div className="col-span-1 text-right">Price</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {isLoading ? (
          <div className="bg-[#131D21] border border-[#22353A] rounded-xl p-16 text-center text-slate-400">
            <div className="w-7 h-7 border-3 border-sage-300/20 border-t-sage-300 rounded-full animate-spin mx-auto mb-2" />
            Loading parts inventory catalog...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-[#131D21] border border-[#22353A] rounded-xl p-12 text-center text-slate-400 text-xs font-mono">
            No inventory items found matching your filters.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isLow = item.lowStock || item.quantityAvailable <= item.minimumThreshold;
            const total = item.quantityAvailable + item.quantityReserved;
            const availPercent = total > 0 ? (item.quantityAvailable / total) * 100 : 0;

            return (
              <div
                key={item.id}
                className="bg-[#131D21] border border-[#22353A] hover:border-sage-300/40 hover:bg-[#162227] rounded-xl p-4 transition-all duration-80 shadow-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-center">
                  {/* Column 1: SKU & Name */}
                  <div className="lg:col-span-3 space-y-0.5">
                    <span className="font-mono text-xs font-bold text-sage-300 bg-sage-300/10 px-1.5 py-0.5 rounded border border-sage-300/20 inline-block">
                      {item.sku}
                    </span>
                    <p className="font-bold text-white text-sm">
                      {item.name}
                    </p>
                    {item.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Column 2: Category */}
                  <div className="lg:col-span-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0C1215] text-slate-300 border border-[#22353A]">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Column 3: Warehouse Bin */}
                  <div className="lg:col-span-2 flex items-center gap-1.5 font-mono text-xs text-slate-300">
                    <Warehouse className="w-3.5 h-3.5 text-sage-300" />
                    <span>{item.warehouseLocation}</span>
                  </div>

                  {/* Column 4: Stock Levels & Progress */}
                  <div className="lg:col-span-2 flex flex-col items-start lg:items-center space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-white">
                        {item.quantityAvailable} avail
                      </span>
                      <span className="text-slate-500">&bull;</span>
                      <span className="text-cyan-400">
                        {item.quantityReserved} res
                      </span>
                    </div>
                    <div className="w-28 h-1.5 bg-[#0C1215] rounded-full overflow-hidden flex border border-[#22353A]">
                      <div
                        style={{ width: `${availPercent}%` }}
                        className={`h-full ${isLow ? 'bg-amber-500' : 'bg-sage-300'}`}
                      />
                      <div
                        style={{ width: `${100 - availPercent}%` }}
                        className="h-full bg-cyan-500"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      Safety Min: {item.minimumThreshold}
                    </span>
                  </div>

                  {/* Column 5: Unit Price */}
                  <div className="lg:col-span-1 text-left lg:text-right font-mono font-bold text-white text-sm">
                    ${item.unitPrice.toFixed(2)}
                  </div>

                  {/* Column 6: Health Status */}
                  <div className="lg:col-span-1 text-left lg:text-center">
                    {item.quantityAvailable === 0 ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        Depleted
                      </span>
                    ) : isLow ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sage-300/15 text-sage-300 border border-sage-300/30">
                        Adequate
                      </span>
                    )}
                  </div>

                  {/* Column 7: Actions */}
                  <div className="lg:col-span-1 text-right">
                    {canAdjustStock && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenAdjustModal(item)}
                        className="text-xs px-2.5"
                      >
                        Adjust
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {isModalOpen && selectedItemForAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1215]/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#131D21] border border-[#22353A] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#22353A]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-sage-300" />
                  Manual Stock Adjustment
                </h3>
                <p className="text-xs text-slate-400 font-mono">Pessimistic write locking on row</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjustment} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#0C1215] border border-[#22353A] space-y-1">
                <span className="font-mono text-[11px] font-bold text-sage-300 bg-sage-300/10 px-1.5 py-0.5 rounded border border-sage-300/20">
                  {selectedItemForAdjust.sku}
                </span>
                <p className="font-semibold text-white">
                  {selectedItemForAdjust.name}
                </p>
                <p className="text-slate-400 font-mono">
                  Current Stock: <strong className="text-white">{selectedItemForAdjust.quantityAvailable}</strong> avail &bull;{' '}
                  <strong className="text-cyan-400">{selectedItemForAdjust.quantityReserved}</strong> reserved
                </p>
              </div>

              {/* Adjustment Mode Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustmentType('ADD')}
                  className={`p-2 rounded-lg font-semibold border text-center transition-all duration-80 font-mono ${
                    adjustmentType === 'ADD'
                      ? 'bg-sage-300/15 border-sage-300 text-sage-300'
                      : 'border-[#22353A] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  + Add / Restock
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentType('SUBTRACT')}
                  className={`p-2 rounded-lg font-semibold border text-center transition-all duration-80 font-mono ${
                    adjustmentType === 'SUBTRACT'
                      ? 'bg-rose-500/15 border-rose-500 text-rose-300'
                      : 'border-[#22353A] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  - Deduct / Variance
                </button>
              </div>

              {/* Quantity Input */}
              <div className="space-y-1">
                <label className="font-medium text-slate-300 font-mono">
                  Quantity ({adjustmentType === 'ADD' ? 'Incoming Units' : 'Units to Deduct'}):
                </label>
                <input
                  type="number"
                  min={1}
                  max={9999}
                  required
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0C1215] border border-[#22353A] text-white focus:outline-none focus:ring-1 focus:ring-sage-300 font-mono"
                />
              </div>

              {/* Reason Input */}
              <div className="space-y-1">
                <label className="font-medium text-slate-300 font-mono">
                  Transaction Reason / PO Reference:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PO-9912 Restock delivery from vendor"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0C1215] border border-[#22353A] text-white focus:outline-none focus:ring-1 focus:ring-sage-300"
                />
              </div>

              {/* Bin Location */}
              <div className="space-y-1">
                <label className="font-medium text-slate-300 font-mono">
                  Warehouse Bin Location:
                </label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0C1215] border border-[#22353A] text-white focus:outline-none focus:ring-1 focus:ring-sage-300 font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#22353A]">
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
