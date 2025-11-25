// src/layouts/Layout.tsx
import { createSignal, createEffect, Show, For, JSX, onMount } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import { Search, Bell, User, LogOut, Menu, X, LayoutGrid, Package, GitMerge, BarChart2, Activity } from 'lucide-solid';
import { toast } from 'solid-toast';
import { authState, logout } from '../stores/auth';

const Layout = (props: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [notificationDropdownOpen, setNotificationDropdownOpen] = createSignal(false);
  const [currentTime, setCurrentTime] = createSignal('');
  const [isLoaded, setIsLoaded] = createSignal(false);

  onMount(() => {
    setIsLoaded(true);
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit'
      }));
    };
    updateTime();
    setInterval(updateTime, 1000);
  });

  createEffect(() => {
    console.log('Layout checking auth state:', authState);
    if (!authState.isLoggedIn) {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.log('No auth token found, redirecting to login');
        navigate('/login');
      }
    }
  });

  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard', description: 'Overview sistem' },
    { icon: Package, label: 'Manajemen Pesanan', path: '/orders', description: 'Service orders & bandwidth' },
    { icon: GitMerge, label: 'Rekonsiliasi Jaringan', path: '/reconciliation', description: 'Fiber optic reconciliation' },
    { icon: BarChart2, label: 'Analitik AI', path: '/analytics', description: 'Predictive insights' },
    { icon: Activity, label: 'Monitoring Real-time', path: '/monitoring', description: 'Live network status' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Berhasil logout');
    navigate('/login');
  };

  const getUserEmail = () => {
    return authState.user?.username + '@telkom.co.id' || 'admin@telkom.co.id';
  };

  const notifications = () => [
    { id: 1, message: 'Auto-discovery menemukan 15 device baru', time: '5 menit lalu', read: false, type: 'success' },
    { id: 2, message: 'Bandwidth utilization mencapai 85% di TBS1', time: '15 menit lalu', read: false, type: 'warning' },
    { id: 3, message: 'Reconciliation completed: 0 conflicts found', time: '1 jam lalu', read: true, type: 'info' },
  ];

  const unreadNotifications = () => notifications().filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  // Direct mobile navigation handler
  const handleMobileNavigation = (path: string, e: MouseEvent) => {
    e.preventDefault();
    console.log('Mobile navigation clicked:', path);
    setMobileMenuOpen(false);
    // Use setTimeout to ensure sidebar closes before navigation
    setTimeout(() => {
      navigate(path);
    }, 150);
  };

  // Handle overlay click - only close if clicking on the overlay itself
  const handleOverlayClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileMenuOpen(false);
  };

  return (
    <div class="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div class="absolute inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.4%22%3E%3Ccircle%20cx=%227%22%20cy=%227%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        {/* Floating Orbs */}
        <div class="absolute top-20 left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Network Lines Animation */}
      <svg class="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 800">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0" />
            <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0" />
          </linearGradient>
        </defs>
        <path d="M0,100 Q250,50 500,100 T1000,100" 
              stroke="url(#lineGradient)" 
              stroke-width="1" 
              fill="none"
              class="animate-pulse">
        </path>
        <path d="M0,200 Q300,150 600,200 T1000,200" 
              stroke="url(#lineGradient)" 
              stroke-width="1" 
              fill="none"
              class="animate-pulse delay-500">
        </path>
      </svg>

      {/* Mobile Menu Overlay - Higher z-index */}
      <Show when={mobileMenuOpen()}>
        <div 
          class="fixed inset-0 bg-black/50 lg:hidden"
          style="z-index: 45;"
          onClick={handleOverlayClick}
        />
      </Show>

      <div class="flex min-h-screen relative z-10">
        {/* Desktop Sidebar */}
        <aside 
          class="hidden lg:flex flex-col bg-slate-800/95 border-r border-slate-700 shadow-2xl w-80"
        >
          {/* Logo Section */}
          <div class="p-6">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 3L4 14h6l-2 7 9-11h-6l2-7z"/>
                </svg>
              </div>
              <div class={`transition-all duration-300 ${isLoaded() ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                <h1 class="font-bold text-white text-lg whitespace-nowrap">
                  Telkom Infra
                </h1>
                <p class="text-blue-200 text-xs font-medium">
                  Management System
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav class="px-4 space-y-3 flex-1">
            <For each={menuItems}>
              {(item, index) => (
                <a
                  href={item.path}
                  class={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative
                    ${location.pathname.startsWith(item.path) && item.path !== '/' 
                      ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg border border-blue-500/50' 
                      : location.pathname === '/' && item.path === '/dashboard' ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg border border-blue-500/50'
                      : 'text-blue-100 hover:bg-slate-700/50 hover:text-white hover:border-slate-600 border border-transparent'
                    }
                  `}
                >
                  <div class={`p-2 rounded-lg ${
                    location.pathname.startsWith(item.path) && item.path !== '/' 
                      ? 'bg-white/20' 
                      : location.pathname === '/' && item.path === '/dashboard' ? 'bg-white/20'
                      : 'group-hover:bg-white/10'
                  }`}>
                    <item.icon class="w-5 h-5 flex-shrink-0" />
                  </div>
                  <div class={`ml-4 transition-all duration-300 delay-${(index() + 1) * 50} ${
                    isLoaded() ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}>
                    <div class="font-medium whitespace-nowrap text-sm">
                      {item.label}
                    </div>
                    <div class="text-xs opacity-70 whitespace-nowrap">
                      {item.description}
                    </div>
                  </div>
                </a>
              )}
            </For>
          </nav>

          {/* System Status */}
          <div class="p-4">
            <div class="p-3 bg-slate-700/50 rounded-xl border border-slate-600 transition-all duration-300">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-green-300 text-xs font-medium">System Online</span>
                </div>
                <span class="text-white/70 text-xs font-mono">{currentTime()}</span>
              </div>
              <div class="text-xs text-white/50">
                SurrealDB • Network Optimal
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar - Fixed z-index and simplified structure */}
        <aside 
          class={`
            lg:hidden fixed top-0 left-0 h-full w-80 bg-slate-800 border-r border-slate-700 shadow-2xl transition-transform duration-300
            ${mobileMenuOpen() ? 'translate-x-0 z-50' : '-translate-x-full z-50'}
          `}
          style="z-index: 50;"
        >
          {/* Logo */}
          <div class="p-6 border-b border-slate-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 3L4 14h6l-2 7 9-11h-6l2-7z"/>
                  </svg>
                </div>
                <div>
                  <h1 class="font-bold text-white text-lg">Telkom Infra</h1>
                  <p class="text-blue-200 text-xs font-medium">Management System</p>
                </div>
              </div>
              {/* Close button for mobile sidebar */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                class="p-2 rounded-xl hover:bg-slate-700 transition-colors text-white/70 hover:text-white"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation - Using div with click handler for better mobile compatibility */}
          <nav class="p-4 space-y-3 flex-1 overflow-y-auto">
            <For each={menuItems}>
              {(item) => (
                <div
                  onClick={(e) => handleMobileNavigation(item.path, e)}
                  class={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group w-full text-left cursor-pointer
                    ${location.pathname.startsWith(item.path) && item.path !== '/'
                      ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg border border-blue-500/50' 
                      : location.pathname === '/' && item.path === '/dashboard' ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg border border-blue-500/50'
                      : 'text-blue-100 hover:bg-slate-700/50 hover:text-white border border-transparent'
                    }
                  `}
                >
                  <div class={`p-2 rounded-lg ${
                    location.pathname.startsWith(item.path) && item.path !== '/' 
                      ? 'bg-white/20' 
                      : location.pathname === '/' && item.path === '/dashboard' ? 'bg-white/20'
                      : 'group-hover:bg-white/10'
                  }`}>
                    <item.icon class="w-5 h-5 flex-shrink-0" />
                  </div>
                  <div>
                    <div class="font-medium text-sm">{item.label}</div>
                    <div class="text-xs opacity-70">{item.description}</div>
                  </div>
                </div>
              )}
            </For>
          </nav>

          {/* System Status for Mobile */}
          <div class="p-4 border-t border-slate-700">
            <div class="p-3 bg-slate-700/50 rounded-xl border border-slate-600 transition-all duration-300">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-green-300 text-xs font-medium">System Online</span>
                </div>
                <span class="text-white/70 text-xs font-mono">{currentTime()}</span>
              </div>
              <div class="text-xs text-white/50">
                SurrealDB • Network Optimal
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div class="flex-1 flex flex-col">
          {/* Header */}
          <header class="sticky top-0 z-30 bg-slate-800/90 border-b border-slate-700 shadow-lg">
            <div class="px-6 py-4">
              <div class="flex items-center justify-between">
                {/* Left Section */}
                <div class="flex items-center space-x-6">
                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen())}
                    class="lg:hidden p-2 rounded-xl hover:bg-slate-700 transition-colors bg-slate-700/50 border border-slate-600"
                  >
                    <Menu class="w-5 h-5 text-white" />
                  </button>

                  {/* Search */}
                  <div class="relative hidden sm:block">
                    <div class="relative flex items-center">
                      <Search class="absolute left-4 w-4 h-4 text-white/60" />
                      <input
                        type="text"
                        placeholder="Search sistem, orders, devices..."
                        value={searchQuery()}
                        onInput={(e) => setSearchQuery(e.currentTarget.value)}
                        class="pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all w-80 placeholder-white/50 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div class="flex items-center space-x-4">
                  {/* System Status Indicator */}
                  <div class="hidden md:flex items-center space-x-2 px-3 py-2 bg-slate-700/50 rounded-lg border border-slate-600">
                    <div class="flex space-x-1">
                      <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                      <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                    <span class="text-white/80 text-xs font-medium">Live</span>
                  </div>

                  {/* Notifications */}
                  <div class="relative">
                    <button
                      onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen())}
                      class="relative p-3 rounded-xl hover:bg-slate-700 transition-colors bg-slate-700/50 border border-slate-600 group"
                    >
                      <Bell class="w-5 h-5 text-white group-hover:text-blue-200 transition-colors" />
                      <Show when={unreadNotifications() > 0}>
                        <div class="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center shadow-lg animate-pulse">
                          {unreadNotifications()}
                        </div>
                      </Show>
                    </button>

                    {/* Notification Dropdown */}
                    <Show when={notificationDropdownOpen()}>
                      <div class="absolute right-0 mt-3 w-96 bg-slate-800/95 border border-slate-700 rounded-2xl shadow-2xl z-50">
                        <div class="p-4 border-b border-slate-700">
                          <div class="flex items-center justify-between">
                            <h3 class="font-semibold text-white">Notifikasi Real-time</h3>
                            <span class="text-xs text-white/60">{unreadNotifications()} baru</span>
                          </div>
                        </div>
                        <div class="max-h-80 overflow-y-auto">
                          <For each={notifications()}>
                            {(notif) => (
                              <div class={`p-4 border-b border-white/5 transition-colors hover:bg-white/5 ${
                                !notif.read ? 'bg-white/5' : ''
                              }`}>
                                <div class="flex items-start space-x-3">
                                  <span class="text-lg flex-shrink-0">{getNotificationIcon(notif.type)}</span>
                                  <div class="flex-1">
                                    <p class="text-sm text-white font-medium">{notif.message}</p>
                                    <p class="text-xs text-white/60 mt-1">{notif.time}</p>
                                  </div>
                                  {!notif.read && (
                                    <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                  )}
                                </div>
                              </div>
                            )}
                          </For>
                          <Show when={notifications().length === 0}>
                            <div class="p-6 text-center text-white/60">
                              <Bell class="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p class="text-sm">Tidak ada notifikasi baru</p>
                            </div>
                          </Show>
                        </div>
                      </div>
                    </Show>
                  </div>

                  {/* Profile */}
                  <div class="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen())}
                      class="flex items-center space-x-3 p-2 pr-4 rounded-xl hover:bg-slate-700 transition-colors bg-slate-700/50 border border-slate-600 group"
                    >
                      <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <User class="w-5 h-5 text-white" />
                      </div>
                      <div class="hidden sm:block text-left">
                        <div class="text-sm font-medium text-white">
                          {getUserEmail().split('@')[0]}
                        </div>
                        <div class="text-xs text-white/60">
                          Administrator
                        </div>
                      </div>
                    </button>

                    {/* Profile Dropdown */}
                    <Show when={profileDropdownOpen()}>
                      <div class="absolute right-0 mt-3 w-64 bg-slate-800/95 border border-slate-700 rounded-2xl shadow-2xl z-50">
                        <div class="p-4 border-b border-slate-700">
                          <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                              <User class="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p class="text-sm font-medium text-white">{getUserEmail().split('@')[0]}</p>
                              <p class="text-xs text-white/60">{getUserEmail()}</p>
                              <p class="text-xs text-blue-300">System Administrator</p>
                            </div>
                          </div>
                        </div>
                        <div class="p-2">
                          <button
                            onClick={handleLogout}
                            class="flex items-center space-x-3 px-4 py-3 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-colors w-full text-left rounded-xl"
                          >
                            <LogOut class="w-4 h-4" />
                            <span>Logout dari Sistem</span>
                          </button>
                        </div>
                      </div>
                    </Show>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main class="p-6 flex-1">
            <div class={`transition-all duration-500 ${
              isLoaded() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {props.children}
            </div>
          </main>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      <Show when={profileDropdownOpen() || notificationDropdownOpen()}>
        <div
          class="fixed inset-0 z-20"
          onClick={() => {
            setProfileDropdownOpen(false);
            setNotificationDropdownOpen(false);
          }}
        />
      </Show>
    </div>
  );
};

export default Layout;