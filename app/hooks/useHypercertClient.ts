"use client";
import { HypercertClient, HypercertClientConfig } from "@hypercerts-org/sdk";
import { useEffect, useState } from "react";
import { useNetwork, useWalletClient } from "wagmi";

const isSupportedChain = (chainId: number) => {
  const supportedChainIds = [5, 10, 42220, 11155111]; // Replace with actual chain IDs

  return supportedChainIds.includes(chainId);
};

const useHypercertClient = () => {
  const { chain } = useNetwork();
  const [isLoading, setIsLoading] = useState(false);

  const clientConfig = {
    chain: chain,
    nftStorageToken: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN,
    web3StorageToken: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN,
  } as const;

  const [client, setClient] = useState<HypercertClient | null>(() => {
    if (clientConfig.chain?.id && isSupportedChain(clientConfig.chain.id)) {
      return new HypercertClient(clientConfig);
    }
    return null;
  });

  const {
    data: walletClient,
    isError,
    isLoading: walletClientLoading,
  } = useWalletClient({ chainId: chain?.id });

  useEffect(() => {
    const chainId = chain?.id;
    if (
      chainId &&
      isSupportedChain(chainId) &&
      !walletClientLoading &&
      !isError &&
      walletClient
    ) {
      setIsLoading(true);

      try {
        const config: Partial<HypercertClientConfig> = {
          ...clientConfig,
          chain: { id: chainId },
          walletClient,
        };

        const client = new HypercertClient(config);
        setClient(client);
      } catch (e) {
        console.error(e);
      }
    }

    setIsLoading(false);
  }, [chain?.id, walletClient, walletClientLoading]);

  return { client, isLoading };
};

export { useHypercertClient };
