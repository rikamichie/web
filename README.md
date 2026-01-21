# Rikamichie - Sistema de Grid Navegable

Sistema de navegación web basado en grids configurables con contenido editable mediante JSON.

## 🎯 Características

- **Grid flexible**: Define cualquier layout mediante una matriz bidimensional
- **Navegación intuitiva**: Botones direccionales que se generan automáticamente
- **Contenido editable**: Todo el contenido se gestiona desde `data.json`
- **Modular**: Cada sección tiene su propio script y puede funcionar independientemente
- **Responsive**: Se adapta a diferentes tamaños de pantalla

## 📁 Estructura del proyecto

```
rikamichie/
├── data.json              # Configuración de todo el contenido editable
├── index.html             # Punto de entrada
├── script.js              # Sistema principal de grid y navegación
├── style.css              # Estilos globales y por sección
├── paginas/               # HTML de cada sección
│   ├── arriba.html
│   ├── centro.html
│   ├── izquierda.html
│   ├── derecha.html
│   ├── abajo.html
│   └── abajo_abajo.html
├── script/                # Scripts modulares por sección
│   ├── arriba.js         # Timeline de eventos
│   ├── izquierda.js      # Texto introductorio
│   ├── derecha.js        # Información de servicios
│   └── carrusel.js       # Carrusel de discos
└── img/                   # Imágenes del proyecto
```

## 🎨 Configuración del Grid

El grid se define en `script.js` mediante una matriz:

```javascript
const grid = [
  [0, 1, 0],  // Fila 0: solo la celda central activa
  [1, 1, 1],  // Fila 1: todas las celdas activas (cruz)
  [0, 1, 0],  // Fila 2: solo la celda central activa
  [0, 1, 0],  // Fila 3: solo la celda central activa
];
```

- `1` = celda activa (navegable)
- `0` = celda vacía (no navegable)

### Ejemplos de layouts alternativos

#### Grid circular 5x5

```javascript
const grid = [
  [0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 1, 0],
  [0, 0, 1, 0, 0],
];
```

#### Grid en L

```javascript
const grid = [
  [1, 0, 0],
  [1, 0, 0],
  [1, 1, 1],
];
```

#### Grid diagonal

```javascript
const grid = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];
```

## 📝 Configuración del contenido (data.json)

Todo el contenido editable está centralizado en `data.json`:

### Estructura general

```json
{
  "arriba": { ... },      // Timeline de eventos
  "abajo": { ... },       // Carrusel de discos
  "derecha": { ... },     // Información de servicios
  "izquierda": { ... }    // Texto introductorio
}
```

### Sección ARRIBA: Timeline de eventos

```json
"arriba": {
  "links": [
    {
      "titulo": "Nombre del evento",
      "link": "https://url-del-evento.com",
      "fecha": "2024-10"
    }
  ]
}
```

### Sección ABAJO: Carrusel de discos

```json
"abajo": {
  "discos": [
    {
      "image": "./img/disco1.jpg",
      "caption": "Título del disco",
      "bgColor": "#000",
      "btnColor": "#f00",
      "link": "https://enlace-al-disco.com"
    }
  ]
}
```

### Sección DERECHA: Información de servicios

```json
"derecha": {
  "imagen": {
    "url": "img/derecha.jpg",
    "alt": "Descripción de la imagen"
  },
  "colores": {
    "themeColor": "crimson",
    "btnColor": "crimson",
    "textoColor": "white",
    "fondoTexto": "crimson"
  },
  "contenido": {
    "linkPrincipal": {
      "texto": "masajes",
      "url": "https://www.instagram.com/..."
    },
    "tipos": ["tipo1", "tipo2", "tipo3"],
    "precio": "44€/h"
  }
}
```

### Sección IZQUIERDA: Texto introductorio

```json
"izquierda": {
  "texto": {
    "parrafo1": "Primer párrafo de texto",
    "parrafo2": "Segundo párrafo con <a href='...'>enlaces</a>"
  },
  "colores": {
    "bgColor": "black",
    "textColor": "Gainsboro",
    "themeColor": "black",
    "text2Color": "red",
    "btnColor": "red"
  }
}
```

## 🔧 Cómo añadir una nueva celda

1. **Actualizar el grid** en `script.js`:
   ```javascript
   const grid = [
     [0, 1, 0],
     [1, 1, 1],
     [0, 1, 1],  // Nueva fila con celda adicional
   ];
   ```

2. **Asignar nombre** a la nueva celda:
   ```javascript
   const nombresEspeciales = {
     "0_1": "arriba",
     "1_0": "izquierda",
     "1_1": "centro",
     "1_2": "derecha",
     "2_1": "abajo",
     "2_2": "nueva_seccion",  // Nueva celda
   };
   ```

3. **Crear HTML** en `paginas/nueva_seccion.html`

4. **Crear script** (opcional) en `script/nueva_seccion.js`

5. **Añadir estilos** en `style.css`:
   ```css
   .celda.nueva_seccion {
     --bg-color: #fff;
     --text-color: #000;
     --btn-color: #000;
   }
   ```

6. **Añadir datos** en `data.json`:
   ```json
   "nueva_seccion": {
     "contenido": "..."
   }
   ```

## 🚀 Uso

1. Clona el repositorio
2. Edita `data.json` con tu contenido
3. Personaliza el grid en `script.js` si quieres cambiar el layout
4. Abre `index.html` en tu navegador

## 🎨 Personalización de estilos

Cada celda puede tener sus propias variables CSS:

```css
.celda.nombre_seccion {
  --bg-color: #ffffff;      /* Color de fondo */
  --text-color: #000000;    /* Color del texto */
  --btn-color: #ff0000;     /* Color de botones */
  --theme-color: #ff0000;   /* Color del tema del navegador */
}
```

## 📱 Responsive

El sistema usa unidades `dvw` y `dvh` para adaptarse a diferentes pantallas. Los tamaños de fuente usan `clamp()` para escalar automáticamente.

## 🔄 Sistema de navegación

- Los botones de navegación se generan automáticamente según las celdas disponibles
- Solo aparecen botones para direcciones válidas (celdas con valor `1` en el grid)
- La navegación es fluida con transiciones CSS

## 💡 Tips

- Mantén el grid simple para facilitar la navegación
- Usa nombres descriptivos en `nombresEspeciales`
- Agrupa contenido relacionado en secciones cercanas
- Prueba diferentes layouts para encontrar el que mejor se adapte a tu contenido

## 📄 Licencia

Este proyecto es de código abierto. Úsalo y modifícalo como quieras.
