"use client";
import Image from "next/image";
import ClientInfo from "./components/ClientInfo";
import { Flex } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex
      direction={"column"}
      w={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Image
        src="/hypercerts_logo_yellow.png"
        alt="Hypercerts Logo"
        width={180}
        height={37}
        priority
      />
      <ClientInfo />
    </Flex>
  );
}
