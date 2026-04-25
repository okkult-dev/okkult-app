import { createConfig, http }        from 'wagmi'
import { mainnet }                   from 'wagmi/chains'
import { getDefaultConfig }          from '@rainbow-me/rainbowkit'

export const config = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(
        process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_URL!
      ),
    },
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
    appName:        'Okkult Protocol',
    appDescription: 'Zero-knowledge privacy infrastructure',
    appUrl:         'https://okkult.io',
    appIcon:        'https://okkult.io/icon.png',
  })
)
