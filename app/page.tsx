import Link from 'next/link'

const MODULES = [
  {
    href:   '/prove',
    label:  'Okkult Proof',
    desc:   'Prove your address is clean without revealing it.',
    badge:  'Live',
    color:  'green',
  },
  {
    href:   '/shield',
    label:  'Okkult Shield',
    desc:   'Shield any ERC-20 token into a private pool.',
    badge:  'Live',
    color:  'green',
  },
  {
    href:   '/unshield',
    label:  'Unshield',
    desc:   'Withdraw tokens from the shielded pool.',
    badge:  'Live',
    color:  'green',
  },
  {
    href:   '/transfer',
    label:  'Private Transfer',
    desc:   'Transfer privately between 0zk addresses.',
    badge:  'Live',
    color:  'green',
  },
  {
    href:   '/vote',
    label:  'Okkult Vote',
    desc:   'Cast encrypted votes on-chain.',
    badge:  'Beta',
    color:  'orange',
  },
  {
    href:   '/identity',
    label:  'Okkult ID',
    desc:   'Prove identity without revealing data.',
    badge:  'Soon',
    color:  'gray',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">

      {/* Hero */}
      <div className="mb-16">
        <p className="font-mono text-xs text-orange tracking-widest mb-4">
          PRIVACY INFRASTRUCTURE — ETHEREUM MAINNET
        </p>
        <h1 className="text-5xl md:text-6xl font-light leading-tight mb-6">
          Prove everything.
          <br />
          <span className="text-gray2">Reveal nothing.</span>
        </h1>
        <p className="text-gray1 text-lg max-w-xl leading-relaxed">
          Zero-knowledge compliance infrastructure.
          Shield assets, vote privately, and verify identity
          — without revealing sensitive information.
        </p>
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map(mod => (
          <Link
            key={mod.href}
            href={mod.href}
            className="group border border-border rounded-xl p-6 hover:border-orange/40 hover:bg-orange/5 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`
                font-mono text-xs px-2 py-0.5 rounded
                ${mod.color === 'green' ? 'bg-green/20 text-green-light'   : ''}
                ${mod.color === 'orange'? 'bg-orange/20 text-orange'        : ''}
                ${mod.color === 'gray'  ? 'bg-gray3/50 text-gray2'          : ''}
              `}>
                {mod.badge}
              </span>
            </div>
            <h2 className="font-mono font-medium mb-2 text-white">
              {mod.label}
            </h2>
            <p className="text-sm text-gray2 leading-relaxed">
              {mod.desc}
            </p>
            <div className="mt-4 text-orange text-sm group-hover:translate-x-1 transition-transform">
              Open →
            </div>
          </Link>
        ))}
      </div>

    </div>
  )
}
