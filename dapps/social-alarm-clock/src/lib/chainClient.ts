import { derived, get, writable } from "svelte/store";
import CommitmentHubAbi from "@scp/sdk/abi/CommitmentHub.json";
import {
  configureChains,
  createClient,
  fetchEnsName,
  fetchSigner,
  type GetAccountResult,
} from "@wagmi/core";
import { mainnet, polygon, hardhat } from "@wagmi/core/chains";
import { Web3Modal } from "@web3modal/html";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import type { ethers } from "ethers";

const chains = [mainnet, polygon, hardhat];

// Wagmi Core Client
export const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "698bddafdbc932fc6eb19c24ab471c3a" }),
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: "698bddafdbc932fc6eb19c24ab471c3a",
    version: "1", // or "2"
    appName: "web3Modal",
    chains,
  }),
  provider,
});

export const w = writable(wagmiClient);

export const ethClient = writable(new EthereumClient(wagmiClient, chains));

export const web3Modal = derived(
  ethClient,
  ($ethClient) =>
    new Web3Modal({ projectId: "698bddafdbc932fc6eb19c24ab471c3a" }, $ethClient)
);

export const account = writable<GetAccountResult | undefined>();
export const signer = writable<ethers.Signer | undefined>();
export const ensName = writable<string | undefined>();

get(ethClient).watchAccount(async (_account) => {
  if (!_account.isConnected) return account.set(undefined);

  account.set(_account);

  let _ensName = await logOnFailure(
    async () => await fetchEnsName({ address: _account.address })
  );
  let _signer = await logOnFailure(async () => await fetchSigner());

  ensName.set(_ensName);
  signer.set(_signer);
});

const logOnFailure = async (func: () => Promise<any>) => {
  try {
    return await func();
  } catch (e) {
    console.error(e);
  }
};
