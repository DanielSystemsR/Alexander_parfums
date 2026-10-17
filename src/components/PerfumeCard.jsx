import React from 'react'
import { CheckCircle2, XCircle, Sparkles, Eye, ShoppingBag, Edit3, ToggleLeft, ToggleRight } from 'lucide-react'

export default function PerfumeCard({ 
  perfume, 
  onSelect, 
  isAdmin, 
  onEditPerfume, 
  onToggleAvailability,
  onAddToCart
}) {
  return (
    <div className={`group relative bg-[#0a0d16] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
      perfume.available 
        ? 'border border-sky-500/25 hover:border-sky-400 shadow-[0_4px_15px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_8px_25px_rgba(2,132,199,0.3)] hover:-translate-y-0.5' 
        : 'border border-slate-800 opacity-75 hover:opacity-100 hover:border-rose-500/40'
    }`}>
      
      {/* SECCIÓN SUPERIOR DE IMAGEN */}
      <div 
        className="relative aspect-[4/5] bg-[#06080e] overflow-hidden cursor-pointer" 
        onClick={() => onSelect(perfume)}
      >
        <img
          src={perfume.imageUrl || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'}
          alt={perfume.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
          }}
        />

        {/* Gradiente oscuro sobre la imagen para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d16] via-transparent to-black/30 pointer-events-none" />

        {/* BADGE DE DISPONIBILIDAD (COMPACTO EN MÓVIL) */}
        <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 z-10 pointer-events-none">
          {perfume.available ? (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-semibold bg-emerald-950/85 border border-emerald-400/50 text-emerald-300 backdrop-blur-md shadow-[0_0_10px_rgba(16,185,129,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden xs:inline sm:inline">Disponible</span>
              <span className="xs:hidden sm:hidden">Disp.</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-semibold bg-rose-950/85 border border-rose-400/50 text-rose-300 backdrop-blur-md shadow-[0_0_10px_rgba(244,63,94,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Agotado
            </span>
          )}
        </div>

        {/* BADGE DE CATEGORÍA */}
        <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 z-10 pointer-events-none">
          <span className="text-[8px] sm:text-[10px] font-medium tracking-wider uppercase text-sky-200 bg-[#091122]/90 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-sky-400/30">
            {perfume.categoryName || 'Colección'}
          </span>
        </div>

        {/* VOLUMEN FLOTANTE */}
        {perfume.volume && (
          <div className="absolute bottom-1.5 sm:bottom-3 right-1.5 sm:right-3 z-10 text-[8px] sm:text-[10px] font-mono text-slate-300 bg-black/75 px-1.5 sm:px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm pointer-events-none">
            {perfume.volume}
          </div>
        )}
      </div>

      {/* INFORMACIÓN DEL PERFUME */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* MARCA */}
          <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-semibold text-amber-400 mb-0.5 sm:mb-1 truncate">
            {perfume.brand}
          </p>

          {/* NOMBRE */}
          <h3 
            onClick={() => onSelect(perfume)}
            className="font-serif-luxury text-sm sm:text-lg font-bold text-white group-hover:text-sky-300 transition-colors cursor-pointer line-clamp-1 mb-1 leading-snug"
            title={perfume.name}
          >
            {perfume.name}
          </h3>

          {/* NOTAS RESUMIDAS (visibles en desktop o pantallas medianas) */}
          {perfume.notesTop && (
            <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-1 mb-2 hidden sm:block">
              <span className="text-slate-500">Notas:</span> {perfume.notesTop}
            </p>
          )}
        </div>

        {/* PRECIO & ACCIONES */}
        <div className="pt-2 sm:pt-3 border-t border-sky-500/15 mt-1 sm:mt-2">
          <div className="flex items-baseline justify-between mb-2 sm:mb-3">
            <div>
              <span className="text-[10px] sm:text-xs text-slate-400 block -mb-0.5 sm:-mb-1">Precio</span>
              <span className="font-serif-luxury text-base sm:text-2xl font-bold text-amber-300">
                ${perfume.price}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 ml-1 font-mono">USD</span>
            </div>

            {perfume.concentration && (
              <span className="text-[8px] sm:text-[10px] text-sky-300 bg-sky-950/40 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-sky-500/30 truncate max-w-[80px] sm:max-w-none text-right">
                {perfume.concentration}
              </span>
            )}
          </div>

          {/* BOTONES DE CLIENTE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={() => onSelect(perfume)}
              className="w-full py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold bg-[#0e1424] hover:bg-[#15203a] text-sky-200 border border-sky-500/30 hover:border-sky-400 transition-all flex items-center justify-center gap-1 shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400" />
              <span>Ver Detalle</span>
            </button>

            {perfume.available ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToCart && onAddToCart(perfume)
                }}
                className="w-full py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black border border-amber-300/40 transition-all flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(212,175,55,0.25)] font-bold active:scale-95"
                title="Añadir al carrito"
              >
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Al Carrito</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium bg-rose-950/30 text-rose-400/60 border border-rose-500/20 cursor-not-allowed flex items-center justify-center"
              >
                Agotado
              </button>
            )}
          </div>

          {/* BARRA DE GESTIÓN RÁPIDA EXCLUSIVA PARA ADMIN */}
          {isAdmin && (
            <div className="mt-2 pt-2 border-t border-sky-500/20 bg-gradient-to-r from-[#0d1629] to-[#070b14] -mx-2.5 sm:-mx-4 -mb-2.5 sm:-mb-4 px-2.5 sm:px-4 py-2 flex items-center justify-between text-xs">
              <span className="text-[9px] sm:text-[10px] text-sky-300 font-mono flex items-center gap-0.5">
                ⚙️ Admin
              </span>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => onToggleAvailability(perfume.id, !perfume.available)}
                  title={perfume.available ? "Marcar como Agotado" : "Marcar como Disponible"}
                  className="flex items-center gap-1 text-[10px] text-slate-200 hover:text-white px-1.5 sm:px-2.5 py-0.5 rounded bg-black/60 border border-sky-500/30"
                >
                  {perfume.available ? (
                    <ToggleRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />
                  )}
                </button>

                <button
                  onClick={() => onEditPerfume(perfume)}
                  title="Editar este perfume"
                  className="flex items-center gap-0.5 sm:gap-1 text-[10px] text-amber-300 hover:text-amber-200 px-1.5 sm:px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
