# **App Name**: wPEP Bridge - Lit-Powered PEP⇄Solana 2-Way Peg

## Core Features:

- Lit Protocol Bootstrap: Mint / import PKP-PEP (secp256k1) → owns a deterministic P2PKH PEP deposit address. Mint / import PKP-SOL (ed25519) → sole mint & freeze authority of wPEP. Write both `{ pkpPubkey, authSig }` objects into a single `config/pkp` document in Firestore (easier Anchor look‑ups).
- Sync PEP Headers (SPV): Pub/Sub function `syncPepHeaders` pulls fresh PEP block headers from public ElectrumX (or Fulcrum) and appends them to the `pepHeaders` collection only if: 1. the new chain’s cumulative work ≥ current best, and 2. it extends the tip by ≤ 144 blocks (re‑org guard). Store running `total_work` to support Merkle‑proof verification.
- Deposit Flow — PEP → wPEP: Callable `proveDeposit({ txid, vout, solRecipient })` 1. Checks Merkle proof against stored headers & ensures `MIN_CONFIRMATIONS` (≥ 3) have elapsed. 2. Creates `depositProof` PDA (txid:vout) to block replays. 3. Invokes Lit Action `pepToSolMint.js`. `pepToSolMint.js` (Lit) threshold‑signs a Solana tx calling `AnchorTwoWayPeg::mint_wpep`. Cloud Function `broadcastMint` pushes the signed tx, waits for 1 slot confirmation, logs event. The Lit Action will use the chain to operate as a tool to ensure that the requested actions can proceed according to the rules of the chain.
- Redemption Flow — wPEP → PEP: Callable `burnWpep({ amount, pepRecipient })` Burns `amount` of wPEP; emits `BurnEvent` with timestamp. Pub/Sub `processBurnQueue` 1. Reads pending burns older than 1 slot. 2. Calls Lit Action `solBurnToPep.js` (idempotent). `solBurnToPep.js` Builds a PEP tx from PKP‑PEP UTXO set, subtracts `pepTxFee`, signs, returns raw hex. Function `finaliseRedeem` broadcasts raw tx, waits ≥ 1 confirmation, then calls `AnchorTwoWayPeg::prove_burn_and_release` to close the record. Timeout fallback: if a burn has no PEP tx after 30 min, any relayer may retry the Lit Action with the same `burn_id`. The Lit Action will use the chain to operate as a tool to ensure that the requested actions can proceed according to the rules of the chain.
- Guards & Monitoring: Lit Actions enforce on‑chain pre‑conditions before signing. Firestore transactions stop double‑mint / double‑spend. Structured logs → Cloud Logging; alert on failed Lit executions. The Lit Actions will use the chain to operate as a tool to ensure that the requested actions can proceed according to the rules of the chain.
- Anchor Program Boilerplate (TwoWayPeg): PDAs: Config, PepHeaders, DepositProof, BurnProof, (optional) ReorgGuard (ring buffer of last 144 headers). Instructions: `submit_headers`, `prove_deposit`, `mint_wpep`, `burn_wpep`, `prove_burn_and_release`.
- Front‑End Pages (Next 14): /deposit – QR for PKP‑PEP address; polls Firestore + Solana RPC for mint tx; links to Solscan. /redeem – burn form; live status toasts until PEP tx confirmed.
- Firebase Client Hooks: `lib/firebase.ts` – wraps callable functions & Firestore listeners. `npm run dev:web` – spins Next.js against local emulators.
- Firebase Configuration: `firebase.json` – emulators: firestore, functions, hosting. `functions/.env.example` – placeholders for RPC URLs, ElectrumX hosts, Lit creds. README.md quick‑start: 1. `yarn` 2. `cp functions/.env.example functions/.env` & fill vars 3. `node scripts/initPkp.ts` 4. `firebase emulators:start` & `npm run dev:web` 5. Send test PEP → watch wPEP mint; burn → receive PEP back.

## Style Guidelines:

- Neutral color palette with shades of gray and white for a clean and professional look.
- Use a clear and legible font for all text elements.
- Well-structured layout for deposit and redeem pages, ensuring ease of navigation.
- Simple and recognizable icons for status indicators and actions.

## Original User Request:
Build a Firebase monorepo whose back‑end (Cloud Functions + Firestore) and Lit Protocol PKPs replicate Apollo’s zBTC trustless peg, but for **Pepecoin (PEP)** to **Solana**.  On every confirmed PEP deposit, mint an equal amount of SPL‑Token **wPEP**; on wPEP burn, release native PEP.  Include a minimal React/Next front‑end and directory stubs for the Solana Anchor program.

────────────────────────────────────────
BACK‑END  (functions/, TypeScript 5, Node 18)
────────────────────────────────────────
1. **Dependencies**  
   • firebase‑functions@next, firebase‑admin, lit‑js‑sdk@^2  
   • electrum‑client (for PEP header & UTXO queries)  
   • solana/web3.js, @solana/spl‑token

2. **Lit Protocol bootstrap** (`scripts/initPkp.ts`)
   • Mint/import **PKP‑BTC** (secp256k1) – owns PEP deposit address.
   • Mint/import **PKP‑SOL** (ed25519) – sole mint authority of wPEP.
   • Write `{ pkpPubkey, authSig }` to `config/pkp` (Firestore).

3. **Deposit flow – PEP ➜ wPEP**  
   • Pub/Sub Function `syncPepHeaders` pulls new PEP block headers from public ElectrumX and stores them in `pepHeaders` collection.  
   • Callable `proveDeposit({ txid, vout, solRecipient })`  
        – verifies Merkle proof against stored headers, writes `depositProof`.
        – triggers Lit Action `pepToSolMint.js`.  
   • Lit Action signs Solana tx calling `AnchorTwoWayPeg::mint_wpep`; Cloud Function `broadcastMint` confirms and logs.

4. **Redemption flow – wPEP ➜ PEP**  
   • Callable `burnWpep({ amount, pepRecipient })` – user burns wPEP; logs `burnEvent`.  
   • Function `processBurnQueue` reads pending burns and invokes Lit Action `solBurnToPep.js`.  
   • Lit Action builds & PKP‑signs PEP tx paying `pepRecipient`; Function `finaliseRedeem` submits raw tx and updates state.

5. **Guards & monitoring**  
   • All Lit Actions check on‑chain pre‑conditions before threshold signing.
   • Firestore transactions prevent double‑mint / double‑spend.
   • Structured logs → Cloud Logging; alert on failed Lit executions.

────────────────────────────────────────
ANCHOR PROGRAM  (anchor/)
────────────────────────────────────────
Generate boilerplate for `TwoWayPeg` with IDS only:  
   • PDAs: Config, PepHeaders, DepositProof, BurnProof.
   • Instructions: submit_headers, prove_deposit, mint_wpep, burn_wpep, prove_burn_and_release.  
(No build in Studio; just directory + `Cargo.toml`, `lib.rs` placeholders.)

────────────────────────────────────────
FRONT‑END  (web/, Next 14 + Tailwind)
────────────────────────────────────────
1. Wallet adapters: `@solana/wallet-adapter-react` (Phantom).  
2. `/deposit` page – shows PKP deposit address QR, polls Firestore for mint status.  
3. `/redeem` page – burn form + status toasts.  
4. Firebase client SDK hooks (`lib/firebase.ts`) wired to callable functions.  
5. `npm run dev:web` starts Next.js against local emulators.

────────────────────────────────────────
FIREBASE CONFIG
────────────────────────────────────────
• `firebase.json` – emulators: firestore, functions, hosting.  
• `functions/.env.example` – placeholders for RPC URLs, ElectrumX hosts, Lit creds.  
• `README.md` with quick‑start:

   1. `yarn`  
   2. `cp functions/.env.example functions/.env` & fill vars  
   3. `node scripts/initPkp.ts`  
   4. `firebase emulators:start` & `npm run dev:web`  
   5. Send test PEP → watch wPEP mint; burn → receive PEP back.

────────────────────────────────────────
DELIVERABLE TREE
────────────────────────────────────────
wpep-lit-bridge/
├─ functions/src/index.ts            # Cloud Functions logic  
├─ litActions/pepToSolMint.js  
├─ litActions/solBurnToPep.js  
├─ scripts/initPkp.ts  
├─ anchor/TwoWayPeg/{Cargo.toml,lib.rs}  
├─ web/pages/{deposit.tsx,redeem.tsx}  
├─ firebase.json, tsconfig.json, README.md, package.json

Stretch goals (commented //TODO):
• Swap ElectrumX for self‑hosted Fulcrum or Core RPC.
• Add SPL governance instruction to rotate PKP‑SOL mint authority.
• Unit tests with Anchor localnet + PEP regtest.

Use clear async/await, thorough comments, and production‑safe error handling throughout.
  