/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthMode, AppViewMode, UserSession, FormNotification, ProductItem, CustomerOrder, ProductReview } from './types';
import { SignInCard } from './components/SignInCard';
import { SignUpCard } from './components/SignUpCard';
import { ForgotPasswordCard } from './components/ForgotPasswordCard';
import { UserDashboard } from './components/UserDashboard';
import { FloatingOrbs } from './components/FloatingOrbs';
import { NotificationToast } from './components/NotificationToast';
import { MarketingStore } from './components/MarketingStore';
import { INITIAL_STORE_PRODUCTS, INITIAL_ORDERS } from './data/mockData';
import { ShoppingBag, LayoutDashboard, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<AppViewMode>('store');
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [session, setSession] = useState<UserSession | null>(null);
  const [notification, setNotification] = useState<FormNotification | null>(null);

  // Shared Store Products & Orders
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_STORE_PRODUCTS);
  const [orders, setOrders] = useState<CustomerOrder[]>(INITIAL_ORDERS);

  const handleAddProduct = (newProduct: ProductItem) => {
    setProducts((prev) => [newProduct, ...prev]);
    setNotification({
      type: 'success',
      message: `✨ "${newProduct.name}" সফলভাবে স্টোর ক্যাটালগে যুক্ত হয়েছে!`,
    });
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setNotification({
      type: 'info',
      message: `"${name}" ক্যাটালগ থেকে মুছে ফেলা হয়েছে।`,
    });
  };

  const handleUpdateStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  };

  const handleAddReview = (productId: string, newReview: ProductReview) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentReviews = p.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];
          const avgRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            rating: parseFloat(avgRating.toFixed(1)),
          };
        }
        return p;
      })
    );
    setNotification({
      type: 'success',
      message: `⭐ আপনার রিভিউ ও রেটিং সফলভাবে জমা হয়েছে!`,
    });
  };

  const handlePlaceOrder = (newOrder: CustomerOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const itemOrdered = newOrder.items.find((i) => i.productName === p.name);
        if (itemOrdered) {
          return { ...p, stock: Math.max(0, p.stock - itemOrdered.quantity) };
        }
        return p;
      })
    );
    setNotification({
      type: 'success',
      message: `🎉 অর্ডার #${newOrder.id} সফলভাবে কনফার্ম করা হয়েছে!`,
    });
  };

  const handleLoginSuccess = (userSession: UserSession) => {
    setSession(userSession);
    setViewMode('dashboard');
    setNotification({
      type: 'success',
      message: `লগইন সফল হয়েছে! স্বাগতম, ${userSession.name || userSession.username}!`,
    });
  };

  const handleSignUpSuccess = (userSession: UserSession) => {
    setSession(userSession);
    setViewMode('dashboard');
    setNotification({
      type: 'success',
      message: 'নতুন অ্যাকাউন্ট তৈরি হয়েছে এবং ড্যাশবোর্ড সক্রিয় হয়েছে!',
    });
  };

  const handleLogout = () => {
    setSession(null);
    setAuthMode('signin');
    setViewMode('store');
    setNotification({
      type: 'info',
      message: 'লগআউট সম্পন্ন হয়েছে।',
    });
  };

  return (
    <main
      id="neumorphic-app-root"
      className="relative flex flex-col justify-start items-center min-h-screen w-full bg-[#e0e5ec] px-3 sm:px-6 py-6 sm:py-10 overflow-x-hidden select-none"
    >
      {/* Immersive Theme Atmosphere Light Field */}
      <div className="atmosphere" />

      {/* Ambient background soft depth orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-white/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-slate-300/30 blur-3xl pointer-events-none" />

      {/* Global Quick Navigation Pills */}
      <div className="relative z-20 flex items-center justify-center gap-2 mb-6">
        <button
          type="button"
          id="nav-pill-store"
          onClick={() => setViewMode('store')}
          className={`py-2 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'store'
              ? 'bg-gray-900 text-white shadow-lg scale-105'
              : 'neu-button text-gray-700 hover:text-gray-900'
          }`}
        >
          <ShoppingBag size={14} />
          <span>মার্কেটিং শপ (Storefront)</span>
        </button>

        <button
          type="button"
          id="nav-pill-dashboard"
          onClick={() => {
            if (session) {
              setViewMode('dashboard');
            } else {
              setViewMode('auth');
            }
          }}
          className={`py-2 px-4 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
            viewMode === 'dashboard' || viewMode === 'auth'
              ? 'bg-gray-900 text-white shadow-lg scale-105'
              : 'neu-button text-gray-700 hover:text-gray-900'
          }`}
        >
          {session ? (
            <>
              <LayoutDashboard size={14} />
              <span>অ্যাডমিন ড্যাশবোর্ড</span>
            </>
          ) : (
            <>
              <Shield size={14} />
              <span>লগইন / অ্যাডমিন পোর্টাল</span>
            </>
          )}
        </button>
      </div>

      {/* Main App Container */}
      <div className={`relative flex flex-col items-center z-10 w-full transition-all duration-300 ${
        viewMode === 'store' ? 'max-w-6xl' : session ? 'max-w-[840px]' : 'max-w-[440px]'
      }`}>
        {/* Toast / Notification */}
        <div className="w-full max-w-lg mb-2">
          <NotificationToast
            notification={notification}
            onDismiss={() => setNotification(null)}
          />
        </div>

        {/* View Mode Switching */}
        {viewMode === 'store' ? (
          <motion.div
            key="storefront-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <MarketingStore
              products={products}
              orders={orders}
              onAddProduct={handleAddProduct}
              onAddReview={handleAddReview}
              onPlaceOrder={handlePlaceOrder}
              onOpenDashboard={() => {
                if (session) {
                  setViewMode('dashboard');
                } else {
                  setViewMode('auth');
                }
              }}
              session={session}
            />
          </motion.div>
        ) : (
          /* Authentication or Admin Dashboard Neumorphic Card */
          <motion.div
            id="main-neu-card"
            layout
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`neu-card neu-container w-full z-10 transition-all duration-300 ${
              session
                ? 'dashboard p-6 sm:p-[35px] rounded-[40px]'
                : 'max-w-[420px] p-8 sm:p-12 md:p-14 rounded-[60px] text-center'
            }`}
            style={{
              background: '#e6ebf1',
              boxShadow: '20px 20px 60px #c2c7ce, -20px -20px 60px #ffffff',
            }}
          >
            <AnimatePresence mode="wait">
              {session ? (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <UserDashboard 
                    session={session} 
                    onLogout={handleLogout}
                    products={products}
                    orders={orders}
                    onAddProduct={handleAddProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onUpdateStock={handleUpdateStock}
                    onOpenStore={() => setViewMode('store')}
                  />
                </motion.div>
              ) : authMode === 'signin' ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <SignInCard
                    onLoginSuccess={handleLoginSuccess}
                    onSetNotification={setNotification}
                  />
                </motion.div>
              ) : authMode === 'signup' ? (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <SignUpCard
                    onSignUpSuccess={handleSignUpSuccess}
                    onSetNotification={setNotification}
                    onBackToSignIn={() => {
                      setAuthMode('signin');
                      setNotification(null);
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <ForgotPasswordCard
                    onBackToSignIn={() => {
                      setAuthMode('signin');
                      setNotification(null);
                    }}
                    onSetNotification={setNotification}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Floating Immersive Nodes when on auth mode */}
        {viewMode === 'auth' && !session && (
          <FloatingOrbs
            currentMode={authMode}
            onSelectMode={(mode) => {
              setAuthMode(mode);
              setNotification(null);
            }}
          />
        )}
      </div>
    </main>
  );
}


