'use client'

import { useAccount }      from 'wagmi'
import { ConnectButton }   from '@rainbow-me/rainbowkit'
import { useCompliance }   from '@/hooks/useCompliance'
import { useProof }        from '@/hooks/useProof'

export default function ProvePage() {
  const { address, isConnected } = useAccount()
  const { hasProof, expiryDate } = useCompliance(address)
  const {
    status,
    error,
    txHash,
    generateProof,
    isLoading,
    isDone,
    isError,
  } = useProof(address)

  return (
    <div className="max-w-lg mx-auto px-6 pt-28 pb-20">

      {/* Header */}
      <div className="mb-8">
        <a href="/" className="font-mono text-xs text-gray2 hover:text-gray1 mb-6 block">
          ← Back
        </a>
        <p className="font-mono text-xs text-orange tracking-widest mb-3">
          OKKULT PROOF
        </p>
        <h1 className="text-3xl font-light mb-3">
          Compliance Proof
        </h1>
        <p className="text-gray2 text-sm leading-relaxed">
          Prove your address is not sanctioned.
          Generated locally — your address never leaves your browser.
          Valid 30 days. Fee: 0.001 ETH.
        </p>
      </div>

      {/* Card */}
      <div className="border border-border rounded-2xl p-6 bg-surface">

        {!isConnected ? (
          <div className="text-center py-10">
            <p className="text-gray2 text-sm mb-6">
              Connect your wallet to generate a proof
            </p>
            <ConnectButton label="Connect Wallet" />
          </div>
        ) : (
          <div className="space-y-5">

            {/* Current status */}
            {hasProof && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green/10 border border-green/30">
                <span className="w-2 h-2 bg-green-light rounded-full"/>
                <div>
                  <p className="text-green-light text-sm font-medium">
                    Compliant
                  </p>
                  <p className="text-green/60 text-xs">
                    Valid until {expiryDate}
                  </p>
                </div>
              </div>
            )}

            {/* Steps */}
            <div className="space-y-2">
              {[
                { step: '01', label: 'Sanctions Check',   active: status === 'checking'   },
                { step: '02', label: 'Generate ZK Proof',  active: status === 'generating' },
                { step: '03', label: 'Submit On-Chain',    active: status === 'submitting' },
              ].map(s => (
                <div
                  key={s.step}
                  className={`
                    flex items-center gap-4 p-4 rounded-xl transition-all
                    ${s.active
                      ? 'bg-orange/10 border border-orange/30'
                      : 'bg-border/30'
                    }
                  `}
                >
                  <span className={`font-mono text-xs ${s.active ? 'text-orange' : 'text-gray2'}`}>
                    {s.step}
                  </span>
                  <span className={`text-sm ${s.active ? 'text-white' : 'text-gray2'}`}>
                    {s.label}
                    {s.active && <span className="text-orange ml-2">...</span>}
                  </span>
                </div>
              ))}
            </div>

            {/* Error */}
            {isError && (
              <div className="p-4 bg-red/10 border border-red/30 rounded-xl">
                <p className="text-red-light text-sm">{error}</p>
              </div>
            )}

            {/* Success */}
            {isDone && (
              <div className="p-4 bg-green/10 border border-green/30 rounded-xl">
                <p className="text-green-light text-sm font-medium mb-1">
                  Proof verified on-chain
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
            {!isDone && (
              <button
                onClick={generateProof}
                disabled={isLoading}
                className="
                  w-full py-3 rounded-xl
                  bg-orange hover:bg-orange-light
                  disabled:opacity-40 disabled:cursor-not-allowed
                  text-black font-medium text-sm
                  transition-colors
                "
              >
                {status === 'idle'       && 'Generate Proof — 0.001 ETH'}
                {status === 'checking'   && 'Checking sanctions list...'}
                {status === 'generating' && 'Generating ZK proof...'}
                {status === 'submitting' && 'Submitting to mainnet...'}
                {isError                 && 'Try Again'}
              </button>
            )}

          </div>
        )}
      </div>

      {/* Privacy note */}
      <p className="font-mono text-xs text-gray2/50 text-center mt-4">
        Your wallet address is processed locally.
        Only the ZK proof is submitted on-chain.
      </p>

    </div>
  )
}
