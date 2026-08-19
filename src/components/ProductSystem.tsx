import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Package, 
  Trash2, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  HardDrive, 
  Eye, 
  Zap, 
  Box, 
  Search, 
  Check, 
  Tag, 
  DollarSign, 
  Layers, 
  X
} from 'lucide-react';
import { ProductItem } from '../types';

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Neural Crypto Key Pro',
    category: 'Hardware Security',
    price: 299,
    stock: 45,
    rating: 4.9,
    gradientTheme: 'linear-gradient(135deg, #60efff, #0011ff)',
    iconType: 'chip',
    description: 'Quantum-safe cryptographic token with tactile biometric verification.',
    createdAt: 'Today',
  },
  {
    id: 'prod-2',
    name: 'HoloShield Sensory Lens',
    category: 'Cyber Optics',
    price: 540,
    stock: 18,
    rating: 4.8,
    gradientTheme: 'linear-gradient(135deg, #00ff87, #00e676)',
    iconType: 'eye',
    description: 'Augmented HUD optics with real-time perimeter encryption telemetry.',
    createdAt: 'Yesterday',
  },
  {
    id: 'prod-3',
    name: 'Quantum Vault 4TB Array',
    category: 'Encrypted Storage',
    price: 420,
    stock: 29,
    rating: 5.0,
    gradientTheme: 'linear-gradient(135deg, #e040fb, #aa00ff)',
    iconType: 'hard-drive',
    description: 'Zero-knowledge military grade solid-state memory matrix.',
    createdAt: '3 days ago',
  },
  {
    id: 'prod-4',
    name: 'Cyber Sentinel AI Node',
    category: 'AI Accelerators',
    price: 890,
    stock: 12,
    rating: 4.9,
    gradientTheme: 'linear-gradient(135deg, #ff9d42, #e65100)',
    iconType: 'cpu',
    description: 'Dedicated edge neural processor for local threat neutralization.',
    createdAt: '1 week ago',
  },
];

const GRADIENT_PRESETS = [
  { name: 'Cyber Blue', value: 'linear-gradient(135deg, #60efff, #0011ff)', borderGlow: '#0011ff' },
  { name: 'Matrix Emerald', value: 'linear-gradient(135deg, #00ff87, #00e676)', borderGlow: '#00e676' },
  { name: 'Neon Purple', value: 'linear-gradient(135deg, #e040fb, #aa00ff)', borderGlow: '#aa00ff' },
  { name: 'Solar Amber', value: 'linear-gradient(135deg, #ffb74d, #f57c00)', borderGlow: '#f57c00' },
  { name: 'Crimson Red', value: 'linear-gradient(135deg, #ff5252, #b71c1c)', borderGlow: '#b71c1c' },
];

interface ProductSystemProps {
  products?: ProductItem[];
  onAddProduct?: (product: ProductItem) => void;
  onDeleteProduct?: (id: string, name: string) => void;
  onUpdateStock?: (id: string, delta: number) => void;
}

export const ProductSystem: React.FC<ProductSystemProps> = ({
  products: parentProducts,
  onAddProduct: parentOnAdd,
  onDeleteProduct: parentOnDelete,
  onUpdateStock: parentOnUpdateStock,
}) => {
  const [internalProducts, setInternalProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const products = parentProducts || internalProducts;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State for New Product
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hardware Security');
  const [price, setPrice] = useState<string>('199');
  const [stock, setStock] = useState<string>('25');
  const [iconType, setIconType] = useState<ProductItem['iconType']>('chip');
  const [gradientTheme, setGradientTheme] = useState(GRADIENT_PRESETS[0].value);
  const [description, setDescription] = useState('');

  const categories = ['All', 'Hardware Security', 'Cyber Optics', 'Encrypted Storage', 'AI Accelerators', 'Modules'];

  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const totalStockCount = products.reduce((acc, p) => acc + p.stock, 0);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProduct: ProductItem = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      category: category || 'General',
      price: parseFloat(price) || 99,
      stock: parseInt(stock, 10) || 10,
      rating: 5.0,
      gradientTheme,
      iconType,
      description: description.trim() || 'High-performance 3D authenticated security component.',
      createdAt: 'Just now',
    };

    if (parentOnAdd) {
      parentOnAdd(newProduct);
    } else {
      setInternalProducts([newProduct, ...internalProducts]);
    }

    setIsAddModalOpen(false);
    
    // Reset Form
    setName('');
    setPrice('199');
    setStock('25');
    setDescription('');
    
    setNotification(`" ${newProduct.name} " সফলভাবে ৩ডি প্রোডাক্ট লিস্টে যুক্ত হয়েছে!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteProduct = (id: string, prodName: string) => {
    if (parentOnDelete) {
      parentOnDelete(id, prodName);
    } else {
      setInternalProducts(internalProducts.filter((p) => p.id !== id));
    }
    setNotification(`"${prodName}" অপসারণ করা হয়েছে।`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStockUpdate = (id: string, prodName: string, delta: number) => {
    if (parentOnUpdateStock) {
      parentOnUpdateStock(id, delta);
    } else {
      setInternalProducts(internalProducts.map((p) => (p.id === id ? { ...p, stock: p.stock + delta } : p)));
    }
    setNotification(`+1 stock added to ${prodName}`);
    setTimeout(() => setNotification(null), 2500);
  };


  const renderProductIcon = (type: ProductItem['iconType'], size: number = 24) => {
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

  return (
    <div className="w-full mt-10 pt-8 border-t border-gray-300/50" id="3d-product-system">
      {/* Product System Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center neu-button text-blue-600 font-bold">
              <Package size={18} />
            </div>
            <h2 className="text-[#2d3748] text-xl sm:text-2xl font-black tracking-tight">
              3D Product Management System
            </h2>
          </div>
          <p className="text-xs text-[#718096] mt-1 font-medium">
            ৩ডি ইন্টারঅ্যাক্টিভ প্রোডাক্ট ক্যাটালগ ও নতুন প্রোডাক্ট সংযোজন
          </p>
        </div>

        {/* Add Product Trigger Button (3D Neumorphic) */}
        <button
          type="button"
          id="btn-open-add-product"
          onClick={() => setIsAddModalOpen(true)}
          className="action-btn btn-green shadow-lg flex items-center gap-2 py-3 px-5 text-xs font-bold uppercase tracking-wider"
        >
          <Plus size={18} />
          <span>+ Add Product (নতুন প্রোডাক্ট)</span>
        </button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-5 p-3 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-between border border-emerald-300 shadow-sm"
        >
          <span className="flex items-center gap-2">
            <Check size={16} className="text-emerald-600" />
            {notification}
          </span>
          <button onClick={() => setNotification(null)} className="p-1 hover:text-emerald-950">
            <X size={14} />
          </button>
        </motion.div>
      )}

      {/* Inventory Mini Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
        <div className="stat-card p-3.5 text-center">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Total Products</span>
          <span className="text-xl font-extrabold text-gray-800">{products.length} Items</span>
        </div>
        <div className="stat-card p-3.5 text-center">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Stock Volume</span>
          <span className="text-xl font-extrabold text-gray-800">{totalStockCount} Units</span>
        </div>
        <div className="stat-card p-3.5 text-center">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Catalog Value</span>
          <span className="text-xl font-extrabold text-emerald-600">${totalInventoryValue.toLocaleString()}</span>
        </div>
        <div className="stat-card p-3.5 text-center">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">3D Rendering</span>
          <span className="text-xl font-extrabold text-blue-600 flex items-center justify-center gap-1">
            <Sparkles size={16} /> Active
          </span>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 items-center justify-between">
        {/* Search Inset Input */}
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neu-input pl-9 pr-4 py-2.5 text-xs text-gray-700 w-full"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'neu-button text-gray-600 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="stat-card py-12 text-center text-gray-500 text-xs">
          <Package size={36} className="mx-auto mb-2 opacity-40 text-gray-400" />
          <p className="font-bold">No products found matching your search.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-3 text-blue-600 underline font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredProducts.map((prod) => (
            <motion.div
              key={prod.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="neu-card p-5 rounded-[28px] bg-[#e6ebf1] flex flex-col justify-between relative group select-none border border-white/50"
              style={{
                boxShadow: '10px 10px 25px #c2c7ce, -10px -10px 25px #ffffff',
              }}
            >
              <div>
                {/* 3D Sphere Icon & Top Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: prod.gradientTheme,
                      boxShadow: '4px 4px 10px rgba(0,0,0,0.2), -2px -2px 6px rgba(255,255,255,0.7)',
                    }}
                  >
                    {renderProductIcon(prod.iconType, 26)}
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xl font-black text-gray-900 tracking-tight">
                      ${prod.price}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                      {prod.stock} In Stock
                    </span>
                  </div>
                </div>

                {/* Product Name & Category */}
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                  {prod.category}
                </span>
                <h3 className="font-bold text-gray-800 text-base leading-snug mt-0.5 mb-1.5 group-hover:text-blue-600 transition-colors">
                  {prod.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                  {prod.description}
                </p>
              </div>

              {/* Bottom Card Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200/60 mt-auto">
                <span className="text-[11px] text-amber-500 font-bold flex items-center gap-1">
                  ★ {prod.rating} / 5.0
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStockUpdate(prod.id, prod.name, 1)}
                    className="neu-button px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:text-emerald-600 flex items-center gap-1"
                    title="Quick Restock"
                  >
                    + Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(prod.id, prod.name)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    title="Delete product"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 3D Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="neu-card w-full max-w-lg p-6 sm:p-8 rounded-[35px] bg-[#e6ebf1] relative max-h-[90vh] overflow-y-auto"
              style={{
                boxShadow: '20px 20px 60px rgba(0,0,0,0.35), -15px -15px 40px rgba(255,255,255,0.9)',
              }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-300">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                    style={{ background: gradientTheme }}
                  >
                    {renderProductIcon(iconType, 20)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Add 3D Product (নতুন প্রোডাক্ট)
                    </h3>
                    <p className="text-xs text-gray-500">৩ডি সিস্টেমে নতুন আইটেম যুক্ত করুন</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Add Product Form */}
              <form onSubmit={handleAddProduct} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Product Name (প্রোডাক্টের নাম) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyber Shield Matrix v2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="neu-input p-3 text-xs text-gray-800 w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Category (ক্যাটাগরি)
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
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
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="neu-input p-3 text-xs text-gray-800 w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Stock Quantity (পরিমাণ)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="25"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
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
                          onClick={() => setIconType(t)}
                          className={`p-2 rounded-xl transition-all ${
                            iconType === t ? 'bg-gray-800 text-white shadow-md' : 'neu-button text-gray-600'
                          }`}
                        >
                          {renderProductIcon(t, 16)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3D Gradient Theme Picker */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    3D Sphere Gradient Theme
                  </label>
                  <div className="flex gap-2.5 flex-wrap">
                    {GRADIENT_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setGradientTheme(preset.value)}
                        className={`w-9 h-9 rounded-full transition-transform ${
                          gradientTheme === preset.value ? 'scale-125 ring-2 ring-gray-800 shadow-lg' : 'hover:scale-110 shadow'
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="neu-input p-3 text-xs text-gray-800 w-full"
                  />
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="neu-button flex-1 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="action-btn btn-green flex-1 py-3 text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Save Product (সংরক্ষণ)</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
