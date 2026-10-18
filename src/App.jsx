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
import FAQSection from './components/FAQSection'
import Footer from './components/Footer'
import { 
  fetchCategories, 
  fetchAllPerfumesLight,
  fetchAllPerfumesFull,
  fetchPerfumesPage,
  createPerfume, 
  updatePerfumePrice, 
  updatePerfumeAvailability, 
  updateFullPerfume, 
  deletePerfume, 
  createCategory, 
  deleteCategory 
} from './lib/supabase'
import { Sparkles, PackageOpen, Crown, ChevronLeft, ChevronRight } from 'lucide-react'

export default function App() {
  const [allPerfumes, setAllPerfumes] = useState([])
  const [categories, setCategories] = useState([])
  const [loadingInitial, setLoadingInitial] = useState(true)

  // Filtros de navegación
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  // Paginación de 5 en 5
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  // Perfumes con imagen cargados para la página actual
  const [currentPagePerfumes, setCurrentPagePerfumes] = useState([])
  const [loadingPage, setLoadingPage] = useState(false)

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

  // Carrito de compras
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cart_v1')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('aura_cart_v1', JSON.stringify(cartItems))
  }, [cartItems])

  const handleAddToCart = useCallback((perfume) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.perfume.id === perfume.id)
      if (existing) {
        return prev.map(item =>
          item.perfume.id === perfume.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
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

  // Cargar catálogo liviano inicial para renderizado instantáneo
  useEffect(() => {
    async function loadInitial() {
      try {
        setLoadingInitial(true)
        const [cats, perfs] = await Promise.all([
          fetchCategories(),
          fetchAllPerfumesLight()
        ])
        setCategories(cats)
        setAllPerfumes(perfs)
      } catch (err) {
        console.error('Error cargando catálogo:', err)
      } finally {
        setLoadingInitial(false)
      }

      // Carga en segundo plano de imágenes completas para el buscador y el panel de administración
      try {
        const fullPerfs = await fetchAllPerfumesFull()
        if (fullPerfs && fullPerfs.length > 0) {
          setAllPerfumes(prev => {
            const fullMap = new Map(fullPerfs.map(p => [p.id, p]))
            return prev.map(p => fullMap.get(p.id) || p)
          })
        }
      } catch (e) {
        console.warn('Error sincronizando fotos completas en segundo plano:', e)
      }
    }
    loadInitial()
  }, [])

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

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

  const handleToggleAvailability = async (perfume) => {
    const nextState = !perfume.available
    await updatePerfumeAvailability(perfume.id, nextState)
    setAllPerfumes(prev => prev.map(p => p.id === perfume.id ? { ...p, available: nextState } : p))
    setCurrentPagePerfumes(prev => prev.map(p => p.id === perfume.id ? { ...p, available: nextState } : p))
    showToast(`Estado actualizado: ${nextState ? 'Disponible' : 'Agotado'}`)
  }

  const handleUpdatePrice = async (perfumeId, newPrice) => {
    await updatePerfumePrice(perfumeId, newPrice)
    setAllPerfumes(prev => prev.map(p => p.id === perfumeId ? { ...p, price: Number(newPrice) } : p))
    setCurrentPagePerfumes(prev => prev.map(p => p.id === perfumeId ? { ...p, price: Number(newPrice) } : p))
    showToast('Precio actualizado exitosamente.')
  }

  const handleCreatePerfume = async (perfumeData) => {
    const created = await createPerfume(perfumeData)
    setAllPerfumes(prev => [created, ...prev])
    setCurrentPage(1)
    showToast(`Perfume "${created.name}" añadido al catálogo.`)
  }

  const handleDeletePerfume = async (perfumeId) => {
    await deletePerfume(perfumeId)
    setAllPerfumes(prev => prev.filter(p => p.id !== perfumeId))
    setCurrentPagePerfumes(prev => prev.filter(p => p.id !== perfumeId))
    showToast('Perfume eliminado.')
  }

  const handleSaveFullEdit = async (id, updatedData) => {
    await updateFullPerfume(id, updatedData)
    setAllPerfumes(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p))
    setCurrentPagePerfumes(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p))
    setEditingPerfume(null)
    showToast('Cambios guardados con éxito.')
  }

  const handleCreateCategory = async (catData) => {
    const newCat = await createCategory(catData)
    setCategories(prev => [...prev, newCat])
    showToast(`Categoría "${newCat.name}" creada.`)
  }

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id)
    setCategories(prev => prev.filter(c => c.id !== id))
    showToast('Categoría eliminada.')
  }

  // Filtrado y Ordenamiento
  const filteredPerfumes = useMemo(() => {
    let list = [...allPerfumes]

    if (activeCategory !== 'all') {
      list = list.filter(p => p.categoryId === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.notesTop && p.notesTop.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      )
    }

    if (availabilityFilter === 'available') {
      list = list.filter(p => p.available)
    } else if (availabilityFilter === 'soldout') {
      list = list.filter(p => !p.available)
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }

    return list
  }, [allPerfumes, activeCategory, searchQuery, availabilityFilter, sortBy])

  // Resetear página al filtrar
  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, searchQuery, availabilityFilter, sortBy])

  // Cálculo de páginas
  const totalPages = Math.ceil(filteredPerfumes.length / ITEMS_PER_PAGE) || 1

  // Segmento de 5 perfumes de la página actual
  const currentSlice = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredPerfumes.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredPerfumes, currentPage, ITEMS_PER_PAGE])

  // Cargar las 5 fotos correspondientes a la página activa
  useEffect(() => {
    let active = true
    async function load5Perfumes() {
      if (currentSlice.length === 0) {
        setCurrentPagePerfumes([])
        return
      }

      setLoadingPage(true)
      const ids = currentSlice.map(p => p.id)
      const full5 = await fetchPerfumesPage({ ids })

      if (active) {
        // Enlazar los datos completos con fotos
        const fullMap = new Map(full5.map(p => [p.id, p]))
        const merged = currentSlice.map(p => fullMap.get(p.id) || p)
        setCurrentPagePerfumes(merged)
        setLoadingPage(false)
      }
    }

    load5Perfumes()
    return () => { active = false }
  }, [currentSlice])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    const el = document.getElementById('catalogo-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-[#05060a] text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      
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
        perfumes={allPerfumes}
        onSelectPerfume={(p) => setSelectedPerfume(p)}
        cartItemCount={totalCartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <HeroBanner 
        totalPerfumes={allPerfumes.length}
        totalCategories={categories.length}
      />

      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 w-full">
        
        {isAdmin && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#0e1830] via-[#081022] to-[#141208] border border-sky-400/40 flex flex-wrap items-center justify-between gap-3 shadow-[0_0_25px_rgba(56,189,248,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-sky-400 flex items-center justify-center text-black font-bold shadow-lg">
                👑
              </div>
              <div>
                <span className="font-semibold text-sky-200 text-sm block">
                  Modo Administrador Activo • EL ATELIER DEL AROMA
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

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          perfumes={allPerfumes}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div id="catalogo-section" className="scroll-mt-24" />

        {/* CONTADOR DE RESULTADOS */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 text-xs text-gray-400">
          <span>
            Mostrando <strong className="text-amber-300">{currentPagePerfumes.length}</strong> de <strong className="text-white">{filteredPerfumes.length}</strong> perfumes
            {totalPages > 1 && (
              <span className="ml-2 text-sky-300 font-mono">
                (Página {currentPage} de {totalPages})
              </span>
            )}
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
        {loadingInitial ? (
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
          <>
            <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-6 transition-opacity duration-300 ${loadingPage ? 'opacity-50' : 'opacity-100'}`}>
              {currentPagePerfumes.map((perfume) => (
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

            {/* BARRA DE PAGINACIÓN DE 5 EN 5 */}
            {totalPages > 1 && (
              <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#070b16] via-[#091122] to-[#070b16] border border-sky-500/30 shadow-[0_4px_25px_rgba(2,132,199,0.15)]">
                <div className="text-xs text-slate-400">
                  Página <span className="text-white font-semibold">{currentPage}</span> de <span className="text-white font-semibold">{totalPages}</span> (5 perfumes por página)
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border border-sky-500/30 bg-[#06080f] text-slate-300 hover:text-white hover:border-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden xs:inline">Anterior</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(num => num === 1 || num === totalPages || Math.abs(num - currentPage) <= 2)
                      .map((pageNumber, idx, arr) => {
                        const prev = arr[idx - 1]
                        return (
                          <React.Fragment key={pageNumber}>
                            {prev && pageNumber - prev > 1 && (
                              <span className="text-slate-500 px-1">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(pageNumber)}
                              className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                                currentPage === pageNumber
                                  ? 'bg-gradient-to-r from-sky-400 to-amber-300 text-black shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-105'
                                  : 'border border-sky-500/20 bg-[#06080f] text-slate-300 hover:border-sky-400/50 hover:text-white'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          </React.Fragment>
                        )
                      })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border border-sky-500/30 bg-[#06080f] text-slate-300 hover:text-white hover:border-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="hidden xs:inline">Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </main>

      <FAQSection />
      <Footer />

      <PerfumeDetailModal
        perfume={selectedPerfume}
        isOpen={Boolean(selectedPerfume)}
        onClose={() => setSelectedPerfume(null)}
        onAddToCart={handleAddToCart}
      />

      <EditPerfumeModal
        perfume={editingPerfume}
        categories={categories}
        isOpen={Boolean(editingPerfume)}
        onClose={() => setEditingPerfume(null)}
        onSave={handleSaveFullEdit}
      />

      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        perfumes={allPerfumes}
        categories={categories}
        onUpdatePrice={handleUpdatePrice}
        onToggleAvailability={handleToggleAvailability}
        onCreatePerfume={handleCreatePerfume}
        onDeletePerfume={handleDeletePerfume}
        onCreateCategory={handleCreateCategory}
        onDeleteCategory={handleDeleteCategory}
        onEditPerfumeModal={(p) => setEditingPerfume(p)}
      />

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0a1122] border border-sky-400 text-sky-100 px-4 py-3 rounded-2xl shadow-[0_0_30px_rgba(56,189,248,0.4)] text-xs font-semibold animate-bounce">
          {toastMessage}
        </div>
      )}

    </div>
  )
}
