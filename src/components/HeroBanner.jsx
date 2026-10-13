import React from 'react'
import { Sparkles, Award, ShieldCheck, Truck, Gem } from 'lucide-react'

export default function HeroBanner({ totalPerfumes, totalCategories }) {
  return (
    <div className="relative overflow-hidden py-6 sm:py-16 border-b border-sky-500/20 bg-gradient-to-b from-[#060810] via-[#05060a] to-[#080b14]">
      {/* Luces de fondo decorativas: azul cromado y oro imperial */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-sky-600/15 via-amber-500/15 to-blue-500/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-10 w-72 h-72 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* LOGO TRANSPARENTE PRINCIPAL (PROPORCIONADO EN MÓVIL Y DESKTOP) */}
        <div className="mb-3 sm:mb-6 flex flex-col items-center justify-center">
          <div className="relative group cursor-pointer">
            {/* Halo de luz azul cromada y dorada detrás del logo sin fondo */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/30 via-amber-400/25 to-sky-400/30 blur-2xl rounded-full scale-125 opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <img
              src="/logo.png"
              alt="EL ATELIER DEL AROMA"
              className="relative h-16 sm:h-36 md:h-44 w-auto object-contain drop-shadow-[0_8px_20px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* INSIGNIA CON RELIEVE EN AZUL CROMADO */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-[#0c1527] via-[#070e1c] to-[#0c1527] border border-sky-400/40 text-sky-200 text-[10px] sm:text-sm font-medium mb-2 sm:mb-4 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
          <Gem className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
          <span className="tracking-wide">Curaduría de Alta Perfumería Multimarca</span>
        </div>

        {/* TÍTULO PRINCIPAL CON RELIEVE EN AZUL CROMADO Y ORO */}
        <h1 className="font-serif-luxury text-2xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-1 sm:mb-2 leading-tight">
          EL ATELIER <span className="chrome-blue-text font-serif-luxury">DEL AROMA</span>
        </h1>

        <p className="text-[9px] sm:text-sm tracking-[0.18em] sm:tracking-[0.25em] text-amber-300 uppercase font-semibold font-mono mb-2 sm:mb-4">
          LA EXCELENCIA EN PERFUMERÍA MULTIMARCA
        </p>

        {/* SUBTÍTULO */}
        <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-300 font-light leading-relaxed mb-4 sm:mb-8">
          Explora nuestra selecta curaduría multimarca de fragancias originales, elixires y extractos de estela inconfundible, longevidad extrema y autenticidad garantizada.
        </p>

        {/* CINTA DE CONFIANZA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 max-w-4xl mx-auto pt-3 sm:pt-4 border-t border-sky-500/15">
          <div className="flex items-center justify-center gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#080d19]/80 border border-sky-500/20 shadow-[0_4px_15px_rgba(2,132,199,0.1)] hover:border-sky-400/50 transition-colors">
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="text-[10px] sm:text-xs text-slate-200 font-medium">100% Originales</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#080d19]/80 border border-sky-500/20 shadow-[0_4px_15px_rgba(2,132,199,0.1)] hover:border-sky-400/50 transition-colors">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 shrink-0" />
            <span className="text-[10px] sm:text-xs text-slate-200 font-medium">{totalPerfumes} Fragancias de Lujo</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#080d19]/80 border border-sky-500/20 shadow-[0_4px_15px_rgba(2,132,199,0.1)] hover:border-sky-400/50 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="text-[10px] sm:text-xs text-slate-200 font-medium">{totalCategories} Categorías</span>
          </div>

          <div className="flex items-center justify-center gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#080d19]/80 border border-sky-500/20 shadow-[0_4px_15px_rgba(2,132,199,0.1)] hover:border-sky-400/50 transition-colors">
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 shrink-0" />
            <span className="text-[10px] sm:text-xs text-slate-200 font-medium">Envíos Asegurados</span>
          </div>
        </div>

      </div>
    </div>
  )
}
