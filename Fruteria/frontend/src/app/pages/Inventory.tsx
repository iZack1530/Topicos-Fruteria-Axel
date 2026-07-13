import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  ChevronRight,
  Package,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CATEGORIES, getProductStatus } from '../services/catalog';
import { useFruteria } from '../state/FruteriaProvider';

export const Inventory = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const { products } = useFruteria();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-[#F8F9FE] relative">
      {/* Header */}
      <div className="bg-[#001540] text-white px-4 py-6 flex items-center justify-between shadow-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Inventario</h1>
        </div>
        <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {/* Search and Filters */}
        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-[20px] py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#001540]/10 transition-all font-medium text-[#1A1C1E]"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-lg text-gray-400">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#001540] text-white shadow-md' 
                    : 'bg-white text-gray-500 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="px-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[28px] p-4 flex items-center gap-4 shadow-sm border border-gray-50 group active:scale-[0.98] transition-transform"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                  <ImageWithFallback 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-[#1A1C1E] text-base truncate">{product.name}</h3>
                    <span className="text-xs font-bold text-gray-400">{product.category}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#001540] font-bold text-lg">${product.price.toFixed(2)}</span>
                    <span className="text-gray-400 text-xs font-medium">/ {product.unit}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      getProductStatus(product.stock) === 'In Stock' 
                        ? 'bg-green-50 text-green-600' 
                        : getProductStatus(product.stock) === 'Low Stock'
                        ? 'bg-orange-50 text-orange-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {getProductStatus(product.stock) === 'Low Stock' && <AlertCircle className="w-3 h-3" />}
                      {getProductStatus(product.stock) === 'In Stock' ? 'En Stock' : getProductStatus(product.stock) === 'Low Stock' ? 'Bajo Stock' : 'Agotado'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-sm font-black text-[#1A1C1E]">{product.stock} {product.unit}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-28 right-6 w-16 h-16 bg-[#001540] text-white rounded-full flex items-center justify-center shadow-2xl z-30 ring-4 ring-white"
      >
        <Plus className="w-8 h-8" />
      </motion.button>
    </div>
  );
};
