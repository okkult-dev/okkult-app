import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        <span className="font-mono text-sm text-gray2">
          Okkult Protocol — MIT License
        </span>

        <div className="flex items-center gap-6 font-mono text-sm text-gray2">
          <Link href="https://okkult.io"             target="_blank" className="hover:text-white transition-colors">okkult.io</Link>
          <Link href="https://x.com/Okkult_"         target="_blank" className="hover:text-white transition-colors">Twitter</Link>
          <Link href="https://github.com/okkult-dev" target="_blank" className="hover:text-white transition-colors">GitHub</Link>
          <Link href="https://docs.okkult.io"        target="_blank" className="hover:text-white transition-colors">Docs</Link>
        </div>

        <span className="font-mono text-xs text-gray2/50">
          Prove everything. Reveal nothing.
        </span>

      </div>
    </footer>
  )
}
