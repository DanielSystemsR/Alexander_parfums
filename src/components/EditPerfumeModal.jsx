import React, { useState, useEffect } from 'react'
import { X, Save, Sparkles, CheckCircle2 } from 'lucide-react'

export default function EditPerfumeModal({ perfume, isOpen, onClose, onSave, categories }) {
  if (!isOpen || !perfume) return null

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    categoryId: '',
    categoryName: '',
    price: '',
    available: true,
    volume: '100 ml',
    concentration: 'Eau de Parfum',
    notesTop: '',
    notesHeart: '',
    notesBase: '',
    description: '',
    imageUrl: ''
  })

  useEffect(() => {
    if (perfume) {
      setFormData({
        name: perfume.name || '',
        brand: perfume.brand || '',
        categoryId: perfume.categoryId || '',
        categoryName: perfume.categoryName || '',
        price: perfume.price || 0,
        available: perfume.available !== undefined ? perfume.available : true,
        volume: perfume.volume || '100 ml',
        concentration: perfume.concentration || 'Eau de Parfum',
        notesTop: perfume.notesTop || '',
        notesHeart: perfume.notesHeart || '',
        notesBase: perfume.notesBase || '',
        description: perfume.description || '',
        imageUrl: perfume.imageUrl || ''
      })
    }
  }, [perfume])

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value
    const found = categories.find(c => c.id === selectedId)
    setFormData(prev => ({
      ...prev,
      categoryId: selectedId,
      categoryName: found ? found.name : ''
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(perfume.id, {
      ...formData,
      price: parseFloat(formData.price) || 0
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#090d18] border border-sky-400/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(2,132,199,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] text-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA */}
        <div className="flex items-center justify-between p-5 border-b border-sky-500/20 bg-[#05070e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-950/60 border border-sky-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                Editar Perfume: {perfume.name}
              </h3>
              <p className="text-xs text-sky-300/80">Modifica precio, disponibilidad y categoría</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORMULARIO SCROLLABLE */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nombre del Perfume *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#05070e] border border-sky-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Casa / Marca *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full bg-[#181a26] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* CATEGORÍA ASIGNADA */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Categoría Olfativa *</label>
              <select
                required
                value={formData.categoryId}
                onChange={handleCategoryChange}
                className="w-full bg-[#181a26] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="">Selecciona una categoría...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PRECIO */}
            <div>
              <label className="block text-xs font-medium text-amber-300 mb-1">Precio ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-[#181a26] border border-amber-500/30 rounded-xl px-3.5 py-2 text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* DISPONIBILIDAD */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Estado / Disponibilidad</label>
              <select
                value={formData.available ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, available: e.target.value === 'true' })}
                className="w-full bg-[#181a26] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="true">✅ Disponible (En Stock)</option>
                <option value="false">❌ Agotado (Sin Stock)</option>
              </select>
            </div>

            {/* CONCENTRACIÓN */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Concentración</label>
              <input
                type="text"
                value={formData.concentration}
                onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                placeholder="Eau de Parfum, Extrait de Parfum..."
                className="w-full bg-[#181a26] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* IMAGEN DEL PERFUME */}
          <div className="bg-[#181a26] p-3.5 rounded-xl border border-white/5 space-y-2.5">
            <label className="block text-xs font-semibold text-amber-300">
              Fotografía del Frasco / Perfume
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">📁 Subir desde tu PC/Teléfono:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setFormData(prev => ({ ...prev, imageUrl: reader.result }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-400/20 file:text-amber-300 hover:file:bg-amber-400/30 cursor-pointer bg-[#12141f] rounded-lg border border-white/10 p-1"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">🔗 O enlace directo (Google):</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://ejemplo.com/perfume.jpg"
                  className="w-full bg-[#12141f] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {formData.imageUrl && (
              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-500/30 shrink-0">
                  <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] text-emerald-400">✓ Imagen cargada correctamente</span>
              </div>
            )}
          </div>

          {/* PIRÁMIDE OLFATIVA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Notas de Salida</label>
              <input
                type="text"
                value={formData.notesTop}
                onChange={(e) => setFormData({ ...formData, notesTop: e.target.value })}
                placeholder="Bergamota, Pimienta..."
                className="w-full bg-[#181a26] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Notas de Corazón</label>
              <input
                type="text"
                value={formData.notesHeart}
                onChange={(e) => setFormData({ ...formData, notesHeart: e.target.value })}
                placeholder="Lavanda, Rosa..."
                className="w-full bg-[#181a26] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Notas de Fondo</label>
              <input
                type="text"
                value={formData.notesBase}
                onChange={(e) => setFormData({ ...formData, notesBase: e.target.value })}
                placeholder="Ámbar, Cedro, Vainilla..."
                className="w-full bg-[#181a26] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Descripción</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#181a26] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* BOTÓN GUARDAR */}
          <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
