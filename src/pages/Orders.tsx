// src/pages/Orders.tsx
import { createSignal, createEffect, onMount, Show, For } from 'solid-js';
import { Search, RefreshCw, Plus, Eye, Edit, Trash2, Package, Truck, CheckCircle, AlertTriangle, TrendingUp, Database, Zap, X } from 'lucide-solid';
import { toast } from 'solid-toast';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'fulfillment' | 'shipped' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  estimatedDelivery: string;
  trackingNumber?: string;
  fulfillmentLocation: string;
  inventorySync: boolean;
  assetAllocation: string[];
}

interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  availableStock: number;
  reservedStock: number;
  location: string;
}

interface InventoryStatus {
  totalItems: number;
  lowStock: number;
  outOfStock: number;
  syncStatus: 'synced' | 'syncing' | 'error';
  lastSync: string;
}

interface RealTimeMetrics {
  ordersToday: number;
  pendingFulfillment: number;
  syncErrors: number;
  avgProcessingTime: string;
}

const Orders = () => {
  const [orders, setOrders] = createSignal<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = createSignal<Order[]>([]);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [statusFilter, setStatusFilter] = createSignal('all');
  const [priorityFilter, setPriorityFilter] = createSignal('all');
  const [selectedOrder, setSelectedOrder] = createSignal<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [inventoryStatus, setInventoryStatus] = createSignal<InventoryStatus>({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    syncStatus: 'synced',
    lastSync: new Date().toLocaleTimeString()
  });
  const [realTimeMetrics, setRealTimeMetrics] = createSignal<RealTimeMetrics>({
    ordersToday: 0,
    pendingFulfillment: 0,
    syncErrors: 0,
    avgProcessingTime: '0m'
  });
  const [isRealTimeConnected] = createSignal(true);

  // Mock data untuk demo
  onMount(() => {
    loadMockData();
    startRealTimeUpdates();
  });

  const loadMockData = () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-2025-001',
        customerName: 'PT. Teknologi Nusantara',
        items: [
          {
            id: '1',
            productName: 'Fiber Optic Cable SM-6',
            sku: 'FOC-SM6-1000',
            quantity: 500,
            unitPrice: 25000,
            availableStock: 1200,
            reservedStock: 500,
            location: 'Warehouse A'
          },
          {
            id: '2',
            productName: 'Optical Splitter 1:8',
            sku: 'OPT-SPL-18',
            quantity: 20,
            unitPrice: 450000,
            availableStock: 50,
            reservedStock: 20,
            location: 'Warehouse B'
          }
        ],
        status: 'processing',
        priority: 'high',
        createdAt: '2025-01-08T10:30:00Z',
        updatedAt: '2025-01-08T14:45:00Z',
        totalAmount: 21500000,
        estimatedDelivery: '2025-01-12',
        fulfillmentLocation: 'Jakarta Distribution Center',
        inventorySync: true,
        assetAllocation: ['WH-A-001', 'WH-B-002']
      },
      {
        id: '2',
        orderNumber: 'ORD-2025-002',
        customerName: 'CV. Internet Mandiri',
        items: [
          {
            id: '3',
            productName: 'ONT Router Dual Band',
            sku: 'ONT-RDB-2024',
            quantity: 100,
            unitPrice: 850000,
            availableStock: 25,
            reservedStock: 100,
            location: 'Warehouse C'
          }
        ],
        status: 'pending',
        priority: 'urgent',
        createdAt: '2025-01-08T08:15:00Z',
        updatedAt: '2025-01-08T08:15:00Z',
        totalAmount: 85000000,
        estimatedDelivery: '2025-01-10',
        fulfillmentLocation: 'Surabaya Distribution Center',
        inventorySync: false,
        assetAllocation: ['WH-C-001']
      },
      {
        id: '3',
        orderNumber: 'ORD-2025-003',
        customerName: 'PT. Solusi Digital',
        items: [
          {
            id: '4',
            productName: 'Ethernet Switch 24-Port',
            sku: 'ETH-SW-24P',
            quantity: 10,
            unitPrice: 1200000,
            availableStock: 15,
            reservedStock: 10,
            location: 'Warehouse A'
          }
        ],
        status: 'fulfillment',
        priority: 'medium',
        createdAt: '2025-01-07T16:20:00Z',
        updatedAt: '2025-01-08T09:30:00Z',
        totalAmount: 12000000,
        estimatedDelivery: '2025-01-11',
        trackingNumber: 'TRK-001-2025',
        fulfillmentLocation: 'Jakarta Distribution Center',
        inventorySync: true,
        assetAllocation: ['WH-A-003']
      }
    ];

    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
    
    // Mock inventory status
    setInventoryStatus({
      totalItems: 2890,
      lowStock: 12,
      outOfStock: 3,
      syncStatus: 'synced',
      lastSync: new Date().toLocaleTimeString()
    });

    // Mock real-time metrics
    setRealTimeMetrics({
      ordersToday: 47,
      pendingFulfillment: 8,
      syncErrors: 1,
      avgProcessingTime: '2.3h'
    });
  };

  const startRealTimeUpdates = () => {
    // Simulasi real-time updates
    setInterval(() => {
      const currentMetrics = realTimeMetrics();
      setRealTimeMetrics({
        ...currentMetrics,
        ordersToday: currentMetrics.ordersToday + Math.floor(Math.random() * 2),
        pendingFulfillment: Math.max(0, currentMetrics.pendingFulfillment + (Math.random() > 0.7 ? 1 : -1))
      });

      // Update inventory sync status
      const currentInventory = inventoryStatus();
      setInventoryStatus({
        ...currentInventory,
        lastSync: new Date().toLocaleTimeString(),
        syncStatus: Math.random() > 0.95 ? 'syncing' : 'synced'
      });
    }, 5000);
  };

  // Filter effects
  createEffect(() => {
    let filtered = orders();
    
    if (searchQuery()) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery().toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery().toLowerCase())
      );
    }
    
    if (statusFilter() !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter());
    }
    
    if (priorityFilter() !== 'all') {
      filtered = filtered.filter(order => order.priority === priorityFilter());
    }
    
    setFilteredOrders(filtered);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'fulfillment': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const refreshData = async () => {
    setIsLoading(true);
    toast.success('Data berhasil diperbarui');
    setTimeout(() => {
      setIsLoading(false);
      loadMockData();
    }, 1000);
  };

  const handleOrderAction = (action: string, order: Order) => {
    switch (action) {
      case 'view':
        setSelectedOrder(order);
        setShowOrderModal(true);
        break;
      case 'edit':
        toast.success(`Edit order ${order.orderNumber}`);
        break;
      case 'delete':
        toast.success(`Order ${order.orderNumber} berhasil dihapus`);
        break;
    }
  };

  const StatusBadge = (props: { status: string }) => (
    <span class={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(props.status)}`}>
      {props.status.charAt(0).toUpperCase() + props.status.slice(1)}
    </span>
  );

  const PriorityIndicator = (props: { priority: string }) => (
    <div class="flex items-center gap-1">
      <div class={`w-2 h-2 rounded-full ${getPriorityColor(props.priority)}`}></div>
      <span class="text-xs text-white/60 capitalize">{props.priority}</span>
    </div>
  );

  return (
    <div class="p-6 space-y-6 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen">
      {/* Header */}
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Manajemen Pesanan</h1>
          <p class="text-white/70 mt-1">
            Real-time inventory synchronization dengan SurrealDB
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-sm">
            <div class={`w-2 h-2 rounded-full ${isRealTimeConnected() ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span class="text-white/70">
              {isRealTimeConnected() ? 'Real-time Connected' : 'Connection Lost'}
            </span>
          </div>
          <button
            onClick={refreshData}
            disabled={isLoading()}
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 backdrop-blur-sm"
          >
            <RefreshCw size={16} class={isLoading() ? 'animate-spin' : ''} />
            {isLoading() ? 'Memperbarui...' : 'Refresh'}
          </button>
          <button class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 backdrop-blur-sm">
            <Plus size={16} />
            Pesanan Baru
          </button>
        </div>
      </div>

        {/* Real-time Metrics Cards */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-white/70">Pesanan Hari Ini</p>
                <p class="text-2xl font-bold text-white">{realTimeMetrics().ordersToday}</p>
                <p class="text-xs text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp size={12} />
                  +12% dari kemarin
                </p>
              </div>
              <div class="p-3 bg-blue-500/20 rounded-lg">
                <Package class="text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div class="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-white/70">Pending Fulfillment</p>
                <p class="text-2xl font-bold text-white">{realTimeMetrics().pendingFulfillment}</p>
                <p class="text-xs text-white/50 mt-1">Rata-rata {realTimeMetrics().avgProcessingTime}</p>
              </div>
              <div class="p-3 bg-orange-500/20 rounded-lg">
                <Truck class="text-orange-400" size={24} />
              </div>
            </div>
          </div>

          <div class="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-white/70">Status Inventory</p>
                <p class="text-2xl font-bold text-white">{inventoryStatus().totalItems}</p>
                <p class="text-xs text-red-400 mt-1">
                  {inventoryStatus().lowStock} Low Stock • {inventoryStatus().outOfStock} Out of Stock
                </p>
              </div>
              <div class="p-3 bg-green-500/20 rounded-lg">
                <Database class="text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div class="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-white/70">SurrealDB Sync</p>
                <div class="flex items-center gap-2 mt-1">
                  <div class={`w-2 h-2 rounded-full ${inventoryStatus().syncStatus === 'synced' ? 'bg-green-500' : inventoryStatus().syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span class="text-sm font-medium capitalize text-white">
                    {inventoryStatus().syncStatus}
                  </span>
                </div>
                <p class="text-xs text-white/50 mt-1">Last sync: {inventoryStatus().lastSync}</p>
              </div>
              <div class="p-3 bg-purple-500/20 rounded-lg">
                <Zap class="text-purple-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div class="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="text"
                  placeholder="Cari pesanan atau pelanggan..."
                  value={searchQuery()}
                  onInput={(e) => setSearchQuery(e.currentTarget.value)}
                  class="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50 text-white"
                />
              </div>
            </div>
            <div class="flex gap-4">
              <select
                value={statusFilter()}
                onChange={(e) => setStatusFilter(e.currentTarget.value)}
                class="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="all" class="bg-gray-800">Semua Status</option>
                <option value="pending" class="bg-gray-800">Pending</option>
                <option value="processing" class="bg-gray-800">Processing</option>
                <option value="fulfillment" class="bg-gray-800">Fulfillment</option>
                <option value="shipped" class="bg-gray-800">Shipped</option>
                <option value="delivered" class="bg-gray-800">Delivered</option>
                <option value="cancelled" class="bg-gray-800">Cancelled</option>
              </select>
              <select
                value={priorityFilter()}
                onChange={(e) => setPriorityFilter(e.currentTarget.value)}
                class="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="all" class="bg-gray-800">Semua Prioritas</option>
                <option value="low" class="bg-gray-800">Low</option>
                <option value="medium" class="bg-gray-800">Medium</option>
                <option value="high" class="bg-gray-800">High</option>
                <option value="urgent" class="bg-gray-800">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div class="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-white/10 border-b border-white/20">
                <tr>
                  <th class="text-left py-3 px-4 font-medium text-white">Order</th>
                  <th class="text-left py-3 px-4 font-medium text-white">Pelanggan</th>
                  <th class="text-left py-3 px-4 font-medium text-white">Items</th>
                  <th class="text-left py-3 px-4 font-medium text-white">Status</th>
                  <th class="text-left py-3 px-4 font-medium text-white">Prioritas</th>
                  <th class="text-left py-3 px-4 font-medium text-white">Total</th>
                  <th class="text-left py-3 px-4 font-medium text-white">Sync</th>
                  <th class="text-left py-3 px-4 font-medium text-white">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10">
                <For each={filteredOrders()}>
                  {(order) => (
                    <tr class="hover:bg-white/5">
                      <td class="py-3 px-4">
                        <div>
                          <p class="font-medium text-white">{order.orderNumber}</p>
                          <p class="text-sm text-white/60">
                            {new Date(order.createdAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </td>
                      <td class="py-3 px-4">
                        <p class="text-white">{order.customerName}</p>
                        <p class="text-sm text-white/60">{order.fulfillmentLocation}</p>
                      </td>
                      <td class="py-3 px-4">
                        <p class="text-white">{order.items.length} item(s)</p>
                        <p class="text-sm text-white/60">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} units
                        </p>
                      </td>
                      <td class="py-3 px-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td class="py-3 px-4">
                        <PriorityIndicator priority={order.priority} />
                      </td>
                      <td class="py-3 px-4">
                        <p class="font-medium text-white">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </td>
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-2">
                          {order.inventorySync ? (
                            <CheckCircle class="text-green-500" size={16} />
                          ) : (
                            <AlertTriangle class="text-yellow-500" size={16} />
                          )}
                          <span class="text-sm text-white/60">
                            {order.inventorySync ? 'Synced' : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-2">
                          <button
                            onClick={() => handleOrderAction('view', order)}
                            class="p-1 text-blue-400 hover:bg-blue-500/20 rounded"
                            title="View Order"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleOrderAction('edit', order)}
                            class="p-1 text-white/60 hover:bg-white/10 rounded"
                            title="Edit Order"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleOrderAction('delete', order)}
                            class="p-1 text-red-400 hover:bg-red-500/20 rounded"
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        <Show when={showOrderModal() && selectedOrder()}>
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div class="p-6 border-b border-white/20 flex items-center justify-between">
                <h2 class="text-xl font-bold text-white">
                  Detail Pesanan - {selectedOrder()?.orderNumber}
                </h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  class="text-white/40 hover:text-white/60"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div class="p-6 space-y-6">
                {/* Order Info */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 class="font-semibold text-white mb-3">Informasi Pesanan</h3>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-white/60">Pelanggan:</span>
                        <span class="font-medium text-white">{selectedOrder()?.customerName}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/60">Status:</span>
                        <StatusBadge status={selectedOrder()?.status || ''} />
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/60">Prioritas:</span>
                        <PriorityIndicator priority={selectedOrder()?.priority || ''} />
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/60">Total:</span>
                        <span class="font-medium text-white">
                          {formatCurrency(selectedOrder()?.totalAmount || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 class="font-semibold text-white mb-3">Fulfillment Info</h3>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-white/60">Lokasi:</span>
                        <span class="font-medium text-white">{selectedOrder()?.fulfillmentLocation}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/60">Est. Pengiriman:</span>
                        <span class="font-medium text-white">
                          {selectedOrder()?.estimatedDelivery}
                        </span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/60">Tracking:</span>
                        <span class="font-medium text-white">
                          {selectedOrder()?.trackingNumber || 'Belum tersedia'}
                        </span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/60">Inventory Sync:</span>
                        <div class="flex items-center gap-1">
                          {selectedOrder()?.inventorySync ? (
                            <CheckCircle class="text-green-500" size={14} />
                          ) : (
                            <AlertTriangle class="text-yellow-500" size={14} />
                          )}
                          <span class="text-xs text-white/60">
                            {selectedOrder()?.inventorySync ? 'Synced' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 class="font-semibold text-white mb-3">Items Pesanan</h3>
                  <div class="overflow-x-auto">
                    <table class="w-full border border-white/20 rounded-lg">
                      <thead class="bg-white/10">
                        <tr>
                          <th class="text-left py-2 px-3 text-sm font-medium text-white">Produk</th>
                          <th class="text-left py-2 px-3 text-sm font-medium text-white">SKU</th>
                          <th class="text-left py-2 px-3 text-sm font-medium text-white">Qty</th>
                          <th class="text-left py-2 px-3 text-sm font-medium text-white">Harga</th>
                          <th class="text-left py-2 px-3 text-sm font-medium text-white">Stock</th>
                          <th class="text-left py-2 px-3 text-sm font-medium text-white">Lokasi</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/10">
                        <For each={selectedOrder()?.items || []}>
                          {(item) => (
                            <tr>
                              <td class="py-2 px-3 text-sm text-white">{item.productName}</td>
                              <td class="py-2 px-3 text-sm text-white/60">{item.sku}</td>
                              <td class="py-2 px-3 text-sm text-white">{item.quantity}</td>
                              <td class="py-2 px-3 text-sm text-white">
                                {formatCurrency(item.unitPrice)}
                              </td>
                              <td class="py-2 px-3 text-sm">
                                <span class={`${item.availableStock < item.quantity ? 'text-red-400' : 'text-green-400'}`}>
                                  {item.availableStock} available
                                </span>
                                <br />
                                <span class="text-xs text-white/50">
                                  {item.reservedStock} reserved
                                </span>
                              </td>
                              <td class="py-2 px-3 text-sm text-white/60">{item.location}</td>
                            </tr>
                          )}
                        </For>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Asset Allocation */}
                <div>
                  <h3 class="font-semibold text-white mb-3">Alokasi Aset</h3>
                  <div class="flex flex-wrap gap-2">
                    <For each={selectedOrder()?.assetAllocation || []}>
                      {(asset) => (
                        <span class="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30">
                          {asset}
                        </span>
                      )}
                    </For>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Show>
      </div>
);
};

export default Orders;