'use client'

import { useReadContract }  from 'wagmi'
import { ADDRESSES, VERIFIER_ABI } from '@/lib/contracts'

export function useCompliance(address?: string) {
  const { data: hasProof, isLoading: loadingProof, refetch } =
    useReadContract({
      address:      ADDRESSES.okkultVerifier,
      abi:          VERIFIER_ABI,
      functionName: 'hasValidProof',
      args:         [address as `0x${string}`],
      query:        { enabled: !!address && !!ADDRESSES.okkultVerifier },
    })

  const { data: expiry } = useReadContract({
    address:      ADDRESSES.okkultVerifier,
    abi:          VERIFIER_ABI,
    functionName: 'proofExpiry',
    args:         [address as `0x${string}`],
    query:        { enabled: !!address && !!hasProof },
  })

  return {
    hasProof:    hasProof as boolean | undefined,
    expiry:      expiry   as bigint  | undefined,
    isLoading:   loadingProof,
    refetch,
    expiryDate:  expiry
      ? new Date(Number(expiry) * 1000).toLocaleDateString()
      : null,
  }
}
