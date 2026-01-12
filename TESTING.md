# 🧪 Guía de Testing de Donaciones/Ventas

## Animación de Números

Todos los números en el dashboard tienen una animación **emocionante y dramática** que va desde el valor actual al nuevo valor en **exactamente 25 segundos**, sin importar el monto.

### Características de la Animación:
- ⏱️ **Duración épica**: 25 segundos de disfrute visual continuo
- ✨ **Efectos visuales dramáticos**: 
  - Brillo pulsante (glow) que intensifica durante la fase emocionante
  - Escala sutil que pulsa suavemente
  - Colores dorados que cambian dinámicamente
  - Múltiples capas de sombras para un efecto de profundidad
- 🎯 **Curva de animación en 3 fases**:
  1. **Fase de construcción (0-25%)**: Aceleración suave que construye expectativa
  2. **Fase emocionante (25-75%)**: Aceleración rápida e intensa (el momento pico)
  3. **Fase épica (75-100%)**: Desaceleración dramática hacia la llegada final

### Números con animación:
- ✅ **Total Global** (arriba del centro)
- ✅ **Totales de cada equipo** (Mesa 1, Mesa 2, Mesa 3)
- ✅ **Ventas individuales** de cada agente

## 🚀 Cómo Hacer Donaciones de Prueba

### Paso 1: Abre la Consola del Navegador

1. Abre la aplicación en el navegador
2. Presiona `F12` para abrir las herramientas de desarrollador
3. Ve a la pestaña **Console**

### Paso 2: Ejecuta el Comando de Prueba

En la consola, escribe:

```javascript
window.simulateSale("Nombre del Agente", monto)
```

**Ejemplos prácticos:**
```javascript
// Donación pequeña
window.simulateSale("Daniel Salazar", 1000)

// Donación mediana
window.simulateSale("Isaac Fernandez", 5000)

// Donación grande
window.simulateSale("Samanta Rous", 25000)

// Donación muy grande
window.simulateSale("Juan de Dios", 100000)
```

### Paso 3: Observa las Animaciones Épicas

- 🎬 Los números comenzarán a animarse **inmediatamente**
- ⏱️ La animación durará **exactamente 25 segundos** de disfrute visual
- 📊 Verás el número subiendo desde el valor actual hasta el nuevo valor
- ✨ **Efectos visuales emocionantes**:
  - Brillo dorado pulsante que intensifica durante la fase emocionante
  - Escala sutil que hace que el número "respire"
  - Colores que cambian dinámicamente entre dorado brillante y amarillo intenso
  - Múltiples capas de sombras que crean profundidad y drama
- 🎯 **3 fases emocionantes**:
  - **Construcción**: Los números empiezan suavemente (0-25%)
  - **Clímax**: Aceleración rápida e intensa (25-75%) - ¡el momento más emocionante!
  - **Llegada épica**: Desaceleración dramática hacia el final (75-100%)

## 📋 Funciones Disponibles

### `window.simulateSale(agente, monto)`
Simula una donación para un agente específico.

**Parámetros:**
- `agente` (string): Nombre exacto del agente
- `monto` (number): Cantidad a agregar

**Ejemplo:**
```javascript
window.simulateSale("Daniel Salazar", 5000)
```

### `window.listTestSales()`
Muestra todas las ventas de prueba que están guardadas.

```javascript
window.listTestSales()
```

### `window.clearTestSales()`
Limpia todas las ventas de prueba guardadas.

```javascript
window.clearTestSales()
```

## 🎯 Nombres de Agentes Disponibles

Para que la prueba funcione, usa el nombre **exacto** del agente. Algunos ejemplos:

**Mesa 1:**
- "Daniel Salazar"
- "Isaac Fernandez"
- "Luisa Gutierrez"
- "Wilder Zapata"
- "Anny Martinez"

**Mesa 2:**
- "Juan de Dios"
- "Isadora Cruz"
- "Ismael Lopez"
- "Mariano Campuzano"
- "Maylo Villalobos"
- "Giann Carlos"

**Mesa 3:**
- "Samanta Rous"
- "Guadalupe Gonzalez"
- "Heiner Ramirez"
- "Amelia Huaman"

## 💡 Ejemplos de Uso

### Prueba Básica
```javascript
// Simular una donación de $5,000
window.simulateSale("Daniel Salazar", 5000)
```

### Múltiples Donaciones
```javascript
// Primera donación
window.simulateSale("Daniel Salazar", 5000)

// Esperar a que termine la animación (25 segundos)
// Luego otra donación
window.simulateSale("Isaac Fernandez", 10000)
```

### Prueba de Múltiples Agentes
```javascript
// Donación para varios agentes
window.simulateSale("Daniel Salazar", 5000)
window.simulateSale("Samanta Rous", 8000)
window.simulateSale("Juan de Dios", 3000)
```

### Limpiar y Empezar de Nuevo
```javascript
// Limpiar todas las ventas de prueba
window.clearTestSales()

// Ver qué ventas están guardadas
window.listTestSales()
```

## ⚡ Características de la Animación Épica

- ⏱️ **Duración épica**: Siempre 25 segundos de disfrute visual, sin importar el número
- 🎨 **Curva de animación dramática**: 3 fases emocionantes que mantienen la atención
- ✨ **Efectos visuales intensos**:
  - Brillo pulsante que se intensifica durante la fase emocionante (25-75%)
  - Escala sutil que hace que el número "respire" durante la animación
  - Colores dinámicos que oscilan entre dorado brillante y amarillo intenso
  - Múltiples capas de sombras y filtros de brillo para máximo impacto visual
- 📈 **Incremento progresivo emocionante**: El número sube gradualmente con aceleración variable
- 🔄 **Automático**: Se actualiza inmediatamente cuando detecta cambios
- 💪 **Diseñado para emocionar**: Cada animación es un evento visual que mantiene a los empleados emocionados

## ⚠️ Notas Importantes

1. **Nombre exacto**: El nombre del agente debe coincidir exactamente con el que está en Google Sheets
2. **Actualización inmediata**: Las animaciones se activan automáticamente
3. **Persistencia**: Las ventas de prueba se guardan en localStorage hasta que las limpies
4. **No afecta datos reales**: Las pruebas solo modifican datos temporalmente en memoria

## 🐛 Solución de Problemas

**Problema**: El agente no se encuentra
```javascript
// Verifica el nombre exacto del agente
window.listTestSales() // Ver qué ventas están guardadas
```

**Problema**: No veo la animación
- Asegúrate de que el agente existe en Google Sheets
- Recarga la página si es necesario
- Verifica que el monto sea mayor a 0

**Problema**: Las animaciones no se detienen
- Limpia las ventas de prueba: `window.clearTestSales()`
- Recarga la página
