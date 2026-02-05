// ============================================
// SCRIPT PRINCIPAL - Sistema de Grid Navegable
// ============================================

// Referencia al contenedor principal
const app = document.getElementById("content");

// ============================================
// PRELOAD DE DATOS
// ============================================

// Caché global del feed de Substack
let feedCache = null;
let feedPromise = null;

/**
 * Precarga el feed de Substack al inicio para carga instantánea
 */
function preloadFeed() {
  if (feedPromise) return feedPromise;
  
  feedPromise = fetch("feed.json")
    .then((r) => {
      if (!r.ok) throw new Error("Error al cargar feed.json");
      return r.json();
    })
    .then((feed) => {
      feedCache = feed;
      console.log("✅ Feed precargado:", feed.items?.length || 0, "posts");
      return feed;
    })
    .catch((err) => {
      console.error("❌ Error precargando feed:", err);
      return null;
    });
  
  return feedPromise;
}

// ============================================
// CONFIGURACIÓN DEL GRID
// ============================================

// Definimos la cuadrícula (1 = pantalla activa, 0 = hueco)
// Puedes cambiar esta estructura para crear diferentes layouts
const grid = [
  [0, 1, 0],
  [1, 1, 1],
  [0, 1, 0],
  [0, 1, 0],
];

// Mapa de coordenadas → nombre de archivo (sin extensión)
// Cada celda activa (1) puede tener un nombre especial
const nombresEspeciales = {
  "0_1": "arriba",
  "1_0": "izquierda",
  "1_1": "centro",
  "1_2": "derecha",
  "2_1": "abajo",
  "3_1": "abajo_abajo",
};

// Posición inicial del usuario en el grid
let posY = 1;
let posX = 1;

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Limpia el contenido extra de Substack (suscripciones, etc.)
 */
function limpiarSubstackExtras(html) {
  return html.replace(/<p>Thanks for reading![\s\S]*?<\/form><\/p>/gi, "");
}

/**
 * Convierte texto plano en HTML con párrafos y títulos
 */
function htmlConParrafosYTitulos(texto) {
  // Si ya hay <p> devolvemos tal cual
  if (/<p>/i.test(texto)) return texto;

  // Buscamos líneas que sean títulos
  return texto
    .split(/\n{2,}/)
    .map((p) => {
      const tituloRegex = /^[A-ZÁÉÍÓÚÜ][\w\s-]+$/;
      let lineas = p.split("\n").map((linea) => {
        if (tituloRegex.test(linea.trim())) {
          return `<h4>${linea.trim()}</h4>`;
        } else {
          return linea.trim();
        }
      });
      return `<p>${lineas.join('<div class="break"></div>')}</p>`;
    })
    .join("");
}

// ============================================
// SISTEMA DE GRID
// ============================================

/**
 * Crea todas las pantallas del grid según la configuración
 */
function crearPantallas() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 1) {
        // Crear celda
        const celda = document.createElement("div");
        celda.classList.add("celda", `pos_${y}_${x}`);
        celda.dataset.y = y;
        celda.dataset.x = x;

        // Crear wrapper para contenido
        const wrapper = document.createElement("div");
        wrapper.classList.add("contenido");
        celda.appendChild(wrapper);
        app.appendChild(celda);

        // Cargar contenido si tiene nombre especial
        const clave = `${y}_${x}`;
        const nombre = nombresEspeciales[clave];
        if (nombre) {
          celda.classList.add(nombre);
          cargarContenido(wrapper, `paginas/${nombre}.html`);
        }
      }
    }
  }
}

/**
 * Carga el contenido HTML de una celda y ejecuta scripts específicos
 */
function cargarContenido(wrapper, archivo) {
  fetch(archivo)
    .then((response) => {
      if (!response.ok) throw new Error("Error HTTP: " + response.status);
      return response.text();
    })
    .then((html) => {
      wrapper.innerHTML = html;

      // Ejecutar inicializaciones específicas por sección
      inicializarSeccion(archivo, wrapper);
    })
    .catch((err) => {
      wrapper.innerHTML = `<p>No pude cargar ${archivo}</p>`;
      console.error(err);
    });
}

/**
 * Inicializa scripts específicos según la sección cargada
 */
function inicializarSeccion(archivo, wrapper) {
  // SECCIÓN IZQUIERDA: Feed de Substack + texto introductorio
  if (archivo.endsWith("izquierda.html")) {
    import("./script/izquierda.js")
      .then((mod) => {
        setTimeout(() => {
          mod.generarVistaIzquierda();
        }, 50);
      })
      .catch((err) => console.error("Error al cargar izquierda.js:", err));

    const cont = wrapper.querySelector(".lista_libros");
    const contIndice = wrapper
      .closest(".celda")
      ?.parentElement.querySelector(".izq_2 .indice_libros");

    if (cont) {
      cont.innerHTML = '<div class="spinner"></div>';
      
      // Usar feed precargado o cargarlo si no está disponible
      const feedPromise = feedCache ? Promise.resolve(feedCache) : preloadFeed();
      
      feedPromise.then((feed) => {
        if (!feed || !feed.items) {
          cont.innerHTML = "<p>No hay posts para mostrar.</p>";
          return;
        }
        const items = feed.items;

        // Lazy rendering: renderizar solo los primeros 3 posts inicialmente
        const POSTS_INICIALES = 3;
        let postsRenderizados = 0;
        
        /**
         * Renderiza un post individual
         */
        function renderPost(post, i) {
          return `
            <div class="post" id="post-${i}">
              <h2><a href="${post.link}" target="_blank">${post.title}</a></h2>
              <p><em class="post_date">${new Date(post.pubDate).toLocaleDateString()}</em></p>
              <div class="post_content">
                ${limpiarSubstackExtras(post["content:encoded"] || post["content:encodedSnippet"] || "")}
              </div>
            </div>
          `;
        }
        
        /**
         * Renderiza más posts (lazy loading)
         */
        function renderizarMasPosts() {
          const postsACargar = Math.min(3, items.length - postsRenderizados);
          if (postsACargar === 0) return;
          
          const fragment = document.createDocumentFragment();
          const tempDiv = document.createElement('div');
          
          for (let i = 0; i < postsACargar; i++) {
            const index = postsRenderizados + i;
            tempDiv.innerHTML = renderPost(items[index], index);
            fragment.appendChild(tempDiv.firstElementChild);
          }
          
          cont.appendChild(fragment);
          postsRenderizados += postsACargar;
          
          console.log(`✅ Renderizados ${postsRenderizados}/${items.length} posts`);
        }
        
        // Renderizar posts iniciales
        cont.innerHTML = '';
        postsRenderizados = 0;
        renderizarMasPosts();

        // Generar índice completo (todos los posts)
        if (contIndice) {
          contIndice.innerHTML = `
            <ul>
              ${items.map((post, i) => `<li><a href="#post-${i}">${post.title}</a></li>`).join("")}
            </ul>
          `;
        }
        
        // Lazy loading: cargar más posts al hacer scroll
        let scrollTimeout;
        cont.addEventListener('scroll', () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            const scrollBottom = cont.scrollHeight - cont.scrollTop - cont.clientHeight;
            
            // Si está cerca del final (menos de 300px), cargar más
            if (scrollBottom < 300 && postsRenderizados < items.length) {
              renderizarMasPosts();
            }
          }, 100);
        });
      }).catch((err) => {
        console.error("Error al cargar feed:", err);
        cont.innerHTML = "<p>Error al cargar posts :(</p>";
      });
    }
  }

  // SECCIÓN ABAJO: Carrusel de discos
  if (archivo.endsWith("abajo.html")) {
    import("./script/carrusel.js")
      .then((mod) => {
        setTimeout(() => {
          mod.initCarousel();
          actualizarVista();
        }, 50);
      })
      .catch((err) => console.error("Error al cargar carrusel.js:", err));
  }

  // SECCIÓN ARRIBA: Timeline de eventos
  if (archivo.endsWith("arriba.html")) {
    import("./script/arriba.js")
      .then((mod) => {
        setTimeout(() => {
          mod.generarVistaArriba();
          actualizarVista();
        }, 50);
      })
      .catch((err) => console.error("Error al cargar arriba.js:", err));
  }

  // SECCIÓN DERECHA: Información de servicios
  if (archivo.endsWith("derecha.html")) {
    import("./script/derecha.js")
      .then((mod) => {
        setTimeout(() => {
          mod.generarVistaDerecha();
          actualizarVista();
        }, 50);
      })
      .catch((err) => console.error("Error al cargar derecha.js:", err));
  }
}

// ============================================
// SISTEMA DE NAVEGACIÓN
// ============================================

/**
 * Actualiza la vista mostrando solo la celda activa
 */
function actualizarVista() {
  // Ocultar todas las celdas
  const todas = document.querySelectorAll(".celda");
  todas.forEach(celda => celda.classList.remove("activa"));

  // Mostrar celda activa
  const selector = `.pos_${posY}_${posX}`;
  const activa = document.querySelector(selector);

  if (activa) {
    activa.classList.add("activa");

    // Actualizar theme-color del navegador
    actualizarThemeColor(activa);

    // Crear botones de navegación
    crearBotonesNavegacion(activa);
  }
}

/**
 * Actualiza el color del tema del navegador
 */
function actualizarThemeColor(celda) {
  let themeColor;

  // Si es la celda .abajo, usar el color del disco actual
  if (celda.classList.contains("abajo") && window.discs && window.discs.length > 0) {
    themeColor = window.discs[0].bgColor;
  } else {
    // Para el resto, usar --theme-color del CSS
    themeColor = getComputedStyle(celda).getPropertyValue("--theme-color").trim();
  }

  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", themeColor);
}

/**
 * Crea los botones de navegación según las celdas disponibles
 */
function crearBotonesNavegacion(celda) {
  // Eliminar botones anteriores
  celda.querySelectorAll(".boton-nav").forEach(btn => btn.remove());

  // Direcciones posibles
  const direcciones = [
    { dy: -1, dx: 0, clase: "btn_arriba", label: "arriba" },
    { dy: 1, dx: 0, clase: "btn_abajo", label: "abajo" },
    { dy: 0, dx: -1, clase: "btn_izquierda", label: "izquierda" },
    { dy: 0, dx: 1, clase: "btn_derecha", label: "derecha" },
  ];

  // Crear botones solo para direcciones válidas
  direcciones.forEach((dir) => {
    const nuevaY = posY + dir.dy;
    const nuevaX = posX + dir.dx;

    // Verificar si la celda destino existe y está activa
    if (grid[nuevaY] && grid[nuevaY][nuevaX] === 1) {
      const boton = document.createElement("button");
      boton.classList.add("boton-nav", dir.clase);
      boton.textContent = dir.label;

      boton.onclick = () => {
        posY = nuevaY;
        posX = nuevaX;
        actualizarVista();
      };

      celda.appendChild(boton);
    }
  });
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Precargar feed de Substack en background
preloadFeed();

crearPantallas();
actualizarVista();
