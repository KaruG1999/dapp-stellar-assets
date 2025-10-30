// src/components/WalletConnect.jsx

"use client"; // Necesario para Next.js App Router (componente del cliente)

import { useState, useEffect } from "react";
// Importar funciones de Freighter API
import { isConnected, getPublicKey } from "@stellar/freighter-api";

/**
 * Componente WalletConnect
 *
 * Propósito: Conectar la wallet Freighter del usuario
 *
 * Props:
 * - onConnect: Función callback que se llama cuando la wallet se conecta
 *   Recibe la public key como argumento
 */
export default function WalletConnect({ onConnect }) {
  // Estado para guardar la public key del usuario
  const [publicKey, setPublicKey] = useState("");

  // Estado para mostrar loading
  const [loading, setLoading] = useState(false);

  // Estado para mostrar errores
  const [error, setError] = useState(null);

  /**
   * useEffect: Se ejecuta cuando el componente se monta
   * Verifica si Freighter ya está conectado automáticamente
   */
  useEffect(() => {
    async function checkConnection() {
      setLoading(true);
      try {
        // Verificar si Freighter está instalado y conectado
        if (await isConnected()) {
          // Si está conectado, obtener la public key
          const key = await getPublicKey();
          setPublicKey(key);
          // Notificar al componente padre (page.jsx)
          onConnect(key);
        }
      } catch (err) {
        // Si hay error, no hacer nada (usuario probablemente no tiene Freighter)
        console.log("Freighter not connected:", err);
      } finally {
        setLoading(false);
      }
    }

    checkConnection();
  }, [onConnect]); // Solo ejecutar una vez al montar

  /**
   * Función para conectar la wallet manualmente
   * Se ejecuta cuando el usuario hace click en el botón
   */
  const connectWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      // Verificar que window.freighter existe (extensión instalada)
      if (!window.freighter) {
        throw new Error("Freighter Wallet no está instalada");
      }

      // Solicitar acceso a la public key
      // Esto abre un popup de Freighter pidiendo permiso
      const key = await getPublicKey();

      // Guardar public key en el estado
      setPublicKey(key);

      // Notificar al componente padre
      onConnect(key);
    } catch (err) {
      // Manejar error y mostrarlo al usuario
      setError(err.message);
      console.error("Error connecting wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función helper para formatear la public key
   * Muestra solo primeros 4 y últimos 4 caracteres
   * Ejemplo: GABC...XYZ9
   */
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // ========== RENDER DEL COMPONENTE ==========

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      {/* Título */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🔗 Conectar Wallet
      </h2>

      {/* Mostrar error si existe */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
          <p className="text-red-700 text-sm">❌ {error}</p>
        </div>
      )}

      {/* Condicional: ¿Ya está conectado? */}
      {!publicKey ? (
        /* NO conectado: Mostrar botón */
        <div>
          <button
            onClick={connectWallet}
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg 
                       hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed
                       transition-colors"
          >
            {loading ? "⏳ Conectando..." : "🔗 Conectar Freighter"}
          </button>

          {/* Link para descargar Freighter si no la tiene */}
          <p className="text-sm text-gray-500 mt-3 text-center">
            ¿No tienes Freighter?{" "}
            <a
              href="https://www.freighter.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Descárgala aquí
            </a>
          </p>
        </div>
      ) : (
        /* SÍ conectado: Mostrar public key */
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-800 font-bold mb-2">✅ Wallet Conectada</p>
          <p className="text-sm text-gray-600 font-mono break-all">
            {formatAddress(publicKey)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Public Key: {publicKey}</p>
        </div>
      )}
    </div>
  );
}
