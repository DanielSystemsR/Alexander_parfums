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

// Categorías iniciales por defecto
export const DEFAULT_CATEGORIES = []


// Perfumes iniciales por defecto con imágenes de alta calidad
export const DEFAULT_PERFUMES = []


// Capa de Almacenamiento Local (Fallback inteligente)
const STORAGE_KEYS = {
  PERFUMES: 'aura_perfumes_v3',
  CATEGORIES: 'aura_categories_v3'
}

export function getLocalCategories() {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES))
    return DEFAULT_CATEGORIES
  }
  try {
    return JSON.parse(data)
  } catch (e) {
    return DEFAULT_CATEGORIES
  }
}

export function getLocalPerfumes() {
  const data = localStorage.getItem(STORAGE_KEYS.PERFUMES)
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PERFUMES, JSON.stringify(DEFAULT_PERFUMES))
    return DEFAULT_PERFUMES
  }
  try {
    return JSON.parse(data)
  } catch (e) {
    return DEFAULT_PERFUMES
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

// Data API con soporte dual y estrategia Stale-While-Revalidate (Carga instantánea)
export async function fetchCategories() {
  const localCats = getLocalCategories()
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true })
      if (!error && data && data.length > 0) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data))
        return data
      }
    } catch (e) {
      console.warn('Fallo cliente Supabase para categorías:', e)
    }
  }

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
    console.warn('Fallback a almacenamiento local para categorías:', err)
  }

  return localCats
}

export async function fetchPerfumes() {
  const localPerfs = getLocalPerfumes()
  if (supabase) {
    try {
      const { data, error } = await supabase.from('perfumes').select('*').order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        const normalized = data.map(normalizePerfume)
        localStorage.setItem(STORAGE_KEYS.PERFUMES, JSON.stringify(normalized))
        return normalized
      }
    } catch (e) {
      console.warn('Fallo cliente Supabase para perfumes:', e)
    }
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/perfumes?select=*&order=created_at.desc`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizePerfume)
        localStorage.setItem(STORAGE_KEYS.PERFUMES, JSON.stringify(normalized))
        return normalized
      }
    }
  } catch (err) {
    console.warn('Fallback a almacenamiento local para perfumes:', err)
  }

  return localPerfs
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

  if (supabase) {
    try {
      const payload = toSupabasePerfumePayload(newPerf)
      const { data, error } = await supabase.from('perfumes').insert([payload]).select()
      if (!error && data && data[0]) {
        return normalizePerfume(data[0])
      }
    } catch (e) {
      console.error('Error insertando perfume en Supabase:', e)
    }
  }

  const current = getLocalPerfumes()
  const updated = [newPerf, ...current]
  localStorage.setItem(STORAGE_KEYS.PERFUMES, JSON.stringify(updated))
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
  const current = getLocalPerfumes()
  const updated = current.map(p => p.id === perfumeId ? { ...p, price: priceNum } : p)
  localStorage.setItem(STORAGE_KEYS.PERFUMES, JSON.stringify(updated))
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
  const current = getLocalPerfumes()
  const updated = current.map(p => p.id === perfumeId ? { ...p, available: isAvailable } : p)
  localStorage.setItem(STORAGE_KEYS.PERFUMES, JSON.stringify(updated))
  return true
}

export async function updateFullPerfume(perfumeId, updatedFields) {
  if (supabase) {
    try {
      const payload = toSupabasePerfumePayload({ id: perfumeId, ...updatedFields })
      delete payload.id
      await supabase.from('perfumes').update(payload).eq('id', perfumeId)
    } catch (e) {
      console.error('Error actualizando perfume en Supabase:', e)
    }
  }
  const current = getLocalPerfumes()
  const updated = current.map(p => p.id === perfumeId ? { ...p, ...updatedFields } : p)
  localStorage.setItem(STORAGE_KEYS.PERFUMES, JSON.stringify(updated))
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
  const current = getLocalPerfumes()
  const updated = current.filter(p => p.id !== perfumeId)
  localStorage.setItem(STORAGE_KEYS.PERFUMES, JSON.stringify(updated))
  return true
}

export const SUPABASE_SQL_SCHEMA = `-- =========================================================
-- ESQUEMA SQL PARA SUPABASE - ALEXANDER MAISON DE PARFUMS
-- Copia y pega esto en: https://app.supabase.com -> Tu Proyecto -> SQL Editor -> Run
-- =========================================================

-- 1. Tabla de Categorías (Familias Olfativas)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Sparkles',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Perfumes
CREATE TABLE IF NOT EXISTS perfumes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  category_name TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  available BOOLEAN DEFAULT TRUE,
  volume TEXT DEFAULT '100 ml',
  concentration TEXT DEFAULT 'Eau de Parfum',
  notes_top TEXT,
  notes_heart TEXT,
  notes_base TEXT,
  description TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS RLS (Row Level Security)
-- Lectura pública para clientes (cualquiera puede ver el catálogo)
CREATE POLICY "Permitir lectura publica de categorias" 
  ON categories FOR SELECT USING (true);

CREATE POLICY "Permitir lectura publica de perfumes" 
  ON perfumes FOR SELECT USING (true);

-- Operaciones de administración (insertar, editar precios y borrar)
CREATE POLICY "Permitir insertar categorias" 
  ON categories FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualizar categorias" 
  ON categories FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminar categorias" 
  ON categories FOR DELETE USING (true);

CREATE POLICY "Permitir insertar perfumes" 
  ON perfumes FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualizar perfumes" 
  ON perfumes FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminar perfumes" 
  ON perfumes FOR DELETE USING (true);
`
