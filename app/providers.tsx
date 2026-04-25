'use client'

import { WagmiProvider }            from 'wagmi'
import { QueryClient,
         QueryClientProvider }      from '@tanstack/react-query'
import { RainbowKitProvider }       from '@rainbow-me/rainbowkit'
import { ApolloProvider }           from '@apollo/client'
import { config }                   from '@/lib/wagmi'
import { apolloClient }             from '@/lib/apollo'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:       1000 * 12,
      refetchInterval: 1000 * 12,
    },
  },
})

export function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ApolloProvider client={apolloClient}>
            {children}
          </ApolloProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
