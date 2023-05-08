import { Client, HttpTransport, createPublicClient, createTestClient, createWalletClient, http } from "viem";
import { hardhat, mainnet } from "viem/chains";

export type ClientType = "public" | "test";

const clients = {
  wallet: (chain: ) => createWalletClient({
    chain: mainnet,
  })
}


  switch (type) {
    case "public":
      return 
    case "test":
      return 
  }
}
