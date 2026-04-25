import { usePublicClient, useWalletClient } from 'wagmi'
import { getContract }                       from 'viem'

// ── Contract Addresses ─────────────────────────────────────
export const ADDRESSES = {
  okkultShield:     process.env.NEXT_PUBLIC_SHIELD_ADDRESS    as `0x${string}`,
  okkultVerifier:   process.env.NEXT_PUBLIC_VERIFIER_ADDRESS  as `0x${string}`,
  okkultVote:       process.env.NEXT_PUBLIC_VOTE_ADDRESS      as `0x${string}`,
  chainalysis:      '0x40C57923924B5c5c5455c48D93317139ADDaC8fb' as `0x${string}`,
}

// ── ABIs ───────────────────────────────────────────────────
export const VERIFIER_ABI = [
  {
    name: 'verifyProof',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'proof_a',      type: 'uint256[2]'    },
      { name: 'proof_b',      type: 'uint256[2][2]' },
      { name: 'proof_c',      type: 'uint256[2]'    },
      { name: 'publicInputs', type: 'uint256[2]'    },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'hasValidProof',
    type: 'function',
    stateMutability: 'view',
    inputs:  [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'proofExpiry',
    type: 'function',
    stateMutability: 'view',
    inputs:  [{ name: 'user', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'ProofVerified',
    type: 'event',
    inputs: [
      { name: 'prover',     type: 'address', indexed: true  },
      { name: 'nullifier',  type: 'bytes32',  indexed: true  },
      { name: 'validUntil', type: 'uint256',  indexed: false },
    ],
  },
] as const

export const SHIELD_ABI = [
  {
    name: 'shield',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token',      type: 'address'       },
      { name: 'amount',     type: 'uint256'       },
      { name: 'commitment', type: 'bytes32'       },
      { name: 'proof_a',   type: 'uint256[2]'    },
      { name: 'proof_b',   type: 'uint256[2][2]' },
      { name: 'proof_c',   type: 'uint256[2]'    },
    ],
    outputs: [],
  },
  {
    name: 'unshield',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token',     type: 'address'       },
      { name: 'amount',    type: 'uint256'       },
      { name: 'nullifier', type: 'bytes32'       },
      { name: 'root',      type: 'bytes32'       },
      { name: 'recipient', type: 'address'       },
      { name: 'proof_a',  type: 'uint256[2]'    },
      { name: 'proof_b',  type: 'uint256[2][2]' },
      { name: 'proof_c',  type: 'uint256[2]'    },
    ],
    outputs: [],
  },
  {
    name: 'privateTransfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'inNullifier',    type: 'bytes32'       },
      { name: 'outCommitment1', type: 'bytes32'       },
      { name: 'outCommitment2', type: 'bytes32'       },
      { name: 'root',           type: 'bytes32'       },
      { name: 'proof_a',        type: 'uint256[2]'    },
      { name: 'proof_b',        type: 'uint256[2][2]' },
      { name: 'proof_c',        type: 'uint256[2]'    },
    ],
    outputs: [],
  },
  {
    name: 'Shielded',
    type: 'event',
    inputs: [
      { name: 'commitment', type: 'bytes32', indexed: true  },
      { name: 'leafIndex',  type: 'uint256', indexed: true  },
      { name: 'token',      type: 'address', indexed: false },
      { name: 'fee',        type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'Unshielded',
    type: 'event',
    inputs: [
      { name: 'nullifier',  type: 'bytes32', indexed: true  },
      { name: 'recipient',  type: 'address', indexed: true  },
      { name: 'token',      type: 'address', indexed: false },
      { name: 'amount',     type: 'uint256', indexed: false },
    ],
  },
] as const

export const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount',  type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs:  [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner',   type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs:  [],
    outputs: [{ type: 'uint8' }],
  },
] as const

// ── Contract hooks ─────────────────────────────────────────
export function useVerifierContract() {
  const publicClient          = usePublicClient()
  const { data: walletClient } = useWalletClient()
  return getContract({
    address: ADDRESSES.okkultVerifier,
    abi:     VERIFIER_ABI,
    client:  { public: publicClient!, wallet: walletClient! },
  })
}

export function useShieldContract() {
  const publicClient          = usePublicClient()
  const { data: walletClient } = useWalletClient()
  return getContract({
    address: ADDRESSES.okkultShield,
    abi:     SHIELD_ABI,
    client:  { public: publicClient!, wallet: walletClient! },
  })
}
