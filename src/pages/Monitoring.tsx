// src/pages/Monitoring.tsx
import { createSignal, onMount, Show, For } from 'solid-js';
import { Activity, Wifi, Database, Zap, CheckCircle, MapPin, Router, Server, Play, Pause, Settings, TrendingUp } from 'lucide-solid';
import { toast } from 'solid-toast';

interface Device {
  id: string;
  name: string;
  type: 'NMS' | 'Router' | 'Switch' | 'Access Point';
  status: 'online' | 'offline' | 'warning' | 'error';
  location: string;
  lastSeen: string;
  metrics: {
    cpu: number;
    memory: number;
    bandwidth: number;
    latency: number;
  };
  routes: Route[];
}

interface Route {
  id: string;
  destination: string;
  gateway: string;
  interface: string;
  metric: number;
  status: 'active' | 'inactive' | 'changed';
  lastChange: string;
}

interface DataFlow {
  id: string;
  source: string;
  destination: string;
  protocol: string;
  dataSize: number;
  status: 'processing' | 'completed' | 'failed';
  timestamp: string;
}

interface SystemMetrics {
  totalDevices: number;
  onlineDevices: number;
  routeChanges: number;
  dataFlows: number;
  syncStatus: 'synced' | 'syncing' | 'error';
  lastSync: string;
}

const Monitoring = () => {
  const [devices, setDevices] = createSignal<Device[]>([]);
  const [dataFlows, setDataFlows] = createSignal<DataFlow[]>([]);
  const [systemMetrics, setSystemMetrics] = createSignal<SystemMetrics>({
    totalDevices: 0,
    onlineDevices: 0,
    routeChanges: 0,
    dataFlows: 0,
    syncStatus: 'synced',
    lastSync: new Date().toLocaleTimeString()
  });
  const [isRealTimeActive, setIsRealTimeActive] = createSignal(true);
  const [selectedDevice, setSelectedDevice] = createSignal<Device | null>(null);
  const [showDeviceModal, setShowDeviceModal] = createSignal(false);
  const [filterStatus, setFilterStatus] = createSignal('all');

  onMount(() => {
    loadMockData();
    startRealTimeMonitoring();
  });

  const loadMockData = () => {
    const mockDevices: Device[] = [
      {
        id: 'nms-001',
        name: 'NMS Primary',
        type: 'NMS',
        status: 'online',
        location: 'Jakarta Data Center',
        lastSeen: new Date().toISOString(),
        metrics: {
          cpu: 45,
          memory: 62,
          bandwidth: 78,
          latency: 12
        },
        routes: [
          {
            id: 'route-001',
            destination: '192.168.1.0/24',
            gateway: '10.0.0.1',
            interface: 'eth0',
            metric: 100,
            status: 'active',
            lastChange: new Date().toISOString()
          }
        ]
      },
      {
        id: 'router-001',
        name: 'Core Router JKT-01',
        type: 'Router',
        status: 'warning',
        location: 'Jakarta Core',
        lastSeen: new Date(Date.now() - 30000).toISOString(),
        metrics: {
          cpu: 82,
          memory: 71,
          bandwidth: 95,
          latency: 25
        },
        routes: [
          {
            id: 'route-002',
            destination: '10.10.0.0/16',
            gateway: '172.16.0.1',
            interface: 'gi0/0/1',
            metric: 110,
            status: 'changed',
            lastChange: new Date(Date.now() - 120000).toISOString()
          }
        ]
      },
      {
        id: 'switch-001',
        name: 'Access Switch SBY-01',
        type: 'Switch',
        status: 'online',
        location: 'Surabaya Branch',
        lastSeen: new Date().toISOString(),
        metrics: {
          cpu: 34,
          memory: 45,
          bandwidth: 56,
          latency: 8
        },
        routes: []
      },
      {
        id: 'ap-001',
        name: 'WiFi AP Floor-3',
        type: 'Access Point',
        status: 'error',
        location: 'Jakarta Office Floor 3',
        lastSeen: new Date(Date.now() - 300000).toISOString(),
        metrics: {
          cpu: 0,
          memory: 0,
          bandwidth: 0,
          latency: 0
        },
        routes: []
      }
    ];

    const mockDataFlows: DataFlow[] = [
      {
        id: 'flow-001',
        source: 'NMS Primary',
        destination: 'SurrealDB Cluster',
        protocol: 'HTTPS',
        dataSize: 2.4,
        status: 'processing',
        timestamp: new Date().toISOString()
      },
      {
        id: 'flow-002',
        source: 'Core Router JKT-01',
        destination: 'Inventory System',
        protocol: 'SNMP',
        dataSize: 1.2,
        status: 'completed',
        timestamp: new Date(Date.now() - 30000).toISOString()
      },
      {
        id: 'flow-003',
        source: 'Access Switch SBY-01',
        destination: 'Mapping Library',
        protocol: 'TCP',
        dataSize: 0.8,
        status: 'processing',
        timestamp: new Date().toISOString()
      }
    ];

    setDevices(mockDevices);
    setDataFlows(mockDataFlows);
    setSystemMetrics({
      totalDevices: mockDevices.length,
      onlineDevices: mockDevices.filter(d => d.status === 'online').length,
      routeChanges: mockDevices.reduce((sum, d) => sum + d.routes.filter(r => r.status === 'changed').length, 0),
      dataFlows: mockDataFlows.length,
      syncStatus: 'synced',
      lastSync: new Date().toLocaleTimeString()
    });
  };

  const startRealTimeMonitoring = () => {
    setInterval(() => {
      if (!isRealTimeActive()) return;

      // Simulate real-time updates
      setDevices(prev => prev.map(device => ({
        ...device,
        metrics: {
          cpu: Math.max(0, Math.min(100, device.metrics.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, device.metrics.memory + (Math.random() - 0.5) * 8)),
          bandwidth: Math.max(0, Math.min(100, device.metrics.bandwidth + (Math.random() - 0.5) * 15)),
          latency: Math.max(0, device.metrics.latency + (Math.random() - 0.5) * 5)
        },
        lastSeen: Math.random() > 0.9 ? new Date().toISOString() : device.lastSeen
      })));

      // Update system metrics
      const currentMetrics = systemMetrics();
      setSystemMetrics({
        ...currentMetrics,
        routeChanges: currentMetrics.routeChanges + (Math.random() > 0.8 ? 1 : 0),
        dataFlows: currentMetrics.dataFlows + (Math.random() > 0.7 ? 1 : 0),
        lastSync: new Date().toLocaleTimeString(),
        syncStatus: Math.random() > 0.95 ? 'syncing' : 'synced'
      });

      // Add new data flows occasionally
      if (Math.random() > 0.85) {
        setDataFlows(prev => [
          {
            id: `flow-${Date.now()}`,
            source: `Device-${Math.floor(Math.random() * 100)}`,
            destination: 'SurrealDB',
            protocol: ['HTTPS', 'SNMP', 'TCP'][Math.floor(Math.random() * 3)],
            dataSize: Math.random() * 5,
            status: 'processing',
            timestamp: new Date().toISOString()
          },
          ...prev.slice(0, 9) // Keep only 10 most recent
        ]);
      }
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      case 'offline': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'NMS': return Server;
      case 'Router': return Router;
      case 'Switch': return Database;
      case 'Access Point': return Wifi;
      default: return Server;
    }
  };

  const getMetricColor = (value: number, isLatency = false) => {
    if (isLatency) {
      if (value < 20) return 'text-green-400';
      if (value < 50) return 'text-yellow-400';
      return 'text-red-400';
    } else {
      if (value < 50) return 'text-green-400';
      if (value < 80) return 'text-yellow-400';
      return 'text-red-400';
    }
  };

  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive());
    toast.success(isRealTimeActive() ? 'Real-time monitoring paused' : 'Real-time monitoring resumed');
  };

  const filteredDevices = () => {
    if (filterStatus() === 'all') return devices();
    return devices().filter(device => device.status === filterStatus());
  };

  return (
    <div class="p-6 space-y-6 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen">
      {/* Header */}
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Monitoring Real-time</h1>
          <p class="text-white/70 mt-1">
            Live network status & device relocation synchronization
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 text-sm">
            <div class={`w-2 h-2 rounded-full ${isRealTimeActive() ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span class="text-white/70">
              {isRealTimeActive() ? 'Live Monitoring' : 'Paused'}
            </span>
          </div>
          <button
            onClick={toggleRealTime}
            class={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm ${
              isRealTimeActive() 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRealTimeActive() ? <Pause size={16} /> : <Play size={16} />}
            {isRealTimeActive() ? 'Pause' : 'Resume'}
          </button>
          <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 backdrop-blur-sm">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-white/70">Total Devices</p>
              <p class="text-2xl font-bold text-white">{systemMetrics().totalDevices}</p>
              <p class="text-xs text-green-400 flex items-center gap-1 mt-1">
                <CheckCircle size={12} />
                {systemMetrics().onlineDevices} online
              </p>
            </div>
            <div class="p-3 bg-blue-500/20 rounded-lg">
              <Server class="text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-white/70">Route Changes</p>
              <p class="text-2xl font-bold text-white">{systemMetrics().routeChanges}</p>
              <p class="text-xs text-orange-400 flex items-center gap-1 mt-1">
                <TrendingUp size={12} />
                Last 24h
              </p>
            </div>
            <div class="p-3 bg-orange-500/20 rounded-lg">
              <MapPin class="text-orange-400" size={24} />
            </div>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-white/70">Data Flows</p>
              <p class="text-2xl font-bold text-white">{systemMetrics().dataFlows}</p>
              <p class="text-xs text-purple-400 flex items-center gap-1 mt-1">
                <Activity size={12} />
                Active streams
              </p>
            </div>
            <div class="p-3 bg-purple-500/20 rounded-lg">
              <Activity class="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-white/70">SurrealDB Sync</p>
              <div class="flex items-center gap-2 mt-1">
                <div class={`w-2 h-2 rounded-full ${
                  systemMetrics().syncStatus === 'synced' ? 'bg-green-500' : 
                  systemMetrics().syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span class="text-sm font-medium capitalize text-white">
                  {systemMetrics().syncStatus}
                </span>
              </div>
              <p class="text-xs text-white/50 mt-1">Last sync: {systemMetrics().lastSync}</p>
            </div>
            <div class="p-3 bg-green-500/20 rounded-lg">
              <Zap class="text-green-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Data Flows */}
      <div class="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4">
        <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity class="text-blue-400" size={20} />
          Live Data Staging & Flows
        </h2>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <For each={dataFlows()}>
            {(flow) => (
              <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div class="flex items-center gap-3">
                  <div class={`w-2 h-2 rounded-full ${
                    flow.status === 'processing' ? 'bg-yellow-500 animate-pulse' :
                    flow.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p class="text-sm font-medium text-white">{flow.source} → {flow.destination}</p>
                    <p class="text-xs text-white/60">{flow.protocol} • {flow.dataSize.toFixed(1)} MB</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                    flow.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                    flow.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {flow.status}
                  </span>
                  <p class="text-xs text-white/50 mt-1">
                    {new Date(flow.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Devices Grid */}
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            <Server class="text-green-400" size={20} />
            Network Devices
          </h2>
          <select
            value={filterStatus()}
            onChange={(e) => setFilterStatus(e.currentTarget.value)}
            class="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
          >
            <option value="all" class="bg-gray-800">All Status</option>
            <option value="online" class="bg-gray-800">Online</option>
            <option value="warning" class="bg-gray-800">Warning</option>
            <option value="error" class="bg-gray-800">Error</option>
            <option value="offline" class="bg-gray-800">Offline</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <For each={filteredDevices()}>
            {(device) => {
              const DeviceIcon = getDeviceIcon(device.type);
              return (
                <div 
                  class="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 hover:bg-white/15 cursor-pointer transition-all"
                  onClick={() => {
                    setSelectedDevice(device);
                    setShowDeviceModal(true);
                  }}
                >
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <DeviceIcon class="text-blue-400" size={20} />
                      <span class="text-sm text-white/60">{device.type}</span>
                    </div>
                    <div class={`w-2 h-2 rounded-full ${getStatusColor(device.status).split(' ')[1]}`}></div>
                  </div>
                  
                  <h3 class="font-medium text-white mb-1">{device.name}</h3>
                  <p class="text-xs text-white/60 mb-3">{device.location}</p>
                  
                  <div class="space-y-2">
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-white/60">CPU</span>
                      <span class={`text-xs font-medium ${getMetricColor(device.metrics.cpu)}`}>
                        {device.metrics.cpu.toFixed(0)}%
                      </span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-white/60">Memory</span>
                      <span class={`text-xs font-medium ${getMetricColor(device.metrics.memory)}`}>
                        {device.metrics.memory.toFixed(0)}%
                      </span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-white/60">Latency</span>
                      <span class={`text-xs font-medium ${getMetricColor(device.metrics.latency, true)}`}>
                        {device.metrics.latency.toFixed(1)}ms
                      </span>
                    </div>
                  </div>
                  
                  <div class="mt-3 pt-3 border-t border-white/10">
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-white/60">Routes</span>
                      <span class="text-xs text-white">{device.routes.length}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-white/60">Last Seen</span>
                      <span class="text-xs text-white">
                        {new Date(device.lastSeen).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>

      {/* Device Detail Modal */}
      <Show when={showDeviceModal() && selectedDevice()}>
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-white/20 flex items-center justify-between">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                {(() => {
                  const DeviceIcon = getDeviceIcon(selectedDevice()?.type || '');
                  return <DeviceIcon class="text-blue-400" size={24} />;
                })()}
                {selectedDevice()?.name}
              </h2>
              <button
                onClick={() => setShowDeviceModal(false)}
                class="text-white/40 hover:text-white/60"
              >
                ✕
              </button>
            </div>
            
            <div class="p-6 space-y-6">
              {/* Device Info */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="font-semibold text-white mb-3">Device Information</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-white/60">Type:</span>
                      <span class="text-white">{selectedDevice()?.type}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-white/60">Status:</span>
                      <span class={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDevice()?.status || '')}`}>
                        {selectedDevice()?.status}
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-white/60">Location:</span>
                      <span class="text-white">{selectedDevice()?.location}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-white/60">Last Seen:</span>
                      <span class="text-white">
                        {new Date(selectedDevice()?.lastSeen || '').toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 class="font-semibold text-white mb-3">Performance Metrics</h3>
                  <div class="space-y-3">
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-white/60">CPU Usage</span>
                        <span class={getMetricColor(selectedDevice()?.metrics.cpu || 0)}>
                          {selectedDevice()?.metrics.cpu.toFixed(1)}%
                        </span>
                      </div>
                      <div class="w-full bg-white/10 rounded-full h-2">
                        <div 
                          class={`h-2 rounded-full ${(selectedDevice()?.metrics.cpu || 0) > 80 ? 'bg-red-500' : (selectedDevice()?.metrics.cpu || 0) > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={`width: ${selectedDevice()?.metrics.cpu || 0}%`}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-white/60">Memory Usage</span>
                        <span class={getMetricColor(selectedDevice()?.metrics.memory || 0)}>
                          {selectedDevice()?.metrics.memory.toFixed(1)}%
                        </span>
                      </div>
                      <div class="w-full bg-white/10 rounded-full h-2">
                        <div 
                          class={`h-2 rounded-full ${(selectedDevice()?.metrics.memory || 0) > 80 ? 'bg-red-500' : (selectedDevice()?.metrics.memory || 0) > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={`width: ${selectedDevice()?.metrics.memory || 0}%`}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-white/60">Bandwidth Usage</span>
                        <span class={getMetricColor(selectedDevice()?.metrics.bandwidth || 0)}>
                          {selectedDevice()?.metrics.bandwidth.toFixed(1)}%
                        </span>
                      </div>
                      <div class="w-full bg-white/10 rounded-full h-2">
                        <div 
                          class={`h-2 rounded-full ${(selectedDevice()?.metrics.bandwidth || 0) > 80 ? 'bg-red-500' : (selectedDevice()?.metrics.bandwidth || 0) > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={`width: ${selectedDevice()?.metrics.bandwidth || 0}%`}
                        ></div>
                      </div>
                    </div>
                    
                    <div class="flex justify-between text-sm">
                      <span class="text-white/60">Latency:</span>
                      <span class={getMetricColor(selectedDevice()?.metrics.latency || 0, true)}>
                        {selectedDevice()?.metrics.latency.toFixed(1)}ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Routes Table */}
              <div>
                <h3 class="font-semibold text-white mb-3">Routing Table</h3>
                <Show when={(selectedDevice()?.routes?.length || 0) > 0} fallback={
                  <p class="text-white/60 text-sm">No routes configured for this device.</p>
                }>
                  <div class="overflow-x-auto">
                    <table class="w-full border border-white/20 rounded-lg">
                      <thead class="bg-white/10">
                        <tr>
                          <th class="text-left py-2 px-3 text-sm font-medium text-white">Destination</th>
                          <th class="text-left py-2 px-3 text-sm font-medium text-white">Gateway</th>
                          <th class="text-left py-2 px-3 text-sm font-medium text-white">Interface</th>
                          <th class="text-left py-2 px-3 text-sm font-medium text-white">Metric</th>
                          <th class="text-left py-2 px-3 text-sm font-medium text-white">Status</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-white/10">
                        <For each={selectedDevice()?.routes || []}>
                          {(route) => (
                            <tr>
                              <td class="py-2 px-3 text-sm text-white">{route.destination}</td>
                              <td class="py-2 px-3 text-sm text-white/60">{route.gateway}</td>
                              <td class="py-2 px-3 text-sm text-white/60">{route.interface}</td>
                              <td class="py-2 px-3 text-sm text-white">{route.metric}</td>
                              <td class="py-2 px-3 text-sm">
                                <span class={`px-2 py-1 rounded-full text-xs font-medium ${
                                  route.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                  route.status === 'changed' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {route.status}
                                </span>
                              </td>
                            </tr>
                          )}
                        </For>
                      </tbody>
                    </table>
                  </div>
                </Show>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Monitoring;