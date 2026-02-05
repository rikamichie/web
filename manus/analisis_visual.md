# Análisis Visual - Nueva Derecha

**Fecha:** 22 enero 2026, 05:06 GMT+1

## Referencias visuales

He revisado las dos imágenes de referencia en `new_derecha/`:

### ordenador_derecha_1.png (Estado cerrado)
- Muestra la imagen de fondo con el altar y la puerta
- Contenedor crimson (rojo) en la parte inferior derecha
- Título "masajes" en blanco arriba del contenedor
- Dos columnas de precios: "a domicilio" y "carrer poeta cabanyes"
- Cada columna muestra 3 filas de precios (1h, 2h, 3h con sus respectivos precios)
- Tipografía serif blanca sobre fondo crimson

### ordenador_derecha_2.png (Estado expandido/hover)
- Misma estructura visual pero el contenedor crimson es más grande
- Ahora las columnas están en horizontal: "carrer poeta cabanyes" y "a domicilio"
- Debajo de los precios aparece la sección "tipos de masaje:"
- Lista de 6 tipos de masaje con sus descripciones
- Todo sigue en tipografía serif blanca sobre crimson

## Comportamiento esperado

**Desktop:**
- Estado cerrado: muestra solo precios en dos columnas lado a lado
- Al hover: se expande para mostrar también los tipos de masaje

**Móvil:**
- Margen de 20dvw desde la izquierda
- Margen de 60dvh desde arriba
- Estado cerrado: precios de poeta cabanyes primero, luego a domicilio (uno bajo otro)
- Al click: se expande para mostrar tipos de masaje
