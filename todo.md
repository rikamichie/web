# 📋 TODO - rikamichie

Lista de tareas pendientes para mejorar y completar el proyecto.

---

## 🔴 Crítico / Importante

### SEO y Marketing

- [ ] **Google Search Console**
  - Registrar el sitio en https://search.google.com/search-console
  - Subir el sitemap.xml (`https://meowrhino.github.io/rikamichie/sitemap.xml`)
  - Verificar la propiedad del sitio
  - Monitorear errores de indexación

- [ ] **Google My Business**
  - Crear perfil en https://business.google.com
  - Añadir ubicación: Carrer Poeta Cabanyes, Barcelona
  - Subir fotos del espacio
  - Añadir horarios de atención
  - Vincular con el sitio web
  - **Beneficio:** Aparecer en Google Maps y búsquedas locales

- [ ] **Google Analytics**
  - Crear cuenta en https://analytics.google.com
  - Obtener código de tracking (gtag.js)
  - Añadir al `<head>` de index.html
  - Configurar objetivos (clics en email, Instagram, etc.)
  - **Beneficio:** Saber cuánta gente visita la web y de dónde viene

### Structured Data (Schema.org)

- [ ] **Añadir JSON-LD para LocalBusiness**
  - Completar con datos reales:
    - Teléfono de contacto
    - Horarios de atención
    - Coordenadas GPS (latitud/longitud)
    - Dirección completa
    - Rango de precios
  - Validar en https://search.google.com/test/rich-results
  - **Beneficio:** Aparecer en resultados enriquecidos de Google

---

## 🟡 Medio / Recomendado

### Seguridad y Validación

- [ ] **Validación del feed JSON**
  - Modificar `.github/workflows/update-feed.yml`
  - Añadir validación antes de hacer commit
  - Evitar que se corrompa el feed si hay errores
  - **Archivo:** `.github/workflows/update-feed.yml`

- [ ] **Sanitización de HTML**
  - Añadir librería DOMPurify
  - Sanitizar contenido antes de insertarlo en el DOM
  - Proteger contra ataques XSS
  - **Archivos afectados:** `script/arriba.js`, `script/izquierda.js`

### Funcionalidad

- [ ] **Reordenamiento por fecha en arriba.js**
  - Decidir si mantener, quitar o hacer opcional
  - Actualmente ordena por fecha pero puede no ser necesario
  - **Archivo:** `script/arriba.js`

- [ ] **Formulario de contacto**
  - Añadir formulario para consultas
  - Integrar con servicio de email (Formspree, EmailJS, etc.)
  - **Beneficio:** Facilitar el contacto sin revelar el email directamente

---

## 🟢 Bajo / Opcional

### Performance

- [ ] **Imágenes en formato WebP**
  - Convertir todas las imágenes a WebP
  - Mantener fallback a JPG/PNG
  - **Beneficio:** Carga más rápida

- [ ] **Lazy loading para el carrusel**
  - Cargar imágenes del carrusel solo cuando se necesiten
  - **Archivo:** `script/abajo.js`

- [ ] **Minificación de CSS y JS**
  - Crear versiones minificadas para producción
  - Configurar build process
  - **Beneficio:** Menor tamaño de archivos

### Contenido

- [ ] **Página "Sobre mí"**
  - Añadir información sobre Erika
  - Formación, experiencia, filosofía
  - **Beneficio:** Generar confianza y mejorar SEO

- [ ] **FAQ (Preguntas frecuentes)**
  - ¿Qué tipo de masaje necesito?
  - ¿Cuánto dura una sesión?
  - ¿Qué debo llevar?
  - ¿Cómo reservar?
  - **Beneficio:** Reducir consultas repetitivas y mejorar SEO

- [ ] **Testimonios / Reseñas**
  - Añadir sección con opiniones de clientes
  - Integrar con Google Reviews
  - **Beneficio:** Generar confianza

### Accesibilidad

- [ ] **Modo oscuro**
  - Detectar preferencia del sistema
  - Ajustar colores para modo oscuro
  - **Beneficio:** Mejor experiencia en diferentes condiciones

- [ ] **Internacionalización (i18n)**
  - Añadir versión en catalán
  - Añadir versión en inglés
  - **Beneficio:** Alcanzar más público

---

## 🔧 Técnico / Mantenimiento

### Testing

- [ ] **Tests automatizados**
  - Configurar Jest o similar
  - Tests unitarios para funciones
  - Tests de integración
  - **Beneficio:** Detectar errores antes de deploy

- [ ] **Validación HTML/CSS**
  - Pasar por validador W3C
  - Corregir warnings restantes
  - **Herramientas:** https://validator.w3.org/

### Documentación

- [ ] **README.md completo**
  - Instrucciones de instalación
  - Cómo editar data.json
  - Cómo añadir nuevos discos
  - Cómo actualizar precios
  - **Beneficio:** Facilitar el mantenimiento

- [ ] **Guía de estilo**
  - Documentar colores, tipografías, espaciados
  - Facilitar futuras modificaciones
  - **Archivo:** `docs/style-guide.md`

---

## 🎨 Diseño / UX

### Mejoras visuales

- [ ] **Animaciones en hover**
  - Añadir más micro-interacciones
  - Mejorar feedback visual
  - **Beneficio:** Experiencia más agradable

- [ ] **Transiciones entre secciones**
  - Smooth scroll entre celdas del grid
  - Animaciones de entrada
  - **Beneficio:** Navegación más fluida

- [ ] **Loading state**
  - Mostrar indicador mientras carga el feed
  - Skeleton screens
  - **Beneficio:** Mejor percepción de velocidad

### Responsive

- [ ] **Testing en dispositivos reales**
  - iPhone (Safari)
  - Android (Chrome)
  - Tablet
  - **Beneficio:** Asegurar compatibilidad

---

## 📱 Redes sociales

- [ ] **Botones de compartir**
  - Añadir botones para compartir en redes
  - WhatsApp, Facebook, Twitter
  - **Beneficio:** Facilitar el boca a boca

- [ ] **Instagram embed**
  - Mostrar últimas publicaciones de Instagram
  - Integrar con API de Instagram
  - **Beneficio:** Contenido dinámico

---

## 🔄 Integración con backend

- [ ] **Traspaso del scrapeador de Substack**
  - Seguir la guía en `manus/guia_migracion_scrapeador.md`
  - Migrar a nueva cuenta de GitHub
  - Migrar a nueva cuenta de Render
  - Actualizar variables de entorno
  - **Beneficio:** Autonomía completa del cliente

---

## 📊 Métricas de éxito

Una vez implementadas las tareas críticas, medir:

- [ ] Posición en Google para "masajista barcelona"
- [ ] Posición en Google para "masajes poeta cabanyes"
- [ ] Número de visitas mensuales (Google Analytics)
- [ ] Tasa de conversión (clics en email/Instagram)
- [ ] Reseñas en Google My Business

---

**Última actualización:** 22 de enero de 2026

**Prioridad de implementación:**
1. 🔴 Crítico / Importante (SEO básico)
2. 🟡 Medio / Recomendado (seguridad y funcionalidad)
3. 🟢 Bajo / Opcional (mejoras progresivas)
