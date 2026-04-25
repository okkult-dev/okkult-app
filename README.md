# okkult-app

```bash
$ cat description.txt
> Frontend application for Okkult Protocol.
> Live at app.okkult.io
```

---

## Stack

```bash
$ cat stack.txt
> Next.js 14    → App router
> TypeScript    → Type safety
> Tailwind CSS  → Styling
> Wagmi v2      → Wallet connection
> Viem          → Ethereum interaction
> RainbowKit    → Wallet UI
> SnarkJS       → ZK proof generation
> The Graph     → On-chain data indexing
> Alchemy       → Ethereum node
```

---

## Setup

```bash
git clone https://github.com/okkult-dev/okkult-app
cd okkult-app
npm install
cp .env.example .env.local
# fill in your API keys
npm run dev
```

---

## Environment Variables

```bash
$ cat .env.example
> NEXT_PUBLIC_ALCHEMY_MAINNET_URL=
> NEXT_PUBLIC_ALCHEMY_MAINNET_WS=
> NEXT_PUBLIC_WALLETCONNECT_ID=
> NEXT_PUBLIC_SUBGRAPH_URL=
> NEXT_PUBLIC_VERIFIER_ADDRESS=
> NEXT_PUBLIC_SHIELD_ADDRESS=
> NEXT_PUBLIC_VOTE_ADDRESS=
```

---

## Part of Okkult Protocol

```bash
$ cat ecosystem.txt
> okkult-proof      Core ZK compliance circuit
> okkult-sdk        TypeScript SDK
> okkult-contracts  Smart contracts
> okkult-circuits   ZK circuits
> okkult-app        ← you are here
> okkult-subgraph   The Graph indexer
> okkult-docs       Documentation
```

---

## License

```bash
$ cat license.txt
> MIT — okkult.io · @Okkult_
```
