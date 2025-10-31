// src/components/Spinner.jsx

/**
 * Componente Spinner
 *
 * Propósito: Mostrar un indicador de carga animado
 *
 * No recibe props - es un componente puro
 */
export default function Spinner() {
  return (
    <div className="flex items-center justify-center">
      {/* 
        Spinner animado con Tailwind:
        - w-6 h-6: Tamaño 24px
        - border-4: Borde grueso
        - border-blue-500: Color azul
        - border-t-transparent: Top transparente (crea efecto de rotación)
        - rounded-full: Círculo perfecto
        - animate-spin: Animación de rotación (built-in de Tailwind)
      */}
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
