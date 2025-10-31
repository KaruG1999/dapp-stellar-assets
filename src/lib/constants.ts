// src/lib/constants.js

/**
 * Constantes de Assets para la dApp
 *
 * IMPORTANTE: Estos issuers son para TESTNET
 * Para mainnet, debes cambiar los issuers
 */

// ⚠️ IMPORTANTE: Este es el issuer CORRECTO de USDC para TESTNET
// src/lib/constants.ts
export const USDC_TESTNET = {
  code: 'USDC',
  issuer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'
} as const;

// Para referencia: USDC en MAINNET (NO usar en esta clase)
export const USDC_MAINNET = {
  code: 'USDC',
  issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN'
} as const;

// XLM Native (no tiene issuer)
export const XLM = {
  code: 'XLM',
  issuer: null
} as const;

export const HORIZON_URLS = {
  testnet: 'https://horizon-testnet.stellar.org',
  mainnet: 'https://horizon.stellar.org'
} as const;

export const NETWORK_PASSPHRASES = {
  testnet: 'Test SDF Network ; September 2015',
  mainnet: 'Public Global Stellar Network ; September 2015'
} as const;

