# Ejemplos de Grids Alternativos

Este documento contiene ejemplos de diferentes configuraciones de grid que puedes usar en tu proyecto.

## 🎯 Grid actual (Cruz)

```javascript
const grid = [
  [0, 1, 0],
  [1, 1, 1],
  [0, 1, 0],
  [0, 1, 0],
];

const nombresEspeciales = {
  "0_1": "arriba",
  "1_0": "izquierda",
  "1_1": "centro",
  "1_2": "derecha",
  "2_1": "abajo",
  "3_1": "abajo_abajo",
};
```

**Visualización:**
```
    ⬜
⬜ ⬜ ⬜
    ⬜
    ⬜
```

---

## 🔵 Grid circular 5x5

```javascript
const grid = [
  [0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 1, 0],
  [0, 0, 1, 0, 0],
];

const nombresEspeciales = {
  "0_2": "arriba",
  "1_1": "arriba_izq",
  "1_2": "arriba_centro",
  "1_3": "arriba_der",
  "2_0": "izquierda",
  "2_1": "centro_izq",
  "2_2": "centro",
  "2_3": "centro_der",
  "2_4": "derecha",
  "3_1": "abajo_izq",
  "3_2": "abajo_centro",
  "3_3": "abajo_der",
  "4_2": "abajo",
};
```

**Visualización:**
```
        ⬜
    ⬜ ⬜ ⬜
⬜ ⬜ ⬜ ⬜ ⬜
    ⬜ ⬜ ⬜
        ⬜
```

---

## 📐 Grid en L

```javascript
const grid = [
  [1, 0, 0],
  [1, 0, 0],
  [1, 1, 1],
];

const nombresEspeciales = {
  "0_0": "arriba",
  "1_0": "medio",
  "2_0": "esquina",
  "2_1": "centro",
  "2_2": "derecha",
};
```

**Visualización:**
```
⬜
⬜
⬜ ⬜ ⬜
```

---

## 🔀 Grid diagonal

```javascript
const grid = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

const nombresEspeciales = {
  "0_0": "inicio",
  "1_1": "segundo",
  "2_2": "tercero",
  "3_3": "final",
};
```

**Visualización:**
```
⬜
    ⬜
        ⬜
            ⬜
```

---

## 🔲 Grid cuadrado 3x3

```javascript
const grid = [
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
];

const nombresEspeciales = {
  "0_0": "arriba_izq",
  "0_1": "arriba",
  "0_2": "arriba_der",
  "1_0": "izquierda",
  "1_1": "centro",
  "1_2": "derecha",
  "2_0": "abajo_izq",
  "2_1": "abajo",
  "2_2": "abajo_der",
};
```

**Visualización:**
```
⬜ ⬜ ⬜
⬜ ⬜ ⬜
⬜ ⬜ ⬜
```

---

## 🔳 Grid rectangular horizontal

```javascript
const grid = [
  [1, 1, 1, 1, 1],
];

const nombresEspeciales = {
  "0_0": "seccion1",
  "0_1": "seccion2",
  "0_2": "seccion3",
  "0_3": "seccion4",
  "0_4": "seccion5",
};
```

**Visualización:**
```
⬜ ⬜ ⬜ ⬜ ⬜
```

---

## 📏 Grid rectangular vertical

```javascript
const grid = [
  [1],
  [1],
  [1],
  [1],
  [1],
];

const nombresEspeciales = {
  "0_0": "seccion1",
  "1_0": "seccion2",
  "2_0": "seccion3",
  "3_0": "seccion4",
  "4_0": "seccion5",
};
```

**Visualización:**
```
⬜
⬜
⬜
⬜
⬜
```

---

## 🌟 Grid en T

```javascript
const grid = [
  [1, 1, 1],
  [0, 1, 0],
  [0, 1, 0],
];

const nombresEspeciales = {
  "0_0": "izquierda",
  "0_1": "centro_arriba",
  "0_2": "derecha",
  "1_1": "centro",
  "2_1": "abajo",
};
```

**Visualización:**
```
⬜ ⬜ ⬜
    ⬜
    ⬜
```

---

## 🎪 Grid en cruz extendida

```javascript
const grid = [
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
];

const nombresEspeciales = {
  "0_2": "arriba2",
  "1_2": "arriba1",
  "2_0": "izquierda",
  "2_1": "centro_izq",
  "2_2": "centro",
  "2_3": "centro_der",
  "2_4": "derecha",
  "3_2": "abajo1",
  "4_2": "abajo2",
};
```

**Visualización:**
```
        ⬜
        ⬜
⬜ ⬜ ⬜ ⬜ ⬜
        ⬜
        ⬜
```

---

## 🎯 Grid en zigzag

```javascript
const grid = [
  [1, 1, 0],
  [0, 1, 1],
  [1, 1, 0],
];

const nombresEspeciales = {
  "0_0": "inicio",
  "0_1": "giro1",
  "1_1": "centro",
  "1_2": "giro2",
  "2_0": "giro3",
  "2_1": "final",
};
```

**Visualización:**
```
⬜ ⬜
    ⬜ ⬜
⬜ ⬜
```

---

## 🌀 Grid en espiral (5x5)

```javascript
const grid = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
];

const nombresEspeciales = {
  "0_0": "inicio",
  "0_1": "s1",
  "0_2": "s2",
  "0_3": "s3",
  "0_4": "s4",
  "1_4": "s5",
  "2_4": "s6",
  "3_4": "s7",
  "4_4": "s8",
  "4_3": "s9",
  "4_2": "s10",
  "4_1": "s11",
  "4_0": "s12",
  "3_0": "s13",
  "2_0": "s14",
  "1_0": "s15",
  "2_2": "centro",
};
```

**Visualización:**
```
⬜ ⬜ ⬜ ⬜ ⬜
⬜         ⬜
⬜     ⬜     ⬜
⬜         ⬜
⬜ ⬜ ⬜ ⬜ ⬜
```

---

## 💡 Tips para crear tu propio grid

1. **Empieza simple**: Usa un grid pequeño (3x3 o 4x4) para probar
2. **Piensa en la navegación**: Asegúrate de que todas las celdas sean accesibles
3. **Usa nombres descriptivos**: Facilita el mantenimiento del código
4. **Prueba diferentes layouts**: Experimenta hasta encontrar el que mejor se adapte a tu contenido
5. **Considera la experiencia de usuario**: Algunos layouts pueden ser confusos si son muy complejos

## 🔄 Cómo cambiar el grid

1. Abre `script.js`
2. Reemplaza la constante `grid` con tu nuevo diseño
3. Actualiza `nombresEspeciales` con las nuevas coordenadas
4. Crea los archivos HTML correspondientes en `paginas/`
5. Añade los estilos en `style.css`
6. Actualiza `data.json` con el contenido de las nuevas secciones

¡Experimenta y crea layouts únicos! 🚀
