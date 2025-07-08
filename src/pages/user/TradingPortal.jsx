import React, { useState,useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchBrokerProfile, clearBrokerProfile } from '../../api/user';
import OrderList from './OrderList';
import PortfolioChart from '../../components/PortfolioChart';
import HoldingsTable from '../../components/HoldingsTable';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook

import './TradingPortal.css'; // Assuming you have a CSS file for styling


const TradingPortal = () => {
  // === KEY CHANGE: Get user and loading state directly from AuthContext ===
  const { user, loading } = useAuth();
  
  const [clearBrokerStatus, setClearBrokerStatus] = useState('');
  const [clearBrokerLoading, setClearBrokerLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('holdings');

  // === KEY CHANGE: The entire data-fetching useEffect is GONE! ===

  // Use useMemo to format the profile data only when the user object changes.
  // This prevents re-running the logic on every render.
  const profile = useMemo(() => {
    if (!user || !user.is_broker_connected) {
      return null;
    }
    // Transform the 'user' object from context into the nested structure the component's JSX expects
    return {
      broker: {
        name: user.broker_name || 'N/A',
        accountId: user.broker_client_id,
        status: user.is_active_for_trading ? 'ACTIVE' : 'INACTIVE',
        lastSync: user.broker_session_last_generated_at,
      },
      portfolio: {
        // Map fields from the user object and its nested rms_limit
        portfolioValue: user.portfolioValue || 0, // You might need to fetch holdings/positions for this
        todaysPnL: user.pnl || 0,
        availableFunds: parseFloat(user.rms_limit?.availablecash || 0),
        investedAmount: user.investedAmount || 0,
        holdings: user.holdings || [],
        rmsLimit: parseFloat(user.rms_limit?.net || 0),
        capitalAmount: user.capitalAmount || 0,
      }
    };
  }, [user]);

  // ... (handleClearBrokerProfile and formatCurrency functions remain the same) ...
  const handleClearBrokerProfile = async () => {
    if (!window.confirm('Are you sure you want to clear your broker profile? This action cannot be undone.')) {
        return;
    }
    setClearBrokerLoading(true);
    setClearBrokerStatus('');
    try {
      const res = await clearBrokerProfile(); // Using the new API function
      if (res.data && res.data.success) {
        setClearBrokerStatus('Broker profile cleared successfully. Reloading...');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        throw new Error(res.data.message || 'Failed to clear broker profile.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setClearBrokerStatus(`Error: ${errorMessage}`);
    } finally {
      setClearBrokerLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '₹-';
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }

  // --- Render Logic (This will now work) ---

  if (loading) {
    return <div className="loading-container">Loading Dashboard...</div>;
  }

  
   if (!user || !user.is_broker_connected) {
    return (
      <div className="connect-broker-container">
        <h2>Connect Your Broker</h2>
        <p>Please connect your broker account to view your trading dashboard.</p>
        <p className="info-message">Your broker is not active or connected.</p>
        <Link to="/broker-settings" className="btn btn-primary">Connect Broker</Link>
      </div>
    );
  }

  return (
    <div className="trading-portal">
      {/* Broker Info Card */}
      <div className="card">
           <div>
            <h3>{user.name} ({user.email})</h3>
            <p>Role: <span className="role-badge">{user.role}</span></p>
          </div>
          <div className="broker-status">
            <span>{profile.broker.name?.toUpperCase()}</span>
            <p>Account: {profile.broker.accountId}</p>
          </div>
        </div>
         <div className="broker-actions">
           <Link to="/broker-settings" className="btn btn-secondary">Manage</Link>
           <button onClick={handleClearBrokerProfile} disabled={clearBrokerLoading} className="btn btn-danger">
             {clearBrokerLoading ? 'Clearing...' : 'Clear Profile'}
           </button>
        </div>

      {/* Portfolio Overview Cards */}
      <div className="kpi-grid">
        <div className="card kpi-card">
          <h4>Portfolio Value</h4>
          <p className="kpi-value">{formatCurrency(profile.portfolio.portfolioValue)}</p>
        </div>
        <div className="card kpi-card">
          <h4>Today's P&L</h4>
          <p className={`kpi-value ${profile.portfolio.todaysPnL >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(profile.portfolio.todaysPnL)}
          </p>
        </div>
        <div className="card kpi-card">
          <h4>Available Funds</h4>
          <p className="kpi-value">{formatCurrency(profile.portfolio.availableFunds)}</p>
        </div>
        <div className="card kpi-card">
          <h4>Invested Amount</h4>
          <p className="kpi-value">{formatCurrency(profile.portfolio.investedAmount)}</p>
        </div>
      </div>

      {/* Portfolio Chart */}
      <div className="card">
        <PortfolioChart portfolioData={profile.portfolio} />
      </div>

      {/* Tabbed section for Holdings, Orders, Trades */}
      <div className="card">
        <div className="tab-navigation">
          <button onClick={() => setActiveTab('holdings')} className={activeTab === 'holdings' ? 'active' : ''}>Holdings ({profile.portfolio.holdings.length})</button>
          <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>Order History</button>
          <button onClick={() => setActiveTab('trades')} className={activeTab === 'trades' ? 'active' : ''}>Trade Book</button>
        </div>
        <div className="tab-content">
          {activeTab === 'holdings' && <HoldingsTable holdings={profile.portfolio.holdings} />}
          {activeTab === 'orders' && <OrderList />}
          {/* {activeTab === 'trades' && <TradeList />} */}
        </div>
      </div>
    </div>
  );
};

export default TradingPortal;