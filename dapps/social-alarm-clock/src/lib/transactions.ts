import type { Transaction, ContractReceipt, ContractTransaction } from "ethers";
import { writable } from "svelte/store";

type EthersError = { message?: string };

type AddTxResult =
  | {
      rc: ContractReceipt;
      error?: never;
    }
  | {
      error: EthersError;
      rc?: never;
    };

/**
 * Manage and track transactions made through the frontend
 */
function MakeTransactionStore() {
  const contractTransactionReceipts = writable<ContractReceipt[]>([]);
  const transactionResponses = writable<ContractTransaction[]>([]);

  transactionResponses.subscribe((txs) => {
    if (txs.length === 0) return;
    const lastTx = txs[txs.length - 1];
    lastTx.wait().then((receipt) => {
      contractTransactionReceipts.update((txs) => [...txs, receipt]);
    });
  });

  /**
   * The store's main subscription is for finalized transactions (receipts), but
   * transaction reponses can also be subcribed to
   */
  return {
    subscribe: contractTransactionReceipts.subscribe,
    responses: { subscribe: transactionResponses.subscribe },
    addTransaction: async (
      transaction: Promise<ContractTransaction>
    ): Promise<AddTxResult> => {
      let rc: ContractReceipt;
      try {
        const submittedTx = await transaction;
        transactionResponses.update((txs) => [...txs, submittedTx]);
        rc = await submittedTx.wait();
        contractTransactionReceipts.update((txs) => [...txs, rc]);
      } catch (err) {
        return {
          error: err as EthersError,
        };
      }

      return {
        rc,
      };
    },
  };
}

export const transactions = MakeTransactionStore();
