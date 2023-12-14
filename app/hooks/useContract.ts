"use client";
import { useHypercertClient } from "./useHypercertClient";

const useContract = () => {
  const { client } = useHypercertClient();

  return { contract: client?.contract };
};

export { useContract };
