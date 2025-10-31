// src/components/CreateTrustline.tsx

"use client";

import { useState } from "react";
import {
  Horizon,
  Networks,
  TransactionBuilder,
  Operation,
  Asset,
  type Transaction,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
import { supabase } from "../lib/supabase";
import { HORIZON_URLS } from "../lib/constants";
import Spinner from "./Spinner";
import type { CreateTrustlineProps, Balance } from "../types/stellar";

/**
 * Componente CreateTrustline
 *
 * Propósito: Crear una trustline para un asset nativo
 *
 * Props:
 * - asset: Objeto { code, issuer } del asset
 * - onSuccess: Callback cuando trustline se crea exitosamente
 *
 * MEJORA: Ahora valida si la trustline ya existe antes de crearla
 */
export default function CreateTrustline({
  asset,
  onSuccess,
}: CreateTrustlineProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "" | "success" | "warning" | "error";
    message: string;
  }>({ type: "", message: "" });
  const [trustlineExists, setTrustlineExists] = useState(false);

  /**
   * Obtener la public key desde Freighter
   * Usa la misma lógica que WalletConnect
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
   * Interfaz para el resultado de verificación de trustline
   */
  interface TrustlineCheckResult {
    exists: boolean;
    source: "blockchain" | "database" | null;
  }

  /**
   * Función para verificar si la trustline ya existe
   */
  const checkExistingTrustline = async (
    publicKey: string
  ): Promise<TrustlineCheckResult> => {
    try {
      const server = new Horizon.Server(HORIZON_URLS.testnet);
      const account = await server.loadAccount(publicKey);

      const existsOnChain = account.balances.some(
        (b: Balance) =>
          b.asset_code === asset.code && b.asset_issuer === asset.issuer
      );

      if (existsOnChain) {
        return { exists: true, source: "blockchain" };
      }

      const { data, error } = await supabase
        .from("trustlines")
        .select("*")
        .eq("user_id", publicKey)
        .eq("asset_code", asset.code)
        .eq("asset_issuer", asset.issuer)
        .limit(1);

      if (error) {
        console.error("Error checking Supabase:", error);
        return { exists: false, source: null };
      }

      if (data && data.length > 0) {
        return { exists: true, source: "database" };
      }

      return { exists: false, source: null };
    } catch (err) {
      console.error("Error checking trustline:", err);
      return { exists: false, source: null };
    }
  };

  /**
   * Función principal para crear la trustline
   */
  const createTrustline = async (): Promise<void> => {
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // ========== PASO 1: OBTENER PUBLIC KEY ==========
      const publicKey = await getPublicKey();

      if (!publicKey) {
        throw new Error("No se pudo obtener la public key");
      }

      // ========== PASO 1.5: VERIFICAR SI YA EXISTE ==========
      const { exists } = await checkExistingTrustline(publicKey);

      if (exists) {
        setTrustlineExists(true);
        setStatus({
          type: "warning",
          message: `⚠️ Ya tienes una trustline para ${asset.code}. No necesitas crear otra.`,
        });
        setLoading(false);
        return;
      }

      // ========== PASO 2: CONECTAR A STELLAR ==========
      const server = new Horizon.Server(HORIZON_URLS.testnet);
      const account = await server.loadAccount(publicKey);

      // ========== PASO 3: DEFINIR EL ASSET ==========
      const stellarAsset = new Asset(asset.code, asset.issuer);

      // ========== PASO 4: CONSTRUIR LA TRANSACCIÓN ==========
      const transaction = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.changeTrust({
            asset: stellarAsset,
            limit: "10000",
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

      if (!response || typeof response !== "string") {
        throw new Error("No se pudo firmar la transacción");
      }

      // En las versiones nuevas, signTransaction retorna directamente el XDR firmado
      const signedXDR = response;

      // ========== PASO 6: ENVIAR A STELLAR ==========
      const signedTransaction = TransactionBuilder.fromXDR(
        signedXDR,
        Networks.TESTNET
      ) as Transaction;

      const result = await server.submitTransaction(signedTransaction);

      // ========== PASO 7: GUARDAR EN SUPABASE ==========
      const { error: dbError } = await supabase.from("trustlines").insert({
        user_id: publicKey,
        asset_code: asset.code,
        asset_issuer: asset.issuer,
        trust_limit: 10000,
        tx_hash: result.hash,
      });

      if (dbError) {
        console.error("Error saving to Supabase:", dbError);
      }

      // ========== PASO 8: NOTIFICAR ÉXITO ==========
      setStatus({
        type: "success",
        message: `✅ Trustline creada exitosamente! Ahora puedes recibir ${asset.code}.`,
      });

      setTrustlineExists(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error("Error creating trustline:", error);

      const err = error as {
        message?: string;
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

      if (err.message?.includes("User declined")) {
        errorMessage = "Rechazaste la transacción en Freighter";
      } else if (err.response?.data) {
        const resultCode =
          err.response.data.extras?.result_codes?.operations?.[0];

        if (resultCode === "op_low_reserve") {
          errorMessage =
            "Balance insuficiente. Necesitas al menos 0.5 XLM más.";
        } else if (resultCode === "op_line_full") {
          errorMessage = "Ya tienes la trustline creada.";
        } else {
          errorMessage = `Error de Stellar: ${resultCode || "Desconocido"}`;
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
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        ✅ Crear Trustline
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Esto te permitirá recibir y enviar <strong>{asset.code}</strong>
      </p>

      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-4">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Costo:</strong> 0.5 XLM de base reserve (recuperable si
          eliminas la trustline)
        </p>
      </div>

      {status.message && (
        <div
          className={`p-3 rounded-lg mb-4 ${
            status.type === "success"
              ? "bg-green-100 border border-green-400 text-green-800"
              : status.type === "warning"
              ? "bg-yellow-100 border border-yellow-400 text-yellow-800"
              : "bg-red-100 border border-red-400 text-red-800"
          }`}
        >
          <p className="text-sm">{status.message}</p>
        </div>
      )}

      <button
        onClick={createTrustline}
        disabled={loading || trustlineExists}
        className="w-full px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg 
                   hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Spinner />
            <span>Creando...</span>
          </>
        ) : trustlineExists ? (
          "✅ Trustline Ya Existe"
        ) : (
          "✅ Crear Trustline"
        )}
      </button>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>¿Qué pasa cuando creas una trustline?</strong>
        </p>
        <ul className="text-xs text-gray-600 mt-2 space-y-1 list-disc list-inside">
          <li>Se "congela" 0.5 XLM (base reserve)</li>
          <li>Puedes recibir hasta 10,000 {asset.code}</li>
          <li>La transacción se registra en blockchain</li>
          <li>Freighter te pedirá confirmar (con tu secret key)</li>
          <li>El sistema verifica que no exista una trustline duplicada</li>
        </ul>
      </div>
    </div>
  );
}
