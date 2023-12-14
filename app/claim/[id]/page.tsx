"use client";
import HypercertInfo from "@/app/components/HypercertInfo";
import { useIndexer } from "@/app/hooks/useIndexer";
import { Divider, Flex, Spinner, Text } from "@chakra-ui/react";
import { HypercertClaimdata } from "@hypercerts-org/sdk";
import { ConnectKitButton } from "connectkit";
import { useEffect, useState } from "react";

export default function Page({ params }: any) {
  const { indexer } = useIndexer();
  const [hypercert, setHypercert] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (indexer && params?.id) {
      setIsLoading(false);
      const getHypercert = async () => {
        const thisHypercert = await indexer.claimById(params.id as string);
        if (thisHypercert) {
          setHypercert(thisHypercert.claim as HypercertClaimdata);
        }
      };

      getHypercert();
    }
  }, [indexer, params?.id]);

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
      {indexer ? (
        <Flex
          mt="2em"
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Divider my="2em" w={"sm"} />
          <Text>The Hypercert ID:</Text>
          <Text as="kbd" fontWeight={"bold"}>
            {hypercert ? hypercert.id : "Loading..."}
          </Text>
          {hypercert && hypercert?.uri && <HypercertInfo uri={hypercert.uri} />}
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
}

// Page.getLayout = function getLayout(page: ReactElement) {
//   return <RootLayout>{page}</RootLayout>;
// };
