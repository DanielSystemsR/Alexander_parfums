import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Sparkles, Crown, ShieldCheck, LogOut, Search, ShoppingBag, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function Navbar({ 
  isAdmin, 
  onOpenAdmin, 
  onLogoutAdmin, 
  onOpenLoginModal,
  searchQuery,
  setSearchQuery,
  activeCategory,
  onSelectCategory,
  categories,
  perfumes = [],
  onSelectPerfume,
  cartItemCount = 0,
  onOpenCart
}) {
  const [clickCount, setClickCount] = useState(0)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const searchContainerRef = useRef(null)

  // Manejo del Easter Egg mediante 5 clics silenciosos en el logo
  const handleEasterEggClick = () => {
    const nextCount = clickCount + 1
    setClickCount(nextCount)

    if (nextCount >= 5) {
      setClickCount(0)
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.1 },
        colors: ['#D4AF37', '#F5E7A3', '#FFFFFF']
      })
      onOpenLoginModal()
    }
  }

  // Reiniciar contador si no hace clic en 3 segundos
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [clickCount])

  // Atajo de teclado secreto adicional: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault()
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.1 },
          colors: ['#D4AF37', '#FFF']
        })
        onOpenLoginModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onOpenLoginModal])

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sugerencias de búsqueda dinámicas (entre 3 y 4 sugerencias según lo escrito)
  const suggestions = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return []
    const q = searchQuery.toLowerCase().trim()
    return perfumes
      .filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.notesTop && p.notesTop.toLowerCase().includes(q)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q))
      )
      .slice(0, 4) // Exactamente entre 3 y 4 sugerencias relevantes
  }, [searchQuery, perfumes])

  const handleSelectSuggestion = (perfume) => {
    setSearchQuery(perfume.name)
    setIsSearchFocused(false)
    setShowMobileSearch(false)
    if (onSelectPerfume) {
      onSelectPerfume(perfume)
    }
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#05060a]/90 border-b border-sky-500/20 shadow-[0_4px_25px_rgba(2,132,199,0.1)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO CON EASTER EGG SILENCIOSO (5 CLICS SIN AVISO) */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleEasterEggClick}
              title={isAdmin ? "Administrador activo" : "EL ATELIER DEL AROMA"}
              className="group relative flex items-center gap-3 text-left focus:outline-none transition-transform active:scale-95"
            >
              {/* LOGO TRANSPARENTE CON RELIEVE AZUL CROMADO Y RESPLANDOR DORADO */}
              <div className="relative p-1 rounded-xl bg-gradient-to-b from-[#0a0f1d] to-[#05060a] border border-sky-500/30 group-hover:border-sky-400 shadow-[0_0_15px_rgba(2,132,199,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_25px_rgba(56,189,248,0.4),inset_0_1px_2px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="EL ATELIER DEL AROMA" 
                  className="h-11 sm:h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.45)] group-hover:scale-105 transition-transform duration-300"
                />
                {isAdmin && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center shadow-lg border border-white/40">
                    <Crown className="w-3 h-3 text-black animate-pulse" />
                  </div>
                )}
              </div>

              <div className="hidden sm:block">
                <span className="block font-serif-luxury text-base sm:text-lg tracking-[0.15em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-sky-300 whitespace-nowrap">
                  EL ATELIER DEL AROMA
                </span>
                <div className="flex items-center gap-1.5 -mt-0.5">
                  <span className="text-[8.5px] tracking-[0.15em] text-sky-400 font-semibold uppercase whitespace-nowrap">
                    LA EXCELENCIA EN PERFUMERÍA MULTIMARCA
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* BUSCADOR RÁPIDO CON SUGERENCIAS INTERACTIVAS (DESKTOP) */}
          <div ref={searchContainerRef} className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/60 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsSearchFocused(true)
                }}
                placeholder="Buscar perfume, marca (Tom Ford, Creed, Dior...)"
                className="w-full bg-[#0a0d17] border border-sky-500/25 rounded-full pl-10 pr-9 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* CAJA FLOTANTE DE SUGERENCIAS (3 A 4 SUGERENCIAS) */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-[#070b16]/95 border border-sky-400/40 rounded-2xl shadow-[0_15px_40px_rgba(2,132,199,0.35),0_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-xl overflow-hidden z-50 animate-fade-in">
                <div className="p-2.5 bg-[#050812] border-b border-sky-500/20 flex items-center justify-between text-[11px]">
                  <span className="text-amber-300 font-semibold tracking-wider flex items-center gap-1.5 font-serif-luxury">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Fragancias Sugeridas ({suggestions.length})
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    Clic para abrir
                  </span>
                </div>
                
                <div className="divide-y divide-white/5">
                  {suggestions.map((perfume) => (
                    <div
                      key={perfume.id}
                      onClick={() => handleSelectSuggestion(perfume)}
                      className="p-2.5 flex items-center gap-3 hover:bg-sky-950/40 cursor-pointer transition-colors group"
                    >
                      <img 
                        src={perfume.imageUrl} 
                        alt={perfume.name} 
                        className="w-10 h-10 rounded-lg object-cover border border-sky-500/20 group-hover:border-amber-400/50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white group-hover:text-amber-200 truncate">
                          {perfume.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                          <span>{perfume.brand}</span>
                          <span className="text-sky-400/60">•</span>
                          <span className="text-sky-300/80 font-mono text-[10px]">{perfume.volume || '100 ml'}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-amber-300 font-serif-luxury block">
                          ${perfume.price}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${perfume.available ? 'text-emerald-400 bg-emerald-950/50' : 'text-rose-400 bg-rose-950/50'}`}>
                          {perfume.available ? 'Disponible' : 'Agotado'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BOTONES DERECHA: BUSCADOR MÓVIL, CARRITO & ESTADO ADMIN */}
          <div className="flex items-center gap-2.5 sm:gap-3">

            {/* BOTÓN BÚSQUEDA MÓVIL */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2.5 rounded-xl bg-[#0a0f1d] border border-sky-500/25 text-slate-300 hover:text-sky-300 transition-colors"
              title="Buscar fragancias"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* BOTÓN DEL CARRITO */}
            <button
              onClick={onOpenCart}
              title="Ver carrito de compras"
              className="relative p-2.5 rounded-xl bg-[#0a0f1d] border border-sky-500/25 hover:border-amber-400/50 text-slate-300 hover:text-amber-300 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />

              {/* Badge con la cantidad de artículos */}
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-bold flex items-center justify-center px-1 shadow-[0_0_10px_rgba(212,175,55,0.5)] border border-white/30 animate-bounce-once">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {/* ESTADO ADMIN O BADGE DE ALTA PERFUMERÍA (SIN LLAVE) */}
            {isAdmin ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#0d1627] via-[#09101d] to-[#161208] border border-sky-400/40 px-3.5 py-1.5 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider hidden sm:inline">
                  Admin Activo
                </span>
                <button
                  onClick={onOpenAdmin}
                  className="ml-1 text-xs bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-bold px-3 py-1 rounded-full transition-all shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                >
                  Panel
                </button>
                <button
                  onClick={onLogoutAdmin}
                  title="Cerrar sesión de administrador"
                  className="p-1 text-gray-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[11px] text-sky-300/80 uppercase tracking-widest font-mono bg-sky-950/40 border border-sky-500/20 px-3 py-1 rounded-full">
                  Alta Perfumería
                </span>
              </div>
            )}
          </div>

        </div>

        {/* BUSCADOR DESPLEGABLE PARA DISPOSITIVOS MÓVILES */}
        {showMobileSearch && (
          <div className="md:hidden pb-4 pt-1 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar perfume o marca..."
                className="w-full bg-[#0a0d17] border border-sky-500/30 rounded-xl pl-10 pr-9 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-sky-400"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sugerencias en Móvil */}
            {suggestions.length > 0 && (
              <div className="mt-2 bg-[#070b16] border border-sky-400/30 rounded-xl overflow-hidden divide-y divide-white/5">
                {suggestions.map((perfume) => (
                  <div
                    key={perfume.id}
                    onClick={() => handleSelectSuggestion(perfume)}
                    className="p-2.5 flex items-center gap-3 active:bg-sky-950/60"
                  >
                    <img 
                      src={perfume.imageUrl} 
                      alt={perfume.name} 
                      className="w-9 h-9 rounded object-cover border border-sky-500/20"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-xs font-semibold text-white truncate">{perfume.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{perfume.brand}</div>
                    </div>
                    <span className="text-xs font-bold text-amber-300 font-serif-luxury shrink-0">
                      ${perfume.price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  )
}
