import React from 'react'
import { X, CheckCircle, XCircle, Sparkles, MessageCircle, ShoppingBag } from 'lucide-react'

export default function PerfumeDetailModal({ perfume, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !perfume) return null

  const whatsappMessage = encodeURIComponent(
    `Hola ALEXANDER MAISON DE PARFUMS, me gustaría ordenar el perfume "${perfume.name}" de ${perfume.brand} ($${perfume.price} USD). ¿Tienen disponibilidad inmediata para despacho?`
  )
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-3xl bg-[#090d18] border border-sky-400/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(2,132,199,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] text-slate-100 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 text-slate-300 hover:text-white hover:bg-black/90 transition-colors border border-sky-500/30 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* IMAGEN DEL PERFUME */}
        <div className="md:w-1/2 relative bg-[#04060a] min-h-[280px] md:min-h-full flex items-center justify-center overflow-hidden">
          <img
            src={perfume.imageUrl || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'}
            alt={perfume.name}
            className="w-full h-full object-cover max-h-[380px] md:max-h-none transform hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d18] via-transparent to-black/30 md:bg-gradient-to-r md:from-transparent md:to-[#090d18]" />
          
          {/* BADGE DE DISPONIBILIDAD FLOTANTE */}
          <div className="absolute top-4 left-4 z-10">
            {perfume.available ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/90 border border-emerald-400/50 text-emerald-300 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Disponible
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/90 border border-rose-400/50 text-rose-300 backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <XCircle className="w-3.5 h-3.5 text-rose-400" /> Agotado
              </span>
            )}
          </div>
        </div>

        {/* DETALLES DEL PERFUME */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-amber-400">
                {perfume.brand}
              </span>
              <span className="text-sky-500">•</span>
              <span className="text-xs text-sky-200 bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                {perfume.categoryName || 'Colección Exclusiva'}
              </span>
            </div>

            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
              {perfume.name}
            </h2>

            {/* PRECIO Y CONCENTRACIÓN */}
            <div className="flex items-baseline gap-3 my-3 pb-3 border-b border-sky-500/20">
              <span className="text-3xl font-serif-luxury font-bold text-amber-300">
                ${perfume.price}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                USD • {perfume.volume || '100 ml'}
              </span>
              {perfume.concentration && (
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-sky-950/50 border border-sky-400/30 text-sky-300">
                  {perfume.concentration}
                </span>
              )}
            </div>

            {/* DESCRIPCIÓN */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {perfume.description || 'Fragancia sublime de alta concentración elaborada con esencias de la más alta pureza.'}
            </p>

            {/* PIRÁMIDE OLFATIVA */}
            <div className="space-y-2.5 bg-[#05070f] p-4 rounded-2xl border border-sky-500/25 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] mb-6">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Pirámide Olfativa
              </span>

              {perfume.notesTop && (
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">Notas de Salida:</span>{' '}
                  <span className="text-slate-200">{perfume.notesTop}</span>
                </div>
              )}

              {perfume.notesHeart && (
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">Notas de Corazón:</span>{' '}
                  <span className="text-slate-200">{perfume.notesHeart}</span>
                </div>
              )}

              {perfume.notesBase && (
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">Notas de Fondo:</span>{' '}
                  <span className="text-slate-200">{perfume.notesBase}</span>
                </div>
              )}
            </div>
          </div>

          {/* ACCIONES: CARRITO Y WHATSAPP */}
          <div className="pt-2 space-y-2.5">
            {perfume.available ? (
              <>
                {/* BOTÓN AÑADIR AL CARRITO */}
                <button
                  onClick={() => {
                    onAddToCart && onAddToCart(perfume)
                  }}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-black shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-all flex items-center justify-center gap-2.5"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Añadir al Carrito</span>
                </button>

                {/* BOTÓN CONSULTAR POR WHATSAPP */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </>
            ) : (
              <div className="w-full py-3 px-4 rounded-xl text-center text-xs bg-rose-950/40 border border-rose-500/30 text-rose-300">
                Actualmente agotado. Puedes solicitar reserva especial con nuestros asesores.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
