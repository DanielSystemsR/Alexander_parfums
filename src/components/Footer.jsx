import React from 'react'
import { Sparkles, Shield, Award, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-sky-500/20 bg-[#04060c] text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* MARCA */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative p-1.5 rounded-xl bg-gradient-to-b from-[#0a1020] to-[#04060c] border border-sky-500/30 shadow-[0_0_15px_rgba(2,132,199,0.25)]">
                <img
                  src="/logo.png"
                  alt="EL ATELIER DEL AROMA"
                  className="h-12 w-auto object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]"
                />
              </div>
              <div>
                <span className="font-serif-luxury text-lg sm:text-xl tracking-[0.15em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-sky-300 block">
                  EL ATELIER DEL AROMA
                </span>
                <span className="text-[9px] tracking-[0.15em] text-sky-400 font-mono uppercase block -mt-0.5">
                  LA EXCELENCIA EN PERFUMERÍA MULTIMARCA
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Dedicados al arte de la alta perfumería multimarca y fragancias exclusivas con los más altos estándares de maceración y originalidad garantizada.
            </p>
          </div>

          {/* FAMILIAS */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 font-mono">
              Colecciones
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-amber-300 transition-colors cursor-pointer">Amaderados & Orientales</li>
              <li className="hover:text-sky-300 transition-colors cursor-pointer">Cítricos & Frescos</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">Florales & Frutales</li>
              <li className="hover:text-sky-300 transition-colors cursor-pointer">Gourmand & Especiados</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">Cuero & Tabaco</li>
            </ul>
          </div>

          {/* ATENCIÓN */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 font-mono">
              Atención & Pedidos
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Consultas y despachos directos vía WhatsApp con asesores especializados en notas olfativas.
            </p>
            <a
              href="https://wa.me/584127661800"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 px-3 py-1.5 rounded-full transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>WhatsApp: +58 412 7661800</span>
            </a>
          </div>

        </div>

        {/* LÍNEA FINAL CON TRIGGER DISCRETO DE EASTER EGG */}
        <div className="pt-8 border-t border-sky-500/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © {new Date().getFullYear()} EL ATELIER DEL AROMA. La Excelencia en Perfumería Multimarca. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacidad</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Términos</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
