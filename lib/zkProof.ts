import { buildPoseidon } from 'circomlibjs'
import { groth16 }       from 'snarkjs'
import { ethers }        from 'ethers'

let poseidon: any = null

async function getPoseidon() {
  if (!poseidon) poseidon = await buildPoseidon()
  return poseidon
}

export interface ProofOutput {
  proof: {
    pi_a: string[]
    pi_b: string[][]
    pi_c: string[]
  }
  publicInputs: {
    root:      string
    nullifier: string
  }
  address:     string
  generatedAt: number
  validUntil:  number
}

// Generate ZK compliance proof — runs entirely in browser
export async function generateComplianceProof(
  address:    string,
  secret:     string,
  merkleData: {
    root:         string
    pathElements: string[]
    pathIndices:  number[]
  }
): Promise<ProofOutput> {
  const pos = await getPoseidon()
  const F   = pos.F

  // Compute nullifier = Poseidon(address, secret)
  const nullifierBig = pos([BigInt(address), BigInt(secret)])
  const nullifier    = '0x' + F.toString(nullifierBig, 16).padStart(64, '0')

  const inputs = {
    address:      BigInt(address).toString(),
    secret:       BigInt(secret).toString(),
    pathElements: merkleData.pathElements.map(p => BigInt(p).toString()),
    pathIndices:  merkleData.pathIndices,
    root:         BigInt(merkleData.root).toString(),
    nullifier:    BigInt(nullifier).toString(),
  }

  const { proof, publicSignals } = await groth16.fullProve(
    inputs,
    '/circuits/compliance.wasm',
    '/circuits/compliance_final.zkey'
  )

  return {
    proof: {
      pi_a: proof.pi_a,
      pi_b: proof.pi_b,
      pi_c: proof.pi_c,
    },
    publicInputs: {
      root:      '0x' + BigInt(publicSignals[0]).toString(16),
      nullifier: '0x' + BigInt(publicSignals[1]).toString(16),
    },
    address,
    generatedAt: Math.floor(Date.now() / 1000),
    validUntil:  Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
  }
}

// Generate and store a random secret
export function generateSecret(): string {
  if (typeof window !== 'undefined') {
    const bytes = new Uint8Array(32)
    window.crypto.getRandomValues(bytes)
    return '0x' + Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }
  return '0x' + ethers.randomBytes(32).toString()
}

export function storeSecret(address: string, secret: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`okkult_secret_${address}`, secret)
  }
}

export function loadSecret(address: string): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(`okkult_secret_${address}`)
  }
  return null
}

// Format proof for Solidity contract
export function formatProofForChain(proof: ProofOutput) {
  return {
    proof_a: proof.proof.pi_a.slice(0, 2).map(BigInt) as [bigint, bigint],
    proof_b: [
      proof.proof.pi_b[0].map(BigInt),
      proof.proof.pi_b[1].map(BigInt),
    ] as [[bigint, bigint], [bigint, bigint]],
    proof_c: proof.proof.pi_c.slice(0, 2).map(BigInt) as [bigint, bigint],
    publicInputs: [
      BigInt(proof.publicInputs.root),
      BigInt(proof.publicInputs.nullifier),
    ] as [bigint, bigint],
  }
}
