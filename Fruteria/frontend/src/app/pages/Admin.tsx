import {
  Store,
  ClipboardList,
  PackageMinus,
  Tag,
  Calculator,
  Scale,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useFruteria } from '../stores/FruteriaProvider';

export const Admin = () => {
  const navigate = useNavigate();
  const { tickets } = useFruteria();
  const currentSalesTotal = tickets.reduce((acc, t) => acc + t.total, 0);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FE]">
      {/* Título de página */}
      <div className="px-6 pt-7 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="text-[28px] font-bold text-[#1A1C1E] leading-tight mb-1">
            Panel de<br />Administración
          </h1>
          <p className="text-gray-400 text-sm">Gestión de sucursal principal</p>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-6 no-scrollbar">
        {/* Estado de la Sucursal */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="font-bold text-sm text-[#1A1C1E]">Estado de la Sucursal</p>
                <p className="text-xs text-gray-400">Caja Abierta</p>
              </div>
            </div>
            <span className="bg-[#002B7F] text-white text-[11px] font-bold px-3 py-1 rounded-full">
              Activo
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-1">Saldo de Caja Actual</p>
          <h2 className="text-4xl font-black text-[#1A1C1E] tracking-tight mb-1">
            ${currentSalesTotal.toFixed(2)}
          </h2>
          <p className="text-sm font-bold text-gray-400">MXN</p>
        </motion.div>

        {/* Acciones Rápidas */}
        <div>
          <h2 className="text-xl font-bold text-[#1A1C1E] mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                title: 'Registro',
                sub: 'de Productos',
                icon: ClipboardList,
                iconBg: 'bg-blue-50',
                iconColor: 'text-blue-600',
                path: '/register'
              },
              {
                title: 'Baja',
                sub: 'de Productos',
                icon: PackageMinus,
                iconBg: 'bg-red-50',
                iconColor: 'text-red-500',
                path: '/remove'
              },
              {
                title: 'Asignación',
                sub: 'de Precios',
                icon: Tag,
                iconBg: 'bg-indigo-50',
                iconColor: 'text-indigo-600',
                path: '/inventory'
              },
              {
                title: 'Asignación',
                sub: 'de Pesos',
                icon: Scale,
                iconBg: 'bg-purple-50',
                iconColor: 'text-purple-600',
                path: '/weight-register'
              },
              {
                title: 'Control',
                sub: 'de Caja',
                icon: Calculator,
                iconBg: 'bg-teal-50',
                iconColor: 'text-teal-600',
                path: '/cash-drawer'
              },
            ].map((action, i) => (
              <motion.button
                key={action.path}
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => navigate(action.path)}
                transition={{ delay: i * 0.06 + 0.1 }}
                className="bg-[#EDEEF5] rounded-[20px] p-5 flex flex-col gap-3 active:scale-[0.97] transition-transform text-left"
              >
                <div
                  className={`w-10 h-10 ${action.iconBg} rounded-xl flex items-center justify-center`}
                >
                  <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <div>
                  <p className="font-bold text-[#1A1C1E] text-sm">{action.title}</p>
                  <p className="text-xs text-gray-400">{action.sub}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
