'use client'

import { useState }           from 'react'
import { useAccount,
         useReadContract,
         useWalletClient,
         usePublicClient }    from 'wagmi'
import { ConnectButton }      from '@rainbow-me/rainbowkit'
import { parseUnits,
         formatUnits }        from 'viem'
import { useCompliance }      from '@/hooks/useCompliance'
import { ADDRESSES,
         SHIELD_ABI,
         ERC20_ABI }          from '@/lib/contracts'
import { createUTXO,
         computeCommitment }  from '@/lib/utxo'

const TOKENS = [
  { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6  },
  { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
  { symbol: 'DAI',  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
]

type Status = 'idle' | 'approving' | 'shielding' | 'done' | 'error'

export default function ShieldPage() {
  const { address, isConnected }   = useAccount()
  const { hasProof }               = useCompliance(address)
  const { data: walletClient }     = useWalletClient()
  const publicClient               = usePublicClient()

  const [token,   setToken]   = useState(TOKENS[0])
  const [amount,  setAmount]  = useState('')
  const [status,  setStatus]  = useState<Status>('idle')
  const [error,   setError]   = useState('')
  const [txHash,  setTxHash]  = useState('')

  const amountBig = amount
    ? parseUnits(amount, token.decimals)
    : BigInt(0)

  const fee    = amountBig * BigInt(20) / BigInt(10000)
  const netAmt = amountBig - fee

  async function handleShield() {
    if (!address || !walletClient || !publicClient || !amount) return

    try {
      setStatus('approving')
      setError('')

      // 1. Approve token spending
      const approveHash = await walletClient.writeContract({
        address:      token.address as `0x${string}`,
        abi:          ERC20_ABI,
        functionName: 'approve',
        args:         [ADDRESSES.okkultShield, amountBig],
      })
      await publicClient.waitForTransactionReceipt({ hash: approveHash })

      setStatus('shielding')

      // 2. Create UTXO and commitment
      const utxo = await createUTXO(amountBig, token.address, address)

      // 3. Shield (full ZK proof in production)
      // For MVP: submit commitment directly
      const hash = await walletClient.writeContract({
        address:      ADDRESSES.okkultShield,
        abi:          SHIELD_ABI,
        functionName: 'shield',
        args: [
          token.address as `0x${string}`,
          amountBig,
          utxo.commitment as `0x${string}`,
          ['0', '0'] as any,
          [['0', '0'], ['0', '0']] as any,
          ['0', '0'] as any,
        ],
      })

      await publicClient.waitForTransactionReceipt({ hash })
      setTxHash(hash)
      setStatus('done')

    } catch (err: any) {
      setError(err.message || 'Shield failed')
      setStatus('error')
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 pt-28 pb-20">

      <div className="mb-8">
        <a href="/" className="font-mono text-xs text-gray2 hover:text-gray1 mb-6 block">
          ← Back
        </a>
        <p className="font-mono text-xs text-orange tracking-widest mb-3">
          OKKULT SHIELD
        </p>
        <h1 className="text-3xl font-light mb-3">Shield Assets</h1>
        <p className="text-gray2 text-sm">
          Deposit tokens into the private pool. Fee: 0.20%.
        </p>
      </div>

      <div className="border border-border rounded-2xl p-6 bg-surface">

        {!isConnected ? (
          <div className="text-center py-10">
            <ConnectButton label="Connect Wallet" />
          </div>
        ) : !hasProof ? (
          <div className="text-center py-10">
            <p className="text-gray2 text-sm mb-4">
              You need a compliance proof first.
            </p>
            
              href="/prove"
              className="px-6 py-2 bg-orange text-black rounded-xl text-sm font-medium"
            >
              Generate Proof →
            </a>
          </div>
        ) : (
          <div className="space-y-5">

            {/* Token selector */}
            <div>
              <label className="font-mono text-xs text-gray2 mb-2 block">
                Token
              </label>
              <div className="flex gap-2">
                {TOKENS.map(t => (
                  <button
                    key={t.symbol}
                    onClick={() => setToken(t)}
                    className={`
                      flex-1 py-2 rounded-xl font-mono text-sm
                      transition-colors
                      ${token.symbol === t.symbol
                        ? 'bg-orange text-black font-medium'
                        : 'bg-border/50 text-gray1 hover:bg-border'
                      }
                    `}
                  >
                    {t.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount input */}
            <div>
              <label className="font-mono text-xs text-gray2 mb-2 block">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="
                  w-full bg-border/30 border border-border
                  rounded-xl px-4 py-3
                  font-mono text-lg text-white
                  placeholder:text-gray2
                  outline-none focus:border-orange/50
                  transition-colors
                "
              />
            </div>

            {/* Summary */}
            {amount && parseFloat(amount) > 0 && (
              <div className="bg-border/20 rounded-xl p-4 space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-gray2">Amount</span>
                  <span>{amount} {token.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray2">Fee (0.20%)</span>
                  <span className="text-gray2">
                    -{formatUnits(fee, token.decimals)} {token.symbol}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="text-gray2">You receive</span>
                  <span>{formatUnits(netAmt, token.decimals)} {token.symbol}</span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-light text-sm">{error}</p>
            )}

            {/* Success */}
            {status === 'done' && (
              <div className="p-4 bg-green/10 border border-green/30 rounded-xl">
                <p className="text-green-light text-sm font-medium">
                  Assets shielded successfully
                </p>
                
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  className="text-green/60 text-xs hover:text-green-light"
                >
                  View on Etherscan →
                </a>
              </div>
            )}

            {/* Button */}
            {status !== 'done' && (
              <button
                onClick={handleShield}
                disabled={
                  !amount ||
                  parseFloat(amount) <= 0 ||
                  ['approving', 'shielding'].includes(status)
                }
                className="
                  w-full py-3 rounded-xl
                  bg-orange hover:bg-orange-light
                  disabled:opacity-40 disabled:cursor-not-allowed
                  text-black font-medium text-sm
                  transition-colors
                "
              >
                {status === 'idle'      && 'Shield Assets'}
                {status === 'approving' && 'Approving...'}
                {status === 'shielding' && 'Shielding...'}
                {status === 'error'     && 'Try Again'}
              </button>
            )}

          </div>
        )}
      </div>

    </div>
  )
}
