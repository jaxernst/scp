import { BigNumber, BigNumberish } from 'ethers';
import { ethers, network } from 'hardhat';

import { bn } from './numbers';

export const currentTimestamp = async (): Promise<BigNumber> => {
  const { timestamp } = await network.provider.send('eth_getBlockByNumber', ['latest', true]);
  return bn(timestamp);
};

const a = async () => console.log((await currentTimestamp()).toString())
a()

export const fromNow = async (seconds: number): Promise<BigNumber> => {
  const now = await currentTimestamp();
  return now.add(seconds);
};

export const lastBlockNumber = async (): Promise<number> => Number(await network.provider.send('eth_blockNumber'));

export const SECOND = 1;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = DAY * 30;