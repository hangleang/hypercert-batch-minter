"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { assertExists } from "./utils";
import theme from "./theme";
import { sepolia, goerli, optimism, celo } from "wagmi/chains";

// add social logins
import { supportedSocialConnectors } from "@zerodev/wagmi/connectkit";
import { supportedConnectors } from "connectkit";
supportedConnectors.push(...supportedSocialConnectors);

import {
  SocialWalletConnector,
  GoogleSocialWalletConnector,
  FacebookSocialWalletConnector,
  GithubSocialWalletConnector,
  DiscordSocialWalletConnector,
  TwitchSocialWalletConnector,
  TwitterSocialWalletConnector,
} from "@zerodev/wagmi";

const chains = [goerli, sepolia, optimism, celo];
const options = {
  chains,
  options: {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    shimDisconnect: true,
  },
};

// See: https://docs.family.co/connectkit/getting-started#getting-started-section-3-implementation
const wagmiConfig = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: assertExists(
      process.env.NEXT_PUBLIC_ALCHEMY_ID,
      "Alchemy ID not found"
    ), // or infuraId
    walletConnectProjectId: assertExists(
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      "WalletConnect project ID not found"
    ),

    // Required
    appName: "Hypercert starter app",

    // Optional
    appDescription:
      "Hypercert starter app powered by Next.js, ChakraUI and Wagmi",
    appUrl: "https://example.com", // your app's url
    appIcon: "/public/hc_logo_400_400.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    chains,
    connectors: [
      new GoogleSocialWalletConnector(options),
      new FacebookSocialWalletConnector(options),
      new GithubSocialWalletConnector(options),
      new DiscordSocialWalletConnector(options),
      new TwitchSocialWalletConnector(options),
      new TwitterSocialWalletConnector(options),
    ],
    autoConnect: true,
  })
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig config={wagmiConfig}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}
