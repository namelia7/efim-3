// src/App.tsx
import { Router, Route, Navigate } from '@solidjs/router';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/DashboardPage';
import Orders from './pages/Orders';
import Monitoring from './pages/Monitoring';
import Analytics from './pages/Analytics';
import ReconciliationPage from './pages/ReconciliationPage';
import Login from './pages/Login/LoginPage';
import { onMount } from 'solid-js';
import { checkAuthStatus } from './stores/auth';
function App() {
  onMount(() => {
    checkAuthStatus(); // Cek auth saat app dimuat
  });
  return (
    <Router>
      <Route 
        path="/dashboard" 
        component={() => (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        )} 
      />
      <Route 
        path="/orders" 
        component={() => (
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        )} 
      />
      <Route 
        path="/monitoring" 
        component={() => (
          <PrivateRoute>
            <Monitoring />
          </PrivateRoute>
        )} 
      />
      <Route 
        path="/analytics" 
        component={() => (
          <PrivateRoute>
            <Analytics />
          </PrivateRoute>
        )} 
      />
      <Route 
        path="/reconciliation" 
        component={() => (
          <PrivateRoute>
            <ReconciliationPage />
          </PrivateRoute>
        )} 
      />
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <Navigate href="/dashboard" />} />
    </Router>
  );
}

export default App;
