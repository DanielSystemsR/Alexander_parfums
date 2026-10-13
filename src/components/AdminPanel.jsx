import React, { useState } from 'react'
import { 
  X, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, DollarSign, 
  Layers, Package, CheckCircle2, XCircle, Sparkles, 
  Search, Save, ShieldAlert, ArrowLeft
} from 'lucide-react'

export default function AdminPanel({
  isOpen,
  onClose,
  perfumes,
  categories,
  onUpdatePrice,
  onToggleAvailability,
  onCreatePerfume,
  onDeletePerfume,
  onCreateCategory,
  onDeleteCategory,
  onEditPerfumeModal
}) {
  if (!isOpen) return null

  const [activeTab, setActiveTab] = useState('summary') // 'summary' | 'new-perfume' | 'categories'
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  // Estado para edición inline rápida de precios
  const [editingPriceId, setEditingPriceId] = useState(null)
  const [tempPrice, setTempPrice] = useState('')

  // Formulario para nuevo perfume
  const [newPerfume, setNewPerfume] = useState({
    name: '',
    brand: '',
    categoryId: categories[0]?.id || '',
    price: '',
    available: true,
    volume: '100 ml',
    concentration: 'Eau de Parfum',
    notesTop: '',
    notesHeart: '',
    notesBase: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
  })

  // Formulario para nueva categoría
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDesc, setNewCategoryDesc] = useState('')

  // Métricas calculadas para el resumen del catálogo
  const totalPerfumes = perfumes.length
  const totalAvailable = perfumes.filter(p => p.available).length
  const totalSoldOut = perfumes.filter(p => !p.available).length
  const totalCategoriesCount = categories.length
  const totalInventoryValue = perfumes.reduce((acc, p) => acc + (p.price || 0), 0)

  // Filtro para la tabla resumida
  const filteredPerfumes = perfumes.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCat = filterCategory === 'all' || p.categoryId === filterCategory
    return matchesSearch && matchesCat
  })

  // Guardar edición rápida de precio
  const handleSavePrice = (id) => {
    if (tempPrice !== '') {
      onUpdatePrice(id, parseFloat(tempPrice))
    }
    setEditingPriceId(null)
  }

  // Manejo de creación de nuevo perfume
  const handleCreatePerfumeSubmit = (e) => {
    e.preventDefault()
    const selectedCategory = categories.find(c => c.id === newPerfume.categoryId)
    onCreatePerfume({
      ...newPerfume,
      price: parseFloat(newPerfume.price) || 0,
      categoryName: selectedCategory ? selectedCategory.name : 'Sin categoría'
    })
    // Resetear formulario
    setNewPerfume({
      name: '',
      brand: '',
      categoryId: categories[0]?.id || '',
      price: '',
      available: true,
      volume: '100 ml',
      concentration: 'Eau de Parfum',
      notesTop: '',
      notesHeart: '',
      notesBase: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
    })
    setActiveTab('summary')
  }

  // Manejo de creación de nueva categoría
  const handleCreateCategorySubmit = (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    onCreateCategory({
      name: newCategoryName,
      description: newCategoryDesc
    })
    setNewCategoryName('')
    setNewCategoryDesc('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-6xl bg-[#070a14] border border-sky-400/40 rounded-3xl shadow-[0_0_80px_rgba(2,132,199,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] text-slate-100 flex flex-col h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA DEL PANEL */}
        <div className="p-4 sm:p-6 border-b border-sky-500/20 bg-[#04060e] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative p-1 rounded-xl border border-sky-500/40 bg-black/70 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
              <img 
                src="/logo.png" 
                alt="EL ATELIER DEL AROMA" 
                className="h-10 w-auto object-contain drop-shadow" 
              />
            </div>
            <div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                EL ATELIER DEL AROMA <span className="text-sky-300 font-sans text-xs tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-sky-950/80 border border-sky-400/40 shadow-[0_0_10px_rgba(56,189,248,0.2)]">PANEL PRIVADO</span>
              </h2>
              <p className="text-xs text-amber-300/80 font-mono">
                La Excelencia en Perfumería Multimarca • Control de Precios, Stock y Familias Olfativas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0e1628] hover:bg-[#16223e] text-sky-200 border border-sky-500/30 hover:border-sky-400 transition-all flex items-center gap-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400" />
              <span>Volver a la Tienda</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVEGACIÓN DE PESTAÑAS */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 pb-2 bg-[#050812] border-b border-sky-500/15 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'summary'
                ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 text-white font-bold border border-sky-300/50 shadow-[0_0_15px_rgba(56,189,248,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4 text-amber-300" />
            <span>Catálogo Resumido & Precios</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-black/30 text-current border border-white/10 font-mono">
              {totalPerfumes}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('new-perfume')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'new-perfume'
                ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 text-white font-bold border border-sky-300/50 shadow-[0_0_15px_rgba(56,189,248,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>+ Ingresar Nuevo Perfume</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'categories'
                ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 text-white font-bold border border-sky-300/50 shadow-[0_0_15px_rgba(56,189,248,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-300" />
            <span>Gestión de Categorías</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-black/30 text-current border border-white/10 font-mono">
              {totalCategoriesCount}
            </span>
          </button>

        </div>

        {/* CONTENIDO PRINCIPAL POR PESTAÑA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* =========================================
              PESTAÑA 1: CATÁLOGO RESUMIDO & EDICIÓN
             ========================================= */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* TARJETAS DE MÉTRICAS */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#090d18] border border-sky-500/25 shadow-[0_4px_15px_rgba(2,132,199,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Total Perfumes</span>
                    <Package className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-bold font-serif-luxury text-white">
                    {totalPerfumes}
                  </div>
                  <span className="text-[11px] text-slate-500">en inventario</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#090d18] border border-emerald-500/30 shadow-[0_4px_15px_rgba(16,185,129,0.15)]">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Disponibles</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-serif-luxury text-emerald-300">
                    {totalAvailable}
                  </div>
                  <span className="text-[11px] text-emerald-500/80 font-mono">listos para venta</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#090d18] border border-rose-500/30 shadow-[0_4px_15px_rgba(244,63,94,0.15)]">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Agotados</span>
                    <XCircle className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-bold font-serif-luxury text-rose-300">
                    {totalSoldOut}
                  </div>
                  <span className="text-[11px] text-rose-500/80 font-mono">por reabastecer</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#090d18] border border-sky-500/25 shadow-[0_4px_15px_rgba(2,132,199,0.15)]">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Categorías</span>
                    <Layers className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-bold font-serif-luxury text-white">
                    {totalCategoriesCount}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">familias olfativas</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#090d18] border border-amber-500/30 shadow-[0_4px_15px_rgba(212,175,55,0.15)] col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Valor Inventario</span>
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold font-serif-luxury text-amber-300">
                    ${totalInventoryValue.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-amber-500/80 font-mono">USD acumulado</span>
                </div>
              </div>

              {/* BARRA DE FILTROS Y BÚSQUEDA DEL ADMIN */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#141624] border border-white/5">
                <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Filtrar por perfume o marca..."
                      className="w-full bg-[#1c1f30] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-[#1c1f30] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">Todas las Categorías</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setActiveTab('new-perfume')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:brightness-110"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Perfume</span>
                </button>
              </div>

              {/* TABLA RESUMIDA CON EDICIÓN EN LÍNEA DE PRECIOS Y DISPONIBILIDAD */}
              <div className="bg-[#121420] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#181a29] text-gray-400 uppercase tracking-wider text-[11px] border-b border-white/5">
                      <tr>
                        <th className="py-3 px-4">Perfume</th>
                        <th className="py-3 px-4">Categoría</th>
                        <th className="py-3 px-4">Precio ($ USD)</th>
                        <th className="py-3 px-4">Disponibilidad</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredPerfumes.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-gray-500">
                            No se encontraron perfumes con los filtros seleccionados.
                          </td>
                        </tr>
                      ) : (
                        filteredPerfumes.map((perf) => (
                          <tr key={perf.id} className="hover:bg-white/[0.02] transition-colors">
                            {/* PERFUME (FOTO + NOMBRE + MARCA) */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={perf.imageUrl || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'}
                                  alt={perf.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                                />
                                <div>
                                  <span className="font-semibold text-white block text-sm">
                                    {perf.name}
                                  </span>
                                  <span className="text-[11px] text-amber-400/80 uppercase tracking-wider">
                                    {perf.brand} • {perf.volume || '100 ml'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* CATEGORÍA ASIGNADA */}
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300">
                                {perf.categoryName || 'Sin asignar'}
                              </span>
                            </td>

                            {/* PRECIO (EDICIÓN RÁPIDA INLINE) */}
                            <td className="py-3 px-4">
                              {editingPriceId === perf.id ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-amber-400 font-bold">$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={tempPrice}
                                    onChange={(e) => setTempPrice(e.target.value)}
                                    className="w-20 bg-[#1f2235] border border-amber-400 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSavePrice(perf.id)}
                                    className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded"
                                    title="Guardar precio"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingPriceId(null)}
                                    className="p-1 text-gray-400 hover:bg-white/10 rounded"
                                    title="Cancelar"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 group/price">
                                  <span className="font-serif-luxury text-base font-bold text-amber-300">
                                    ${perf.price}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setEditingPriceId(perf.id)
                                      setTempPrice(perf.price.toString())
                                    }}
                                    className="p-1 text-gray-500 hover:text-amber-300 opacity-60 group-hover/price:opacity-100 transition-opacity"
                                    title="Editar precio rápido"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* DISPONIBILIDAD (TOGGLE INSTANTÁNEO EN 1 CLIC) */}
                            <td className="py-3 px-4">
                              <button
                                onClick={() => onToggleAvailability(perf.id, !perf.available)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                  perf.available
                                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                                    : 'bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
                                }`}
                                title="Haz clic para alternar entre Disponible y Agotado"
                              >
                                {perf.available ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Disponible</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Agotado</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* ACCIONES (EDITAR COMPLETO / ELIMINAR) */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => onEditPerfumeModal(perf)}
                                  className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors"
                                  title="Editar todos los campos"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`¿Seguro que deseas eliminar "${perf.name}"?`)) {
                                      onDeletePerfume(perf.id)
                                    }
                                  }}
                                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                                  title="Eliminar perfume"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              PESTAÑA 2: INGRESAR NUEVO PERFUME
             ========================================= */}
          {activeTab === 'new-perfume' && (
            <div className="max-w-4xl mx-auto bg-[#131523] border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="mb-6 pb-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" /> Ingresar Nuevo Perfume
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Añade un perfume a la tienda y asígnalo a su categoría correspondiente
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreatePerfumeSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* NOMBRE */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Nombre del Perfume *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Baccarat Rouge 540"
                      value={newPerfume.name}
                      onChange={(e) => setNewPerfume({ ...newPerfume, name: e.target.value })}
                      className="w-full bg-[#1b1e2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* MARCA */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Casa / Marca *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Maison Francis Kurkdjian"
                      value={newPerfume.brand}
                      onChange={(e) => setNewPerfume({ ...newPerfume, brand: e.target.value })}
                      className="w-full bg-[#1b1e2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* ASIGNACIÓN DE CATEGORÍA */}
                  <div>
                    <label className="block text-xs font-medium text-amber-300 mb-1.5">
                      Categoría Olfativa *
                    </label>
                    <select
                      required
                      value={newPerfume.categoryId}
                      onChange={(e) => setNewPerfume({ ...newPerfume, categoryId: e.target.value })}
                      className="w-full bg-[#1b1e2e] border border-amber-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-[11px] text-gray-400 block mt-1">
                      ¿Necesitas una nueva? Créala en la pestaña "Gestión de Categorías".
                    </span>
                  </div>

                  {/* PRECIO */}
                  <div>
                    <label className="block text-xs font-medium text-amber-300 mb-1.5">
                      Precio ($ USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="Ej. 295.00"
                      value={newPerfume.price}
                      onChange={(e) => setNewPerfume({ ...newPerfume, price: e.target.value })}
                      className="w-full bg-[#1b1e2e] border border-amber-500/30 rounded-xl px-4 py-2.5 text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* DISPONIBILIDAD INICIAL */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Disponibilidad Inicial
                    </label>
                    <select
                      value={newPerfume.available ? 'true' : 'false'}
                      onChange={(e) => setNewPerfume({ ...newPerfume, available: e.target.value === 'true' })}
                      className="w-full bg-[#1b1e2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="true">✅ Disponible (En Stock)</option>
                      <option value="false">❌ Agotado (Sin Stock)</option>
                    </select>
                  </div>

                  {/* CONCENTRACIÓN & VOLUMEN */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Concentración
                      </label>
                      <input
                        type="text"
                        value={newPerfume.concentration}
                        onChange={(e) => setNewPerfume({ ...newPerfume, concentration: e.target.value })}
                        placeholder="Eau de Parfum"
                        className="w-full bg-[#1b1e2e] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Volumen
                      </label>
                      <input
                        type="text"
                        value={newPerfume.volume}
                        onChange={(e) => setNewPerfume({ ...newPerfume, volume: e.target.value })}
                        placeholder="100 ml"
                        className="w-full bg-[#1b1e2e] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                </div>

                {/* IMAGEN DEL PERFUME (URL DE GOOGLE O SUBIR ARCHIVO) */}
                <div className="bg-[#181a2b] p-4 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-amber-300">
                      Fotografía del Frasco / Perfume
                    </label>
                    <span className="text-[11px] text-gray-400">
                      Desde Google o archivo de tu dispositivo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* OPCIÓN 1: SUBIR DESDE COMPUTADORA / CELULAR */}
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">
                        📁 Subir foto desde tu PC / Teléfono:
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setNewPerfume(prev => ({ ...prev, imageUrl: reader.result }))
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-400/20 file:text-amber-300 hover:file:bg-amber-400/30 cursor-pointer bg-[#131522] rounded-xl border border-white/10 p-1"
                      />
                    </div>

                    {/* OPCIÓN 2: PEGAR URL DE GOOGLE */}
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">
                        🔗 O pegar enlace directo de imagen:
                      </label>
                      <input
                        type="url"
                        value={newPerfume.imageUrl}
                        onChange={(e) => setNewPerfume({ ...newPerfume, imageUrl: e.target.value })}
                        placeholder="https://ejemplo.com/perfume.jpg"
                        className="w-full bg-[#131522] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* PREVISUALIZADOR Y EXPLICACIÓN DE GOOGLE */}
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-black/40 border border-white/5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-500/30 bg-[#0d0e14] shrink-0 flex items-center justify-center">
                      {newPerfume.imageUrl ? (
                        <img 
                          src={newPerfume.imageUrl} 
                          alt="preview" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
                          }}
                        />
                      ) : (
                        <span className="text-[10px] text-gray-500">Sin foto</span>
                      )}
                    </div>

                    <div className="text-[11px] text-gray-400 leading-relaxed">
                      <strong className="text-amber-300 block mb-0.5">💡 ¿Cómo copiar la imagen de Google correctamente?</strong>
                      1. Busca el perfume en Google Imágenes y haz clic en la foto.<br />
                      2. En el panel que se abre a la derecha, haz <strong>clic derecho</strong> sobre la imagen.<br />
                      3. Selecciona <strong className="text-white">"Copiar dirección de la imagen"</strong> (o <em>"Copy image address"</em>).<br />
                      4. Pégala en el campo de enlace de arriba.
                    </div>
                  </div>

                  {/* FOTOS DE MUESTRA RÁPIDAS */}
                  <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-gray-400 pt-1">
                    <span className="shrink-0">Opciones de muestra:</span>
                    <button
                      type="button"
                      onClick={() => setNewPerfume({ ...newPerfume, imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80' })}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300/80 whitespace-nowrap"
                    >
                      Dorado Lujoso
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPerfume({ ...newPerfume, imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80' })}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300/80 whitespace-nowrap"
                    >
                      Negro Elegante
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPerfume({ ...newPerfume, imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80' })}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300/80 whitespace-nowrap"
                    >
                      Ámbar Cristal
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPerfume({ ...newPerfume, imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80' })}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300/80 whitespace-nowrap"
                    >
                      Minimalista Blanco
                    </button>
                  </div>
                </div>

                {/* NOTAS OLFATIVAS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Notas de Salida (Top)</label>
                    <input
                      type="text"
                      placeholder="Bergamota, Pimienta rosa..."
                      value={newPerfume.notesTop}
                      onChange={(e) => setNewPerfume({ ...newPerfume, notesTop: e.target.value })}
                      className="w-full bg-[#1b1e2e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Notas de Corazón (Heart)</label>
                    <input
                      type="text"
                      placeholder="Jazmín, Cedro, Rosa..."
                      value={newPerfume.notesHeart}
                      onChange={(e) => setNewPerfume({ ...newPerfume, notesHeart: e.target.value })}
                      className="w-full bg-[#1b1e2e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Notas de Fondo (Base)</label>
                    <input
                      type="text"
                      placeholder="Vainilla, Ámbar, Oud..."
                      value={newPerfume.notesBase}
                      onChange={(e) => setNewPerfume({ ...newPerfume, notesBase: e.target.value })}
                      className="w-full bg-[#1b1e2e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* DESCRIPCIÓN */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Descripción de la Fragancia
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Describe la personalidad, acordes y estela de este perfume..."
                    value={newPerfume.description}
                    onChange={(e) => setNewPerfume({ ...newPerfume, description: e.target.value })}
                    className="w-full bg-[#1b1e2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* BOTÓN ENVIAR */}
                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('summary')}
                    className="px-5 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Guardar y Publicar en Catálogo</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================
              PESTAÑA 3: GESTIÓN DE CATEGORÍAS
             ========================================= */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* FORMULARIO CREAR CATEGORÍA */}
              <div className="lg:col-span-1 bg-[#131523] border border-amber-500/20 rounded-3xl p-6 h-fit">
                <h3 className="font-serif-luxury text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" /> Crear Nueva Categoría
                </h3>
                <p className="text-xs text-gray-400 mb-5">
                  Las categorías creadas aparecerán inmediatamente en los filtros de la tienda y en los formularios para asignar perfumes.
                </p>

                <form onSubmit={handleCreateCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Nombre de la Categoría *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Acuáticos & Marinos"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full bg-[#1b1e2e] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Descripción breve
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Frescura oceánica, brisa salada y algas..."
                      value={newCategoryDesc}
                      onChange={(e) => setNewCategoryDesc(e.target.value)}
                      className="w-full bg-[#1b1e2e] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Crear Categoría</span>
                  </button>
                </form>
              </div>

              {/* LISTA DE CATEGORÍAS EXISTENTES */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-200">
                    Categorías Activas ({categories.length})
                  </h4>
                  <span className="text-xs text-gray-400">
                    Perfumes organizados
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const assignedPerfumes = perfumes.filter(p => p.categoryId === cat.id)
                    
                    return (
                      <div 
                        key={cat.id}
                        className="p-4 rounded-2xl bg-[#141624] border border-white/5 hover:border-amber-500/20 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-serif-luxury font-bold text-white text-base">
                              {cat.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                              {assignedPerfumes.length} {assignedPerfumes.length === 1 ? 'perfume' : 'perfumes'}
                            </span>
                          </div>

                          <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                            {cat.description || 'Sin descripción'}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-gray-500 font-mono">
                            slug: {cat.slug || cat.id}
                          </span>

                          <button
                            onClick={() => {
                              if (assignedPerfumes.length > 0) {
                                alert(`No se puede eliminar la categoría "${cat.name}" porque tiene ${assignedPerfumes.length} perfumes asignados. Reasigna o elimina los perfumes primero.`)
                                return
                              }
                              if (window.confirm(`¿Eliminar la categoría "${cat.name}"?`)) {
                                onDeleteCategory(cat.id)
                              }
                            }}
                            className="text-xs text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/10"
                            title="Eliminar categoría vacía"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}
