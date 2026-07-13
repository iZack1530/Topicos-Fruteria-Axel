import {
  Calendar,
  ChevronRight,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

export const Employee = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Registro de Cantidades',
      subtitle: 'Ingresar unidades disponibles',
      icon: Package,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      path: '/quantity-register',
    },
    {
      title: 'Control de Fechas',
      subtitle: 'Registro de fecha de inventario y caducidad',
      icon: Calendar,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      path: '/date-control',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8F9FE]">
      {/* Título de página */}
      <div className="px-6 pt-7 pb-5">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="text-[28px] font-bold text-[#1A1C1E] leading-tight mb-1">
            Panel de Actividades
          </h1>
          <p className="text-gray-400 text-sm">Gestión diaria de inventario y tareas.</p>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-4">
        {/* Estado del Inventario */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="bg-[#EDEEF5] rounded-[22px] px-5 py-4"
        >
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.12em] mb-1">
            Estado del Inventario
          </p>
          <p className="text-sm text-gray-500 mb-3">
            Última actualización: Hoy, 07:00 AM
          </p>
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 px-4 py-2 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-[11px] font-black text-red-500 uppercase tracking-wider">
              Pendiente de Conteo
            </span>
          </div>
        </motion.div>

        {/* Tarjetas de acción */}
        <div className="space-y-3">
          {actions.map((item, i) => (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 + 0.12 }}
              onClick={() => navigate(item.path)}
              className="w-full bg-white rounded-[20px] px-4 py-4 flex items-center gap-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform text-left"
            >
              <div className={`w-12 h-12 ${item.iconBg} rounded-2xl flex items-center justify-center shrink-0`}>
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1A1C1E] text-sm">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">{item.subtitle}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
            </motion.button>
          ))}
        </div>

        {/* Tareas Pendientes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-[#1A1C1E] mb-3">Tareas Pendientes</h2>
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
            {[
              { label: 'Conteo de Manzana Roja', active: true },
              { label: 'Conteo de Plátano Tabasco', active: false },
              { label: 'Revisión de Aguacate Hass', active: false },
            ].map((task, i, arr) => (
              <button
                key={task.label}
                className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                  i !== arr.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    task.active ? 'bg-red-500' : 'bg-gray-200'
                  }`}
                />
                <span className="flex-1 text-left text-sm font-medium text-[#1A1C1E]">
                  {task.label}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
