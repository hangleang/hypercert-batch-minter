"use client";

import Image from "next/image";
import NextLink from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Heading,
  ButtonGroup,
  Button,
  Link,
  Text,
  Center,
  useDisclosure,
} from "@chakra-ui/react";
import CSVReader from "react-csv-reader";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "../components/DataTable";
import {
  usePrepareContractBatchWrite,
  useContractBatchWrite,
} from "@zerodev/wagmi";
import { useAccount, useWaitForTransaction } from "wagmi";
import { TransferRestrictions, formatHypercertData } from "@hypercerts-org/sdk";
import { useContract } from "../hooks/useContract";
import { useStorage } from "../hooks/useStorage";
import { UserOpCall } from "@zerodev/wagmi/dist/types/hooks/usePrepareContractBatchWrite";
import { encodeFunctionData } from "viem";

type HypercertData = {
  uid: string;
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  youtube_url?: string;
  animation_url?: string;
  work_scope?: string;
  work_timeframe?: string;
  impact_scope?: string;
  impact_timeframe?: string;
  contributors?: string;
  rights?: string;
  properties?: string;
  hidden_properties?: string;
};

const columnHelper = createColumnHelper<HypercertData>();

const columns: any = [
  columnHelper.accessor("uid", {
    cell: (info) => info.getValue(),
    header: "UID",
  }),
  columnHelper.accessor("image", {
    cell: (info) => <img src={info.getValue()} />,
    header: "Image",
  }),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: "Name",
  }),
  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
    header: "Description",
  }),
  columnHelper.accessor("external_url", {
    cell: (info) => (
      <Link href={info.getValue()} target="_blank">
        {info.getValue()}
      </Link>
    ),
    header: "External URL",
  }),
  columnHelper.accessor("youtube_url", {
    cell: (info) => (
      <Link href={info.getValue()} target="_blank">
        {info.getValue()}
      </Link>
    ),
    header: "Youtube",
  }),
  columnHelper.accessor("animation_url", {
    cell: (info) => (
      <Link href={info.getValue()} target="_blank">
        {info.getValue()}
      </Link>
    ),
    header: "Animation",
  }),
  columnHelper.accessor("work_scope", {
    cell: (info) => info.getValue(),
    header: "Work Scope",
  }),
  columnHelper.accessor("work_timeframe", {
    cell: (info) => info.getValue(),
    header: "Work Timeframe",
  }),
  columnHelper.accessor("impact_scope", {
    cell: (info) => info.getValue(),
    header: "Impact Scope",
  }),
  columnHelper.accessor("impact_timeframe", {
    cell: (info) => info.getValue(),
    header: "Impact Timeframe",
  }),
  columnHelper.accessor("contributors", {
    cell: (info) => info.getValue(),
    header: "Contributors",
  }),
  columnHelper.accessor("rights", {
    cell: (info) => info.getValue(),
    header: "Rights",
  }),
  columnHelper.accessor("properties", {
    cell: (info) => info.getValue(),
    header: "Properties",
  }),
  columnHelper.accessor("hidden_properties", {
    cell: (info) => info.getValue(),
    header: "Hidden Properties",
  }),
];

const steps = [
  { title: "First", description: "Download Sample CSV" },
  { title: "Second", description: "Upload CSV File" },
  { title: "Third", description: "Preview" },
];

const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
};

// constant params

// Set the total amount of units available
const totalUnits: bigint = 10000n;

// Define the transfer restriction
const transferRestrictions: TransferRestrictions =
  TransferRestrictions.AllowAll;

export default function UploadCSV() {
  const { address, isConnected } = useAccount();
  const { contract } = useContract();
  const { storage } = useStorage();
  const [dataset, setDataset] = useState<HypercertData[]>([]);
  const [metadataCID, setMetadataCID] = useState<string>("");
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  useEffect(() => {
    const storeMetadata = async () => {
      if (dataset.length && storage) {
        const hypercerts = dataset.map(formateHypercert);
        const cid = await storage.nftStorageClient?.storeDirectory(
          hypercerts.map(
            ({ metadata, name }) =>
              new File([JSON.stringify(metadata, null, 2)], name)
          )
        );

        setMetadataCID(cid as string);
      }
    };

    if (isConnected) storeMetadata();
  }, [dataset]);

  // Mint your Hypercert!
  const { config } = usePrepareContractBatchWrite({
    calls: dataset.map((data) => ({
      to: contract?.address,
      data: encodeFunctionData({
        abi: contract?.abi!,
        functionName: "mintClaim",
        args: [
          address,
          totalUnits,
          `ipfs://${metadataCID}/${data.uid}`,
          transferRestrictions,
        ],
      }),
    })) as UserOpCall[],
    enabled: true,
  });

  const {
    sendUserOperation: batchMint,
    isLoading,
    data,
  } = useContractBatchWrite(config);

  useWaitForTransaction({
    hash: data ? data.hash : undefined,
    enabled: !!data,
    onSuccess() {
      console.log("Transaction was successful.");
    },
    onError() {
      alert("Transaction was unsuccessful.");
    },
  });

  const handleBatchMint = async () => {
    if (dataset.length && storage) {
      const hypercerts = dataset.map(formateHypercert);
      const cid = await storage.nftStorageClient?.storeDirectory(
        hypercerts.map(
          ({ metadata, name }) =>
            new File([JSON.stringify(metadata, null, 2)], name)
        )
      );

      batchMint && batchMint();
    }
  };

  const formateHypercert = (data: HypercertData) => {
    const splitValues = (
      value?: string,
      denominator: string = ",",
      limit?: number
    ) => (!!value ? value.split(denominator, limit).map((w) => w.trim()) : []);

    const dateToTimestamp = (dateStr: string): number => {
      let timestamp = Date.parse(dateStr);

      if (isNaN(timestamp)) {
        timestamp = 0;
      }

      return timestamp;
      // const [d, m, y] = dateStr.split(/-|\//).map(Number);
      // const date = new Date(y, m - 1, d);
      // return date.getTime();
    };

    const workTimestamp = splitValues(data.work_timeframe, "→", 2).map(
      dateToTimestamp
    );
    const impactTimestamp = splitValues(data.impact_timeframe, "→", 2).map(
      dateToTimestamp
    );

    // Validate and format your Hypercert metadata
    const {
      data: metadata,
      valid,
      errors,
    } = formatHypercertData({
      version: "0.0.1",
      name: data.name?.toString() || "",
      description: data.description?.toString() || "",
      image: data.image?.toString() || "",
      external_url: data.external_url?.toString() || "",
      rights: splitValues(data.rights),
      contributors: splitValues(data.contributors),
      workScope: splitValues(data.work_scope),
      workTimeframeStart: workTimestamp.at(0) || 0,
      workTimeframeEnd: workTimestamp.at(1) || 0,
      impactScope: splitValues(data.impact_scope),
      impactTimeframeStart: impactTimestamp.at(0) || 0,
      impactTimeframeEnd: impactTimestamp.at(1) || 0,
      properties: [
        {
          trait_type: "uid",
          value: data.uid || "",
        },
        {
          trait_type: "youtube_url",
          value: data.youtube_url || "",
        },
        {
          trait_type: "animation_url",
          value: data.animation_url || "",
        },
      ],
      excludedRights: [],
      excludedImpactScope: [],
      excludedWorkScope: [],
    });

    // Check on errors
    if (!valid) {
      console.error(errors);
    }

    return { metadata, name: data.uid };
  };

  return (
    <Flex
      mt="2em"
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={"2em"}
    >
      <Heading as="h6">{`Batch Mint Hypercert From CSV File`}</Heading>
      <Box width={"70%"} p={"2em"} bg={"Menu"} borderRadius={"1em"}>
        <Flex direction={"column"} gap={"2em"}>
          <Stepper size={"sm"} index={activeStep}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          <Center>
            {activeStep === 0 && (
              <Link
                as={NextLink}
                href="/sample_dataset.csv"
                rel="noopener noreferrer"
              >
                <Button colorScheme="blue" variant="ghost">
                  Download Sample CSV
                </Button>
              </Link>
            )}
            {activeStep === 1 && (
              <CSVReader
                onFileLoaded={(data, fileInfo, originalFile) => {
                  setDataset(data);
                  console.log(data);
                }}
                cssClass="csv-input"
                label=""
                onError={(err) => console.error(err)}
                parserOptions={papaparseOptions}
                inputId="csv-file"
                inputName="csv-file"
              />
            )}
            {activeStep === 2 &&
              (dataset.length ? (
                <DataTable columns={columns} data={dataset} />
              ) : (
                <Text>No dataset available</Text>
              ))}
          </Center>
          <ButtonGroup
            width={"100%"}
            justifyContent={"flex-end"}
            variant="outline"
            gap="2"
          >
            {activeStep !== 0 && (
              <Button onClick={() => setActiveStep(activeStep - 1)}>
                Prev
              </Button>
            )}
            <Button
              onClick={() =>
                activeStep < steps.length
                  ? setActiveStep(activeStep + 1)
                  : handleBatchMint()
              }
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : activeStep == steps.length
                ? "Mint"
                : "Next"}
            </Button>
          </ButtonGroup>
        </Flex>
      </Box>
    </Flex>
  );
}
