"use client";
import { useHypercertClient } from "@/app/hooks/useHypercertClient";
import {
  Flex,
  Text,
  Heading,
  Spinner,
  Image,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HypercertMetadata, validateMetaData } from "@hypercerts-org/sdk";

const HypercertInfo = ({ uri }: { uri: string }) => {
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
      {metaData ? (
        <Flex
          mt="2em"
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"1em"}
          paddingX={"2em"}
        >
          <Image src={metaData.image} alt="Follow us on Twitter" height={400} />
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Property</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <Heading size={"sm"}>Metadata</Heading>
                </Td>
                <Td>
                  <Link
                    href={
                      uri.startsWith("ipfs://")
                        ? uri
                        : `https://ipfs.io/ipfs/${uri}`
                    }
                    isExternal
                  >
                    {uri}
                  </Link>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Heading size={"sm"}>Name</Heading>
                </Td>
                <Td>
                  <Text>{metaData.name}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Heading size={"sm"}>Description</Heading>
                </Td>
                <Td>
                  <Text>{metaData.description}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Heading size={"sm"}>URL</Heading>
                </Td>
                <Td>
                  <Link href={metaData.external_url} isExternal>
                    {metaData.external_url}
                  </Link>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Heading size={"sm"}>Contributors</Heading>
                </Td>
                <Td>
                  <Text>{metaData.hypercert?.contributors.display_value}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Heading size={"sm"}>Rights</Heading>
                </Td>
                <Td>
                  <Text>{metaData.hypercert?.rights?.display_value}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Heading size={"sm"}>Works</Heading>
                </Td>
                <Td>
                  <Text>{`${metaData.hypercert?.work_scope.display_value} @ ${metaData.hypercert?.work_timeframe.display_value}`}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Heading size={"sm"}>Impact</Heading>
                </Td>
                <Td>
                  <Text>{`${metaData.hypercert?.impact_scope.display_value} @ ${metaData.hypercert?.impact_timeframe.display_value}`}</Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Heading size={"sm"}>Extra</Heading>
                </Td>
                <Td>
                  <Text>{`${JSON.stringify(metaData.properties) || ""}`}</Text>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Flex>
      ) : (
        <Flex
          mt="2em"
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text mb={"2em"}>
            No Hypercert metadata found at{" "}
            <Text as="kbd" fontWeight={"bold"}>
              {uri}
            </Text>
          </Text>
        </Flex>
      )}
    </>
  );
};

export default HypercertInfo;
