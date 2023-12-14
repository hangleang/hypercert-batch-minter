"use client";
import { useHypercertClient } from "./useHypercertClient";

const useStorage = () => {
  const { client } = useHypercertClient();

  return { storage: client?.storage };
};

export { useStorage };
