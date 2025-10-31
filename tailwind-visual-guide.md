# 🎨 Guía Visual para Modificar Estilos con Tailwind CSS

## 📚 Índice
1. [Conceptos Básicos](#conceptos-básicos)
2. [Colores](#colores)
3. [Tamaños y Espaciado](#tamaños-y-espaciado)
4. [Bordes y Sombras](#bordes-y-sombras)
5. [Tipografía](#tipografía)
6. [Ejemplos Prácticos](#ejemplos-prácticos)
7. [Cheat Sheet Rápido](#cheat-sheet-rápido)

---

## Conceptos Básicos

### ¿Qué es Tailwind CSS?

Tailwind es un framework de CSS que usa **clases utilitarias**. En lugar de escribir CSS personalizado, aplicas clases predefinidas directamente en el HTML.

```tsx
// ❌ CSS tradicional
<div style="background-color: blue; padding: 16px; border-radius: 8px;">
  Hola
</div>

// ✅ Con Tailwind
<div className="bg-blue-500 p-4 rounded-lg">
  Hola
</div>
```

### Estructura de una clase Tailwind

```
{propiedad}-{valor}
    ↓        ↓
  bg-blue-500
```

---

## Colores

### Paleta de Colores

Tailwind usa una escala del **50 al 900** (50 = más claro, 900 = más oscuro)

```tsx
// Backgrounds (bg)
<div className="bg-blue-50">   Muy claro 🌤️
<div className="bg-blue-200">  Claro ☀️
<div className="bg-blue-500">  Normal 🌊 (DEFAULT)
<div className="bg-blue-700">  Oscuro 🌑
<div className="bg-blue-900">  Muy oscuro 🌚

// Texto (text)
<p className="text-red-500">Texto rojo</p>
<p className="text-green-600">Texto verde</p>
<p className="text-gray-800">Texto gris oscuro</p>

// Bordes (border)
<div className="border border-purple-500">Borde morado</div>
```

### Colores Disponibles

| Color | Uso Común | Ejemplo |
|-------|-----------|---------|
| `gray` | Textos, fondos neutros | `bg-gray-100`, `text-gray-700` |
| `blue` | Botones principales, links | `bg-blue-500`, `text-blue-600` |
| `green` | Éxito, confirmación | `bg-green-100`, `text-green-800` |
| `red` | Errores, alertas | `bg-red-100`, `text-red-800` |
| `yellow` | Advertencias | `bg-yellow-50`, `text-yellow-800` |
| `purple` | Acciones secundarias | `bg-purple-500`, `text-purple-600` |
| `orange` | Destacados | `bg-orange-500`, `text-orange-600` |

### Cambiar Colores en tu Proyecto

**Ejemplo 1: Cambiar color del botón "Crear Trustline"**

```tsx
// 🔍 Busca en CreateTrustline.tsx:
<button className="bg-purple-500 hover:bg-purple-600 ...">

// ✏️ Cámbialo a verde:
<button className="bg-green-500 hover:bg-green-600 ...">

// ✏️ O a naranja:
<button className="bg-orange-500 hover:bg-orange-600 ...">
```

**Ejemplo 2: Cambiar color de fondo del header**

```tsx
// 🔍 Busca en page.tsx:
<div className="bg-white shadow-sm border-b border-gray-200">

// ✏️ Cámbialo a azul claro:
<div className="bg-blue-50 shadow-sm border-b border-blue-200">

// ✏️ O a morado claro:
<div className="bg-purple-50 shadow-sm border-b border-purple-200">
```

---

## Tamaños y Espaciado

### Sistema de Espaciado

Tailwind usa una escala numérica donde **1 = 0.25rem = 4px**

| Número | Pixeles | Uso |
|--------|---------|-----|
| `1` | 4px | Muy pequeño |
| `2` | 8px | Pequeño |
| `4` | 16px | Normal (DEFAULT) |
| `6` | 24px | Medio |
| `8` | 32px | Grande |
| `12` | 48px | Muy grande |

### Padding (p) - Espacio interno

```tsx
<div className="p-4">      Padding en todos los lados (16px)
<div className="px-4">     Padding horizontal (izq + der)
<div className="py-4">     Padding vertical (arriba + abajo)
<div className="pt-4">     Padding top
<div className="pb-4">     Padding bottom
<div className="pl-4">     Padding left
<div className="pr-4">     Padding right
```

### Margin (m) - Espacio externo

```tsx
<div className="m-4">      Margin en todos los lados
<div className="mx-4">     Margin horizontal
<div className="my-4">     Margin vertical
<div className="mt-4">     Margin top
<div className="mb-4">     Margin bottom
```

### Gap - Espacio entre elementos

```tsx
<div className="flex gap-2">    Espacio pequeño entre items
<div className="flex gap-4">    Espacio normal
<div className="flex gap-6">    Espacio grande
```

### Ejemplo Práctico: Hacer un botón más grande

```tsx
// 🔍 Original (pequeño)
<button className="px-4 py-2">Botón</button>

// ✏️ Más grande
<button className="px-6 py-3">Botón</button>

// ✏️ Extra grande
<button className="px-8 py-4">Botón</button>
```

---

## Bordes y Sombras

### Bordes

```tsx
// Grosor del borde
<div className="border">       1px (default)
<div className="border-2">     2px
<div className="border-4">     4px

// Lados específicos
<div className="border-t">     Solo arriba
<div className="border-b">     Solo abajo
<div className="border-l">     Solo izquierda
<div className="border-r">     Solo derecha

// Color
<div className="border border-blue-500">  Borde azul
<div className="border border-red-300">   Borde rojo claro
```

### Bordes Redondeados

```tsx
<div className="rounded">       4px
<div className="rounded-md">    6px
<div className="rounded-lg">    8px (común en tarjetas)
<div className="rounded-xl">    12px
<div className="rounded-full">  Círculo perfecto
```

### Sombras

```tsx
<div className="shadow-sm">     Sombra pequeña
<div className="shadow">        Sombra normal
<div className="shadow-md">     Sombra mediana (común)
<div className="shadow-lg">     Sombra grande
<div className="shadow-xl">     Sombra extra grande
```

### Ejemplo: Hacer tarjetas más llamativas

```tsx
// 🔍 Original (sutil)
<div className="bg-white rounded-lg shadow-md border border-gray-200">

// ✏️ Más llamativa con sombra grande
<div className="bg-white rounded-xl shadow-xl border-2 border-blue-300">

// ✏️ Con efecto hover
<div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
```

---

## Tipografía

### Tamaños de Texto

```tsx
<p className="text-xs">    Extra pequeño (12px)
<p className="text-sm">    Pequeño (14px)
<p className="text-base">  Normal (16px)
<p className="text-lg">    Grande (18px)
<p className="text-xl">    Extra grande (20px)
<p className="text-2xl">   2X grande (24px)
<p className="text-3xl">   3X grande (30px)
<p className="text-4xl">   4X grande (36px)
```

### Peso de la Fuente

```tsx
<p className="font-light">      Delgada (300)
<p className="font-normal">     Normal (400)
<p className="font-medium">     Media (500)
<p className="font-semibold">   Semi-negrita (600)
<p className="font-bold">       Negrita (700)
<p className="font-extrabold">  Extra negrita (800)
```

### Alineación

```tsx
<p className="text-left">    Izquierda (default)
<p className="text-center">  Centro
<p className="text-right">   Derecha
```

### Ejemplo: Hacer un título más grande

```tsx
// 🔍 Original
<h1 className="text-2xl font-bold">Título</h1>

// ✏️ Más grande
<h1 className="text-4xl font-bold">Título</h1>

// ✏️ Extra grande con color
<h1 className="text-5xl font-extrabold text-blue-600">Título</h1>
```

---

## Ejemplos Prácticos

### Ejemplo 1: Cambiar colores del tema

**De púrpura a azul:**

```tsx
// Busca y reemplaza en todos los archivos:
bg-purple-500  →  bg-blue-500
bg-purple-600  →  bg-blue-600
text-purple-600 →  text-blue-600
border-purple-200 → border-blue-200
```

### Ejemplo 2: Hacer botones más grandes

```tsx
// Busca en CreateTrustline.tsx, AssetBalance.tsx, etc.:
className="px-4 py-2"

// Reemplaza con:
className="px-6 py-3 text-lg"
```

### Ejemplo 3: Cambiar espaciado de tarjetas

```tsx
// 🔍 Busca:
<div className="p-6 bg-white rounded-lg ...">

// ✏️ Más espacioso:
<div className="p-8 bg-white rounded-xl ...">

// ✏️ Más compacto:
<div className="p-4 bg-white rounded-md ...">
```

### Ejemplo 4: Agregar efecto hover a tarjetas

```tsx
// 🔍 Original:
<div className="bg-white rounded-lg shadow-md">

// ✏️ Con hover:
<div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
```

### Ejemplo 5: Cambiar el fondo del gradiente

```tsx
// 🔍 Busca en page.tsx:
<main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

// ✏️ Gradiente verde:
<main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">

// ✏️ Gradiente naranja:
<main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">

// ✏️ Fondo sólido:
<main className="min-h-screen bg-gray-50">
```

---

## Cheat Sheet Rápido

### 🎨 Colores más usados
```tsx
bg-white          // Fondo blanco
bg-gray-50        // Fondo gris muy claro
bg-blue-500       // Azul normal
text-gray-800     // Texto gris oscuro
border-gray-200   // Borde gris claro
```

### 📐 Espaciado común
```tsx
p-4               // Padding 16px
p-6               // Padding 24px
px-4 py-2         // Padding horizontal 16px, vertical 8px
m-4               // Margin 16px
gap-4             // Espacio entre items 16px
```

### 🔲 Bordes y sombras
```tsx
rounded-lg        // Bordes redondeados 8px
shadow-md         // Sombra mediana
border            // Borde 1px
border-2          // Borde 2px
```

### 📝 Texto
```tsx
text-xl           // Texto grande
font-bold         // Negrita
text-center       // Centrado
```

### 🎭 Efectos
```tsx
hover:bg-blue-600      // Cambio de color al pasar mouse
transition-colors      // Animación suave de colores
cursor-pointer         // Cursor de mano
disabled:bg-gray-400   // Color cuando está deshabilitado
```

---

## 🛠️ Cómo Modificar tu Proyecto

### Paso 1: Identifica qué quieres cambiar

- ¿Color del botón? → Busca `bg-{color}-{número}`
- ¿Tamaño del texto? → Busca `text-{tamaño}`
- ¿Espaciado? → Busca `p-{número}` o `m-{número}`

### Paso 2: Busca en el código

Usa Ctrl+F (Windows) o Cmd+F (Mac) en VS Code para buscar la clase.

### Paso 3: Modifica y guarda

Next.js tiene Hot Reload, verás los cambios inmediatamente.

### Paso 4: Si no te gusta, Ctrl+Z

¡Siempre puedes deshacer!

---

## 🎓 Recursos para Aprender Más

- **Tailwind Official Docs**: https://tailwindcss.com/docs
- **Tailwind Playground**: https://play.tailwindcss.com
- **Tailwind Color Generator**: https://uicolors.app/create
- **Tailwind Cheat Sheet**: https://nerdcave.com/tailwind-cheat-sheet

---

## 💡 Tips Finales

1. **Usa múltiples clases**: Tailwind se trata de combinar clases pequeñas
   ```tsx
   <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors">
   ```

2. **Los números son consistentes**: Si `p-4` es 16px, `m-4` también es 16px

3. **Hover y otros estados**: Usa prefijos como `hover:`, `focus:`, `disabled:`
   ```tsx
   hover:bg-blue-600
   focus:ring-2
   disabled:opacity-50
   ```

4. **Responsive design**: Usa prefijos como `sm:`, `md:`, `lg:`
   ```tsx
   <div className="text-base md:text-lg lg:text-xl">
   ```

5. **No tengas miedo de experimentar**: Los cambios son instantáneos y reversibles

---

🦈 **¡Ahora puedes personalizar tu dApp sin ser experto en Tailwind!** 🎨