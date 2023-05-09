import {
  Client,
  HttpTransport,
  createPublicClient,
  createTestClient,
  createWalletClient,
  http,
} from "viem";
import { hardhat, mainnet } from "viem/chains";

export type ClientType = "public" | "test";
