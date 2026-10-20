import React from 'react'
import { Sparkles, CheckCircle2, XCircle, ArrowUpDown, Layers } from 'lucide-react'

export default function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
  perfumes,
  availabilityFilter,
  setAvailabilityFilter,
  sortBy,
  setSortBy
}) {
  // Conteo de perfumes por categoría
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return perfumes.length
    return perfumes.filter(p => p.categoryId === categoryId).length
  }

  return (
    <div className="space-y-2.5 sm:space-y-4 mb-4 sm:mb-8">
      {/* PESTAÑAS DE CATEGORÍAS CON RELIEVE AZUL CROMADO Y DORADO */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#0369a1] text-white font-bold border border-sky-300/50 shadow-[0_0_15px_rgba(56,189,248,0.35)]'
              : 'bg-[#0a0d16] text-slate-300 hover:text-white hover:bg-[#111726] border border-sky-500/15'
          }`}
        >
          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
          <span>Todas</span>
          <span className={`text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.2 rounded-full font-mono font-bold ${
            activeCategory === 'all' 
              ? 'bg-black/30 text-amber-200 border border-amber-300/30' 
              : 'bg-white/5 text-slate-400'
          }`}>
            {getCategoryCount('all')}
          </span>
        </button>

        {categories.map((cat) => {
          const count = getCategoryCount(cat.id)
          const isSelected = activeCategory === cat.id

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#0369a1] text-white font-bold border border-sky-300/50 shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                  : 'bg-[#0a0d16] text-slate-300 hover:text-white hover:bg-[#111726] border border-sky-500/15'
              }`}
            >
              <Sparkles className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSelected ? 'text-amber-200' : 'text-amber-400/80'}`} />
              <span>{cat.name}</span>
              <span className={`text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.2 rounded-full font-mono font-bold ${
                isSelected 
                  ? 'bg-black/30 text-amber-200 border border-amber-300/30' 
                  : 'bg-white/5 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* FILTROS SECUNDARIOS: DISPONIBILIDAD Y ORDENAMIENTO CON RELIEVE METÁLICO */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0a0d17] rounded-2xl border border-sky-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]">
        
        {/* FILTRO DE DISPONIBILIDAD */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Disponibilidad:</span>
          
          <button
            onClick={() => setAvailabilityFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              availabilityFilter === 'all'
                ? 'bg-gradient-to-r from-sky-950/80 to-blue-900/60 text-sky-200 border border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.2)] font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Todos
          </button>

          <button
            onClick={() => setAvailabilityFilter('available')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              availabilityFilter === 'available'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Disponibles</span>
          </button>

          <button
            onClick={() => setAvailabilityFilter('soldout')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              availabilityFilter === 'soldout'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.2)] font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Agotados</span>
          </button>
        </div>

        {/* ORDENAMIENTO POR PRECIO */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs text-slate-400 hidden sm:inline">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0e1322] border border-sky-500/25 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <option value="name-asc">Nombre: A - Z</option>
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>
        </div>

      </div>
    </div>
  )
}
