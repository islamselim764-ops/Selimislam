import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  ShoppingBag, 
  Sparkles, 
  Search, 
  Plus, 
  Check, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Cpu, 
  HardDrive, 
  Eye, 
  Zap, 
  Box, 
  X, 
  Star,
  Lock,
  Phone,
  MapPin,
  User as UserIcon,
  LogIn,
  Layers,
  Heart,
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Send
} from 'lucide-react';
import { ProductItem, CartItem, CustomerOrder, UserSession, ProductReview } from '../types';

interface MarketingStoreProps {
  products: ProductItem[];
  orders: CustomerOrder[];
  onAddProduct: (product: ProductItem) => void;
  onAddReview?: (productId: string, review: ProductReview) => void;
  onPlaceOrder: (order: CustomerOrder) => void;
  onOpenDashboard: () => void;
  session: UserSession | null;
}

const GRADIENT_PRESETS = [
  { name: 'Cyber Blue', value: 'linear-gradient(135deg, #60efff, #0011ff)' },
  { name: 'Matrix Emerald', value: 'linear-gradient(135deg, #00ff87, #00e676)' },
  { name: 'Neon Purple', value: 'linear-gradient(135deg, #e040fb, #aa00ff)' },
  { name: 'Solar Amber', value: 'linear-gradient(135deg, #ffb74d, #f57c00)' },
  { name: 'Crimson Red', value: 'linear-gradient(135deg, #ff5252, #b71c1c)' },
];

export const MarketingStore: React.FC<MarketingStoreProps> = ({
  products,
  orders,
  onAddProduct,
  onAddReview,
  onPlaceOrder,
  onOpenDashboard,
  session,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);

  // Direct Buy Target Product (when clicking "Buy Now")
  const [directBuyProduct, setDirectBuyProduct] = useState<ProductItem | null>(null);

  // Review & Rating Modal State
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<ProductItem | null>(null);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState('');

  // Checkout Form Fields
  const [customerName, setCustomerName] = useState(session?.name || 'Selim Islam');
  const [customerPhone, setCustomerPhone] = useState('+880 1712-998877');
  const [customerAddress, setCustomerAddress] = useState('Dhanmondi 27, Dhaka, Bangladesh');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Hardware Security');
  const [newProdPrice, setNewProdPrice] = useState('199');
  const [newProdStock, setNewProdStock] = useState('30');
  const [newProdIcon, setNewProdIcon] = useState<ProductItem['iconType']>('chip');
  const [newProdGradient, setNewProdGradient] = useState(GRADIENT_PRESETS[0].value);
  const [newProdDescription, setNewProdDescription] = useState('');

  const categories = ['All', 'Hardware Security', 'Cyber Optics', 'Encrypted Storage', 'AI Accelerators', 'Modules'];

  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Keep selectedReviewProduct updated with latest reviews when products prop changes
  const currentReviewProduct = selectedReviewProduct 
    ? products.find((p) => p.id === selectedReviewProduct.id) || selectedReviewProduct 
    : null;

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotal = Math.max(0, cartSubtotal - discountApplied);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddToCart = (product: ProductItem) => {
    if (product.stock <= 0) {
      showNotification(`দুঃখিত, "${product.name}" এর স্টক শেষ!`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });

    showNotification(`🛒 "${product.name}" কার্টে যোগ করা হয়েছে!`);
  };

  const handleBuyNow = (product: ProductItem) => {
    if (product.stock <= 0) {
      showNotification(`দুঃখিত, "${product.name}" এর স্টক শেষ!`);
      return;
    }
    setDirectBuyProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleApplyPromo = () => {
    if (discountCode.trim().toUpperCase() === 'NEURO3D' || discountCode.trim().toUpperCase() === 'SPECIAL50') {
      setDiscountApplied(50);
      showNotification('🎉 $50 প্রোমো ডিসকাউন্ট সফলভাবে যুক্ত হয়েছে!');
    } else {
      showNotification('❌ প্রোমো কোড সঠিক নয়। "NEURO3D" কোড ব্যবহার করুন।');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderItems = directBuyProduct
      ? [{ productName: directBuyProduct.name, price: directBuyProduct.price, quantity: 1 }]
      : cart.map((item) => ({
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        }));

    const finalAmount = directBuyProduct
      ? directBuyProduct.price
      : cartTotal;

    if (orderItems.length === 0) {
      showNotification('আপনার কার্ট খালি!');
      return;
    }

    const newOrder: CustomerOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName.trim() || 'Valued Customer',
      customerPhone: customerPhone.trim() || '+880 1700-000000',
      address: customerAddress.trim() || 'Dhaka, Bangladesh',
      items: orderItems,
      totalAmount: finalAmount,
      status: 'Confirmed',
      paymentMethod,
      createdAt: 'Just now',
    };

    onPlaceOrder(newOrder);
    setConfirmedOrder(newOrder);
    setIsCheckoutOpen(false);
    setDirectBuyProduct(null);
    setCart([]);
  };

  const handleCreateNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      category: newProdCategory,
      price: parseFloat(newProdPrice) || 199,
      stock: parseInt(newProdStock, 10) || 20,
      rating: 5.0,
      reviews: [],
      gradientTheme: newProdGradient,
      iconType: newProdIcon,
      description: newProdDescription.trim() || 'High-performance 3D authorized security component.',
      createdAt: 'Just now',
    };

    onAddProduct(newProd);
    setIsAddProductOpen(false);

    // Reset Form
    setNewProdName('');
    setNewProdPrice('199');
    setNewProdStock('30');
    setNewProdDescription('');

    showNotification(`✨ "${newProd.name}" সফলভাবে স্টোরে যুক্ত করা হয়েছে! ক্রেতারা এখন এটি কিনতে পারবেন।`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReviewProduct || !reviewComment.trim()) {
      showNotification('অনুগ্রহ করে রিভিউ বা মন্তব্য লিখুন!');
      return;
    }

    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: currentReviewProduct.id,
      userName: reviewAuthor.trim() || session?.name || session?.username || 'Valued Customer',
      rating: reviewRating,
      comment: reviewComment.trim(),
      createdAt: 'Just now',
    };

    if (onAddReview) {
      onAddReview(currentReviewProduct.id, newReview);
    }

    setReviewComment('');
    setReviewRating(5);
    showNotification(`⭐ "${currentReviewProduct.name}" এর জন্য আপনার রিভিউটি সফলভাবে জমা হয়েছে!`);
  };

  const renderIcon = (type: ProductItem['iconType'], size: number = 24) => {
    switch (type) {
      case 'chip':
        return <Cpu size={size} />;
      case 'shield':
        return <ShieldCheck size={size} />;
      case 'hard-drive':
        return <HardDrive size={size} />;
      case 'eye':
        return <Eye size={size} />;
      case 'zap':
        return <Zap size={size} />;
      case 'cpu':
        return <Cpu size={size} />;
      case 'box':
      default:
        return <Box size={size} />;
    }
  };

  const getRatingFeedbackLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return '5 Stars • Exceptional (চমৎকার / ৫ স্টার)';
      case 4:
        return '4 Stars • Very Good (খুব ভালো / ৪ স্টার)';
      case 3:
        return '3 Stars • Average (মোটামুটি / ৩ স্টার)';
      case 2:
        return '2 Stars • Below Average (২ স্টার)';
      case 1:
        return '1 Star • Needs Improvement (১ স্টার)';
      default:
        return 'Select Star Rating (রেটিং নির্বাচন করুন)';
    }
  };

  return (
    <div className="w-full min-h-screen text-left" id="marketing-storefront">
      {/* Top Marketing Navigation Header */}
      <header className="neu-card p-4 sm:p-5 rounded-[30px] mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#e6ebf1]">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #00e676, #0011ff)' }}
          >
            <Layers size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#2d3748] font-black text-lg sm:text-xl tracking-tight">
                NEURO<span className="text-blue-600">3D</span> STORE
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                LIVE SHOP
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium">
              ৩ডি সাইবার টেক গ্যাজেটস ও অনলাইন শপ
            </p>
          </div>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Add Product Button */}
          <button
            type="button"
            id="store-add-product-btn"
            onClick={() => setIsAddProductOpen(true)}
            className="action-btn btn-green py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
          >
            <Plus size={16} />
            <span>+ Add Product (প্রোডাক্ট এড করুন)</span>
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            id="store-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="neu-button p-3 rounded-2xl text-gray-700 relative hover:text-blue-600 transition-colors flex items-center gap-2"
            title="View Cart"
          >
            <ShoppingCart size={20} />
            <span className="text-xs font-extrabold hidden sm:inline">Cart</span>
            {cartTotalItems > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shadow-md animate-pulse">
                {cartTotalItems}
              </span>
            )}
          </button>

          {/* Admin Dashboard Switch */}
          <button
            type="button"
            id="store-dashboard-btn"
            onClick={onOpenDashboard}
            className="neu-button py-2.5 px-4 text-xs font-bold text-gray-800 hover:text-blue-600 flex items-center gap-1.5"
            title="Open Admin Dashboard"
          >
            <LogIn size={16} />
            <span>{session ? 'ড্যাশবোর্ড' : 'অ্যাডমিন পোর্টাল'}</span>
          </button>
        </div>
      </header>

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-gray-900 text-white text-xs font-bold shadow-2xl flex items-center gap-3 border border-emerald-500/50"
          >
            <Sparkles size={18} className="text-emerald-400" />
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white ml-2">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Marketing Showcase Banner */}
      <section className="neu-card p-7 sm:p-10 rounded-[35px] mb-10 bg-[#e6ebf1] relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider mb-4 border border-blue-200">
            <Sparkles size={14} className="text-blue-500" />
            <span>Next-Gen 3D Cyber Technology Marketplace</span>
          </div>
          <h1 className="text-[#2d3748] text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            ভবিষ্যতের ৩ডি টেকনোলজি ও সাইবার হার্ডওয়্যার শপ
          </h1>
          <p className="text-sm sm:text-base text-[#718096] leading-relaxed mb-6 font-medium">
            যেকোনো নতুন প্রোডাক্ট সহজেই ক্যাটালগে যুক্ত করুন। ক্রেতারা তাৎক্ষণিকভাবে পণ্য দেখতে পারবেন এবং ১-ক্লিকে নিরাপদে হোম ডেলিভারিতে কিনতে পারবেন।
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="action-btn btn-green py-3.5 px-6 text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-2"
            >
              <Plus size={18} />
              <span>নতুন প্রোডাক্ট এড করুন</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('products-grid-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="neu-button py-3.5 px-6 text-xs font-extrabold uppercase tracking-wider text-gray-700 hover:text-blue-600 flex items-center gap-2"
            >
              <ShoppingBag size={18} />
              <span>প্রোডাক্ট দেখুন ({products.length})</span>
            </button>
          </div>
        </div>

        {/* Ambient Decorative 3D Spheres in Hero */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div
              className="w-36 h-36 rounded-full shadow-2xl animate-pulse"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #60efff, #0011ff)',
                boxShadow: '15px 15px 35px rgba(0,0,0,0.25), -10px -10px 25px rgba(255,255,255,0.9)',
              }}
            />
            <div
              className="absolute -top-4 -left-4 w-20 h-20 rounded-full shadow-xl"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #00ff87, #00e676)',
              }}
            />
            <div
              className="absolute -bottom-2 -right-2 w-24 h-24 rounded-full shadow-xl"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #e040fb, #aa00ff)',
              }}
            />
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="stat-card p-4 flex items-center gap-3.5 text-left">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center neu-button text-emerald-600 flex-shrink-0">
            <Truck size={20} />
          </div>
          <div>
            <h4 className="font-extrabold text-gray-800 text-xs sm:text-sm">দ্রুত ফ্রি হোম ডেলিভারি</h4>
            <p className="text-[11px] text-gray-500">সারাদেশে দ্রুত ক্যাশ অন ডেলিভারি</p>
          </div>
        </div>

        <div className="stat-card p-4 flex items-center gap-3.5 text-left">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center neu-button text-blue-600 flex-shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-extrabold text-gray-800 text-xs sm:text-sm">১০০% অথেনটিক কোয়ালিটি</h4>
            <p className="text-[11px] text-gray-500">৩ডি হার্ডওয়্যার ভেরিফায়েড গ্যারান্টি</p>
          </div>
        </div>

        <div className="stat-card p-4 flex items-center gap-3.5 text-left">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center neu-button text-purple-600 flex-shrink-0">
            <CreditCard size={20} />
          </div>
          <div>
            <h4 className="font-extrabold text-gray-800 text-xs sm:text-sm">সহজ পেমেন্ট সিস্টেম</h4>
            <p className="text-[11px] text-gray-500">ক্যাশ, কার্ড বা ডিজিটাল ওয়ালেট</p>
          </div>
        </div>
      </div>

      {/* Product Catalog Section */}
      <section id="products-grid-section">
        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="প্রোডাক্ট খুঁজুন (Search by name or category)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neu-input pl-10 pr-4 py-3 text-xs text-gray-800 w-full"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'neu-button text-gray-600 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="stat-card py-16 text-center text-gray-500 text-sm">
            <Box size={44} className="mx-auto mb-3 opacity-40 text-gray-400" />
            <p className="font-bold">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-3 text-blue-600 underline font-bold text-xs"
            >
              ফিল্টার ক্লিয়ার করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <motion.div
                key={prod.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02, 
                  boxShadow: '20px 24px 45px #b6bcc5, -16px -16px 40px #ffffff',
                  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } 
                }}
                whileTap={{ scale: 0.985 }}
                className="neu-card p-6 rounded-[32px] bg-[#e6ebf1] flex flex-col justify-between relative group border border-white/70 select-none cursor-pointer transition-[border-color,background-color] duration-300 hover:border-white hover:bg-[#e8edf3]"
                style={{
                  boxShadow: '12px 12px 30px #c2c7ce, -12px -12px 30px #ffffff',
                }}
              >
                <div>
                  {/* Top 3D Sphere & Meta */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <motion.div
                      whileHover={{ rotate: 12, scale: 1.15 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                      style={{
                        background: prod.gradientTheme,
                        boxShadow: '5px 5px 14px rgba(0,0,0,0.25), -3px -3px 10px rgba(255,255,255,0.9), inset 2px 2px 5px rgba(255,255,255,0.4)',
                      }}
                    >
                      {renderIcon(prod.iconType, 30)}
                    </motion.div>

                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-black text-gray-900 tracking-tight">
                        ${prod.price}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-1">
                        {prod.stock > 0 ? `${prod.stock} In Stock` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {/* Category & Title */}
                  <span className="text-[10px] uppercase font-extrabold text-blue-600 tracking-wider block mb-1">
                    {prod.category}
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-lg leading-snug group-hover:text-blue-600 transition-colors mb-2">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                    {prod.description}
                  </p>

                  {/* Reviews & Star Rating Widget Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReviewProduct(prod);
                      setReviewAuthor(session?.name || session?.username || 'Customer');
                      setReviewRating(5);
                      setReviewComment('');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white/50 border border-white/80 neu-input-box mb-4 hover:bg-white/90 transition-all text-left group/rev cursor-pointer"
                    title="View reviews and leave your rating"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-black">
                      <Star size={15} className="fill-amber-400 text-amber-400" />
                      <span className="text-gray-900 font-extrabold">{(prod.rating || 5.0).toFixed(1)}</span>
                      <span className="text-gray-400 text-[11px] font-medium">/ 5</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 group-hover/rev:underline">
                      <MessageSquare size={13} />
                      <span>
                        {prod.reviews && prod.reviews.length > 0
                          ? `${prod.reviews.length} Reviews • Rate`
                          : 'Rate Item (রিভিউ দিন)'}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Purchase Buttons (Easy Buying System) */}
                <div className="pt-4 border-t border-gray-200/80 space-y-2 mt-auto">
                  <button
                    type="button"
                    onClick={() => handleBuyNow(prod)}
                    className="action-btn btn-green w-full py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>⚡ Buy Now (এখনই কিনুন)</span>
                    <ArrowRight size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(prod)}
                    className="neu-button w-full py-2.5 text-xs font-bold text-gray-700 hover:text-blue-600 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={15} />
                    <span>Add to Cart (কার্টে রাখুন)</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Shopping Cart Drawer / Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full bg-[#e6ebf1] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-300 mb-5">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={22} className="text-blue-600" />
                    <h3 className="text-lg font-black text-gray-800">
                      Shopping Cart ({cartTotalItems})
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-200 text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Cart Items List */}
                {cart.length === 0 ? (
                  <div className="py-16 text-center text-gray-500">
                    <ShoppingCart size={48} className="mx-auto mb-3 text-gray-400 opacity-50" />
                    <p className="font-bold text-sm">আপনার কার্ট খালি!</p>
                    <p className="text-xs text-gray-400 mt-1">পণ্য কিনতে ক্যাটালগ থেকে প্রোডাক্ট যোগ করুন।</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {cart.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="neu-card p-3.5 rounded-2xl bg-[#e6ebf1] flex items-center justify-between gap-3 border border-white/60"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow flex-shrink-0"
                          style={{ background: product.gradientTheme }}
                        >
                          {renderIcon(product.iconType, 18)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800 text-xs truncate">
                            {product.name}
                          </h4>
                          <span className="text-xs font-extrabold text-blue-600">
                            ${product.price}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(product.id, -1)}
                            className="neu-button w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold px-1">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(product.id, 1)}
                            className="neu-button w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(product.id)}
                            className="p-1 text-gray-400 hover:text-red-500 ml-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer & Checkout */}
              {cart.length > 0 && (
                <div className="pt-5 border-t border-gray-300 mt-6 space-y-3">
                  {/* Promo Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (use: NEURO3D)"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="neu-input px-3 py-2 text-xs text-gray-800 flex-1 uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="neu-button px-3 py-2 text-xs font-bold text-gray-800"
                    >
                      Apply
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-bold text-gray-800">${cartSubtotal}</span>
                    </div>
                    {discountApplied > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Discount:</span>
                        <span>-${discountApplied}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-300">
                      <span>Total Amount:</span>
                      <span className="text-base text-blue-600">${cartTotal}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="action-btn btn-green w-full py-3 text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout (অর্ডার করুন)</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Easy Checkout Modal (সহজে কেনার সিস্টেম) */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="neu-card w-full max-w-lg p-6 sm:p-8 rounded-[35px] bg-[#e6ebf1] max-h-[90vh] overflow-y-auto"
              style={{
                boxShadow: '20px 20px 60px rgba(0,0,0,0.35), -15px -15px 40px rgba(255,255,255,0.9)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-300 mb-5">
                <div>
                  <h3 className="text-xl font-black text-gray-800">
                    Easy 1-Click Checkout (সহজ অর্ডার)
                  </h3>
                  <p className="text-xs text-gray-500">আপনার ডেলিভারি ও পেমেন্ট তথ্য দিন</p>
                </div>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setDirectBuyProduct(null);
                  }}
                  className="p-2 rounded-full hover:bg-gray-200 text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Order Summary Inset */}
              <div className="neu-input-box p-4 rounded-2xl mb-5 space-y-2 text-xs">
                <span className="font-extrabold text-gray-700 block uppercase tracking-wider text-[10px]">
                  Order Items ({directBuyProduct ? '1 item' : `${cartTotalItems} items`})
                </span>
                {directBuyProduct ? (
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>{directBuyProduct.name} (x1)</span>
                    <span className="text-blue-600">${directBuyProduct.price}</span>
                  </div>
                ) : (
                  cart.map((c) => (
                    <div key={c.product.id} className="flex justify-between text-gray-700">
                      <span>{c.product.name} (x{c.quantity})</span>
                      <span className="font-bold">${c.product.price * c.quantity}</span>
                    </div>
                  ))
                )}
                <div className="pt-2 border-t border-gray-300/80 flex justify-between font-black text-sm text-gray-900">
                  <span>Total Payable:</span>
                  <span className="text-emerald-600">
                    ${directBuyProduct ? directBuyProduct.price : cartTotal}
                  </span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <UserIcon size={14} className="text-blue-600" />
                    Customer Name (আপনার নাম) *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    className="neu-input p-3 text-xs text-gray-800 w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone size={14} className="text-emerald-600" />
                    Phone Number (মোবাইল নম্বর) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+880 1700-000000"
                    className="neu-input p-3 text-xs text-gray-800 w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin size={14} className="text-red-500" />
                    Delivery Address (ডেলিভারি ঠিকানা) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="House, Road, Area, City"
                    className="neu-input p-3 text-xs text-gray-800 w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Payment Method (পেমেন্ট মাধ্যম)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Cash on Delivery',
                      'bKash / Nagad',
                      'Credit / Debit Card',
                      'Crypto (USDT)',
                    ].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                          paymentMethod === method
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'neu-button text-gray-700'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setDirectBuyProduct(null);
                    }}
                    className="neu-button flex-1 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="action-btn btn-green flex-1 py-3 text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    <span>Confirm Order (অর্ডার কনফার্ম)</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Confirmed Success Modal */}
      <AnimatePresence>
        {confirmedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="neu-card w-full max-w-md p-6 sm:p-8 rounded-[35px] bg-[#e6ebf1] text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner border border-emerald-300">
                <Check size={36} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-1">
                অর্ডার সফলভাবে গ্রহণ করা হয়েছে!
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                ধন্যবাদ, আপনার ৩ডি হার্ডওয়্যার অর্ডারটি প্রসেসিং শুরু হয়েছে।
              </p>

              <div className="neu-input-box p-4 rounded-2xl text-left text-xs space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-extrabold text-blue-600">{confirmedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-bold text-gray-800">{confirmedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-black text-emerald-600">${confirmedOrder.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment:</span>
                  <span className="font-bold text-gray-800">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Status:</span>
                  <span className="text-emerald-600 font-bold">Confirmed • Dispatched Soon</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmedOrder(null)}
                className="action-btn btn-green w-full py-3 text-xs font-bold uppercase tracking-wider"
              >
                Done (ঠিক আছে)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Product to Store Modal (যেকোনো প্রোডাক্ট এড করার ফর্ম) */}
      <AnimatePresence>
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="neu-card w-full max-w-lg p-6 sm:p-8 rounded-[35px] bg-[#e6ebf1] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-300 mb-5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                    style={{ background: newProdGradient }}
                  >
                    {renderIcon(newProdIcon, 20)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Add Product to Store (প্রোডাক্ট এড করুন)
                    </h3>
                    <p className="text-xs text-gray-500">মার্কেটিং শপে নতুন প্রোডাক্ট যুক্ত করুন</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200 text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateNewProduct} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Product Name (প্রোডাক্টের নাম) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyber Shield Matrix v2"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="neu-input p-3 text-xs text-gray-800 w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Category (ক্যাটাগরি)
                    </label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="neu-input p-3 text-xs text-gray-800 w-full cursor-pointer bg-[#e6ebf1]"
                    >
                      <option value="Hardware Security">Hardware Security</option>
                      <option value="Cyber Optics">Cyber Optics</option>
                      <option value="Encrypted Storage">Encrypted Storage</option>
                      <option value="AI Accelerators">AI Accelerators</option>
                      <option value="Modules">Modules</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Price in USD ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="199"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="neu-input p-3 text-xs text-gray-800 w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Stock Quantity (স্টক সংখ্যা)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="30"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="neu-input p-3 text-xs text-gray-800 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      3D Icon Style
                    </label>
                    <div className="flex gap-2 items-center pt-1">
                      {(['chip', 'shield', 'hard-drive', 'eye', 'zap', 'cpu'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewProdIcon(t)}
                          className={`p-2 rounded-xl transition-all ${
                            newProdIcon === t ? 'bg-gray-900 text-white shadow-md' : 'neu-button text-gray-600'
                          }`}
                        >
                          {renderIcon(t, 16)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3D Sphere Gradient Theme */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    3D Sphere Gradient Theme
                  </label>
                  <div className="flex gap-2.5 flex-wrap">
                    {GRADIENT_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setNewProdGradient(preset.value)}
                        className={`w-9 h-9 rounded-full transition-transform ${
                          newProdGradient === preset.value
                            ? 'scale-125 ring-2 ring-gray-900 shadow-lg'
                            : 'hover:scale-110 shadow'
                        }`}
                        style={{ background: preset.value }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Description (বিবরণ)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter short technical description..."
                    value={newProdDescription}
                    onChange={(e) => setNewProdDescription(e.target.value)}
                    className="neu-input p-3 text-xs text-gray-800 w-full"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="neu-button flex-1 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="action-btn btn-green flex-1 py-3 text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Save to Shop (স্টোরে যোগ করুন)</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Reviews & Rating Modal (প্রোডাক্ট রিভিউ ও রেটিং সিস্টেম) */}
      <AnimatePresence>
        {currentReviewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="neu-card w-full max-w-2xl p-6 sm:p-8 rounded-[35px] bg-[#e6ebf1] max-h-[90vh] overflow-y-auto"
              style={{
                boxShadow: '20px 20px 60px #c2c7ce, -20px -20px 60px #ffffff',
              }}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-300 mb-6">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0"
                    style={{ background: currentReviewProduct.gradientTheme }}
                  >
                    {renderIcon(currentReviewProduct.iconType, 26)}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
                      {currentReviewProduct.category}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">
                      {currentReviewProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                      <span className="font-extrabold text-gray-900">${currentReviewProduct.price}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold">
                        {currentReviewProduct.stock > 0 ? `${currentReviewProduct.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReviewProduct(null)}
                  className="p-2 rounded-full neu-button text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Rating Overview Summary Inset */}
              <div className="neu-card p-5 rounded-2xl bg-[#e6ebf1] mb-6 flex flex-col sm:flex-row items-center gap-6 border border-white/60">
                <div className="flex flex-col items-center justify-center sm:border-r sm:border-gray-300 sm:pr-6 min-w-[140px]">
                  <span className="text-4xl font-black text-gray-900 tracking-tight">
                    {(currentReviewProduct.rating || 5.0).toFixed(1)}
                  </span>
                  <div className="flex items-center gap-1 my-1.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= Math.round(currentReviewProduct.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    {currentReviewProduct.reviews?.length || 0} Total Reviews
                  </span>
                </div>

                {/* Rating Distribution Progress */}
                <div className="flex-1 w-full space-y-1.5">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const totalReviews = currentReviewProduct.reviews?.length || 0;
                    const count = totalReviews > 0
                      ? currentReviewProduct.reviews?.filter((r) => r.rating === stars).length || 0
                      : stars === 5 ? 1 : 0;
                    const percent = totalReviews > 0 ? (count / totalReviews) * 100 : stars === 5 ? 100 : 0;

                    return (
                      <div key={stars} className="flex items-center gap-2 text-xs">
                        <span className="w-6 font-bold text-gray-700 flex items-center gap-0.5 justify-end">
                          {stars} <Star size={11} className="fill-amber-400 text-amber-400" />
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden shadow-inner">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-8 text-right font-medium text-gray-500 text-[11px]">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form to Submit New Review */}
              <div className="neu-card p-5 rounded-2xl bg-[#e6ebf1] mb-6 border border-white/60">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span>Leave a Review (আপনার মতামত ও রেটিং দিন)</span>
                </h4>

                <form onSubmit={handleSubmitReview} className="space-y-3.5 text-left">
                  {/* Star Rating Picker */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Rating (রেটিং নির্বাচন করুন) *
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-white/60 p-2 rounded-xl neu-input-box">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-125 focus:outline-none"
                          >
                            <Star
                              size={22}
                              className={`transition-colors ${
                                star <= (hoverRating || reviewRating)
                                  ? 'fill-amber-400 text-amber-400 drop-shadow'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-700 ml-2">
                        {getRatingFeedbackLabel(hoverRating || reviewRating)}
                      </span>
                    </div>
                  </div>

                  {/* Reviewer Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Name (আপনার নাম)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tanvir Rahman"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="neu-input p-3 text-xs text-gray-800 w-full"
                    />
                  </div>

                  {/* Comment Area */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Feedback / Comment (মতামত বা বিবরণ) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="পণ্যটির গুণগত মান, ডেলিভারি ও পারফরম্যান্স সম্পর্কে সংক্ষেপে লিখুন..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="neu-input p-3 text-xs text-gray-800 w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    className="action-btn btn-green w-full py-3 text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                  >
                    <Send size={15} />
                    <span>Submit Review (রিভিউ জমা দিন)</span>
                  </button>
                </form>
              </div>

              {/* Customer Reviews List */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MessageSquare size={16} className="text-blue-600" />
                  <span>Customer Reviews ({currentReviewProduct.reviews?.length || 0})</span>
                </h4>

                {currentReviewProduct.reviews && currentReviewProduct.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {currentReviewProduct.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="neu-card p-4 rounded-2xl bg-[#e6ebf1] border border-white/60 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                              {rev.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-gray-800">{rev.userName}</span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  <CheckCircle2 size={10} />
                                  <span>Verified</span>
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400">{rev.createdAt}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={12}
                                className={
                                  star <= rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed pl-1">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="neu-card p-6 rounded-2xl bg-[#e6ebf1] text-center border border-white/60">
                    <p className="text-xs text-gray-500 font-medium">
                      এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনি দিন!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
