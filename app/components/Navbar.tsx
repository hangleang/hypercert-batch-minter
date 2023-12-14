"use client";
import { Box, Button, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";

export default function Navbar() {
  return (
    <Flex w={"100%"} justifyContent={"space-around"}>
      <Link href="/">
        <Image
          src="/hypercerts_logo_yellow.png"
          alt="Hypercerts Logo"
          width={50}
          height={50}
          priority
        />
      </Link>
      <Spacer />
      <Link as={NextLink} href="/upload" marginRight={"5"}>
        <Button colorScheme="blue" variant="ghost">
          Upload CSV
        </Button>
      </Link>

      <ConnectKitButton />
    </Flex>
  );
}
