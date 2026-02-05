// ============================================
// MÓDULO COMPARTIDO - Carga de data.json
// ============================================

// Caché global de data.json
let dataCache = null;
let dataPromise = null;

/**
 * Carga data.json una sola vez y lo cachea
 * @returns {Promise<Object>} Los datos de data.json
 */
export async function loadData() {
  // Si ya está en caché, devolverlo inmediatamente
  if (dataCache) {
    return dataCache;
  }
  
  // Si ya hay una petición en curso, reutilizarla
  if (dataPromise) {
    return dataPromise;
  }
  
  // Hacer la petición y cachearla
  dataPromise = fetch('./data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al cargar data.json');
      }
      return response.json();
    })
    .then((data) => {
      dataCache = data;
      console.log('✅ data.json cargado y cacheado');
      return data;
    })
    .catch((error) => {
      console.error('❌ Error cargando data.json:', error);
      dataPromise = null; // Resetear para permitir reintentos
      throw error;
    });
  
  return dataPromise;
}

/**
 * Obtiene una sección específica de data.json
 * @param {string} seccion - Nombre de la sección (arriba, abajo, izquierda, derecha)
 * @returns {Promise<Object>} Los datos de la sección
 */
export async function getSeccion(seccion) {
  const data = await loadData();
  
  if (!data[seccion]) {
    console.warn(`⚠️ No se encontró la sección '${seccion}' en data.json`);
    return null;
  }
  
  return data[seccion];
}

/**
 * Limpia el caché (útil para testing o recargas)
 */
export function clearCache() {
  dataCache = null;
  dataPromise = null;
  console.log('🗑️ Caché de data.json limpiado');
}

// Exportar el caché para compatibilidad
export { dataCache };
