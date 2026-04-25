// Fetch Merkle proof from Okkult API
// The API builds the compliance tree from OFAC data
// and returns the path for a given address

export interface MerkleProofData {
  root:         string
  pathElements: string[]
  pathIndices:  number[]
  address:      string
}

export async function fetchMerkleProof(
  address: string
): Promise<MerkleProofData> {
  const res = await fetch(
    `/api/merkle-proof?address=${address}`,
    { method: 'GET' }
  )

  if (res.status === 403) {
    throw new Error('SANCTIONED_ADDRESS')
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch Merkle proof: ${res.status}`)
  }

  return await res.json()
}

export async function fetchCurrentRoot(): Promise<string> {
  const res = await fetch('/api/tree-root')
  if (!res.ok) throw new Error('Failed to fetch tree root')
  const { root } = await res.json()
  return root
}
