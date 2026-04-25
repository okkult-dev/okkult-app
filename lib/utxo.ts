import { buildPoseidon } from 'circomlibjs'
import { generateSecret } from './zkProof'

export interface UTXO {
  commitment:  string
  amount:      bigint
  token:       string
  secret:      string
  owner:       string
  leafIndex:   number
  spent:       boolean
  createdAt:   number
}

let poseidon: any = null

async function getPoseidon() {
  if (!poseidon) poseidon = await buildPoseidon()
  return poseidon
}

// Compute UTXO commitment = Poseidon(amount, token, secret, owner)
export async function computeCommitment(
  amount: bigint,
  token:  string,
  secret: string,
  owner:  string
): Promise<string> {
  const pos = await getPoseidon()
  const F   = pos.F
  const h   = pos([amount, BigInt(token), BigInt(secret), BigInt(owner)])
  return '0x' + F.toString(h, 16).padStart(64, '0')
}

// Compute UTXO nullifier = Poseidon(commitment, secret)
export async function computeNullifier(
  commitment: string,
  secret:     string
): Promise<string> {
  const pos = await getPoseidon()
  const F   = pos.F
  const h   = pos([BigInt(commitment), BigInt(secret)])
  return '0x' + F.toString(h, 16).padStart(64, '0')
}

// Create a new UTXO
export async function createUTXO(
  amount: bigint,
  token:  string,
  owner:  string
): Promise<UTXO> {
  const secret     = generateSecret()
  const commitment = await computeCommitment(amount, token, secret, owner)

  const utxo: UTXO = {
    commitment,
    amount,
    token,
    secret,
    owner,
    leafIndex: -1,
    spent:     false,
    createdAt: Math.floor(Date.now() / 1000),
  }

  saveUTXO(utxo)
  return utxo
}

// Save UTXO to localStorage
export function saveUTXO(utxo: UTXO) {
  if (typeof window === 'undefined') return

  const key  = `okkult_utxo_${utxo.commitment}`
  localStorage.setItem(key, JSON.stringify({
    ...utxo,
    amount: utxo.amount.toString(),
  }))

  // Update index
  const index = getUTXOIndex()
  if (!index.includes(utxo.commitment)) {
    index.push(utxo.commitment)
    localStorage.setItem('okkult_utxo_index', JSON.stringify(index))
  }
}

// Load all UTXOs for an owner
export function loadUTXOs(owner: string): UTXO[] {
  if (typeof window === 'undefined') return []

  const index = getUTXOIndex()
  const utxos: UTXO[] = []

  for (const commitment of index) {
    const raw = localStorage.getItem(`okkult_utxo_${commitment}`)
    if (!raw) continue

    const utxo = JSON.parse(raw)
    utxo.amount = BigInt(utxo.amount)

    if (
      utxo.owner.toLowerCase() === owner.toLowerCase() &&
      !utxo.spent
    ) {
      utxos.push(utxo)
    }
  }

  return utxos
}

// Get total shielded balance for a token
export function getBalance(
  owner: string,
  token: string
): bigint {
  return loadUTXOs(owner)
    .filter(u => u.token.toLowerCase() === token.toLowerCase())
    .reduce((sum, u) => sum + u.amount, BigInt(0))
}

// Mark UTXO as spent
export function markSpent(commitment: string) {
  if (typeof window === 'undefined') return

  const raw = localStorage.getItem(`okkult_utxo_${commitment}`)
  if (!raw) return

  const utxo   = JSON.parse(raw)
  utxo.spent   = true
  localStorage.setItem(
    `okkult_utxo_${commitment}`,
    JSON.stringify(utxo)
  )
}

function getUTXOIndex(): string[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem('okkult_utxo_index')
  return raw ? JSON.parse(raw) : []
}
