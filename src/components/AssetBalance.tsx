// src/components/AssetBalance.tsx

"use client";

import { useState, useEffect } from "react";
import { Horizon } from "@stellar/stellar-sdk";
import { HORIZON_URLS } from "../lib/constants";
import Spinner from "./Spinner";
import { Balance, AssetBalanceProps } from "../types/stellar";

/**
 * Componente AssetBalance
 *
 * Propósito: Mostrar el balance de un asset nativo
 *
 * Props:
 * - publicKey: Public key del usuario
 * - asset: Objeto con { code, issuer } del asset a consultar
 */
export default function AssetBalance({ publicKey, asset }: AssetBalanceProps) {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Función para consultar el balance desde Stellar
   */
  const fetchBalance = async (): Promise<void> => {
    if (!publicKey) {
      setError("Conecta tu wallet primero");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const server = new Horizon.Server(HORIZON_URLS.testnet);
      const account = await server.loadAccount(publicKey);

      // Buscar el asset específico
      const assetBalance = account.balances.find(
        (b: Balance) =>
          b.asset_code === asset.code && b.asset_issuer === asset.issuer
      );

      setBalance(assetBalance ? assetBalance.balance : "0");
    } catch (err: unknown) {
      // Type guard mejorado para el error
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "status" in err.response &&
        err.response.status === 404
      ) {
        setError("Cuenta no encontrada. ¿Tienes XLM en testnet?");
      } else {
        const errorMessage =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "Error desconocido";
        setError(`Error: ${errorMessage}`);
      }
      console.error("Error fetching balance:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * useEffect: Consultar balance automáticamente cuando cambia publicKey o asset
   */
  useEffect(() => {
    if (publicKey) {
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, asset.code, asset.issuer]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        💰 Balance de {asset.code}
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        Issuer: {asset.issuer.slice(0, 8)}...
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
          <p className="text-red-700 text-sm">❌ {error}</p>
        </div>
      )}

      <button
        onClick={fetchBalance}
        disabled={loading || !publicKey}
        className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg 
                   hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors mb-4 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Spinner />
            <span>Cargando...</span>
          </>
        ) : (
          "🔄 Actualizar Balance"
        )}
      </button>

      {balance !== null && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <p className="text-4xl font-bold text-blue-600 text-center">
            {balance} {asset.code}
          </p>

          {balance === "0" && (
            <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-sm text-gray-600 text-center">
                No tienes {asset.code}.
              </p>
              <p className="text-xs text-gray-500 text-center mt-2">
                💡 Tip: Crea una trustline primero, luego usa Stellar Laboratory
                para enviar {asset.code} de prueba a tu cuenta.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>💡 ¿Cómo obtener {asset.code} en testnet?</strong>
        </p>
        <ol className="text-xs text-gray-600 mt-2 space-y-1 list-decimal list-inside">
          <li>
            Ve a{" "}
            <a
              href="https://laboratory.stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Stellar Laboratory
            </a>
          </li>
          <li>Crea otra cuenta de prueba con Friendbot</li>
          <li>Crea trustline para {asset.code} en esa cuenta</li>
          <li>Usa "Build Transaction" para enviar {asset.code} a tu cuenta</li>
        </ol>
      </div>
    </div>
  );
}
