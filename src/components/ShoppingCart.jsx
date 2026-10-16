import React, { useMemo } from 'react'
import { X, ShoppingBag, Plus, Minus, Trash2, MessageCircle, PackageOpen, ArrowRight } from 'lucide-react'

export default function ShoppingCart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  // Calcular totales
  const { totalItems, subtotal } = useMemo(() => {
    let items = 0
    let price = 0
    cartItems.forEach(item => {
      items += item.quantity
      price += item.quantity * item.perfume.price
    })
    return { totalItems: items, subtotal: price }
  }, [cartItems])

  // Construir mensaje para WhatsApp con resumen del pedido
  const buildWhatsAppMessage = () => {
    let msg = `🛍️ *PEDIDO — EL ATELIER DEL AROMA*\n`
    msg += `✨ *La Excelencia en Perfumería Multimarca*\n\n`
    msg += `Hola, me gustaría ordenar los siguientes perfumes:\n\n`

    cartItems.forEach((item, i) => {
      msg += `${i + 1}. *${item.perfume.name}* (${item.perfume.brand})\n`
      msg += `   Cantidad: ${item.quantity} | Precio unitario: $${item.perfume.price} USD\n`
      msg += `   Subtotal: $${(item.quantity * item.perfume.price).toFixed(2)} USD\n\n`
    })

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `📦 Total de artículos: ${totalItems}\n`
    msg += `💰 *TOTAL: $${subtotal.toFixed(2)} USD*\n\n`
    msg += `¿Podrían confirmar disponibilidad y métodos de pago? ¡Gracias!`

    return encodeURIComponent(msg)
  }

  const whatsappUrl = `https://wa.me/584143694386?text=${buildWhatsAppMessage()}`

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in" onClick={onClose}>
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Panel lateral del carrito */}
      <div
        className="relative w-full max-w-md bg-[#080b14] border-l border-sky-500/30 shadow-[-10px_0_60px_rgba(2,132,199,0.2)] flex flex-col h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between p-5 border-b border-sky-500/20 bg-gradient-to-r from-[#0a0f1d] to-[#080b14]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-sky-400 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <ShoppingBag className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-lg font-bold text-white">Tu Carrito</h2>
              <span className="text-[11px] text-sky-300 font-mono">
                {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#0e1424] border border-sky-500/25 text-slate-400 hover:text-white hover:border-sky-400 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO DEL CARRITO */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-20 h-20 rounded-full bg-[#0e1424] border border-sky-500/20 flex items-center justify-center mb-4">
                <PackageOpen className="w-10 h-10 text-sky-400/40" />
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-white mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mb-5">
                Explora nuestra colección exclusiva y añade tus fragancias favoritas al carrito.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-sky-400 hover:brightness-110 text-black shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all flex items-center gap-2"
              >
                <span>Explorar Colección</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.perfume.id}
                className="group bg-[#0c0f1a] rounded-2xl border border-sky-500/20 hover:border-sky-400/40 overflow-hidden transition-all duration-200 shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
              >
                <div className="flex gap-3 p-3.5">
                  {/* Imagen miniatura */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#06080e] flex-shrink-0 border border-sky-500/15">
                    <img
                      src={item.perfume.imageUrl || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=200&q=80'}
                      alt={item.perfume.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=200&q=80'
                      }}
                    />
                  </div>

                  {/* Info del perfume */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-amber-400 font-semibold truncate">
                      {item.perfume.brand}
                    </p>
                    <h4 className="text-sm font-bold text-white truncate font-serif-luxury" title={item.perfume.name}>
                      {item.perfume.name}
                    </h4>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-xs text-sky-300 font-mono">
                        ${item.perfume.price} USD
                      </span>
                      {item.perfume.volume && (
                        <span className="text-[9px] text-slate-500">• {item.perfume.volume}</span>
                      )}
                    </div>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => onRemoveItem(item.perfume.id)}
                    title="Eliminar del carrito"
                    className="self-start p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Barra de cantidad y subtotal */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#070a12] border-t border-sky-500/15">
                  {/* Control de cantidad */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateQuantity(item.perfume.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 rounded-lg bg-[#0e1424] border border-sky-500/25 text-sky-300 hover:bg-sky-500/20 hover:border-sky-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span className="w-10 text-center text-sm font-bold text-white font-mono tabular-nums">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => onUpdateQuantity(item.perfume.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-[#0e1424] border border-sky-500/25 text-sky-300 hover:bg-sky-500/20 hover:border-sky-400 flex items-center justify-center transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal del item */}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block -mb-0.5">Subtotal</span>
                    <span className="text-sm font-bold text-amber-300 font-serif-luxury">
                      ${(item.quantity * item.perfume.price).toFixed(2)}
                    </span>
                    <span className="text-[9px] text-slate-500 ml-1">USD</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PIE DEL CARRITO — Resumen y acciones */}
        {cartItems.length > 0 && (
          <div className="border-t border-sky-500/25 bg-gradient-to-t from-[#0a0e1a] to-[#080b14] p-5 space-y-4">
            {/* Resumen de precios */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Artículos ({totalItems})</span>
                <span className="text-slate-300 font-mono">${subtotal.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-sky-500/15">
                <span className="text-sm font-bold text-white">Total del Pedido</span>
                <span className="text-xl font-bold text-amber-300 font-serif-luxury">
                  ${subtotal.toFixed(2)}
                  <span className="text-xs text-slate-400 ml-1 font-mono font-normal">USD</span>
                </span>
              </div>
            </div>

            {/* Botón de WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:brightness-110 text-black shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2.5"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              <span>Enviar Pedido por WhatsApp</span>
            </a>

            {/* Vaciar carrito */}
            <button
              onClick={onClearCart}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-300 bg-[#0c0f1a] border border-sky-500/15 hover:border-rose-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar Carrito</span>
            </button>
          </div>
        )}
      </div>

      {/* Keyframe de entrada */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
