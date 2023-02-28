import { derived, get, writable } from "svelte/store"
  import { configureChains, createClient, fetchEnsName, getAccount, type GetAccountResult } from "@wagmi/core";
  import { arbitrum, mainnet, polygon } from "@wagmi/core/chains";
  import { Web3Modal } from "@web3modal/html";
  import {
    EthereumClient,
    modalConnectors,
    walletConnectProvider,
  } from "@web3modal/ethereum";

const chains = [arbitrum, mainnet, polygon];

// Wagmi Core Client
const { provider } = configureChains(chains, [
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

export const ethClient = writable(new EthereumClient(wagmiClient, chains))

export const web3Modal = derived(ethClient, ($ethClient) => new Web3Modal(
  { projectId: "698bddafdbc932fc6eb19c24ab471c3a" },
  $ethClient
  )
)

export const account = writable<GetAccountResult | undefined>()
export const ensName = writable<string | undefined>()

get(ethClient).watchAccount(async (_account) => {
  if (!_account.isConnected) return  account.set(undefined)
  
  account.set(_account)

  let _ensName: string;
  try {
    _ensName = await fetchEnsName({ address: _account.address})
  } catch {
    return
  }

  ensName.set(_ensName)
})