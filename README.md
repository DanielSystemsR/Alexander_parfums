# 💎 EL ATELIER DEL AROMA - La Excelencia en Perfumería Multimarca

Catálogo moderno de perfumes con carrito de compras y panel administrativo oculto mediante Easter Egg, desarrollado con **React**, **Tailwind CSS**, **Supabase** y listo para despliegue en **Vercel**.

---

## ✨ Características Principales

### 🛍️ Vista de Clientes
- **Identidad de Marca**: Incorpora la herencia y monograma de **EL ATELIER DEL AROMA • LA EXCELENCIA EN PERFUMERÍA MULTIMARCA**.
- **Catálogo por Categorías**: Filtrado dinámico por familias olfativas (Amaderados, Cítricos, Florales, Gourmand, Cuero, etc.).
- **Información Detallada**: Nombre, casa/marca, precio ($ USD), estado en tiempo real (**Disponible** o **Agotado**), concentración y volumen.
- **Buscador Inteligente**: Búsqueda instantánea con 3 a 4 sugerencias en tiempo real por nombre de perfume o marca.
- **Carrito de Compras**: Selección múltiple de artículos con control de cantidad y ticket directo a WhatsApp (+58 412 7661800).
- **Filtros Avanzados**: Filtrar por solo disponibles o agotados, y ordenar por precio o destacados.
- **Modal de Detalle & Pedidos**: Muestra la pirámide olfativa y botón directo de compra vía WhatsApp.

---

### 👑 Panel Administrativo Oculto (Easter Egg)
El panel administrativo no está visible a simple vista para los clientes:
- **Cómo Activar el Easter Egg**:
  1. **Opción 1 (Clics rápidos)**: Haz clic **5 veces seguidas** en el logotipo / monograma dorado en la barra superior (acceso silencioso sin contador público).
  2. **Opción 2 (Atajo de teclado)**: Presiona <kbd>Ctrl + Shift + A</kbd> en cualquier momento.
  3. **Opción 3 (Bóveda en Footer)**: Haz clic en el discreto icono de candado **"Vault"** en el pie de página.

---

### ⚙️ Funciones del Administrador
- **Catálogo Resumido**: Métricas de inventario (total perfumes, disponibles, agotados, número de categorías y valor total acumulado).
- **Edición Rápida de Precios**: Edita el precio de cualquier perfume directamente con guardado en 1 clic.
- **Toggle Instantáneo de Disponibilidad**: Alterna el estado entre **Disponible** y **Agotado** con un solo clic.
- **Ingreso de Nuevos Perfumes**: Formulario completo para registrar nombre, marca, categoría, precio, notas de salida/corazón/fondo, descripción y fotografía con previsualizador.
- **Gestión de Categorías**: Crea nuevas categorías y asígnalas a los perfumes.
- **Asistente Supabase & SQL**: Copia el script SQL con 1 clic para configurar la base de datos en Supabase.

---

## 🚀 Cómo Ejecutar Localmente

1. Instalar dependencias (ya configuradas):
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir en el navegador:
   ```
   http://localhost:5173
   ```

---

## 🗄️ Conexión con Supabase (Opcional)

La aplicación funciona de forma inmediata sin configuración previa gracias a su capa de persistencia reactiva. Para conectar tu base de datos en vivo de Supabase:

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ve al **SQL Editor** y ejecuta el script provisto en la pestaña *Supabase & SQL* del Panel Administrativo.
3. Copia tus credenciales en el archivo `.env`:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-public-key
   ```

---

## 🌐 Despliegue en Vercel

1. Sube tu código a GitHub o importa la carpeta directamente en [Vercel](https://vercel.com).
2. El archivo `vercel.json` incluido gestiona automáticamente las rutas SPA.
3. Agrega las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en la sección *Environment Variables* de Vercel si deseas usar Supabase en producción.
