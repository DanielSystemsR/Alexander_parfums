import { createClient } from '@supabase/supabase-js'

// Variables de entorno para Supabase (opcionales al inicio, fallback a LocalStorage)
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('aura_supabase_url') || '').trim()
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('aura_supabase_key') || '').trim()

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
export const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Amaderados & Orientales', slug: 'amaderados-orientales', description: 'Notas profundas de cedro, oud, sándalo y ámbar cálido.', icon: 'TreePine' },
  { id: 'cat-2', name: 'Cítricos & Frescos', slug: 'citricos-frescos', description: 'Explosión de bergamota, mandarina italiana y notas marinas.', icon: 'Citrus' },
  { id: 'cat-3', name: 'Florales & Frutales', slug: 'florales-frutales', description: 'Rosas de Grasse, jazmín sambac y acordes dulces aterciopelados.', icon: 'Flower2' },
  { id: 'cat-4', name: 'Gourmand & Especiados', slug: 'gourmand-especiados', description: 'Vainilla Bourbon, canela, café negro y haba tonka seductora.', icon: 'Sparkles' },
  { id: 'cat-5', name: 'Cuero & Tabaco Nicho', slug: 'cuero-tabaco-nicho', description: 'Carácter imponente de hojas de tabaco rubio, humo y cuero artesanal.', icon: 'Flame' },
]

// Perfumes iniciales por defecto con imágenes de alta calidad
export const DEFAULT_PERFUMES = [
  {
    id: 'perf-1',
    name: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
    categoryId: 'cat-4',
    categoryName: 'Gourmand & Especiados',
    price: 365,
    available: true,
    volume: '70 ml',
    concentration: 'Extrait de Parfum',
    notesTop: 'Jazmín Grandiflorum, Azafrán',
    notesHeart: 'Almendra amarga de Marruecos, Madera de cedro',
    notesBase: 'Acorde ambarino amaderado, Ámbar gris',
    description: 'Una fragancia luminosa y densa, transparente e intensa. La poesía de un elixir con acordes minerales y florales.',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'perf-2',
    name: 'Aventus',
    brand: 'Creed',
    categoryId: 'cat-2',
    categoryName: 'Cítricos & Frescos',
    price: 435,
    available: true,
    volume: '100 ml',
    concentration: 'Eau de Parfum',
    notesTop: 'Piña, Bergamota, Manzana, Grosellas negras',
    notesHeart: 'Abedul, Pachulí, Jazmín de Marruecos, Rosa',
    notesBase: 'Almizcle, Musgo de roble, Ámbar gris, Vainilla',
    description: 'Inspirado en la vida de un emperador histórico, celebra la fuerza, el poder y el éxito con acordes ahumados y afrutados.',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'perf-3',
    name: 'Tobacco Vanille',
    brand: 'Tom Ford',
    categoryId: 'cat-5',
    categoryName: 'Cuero & Tabaco Nicho',
    price: 395,
    available: true,
    volume: '100 ml',
    concentration: 'Eau de Parfum',
    notesTop: 'Hojas de tabaco, Notas especiadas',
    notesHeart: 'Haba tonka, Flor de tabaco, Vainilla, Cacao',
    notesBase: 'Frutos secos, Savia de madera',
    description: 'Opulento, cálido e icónico. Una reinterpretación moderna de un clásico club de caballeros inglés.',
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'perf-4',
    name: 'Sauvage Elixir',
    brand: 'Dior',
    categoryId: 'cat-1',
    categoryName: 'Amaderados & Orientales',
    price: 240,
    available: true,
    volume: '60 ml',
    concentration: 'Elixir',
    notesTop: 'Canela, Nuez moscada, Cardamomo, Pomelo',
    notesHeart: 'Lavanda de Nyons',
    notesBase: 'Regaliz, Sándalo, Ámbar, Pachulí, Vetiver de Haití',
    description: 'Un perfume extraordinariamente concentrado impregnado de la icónica frescura de Sauvage con un corazón embriagador de especias.',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'perf-5',
    name: 'Libre Intense',
    brand: 'Yves Saint Laurent',
    categoryId: 'cat-3',
    categoryName: 'Florales & Frutales',
    price: 185,
    available: false,
    volume: '90 ml',
    concentration: 'Eau de Parfum',
    notesTop: 'Lavanda francesa, Mandarina, Bergamota',
    notesHeart: 'Lavanda, Flor de azahar de Marruecos, Orquídea viva, Jazmín sambac',
    notesBase: 'Vainilla de Madagascar, Haba tonka, Ámbar gris, Vetiver',
    description: 'La fragancia de una mujer libre e instintiva. Una tensión ardiente entre la lavanda francesa y la sensual flor de azahar.',
    imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'perf-6',
    name: 'Oud Wood',
    brand: 'Tom Ford',
    categoryId: 'cat-1',
    categoryName: 'Amaderados & Orientales',
    price: 390,
    available: true,
    volume: '100 ml',
    concentration: 'Eau de Parfum',
    notesTop: 'Palo de rosa, Cardamomo, Pimienta de Sichuan',
    notesHeart: 'Madera de oud (agar), Sándalo, Vetiver',
    notesBase: 'Haba tonka, Vainilla, Ámbar',
    description: 'Uno de los ingredientes más raros, preciosos y caros del arsenal de un perfumista. Exótico, ahumado y distintivo.',
    imageUrl: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'perf-7',
    name: 'N°5 Le Lion',
    brand: 'Chanel',
    categoryId: 'cat-1',
    categoryName: 'Amaderados & Orientales',
    price: 310,
    available: false,
    volume: '75 ml',
    concentration: 'Eau de Parfum',
    notesTop: 'Bergamota, Limón chispeante',
    notesHeart: 'Ládano, Ámbar resinoso',
    notesBase: 'Vainilla de Madagascar, Sándalo, Pachulí',
    description: 'Un homenaje al espíritu ardiente y majestuoso de Gabrielle Chanel, protegido bajo la constelación del león.',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'perf-8',
    name: 'Angels Share',
    brand: 'Kilian Paris',
    categoryId: 'cat-4',
    categoryName: 'Gourmand & Especiados',
    price: 330,
    available: true,
    volume: '50 ml',
    concentration: 'Eau de Parfum',
    notesTop: 'Coñac añejo',
    notesHeart: 'Canela, Haba tonka, Roble noble',
    notesBase: 'Praliné, Vainilla cremosa, Sándalo',
    description: 'Inspirado en la herencia familiar del coñac de Hennessy, un elixir goloso que evoca las barricas más nobles.',
    imageUrl: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'perf-9',
    name: 'Bleu de Chanel Parfum',
    brand: 'Chanel',
    categoryId: 'cat-2',
    categoryName: 'Cítricos & Frescos',
    price: 215,
    available: true,
    volume: '100 ml',
    concentration: 'Parfum',
    notesTop: 'Cáscara de limón, Bergamota, Menta, Artemisia',
    notesHeart: 'Lavanda, Geranio, Piña, Notas verdes',
    notesBase: 'Sándalo de Nueva Caledonia, Cedro, Amberwood, Iso E Super',
    description: 'Elegancia pura y atemporal. Un aroma aromático amaderado que revela una determinación inquebrantable.',
    imageUrl: 'https://images.unsplash.com/photo-1527632984437-01050d1f3040?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 'perf-10',
    name: 'Tuscan Leather',
    brand: 'Tom Ford',
    categoryId: 'cat-5',
    categoryName: 'Cuero & Tabaco Nicho',
    price: 410,
    available: true,
    volume: '100 ml',
    concentration: 'Eau de Parfum',
    notesTop: 'Frambuesa, Azafrán, Tomillo',
    notesHeart: 'Incienso (olíbano), Jazmín nocturno',
    notesBase: 'Cuero primario, Gamuza negra, Ámbar, Notas amaderadas',
    description: 'Una visión cruda pero refinada del cuero curtido toscano con el dulce contraste de la frambuesa silvestre.',
    imageUrl: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
    featured: false
  }
]

// Capa de Almacenamiento Local (Fallback inteligente)
const STORAGE_KEYS = {
  PERFUMES: 'aura_perfumes_v1',
  CATEGORIES: 'aura_categories_v1'
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
      console.warn('Fallback a almacenamiento local para categorías', e)
    }
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
      console.warn('Fallback a almacenamiento local para perfumes', e)
    }
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
