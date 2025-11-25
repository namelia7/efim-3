import { createSignal, createEffect, Show, For, onMount } from 'solid-js';
import { 
  Search, Filter, Download, RefreshCw, CheckCircle, AlertTriangle, 
  XCircle, Eye, Edit, MapPin, Cable, Router, Activity,
  ChevronDown, ChevronRight, Clock,
  Settings, BarChart3, Target, Zap, Database, Globe, Layers,
  AlertCircle, Wifi, Server, Network,
  FileText, Monitor
} from 'lucide-solid';

interface Device {
  id: string;
  name: string;
  type: string;
  location: string;
  coordinates: number[];
  status: string;
  hasConflict: boolean;
  lastSynced: string;
  capacity: string;
  utilization: number;
  ports: number;
  vendor: string;
  firmware: string;
  temperature: number;
  uptime: string;
  ip: string;
  snmpCommunity: string;
}

interface Discrepancy {
  id: string;
  deviceId: string;
  deviceName: string;
  type: string;
  severity: string;
  description: string;
  uimValue?: string;
  nmsValue?: string;
  detectedAt: string;
  resolved: boolean;
  impact: string;
  recommendedAction: string;
  category: string;
}

interface SyncStats {
  total: number;
  synced: number;
  conflicts: number;
  pending: number;
}

const ReconciliationPage = () => {
  // State management
  const [selectedView, setSelectedView] = createSignal<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = createSignal('');
  const [filterType, setFilterType] = createSignal<'all' | 'conflicts' | 'synced'>('all');
  const [selectedDevice, setSelectedDevice] = createSignal<Device | null>(null);
  const [discrepancies, setDiscrepancies] = createSignal<Discrepancy[]>([]);
  const [devices, setDevices] = createSignal<Device[]>([]);
  const [isAutoDiscovering, setIsAutoDiscovering] = createSignal(false);
  const [selectedDiscrepancies, setSelectedDiscrepancies] = createSignal<string[]>([]);
  const [showBulkActions, setShowBulkActions] = createSignal(false);
  const [reconciliationProgress, setReconciliationProgress] = createSignal(0);
  const [lastSyncTime, setLastSyncTime] = createSignal(new Date());
  const [showAdvancedFilters, setShowAdvancedFilters] = createSignal(false);
  const [syncStats, setSyncStats] = createSignal<SyncStats>({ total: 0, synced: 0, conflicts: 0, pending: 0 });
  const [selectedSeverity, setSelectedSeverity] = createSignal<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedLocation, setSelectedLocation] = createSignal('all');
  const [expandedDiscrepancy, setExpandedDiscrepancy] = createSignal<string | null>(null);
  const [isReconciling, setIsReconciling] = createSignal(false);

  // Initialize mock data
  onMount(() => {
    initializeMockData();
    startAutoDiscovery();
    
    // Update stats when devices or discrepancies change
    createEffect(() => {
      const devicesData = devices();
      const discrepanciesData = discrepancies();
      
      setSyncStats({
        total: devicesData.length,
        synced: devicesData.filter(d => !d.hasConflict).length,
        conflicts: devicesData.filter(d => d.hasConflict).length,
        pending: discrepanciesData.filter(d => !d.resolved).length
      });
    });

    // Auto-update every 30 seconds
    const interval = setInterval(() => {
      setLastSyncTime(new Date());
    }, 30000);

    return () => clearInterval(interval);
  });

  const initializeMockData = () => {
    const mockDevices: Device[] = [
      {
        id: 'dev-001',
        name: 'OLT-JAKARTA-01',
        type: 'OLT',
        location: 'Jakarta Pusat',
        coordinates: [-6.2088, 106.8456],
        status: 'active',
        hasConflict: true,
        lastSynced: '2024-01-15 14:30:00',
        capacity: '10 Gbps',
        utilization: 72,
        ports: 48,
        vendor: 'Huawei',
        firmware: 'v2.1.3',
        temperature: 45,
        uptime: '127 days',
        ip: '192.168.1.10',
        snmpCommunity: 'public'
      },
      {
        id: 'dev-002', 
        name: 'ODF-BANDUNG-02',
        type: 'ODF',
        location: 'Bandung Kota',
        coordinates: [-6.9175, 107.6191],
        status: 'active',
        hasConflict: false,
        lastSynced: '2024-01-15 14:28:00',
        capacity: '1 Gbps',
        utilization: 45,
        ports: 24,
        vendor: 'ZTE',
        firmware: 'v1.8.2',
        temperature: 38,
        uptime: '89 days',
        ip: '192.168.2.20',
        snmpCommunity: 'public'
      },
      {
        id: 'dev-003',
        name: 'CABLE-JKT-BDG-001',
        type: 'Cable',
        location: 'Jakarta-Bandung Route',
        coordinates: [-6.5622, 107.2331],
        status: 'maintenance',
        hasConflict: true,
        lastSynced: '2024-01-15 13:45:00',
        capacity: '100 Gbps',
        utilization: 23,
        ports: 144,
        vendor: 'Corning',
        firmware: 'N/A',
        temperature: 25,
        uptime: '245 days',
        ip: '192.168.3.30',
        snmpCommunity: 'readonly'
      },
      {
        id: 'dev-004',
        name: 'SPLITTER-SURABAYA-03',
        type: 'Splitter',
        location: 'Surabaya Timur',
        coordinates: [-7.2575, 112.7521],
        status: 'active',
        hasConflict: false,
        lastSynced: '2024-01-15 14:25:00',
        capacity: '2.5 Gbps',
        utilization: 67,
        ports: 32,
        vendor: 'Fiberhome',
        firmware: 'v3.0.1',
        temperature: 42,
        uptime: '56 days',
        ip: '192.168.4.40',
        snmpCommunity: 'public'
      },
      {
        id: 'dev-005',
        name: 'ODC-YOGYA-01',
        type: 'ODC',
        location: 'Yogyakarta',
        coordinates: [-7.7956, 110.3695],
        status: 'inactive',
        hasConflict: true,
        lastSynced: '2024-01-15 12:15:00',
        capacity: '5 Gbps',
        utilization: 0,
        ports: 64,
        vendor: 'Nokia',
        firmware: 'v2.5.4',
        temperature: 35,
        uptime: '0 days',
        ip: '192.168.5.50',
        snmpCommunity: 'public'
      }
    ];

    const mockDiscrepancies: Discrepancy[] = [
      {
        id: 'disc-001',
        deviceId: 'dev-001',
        deviceName: 'OLT-JAKARTA-01',
        type: 'data_mismatch',
        severity: 'high',
        description: 'Bandwidth capacity mismatch between UIM and NMS',
        uimValue: '10 Gbps',
        nmsValue: '1 Gbps',
        detectedAt: '2024-01-15 14:30:00',
        resolved: false,
        impact: 'Performance monitoring inaccuracy',
        recommendedAction: 'Update NMS configuration',
        category: 'Configuration'
      },
      {
        id: 'disc-002',
        deviceId: 'dev-003',
        deviceName: 'CABLE-JKT-BDG-001',
        type: 'status_conflict',
        severity: 'medium',
        description: 'Status berbeda antara UIM dan NMS monitoring',
        uimValue: 'Active',
        nmsValue: 'Maintenance',
        detectedAt: '2024-01-15 13:45:00',
        resolved: false,
        impact: 'Incorrect alarm generation',
        recommendedAction: 'Verify actual device status',
        category: 'Status'
      },
      {
        id: 'disc-003',
        deviceId: 'dev-001',
        deviceName: 'OLT-JAKARTA-01',
        type: 'duplicate',
        severity: 'low',
        description: 'Duplicate entry ditemukan di UIM database',
        detectedAt: '2024-01-15 12:15:00',
        resolved: false,
        impact: 'Data redundancy',
        recommendedAction: 'Remove duplicate entries',
        category: 'Data Integrity'
      },
      {
        id: 'disc-004',
        deviceId: 'dev-005',
        deviceName: 'ODC-YOGYA-01',
        type: 'missing_nms',
        severity: 'high',
        description: 'Device exists in UIM but not monitored in NMS',
        uimValue: 'Present',
        nmsValue: 'Not Found',
        detectedAt: '2024-01-15 12:15:00',
        resolved: false,
        impact: 'No monitoring coverage',
        recommendedAction: 'Add device to NMS',
        category: 'Missing Data'
      },
      {
        id: 'disc-005',
        deviceId: 'dev-003',
        deviceName: 'CABLE-JKT-BDG-001',
        type: 'configuration_drift',
        severity: 'medium',
        description: 'Firmware version mismatch detected',
        uimValue: 'v2.1.0',
        nmsValue: 'v2.0.8',
        detectedAt: '2024-01-15 11:30:00',
        resolved: false,
        impact: 'Feature compatibility issues',
        recommendedAction: 'Sync firmware versions',
        category: 'Configuration'
      }
    ];

    setDevices(mockDevices);
    setDiscrepancies(mockDiscrepancies);
  };

  const startAutoDiscovery = () => {
    setIsAutoDiscovering(true);
    setTimeout(() => {
      setIsAutoDiscovering(false);
      setLastSyncTime(new Date());
    }, 3000);
  };

  const filteredDevices = () => {
    let filtered = devices();
    
    if (searchQuery()) {
      filtered = filtered.filter(device =>
        device.name.toLowerCase().includes(searchQuery().toLowerCase()) ||
        device.location.toLowerCase().includes(searchQuery().toLowerCase()) ||
        device.vendor.toLowerCase().includes(searchQuery().toLowerCase())
      );
    }

    if (filterType() === 'conflicts') {
      filtered = filtered.filter(device => device.hasConflict);
    } else if (filterType() === 'synced') {
      filtered = filtered.filter(device => !device.hasConflict);
    }

    if (selectedLocation() !== 'all') {
      filtered = filtered.filter(device => 
        device.location.toLowerCase().includes(selectedLocation().toLowerCase())
      );
    }

    return filtered;
  };

  const filteredDiscrepancies = () => {
    let filtered = discrepancies().filter(d => !d.resolved);
    
    if (selectedSeverity() !== 'all') {
      filtered = filtered.filter(d => d.severity === selectedSeverity());
    }

    return filtered;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'OLT': return Router;
      case 'ODF': return Server;
      case 'ODC': return Database;
      case 'Splitter': return Network;
      case 'Cable': return Cable;
      default: return Router;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'inactive': return 'bg-red-500/20 text-red-300 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const handleBulkReconciliation = () => {
    setIsReconciling(true);
    setReconciliationProgress(0);
    
    const interval = setInterval(() => {
      setReconciliationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSelectedDiscrepancies([]);
          setShowBulkActions(false);
          setIsReconciling(false);
          
          // Simulate resolving selected discrepancies
          setDiscrepancies(prev => 
            prev.map(d => 
              selectedDiscrepancies().includes(d.id) 
                ? { ...d, resolved: true } 
                : d
            )
          );
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const toggleDiscrepancySelection = (id: string) => {
    setSelectedDiscrepancies(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const resolveDiscrepancy = (id: string) => {
    setDiscrepancies(prev => 
      prev.map(d => d.id === id ? { ...d, resolved: true } : d)
    );
  };

  const getUniqueLocations = () => {
    const locations = devices().map(d => d.location);
    return [...new Set(locations)];
  };

  const getDiscrepancyIcon = (type: string) => {
    switch (type) {
      case 'data_mismatch': return AlertTriangle;
      case 'status_conflict': return XCircle;
      case 'duplicate': return Eye;
      case 'missing_nms': return AlertCircle;
      case 'configuration_drift': return Settings;
      default: return AlertTriangle;
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4">
      <div class="space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-white mb-2">
                🔄 Network Reconciliation System
              </h1>
              <p class="text-blue-200">
                Real-time synchronization between UIM (Universal Inventory Management) and NMS (Network Management System)
              </p>
              <div class="flex items-center space-x-4 mt-3">
                <div class="flex items-center space-x-2 text-sm text-white/70">
                  <Clock class="w-4 h-4" />
                  <span>Last sync: {lastSyncTime().toLocaleTimeString('id-ID')}</span>
                </div>
                <div class="flex items-center space-x-2 text-sm text-white/70">
                  <Globe class="w-4 h-4" />
                  <span>{devices().length} devices monitored</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              {/* Auto Discovery Status */}
              <div class={`px-4 py-2 rounded-xl border border-white/20 ${
                isAutoDiscovering() 
                  ? 'bg-blue-500/20 text-blue-300 animate-pulse' 
                  : 'bg-green-500/20 text-green-300'
              }`}>
                <div class="flex items-center space-x-2">
                  <Activity class={`w-4 h-4 ${isAutoDiscovering() ? 'animate-pulse' : ''}`} />
                  <span class="text-sm font-medium">
                    {isAutoDiscovering() ? 'Auto-Discovery Active' : 'Discovery Complete'}
                  </span>
                </div>
              </div>

              {/* Sync Button */}
              <button
                onClick={startAutoDiscovery}
                class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
                disabled={isAutoDiscovering()}
              >
                <RefreshCw class={`w-4 h-4 ${isAutoDiscovering() ? 'animate-spin' : ''}`} />
                <span class="font-medium">Sync Now</span>
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Panel - Controls & Stats */}
          <div class="space-y-6">
            {/* Quick Stats */}
            <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 class="w-5 h-5 mr-2" />
                Reconciliation Overview
              </h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
                  <div class="flex items-center space-x-2">
                    <Database class="w-4 h-4 text-blue-400" />
                    <span class="text-blue-200">Total Devices</span>
                  </div>
                  <span class="text-white font-mono text-lg">{syncStats().total}</span>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-red-500/20 rounded-xl border border-red-400/30">
                  <div class="flex items-center space-x-2">
                    <AlertTriangle class="w-4 h-4 text-red-400" />
                    <span class="text-red-200">Conflicts</span>
                  </div>
                  <span class="text-red-400 font-mono text-lg">{syncStats().conflicts}</span>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-green-500/20 rounded-xl border border-green-400/30">
                  <div class="flex items-center space-x-2">
                    <CheckCircle class="w-4 h-4 text-green-400" />
                    <span class="text-green-200">Synced</span>
                  </div>
                  <span class="text-green-400 font-mono text-lg">{syncStats().synced}</span>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-yellow-500/20 rounded-xl border border-yellow-400/30">
                  <div class="flex items-center space-x-2">
                    <Clock class="w-4 h-4 text-yellow-400" />
                    <span class="text-yellow-200">Pending</span>
                  </div>
                  <span class="text-yellow-400 font-mono text-lg">{syncStats().pending}</span>
                </div>
              </div>

              {/* Sync Health Indicator */}
              <div class="mt-4 p-3 bg-white/5 rounded-xl">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-white/70">Sync Health</span>
                  <span class="text-sm font-mono text-white">
                    {Math.round((syncStats().synced / Math.max(syncStats().total, 1)) * 100)}%
                  </span>
                </div>
                <div class="w-full bg-white/10 rounded-full h-2">
                  <div 
                    class="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={`width: ${(syncStats().synced / Math.max(syncStats().total, 1)) * 100}%`}
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-white flex items-center">
                  <Filter class="w-5 h-5 mr-2" />
                  Filters & Search
                </h3>
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters())}
                  class="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Advanced
                </button>
              </div>
              
              {/* Search */}
              <div class="relative mb-4">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search devices, locations..."
                  value={searchQuery()}
                  onInput={(e) => setSearchQuery(e.currentTarget.value)}
                  class="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
                />
              </div>

              {/* Status Filter */}
              <div class="space-y-2 mb-4">
                <label class="text-sm font-medium text-white/80">Device Status</label>
                <select
                  value={filterType()}
                  onChange={(e) => setFilterType(e.currentTarget.value as 'all' | 'conflicts' | 'synced')}
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 appearance-none"
                >
                  <option value="all">All Devices</option>
                  <option value="conflicts">With Conflicts</option>
                  <option value="synced">Fully Synced</option>
                </select>
              </div>

              {/* Advanced Filters */}
              <Show when={showAdvancedFilters()}>
                <div class="space-y-4 pt-4 border-t border-white/10">
                  {/* Location Filter */}
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-white/80">Location</label>
                    <select
                      value={selectedLocation()}
                      onChange={(e) => setSelectedLocation(e.currentTarget.value)}
                      class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 appearance-none"
                    >
                      <option value="all">All Locations</option>
                      <For each={getUniqueLocations()}>
                        {(location) => <option value={location}>{location}</option>}
                      </For>
                    </select>
                  </div>

                  {/* Severity Filter */}
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-white/80">Issue Severity</label>
                    <select
                      value={selectedSeverity()}
                      onChange={(e) => setSelectedSeverity(e.currentTarget.value as 'all' | 'high' | 'medium' | 'low')}
                      class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 appearance-none"
                    >
                      <option value="all">All Severities</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>
              </Show>
            </div>

            {/* View Toggle */}
            <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                <Layers class="w-5 h-5 mr-2" />
                View Mode
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedView('map')}
                  class={`p-3 rounded-xl transition-all ${
                    selectedView() === 'map'
                      ? 'bg-blue-500/30 text-white border border-blue-400/50 shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <MapPin class="w-5 h-5 mx-auto mb-1" />
                  <div class="text-xs font-medium">Topology Map</div>
                </button>
                <button
                  onClick={() => setSelectedView('list')}
                  class={`p-3 rounded-xl transition-all ${
                    selectedView() === 'list'
                      ? 'bg-blue-500/30 text-white border border-blue-400/50 shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Filter class="w-5 h-5 mx-auto mb-1" />
                  <div class="text-xs font-medium">Device List</div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div class="xl:col-span-2 space-y-6">
            {/* Network Map / List View */}
            <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-white flex items-center">
                  {selectedView() === 'map' ? (
                    <>
                      <Globe class="w-5 h-5 mr-2" />
                      Network Topology Visualization
                    </>
                  ) : (
                    <>
                      <Database class="w-5 h-5 mr-2" />
                      Device Inventory List
                    </>
                  )}
                </h3>
                <div class="flex items-center space-x-2">
                  <div class="text-sm text-white/60">
                    {filteredDevices().length} of {devices().length} devices
                  </div>
                  <button class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group">
                    <Download class="w-4 h-4 text-white group-hover:text-blue-300" />
                  </button>
                  <button class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors group">
                    <Settings class="w-4 h-4 text-white group-hover:text-purple-300" />
                  </button>
                </div>
              </div>

              <Show when={selectedView() === 'map'}>
                {/* Interactive Network Topology Map */}
                <div class="h-[600px] bg-slate-800/50 rounded-xl border border-white/10 relative overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-green-900/20">
                    {/* Map Header */}
                    <div class="absolute top-4 left-4 right-4 z-10">
                      <div class="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2">
                              <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                              <span class="text-xs text-white">Network Topology</span>
                            </div>
                            <div class="flex items-center space-x-2">
                              <Wifi class="w-4 h-4 text-blue-400" />
                              <span class="text-xs text-white/70">Real-time Data Flow</span>
                            </div>
                          </div>
                          <div class="flex space-x-2">
                            <div class="flex items-center space-x-1 px-2 py-1 bg-green-500/20 rounded-lg">
                              <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span class="text-xs text-green-300">Active</span>
                            </div>
                            <div class="flex items-center space-x-1 px-2 py-1 bg-red-500/20 rounded-lg">
                              <div class="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                              <span class="text-xs text-red-300">Conflicts</span>
                            </div>
                            <div class="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 rounded-lg">
                              <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              <span class="text-xs text-yellow-300">Maintenance</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Topology Map Content */}
                    <div class="p-6 h-full pt-20 relative">
                      <svg class="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                        {/* Background Grid */}
                        <defs>
                          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                          </pattern>
                          
                          {/* Gradient definitions */}
                          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0.8" />
                            <stop offset="50%" style="stop-color:#8B5CF6;stop-opacity:0.6" />
                            <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:0.8" />
                          </linearGradient>
                          
                          <linearGradient id="conflictGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#EF4444;stop-opacity:0.8" />
                            <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:0.8" />
                          </linearGradient>

                          {/* Animated data flow */}
                          <circle id="dataPacket" r="3" fill="url(#connectionGradient)">
                            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                          </circle>
                        </defs>
                        
                        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3"/>

                        {/* Core Network Infrastructure - Centered Layout */}
                        
                        {/* Main OLT Hub - Center */}
                        <g class="cursor-pointer" onClick={() => setSelectedDevice(devices()[0])}>
                          <circle cx="400" cy="150" r="45" 
                            fill={devices()[0]?.hasConflict ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)"}
                            stroke={devices()[0]?.hasConflict ? "#EF4444" : "#22C55E"} 
                            stroke-width="3" 
                            class="animate-pulse" />
                          <circle cx="400" cy="150" r="35" 
                            fill={devices()[0]?.hasConflict ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)"}
                            stroke={devices()[0]?.hasConflict ? "#EF4444" : "#22C55E"} 
                            stroke-width="2" />
                          
                          {/* Device Icon Representation */}
                          <rect x="388" y="138" width="24" height="24" rx="4" 
                            fill={devices()[0]?.hasConflict ? "#EF4444" : "#22C55E"} opacity="0.8"/>
                          <text x="400" y="175" text-anchor="middle" fill="white" font-size="10" font-weight="bold">
                            {devices()[0]?.name.split('-')[0]}
                          </text>
                          <text x="400" y="188" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="8">
                            {devices()[0]?.location}
                          </text>
                          
                          {/* Conflict indicator */}
                          <Show when={devices()[0]?.hasConflict}>
                            <circle cx="420" cy="130" r="8" fill="#EF4444" class="animate-pulse">
                              <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite" />
                            </circle>
                            <text x="420" y="134" text-anchor="middle" fill="white" font-size="10">!</text>
                          </Show>
                        </g>

                        {/* ODF Nodes - Left and Right */}
                        <g class="cursor-pointer" onClick={() => setSelectedDevice(devices()[1])}>
                          <circle cx="200" cy="150" r="35" 
                            fill={devices()[1]?.hasConflict ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)"}
                            stroke={devices()[1]?.hasConflict ? "#EF4444" : "#8B5CF6"} 
                            stroke-width="2" />
                          <rect x="188" y="138" width="24" height="24" rx="3" 
                            fill="#8B5CF6" opacity="0.8"/>
                          <text x="200" y="175" text-anchor="middle" fill="white" font-size="10" font-weight="bold">
                            ODF
                          </text>
                          <text x="200" y="188" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="8">
                            Bandung
                          </text>
                        </g>

                        <g class="cursor-pointer" onClick={() => setSelectedDevice(devices()[3])}>
                          <circle cx="600" cy="150" r="35" 
                            fill={devices()[3]?.hasConflict ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)"}
                            stroke={devices()[3]?.hasConflict ? "#EF4444" : "#F59E0B"} 
                            stroke-width="2" />
                          <rect x="588" y="138" width="24" height="24" rx="3" 
                            fill="#F59E0B" opacity="0.8"/>
                          <text x="600" y="175" text-anchor="middle" fill="white" font-size="10" font-weight="bold">
                            SPLIT
                          </text>
                          <text x="600" y="188" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="8">
                            Surabaya
                          </text>
                        </g>

                        {/* Cable Infrastructure - Bottom */}
                        <g class="cursor-pointer" onClick={() => setSelectedDevice(devices()[2])}>
                          <rect x="350" y="280" width="100" height="30" rx="15" 
                            fill={devices()[2]?.hasConflict ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)"}
                            stroke={devices()[2]?.hasConflict ? "#EF4444" : "#06B6D4"} 
                            stroke-width="2" />
                          <text x="400" y="299" text-anchor="middle" fill="white" font-size="10" font-weight="bold">
                            CABLE-JKT-BDG
                          </text>
                          <text x="400" y="325" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="8">
                            100 Gbps Backbone
                          </text>
                          
                          {/* Conflict indicator */}
                          <Show when={devices()[2]?.hasConflict}>
                            <circle cx="430" cy="270" r="6" fill="#EF4444" class="animate-pulse" />
                            <text x="430" y="274" text-anchor="middle" fill="white" font-size="8">!</text>
                          </Show>
                        </g>

                        {/* ODC Node - Top Right */}
                        <g class="cursor-pointer" onClick={() => setSelectedDevice(devices()[4])}>
                          <circle cx="550" cy="80" r="30" 
                            fill={devices()[4]?.hasConflict ? "rgba(239, 68, 68, 0.2)" : "rgba(156, 163, 175, 0.2)"}
                            stroke={devices()[4]?.hasConflict ? "#EF4444" : "#9CA3AF"} 
                            stroke-width="2"
                            stroke-dasharray={devices()[4]?.status === 'inactive' ? "5,5" : "0"} />
                          <rect x="538" y="68" width="24" height="24" rx="3" 
                            fill={devices()[4]?.status === 'inactive' ? "#9CA3AF" : "#10B981"} 
                            opacity="0.6"/>
                          <text x="550" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="bold">
                            ODC
                          </text>
                          <text x="550" y="118" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="8">
                            Yogyakarta
                          </text>
                          
                          {/* Inactive indicator */}
                          <Show when={devices()[4]?.status === 'inactive'}>
                            <circle cx="570" cy="65" r="6" fill="#9CA3AF" />
                            <text x="570" y="69" text-anchor="middle" fill="white" font-size="8">×</text>
                          </Show>
                        </g>

                        {/* Network Connections with Data Flow Animation */}
                        
                        {/* OLT to ODF Connection */}
                        <path d="M 365 150 L 235 150" 
                          stroke="url(#connectionGradient)" 
                          stroke-width="4" 
                          fill="none"
                          opacity="0.8">
                          <animate attributeName="stroke-dasharray" 
                            values="0,20;20,0" 
                            dur="2s" 
                            repeatCount="indefinite" />
                        </path>
                        
                        {/* OLT to Splitter Connection */}
                        <path d="M 435 150 L 565 150" 
                          stroke="url(#connectionGradient)" 
                          stroke-width="4" 
                          fill="none"
                          opacity="0.8">
                          <animate attributeName="stroke-dasharray" 
                            values="0,20;20,0" 
                            dur="1.8s" 
                            repeatCount="indefinite" />
                        </path>

                        {/* OLT to Cable Connection - With Conflict */}
                        <path d="M 400 185 L 400 250" 
                          stroke={devices()[2]?.hasConflict ? "url(#conflictGradient)" : "url(#connectionGradient)"} 
                          stroke-width="4" 
                          fill="none"
                          opacity="0.8">
                          <animate attributeName="stroke-dasharray" 
                            values="0,15;15,0" 
                            dur="1.5s" 
                            repeatCount="indefinite" />
                        </path>

                        {/* Splitter to ODC Connection - Inactive */}
                        <path d="M 580 130 L 560 100" 
                          stroke="#9CA3AF" 
                          stroke-width="3" 
                          fill="none"
                          opacity="0.4"
                          stroke-dasharray="8,4" />

                        {/* Data Flow Indicators */}
                        <circle r="4" fill="#3B82F6" opacity="0.8">
                          <animateMotion dur="3s" repeatCount="indefinite">
                            <path d="M 365 150 L 235 150" />
                          </animateMotion>
                        </circle>

                        <circle r="4" fill="#8B5CF6" opacity="0.8">
                          <animateMotion dur="2.5s" repeatCount="indefinite">
                            <path d="M 435 150 L 565 150" />
                          </animateMotion>
                        </circle>

                        <circle r="4" fill={devices()[2]?.hasConflict ? "#EF4444" : "#06B6D4"} opacity="0.8">
                          <animateMotion dur="2s" repeatCount="indefinite">
                            <path d="M 400 185 L 400 250" />
                          </animateMotion>
                        </circle>

                        {/* Network Load Indicators */}
                        <For each={filteredDevices().slice(0, 4)}>
                          {(device, index) => {
                            const positions = [
                              { x: 400, y: 200 }, // OLT
                              { x: 200, y: 200 }, // ODF  
                              { x: 400, y: 330 }, // Cable
                              { x: 600, y: 200 }  // Splitter
                            ];
                            const pos = positions[index()];
                            
                            return (
                              <g>
                                {/* Load Bar Background */}
                                <rect x={pos.x - 30} y={pos.y} width="60" height="8" rx="4" 
                                  fill="rgba(255,255,255,0.2)" />
                                
                                {/* Load Bar Fill */}
                                <rect x={pos.x - 30} y={pos.y} width={60 * (device.utilization / 100)} height="8" rx="4" 
                                  fill={
                                    device.utilization > 80 ? "#EF4444" :
                                    device.utilization > 60 ? "#F59E0B" : "#22C55E"
                                  }>
                                  <animate attributeName="width" 
                                    values={`${60 * (device.utilization / 100) * 0.8};${60 * (device.utilization / 100)};${60 * (device.utilization / 100) * 0.8}`}
                                    dur="3s" 
                                    repeatCount="indefinite" />
                                </rect>
                                
                                {/* Load Percentage */}
                                <text x={pos.x} y={pos.y + 18} text-anchor="middle" 
                                  fill="rgba(255,255,255,0.8)" font-size="8">
                                  {device.utilization}%
                                </text>
                              </g>
                            );
                          }}
                        </For>

                        {/* Legend and Status */}
                        <g transform="translate(20, 350)">
                          <rect width="180" height="40" rx="8" 
                            fill="rgba(0,0,0,0.5)" 
                            stroke="rgba(255,255,255,0.2)" />
                          
                          <text x="10" y="15" fill="white" font-size="10" font-weight="bold">
                            Network Status
                          </text>
                          
                          <circle cx="15" cy="25" r="3" fill="#22C55E" />
                          <text x="25" y="28" fill="rgba(255,255,255,0.8)" font-size="8">
                            Active
                          </text>
                          
                          <circle cx="60" cy="25" r="3" fill="#EF4444" class="animate-pulse" />
                          <text x="70" y="28" fill="rgba(255,255,255,0.8)" font-size="8">
                            Conflict
                          </text>
                          
                          <circle cx="115" cy="25" r="3" fill="#9CA3AF" />
                          <text x="125" y="28" fill="rgba(255,255,255,0.8)" font-size="8">
                            Offline
                          </text>
                        </g>

                        {/* Real-time Statistics Panel */}
                        <g transform="translate(600, 350)">
                          <rect width="180" height="40" rx="8" 
                            fill="rgba(0,0,0,0.5)" 
                            stroke="rgba(255,255,255,0.2)" />
                          
                          <text x="10" y="15" fill="white" font-size="10" font-weight="bold">
                            Live Metrics
                          </text>
                          
                          <text x="10" y="28" fill="rgba(255,255,255,0.8)" font-size="8">
                            Throughput: 
                            <tspan fill="#22C55E" font-weight="bold">
                              {Math.round(filteredDevices().reduce((acc, d) => acc + d.utilization, 0) / filteredDevices().length)}%
                            </tspan>
                          </text>
                          
                          <text x="100" y="28" fill="rgba(255,255,255,0.8)" font-size="8">
                            Issues: 
                            <tspan fill="#EF4444" font-weight="bold">
                              {filteredDevices().filter(d => d.hasConflict).length}
                            </tspan>
                          </text>
                        </g>
                      </svg>

                      {/* Interactive Overlay Controls */}
                      <div class="absolute bottom-6 left-6 flex space-x-3">
                        <button class="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs border border-white/20 transition-colors">
                          <Eye class="w-4 h-4 inline mr-1" />
                          Zoom In
                        </button>
                        <button class="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs border border-white/20 transition-colors">
                          <Target class="w-4 h-4 inline mr-1" />
                          Center View
                        </button>
                        <button class="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs border border-white/20 transition-colors">
                          <Download class="w-4 h-4 inline mr-1" />
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Show>

              <Show when={selectedView() === 'list'}>
                {/* Device List View */}
                <div class="space-y-4 max-h-[600px] overflow-y-auto">
                  <For each={filteredDevices()}>
                    {(device) => {
                      const Icon = getDeviceIcon(device.type);
                      return (
                        <div class={`p-4 rounded-xl border transition-all cursor-pointer ${
                          device.hasConflict 
                            ? 'bg-red-500/10 border-red-400/30 hover:bg-red-500/20' 
                            : 'bg-green-500/10 border-green-400/30 hover:bg-green-500/20'
                        } ${selectedDevice()?.id === device.id ? 'ring-2 ring-blue-400 bg-blue-500/20' : ''}`}
                        onClick={() => setSelectedDevice(device)}>
                          <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                              <div class="flex items-center space-x-3">
                                <Icon class={`w-6 h-6 ${device.hasConflict ? 'text-red-400' : 'text-green-400'}`} />
                                <div>
                                  <h4 class="font-semibold text-white">{device.name}</h4>
                                  <p class="text-sm text-white/60">{device.location}</p>
                                </div>
                              </div>
                            </div>

                            <div class="flex items-center space-x-6">
                              <div class="text-center">
                                <div class="text-sm font-semibold text-white">{device.capacity}</div>
                                <div class="text-xs text-white/60">Capacity</div>
                              </div>

                              <div class="text-center">
                                <div class="text-sm font-semibold text-white">{device.utilization}%</div>
                                <div class="text-xs text-white/60">Utilization</div>
                              </div>

                              <div class={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(device.status)}`}>
                                {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                              </div>

                              <Show when={device.hasConflict}>
                                <div class="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-medium border border-red-400/30">
                                  Conflict
                                </div>
                              </Show>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  </For>
                </div>
              </Show>
            </div>

            {/* Device Detail Panel */}
            <Show when={selectedDevice()}>
              <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-xl font-semibold text-white flex items-center">
                    <Monitor class="w-5 h-5 mr-2" />
                    Device Details: {selectedDevice()?.name}
                  </h3>
                  <button 
                    onClick={() => setSelectedDevice(null)}
                    class="text-white/60 hover:text-white p-1"
                  >
                    <XCircle class="w-5 h-5" />
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Basic Info */}
                  <div class="bg-white/5 rounded-xl p-4">
                    <h4 class="text-lg font-medium text-white mb-3 flex items-center">
                      <Database class="w-4 h-4 mr-2" />
                      Basic Information
                    </h4>
                    <div class="space-y-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-white/60">Device ID:</span>
                        <span class="text-white font-mono">{selectedDevice()?.id}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/60">Type:</span>
                        <span class="text-white">{selectedDevice()?.type}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/60">Vendor:</span>
                        <span class="text-white">{selectedDevice()?.vendor}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/60">Location:</span>
                        <span class="text-white">{selectedDevice()?.location}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/60">IP Address:</span>
                        <span class="text-white font-mono">{selectedDevice()?.ip}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div class="bg-white/5 rounded-xl p-4">
                    <h4 class="text-lg font-medium text-white mb-3 flex items-center">
                      <Activity class="w-4 h-4 mr-2" />
                      Performance
                    </h4>
                    <div class="space-y-3">
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span class="text-white/60">Utilization</span>
                          <span class="text-white">{selectedDevice()?.utilization}%</span>
                        </div>
                        <div class="w-full bg-white/10 rounded-full h-2">
                          <div 
                            class={`h-2 rounded-full transition-all ${
                              (selectedDevice()?.utilization || 0) > 80 ? 'bg-red-500' :
                              (selectedDevice()?.utilization || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={`width: ${selectedDevice()?.utilization || 0}%`}
                          />
                        </div>
                      </div>

                      <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                          <span class="text-white/60">Capacity:</span>
                          <span class="text-white">{selectedDevice()?.capacity}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-white/60">Ports:</span>
                          <span class="text-white">{selectedDevice()?.ports}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-white/60">Temperature:</span>
                          <span class={`${(selectedDevice()?.temperature || 0) > 50 ? 'text-red-400' : 'text-green-400'}`}>
                            {selectedDevice()?.temperature}°C
                          </span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-white/60">Uptime:</span>
                          <span class="text-white">{selectedDevice()?.uptime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sync Status */}
                  <div class="bg-white/5 rounded-xl p-4">
                    <h4 class="text-lg font-medium text-white mb-3 flex items-center">
                      <RefreshCw class="w-4 h-4 mr-2" />
                      Sync Status
                    </h4>
                    <div class="space-y-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-white/60">Status:</span>
                        <div class={`px-2 py-1 rounded text-xs ${
                          selectedDevice()?.hasConflict 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {selectedDevice()?.hasConflict ? 'Has Conflicts' : 'Synchronized'}
                        </div>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/60">Last Synced:</span>
                        <span class="text-white">{selectedDevice()?.lastSynced}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-white/60">Firmware:</span>
                        <span class="text-white">{selectedDevice()?.firmware}</span>
                      </div>
                    </div>

                    <Show when={selectedDevice()?.hasConflict}>
                      <div class="mt-4 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
                        <div class="flex items-center space-x-2 mb-2">
                          <AlertTriangle class="w-4 h-4 text-red-400" />
                          <span class="text-red-300 text-sm font-medium">Conflicts Detected</span>
                        </div>
                        <p class="text-xs text-red-300/80">
                          This device has discrepancies between UIM and NMS data. Check the discrepancies panel for details.
                        </p>
                      </div>
                    </Show>
                  </div>
                </div>

                {/* Quick Actions */}
                <div class="mt-6 flex items-center space-x-3">
                  <button class="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                    <Eye class="w-4 h-4" />
                    <span>View in NMS</span>
                  </button>
                  <button class="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors">
                    <RefreshCw class="w-4 h-4" />
                    <span>Force Sync</span>
                  </button>
                  <button class="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors">
                    <Edit class="w-4 h-4" />
                    <span>Edit Config</span>
                  </button>
                </div>
              </div>
            </Show>
          </div>

          {/* Right Panel - Discrepancies */}
          <div class="space-y-6">
            {/* Discrepancies List */}
            <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-white flex items-center">
                  <AlertTriangle class="w-5 h-5 mr-2" />
                  Active Discrepancies
                </h3>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-white/60">
                    {filteredDiscrepancies().length} issues
                  </span>
                  <Show when={selectedDiscrepancies().length > 0}>
                    <button
                      onClick={() => setShowBulkActions(!showBulkActions())}
                      class="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Bulk Actions
                    </button>
                  </Show>
                </div>
              </div>

              {/* Bulk Actions Panel */}
              <Show when={showBulkActions() && selectedDiscrepancies().length > 0}>
                <div class="mb-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-blue-300 text-sm font-medium">
                      {selectedDiscrepancies().length} items selected
                    </span>
                    <button
                      onClick={() => {
                        setSelectedDiscrepancies([]);
                        setShowBulkActions(false);
                      }}
                      class="text-white/60 hover:text-white text-xs"
                    >
                      Clear Selection
                    </button>
                  </div>
                  
                  <Show when={isReconciling()}>
                    <div class="mb-3">
                      <div class="flex items-center justify-between text-sm mb-1">
                        <span class="text-white/70">Reconciliation Progress</span>
                        <span class="text-white">{reconciliationProgress()}%</span>
                      </div>
                      <div class="w-full bg-white/10 rounded-full h-2">
                        <div 
                          class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-200"
                          style={`width: ${reconciliationProgress()}%`}
                        />
                      </div>
                    </div>
                  </Show>

                  <div class="flex space-x-2">
                    <button
                      onClick={handleBulkReconciliation}
                      disabled={isReconciling()}
                      class="flex items-center space-x-2 px-3 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors text-sm disabled:opacity-50"
                    >
                      <CheckCircle class="w-4 h-4" />
                      <span>Auto Reconcile</span>
                    </button>
                    <button class="flex items-center space-x-2 px-3 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm">
                      <Download class="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              </Show>

              {/* Discrepancies List */}
              <div class="space-y-3 max-h-[500px] overflow-y-auto">
                <Show when={filteredDiscrepancies().length === 0}>
                  <div class="text-center py-8">
                    <CheckCircle class="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p class="text-white/60">No active discrepancies found</p>
                    <p class="text-white/40 text-sm mt-1">All devices are synchronized</p>
                  </div>
                </Show>

                <For each={filteredDiscrepancies()}>
                  {(discrepancy) => {
                    const Icon = getDiscrepancyIcon(discrepancy.type);
                    const isExpanded = expandedDiscrepancy() === discrepancy.id;
                    const isSelected = selectedDiscrepancies().includes(discrepancy.id);
                    
                    return (
                      <div class={`border rounded-xl transition-all ${getSeverityColor(discrepancy.severity)} ${
                        isSelected ? 'ring-2 ring-blue-400' : ''
                      }`}>
                        <div class="p-4">
                          <div class="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleDiscrepancySelection(discrepancy.id)}
                              class="mt-1 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
                            />
                            
                            <Icon class="w-5 h-5 mt-0.5 flex-shrink-0" />
                            
                            <div class="flex-1 min-w-0">
                              <div class="flex items-center justify-between">
                                <h4 class="text-sm font-medium text-white truncate">
                                  {discrepancy.deviceName}
                                </h4>
                                <button
                                  onClick={() => setExpandedDiscrepancy(
                                    isExpanded ? null : discrepancy.id
                                  )}
                                  class="text-white/60 hover:text-white p-1"
                                >
                                  {isExpanded ? 
                                    <ChevronDown class="w-4 h-4" /> : 
                                    <ChevronRight class="w-4 h-4" />
                                  }
                                </button>
                              </div>
                              
                              <p class="text-xs text-white/70 mt-1">
                                {discrepancy.description}
                              </p>
                              
                              <div class="flex items-center justify-between mt-2">
                                <div class={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(discrepancy.severity)}`}>
                                  {discrepancy.severity.toUpperCase()}
                                </div>
                                <span class="text-xs text-white/50">
                                  {new Date(discrepancy.detectedAt).toLocaleTimeString('id-ID')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          <Show when={isExpanded}>
                            <div class="mt-4 pt-4 border-t border-white/10 space-y-4">
                              {/* UIM vs NMS Comparison */}
                              <Show when={discrepancy.uimValue && discrepancy.nmsValue}>
                                <div class="grid grid-cols-2 gap-4">
                                  <div class="bg-white/5 rounded-lg p-3">
                                    <h5 class="text-xs font-medium text-blue-300 mb-2">UIM Value</h5>
                                    <p class="text-sm text-white">{discrepancy.uimValue}</p>
                                  </div>
                                  <div class="bg-white/5 rounded-lg p-3">
                                    <h5 class="text-xs font-medium text-purple-300 mb-2">NMS Value</h5>
                                    <p class="text-sm text-white">{discrepancy.nmsValue}</p>
                                  </div>
                                </div>
                              </Show>

                              {/* Impact & Recommendation */}
                              <div class="space-y-3">
                                <div>
                                  <h5 class="text-xs font-medium text-yellow-300 mb-1">Impact</h5>
                                  <p class="text-sm text-white/80">{discrepancy.impact}</p>
                                </div>
                                <div>
                                  <h5 class="text-xs font-medium text-green-300 mb-1">Recommended Action</h5>
                                  <p class="text-sm text-white/80">{discrepancy.recommendedAction}</p>
                                </div>
                              </div>

                              {/* Actions */}
                              <div class="flex space-x-2 pt-2">
                                <button
                                  onClick={() => resolveDiscrepancy(discrepancy.id)}
                                  class="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors text-xs"
                                >
                                  <CheckCircle class="w-3 h-3" />
                                  <span>Resolve</span>
                                </button>
                                <button class="flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-xs">
                                  <Eye class="w-3 h-3" />
                                  <span>Investigate</span>
                                </button>
                                <button class="flex items-center space-x-1 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors text-xs">
                                  <Clock class="w-3 h-3" />
                                  <span>Snooze</span>
                                </button>
                              </div>
                            </div>
                          </Show>
                        </div>
                      </div>
                    );
                  }}
                </For>
              </div>
            </div>

            {/* Quick Actions */}
            <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                <Zap class="w-5 h-5 mr-2" />
                Quick Actions
              </h3>
              <div class="space-y-3">
                <button class="w-full flex items-center space-x-3 p-3 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors">
                  <RefreshCw class="w-5 h-5" />
                  <span>Full System Sync</span>
                </button>
                
                <button class="w-full flex items-center space-x-3 p-3 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition-colors">
                  <Target class="w-5 h-5" />
                  <span>Auto-Resolve Low Priority</span>
                </button>
                
                <button class="w-full flex items-center space-x-3 p-3 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors">
                  <FileText class="w-5 h-5" />
                  <span>Generate Report</span>
                </button>
                
                <button class="w-full flex items-center space-x-3 p-3 bg-yellow-500/20 text-yellow-300 rounded-xl hover:bg-yellow-500/30 transition-colors">
                  <Settings class="w-5 h-5" />
                  <span>Sync Settings</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                <Clock class="w-5 h-5 mr-2" />
                Recent Activity
              </h3>
              <div class="space-y-3">
                <div class="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div class="flex-1">
                    <p class="text-sm text-white">Auto-sync completed</p>
                    <p class="text-xs text-white/60">2 minutes ago</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
                  <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div class="flex-1">
                    <p class="text-sm text-white">3 discrepancies resolved</p>
                    <p class="text-xs text-white/60">15 minutes ago</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
                  <div class="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div class="flex-1">
                    <p class="text-sm text-white">New conflict detected</p>
                    <p class="text-xs text-white/60">1 hour ago</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
                  <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div class="flex-1">
                    <p class="text-sm text-white">Device OLT-JAKARTA-01 updated</p>
                    <p class="text-xs text-white/60">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex items-center space-x-6">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-sm text-white/70">System Status: Operational</span>
              </div>
              
              <div class="flex items-center space-x-2">
                <Database class="w-4 h-4 text-blue-400" />
                <span class="text-sm text-white/70">
                  UIM Connection: Active
                </span>
              </div>
              
              <div class="flex items-center space-x-2">
                <Monitor class="w-4 h-4 text-purple-400" />
                <span class="text-sm text-white/70">
                  NMS Connection: Active
                </span>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <div class="text-sm text-white/60">
                Next auto-sync in: <span class="text-white font-mono">04:32</span>
              </div>
              
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                <span class="text-sm text-white/70">
                  Real-time monitoring active
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar for Auto-Discovery */}
          <Show when={isAutoDiscovering()}>
            <div class="mt-4 pt-4 border-t border-white/10">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-white/70">Auto-Discovery Progress</span>
                <span class="text-sm text-white">Scanning network...</span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-2">
                <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style="width: 65%" />
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default ReconciliationPage;