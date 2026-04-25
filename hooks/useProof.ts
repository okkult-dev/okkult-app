'use client'

import { useState }          from 'react'
import { useWalletClient,
         usePublicClient }   from 'wagmi'
import { parseEther }        from 'viem'
import { generateComplianceProof,
         generateSecret,
         storeSecret,
         loadSecret,
         formatProofForChain } from '@/lib/zkProof'
import { fetchMerkleProof }   from '@/lib/merkle'
import { ADDRESSES,
         VERIFIER_ABI }       from '@/lib/contracts'

export type ProofStatus =
  | 'idle'
  | 'checking'
  | 'generating'
  | 'submitting'
  | 'done'
  | 'error'

export function useProof(address?: string) {
  const [status,  setStatus]  = useState<ProofStatus>('idle')
  const [error,   setError]   = useState<string>('')
  const [txHash,  setTxHash]  = useState<string>('')

  const { data: walletClient } = useWalletClient()
  const publicClient           = usePublicClient()

  async function generateProof() {
    if (!address || !walletClient || !publicClient) return

    try {
      setStatus('checking')
      setError('')

      // 1. Fetch Merkle proof — also checks sanctions
      const merkleData = await fetchMerkleProof(address)

      setStatus('generating')

      // 2. Get or create secret
      let secret = loadSecret(address)
      if (!secret) {
        secret = generateSecret()
        storeSecret(address, secret)
      }

      // 3. Generate ZK proof in browser
      const proof = await generateComplianceProof(
        address, secret, merkleData
      )

      setStatus('submitting')

      // 4. Format for Solidity
      const { proof_a, proof_b, proof_c, publicInputs } =
        formatProofForChain(proof)

      // 5. Submit to OkkultVerifier on Ethereum Mainnet
      const hash = await walletClient.writeContract({
        address:      ADDRESSES.okkultVerifier,
        abi:          VERIFIER_ABI,
        functionName: 'verifyProof',
        args:         [proof_a, proof_b, proof_c, publicInputs],
        value:        parseEther('0.001'),
      })

      await publicClient.waitForTransactionReceipt({ hash })

      setTxHash(hash)
      setStatus('done')

    } catch (err: any) {
      const msg = err.message?.includes('SANCTIONED')
        ? 'This address is on a sanctions list.'
        : err.message || 'Something went wrong.'
      setError(msg)
      setStatus('error')
    }
  }

  return {
    status,
    error,
    txHash,
    generateProof,
    isIdle:       status === 'idle',
    isChecking:   status === 'checking',
    isGenerating: status === 'generating',
    isSubmitting: status === 'submitting',
    isDone:       status === 'done',
    isError:      status === 'error',
    isLoading:    ['checking', 'generating', 'submitting'].includes(status),
  }
}
