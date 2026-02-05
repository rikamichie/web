// Carrusel de discos - Carga configuración desde data.json

import { getSeccion } from './data.js';

let discs = [];
let currentIndex = 0;
let imgEl;
let captionEl;
let prevBtn;
let nextBtn;

// Controles para inicializaciones únicas
let listenersInitialized = false;
let observerInitialized = false;
let updateToken = 0;
const SWITCH_FADE_MS = 200;

/**
 * Precarga una imagen
 */
function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/**
 * Espera un tiempo determinado
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Inicializa el carrusel
 */
export async function initCarousel() {
  // Cargar datos si aún no están disponibles
  if (discs.length === 0) {
    const data = await getSeccion('abajo');
    if (data && data.discos) {
      discs = data.discos;
      window.discs = discs; // Mantener compatibilidad
    } else {
      console.error('No se pudieron cargar los datos del carrusel');
      return;
    }
  }

  // Referencias al DOM
  imgEl = document.getElementById("carousel-image");
  captionEl = document.getElementById("carousel-caption");
  prevBtn = document.getElementById("prev-btn");
  nextBtn = document.getElementById("next-btn");

  // Verificar que los elementos existen
  if (!imgEl || !captionEl || !prevBtn || !nextBtn) {
    console.error('Elementos del carrusel no encontrados en el DOM');
    return;
  }

  // 1) Enlazar listeners (solo una vez)
  if (!listenersInitialized) {
    // Botón anterior
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    // Botón siguiente
    nextBtn.addEventListener("click", () => {
      if (currentIndex < discs.length - 1) {
        currentIndex++;
        updateCarousel();
      }
    });

    // Click en la imagen para abrir link
    imgEl.addEventListener("click", () => {
      const disc = discs[currentIndex];
      if (disc.link) {
        window.open(disc.link, "_blank");
      }
    });

    listenersInitialized = true;
  }

  // 2) Observer para estilizar botones de navegación (.boton-nav) al crearse dinámicamente
  if (!observerInitialized) {
    const celdaAbajo = document.querySelector(".celda.abajo");
    if (celdaAbajo) {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          for (const node of mutation.addedNodes) {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.classList.contains("boton-nav")
            ) {
              node.style.color = discs[currentIndex].btnColor;
            }
          }
        }
      });
      observer.observe(celdaAbajo, { childList: true });
    }
    observerInitialized = true;
  }

  // 3) Repintar vista al (re)iniciar
  updateCarousel();

  // Aplicar color inicial del primer disco al meta theme-color
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", discs[currentIndex].bgColor);
}

/**
 * Actualiza la vista del carrusel con el disco actual
 */
async function updateCarousel() {
  const disc = discs[currentIndex];
  if (!disc) return;
  const token = ++updateToken;
  const carouselEl = imgEl?.closest(".carousel");

  if (carouselEl) {
    carouselEl.classList.add("is-switching");
  }

  await Promise.all([preloadImage(disc.image), wait(SWITCH_FADE_MS)]);
  if (token !== updateToken) return;

  // Actualizar imagen y texto
  imgEl.src = disc.image;
  captionEl.textContent = disc.caption;
  captionEl.style.color = disc.btnColor;

  // Actualizar fondo de la celda "abajo"
  const celdaAbajo = document.querySelector(".celda.abajo");
  if (celdaAbajo) {
    celdaAbajo.style.backgroundColor = disc.bgColor;
    
    // Actualizar la barra superior en iOS/Android
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", disc.bgColor);

    // Estilizar botones de navegación existentes
    celdaAbajo.querySelectorAll(".boton-nav").forEach((btn) => {
      btn.style.color = disc.btnColor;
    });
  }

  // Actualizar colores de los botones del carrusel
  prevBtn.style.color = disc.btnColor;
  nextBtn.style.color = disc.btnColor;

  // Desactivar botones en los extremos
  prevBtn.classList.toggle("desactivado", currentIndex === 0);
  nextBtn.classList.toggle("desactivado", currentIndex === discs.length - 1);

  if (carouselEl) {
    requestAnimationFrame(() => {
      if (token === updateToken) {
        carouselEl.classList.remove("is-switching");
      }
    });
  }
}

// Exportar para compatibilidad
export { discs };
