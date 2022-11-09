import { expect } from "chai";
import { BigNumberish, providers } from 'ethers';
import { ethers } from 'hardhat';


// Waits for a given block to be mined.
export async function waitForBlock(blockNumber: number) {
  const blockNumber1 = await ethers.provider.getBlockNumber();
  console.log('waitForOneBlock(): blockNumber1 =', blockNumber1);
  let blockNumber2: number = blockNumber1;
  while (blockNumber2 < blockNumber) {
    await ethers.provider.send("evm_increaseTime", [1]);
    await ethers.provider.send("evm_mine", []);
    blockNumber2 = await ethers.provider.getBlockNumber();
    console.log('waitForOneBlock(): blockNumber2 =', blockNumber2);
  }
  expect(blockNumber2).to.equal(blockNumber);
}

// Waits for a block to be mined.
export async function waitForOneBlock() {
  const blockNumber1 = await ethers.provider.getBlockNumber();
  //console.log('waitForOneBlock(): blockNumber1 =', blockNumber1);
  await ethers.provider.send("evm_increaseTime", [1]);
  await ethers.provider.send("evm_mine", []);
  const blockNumber2 = await ethers.provider.getBlockNumber();
  //console.log('waitForOneBlock(): blockNumber2 =', blockNumber2);
}

// Prints transaction response info.
export async function printTransactionResponseInfo(transactionResponse: providers.TransactionResponse) {
  console.log('printTransactionResponseInfo(): transactionResponse.hash =', transactionResponse.hash);
  // console.log('printTransactionResponseInfo(): transactionResponse =', JSON.stringify(transactionResponse, null, 2));  
  let transactionReceipt = await ethers.provider.getTransactionReceipt(transactionResponse.hash);
  // console.log('printTransactionResponseInfo(): transactionReceipt =', JSON.stringify(transactionReceipt, null, 2));
  console.log('printTransactionResponseInfo(): gasUsed =', transactionReceipt.gasUsed.toNumber());
}

// Returns gas used.
export async function getTransactionResponseGasUsed(transactionResponse: providers.TransactionResponse): Promise<number> {
  let transactionReceipt = await ethers.provider.getTransactionReceipt(transactionResponse.hash);
  return transactionReceipt.gasUsed.toNumber();
}

// Get gas cost, in wei, of a transaction.
export async function getGasCost(transactionResponse: any) {
  let transactionReceipt = await ethers.provider.getTransactionReceipt(transactionResponse.hash);
  let gasCost = transactionReceipt.gasUsed.mul(transactionResponse.gasPrice);
  return gasCost;
}

export const advanceTime = async (seconds: BigNumberish): Promise<void> => {
    await ethers.provider.send('evm_increaseTime', [parseInt(seconds.toString())]);
    await ethers.provider.send('evm_mine', []);
  };

  export const advanceTimeHours = async (hours: number): Promise<void> => {
    await ethers.provider.send('evm_increaseTime', [parseInt((hours * 60 * 60).toString())]);
    await ethers.provider.send('evm_mine', []);
  };
  
  export const advanceToTimestamp = async (timestamp: BigNumberish): Promise<void> => {
    await setNextBlockTimestamp(timestamp);
    await ethers.provider.send('evm_mine', []);
  };
  
  export const setNextBlockTimestamp = async (timestamp: BigNumberish): Promise<void> => {
    await ethers.provider.send('evm_setNextBlockTimestamp', [parseInt(timestamp.toString())]);
  };