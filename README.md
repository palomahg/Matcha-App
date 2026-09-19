# MatchApp 🍵

> Plataforma móvil de descubrimiento y valoración de los mejores templos y cafés de matcha en España (Madrid, Barcelona, Valencia, Sevilla, Málaga, Bilbao).

Inspirada en el universo visual y ritual de **Maison Matcha**, con una dirección de arte serena, orgánica, minimalista y cálida basada en tonos crema, avena, verde salvia y matcha profundo.

---

## 🎨 Sistema de Diseño (Design System)

### Paleta Cromática
- **Matcha Green (Primario)**: `#A8B98A` — Acentos principales, botones de confirmación, chips de tags.
- **Soft Sage (Secundario)**: `#C9D3B0` — Bordes sutiles, indicadores de carga y badges.
- **Deep Matcha (Texto & Énfasis)**: `#4F6340` — Tipografía de alto contraste (sustituye al negro puro), botones primarios y pines de mapa.
- **Cream / Oat (Fondo principal)**: `#F6F1E7` — Canvas cálido y relajante con textura orgánica.
- **Warm Beige (Superficies & Tarjetas)**: `#E9DFCB` — Tarjetas y divisores neutros.
- **Ivory White (Superficies elevadas)**: `#FFFDF8` — Fondos de tarjetas, modales y hojas flotantes.
- **Blush Accent (Acento afectivo)**: `#E8C9C0` — Favoritos activos, corazones y micro-interacciones.
- **Star Gold (Puntuaciones)**: `#D9B25F` — Estrellas doradas con precisión de medias estrellas.

### Tipografía
- **Títulos & Display**: *Playfair Display* & *Cormorant Garamond* (Serif elegante, serena y de inspiración editorial japonesa).
- **Cuerpo & UI**: *DM Sans* (Sans-serif redondeada, geométrica y con excelente legibilidad en pantallas móviles).

---

## 📱 Pantallas y Funcionalidades (10 Pantallas)

1. **Splash + Onboarding**:
   - 3 diapositivas explicativas sobre el ritual, la comunidad y el mapa.
   - Solicitud de permisos de geolocalización con selector de ciudades alternativas (Madrid, Barcelona, Valencia, Sevilla, Málaga, Bilbao).
2. **Explorar / Home**:
   - Descubrimiento por proximidad y ordenación dual (*Más cercanos* / *Mejor valorados* / *Más reseñas*).
   - Filtros: radio de distancia (1, 3, 5, 10, 50 km), valoración mínima (4.0+, 4.5+), abierto ahora, y etiquetas especializadas (ceremonial, latte, repostería, leche vegetal, pet friendly, wifi...).
   - Toggle flotante para alternar entre Vista Lista y Vista Mapa.
3. **Vista de Mapa**:
   - Mapa interactivo con mosaicos claros *CartoDB Voyager* y pines personalizados verde matcha con la valoración media visible (ej. `★ 4.8`).
   - Bottom-sheet preview interactivo al pulsar cualquier pin, con acceso directo a detalles y guardado rápido.
4. **Detalle del Spot**:
   - Galería de fotos con miniaturas interactivas.
   - Origen del matcha destacado (ej. *Uji, Kioto* o *Kagoshima*).
   - Botones rápidos para *"Cómo llegar"* (Google / Apple Maps), *"Llamar"* y *"Instagram"*.
   - Histograma de desglose de valoraciones (5 a 1 estrellas).
   - Desglose por subcategorías: Calidad de matcha, Ambiente, Relación calidad-precio y Servicio.
   - Feed de reseñas con ordenación por fecha o puntuación.
5. **Escribir / Editar Reseña**:
   - Valoración de 1 a 5 estrellas con precisión de medias estrellas (ej. 4.5★).
   - Subcategorías opcionales (Matcha, Ambiente, Precio, Servicio).
   - Campo de texto con límite de 500 caracteres y contador regresivo en vivo.
   - Selector de fotos y celebración visual con confeti orgánico.
6. **Búsqueda con Autocompletado**:
   - Búsqueda en tiempo real por nombre de cafetería, ciudad, barrio (Malasaña, Ruzafa, Gràcia...) o especialidad.
   - Chips de sugerencias automáticas.
7. **Spots Guardados**:
   - Pestañas organizadas para *"Favoritos"* (❤️) y *"Por probar"* (🔖).
8. **Perfil de Usuario & RGPD**:
   - Avatar, ciudad, nivel de usuario (*Matcha Connoisseur*), contador de reseñas y lugares guardados.
   - Descarga de datos personales en formato JSON (Derecho de Portabilidad RGPD).
   - Eliminación total de cuenta y datos asociados con un solo clic.
   - Selector de idioma en tiempo real (Español / English).
9. **Añadir Nuevo Spot**:
   - Formulario de sugerencia comunitaria (nombre, dirección, ciudad, fotos, tags, precio, Instagram).
   - Ingreso automático en cola de moderación (`status: 'pending'`).
10. **Autenticación**:
    - Inicio de sesión y registro simulado con Google, Apple o Correo electrónico, además de modo invitado.

---

## 🚀 Puesta en Marcha

### Requisitos Previos
- Node.js 18 o superior
- npm

### Instalación y Ejecución
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en puerto 3000
npm run dev

# Compilar para producción
npm run build
```

### Variables de Entorno (`.env.example`)
```env
# GEMINI_API_KEY: Inyectado automáticamente en AI Studio
GEMINI_API_KEY=

# APP_URL: URL base de la aplicación
APP_URL=
```

### Datos de Prueba (Seed Database)
La base de datos viene precargada con más de 30 spots reales o inspirados en los mejores templos de matcha de España, ubicados con coordenadas GPS exactas en:
- **Madrid**: Maison Matcha, HanSo Café, Acid Bakehouse, East Crema Coffee, Monkee Koffee, Templo Hi-Tea.
- **Barcelona**: Matcha Gracias, Usagui BCN, Syra Coffee, Dalston Coffee, Morrow Coffee.
- **Valencia**: Bluebell Coffee Co., Dulce de Leche Boutique Ruzafa, Retrogusto Coffeemates, Mayan Coffees.
- **Sevilla**: Virgin Coffee, Paradas 7 Café.
- **Málaga**: Krowji Matcha & Coffee Bar, Santa Canela.
- **Bilbao**: Cinnamon Basque Matcha, Bihotz Café.

Los datos se guardan y sincronizan automáticamente en el almacenamiento local (`localStorage`) del navegador.
