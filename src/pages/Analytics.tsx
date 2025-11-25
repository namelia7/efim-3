// src/pages/Analytics.tsx
import { createSignal, onMount, For, Show } from 'solid-js';
import { 
  TrendingUp, 
  Brain, 
  AlertTriangle, 
  Zap,
  Cpu,
  BarChart3,
  LineChart,
  Target,
  Lightbulb,
  Clock,
  ArrowUp,
  ArrowDown,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Bot,
  Gauge,
  Download,
  Settings,
  RefreshCw,
  Eye,
  PlayCircle,
  Users,
  Server,
  Database
} from 'lucide-solid';


const Analytics = () => {
  const [selectedTimeRange, setSelectedTimeRange] = createSignal('7d');
  const [aiPredictionConfidence] = createSignal(87);
  const [modelAccuracy] = createSignal(92.5);
  const [showFullReport, setShowFullReport] = createSignal(false);
  const [showApplyModal, setShowApplyModal] = createSignal(false);
  const [animatedValues, setAnimatedValues] = createSignal({
    bandwidth: 0,
    capacity: 0,
    growth: 0
  });

  // Chart data for network traffic over time
  const [networkTrafficData, setNetworkTrafficData] = createSignal([
    { time: '00:00', bandwidth: 45, latency: 12, packets: 850 },
    { time: '04:00', bandwidth: 32, latency: 8, packets: 620 },
    { time: '08:00', bandwidth: 78, latency: 18, packets: 1240 },
    { time: '12:00', bandwidth: 85, latency: 22, packets: 1450 },
    { time: '16:00', bandwidth: 92, latency: 28, packets: 1680 },
    { time: '20:00', bandwidth: 88, latency: 25, packets: 1580 },
    { time: '24:00', bandwidth: 65, latency: 15, packets: 1120 }
  ]);

  // Regional performance data
  const [regionalData] = createSignal([
    { region: 'Jakarta', usage: 85, growth: 23, customers: 15420 },
    { region: 'Bandung', usage: 45, growth: 18, customers: 8350 },
    { region: 'Surabaya', usage: 62, growth: 31, customers: 12100 },
    { region: 'Medan', usage: 35, growth: 15, customers: 5680 },
    { region: 'Denpasar', usage: 71, growth: 28, customers: 9240 }
  ]);

  // Simulate real-time updates
  onMount(() => {
    // Animate counter values
    const interval = setInterval(() => {
      setAnimatedValues(prev => ({
        bandwidth: Math.min(prev.bandwidth + 2, 78),
        capacity: Math.min(prev.capacity + 3, 85),
        growth: Math.min(prev.growth + 1, 23)
      }));
    }, 50);

    setTimeout(() => clearInterval(interval), 2000);

    // Simulate real-time data updates
    setInterval(() => {
      setNetworkTrafficData(prev => prev.map(item => ({
        ...item,
        bandwidth: Math.max(20, Math.min(95, item.bandwidth + (Math.random() - 0.5) * 10)),
        latency: Math.max(5, Math.min(50, item.latency + (Math.random() - 0.5) * 5)),
        packets: Math.max(400, Math.min(2000, item.packets + (Math.random() - 0.5) * 200))
      })));
    }, 5000);
  });

  // Time range options
  const timeRanges = [
    { value: '24h', label: '24 Jam' },
    { value: '7d', label: '7 Hari' },
    { value: '30d', label: '30 Hari' },
    { value: '90d', label: '3 Bulan' }
  ];

  // AI Predictions Data
  const predictions = () => [
    {
      id: 1,
      type: 'warning',
      title: 'Prediksi Kapasitas Penuh',
      description: 'Node TBS-JKT-01 diprediksi mencapai kapasitas maksimum dalam 5 hari',
      confidence: 89,
      impact: 'high',
      suggestedAction: 'Tambahkan bandwidth 100Gbps atau lakukan load balancing',
      timeframe: '5 hari',
      priority: 'urgent'
    },
    {
      id: 2,
      type: 'success',
      title: 'Optimasi Route Terdeteksi',
      description: 'AI menemukan jalur alternatif yang dapat mengurangi latency 15ms',
      confidence: 92,
      impact: 'medium',
      suggestedAction: 'Implementasi route baru via Node TBS-BDG-02',
      timeframe: 'Immediate',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'info',
      title: 'Tren Pertumbuhan Normal',
      description: 'Pertumbuhan bandwidth konsisten dengan prediksi Q1 2025',
      confidence: 95,
      impact: 'low',
      suggestedAction: 'Monitoring rutin, tidak ada aksi urgent',
      timeframe: '30 hari',
      priority: 'low'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Anomali Pola Traffic',
      description: 'Detected unusual traffic patterns in Surabaya region during peak hours',
      confidence: 78,
      impact: 'medium',
      suggestedAction: 'Investigate potential DDoS or implement rate limiting',
      timeframe: '2 hari',
      priority: 'high'
    }
  ];

  // Network Growth Metrics
  const growthMetrics = () => [
    { label: 'Daily Growth', value: '+2.3%', trend: 'up', color: 'green' },
    { label: 'Weekly Growth', value: '+15.8%', trend: 'up', color: 'blue' },
    { label: 'Monthly Growth', value: '+48.2%', trend: 'up', color: 'purple' },
    { label: 'YoY Growth', value: '+156%', trend: 'up', color: 'indigo' }
  ];

  // Customer Behavior Insights
  const customerInsights = () => [
    { 
      segment: 'Enterprise',
      usage: 'Peak: 09:00-17:00',
      growth: '+12%',
      predictedDemand: 'Stable',
      avgBandwidth: '850 Mbps',
      customers: 2350,
      revenue: 'Rp 12.5B'
    },
    {
      segment: 'Residential',
      usage: 'Peak: 19:00-23:00',
      growth: '+28%',
      predictedDemand: 'Increasing',
      avgBandwidth: '125 Mbps',
      customers: 45600,
      revenue: 'Rp 8.2B'
    },
    {
      segment: 'Data Center',
      usage: '24/7 Consistent',
      growth: '+45%',
      predictedDemand: 'Rapid Growth',
      avgBandwidth: '10 Gbps',
      customers: 180,
      revenue: 'Rp 18.7B'
    }
  ];

  // AI Learning Progress
  const learningMetrics = () => [
    { metric: 'Total Predictions', value: '15,842', change: '+523 today', icon: Brain },
    { metric: 'Success Rate', value: '92.5%', change: '+0.3% this week', icon: Target },
    { metric: 'Data Points Analyzed', value: '2.3M', change: '+125K today', icon: Database },
    { metric: 'Model Version', value: 'v3.2.1', change: 'Updated 2 days ago', icon: Settings }
  ];

  // Capacity Planning Forecast
  const capacityForecast = () => [
    { node: 'TBS-JKT-01', current: 78, predicted7d: 85, predicted30d: 92, risk: 'high', location: 'Jakarta' },
    { node: 'TBS-BDG-02', current: 45, predicted7d: 48, predicted30d: 55, risk: 'low', location: 'Bandung' },
    { node: 'TBS-SBY-03', current: 62, predicted7d: 68, predicted30d: 75, risk: 'medium', location: 'Surabaya' },
    { node: 'TBS-MDN-04', current: 35, predicted7d: 37, predicted30d: 42, risk: 'low', location: 'Medan' },
    { node: 'TBS-DPS-05', current: 71, predicted7d: 79, predicted30d: 88, risk: 'high', location: 'Denpasar' },
    { node: 'TBS-PLB-06', current: 58, predicted7d: 64, predicted30d: 72, risk: 'medium', location: 'Palembang' }
  ];

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch(impact) {
      case 'high': return 'bg-red-500/30 text-red-300 border-red-500/50';
      case 'medium': return 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50';
      case 'low': return 'bg-green-500/30 text-green-300 border-green-500/50';
      default: return 'bg-gray-500/30 text-gray-300 border-gray-500/50';
    }
  };

  // Simple Line Chart Component
  const NetworkLineChart = (props: { data: any[], height?: number }) => {
    const height = props.height || 200;
    const padding = 40;
    const width = 400;
    
    const maxValue = Math.max(...props.data.map(d => d.bandwidth));
    const minValue = Math.min(...props.data.map(d => d.bandwidth));
    
    const points = props.data.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (props.data.length - 1);
      const y = height - padding - ((d.bandwidth - minValue) / (maxValue - minValue)) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width={width} height={height} class="w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#3B82F6" />
            <stop offset="100%" stop-color="#8B5CF6" />
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke="url(#lineGradient)"
          stroke-width="2"
          class="drop-shadow-sm"
        />
        <For each={props.data}>
          {(d, i) => {
            const x = padding + (i() * (width - 2 * padding)) / (props.data.length - 1);
            const y = height - padding - ((d.bandwidth - minValue) / (maxValue - minValue)) * (height - 2 * padding);
            return (
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#3B82F6"
                class="drop-shadow-sm hover:r-6 transition-all"
              />
            );
          }}
        </For>
      </svg>
    );
  };

  // Simple Bar Chart Component
  const NetworkBarChart = (props: { data: any[], height?: number }) => {
    const height = props.height || 200;
    const width = 400;
    const padding = 40;
    const maxValue = Math.max(...props.data.map(d => d.usage));
    
    return (
      <svg width={width} height={height} class="w-full h-full">
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#8B5CF6" />
            <stop offset="100%" stop-color="#3B82F6" />
          </linearGradient>
        </defs>
        <For each={props.data}>
          {(d, i) => {
            const barWidth = (width - 2 * padding) / props.data.length - 10;
            const barHeight = (d.usage / maxValue) * (height - 2 * padding);
            const x = padding + i() * ((width - 2 * padding) / props.data.length);
            const y = height - padding - barHeight;
            
            return (
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="url(#barGradient)"
                rx="4"
                class="hover:opacity-80 transition-opacity"
              />
            );
          }}
        </For>
      </svg>
    );
  };

  // Apply AI Recommendations function
  const applyAIRecommendations = () => {
    setShowApplyModal(true);
    // Simulate API call
    setTimeout(() => {
      setShowApplyModal(false);
      // Show success notification or update UI
    }, 3000);
  };

  return (
    <div class="p-6 space-y-6 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen">
        {/* Header Section */}
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
              <div class="p-3 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl backdrop-blur-sm border border-white/20">
                <Brain class="w-7 h-7" />
              </div>
              AI Analytics & Predictions
            </h1>
            <p class="text-white/70 mt-2">Machine Learning-powered network insights and capacity planning</p>
          </div>
          
          {/* Time Range Selector */}
          <div class="flex gap-2">
            <For each={timeRanges}>
              {(range) => (
                <button
                  onClick={() => setSelectedTimeRange(range.value)}
                  class={`px-4 py-2 rounded-lg backdrop-blur-sm transition-all ${
                    selectedTimeRange() === range.value
                      ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white border border-white/30'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {range.label}
                </button>
              )}
            </For>
          </div>
        </div>

        {/* AI Status Cards */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/20 group hover:scale-[1.02] transition-transform">
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-white/20 rounded-xl">
                <Bot class="w-6 h-6 text-blue-300" />
              </div>
              <span class="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-lg">AI Engine</span>
            </div>
            <div class="space-y-2">
              <h3 class="text-white/80 text-sm">Model Accuracy</h3>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-white">{modelAccuracy()}%</span>
                <span class="text-xs text-green-400 flex items-center">
                  <ArrowUp class="w-3 h-3" /> 0.3%
                </span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-1000"
                     style={`width: ${modelAccuracy()}%`}></div>
              </div>
            </div>
          </div>

          <div class="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-2xl p-6 border border-white/20 group hover:scale-[1.02] transition-transform">
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-white/20 rounded-xl">
                <Target class="w-6 h-6 text-green-300" />
              </div>
              <span class="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-lg">Predictions</span>
            </div>
            <div class="space-y-2">
              <h3 class="text-white/80 text-sm">Confidence Level</h3>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-white">{aiPredictionConfidence()}%</span>
                <span class="text-xs text-green-400 flex items-center">
                  <ArrowUp class="w-3 h-3" /> High
                </span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full transition-all duration-1000"
                     style={`width: ${aiPredictionConfidence()}%`}></div>
              </div>
            </div>
          </div>

          <div class="backdrop-blur-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-white/20 group hover:scale-[1.02] transition-transform">
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-white/20 rounded-xl">
                <Gauge class="w-6 h-6 text-orange-300" />
              </div>
              <span class="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-lg">Capacity</span>
            </div>
            <div class="space-y-2">
              <h3 class="text-white/80 text-sm">Network Utilization</h3>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-white">{animatedValues().bandwidth}%</span>
                <span class="text-xs text-yellow-400 flex items-center">
                  <AlertCircle class="w-3 h-3 ml-1" /> Near limit
                </span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full transition-all duration-1000"
                     style={`width: ${animatedValues().bandwidth}%`}></div>
              </div>
            </div>
          </div>

          <div class="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/20 group hover:scale-[1.02] transition-transform">
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-white/20 rounded-xl">
                <TrendingUp class="w-6 h-6 text-purple-300" />
              </div>
              <span class="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-lg">Growth</span>
            </div>
            <div class="space-y-2">
              <h3 class="text-white/80 text-sm">Demand Growth</h3>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-white">+{animatedValues().growth}%</span>
                <span class="text-xs text-purple-400">Monthly</span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-1000"
                     style={`width: ${animatedValues().growth * 3}%`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Traffic Chart */}
          <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-white flex items-center gap-2">
                <LineChart class="w-5 h-5 text-blue-400" />
                Network Traffic Trend
              </h3>
              <div class="flex items-center gap-2 text-xs text-white/60">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live Data
              </div>
            </div>
            <div class="h-64">
              <NetworkLineChart data={networkTrafficData()} height={200} />
            </div>
            <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
              <div class="text-center">
                <p class="text-xs text-white/60">Peak Usage</p>
                <p class="text-lg font-bold text-white">92%</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-white/60">Avg Latency</p>
                <p class="text-lg font-bold text-white">18ms</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-white/60">Total Packets</p>
                <p class="text-lg font-bold text-white">1.45M</p>
              </div>
            </div>
          </div>

          {/* Regional Performance Chart */}
          <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 class="w-5 h-5 text-purple-400" />
                Regional Performance
              </h3>
              <button class="text-xs text-white/60 hover:text-white transition-colors bg-white/10 px-3 py-1 rounded-lg">
                View Details
              </button>
            </div>
            <div class="h-64">
              <NetworkBarChart data={regionalData()} height={200} />
            </div>
            <div class="mt-4 space-y-2">
              <For each={regionalData()}>
                {(region) => (
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-white/80">{region.region}</span>
                    <div class="flex items-center gap-2">
                      <span class="text-white">{region.usage}%</span>
                      <span class="text-green-400 text-xs">+{region.growth}%</span>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* AI Predictions Panel */}
          <div class="xl:col-span-2 space-y-4">
            <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-white flex items-center gap-2">
                  <Sparkles class="w-5 h-5 text-yellow-400" />
                  AI Predictions & Recommendations
                </h2>
                <div class="flex items-center gap-2 text-xs text-white/60">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Real-time Analysis
                </div>
              </div>

              <div class="space-y-4">
                <For each={predictions()}>
                  {(prediction) => (
                    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all group">
                      <div class="flex items-start justify-between mb-3">
                        <div class="flex items-start gap-3">
                          <div class={`p-2 rounded-lg ${
                            prediction.type === 'warning' ? 'bg-yellow-500/20' :
                            prediction.type === 'success' ? 'bg-green-500/20' :
                            'bg-blue-500/20'
                          }`}>
                            {prediction.type === 'warning' ? <AlertTriangle class="w-5 h-5 text-yellow-400" /> :
                             prediction.type === 'success' ? <CheckCircle class="w-5 h-5 text-green-400" /> :
                             <Info class="w-5 h-5 text-blue-400" />}
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                              <h3 class="text-white font-medium text-sm">{prediction.title}</h3>
                              <span class={`text-xs px-2 py-0.5 rounded ${
                                prediction.priority === 'urgent' ? 'bg-red-500/30 text-red-300' :
                                prediction.priority === 'high' ? 'bg-yellow-500/30 text-yellow-300' :
                                'bg-green-500/30 text-green-300'
                              }`}>
                                {prediction.priority}
                              </span>
                            </div>
                            <p class="text-white/70 text-sm">{prediction.description}</p>
                          </div>
                        </div>
                        <div class="flex flex-col items-end gap-2">
                          <span class={`text-xs px-2 py-1 rounded-lg border ${getImpactBadge(prediction.impact)}`}>
                            Impact: {prediction.impact}
                          </span>
                          <div class="flex items-center gap-1">
                            <span class="text-xs text-white/50">Confidence:</span>
                            <span class="text-xs font-bold text-white">{prediction.confidence}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="bg-white/5 rounded-lg p-3 mt-3">
                        <div class="flex items-start gap-2">
                          <Lightbulb class="w-4 h-4 text-yellow-300 mt-0.5" />
                          <div class="flex-1">
                            <p class="text-xs text-white/60 mb-1">Suggested Action:</p>
                            <p class="text-sm text-white/90">{prediction.suggestedAction}</p>
                          </div>
                          <div class="flex items-center gap-1 text-xs text-white/50">
                            <Clock class="w-3 h-3" />
                            {prediction.timeframe}
                          </div>
                        </div>
                      </div>

                      {/* Confidence Bar */}
                      <div class="mt-3">
                        <div class="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                          <div class="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-1000"
                               style={`width: ${prediction.confidence}%`}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>

            {/* Enhanced Capacity Planning Forecast */}
            <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-white flex items-center gap-2">
                  <BarChart3 class="w-5 h-5 text-blue-400" />
                  Capacity Planning Forecast
                </h2>
                <div class="flex gap-2">
                  <button 
                    onClick={() => setShowFullReport(true)}
                    class="text-xs text-white/60 hover:text-white transition-colors bg-white/10 px-3 py-1 rounded-lg flex items-center gap-1"
                  >
                    <Eye class="w-3 h-3" />
                    View Full Report
                  </button>
                  <button class="text-xs text-white/60 hover:text-white transition-colors bg-white/10 px-3 py-1 rounded-lg flex items-center gap-1">
                    <Download class="w-3 h-3" />
                    Export
                  </button>
                </div>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="text-left border-b border-white/10">
                      <th class="pb-3 text-xs font-medium text-white/60">Node</th>
                      <th class="pb-3 text-xs font-medium text-white/60">Location</th>
                      <th class="pb-3 text-xs font-medium text-white/60">Current</th>
                      <th class="pb-3 text-xs font-medium text-white/60">7 Days</th>
                      <th class="pb-3 text-xs font-medium text-white/60">30 Days</th>
                      <th class="pb-3 text-xs font-medium text-white/60">Risk Level</th>
                      <th class="pb-3 text-xs font-medium text-white/60">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={capacityForecast()}>
                      {(node) => (
                        <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td class="py-4 text-sm font-medium text-white">{node.node}</td>
                          <td class="py-4 text-sm text-white/80">{node.location}</td>
                          <td class="py-4">
                            <div class="flex items-center gap-2">
                              <span class="text-sm text-white">{node.current}%</span>
                              <div class="w-16 bg-white/10 rounded-full h-1.5 overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
                                     style={`width: ${node.current}%`}></div>
                              </div>
                            </div>
                          </td>
                          <td class="py-4">
                            <div class="flex items-center gap-1">
                              <span class={`text-sm ${node.predicted7d > 80 ? 'text-yellow-400' : 'text-white/80'}`}>
                                {node.predicted7d}%
                              </span>
                              {node.predicted7d > node.current && (
                                <ArrowUp class="w-3 h-3 text-yellow-400" />
                              )}
                            </div>
                          </td>
                          <td class="py-4">
                            <div class="flex items-center gap-1">
                              <span class={`text-sm ${node.predicted30d > 85 ? 'text-red-400' : 'text-white/80'}`}>
                                {node.predicted30d}%
                              </span>
                              {node.predicted30d > node.predicted7d && (
                                <ArrowUp class="w-3 h-3 text-red-400" />
                              )}
                            </div>
                          </td>
                          <td class="py-4">
                            <span class={`text-xs px-2 py-1 rounded-lg ${getRiskColor(node.risk)}`}>
                              {node.risk}
                            </span>
                          </td>
                          <td class="py-4">
                            <button class="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                              Monitor
                            </button>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>

              {/* Summary Statistics */}
              <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div class="text-center">
                  <p class="text-xs text-white/60">High Risk Nodes</p>
                  <p class="text-2xl font-bold text-red-400">2</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-white/60">Medium Risk</p>
                  <p class="text-2xl font-bold text-yellow-400">2</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-white/60">Low Risk</p>
                  <p class="text-2xl font-bold text-green-400">2</p>
                </div>
                <div class="text-center">
                  <p class="text-xs text-white/60">Avg Utilization</p>
                  <p class="text-2xl font-bold text-white">58%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div class="space-y-4">
            {/* Enhanced Customer Behavior Insights */}
            <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users class="w-5 h-5 text-purple-400" />
                Customer Behavior Insights
              </h3>
              
              <div class="space-y-4">
                <For each={customerInsights()}>
                  {(segment) => (
                    <div class="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div class="flex items-center justify-between mb-3">
                        <h4 class="text-white font-medium">{segment.segment}</h4>
                        <span class="text-xs text-green-400">{segment.growth}</span>
                      </div>
                      <div class="space-y-2 text-xs">
                        <div class="flex justify-between">
                          <span class="text-white/60">Peak Usage:</span>
                          <span class="text-white/80">{segment.usage}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-white/60">Avg Bandwidth:</span>
                          <span class="text-white/80">{segment.avgBandwidth}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-white/60">Customers:</span>
                          <span class="text-white/80">{segment.customers.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-white/60">Revenue:</span>
                          <span class="text-white/80">{segment.revenue}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-white/60">Demand Trend:</span>
                          <span class={`${
                            segment.predictedDemand === 'Rapid Growth' ? 'text-red-400' :
                            segment.predictedDemand === 'Increasing' ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>{segment.predictedDemand}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>

            {/* Enhanced AI Learning Progress */}
            <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Cpu class="w-5 h-5 text-cyan-400" />
                AI Model Performance
              </h3>
              
              <div class="space-y-4">
                <For each={learningMetrics()}>
                  {(metric) => (
                    <div class="flex items-center gap-3 py-3 border-b border-white/10 last:border-0">
                      <div class="p-2 bg-white/10 rounded-lg">
                        <metric.icon class="w-4 h-4 text-blue-400" />
                      </div>
                      <div class="flex-1">
                        <p class="text-xs text-white/60">{metric.metric}</p>
                        <p class="text-lg font-semibold text-white">{metric.value}</p>
                        <p class="text-xs text-blue-400">{metric.change}</p>
                      </div>
                    </div>
                  )}
                </For>
              </div>

              <div class="mt-4 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-white/20">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-xs text-white/80">Model Training Active</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-white/60">Next update in 2h 15m</span>
                  <button class="text-blue-400 hover:text-blue-300 transition-colors">
                    <RefreshCw class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Network Growth Metrics */}
            <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp class="w-5 h-5 text-green-400" />
                Growth Metrics
              </h3>
              
              <div class="grid grid-cols-1 gap-3">
                <For each={growthMetrics()}>
                  {(metric) => (
                    <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div class="flex items-center justify-between mb-2">
                        <p class="text-xs text-white/60">{metric.label}</p>
                        {metric.trend === 'up' ? 
                          <ArrowUp class="w-4 h-4 text-green-400" /> :
                          <ArrowDown class="w-4 h-4 text-red-400" />
                        }
                      </div>
                      <div class="flex items-baseline justify-between">
                        <span class="text-xl font-bold text-white">{metric.value}</span>
                        <span class={`text-xs px-2 py-1 rounded ${
                          metric.color === 'green' ? 'bg-green-500/20 text-green-400' :
                          metric.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                          metric.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-indigo-500/20 text-indigo-400'
                        }`}>
                          {metric.color}
                        </span>
                      </div>
                      <div class="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
                        <div class={`h-full rounded-full transition-all duration-1000 ${
                          metric.color === 'green' ? 'bg-green-400' :
                          metric.color === 'blue' ? 'bg-blue-400' :
                          metric.color === 'purple' ? 'bg-purple-400' :
                          'bg-indigo-400'
                        }`} style="width: 75%"></div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>

            {/* Server Status Overview */}
            <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
              <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Server class="w-5 h-5 text-orange-400" />
                Infrastructure Status
              </h3>
              
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span class="text-sm text-white">Core Servers</span>
                  </div>
                  <span class="text-xs text-green-400">98.5% UP</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span class="text-sm text-white">Edge Nodes</span>
                  </div>
                  <span class="text-xs text-yellow-400">95.2% UP</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span class="text-sm text-white">Load Balancers</span>
                  </div>
                  <span class="text-xs text-green-400">100% UP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div class="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/20 p-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-white/20 rounded-xl">
                <Zap class="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 class="text-white font-medium">AI-Driven Optimization Active</h3>
                <p class="text-white/70 text-sm">System learning from 2.3M data points in real-time</p>
              </div>
            </div>
            <div class="flex gap-3">
              <button 
                onClick={() => setShowFullReport(true)}
                class="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20 flex items-center gap-2"
              >
                <Eye class="w-4 h-4" />
                View Full Report
              </button>
              <button 
                onClick={applyAIRecommendations}
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <PlayCircle class="w-4 h-4" />
                Apply AI Recommendations
              </button>
            </div>
          </div>
        </div>

        {/* Full Report Modal */}
        <Show when={showFullReport()}>
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-white">AI Analytics Full Report</h2>
                <button 
                  onClick={() => setShowFullReport(false)}
                  class="p-2 text-white/60 hover:text-white bg-white/10 rounded-lg transition-colors"
                >
                  <XCircle class="w-5 h-5" />
                </button>
              </div>
              
              <div class="space-y-6">
                {/* Executive Summary */}
                <div class="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 class="text-lg font-semibold text-white mb-4">Executive Summary</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="text-center p-4 bg-white/5 rounded-lg">
                      <p class="text-2xl font-bold text-green-400">92.5%</p>
                      <p class="text-sm text-white/60">Overall Network Health</p>
                    </div>
                    <div class="text-center p-4 bg-white/5 rounded-lg">
                      <p class="text-2xl font-bold text-yellow-400">4</p>
                      <p class="text-sm text-white/60">Critical Predictions</p>
                    </div>
                    <div class="text-center p-4 bg-white/5 rounded-lg">
                      <p class="text-2xl font-bold text-blue-400">15.8%</p>
                      <p class="text-sm text-white/60">Weekly Growth Rate</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Analytics */}
                <div class="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 class="text-lg font-semibold text-white mb-4">Key Findings</h3>
                  <ul class="space-y-3 text-sm text-white/80">
                    <li class="flex items-start gap-2">
                      <div class="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                      <span>Node TBS-JKT-01 showing critical capacity warning - requires immediate attention</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <div class="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <span>AI optimization improved overall network efficiency by 12% this week</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <div class="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <span>Residential segment showing 28% growth - infrastructure scaling needed</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <div class="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>New route optimization can reduce latency by 15ms on average</span>
                    </li>
                  </ul>
                </div>

                {/* Recommendations */}
                <div class="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 class="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
                  <div class="space-y-3">
                    <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p class="text-sm font-medium text-red-300">High Priority</p>
                      <p class="text-sm text-white/80">Upgrade Jakarta node capacity within 5 days to prevent service degradation</p>
                    </div>
                    <div class="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p class="text-sm font-medium text-yellow-300">Medium Priority</p>
                      <p class="text-sm text-white/80">Implement load balancing across Surabaya and Denpasar nodes</p>
                    </div>
                    <div class="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p class="text-sm font-medium text-green-300">Optimization</p>
                      <p class="text-sm text-white/80">Deploy new routing algorithm to improve overall network performance</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowFullReport(false)}
                  class="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
                <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                  <Download class="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </Show>

        {/* Apply AI Modal */}
        <Show when={showApplyModal()}>
          <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 max-w-md w-full">
              <div class="text-center">
                <div class="p-3 bg-blue-500/20 rounded-xl w-fit mx-auto mb-4">
                  <Bot class="w-8 h-8 text-blue-400" />
                </div>
                <h2 class="text-xl font-bold text-white mb-2">Applying AI Recommendations</h2>
                <p class="text-white/70 text-sm mb-6">The system is implementing AI-generated optimizations...</p>
                
                <div class="space-y-3 mb-6">
                  <div class="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="text-sm text-white">Updating routing tables...</span>
                  </div>
                  <div class="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span class="text-sm text-white">Optimizing bandwidth allocation...</span>
                  </div>
                  <div class="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span class="text-sm text-white">Configuring load balancers...</span>
                  </div>
                </div>

                <div class="w-full bg-white/10 rounded-full h-2 mb-4 overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-3000 animate-pulse" style="width: 67%"></div>
                </div>

                <button 
                  onClick={() => setShowApplyModal(false)}
                  class="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Run in Background
                </button>
              </div>
            </div>
          </div>
        </Show>
      </div>
    );
  };

  export default Analytics;