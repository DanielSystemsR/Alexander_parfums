import React from 'react'
import { CheckCircle2, XCircle, Sparkles, Eye, MessageCircle, Edit3, ToggleLeft, ToggleRight, ShoppingBag } from 'lucide-react'

export default function PerfumeCard({ 
  perfume, 
  onSelect, 
  isAdmin, 
  onEditPerfume, 
  onToggleAvailability,
  onAddToCart
}) {
  const whatsappMessage = encodeURIComponent(
    `Hola ALEXANDER MAISON DE PARFUMS, me interesa el perfume ${perfume.name} (${perfume.brand}) de $${perfume.price} USD. ¿Sigue disponible?`
  )
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`

  return (
    <div className={`group relative bg-[#0a0d16] rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
      perfume.available 
        ? 'border border-sky-500/25 hover:border-sky-400 shadow-[0_4px_20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_12px_35px_rgba(2,132,199,0.35),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:-translate-y-1' 
        : 'border border-slate-800 opacity-75 hover:opacity-100 hover:border-rose-500/40'
    }`}>
      
      {/* SECCIÓN SUPERIOR DE IMAGEN */}
      <div className="relative aspect-[4/5] bg-[#06080e] overflow-hidden cursor-pointer" onClick={() => onSelect(perfume)}>
        <img
          src={perfume.imageUrl || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'}
          alt={perfume.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
          }}
        />

        {/* Gradiente oscuro sobre la imagen para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d16] via-transparent to-black/30" />

        {/* BADGE DE DISPONIBILIDAD */}
        <div className="absolute top-3 left-3 z-10">
          {perfume.available ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/85 border border-emerald-400/50 text-emerald-300 backdrop-blur-md shadow-[0_0_12px_rgba(16,185,129,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Disponible
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-950/85 border border-rose-400/50 text-rose-300 backdrop-blur-md shadow-[0_0_12px_rgba(244,63,94,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Agotado
            </span>
          )}
        </div>

        {/* BADGE DE CATEGORÍA CON RELIEVE AZUL CROMADO */}
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[10px] font-medium tracking-wider uppercase text-sky-200 bg-[#091122]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-sky-400/30 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
            {perfume.categoryName || 'Colección'}
          </span>
        </div>

        {/* VOLUMEN FLOTANTE */}
        {perfume.volume && (
          <div className="absolute bottom-3 right-3 z-10 text-[10px] font-mono text-slate-300 bg-black/70 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
            {perfume.volume}
          </div>
        )}
      </div>

      {/* INFORMACIÓN DEL PERFUME */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* MARCA */}
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-amber-400 mb-1">
            {perfume.brand}
          </p>

          {/* NOMBRE */}
          <h3 
            onClick={() => onSelect(perfume)}
            className="font-serif-luxury text-lg sm:text-xl font-bold text-white group-hover:text-sky-300 transition-colors cursor-pointer line-clamp-1 mb-1.5"
            title={perfume.name}
          >
            {perfume.name}
          </h3>

          {/* NOTAS RESUMIDAS */}
          {perfume.notesTop && (
            <p className="text-xs text-slate-400 line-clamp-1 mb-3">
              <span className="text-slate-500">Notas:</span> {perfume.notesTop}
            </p>
          )}
        </div>

        {/* PRECIO & ACCIONES */}
        <div className="pt-3 border-t border-sky-500/15 mt-2">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-slate-400 block -mb-1">Precio</span>
              <span className="font-serif-luxury text-2xl font-bold text-amber-300">
                ${perfume.price}
              </span>
              <span className="text-[10px] text-slate-500 ml-1 font-mono">USD</span>
            </div>

            {perfume.concentration && (
              <span className="text-[10px] text-sky-300 bg-sky-950/40 px-2.5 py-0.5 rounded-full border border-sky-500/30">
                {perfume.concentration}
              </span>
            )}
          </div>

          {/* BOTONES DE CLIENTE */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelect(perfume)}
              className="w-full py-2 px-2.5 rounded-xl text-xs font-semibold bg-[#0e1424] hover:bg-[#15203a] text-sky-200 border border-sky-500/30 hover:border-sky-400 transition-all flex items-center justify-center gap-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Ver Detalle</span>
            </button>

            {perfume.available ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToCart && onAddToCart(perfume)
                }}
                className="w-full py-2 px-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black border border-amber-300/40 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold"
                title="Añadir al carrito"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Al Carrito</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-2 px-2.5 rounded-xl text-xs font-medium bg-rose-950/30 text-rose-400/60 border border-rose-500/20 cursor-not-allowed flex items-center justify-center"
              >
                Agotado
              </button>
            )}
          </div>

          {/* BARRA DE GESTIÓN RÁPIDA EXCLUSIVA PARA ADMIN */}
          {isAdmin && (
            <div className="mt-3 pt-2.5 border-t border-sky-500/20 bg-gradient-to-r from-[#0d1629] to-[#070b14] -mx-5 -mb-5 px-5 py-2.5 flex items-center justify-between text-xs">
              <span className="text-[10px] text-sky-300 font-mono flex items-center gap-1">
                ⚙️ Admin
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleAvailability(perfume.id, !perfume.available)}
                  title={perfume.available ? "Marcar como Agotado" : "Marcar como Disponible"}
                  className="flex items-center gap-1 text-[11px] text-slate-200 hover:text-white px-2.5 py-0.5 rounded-lg bg-black/60 border border-sky-500/30"
                >
                  {perfume.available ? (
                    <>
                      <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Disp.</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-3.5 h-3.5 text-rose-400" />
                      <span>Agot.</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onEditPerfume(perfume)}
                  title="Editar este perfume"
                  className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30"
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
