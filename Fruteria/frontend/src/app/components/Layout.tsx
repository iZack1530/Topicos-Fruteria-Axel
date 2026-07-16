import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Shield, IdCard, Calculator, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/* ============================================================
   COMPONENTE: Layout
   Refactorización VISUAL ÚNICAMENTE.
   Toda la lógica (useLocation, useNavigate, navItems, isSettingsPage,
   AnimatePresence, routing) permanece 100% intacta.
   ============================================================ */
export const Layout = () => {
  /* ── Lógica original — sin cambios ── */
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home',     label: 'Inicio',         icon: HomeIcon,   path: '/' },
    { id: 'admin',    label: 'Administración',  icon: Shield,     path: '/admin' },
    { id: 'employee', label: 'Actividades',     icon: IdCard,     path: '/employee' },
    { id: 'sales',    label: 'Ventas',          icon: Calculator, path: '/sales' },
  ];

  const isSettingsPage = location.pathname === '/settings';

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ============================================================
          HEADER — Modernizado con gradiente verde-esmeralda y logo
          Lógica (navigate('/')) preservada exactamente.
         ============================================================ */}
      {!isSettingsPage && (
        <header
          className="
            relative z-20 flex items-center justify-between
            px-5 py-3.5
            bg-gradient-to-r from-emerald-700 to-teal-600
            shadow-[0_4px_20px_rgba(16,120,80,0.30)]
          "
        >
          {/* Logo + Nombre */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => navigate('/')}
            role="button"
            aria-label="Ir al inicio"
          >
            {/* Ícono de tienda */}
            <div
              className="
                w-9 h-9 rounded-xl bg-white/20 border border-white/30
                flex items-center justify-center
                backdrop-blur-sm shadow-sm
              "
            >
              <span className="text-[1.2rem] leading-none" aria-hidden="true">
                🍊
              </span>
            </div>

            {/* Nombre de la tienda — tipografía clara y grande */}
            <div>
              <h1
                className="
                  text-white font-extrabold text-[1.15rem] tracking-tight
                  leading-tight
                  hover:opacity-85 active:scale-[0.97]
                  transition-all duration-200
                "
              >
                Frutería Axel
              </h1>
              <p className="text-emerald-100/80 text-[0.65rem] font-medium tracking-wider uppercase">
                Sistema de Gestión
              </p>
            </div>
          </div>

          {/* Decoración derecha: píldora de estado */}
          <div
            className="
              flex items-center gap-1.5 px-3 py-1.5
              bg-white/15 border border-white/25 rounded-full
              backdrop-blur-sm
            "
          >
            {/* Punto pulsante (vivo) */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="text-white text-[0.7rem] font-semibold">Activo</span>
          </div>
        </header>
      )}

      {/* ============================================================
          MAIN CONTENT — sin cambios en lógica de animación
         ============================================================ */}
      <main className="flex-1 overflow-y-auto relative bg-gradient-to-b from-[#f0faf4] to-[#f5f9fe]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ============================================================
          BOTTOM NAVIGATION — Rediseño premium con pill indicator
          Lógica (isActive, navigate, navItems.map) intacta.
         ============================================================ */}
      <nav
        className="
          relative z-20 shrink-0
          bg-white border-t border-gray-100
          shadow-[0_-4px_24px_rgba(0,0,0,0.06)]
          px-2 pt-2 pb-5
          flex justify-around items-stretch
        "
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              aria-label={`Ir a ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
              className={`
                relative flex flex-col items-center gap-1 flex-1
                px-1 py-1.5 rounded-2xl
                transition-all duration-250 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
                active:scale-95
                ${isActive ? 'text-emerald-700' : 'text-gray-400 hover:text-gray-600'}
              `}
            >
              {/* ── Pill de fondo cuando activo ── */}
              {isActive && (
                <motion.div
                  layoutId="nav-active-pill"
                  className="
                    absolute inset-0 rounded-2xl
                    bg-gradient-to-b from-emerald-50 to-teal-50
                    border border-emerald-100
                  "
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}

              {/* ── Ícono ── */}
              <div className="relative z-10">
                <Icon
                  className={`
                    w-6 h-6 transition-all duration-250
                    ${isActive ? 'stroke-[2.5] scale-110' : 'stroke-[1.75]'}
                  `}
                />
              </div>

              {/* ── Etiqueta — tamaño legible para adultos mayores ── */}
              <span
                className={`
                  relative z-10 text-[0.65rem] font-semibold leading-tight
                  transition-all duration-250 text-center w-full
                  ${isActive ? 'text-emerald-700' : 'text-gray-400'}
                `}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
