"use client";
import { useHypercertClient } from "@/app/hooks/useHypercertClient";
import { Flex, Text, Spinner, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HypercertMetadata, validateMetaData } from "@hypercerts-org/sdk";

const HypercertImage = ({ uri }: { uri: string }) => {
  const { client } = useHypercertClient();
  const [metaData, setMetaData] = useState<HypercertMetadata>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (client) {
      setIsLoading(false);
      const getHypercertMetaData = async () => {
        const metadata = await client.storage.getMetadata(uri);
        const { data, valid, errors } = validateMetaData(metadata);
        if (valid) {
          console.log(data);
          setMetaData(data as HypercertMetadata);
        } else {
          console.log(errors);
        }
      };

      getHypercertMetaData();
    }
  }, [client, uri]);

  if (isLoading) {
    return (
      <Flex
        mt="2em"
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"1em"}
      >
        <Text>{`Loading Hypercert metadata from ${uri}`}</Text>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
      {metaData && (
        <Image src={metaData.image} alt="Follow us on Twitter" height={400} />
      )}
    </>
  );
};

export default HypercertImage;
