// src/components/PathPayment.tsx

"use client";

import { useState } from "react";
import {
  Horizon,
  TransactionBuilder,
  Operation,
  Asset,
  Networks,
  type Transaction,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
import { supabase } from "../lib/supabase";
import { HORIZON_URLS } from "../lib/constants";
import Spinner from "./Spinner";

/**
 * Props para el componente PathPayment
 */
interface PathPaymentProps {
  sourceAsset: Asset;
  destAsset: Asset;
}

/**
 * Componente PathPayment (AVANZADO)
 *
 * Propósito: Demostrar la killer feature de Stellar: conversión automática
 * de assets en una sola transacción usando el DEX.
 *
 * Props:
 * - sourceAsset: Asset que se enviará
 * - destAsset: Asset que recibirá el destinatario
 */
export default function PathPayment({
  sourceAsset,
  destAsset,
}: PathPaymentProps) {
  const [amount, setAmount] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    type: "" | "success" | "error";
    message: string;
  }>({ type: "", message: "" });

  /**
   * Obtener la public key desde Freighter
   */
  const getPublicKey = async (): Promise<string> => {
    try {
      if (typeof window === "undefined") {
        throw new Error("Este código solo funciona en el navegador");
      }

      const freighter = await import("@stellar/freighter-api");

      const connected = await freighter.isConnected();

      if (!connected) {
        throw new Error(
          "Por favor instala Freighter desde https://freighter.app"
        );
      }

      // Solicitar acceso primero
      const accessResult = await freighter.requestAccess();

      if (accessResult.error) {
        throw new Error(`Acceso denegado: ${accessResult.error}`);
      }

      // Obtener la dirección
      const addressResult = await freighter.getAddress();

      if (addressResult.address && addressResult.address !== "") {
        return addressResult.address;
      } else {
        throw new Error(
          "No se pudo obtener la dirección. Verifica que Freighter esté desbloqueado."
        );
      }
    } catch (error) {
      console.error("Error getting public key:", error);
      throw error;
    }
  };

  /**
   * Función principal para enviar Path Payment
   */
  const sendPathPayment = async (): Promise<void> => {
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // ========== VALIDACIONES ==========
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error("Ingresa una cantidad válida");
      }

      // Validar que los assets sean diferentes
      if (
        sourceAsset.getCode() === destAsset.getCode() &&
        (sourceAsset.isNative() === destAsset.isNative() ||
          sourceAsset.getIssuer() === destAsset.getIssuer())
      ) {
        throw new Error("Los assets de origen y destino deben ser diferentes");
      }

      // ========== PASO 1: OBTENER PUBLIC KEY ==========
      const publicKey = await getPublicKey();

      if (!publicKey) {
        throw new Error("No se pudo obtener la public key");
      }

      // Si no hay destino, enviar a sí mismo (para probar)
      const destKey = destination || publicKey;

      // ========== PASO 2: CONECTAR A STELLAR ==========
      const server = new Horizon.Server(HORIZON_URLS.testnet);
      const account = await server.loadAccount(publicKey);

      // ========== PASO 3: PREPARAR ASSETS ==========
      // Verificar y crear assets correctamente
      const source = sourceAsset.isNative()
        ? Asset.native()
        : new Asset(sourceAsset.getCode(), sourceAsset.getIssuer());

      const dest = destAsset.isNative()
        ? Asset.native()
        : new Asset(destAsset.getCode(), destAsset.getIssuer());

      // Debug: Verificar assets
      console.log("Source Asset:", {
        code: source.getCode(),
        issuer: source.isNative() ? "native" : source.getIssuer(),
        type: source.getAssetType(),
      });
      console.log("Dest Asset:", {
        code: dest.getCode(),
        issuer: dest.isNative() ? "native" : dest.getIssuer(),
        type: dest.getAssetType(),
      });

      // ========== PASO 4: CONSTRUIR TRANSACCIÓN ==========
      const transaction = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.pathPaymentStrictSend({
            sendAsset: source,
            sendAmount: amount.toString(),
            destination: destKey,
            destAsset: dest,
            destMin: "0.0000001", // Mínimo aceptable (debe ser > 0)
          })
        )
        .setTimeout(30)
        .build();

      // ========== PASO 5: FIRMAR CON FREIGHTER ==========
      const xdr = transaction.toXDR();

      const response = await signTransaction(xdr, {
        network: "TESTNET",
        networkPassphrase: Networks.TESTNET,
      });

      // Debug: Ver qué retorna Freighter
      console.log("Freighter response:", response);
      console.log("Response type:", typeof response);

      // Manejar diferentes formatos de respuesta
      let signedXDR: string;

      if (typeof response === "string") {
        // Formato antiguo: retorna string directamente
        signedXDR = response;
      } else if (response && typeof response === "object") {
        // Formato nuevo: retorna objeto con signedTxXdr
        if (
          "signedTxXdr" in response &&
          typeof response.signedTxXdr === "string"
        ) {
          signedXDR = response.signedTxXdr;
        }
        // Formato alternativo: signedTransaction
        else if (
          "signedTransaction" in response &&
          typeof response.signedTransaction === "string"
        ) {
          signedXDR = response.signedTransaction;
        }
        // Verificar si el usuario rechazó (objeto vacío o con error)
        else if (Object.keys(response).length === 0 || "error" in response) {
          throw new Error("User declined");
        } else {
          console.error("Unexpected response format:", response);
          throw new Error("Formato de respuesta inesperado de Freighter");
        }
      } else {
        console.error("Invalid response:", response);
        throw new Error("Respuesta inválida de Freighter");
      }

      // ========== PASO 6: ENVIAR A STELLAR ==========
      const signedTransaction = TransactionBuilder.fromXDR(
        signedXDR,
        Networks.TESTNET
      ) as Transaction;

      const result = await server.submitTransaction(signedTransaction);

      // ========== PASO 7: GUARDAR EN SUPABASE ==========
      const { error: dbError } = await supabase.from("transactions").insert({
        user_id: publicKey,
        tx_type: "path_payment",
        tx_hash: result.hash,
        source_asset: sourceAsset.getCode(),
        dest_asset: destAsset.getCode(),
        amount: parseFloat(amount),
      });

      if (dbError) {
        console.error("Error saving to Supabase:", dbError);
      }

      // ========== PASO 8: NOTIFICAR ÉXITO ==========
      setStatus({
        type: "success",
        message: `✅ Path Payment exitoso! Hash: ${result.hash.slice(0, 8)}...`,
      });

      // Limpiar campos
      setAmount("");
      setDestination("");
    } catch (error: unknown) {
      console.error("Error in path payment:", error);

      const err = error as {
        message?: string;
        code?: number;
        response?: {
          data?: {
            extras?: {
              result_codes?: {
                operations?: string[];
              };
            };
          };
        };
      };

      let errorMessage = "Error desconocido";

      if (err.message?.includes("User declined") || err.code === 4001) {
        errorMessage = "Rechazaste la transacción en Freighter";
      } else if (err.response?.data?.extras?.result_codes) {
        const code = err.response.data.extras.result_codes.operations?.[0];

        if (code === "op_no_destination") {
          errorMessage = "La cuenta destino no existe";
        } else if (code === "op_no_trust") {
          errorMessage = "El destino no tiene trustline para ese asset";
        } else if (code === "op_under_dest_min") {
          errorMessage = "No hay suficiente liquidez en el DEX";
        } else if (code === "op_over_source_max") {
          errorMessage = "El costo excede el máximo permitido";
        } else {
          errorMessage = `Error de Stellar: ${code}`;
        }
      } else {
        errorMessage = err.message || "Error desconocido";
      }

      setStatus({
        type: "error",
        message: `❌ ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 border-l-4 border-l-orange-500">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-800">💸 Path Payment</h2>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
          AVANZADO
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Convierte <strong>{sourceAsset.getCode()}</strong> a{" "}
        <strong>{destAsset.getCode()}</strong> automáticamente
      </p>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 Path payment = Envías un asset, receptor recibe otro. Stellar
          convierte usando el DEX.
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cantidad ({sourceAsset.getCode()})
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Ej: 10"
          min="0"
          step="0.0000001"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destino (opcional)
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="GABC...XYZ o vacío para ti mismo"
        />
        <p className="text-xs text-gray-500 mt-1">
          Si está vacío, te enviarás a ti mismo (útil para probar)
        </p>
      </div>

      {status.message && (
        <div
          className={`p-3 rounded-lg mb-4 ${
            status.type === "success"
              ? "bg-green-100 border border-green-400 text-green-800"
              : "bg-red-100 border border-red-400 text-red-800"
          }`}
        >
          <p className="text-sm">{status.message}</p>
        </div>
      )}

      <button
        onClick={sendPathPayment}
        disabled={loading || !amount}
        className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg 
                   hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Spinner />
            <span>Enviando...</span>
          </>
        ) : (
          "💸 Enviar Path Payment"
        )}
      </button>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-xs text-yellow-800 mb-2">
          ⚠️ <strong>Importante sobre liquidez en testnet:</strong>
        </p>
        <ul className="text-xs text-yellow-800 space-y-1 list-disc list-inside">
          <li>El DEX de testnet tiene liquidez limitada</li>
          <li>
            Si aparece error "op_under_dest_min" o
            "op_path_payment_strict_send_no_destination", no hay ruta de
            conversión disponible
          </li>
          <li>Path payments funcionan mejor en mainnet con liquidez real</li>
          <li>
            Para testear, puedes crear tus propias órdenes en el DEX usando
            Stellar Laboratory
          </li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>🎯 ¿Qué es un Path Payment?</strong>
        </p>
        <ul className="text-xs text-gray-600 mt-2 space-y-1 list-disc list-inside">
          <li>
            Envías un asset (ej: XLM) y el receptor recibe otro (ej: USDC)
          </li>
          <li>Stellar busca automáticamente la mejor ruta en el DEX</li>
          <li>Todo ocurre en una sola transacción atómica</li>
          <li>Útil para remesas, pagos internacionales, y conversión rápida</li>
        </ul>
      </div>
    </div>
  );
}
