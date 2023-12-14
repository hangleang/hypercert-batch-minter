"use client";
import { useHypercertClient } from "@/app/hooks/useHypercertClient";
import { useIndexer } from "@/app/hooks/useIndexer";
import { Flex, Text, Divider, Spinner, SimpleGrid } from "@chakra-ui/react";
import { ConnectKitButton } from "connectkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import HypercertImage from "./HypercertImage";

const ClientInfo = () => {
  const { address, isConnected } = useAccount();
  const { client } = useHypercertClient();
  const { indexer } = useIndexer();
  const [allHypercert, setAllHypercert] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (indexer && address) {
      const getHypercerts = async () => {
        const hypercerts = await indexer.claimsByOwner(
          "0x8f508cef7c94883655751408b9ba80c94937288b"
        );
        if (hypercerts.claims && hypercerts.claims.length > 0)
          console.log(hypercerts);
        setAllHypercert(hypercerts.claims);
      };

      getHypercerts();
    }
    setIsLoading(false);
  }, [indexer, address]);

  if (isLoading) {
    return (
      <Flex
        mt="2em"
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"1em"}
      >
        <Text>Loading Hypercert SDK client...</Text>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
      {client && indexer ? (
        <Flex
          mt="2em"
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text>
            Hypercert SDK client connected to{" "}
            <Text as="kbd" fontWeight={"bold"}>
              {client._config.chain?.name}
            </Text>
          </Text>
          <Divider my="2em" w={"sm"} />

          <Text
            fontWeight={"bold"}
          >{`All Hypercert By Owner: ${address}`}</Text>
          <SimpleGrid
            marginTop={"2em"}
            columns={{ base: 1, md: 2, lg: 3 }}
            gap={"6"}
            spacing="40px"
          >
            {allHypercert.map((item) => (
              <Link key={item.id} href={`/claim/${item.id}`}>
                <HypercertImage uri={item.uri} />
              </Link>
            ))}
          </SimpleGrid>
        </Flex>
      ) : (
        <Flex
          mt="2em"
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text mb={"2em"}>Hypercert SDK client not connected</Text>
          <ConnectKitButton />
        </Flex>
      )}
    </>
  );
};

export default ClientInfo;
