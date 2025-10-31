/**
 * Interfaces para tipos relacionados con Stellar
 */

// Interfaz para un Asset nativo de Stellar
export interface Asset {
  code: string;
  issuer: string;
}

// Interfaz para el balance de un asset
export interface Balance {
  asset_type?: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
}

// Props para el componente AssetBalance
export interface AssetBalanceProps {
  publicKey: string;
  asset: Asset;
}

// Props para el componente CreateTrustline
export interface CreateTrustlineProps {
  asset: Asset;
  onSuccess?: () => void;
}