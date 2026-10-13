import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Navbar from './components/Navbar'
import HeroBanner from './components/HeroBanner'
import CategoryFilter from './components/CategoryFilter'
import PerfumeCard from './components/PerfumeCard'
import PerfumeDetailModal from './components/PerfumeDetailModal'
import EditPerfumeModal from './components/EditPerfumeModal'
import AdminLoginModal from './components/AdminLoginModal'
import AdminPanel from './components/AdminPanel'
import ShoppingCart from './components/ShoppingCart'
import Footer from './components/Footer'
import { 
  fetchCategories, 
  fetchPerfumes, 
  createPerfume, 
  updatePerfumePrice, 
  updatePerfumeAvailability, 
  updateFullPerfume, 
  deletePerfume, 
  createCategory, 
  deleteCategory 
} from './lib/supabase'
import { Sparkles, PackageOpen, Crown, SlidersHorizontal, CheckCircle2 } from 'lucide-react'

export default function App() {
  const [perfumes, setPerfumes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Filtros de navegación
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  // Modales
  const [selectedPerfume, setSelectedPerfume] = useState(null)
  const [editingPerfume, setEditingPerfume] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Estado de administrador
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('aura_is_admin') === 'true'
  })

  // ═══════════════════════════════════════════════════════
  // CARRITO DE COMPRAS
  // ═══════════════════════════════════════════════════════
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cart_v1')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Persistir carrito en localStorage
  useEffect(() => {
    localStorage.setItem('aura_cart_v1', JSON.stringify(cartItems))
  }, [cartItems])

  const handleAddToCart = useCallback((perfume) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.perfume.id === perfume.id)
      if (existing) {
        // Ya está en el carrito: incrementar cantidad
        return prev.map(item =>
          item.perfume.id === perfume.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      // Nuevo en el carrito
      return [...prev, { perfume, quantity: 1 }]
    })
    showToast(`🛒 "${perfume.name}" añadido al carrito.`)
  }, [])

  const handleUpdateCartQuantity = useCallback((perfumeId, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(prev =>
      prev.map(item =>
        item.perfume.id === perfumeId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }, [])

  const handleRemoveFromCart = useCallback((perfumeId) => {
    setCartItems(prev => prev.filter(item => item.perfume.id !== perfumeId))
    showToast('Artículo eliminado del carrito.')
  }, [])

  const handleClearCart = useCallback(() => {
    setCartItems([])
    showToast('Carrito vaciado.')
  }, [])

  const totalCartItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }, [cartItems])

  // ═══════════════════════════════════════════════════════

  // Cargar datos al iniciar
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [cats, perfs] = await Promise.all([
          fetchCategories(),
          fetchPerfumes()
        ])
        setCategories(cats)
        setPerfumes(perfs)
      } catch (err) {
        console.error('Error cargando catálogo:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Login y Logout Admin
  const handleLoginSuccess = () => {
    setIsAdmin(true)
    sessionStorage.setItem('aura_is_admin', 'true')
    setIsAdminPanelOpen(true)
    showToast('👑 ¡Acceso Concedido! Has entrado como Administrador.')
  }

  const handleLogout = () => {
    setIsAdmin(false)
    sessionStorage.removeItem('aura_is_admin')
    setIsAdminPanelOpen(false)
    showToast('Sesión de administrador cerrada.')
  }

  // Acciones sobre Perfumes
  const handleUpdatePrice = async (id, newPrice) => {
    await updatePerfumePrice(id, newPrice)
    setPerfumes(prev => prev.map(p => p.id === id ? { ...p, price: newPrice } : p))
    showToast('Precio actualizado exitosamente.')
  }

  const handleToggleAvailability = async (id, isAvailable) => {
    await updatePerfumeAvailability(id, isAvailable)
    setPerfumes(prev => prev.map(p => p.id === id ? { ...p, available: isAvailable } : p))
    showToast(isAvailable ? 'Perfume marcado como Disponible.' : 'Perfume marcado como Agotado.')
  }

  const handleCreatePerfume = async (perfumeData) => {
    const created = await createPerfume(perfumeData)
    setPerfumes(prev => [created, ...prev])
    showToast(`Perfume "${created.name}" añadido al catálogo.`)
  }

  const handleSaveFullPerfume = async (id, updatedFields) => {
    await updateFullPerfume(id, updatedFields)
    setPerfumes(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p))
    showToast('Detalles del perfume actualizados.')
  }

  const handleDeletePerfume = async (id) => {
    await deletePerfume(id)
    setPerfumes(prev => prev.filter(p => p.id !== id))
    showToast('Perfume eliminado del catálogo.')
  }

  // Acciones sobre Categorías
  const handleCreateCategory = async (catData) => {
    const created = await createCategory(catData)
    setCategories(prev => [...prev, created])
    showToast(`Categoría "${created.name}" creada con éxito.`)
  }

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id)
    setCategories(prev => prev.filter(c => c.id !== id))
    showToast('Categoría eliminada.')
  }

  // Filtrado y Ordenamiento de Perfumes
  const filteredPerfumes = useMemo(() => {
    let list = [...perfumes]

    // Filtro por categoría
    if (activeCategory !== 'all') {
      list = list.filter(p => p.categoryId === activeCategory)
    }

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.notesTop && p.notesTop.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      )
    }

    // Filtro por disponibilidad
    if (availabilityFilter === 'available') {
      list = list.filter(p => p.available)
    } else if (availabilityFilter === 'soldout') {
      list = list.filter(p => !p.available)
    }

    // Ordenamiento
    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }

    return list
  }, [perfumes, activeCategory, searchQuery, availabilityFilter, sortBy])

  return (
    <div className="min-h-screen bg-[#05060a] text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      
      {/* BARRA SUPERIOR CON EASTER EGG */}
      <Navbar
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onLogoutAdmin={handleLogout}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        categories={categories}
        cartItemCount={totalCartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* BANNER PRINCIPAL */}
      <HeroBanner 
        totalPerfumes={perfumes.length}
        totalCategories={categories.length}
      />

      {/* CONTENIDO PRINCIPAL DEL CATÁLOGO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* BANNER FLOTANTE INDICADOR DE MODO ADMIN SI ESTÁ ACTIVO */}
        {isAdmin && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#0e1830] via-[#081022] to-[#141208] border border-sky-400/40 flex flex-wrap items-center justify-between gap-3 shadow-[0_0_25px_rgba(56,189,248,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-sky-400 flex items-center justify-center text-black font-bold shadow-lg">
                👑
              </div>
              <div>
                <span className="font-semibold text-sky-200 text-sm block">
                  Modo Administrador Activo • ALEXANDER
                </span>
                <span className="text-xs text-amber-300/80">
                  Puedes editar precios o disponibilidad directamente en cada tarjeta o abrir el panel general.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-400 to-amber-300 hover:brightness-110 text-black shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all"
            >
              Abrir Panel de Control
            </button>
          </div>
        )}

        {/* FILTROS POR CATEGORÍA, DISPONIBILIDAD Y PRECIO */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          perfumes={perfumes}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* CONTADOR DE RESULTADOS */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-400">
          <span>
            Mostrando <strong className="text-amber-300">{filteredPerfumes.length}</strong> de {perfumes.length} perfumes
            {activeCategory !== 'all' && (
              <span> en <span className="text-white">"{categories.find(c => c.id === activeCategory)?.name}"</span></span>
            )}
            {searchQuery && (
              <span> para <span className="text-white">"{searchQuery}"</span></span>
            )}
          </span>

          {(activeCategory !== 'all' || searchQuery || availabilityFilter !== 'all') && (
            <button
              onClick={() => {
                setActiveCategory('all')
                setSearchQuery('')
                setAvailabilityFilter('all')
              }}
              className="text-amber-400 hover:underline"
            >
              Restablecer filtros
            </button>
          )}
        </div>

        {/* GRILLA DE PERFUMES */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-serif-luxury">Cargando colección exclusiva...</p>
          </div>
        ) : filteredPerfumes.length === 0 ? (
          <div className="py-20 text-center bg-[#11131c] rounded-3xl border border-white/5 p-8 max-w-lg mx-auto">
            <PackageOpen className="w-12 h-12 mx-auto text-amber-400/40 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1 font-serif-luxury">
              No se encontraron fragancias
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Prueba cambiando la categoría seleccionada o los términos de búsqueda.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all')
                setSearchQuery('')
                setAvailabilityFilter('all')
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-400 text-black hover:bg-amber-300"
            >
              Ver Todas las Colecciones
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPerfumes.map((perfume) => (
              <PerfumeCard
                key={perfume.id}
                perfume={perfume}
                onSelect={(p) => setSelectedPerfume(p)}
                isAdmin={isAdmin}
                onEditPerfume={(p) => setEditingPerfume(p)}
                onToggleAvailability={handleToggleAvailability}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

      </main>

      {/* PIE DE PÁGINA */}
      <Footer onTriggerEasterEgg={() => setIsLoginModalOpen(true)} />

      {/* MODAL DE DETALLE DEL PERFUME */}
      <PerfumeDetailModal
        perfume={selectedPerfume}
        isOpen={Boolean(selectedPerfume)}
        onClose={() => setSelectedPerfume(null)}
        onAddToCart={handleAddToCart}
      />

      {/* MODAL DE EDICIÓN COMPLETA (ADMIN) */}
      <EditPerfumeModal
        perfume={editingPerfume}
        isOpen={Boolean(editingPerfume)}
        onClose={() => setEditingPerfume(null)}
        onSave={handleSaveFullPerfume}
        categories={categories}
      />

      {/* MODAL DE LOGIN ADMIN (EASTER EGG) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* PANEL DE ADMINISTRACIÓN COMPLETO */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        perfumes={perfumes}
        categories={categories}
        onUpdatePrice={handleUpdatePrice}
        onToggleAvailability={handleToggleAvailability}
        onCreatePerfume={handleCreatePerfume}
        onDeletePerfume={handleDeletePerfume}
        onCreateCategory={handleCreateCategory}
        onDeleteCategory={handleDeleteCategory}
        onEditPerfumeModal={(p) => setEditingPerfume(p)}
      />

      {/* CARRITO DE COMPRAS */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* TOAST FLOTANTE */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#141624] border border-amber-500/40 text-amber-200 text-xs font-medium shadow-[0_0_25px_rgba(212,175,55,0.25)] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  )
}
