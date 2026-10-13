import React, { useState } from 'react'
import { Lock, KeyRound, ShieldAlert, X, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      // Credenciales válidas para el Easter Egg
      const isValid = 
        (email.trim().toLowerCase() === 'admin@alexanderparfums.com' || 
         email.trim().toLowerCase() === 'admin@auraparfums.com' || 
         email.trim().toLowerCase() === 'admin') &&
        password === 'admin123'

      if (isValid) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F5E7A3', '#38EF7D', '#FFFFFF']
        })
        onLoginSuccess()
        onClose()
      } else {
        setError('Credenciales inválidas. Verifica usuario y clave.')
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0a0d18] border border-sky-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(2,132,199,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CABECERA EASTER EGG CON LOGO TRANSPARENTE */}
        <div className="text-center mb-6">
          <div className="relative mb-3 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-amber-400/20 to-sky-400/20 blur-xl rounded-full scale-110 pointer-events-none" />
            <img 
              src="/logo.png" 
              alt="ALEXANDER MAISON DE PARFUMS" 
              className="relative h-20 w-auto object-contain drop-shadow-[0_4px_15px_rgba(212,175,55,0.4)]" 
            />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-400/40 text-sky-300 text-xs font-mono mb-2 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Acceso Administrativo
          </div>

          <h2 className="font-serif-luxury text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-sky-300">
            Bóveda de Administración
          </h2>
          <p className="text-[11px] uppercase tracking-widest text-sky-400 font-mono mt-0.5">
            ALEXANDER MAISON DE PARFUMS
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Acceso exclusivo para edición de precios, disponibilidad y gestión de catálogo.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Usuario o Correo
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#05070e] border border-sky-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all font-mono shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#05070e] border border-sky-500/30 rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all font-mono shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 via-blue-500 to-amber-400 hover:brightness-110 text-black shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span>Verificando...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Ingresar al Panel de Control</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-gray-500">
            Tip: También puedes presionar <kbd className="font-mono bg-black/60 px-1.5 py-0.5 rounded border border-gray-700 text-gray-300">Ctrl + Shift + A</kbd> en cualquier momento para invocar esta ventana.
          </p>
        </div>
      </div>
    </div>
  )
}
