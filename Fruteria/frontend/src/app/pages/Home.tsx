import React from 'react';
import { useNavigate } from 'react-router';
import { Shield, IdCard, Calculator, ChevronRight, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

/* ============================================================
   TIPOS DE LAS PROPS — sin cambios en la lógica/estado
   ============================================================ */
interface MenuCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  delay?: number;
  /* ── Visual-only props ── */
  accentColor: string;       // e.g. "from-emerald-500 to-teal-600"
  bgLight: string;           // soft bg tint for the icon backdrop
  iconBg: string;            // icon container solid bg
  badgeLabel: string;        // short pill label for the card corner
}

/* ============================================================
   COMPONENTE: MenuCard
   Rediseño completo del card de selección de módulo.
   La lógica (onClick, navigate) NO se altera — solo JSX/CSS.
   ============================================================ */
const MenuCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  delay = 0,
  accentColor,
  bgLight,
  iconBg,
  badgeLabel,
}: MenuCardProps) => (
  <motion.button
    /* ── Animación de entrada suave (ya existía) ── */
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    onClick={onClick}
    /* ── Accesibilidad: área de toque generosa, foco visible ── */
    aria-label={`Ir a ${title}`}
    className={`
      w-full text-left relative overflow-hidden
      bg-white rounded-3xl p-5
      border border-white/60
      shadow-[0_4px_24px_rgba(0,0,0,0.07)]
      /* Micro-animación hover: elevación + leve escala */
      hover:shadow-[0_10px_36px_rgba(0,0,0,0.13)]
      hover:-translate-y-1
      active:scale-[0.975] active:shadow-sm
      transition-all duration-300 ease-out
      focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/60
      cursor-pointer
      group
    `}
  >
    {/* ── Decoración de fondo: blob de color (puramente visual) ── */}
    <div
      className={`
        absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-[0.12]
        bg-gradient-to-br ${accentColor}
        group-hover:opacity-20 group-hover:scale-110
        transition-all duration-500 ease-out
      `}
    />
    <div
      className={`
        absolute right-4 bottom-4 w-20 h-20 rounded-full opacity-[0.06]
        bg-gradient-to-br ${accentColor}
        group-hover:opacity-10
        transition-all duration-500 ease-out
      `}
    />

    {/* ── Contenido principal ── */}
    <div className="relative z-10 flex items-center gap-5">

      {/* Icono */}
      <div
        className={`
          flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center
          ${iconBg} text-white shadow-lg
          group-hover:scale-110 group-hover:rotate-[-4deg]
          transition-transform duration-300 ease-out
        `}
      >
        <Icon className="w-8 h-8 stroke-[1.75]" />
      </div>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        {/* Badge de módulo */}
        <span
          className={`
            inline-block text-[11px] font-semibold tracking-widest uppercase
            px-2.5 py-0.5 rounded-full mb-1.5
            ${bgLight} text-emerald-800
          `}
        >
          {badgeLabel}
        </span>
        {/* Título grande — fácil de leer para adultos mayores */}
        <h2 className="text-[1.35rem] font-bold text-gray-800 leading-tight mb-1">
          {title}
        </h2>
        {/* Descripción clara y no saturada */}
        <p className="text-gray-500 text-[0.875rem] leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Flecha indicadora de acción */}
      <div
        className={`
          flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
          ${bgLight}
          group-hover:bg-emerald-100 group-hover:translate-x-1
          transition-all duration-300
        `}
      >
        <ChevronRight className="w-5 h-5 text-emerald-700 stroke-[2.5]" />
      </div>
    </div>
  </motion.button>
);

/* ============================================================
   PÁGINA: Home — Bienvenido / Selección de módulo
   Estado (useNavigate) intacto. Solo se refactoriza el JSX.
   ============================================================ */
export const Home = () => {
  /* ── Lógica original sin cambios ── */
  const navigate = useNavigate();

  /* Configuración visual de cada módulo (sin tocar props de lógica) */
  const modules = [
    {
      title: 'Administración',
      description: 'Gestiona inventario, reportes y configuraciones del sistema.',
      icon: Shield,
      onClick: () => navigate('/admin'),
      delay: 0.1,
      accentColor: 'from-violet-500 to-indigo-600',
      bgLight: 'bg-violet-50',
      iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-600',
      badgeLabel: 'Módulo',
    },
    {
      title: 'Actividades',
      description: 'Registro de cantidades, control de fechas y tareas del día.',
      icon: IdCard,
      onClick: () => navigate('/employee'),
      delay: 0.2,
      accentColor: 'from-amber-400 to-orange-500',
      bgLight: 'bg-amber-50',
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      badgeLabel: 'Módulo',
    },
    {
      title: 'Ventas',
      description: 'Punto de venta, registro de transacciones y caja.',
      icon: Calculator,
      onClick: () => navigate('/sales'),
      delay: 0.3,
      accentColor: 'from-emerald-400 to-teal-600',
      bgLight: 'bg-emerald-50',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-600',
      badgeLabel: 'Módulo',
    },
  ] as const;

  return (
    /* ── Fondo degradado suave — orgánico y fresco ── */
    <div className="min-h-full bg-gradient-to-b from-[#f0faf4] via-[#f8fdf9] to-[#f5f9fe] px-5 pt-6 pb-4">

      {/* ── Cabecera de bienvenida ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-7"
      >
        {/* Decoración: chip de hoja */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-emerald-600 stroke-2" />
          </div>
          <span className="text-[0.75rem] font-semibold tracking-widest text-emerald-600 uppercase">
            Sistema de Gestión
          </span>
        </div>

        {/* Saludo principal — tipografía grande para comodidad visual */}
        <h1 className="text-[2rem] font-extrabold text-gray-800 leading-tight tracking-tight">
          ¡Bienvenido! 👋
        </h1>
        <p className="text-gray-500 text-[1rem] mt-1 font-medium">
          Selecciona un módulo para continuar
        </p>
      </motion.header>

      {/* ── Tarjetas de módulos ── */}
      <div className="flex flex-col gap-4">
        {modules.map((mod) => (
          <MenuCard key={mod.title} {...mod} />
        ))}
      </div>

      {/* ── Pie decorativo sutil ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-center text-[0.75rem] text-gray-400 mt-8 font-medium"
      >
        🍊 Frutería Axel — Sistema interno v1.0
      </motion.p>
    </div>
  );
};
