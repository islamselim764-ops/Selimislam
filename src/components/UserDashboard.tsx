import React, { useState } from 'react';
import { 
  LogOut, 
  ShieldCheck, 
  Activity, 
  Users, 
  Settings as SettingsIcon, 
  Bell, 
  Smartphone, 
  RefreshCw, 
  X, 
  ShoppingBag, 
  PackageCheck, 
  CreditCard, 
  Clock 
} from 'lucide-react';
import { UserSession, ProductItem, CustomerOrder } from '../types';
import { ProductSystem } from './ProductSystem';

interface UserDashboardProps {
  session: UserSession;
  onLogout: () => void;
  products?: ProductItem[];
  orders?: CustomerOrder[];
  onAddProduct?: (product: ProductItem) => void;
  onDeleteProduct?: (id: string, name: string) => void;
  onUpdateStock?: (id: string, delta: number) => void;
  onOpenStore?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ 
  session, 
  onLogout,
  products,
  orders = [],
  onAddProduct,
  onDeleteProduct,
  onUpdateStock,
  onOpenStore,
}) => {
  const [securityScore, setSecurityScore] = useState(98);
  const [activeDevices, setActiveDevices] = useState(['OSX-7729-Z (Current Device)', 'iPhone 15 Pro • iOS 18.2', 'iPad Pro 12.9 • Safari']);
  const [notificationsCount, setNotificationsCount] = useState(12);
  const [activeModal, setActiveModal] = useState<'system' | 'users' | 'settings' | 'orders' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  const initialLetter = (session.name || session.username || 'S').charAt(0).toUpperCase();

  const handleSystemCheck = () => {
    setActiveModal('system');
    setIsScanning(true);
    setScanMessage('Initiating 256-Bit SSL checksum & port telemetry inspection...');

    setTimeout(() => {
      setScanMessage('Verifying RSA cryptographic signatures...');
    }, 900);

    setTimeout(() => {
      setIsScanning(false);
      setSecurityScore(99);
      setScanMessage('System integrity optimal. All endpoints secure.');
    }, 1800);
  };

  return (
    <div className="w-full text-left" id="user-dashboard-view">
      {/* Top Header */}
      <div className="header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="user-info">
          <div className="flex items-center gap-2">
            <h1 className="text-[#2d3748] text-2xl sm:text-[26px] font-bold tracking-tight">
              Welcome Back!
            </h1>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full border border-blue-300">
              ADMIN
            </span>
          </div>
          <p className="text-[#718096] text-sm mt-0.5">
            Session ID: OSX-7729-2 • {session.username}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {onOpenStore && (
            <button
              type="button"
              id="dashboard-open-store-btn"
              onClick={onOpenStore}
              className="action-btn btn-green py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <ShoppingBag size={16} />
              <span>মার্কেটিং শপ দেখুন</span>
            </button>
          )}

          <button
            type="button"
            id="dashboard-profile-btn"
            className="profile-btn select-none flex-shrink-0"
            title={`Profile: ${session.username}`}
            onClick={() => setActiveModal(activeModal === 'settings' ? null : 'settings')}
          >
            {initialLetter}
          </button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="stats-grid grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="stat-card">
          <h3 className="text-[#a0aec0] text-xs sm:text-[13px] font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-500" /> Total Security Score
          </h3>
          <div className="value text-[#2d3748] text-3xl font-extrabold">{securityScore}%</div>
        </div>

        <div className="stat-card">
          <h3 className="text-[#a0aec0] text-xs sm:text-[13px] font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <PackageCheck size={16} className="text-blue-500" /> Total Store Orders
          </h3>
          <div className="value text-[#2d3748] text-3xl font-extrabold">
            {orders.length < 10 ? `0${orders.length}` : orders.length}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="text-[#a0aec0] text-xs sm:text-[13px] font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <Bell size={16} className="text-purple-500" /> Notifications
          </h3>
          <div className="value text-[#2d3748] text-3xl font-extrabold">{notificationsCount}</div>
        </div>
      </div>

      {/* 3D Actions Grid */}
      <div className="actions-grid mb-6">
        <button
          type="button"
          id="btn-system-check"
          onClick={handleSystemCheck}
          className="action-btn btn-green"
        >
          <Activity size={18} />
          <span>System Check</span>
        </button>

        <button
          type="button"
          id="btn-manage-users"
          onClick={() => setActiveModal('users')}
          className="action-btn btn-orange"
        >
          <Users size={18} />
          <span>Manage Users</span>
        </button>

        <button
          type="button"
          id="btn-view-orders"
          onClick={() => setActiveModal('orders')}
          className="action-btn btn-purple"
        >
          <CreditCard size={18} />
          <span>Customer Orders ({orders.length})</span>
        </button>
      </div>

      {/* Interactive Modal / Subpanel for Actions */}
      {activeModal && (
        <div className="neu-card p-5 mb-6 bg-[#e6ebf1] rounded-[25px] transition-all animate-fadeIn">
          <div className="flex items-center justify-between mb-4 border-b border-gray-300/60 pb-3">
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
              {activeModal === 'system' && 'System Diagnostic Telemetry'}
              {activeModal === 'users' && 'Active Devices & Sessions'}
              {activeModal === 'settings' && 'Security & Account Settings'}
              {activeModal === 'orders' && 'Recent Customer Store Orders (অর্ডার লিস্ট)'}
            </h4>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {activeModal === 'system' && (
            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className={`text-emerald-600 ${isScanning ? 'animate-spin' : ''}`} />
                <span className="font-semibold">{scanMessage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: isScanning ? '70%' : '100%' }}
                ></div>
              </div>
              <div className="text-[11px] text-gray-500 flex justify-between">
                <span>Latency: 14ms</span>
                <span>Threats: 0</span>
                <span>Cipher: TLS_AES_256_GCM</span>
              </div>
            </div>
          )}

          {activeModal === 'users' && (
            <div className="space-y-2.5 text-xs">
              {activeDevices.map((dev, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/40 neu-input-box">
                  <span className="font-medium text-gray-800">{dev}</span>
                  {idx === 0 ? (
                    <span className="text-[10px] text-emerald-600 font-bold uppercase">Active Now</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveDevices((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-[10px] text-red-500 font-bold hover:underline"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeModal === 'orders' && (
            <div className="space-y-3 text-xs">
              {orders.length === 0 ? (
                <p className="text-gray-500 py-3 text-center">এখনো কোনো কাস্টমার অর্ডার আসেনি।</p>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="neu-input-box p-3.5 rounded-2xl bg-white/50 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-blue-700">{ord.id}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {ord.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-800 font-medium">
                      <span>{ord.customerName} ({ord.customerPhone})</span>
                      <span className="font-bold text-gray-900">${ord.totalAmount}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate">
                      📍 {ord.address} • {ord.paymentMethod}
                    </p>
                    <div className="text-[10px] text-gray-400 flex justify-between pt-1 border-t border-gray-200">
                      <span>Items: {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}</span>
                      <span>{ord.createdAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeModal === 'settings' && (
            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex items-center justify-between">
                <span>2-Factor Biometric Verification</span>
                <span className="text-emerald-600 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Session Auto-Expiry</span>
                <span className="text-gray-800 font-semibold">30 Minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Clear All Notifications ({notificationsCount})</span>
                <button
                  type="button"
                  onClick={() => setNotificationsCount(0)}
                  className="text-purple-600 font-bold hover:underline"
                >
                  Clear Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3D Product Management & Add Product System */}
      <ProductSystem 
        products={products}
        onAddProduct={onAddProduct}
        onDeleteProduct={onDeleteProduct}
        onUpdateStock={onUpdateStock}
      />

      {/* Sign Out Button */}
      <div className="mt-8 pt-5 border-t border-gray-300/40 flex justify-end">
        <button
          type="button"
          id="btn-dashboard-logout"
          onClick={onLogout}
          className="py-2.5 px-6 neu-button flex items-center justify-center gap-2 text-xs font-extrabold text-red-500 hover:text-red-600 uppercase tracking-wider cursor-pointer"
        >
          <LogOut size={15} /> Terminate Session
        </button>
      </div>
    </div>
  );
};




