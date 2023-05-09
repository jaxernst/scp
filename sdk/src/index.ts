import "./fetch-polyfill";
import {
  Account,
  Chain,
  Transport,
  WalletClient,
  createPublicClient,
  createWalletClient,
  http,
} from "viem";
import { getHubAddress } from "./scp-helpers";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat, mainnet } from "viem/chains";

export * from "./scp-helpers";

export type ScpContext = ReturnType<typeof createScpContext>;
export type QualifiedWallet = WalletClient<Transport, Chain, Account, true>;

const chains = {
  hardhat,
  mainnet,
} as const;

export function createWalletFromKey(
  chain: "hardhat",
  privateKey: `0x${string}`
): QualifiedWallet {
  return createWalletClient({
    chain: chains[chain],
    transport: http(),
    account: privateKeyToAccount(privateKey),
  });
}

// Make the client, get commitment hub address, and create a signer
export function createScpContext(signer: QualifiedWallet) {
  if (!signer.chain) throw new Error("No chain found on signer");

  const hubAddress = getHubAddress(signer.chain);
  if (!hubAddress) {
    throw new Error(`No hub address found for chain ${signer.chain}`);
  }

  const publicClient = createPublicClient({
    chain: signer.chain,
    transport: http(),
  });

  return {
    wallet: signer,
    userAddress: signer.account?.address,
    chain: signer.chain,
    publicClient,
    hubAddress,
  };
}
