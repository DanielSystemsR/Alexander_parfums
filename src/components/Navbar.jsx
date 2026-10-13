import React, { useState, useEffect } from 'react'
import { Sparkles, Crown, ShieldCheck, LogOut, KeyRound, Search, SlidersHorizontal, ShoppingBag } from 'lucide-react'
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
  cartItemCount = 0,
  onOpenCart
}) {
  const [clickCount, setClickCount] = useState(0)
  const [showHint, setShowHint] = useState(false)

  // Manejo del Easter Egg mediante clics en el logo (5 clics rápidos)
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
    } else if (nextCount >= 3) {
      setShowHint(true)
      setTimeout(() => setShowHint(false), 2000)
    }
  }

  // Reiniciar contador de clics si no hace clic en 3 segundos
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

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#05060a]/90 border-b border-sky-500/20 shadow-[0_4px_25px_rgba(2,132,199,0.1)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO CON EASTER EGG */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleEasterEggClick}
              title={isAdmin ? "Administrador activo" : "ALEXANDER MAISON DE PARFUMS (Haz clic para descubrir...)"}
              className="group relative flex items-center gap-3 text-left focus:outline-none transition-transform active:scale-95"
            >
              {/* LOGO TRANSPARENTE CON RELIEVE AZUL CROMADO Y RESPLANDOR DORADO */}
              <div className="relative p-1 rounded-xl bg-gradient-to-b from-[#0a0f1d] to-[#05060a] border border-sky-500/30 group-hover:border-sky-400 shadow-[0_0_15px_rgba(2,132,199,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_25px_rgba(56,189,248,0.4),inset_0_1px_2px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="ALEXANDER MAISON DE PARFUMS" 
                  className="h-11 sm:h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.45)] group-hover:scale-105 transition-transform duration-300"
                />
                {isAdmin && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center shadow-lg border border-white/40">
                    <Crown className="w-3 h-3 text-black animate-pulse" />
                  </div>
                )}
              </div>

              <div className="hidden sm:block">
                <span className="block font-serif-luxury text-xl sm:text-2xl tracking-[0.25em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-sky-300">
                  ALEXANDER
                </span>
                <div className="flex items-center gap-1.5 -mt-0.5">
                  <span className="text-[9px] tracking-[0.3em] text-sky-400 font-semibold uppercase">
                    Maison de Parfums
                  </span>
                  <span className="w-1 h-1 rounded-full bg-amber-400 inline-block" />
                  <span className="text-[9px] tracking-[0.2em] text-amber-300/80 font-mono">
                    Est. 2024
                  </span>
                </div>
              </div>

              {/* Indicador sutil de clics easter egg */}
              {showHint && !isAdmin && (
                <span className="absolute -bottom-7 left-0 text-[11px] font-mono text-sky-300 bg-black/90 px-2.5 py-0.5 rounded-lg border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.3)] animate-pulse whitespace-nowrap z-50">
                  {5 - clickCount} clics más para la bóveda...
                </span>
              )}
            </button>
          </div>

          {/* BUSCADOR RÁPIDO CON BORDE AZUL CROMADO */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar perfume, marca (Tom Ford, Creed, Dior...)"
                className="w-full bg-[#0a0d17] border border-sky-500/25 rounded-full pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* BOTONES DERECHA: CARRITO & ESTADO ADMIN */}
          <div className="flex items-center gap-3">

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
                  Alta Perfumería 2026
                </span>
                {/* Botón sutil en desktop con icono discreto de llave como vía alternativa */}
                <button
                  onClick={onOpenLoginModal}
                  title="Acceso reservado a personal autorizado"
                  className="p-2 rounded-lg text-gray-600 hover:text-sky-400 hover:bg-sky-500/10 transition-all text-xs flex items-center gap-1 opacity-40 hover:opacity-100"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
