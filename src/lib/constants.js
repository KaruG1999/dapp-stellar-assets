// src/lib/constants.js

/**
 * Constantes de Assets para la dApp
 *
 * IMPORTANTE: Estos issuers son para TESTNET
 * Para mainnet, debes cambiar los issuers
 */

// ⚠️ IMPORTANTE: Este es el issuer CORRECTO de USDC para TESTNET
export const USDC_TESTNET = {
  code: "USDC",
  issuer: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
};

// Para referencia: USDC en MAINNET (NO usar en esta clase)
export const USDC_MAINNET = {
  code: "USDC",
  issuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
};

// Otros assets útiles en testnet
export const EURC_TESTNET = {
  code: "EURC",
  issuer: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
};

// Horizon endpoints
export const HORIZON_URLS = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
};

// Network passphrases
export const NETWORK_PASSPHRASES = {
  testnet: "Test SDF Network ; September 2015",
  mainnet: "Public Global Stellar Network ; September 2015",
};
