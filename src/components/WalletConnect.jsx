// src/components/WalletConnect.jsx

"use client";

import { useState, useEffect } from "react";

export default function WalletConnect({ onConnect }) {
  const [publicKey, setPublicKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkConnection() {
      setLoading(true);
      try {
        // Esperar un momento para que la extensión se cargue
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (window.freighter) {
          const isConnected = await window.freighter.isConnected();
          if (isConnected) {
            const key = await window.freighter.getPublicKey();
            setPublicKey(key);
            onConnect(key);
          }
        }
      } catch (err) {
        console.log("Freighter not connected:", err);
      } finally {
        setLoading(false);
      }
    }

    checkConnection();
  }, [onConnect]);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      // Verificar que window.freighter existe
      if (typeof window === "undefined" || !window.freighter) {
        throw new Error(
          "Freighter Wallet no está instalada o no se ha cargado. Por favor, instálala desde freighter.app y recarga la página."
        );
      }

      // Solicitar acceso a la public key
      const key = await window.freighter.getPublicKey();

      setPublicKey(key);
      onConnect(key);
    } catch (err) {
      // Mejorar el mensaje de error
      const errorMsg = err.message || err.toString();

      if (errorMsg.includes("User declined")) {
        setError(
          "Conexión rechazada. Por favor, aprueba la solicitud en Freighter."
        );
      } else if (
        errorMsg.includes("not installed") ||
        errorMsg.includes("no se ha cargado")
      ) {
        setError(errorMsg);
      } else {
        setError(`Error al conectar: ${errorMsg}`);
      }
      console.error("Error connecting wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🔗 Conectar Wallet
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
          <p className="text-red-700 text-sm">❌ {error}</p>
        </div>
      )}

      {!publicKey ? (
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
