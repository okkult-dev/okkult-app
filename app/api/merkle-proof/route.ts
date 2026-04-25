import { NextRequest, NextResponse } from 'next/server'
import { buildPoseidon }             from 'circomlibjs'
import { MerkleTree }                from 'merkletreejs'
import { createPublicClient, http }  from 'viem'
import { mainnet }                   from 'viem/chains'

const CHAINALYSIS = '0x40C57923924B5c5c5455c48D93317139ADDaC8fb'

const CHAINALYSIS_ABI = [
  {
    name: 'isSanctioned',
    type: 'function',
    stateMutability: 'view',
    inputs:  [{ name: 'addr', type: 'address' }],
    outputs: [{ type: 'bool' }],
  },
] as const

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')

  if (!address) {
    return NextResponse.json(
      { error: 'Address required' },
      { status: 400 }
    )
  }

  try {
    // 1. Check Chainalysis oracle on-chain
    const client = createPublicClient({
      chain:     mainnet,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_URL!),
    })

    const sanctioned = await client.readContract({
      address:      CHAINALYSIS as `0x${string}`,
      abi:          CHAINALYSIS_ABI,
      functionName: 'isSanctioned',
      args:         [address as `0x${string}`],
    })

    if (sanctioned) {
      return NextResponse.json(
        { error: 'Address is sanctioned' },
        { status: 403 }
      )
    }

    // 2. Build Merkle proof
    // In production: load pre-built tree from Redis/IPFS
    // For MVP: build simple tree with the clean address
    const poseidon = await buildPoseidon()
    const F        = poseidon.F

    const toLeaf = (addr: string) => {
      const h = poseidon([BigInt(addr)])
      return Buffer.from(F.toString(h, 16).padStart(64, '0'), 'hex')
    }

    // Simple tree for MVP — production uses full compliance set
    const cleanAddresses = [address]
    const leaves         = cleanAddresses.map(toLeaf)

    const tree = new MerkleTree(
      leaves,
      (data: Buffer) => {
        const h = poseidon([BigInt('0x' + data.toString('hex'))])
        return Buffer.from(F.toString(h, 16).padStart(64, '0'), 'hex')
      },
      { sortPairs: false }
    )

    const leaf  = toLeaf(address)
    const proof = tree.getProof(leaf)

    // Pad path to 20 levels
    const pathElements: string[] = proof.map(
      p => '0x' + p.data.toString('hex')
    )
    const pathIndices: number[] = proof.map(
      p => p.position === 'right' ? 1 : 0
    )
    while (pathElements.length < 20) {
      pathElements.push('0x' + '0'.repeat(64))
      pathIndices.push(0)
    }

    return NextResponse.json({
      root:         '0x' + tree.getRoot().toString('hex'),
      pathElements,
      pathIndices,
      address,
    })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
