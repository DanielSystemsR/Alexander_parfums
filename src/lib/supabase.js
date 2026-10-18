import { createClient } from '@supabase/supabase-js'

// Variables de entorno para Supabase (con fallback a las credenciales del proyecto de Supabase)
const FALLBACK_SUPABASE_URL = 'https://omjncrgeeyjaslcjxalo.supabase.co'
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tam5jcmdlZXlqYXNsY2p4YWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NTAxNTEsImV4cCI6MjEwNzQyNjE1MX0.zEHHt1qWXHLeJdfbfKVH9YgAV_AnfYAPnNi9LrYbt6o'

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('aura_supabase_url') || FALLBACK_SUPABASE_URL).trim()
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('aura_supabase_key') || FALLBACK_SUPABASE_ANON_KEY).trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('tu-proyecto')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const DEFAULT_CATEGORIES = []
export const DEFAULT_PERFUMES = []

const STORAGE_KEYS = {
  PERFUMES: 'aura_perfumes_v5',
  CATEGORIES: 'aura_categories_v5'
}

export function getLocalCategories() {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch (e) {
    return []
  }
}

export function getLocalPerfumes() {
  const data = localStorage.getItem(STORAGE_KEYS.PERFUMES)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch (e) {
    return []
  }
}

export function normalizePerfume(raw) {
  if (!raw) return null
  return {
    id: raw.id,
    name: raw.name,
    brand: raw.brand,
    categoryId: raw.categoryId || raw.category_id || '',
    categoryName: raw.categoryName || raw.category_name || '',
    price: Number(raw.price) || 0,
    available: raw.available !== undefined ? Boolean(raw.available) : true,
    volume: raw.volume || '100 ml',
    concentration: raw.concentration || 'Eau de Parfum',
    notesTop: raw.notesTop || raw.notes_top || '',
    notesHeart: raw.notesHeart || raw.notes_heart || '',
    notesBase: raw.notesBase || raw.notes_base || '',
    description: raw.description || '',
    imageUrl: raw.imageUrl || raw.image_url || '',
    featured: Boolean(raw.featured),
    created_at: raw.created_at
  }
}

function toSupabasePerfumePayload(p) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category_id: p.categoryId || p.category_id || null,
    category_name: p.categoryName || p.category_name || '',
    price: Number(p.price) || 0,
    available: p.available !== undefined ? Boolean(p.available) : true,
    volume: p.volume || '100 ml',
    concentration: p.concentration || 'Eau de Parfum',
    notes_top: p.notesTop || p.notes_top || '',
    notes_heart: p.notesHeart || p.notes_heart || '',
    notes_base: p.notesBase || p.notes_base || '',
    description: p.description || '',
    image_url: p.imageUrl || p.image_url || '',
    featured: Boolean(p.featured)
  }
}

// 1. Obtener categorías
export async function fetchCategories() {
  const localCats = getLocalCategories()
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/categories?select=*&order=created_at.asc`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data))
        return data
      }
    }
  } catch (err) {
    console.warn('Error cargando categorías:', err)
  }
  return localCats
}

// Cache en memoria para almacenar las imágenes de perfumes ya cargadas
const imageCache = new Map()

export function getCachedImageUrl(id) {
  return imageCache.get(id) || null
}

export function setCachedImageUrl(id, imageUrl) {
  if (id && imageUrl) {
    imageCache.set(id, imageUrl)
  }
}

// 2. Obtener lista liviana inicial para que la web cargue en menos de 0.5s
export async function fetchAllPerfumesLight() {
  try {
    const fields = 'id,name,brand,category_id,category_name,price,available,volume,concentration,notes_top,notes_heart,notes_base,description,featured,created_at'
    const res = await fetch(`${supabaseUrl}/rest/v1/perfumes?select=${fields}&order=created_at.desc`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) {
        return data.map(normalizePerfume)
      }
    }
  } catch (err) {
    console.warn('Error cargando lista liviana de perfumes:', err)
  }
  return []
}

// 3. Carga rápida de imágenes bajo demanda (para la página actual, buscador o admin)
export async function fetchPerfumeImages(ids = []) {
  if (!ids || ids.length === 0) return {}

  const result = {}
  const missingIds = []

  ids.forEach(id => {
    if (!id) return
    if (imageCache.has(id)) {
      result[id] = imageCache.get(id)
    } else {
      missingIds.push(id)
    }
  })

  if (missingIds.length === 0) {
    return result
  }

  try {
    const filter = missingIds.map(id => '%22' + encodeURIComponent(id) + '%22').join(',')
    const url = `${supabaseUrl}/rest/v1/perfumes?select=id,image_url&id=in.(${filter})`
    const res = await fetch(url, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item && item.id) {
            const img = item.image_url || ''
            imageCache.set(item.id, img)
            result[item.id] = img
          }
        })
      }
    }
  } catch (err) {
    console.warn('Error cargando imágenes bajo demanda:', err)
  }

  return result
}

// 4. Obtener lote de perfumes para la página activa con sus imágenes
export async function fetchPerfumesPage({ ids = [] } = {}) {
  try {
    if (!ids || ids.length === 0) return []
    const imageMap = await fetchPerfumeImages(ids)
    return ids.map(id => ({ id, imageUrl: imageMap[id] || '' }))
  } catch (err) {
    console.error('Error en fetchPerfumesPage:', err)
  }
  return []
}

export async function fetchAllPerfumesFull() {
  // Desactivado para evitar descargas masivas de 20MB que saturan la red
  return []
}

export async function fetchPerfumes() {
  return fetchAllPerfumesLight()
}

export async function createCategory(categoryData) {
  const newCat = {
    id: 'cat-' + Date.now(),
    name: categoryData.name.trim(),
    slug: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    description: categoryData.description || 'Categoría exclusiva de fragancias seleccionadas.',
    icon: categoryData.icon || 'Sparkles',
    created_at: new Date().toISOString()
  }

  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').insert([newCat]).select()
      if (!error && data && data[0]) return data[0]
    } catch (e) {
      console.error('Error insertando categoría en Supabase:', e)
    }
  }

  const current = getLocalCategories()
  const updated = [...current, newCat]
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated))
  return newCat
}

export async function deleteCategory(categoryId) {
  if (supabase) {
    try {
      await supabase.from('categories').delete().eq('id', categoryId)
    } catch (e) {
      console.error('Error eliminando en Supabase:', e)
    }
  }
  const current = getLocalCategories()
  const updated = current.filter(c => c.id !== categoryId)
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated))
  return true
}

export async function createPerfume(perfumeData) {
  const id = 'perf-' + Date.now()
  const newPerf = {
    id,
    ...perfumeData,
    price: Number(perfumeData.price) || 0,
    available: perfumeData.available !== undefined ? perfumeData.available : true,
    created_at: new Date().toISOString()
  }

  if (newPerf.imageUrl) {
    setCachedImageUrl(id, newPerf.imageUrl)
  }

  if (supabase) {
    try {
      const payload = toSupabasePerfumePayload(newPerf)
      const { data, error } = await supabase.from('perfumes').insert([payload]).select()
      if (!error && data && data[0]) {
        const norm = normalizePerfume(data[0])
        if (norm.imageUrl) setCachedImageUrl(norm.id, norm.imageUrl)
        return norm
      }
    } catch (e) {
      console.error('Error insertando perfume en Supabase:', e)
    }
  }

  return newPerf
}

export async function updatePerfumePrice(perfumeId, newPrice) {
  const priceNum = Number(newPrice)
  if (supabase) {
    try {
      await supabase.from('perfumes').update({ price: priceNum }).eq('id', perfumeId)
    } catch (e) {
      console.error('Error actualizando precio en Supabase:', e)
    }
  }
  return true
}

export async function updatePerfumeAvailability(perfumeId, isAvailable) {
  if (supabase) {
    try {
      await supabase.from('perfumes').update({ available: isAvailable }).eq('id', perfumeId)
    } catch (e) {
      console.error('Error actualizando disponibilidad en Supabase:', e)
    }
  }
  return true
}

export async function updateFullPerfume(perfumeId, updatedFields) {
  if (updatedFields && updatedFields.imageUrl) {
    setCachedImageUrl(perfumeId, updatedFields.imageUrl)
  }
  if (supabase) {
    try {
      const payload = toSupabasePerfumePayload({ id: perfumeId, ...updatedFields })
      delete payload.id
      await supabase.from('perfumes').update(payload).eq('id', perfumeId)
    } catch (e) {
      console.error('Error actualizando perfume en Supabase:', e)
    }
  }
  return true
}

export async function deletePerfume(perfumeId) {
  if (supabase) {
    try {
      await supabase.from('perfumes').delete().eq('id', perfumeId)
    } catch (e) {
      console.error('Error eliminando perfume en Supabase:', e)
    }
  }
  return true
}
