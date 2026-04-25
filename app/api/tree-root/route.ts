import { NextResponse }             from 'next/server'
import { createPublicClient, http } from 'viem'
import { mainnet }                  from 'viem/chains'

const COMPLIANCE_TREE_ABI = [
  {
    name: 'currentRoot',
    type: 'function',
    stateMutability: 'view',
    inputs:  [],
    outputs: [{ type: 'bytes32' }],
  },
  {
    name: 'isRootValid',
    type: 'function',
    stateMutability: 'view',
    inputs:  [],
    outputs: [{ type: 'bool' }],
  },
] as const

export async function GET() {
  try {
    // If ComplianceTree is not yet deployed, return placeholder
    if (!process.env.NEXT_PUBLIC_COMPLIANCE_TREE_ADDRESS) {
      return NextResponse.json({
        root:    '0x' + '0'.repeat(64),
        valid:   false,
        message: 'ComplianceTree not yet deployed',
      })
    }

    const client = createPublicClient({
      chain:     mainnet,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_URL!),
    })

    const [root, valid] = await Promise.all([
      client.readContract({
        address:      process.env.NEXT_PUBLIC_COMPLIANCE_TREE_ADDRESS as `0x${string}`,
        abi:          COMPLIANCE_TREE_ABI,
        functionName: 'currentRoot',
      }),
      client.readContract({
        address:      process.env.NEXT_PUBLIC_COMPLIANCE_TREE_ADDRESS as `0x${string}`,
        abi:          COMPLIANCE_TREE_ABI,
        functionName: 'isRootValid',
      }),
    ])

    return NextResponse.json({ root, valid })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
