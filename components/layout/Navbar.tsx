'use client'

import Link                from 'next/link'
import { ConnectButton }   from '@rainbow-me/rainbowkit'
import { useAccount }      from 'wagmi'
import { useCompliance }   from '@/hooks/useCompliance'

const NAV_LINKS = [
  { href: '/prove',    label: 'Prove'    },
  { href: '/shield',   label: 'Shield'   },
  { href: '/unshield', label: 'Unshield' },
  { href: '/transfer', label: 'Transfer' },
  { href: '/vote',     label: 'Vote'     },
]

export function Navbar() {
  const { address, isConnected } = useAccount()
  const { hasProof }             = useCompliance(address)

  return (
    <nav className="
      fixed top-0 left-0 right-0 z-50
      bg-bg/90 backdrop-blur-xl
      border-b border-border
      px-6 h-14
      flex items-center justify-between
    ">
      {/* Logo */}
      <Link
        href="/"
        className="font-mono text-lg font-light tracking-[0.3em] text-white hover:text-orange transition-colors"
      >
        OKKULT
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="font-mono text-sm text-gray1 hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Compliance badge */}
        {isConnected && (
          <span className={`
            font-mono text-xs px-2 py-1 rounded
            ${hasProof
              ? 'bg-green/20 text-green-light border border-green/30'
              : 'bg-orange/10 text-orange border border-orange/30'
            }
          `}>
            {hasProof ? 'Compliant' : 'No Proof'}
          </span>
        )}

        {/* Wallet connect */}
        <ConnectButton
          label="Connect"
          accountStatus="address"
          chainStatus="icon"
          showBalance={false}
        />
      </div>
    </nav>
  )
}
