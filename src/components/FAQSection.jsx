import React, { useState } from 'react'
import { ChevronDown, HelpCircle, ShieldCheck, ShoppingBag, Truck, Sparkles, MessageCircle } from 'lucide-react'

const FAQ_DATA = [
  {
    id: 1,
    icon: ShieldCheck,
    question: "¿Las fragancias son 100% auténticas y originales?",
    answer: "Trabajamos con total transparencia ofreciendo dos líneas claramente identificadas en nuestro catálogo: nuestra Línea Original, compuesta exclusivamente por lotes 100% legítimos, sellados y con códigos batch verificables importados de Europa, Medio Oriente y Estados Unidos; y nuestra Línea Calidad 1:1, compuesta por réplicas de alta gama seleccionadas minuciosamente para ofrecer la máxima fidelidad en aroma, empaque y fijación a un precio más accesible, garantizando que en todo momento sepas exactamente qué categoría estás adquiriendo."
  },
  {
    id: 2,
    icon: ShoppingBag,
    question: "¿Cómo funciona la compra a través del Carrito y WhatsApp?",
    answer: "Es muy sencillo y personalizado: navega por nuestro catálogo, añade las fragancias que desees a tu carrito y ajusta las cantidades. Al presionar 'Completar Orden por WhatsApp', se generará automáticamente un desglose detallado con los nombres, precios y total a pagar. Un asesor sommelier te responderá al instante para confirmar disponibilidad y coordinar la entrega."
  },
  {
    id: 3,
    icon: Truck,
    question: "¿Cómo se realizan los envíos y cómo se protegen las botellas?",
    answer: "Despachamos envíos asegurados a nivel nacional. Cada botella se empaca individualmente con envoltorio antichoque multicapa y protección térmica especial para preservar la calidad, estabilidad y maceración de los aceites aromáticos durante el trayecto."
  },
  {
    id: 4,
    icon: Sparkles,
    question: "¿Cuáles son los métodos de pago disponibles?",
    answer: "Ofrecemos múltiples opciones de pago seguras y convenientes: transferencias bancarias, Pago Móvil, Zelle, Binance Pay (USDT) y efectivo en entregas personales programadas según la ciudad."
  },
  {
    id: 5,
    icon: HelpCircle,
    question: "¿Qué diferencia existe entre Eau de Parfum (EDP) y Extrait de Parfum?",
    answer: "La clave está en la concentración de aceites esenciales puros: un Eau de Parfum contiene entre 15% y 20% de aceites aromáticos con una duración de 8 a 12 horas en piel. Un Extrait de Parfum o Elixir supera el 25% al 40%, brindando una fijación de más de 24 horas y una estela olfativa profunda y envolvente."
  },
  {
    id: 6,
    icon: MessageCircle,
    question: "¿Puedo solicitar asesoría para elegir mi perfume ideal?",
    answer: "¡Con gusto! Si buscas un perfume para ocasiones especiales, para clima cálido, para oficina o una firma olfativa inolvidable, puedes escribirnos directamente por WhatsApp y nuestro equipo te asesorará según tus familias y notas olfativas preferidas."
  }
]

export default function FAQSection() {
  const [openId, setOpenId] = useState(1) // Primer ítem abierto por defecto

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id)
  }

  const handleWhatsAppHelp = () => {
    const text = encodeURIComponent("¡Hola EL ATELIER DEL AROMA! Tengo una consulta sobre una fragancia de su catálogo.")
    window.open(`https://wa.me/584143694386?text=${text}`, '_blank')
  }

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-sky-500/20 bg-gradient-to-b from-[#05060a] via-[#070b16] to-[#04060c] overflow-hidden">

      {/* Luces y resplandores de fondo */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-sky-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">

        {/* ENCABEZADO DE LA SECCIÓN */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#0a1122] border border-sky-400/40 text-sky-300 text-xs font-medium mb-3 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="tracking-wide">Resolvemos tus dudas</span>
          </div>

          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Preguntas <span className="chrome-blue-text font-serif-luxury">Frecuentes</span>
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto font-light leading-relaxed">
            Todo lo que necesitas saber sobre autenticidad de fragancias, proceso de compra por carrito, métodos de pago y despachos.
          </p>
        </div>

        {/* LISTA DE PREGUNTAS (ACORDEÓN DE LUJO) */}
        <div className="space-y-3.5">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id
            const IconComponent = item.icon

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                  ? 'bg-gradient-to-r from-[#091122] via-[#060b17] to-[#0a1020] border-sky-400/50 shadow-[0_4px_25px_rgba(2,132,199,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)]'
                  : 'bg-[#080d19]/80 border-sky-500/15 hover:border-sky-500/35 hover:bg-[#0c1324]/90'
                  }`}
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className={`p-2 rounded-xl border transition-colors shrink-0 ${isOpen
                      ? 'bg-sky-950/80 border-sky-400/50 text-amber-300 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                      : 'bg-black/40 border-white/10 text-slate-400'
                      }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <span className={`text-sm sm:text-base font-semibold transition-colors ${isOpen ? 'text-white' : 'text-slate-200'
                      }`}>
                      {item.question}
                    </span>
                  </div>

                  <div className={`p-1.5 rounded-full transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-amber-300 bg-sky-950/60' : 'text-slate-500'
                    }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-sky-500/15 animate-fade-in pl-14 sm:pl-16">
                    {item.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* BANNER INFORMATIVO / CONTACTO */}
        <div className="mt-10 p-5 rounded-3xl bg-gradient-to-r from-[#0d162a] via-[#09101f] to-[#12130e] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-[0_0_30px_rgba(212,175,55,0.15)]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-serif-luxury">
                ¿Tienes una consulta específica o buscas un perfume por encargo?
              </h4>
              <p className="text-xs text-slate-400">
                Atención personalizada con un asesor experto por WhatsApp.
              </p>
            </div>
          </div>

          <button
            onClick={handleWhatsAppHelp}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
          >
            <span>Consultar por WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  )
}
