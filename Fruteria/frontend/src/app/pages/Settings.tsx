import React from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronLeft, 
  User, 
  Bell, 
  Lock, 
  Palette, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const Settings = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: 'Mi Perfil', color: 'bg-blue-100 text-blue-600' },
    { icon: Bell, label: 'Notificaciones', color: 'bg-purple-100 text-purple-600' },
    { icon: Lock, label: 'Seguridad', color: 'bg-green-100 text-green-600' },
    { icon: Palette, label: 'Apariencia', color: 'bg-orange-100 text-orange-600' },
    { icon: HelpCircle, label: 'Ayuda y Soporte', color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8F9FE]">
      {/* Header */}
      <div className="bg-[#001540] text-white px-4 py-6 flex items-center gap-4 shadow-md sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Configuración</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-[32px] p-6 shadow-sm flex items-center gap-4 border border-gray-100"
        >
          <div className="w-16 h-16 rounded-full bg-[#001540]/5 flex items-center justify-center border-2 border-[#001540]/10 shrink-0">
            <User className="w-8 h-8 text-[#001540]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[#1A1C1E] truncate">Nayeli Cutz</h2>
            <p className="text-gray-500 text-sm">Administrador</p>
          </div>
          <button className="text-[#001540] font-bold text-sm px-5 py-2 bg-[#DCE1F9] rounded-full active:scale-95 transition-transform shrink-0">
            Editar
          </button>
        </motion.div>

        {/* Menu Options */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.2 }}
              className={`w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors active:bg-gray-100 ${
                index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className={`p-2.5 rounded-2xl ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left font-semibold text-[#1A1C1E]">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </motion.button>
          ))}
        </div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full mt-4 flex items-center justify-center gap-3 p-5 text-red-600 font-bold bg-white rounded-[32px] shadow-sm border border-red-50/50 hover:bg-red-50 active:scale-[0.98] transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </motion.button>
        
        <div className="pt-4 text-center">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Frutería Axel v1.0.4</p>
        </div>
      </div>
    </div>
  );
};
