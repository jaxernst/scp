import { BigNumber, BigNumberish } from 'ethers';
import { network } from 'hardhat';

import { bn } from './numbers';

export function systemTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function getTimestampAtTime(time: string, date = "January 1, 2020"): number {
  return new Date(date + " " + time).getTime() / 1000;
}

export const currentTimestamp = async (): Promise<BigNumber> => {
  const { timestamp } = await network.provider.send('eth_getBlockByNumber', ['latest', true]);
  return bn(timestamp);
};

export const secondsSinceMidnight = async () => {
  const d = new Date(Number(await currentTimestamp()) * 1000)
  return 60 * (d.getHours() * 60 + d.getMinutes()) + d.getSeconds()
}

export const timeOfDaySeconds = (timestamp: number, tzOffsetHrs = 0) => {
  const date = getTzDate(timestamp, tzOffsetHrs)
  return date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()
}

export const getTzDate = (timestamp: number, offsetHrs: number) => {
  const today = new Date();  
  const localoffset = -(today.getTimezoneOffset() / 60); 
  const offset = offsetHrs -localoffset;
  return new Date( new Date(timestamp * 1000).getTime() + offset * 3600 * 1000)
}

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

export const SECONDS_PER_DAY = DAY