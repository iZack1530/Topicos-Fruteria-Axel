import React from 'react';
import { useNavigate } from 'react-router';
import { Shield, IdCard, Calculator, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const MenuCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  delay = 0 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  onClick: () => void;
  delay?: number;
}) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    onClick={onClick}
    className="w-full bg-white rounded-[32px] p-6 mb-4 text-left shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group active:scale-[0.98] transition-transform"
  >
    {/* Background Pattern Element */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 z-0 group-hover:bg-[#DCE1F9]/30 transition-colors" />
    
    <div className="relative z-10">
      <div className="w-14 h-14 bg-[#002B7F] rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg">
        <Icon className="w-8 h-8" />
      </div>
      
      <h2 className="text-2xl font-bold text-[#1A1C1E] mb-2">{title}</h2>
      <p className="text-gray-600 text-[15px] leading-relaxed max-w-[85%]">
        {description}
      </p>
    </div>
  </motion.button>
);

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A1C1E] mb-1">Bienvenido</h1>
        <p className="text-gray-500">Selecciona un módulo para continuar</p>
      </header>

      <div className="flex flex-col gap-2">
        <MenuCard
          title="Administración"
          description="Gestiona inventario, reportes y configuraciones del sistema."
          icon={Shield}
          onClick={() => navigate('/admin')}
          delay={0.1}
        />
        <MenuCard
          title="Actividades"
          description="Registro de cantidades, control de fechas y tareas del día."
          icon={IdCard}
          onClick={() => navigate('/employee')}
          delay={0.2}
        />
        <MenuCard
          title="Ventas"
          description="Punto de venta, registro de transacciones y caja."
          icon={Calculator}
          onClick={() => navigate('/sales')}
          delay={0.3}
        />
      </div>
    </div>
  );
};
