# 🦈 Stellar Native Assets dApp

Una aplicación descentralizada (dApp) para interactuar con assets nativos en la blockchain de Stellar, construida con Next.js, TypeScript y Freighter wallet.

## ✨ Características

- 🔐 **Conexión con Freighter Wallet**: Autenticación segura sin backend
- ✅ **Creación de Trustlines**: Autoriza tu cuenta para recibir stablecoins (USDC)
- 💰 **Consulta de Balances**: Visualiza tus holdings de assets nativos
- 💸 **Path Payments (Avanzado)**: Convierte assets automáticamente usando el DEX de Stellar
- 🎨 **UI Moderna**: Interfaz intuitiva con Tailwind CSS
- 📊 **Persistencia de Datos**: Registro de transacciones en Supabase

## 🚀 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Blockchain**: Stellar SDK
- **Wallet**: Freighter API
- **Base de Datos**: Supabase
- **Estilos**: Tailwind CSS

## 📋 Prerequisitos

- Node.js 18+ instalado
- [Freighter Wallet](https://www.freighter.app) instalada en tu navegador
- Cuenta de [Supabase](https://supabase.com) (plan gratuito)

## 🛠️ Instalación

1. **Clona el repositorio**
```bash
git clone <tu-repo>
cd stellar-native-assets-dapp
```

2. **Instala dependencias**
```bash
npm install
```

3. **Configura variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# .env.local
# ⚠️ CRÍTICO: NO SUBAS ESTE ARCHIVO A GITHUB

NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

4. **Verifica el .gitignore**

Asegúrate que `.env.local` esté en tu `.gitignore`:

```gitignore
# .gitignore
.env.local
.env*.local
```

5. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## ⚠️ SEGURIDAD CRÍTICA

**NUNCA subas `.env.local` a GitHub.**

### Si accidentalmente lo subiste:

1. ❌ Borra el archivo del repositorio
2. 🔄 Regenera las keys en Supabase (Settings → API)
3. ✅ Actualiza `.env.local` con las nuevas keys
4. 🔒 Verifica que `.gitignore` incluya `.env.local`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   └── page.tsx              # Página principal
├── components/
│   ├── WalletConnect.tsx     # Conexión con Freighter
│   ├── CreateTrustline.tsx   # Crear trustlines
│   ├── AssetBalance.tsx      # Ver balances
│   ├── PathPayment.tsx       # Pagos con conversión (Avanzado)
│   └── Spinner.tsx           # Indicador de carga
├── lib/
│   ├── constants.ts          # Assets y URLs de Horizon
│   └── supabase.ts           # Cliente de Supabase
└── types/
    └── stellar.ts            # Tipos TypeScript
```

## 🔧 Cambios Importantes Implementados

### 1. **Import de Horizon corregido**
```typescript
// ❌ Antes (JSX)
import { Server } from 'stellar-sdk';

// ✅ Ahora (TSX)
import { Horizon } from "@stellar/stellar-sdk";
const server = new Horizon.Server(HORIZON_URLS.testnet);
```

### 2. **Función getPublicKey mejorada**
Ahora usa la API de Freighter correctamente con imports dinámicos:
```typescript
const freighter = await import("@stellar/freighter-api");
const connected = await freighter.isConnected();
const accessResult = await freighter.requestAccess();
const addressResult = await freighter.getAddress();
```

### 3. **Tipado completo en TypeScript**
- ✅ Props tipadas con interfaces
- ✅ Estados con tipos explícitos (`useState<string>("")`)
- ✅ Funciones con tipos de retorno (`: Promise<void>`)
- ✅ Manejo de errores con type guards

### 4. **Assets como objetos del SDK**
```typescript
// ✅ Ahora usamos objetos Asset del SDK de Stellar
const usdcAsset = new Asset(USDC_TESTNET.code, USDC_TESTNET.issuer);
const xlmAsset = Asset.native();
```

### 5. **Validación de Trustlines Duplicadas**
Verifica en blockchain y base de datos antes de crear:
```typescript
const { exists } = await checkExistingTrustline(publicKey);
if (exists) {
  // Muestra warning en lugar de intentar crear
  return;
}
```

### 6. **Componente Spinner Reutilizable**
Feedback visual profesional en todos los componentes con loading states.

## 🎯 Guía de Uso

### 1. Configurar Freighter en Testnet
1. Abre Freighter
2. Ve a Settings → Network
3. Selecciona **Testnet**

### 2. Obtener XLM de Prueba
1. Conecta tu wallet en la dApp
2. Copia tu public key
3. Ve a [Friendbot](https://friendbot.stellar.org)
4. Pega tu public key y solicita XLM

### 3. Crear Trustline para USDC
1. Click en "✅ Crear Trustline"
2. Confirma en Freighter (costo: 0.5 XLM)
3. Espera confirmación

### 4. Verificar Balance
1. Click en "🔄 Actualizar Balance"
2. Deberías ver "0 USDC" (trustline creada, sin fondos aún)

### 5. (Opcional) Probar Path Payment
1. Ingresa cantidad de XLM
2. Deja destino vacío (te envías a ti mismo)
3. Click en "💸 Enviar Path Payment"
4. Stellar convertirá XLM → USDC automáticamente

## 📊 Mejoras Implementadas

| Mejora | Descripción | Impacto |
|--------|-------------|---------|
| **Constants.ts** | Centraliza assets e issuers | 🔥🔥🔥 Alto |
| **Spinner** | Indicador de carga animado | 🔥🔥 Medio |
| **Validación duplicados** | Evita trustlines repetidas | 🔥🔥🔥 Alto |
| **Instrucciones USDC** | Guía para obtener testnet USDC | 🔥🔥 Medio |
| **PathPayment** | Conversión automática de assets | 🔥🔥🔥 Alto |
| **TypeScript** | Tipado completo del proyecto | 🔥🔥🔥 Alto |

## 🐛 Troubleshooting

### Error: "Failed to load account"
- ✅ Verifica que tu cuenta tenga XLM (usa Friendbot)
- ✅ Confirma que Freighter esté en Testnet

### Error: "op_low_reserve"
- ✅ Necesitas más XLM (mínimo 1.5 XLM para trustline)
- ✅ Solicita más en Friendbot

### Error: "User declined access"
- ✅ Aprueba la conexión en Freighter
- ✅ Desbloquea Freighter si está bloqueada

### PathPayment: "op_under_dest_min"
- ✅ No hay liquidez suficiente en testnet DEX
- ✅ Normal en testnet, funciona mejor en mainnet

## 🚀 Deploy a Producción

### Antes de deployar:

- [ ] Cambia issuers a **mainnet** en `constants.ts`
- [ ] Cambia `HORIZON_URLS.testnet` → `HORIZON_URLS.mainnet`
- [ ] Cambia `Networks.TESTNET` → `Networks.PUBLIC`
- [ ] Actualiza Freighter a mainnet
- [ ] Prueba EXTENSIVAMENTE en testnet primero
- [ ] Ten XLM real (no es gratis como en testnet)

### Deploy en Vercel:

```bash
npm run build
vercel --prod
```

Configura las variables de entorno en Vercel Dashboard.

## 📚 Recursos

- [Stellar Documentation](https://developers.stellar.org/)
- [Freighter Wallet](https://www.freighter.app/)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Stellar SDK TypeScript](https://stellar.github.io/js-stellar-sdk/)
- [Supabase Docs](https://supabase.com/docs)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 💡 Créditos

Construido con 💙 por Karu Tiburona Builder

---

🦈⚡ **¡Sigue construyendo en Stellar!** ⚡🦈