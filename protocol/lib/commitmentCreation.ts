import { ethers } from "ethers";
import { deploy } from "../test/helpers/deploy";
import {
  CommitmentHub,
  ICommitment,
  ICommitment__factory,
} from "../typechain-types";
import { CommitContractNames, CommitInitDataTypes, CommitTypeVals, SolidityCommitInitTypes } from "./types";

export async function createCommitment<
  Hub extends CommitmentHub,
  T extends CommitTypeVals
>(hub: Hub, type: T, initData: CommitInitDataTypes[T]): Promise<ICommitment> {

  if ((await hub.commitTemplateRegistry(type)) === ethers.constants.AddressZero) {
    const commit =  await deploy(CommitContractNames[type])
    await (await hub.registerCommitType(type, commit.address)).wait()
  }
  
  const byteData = ethers.utils.defaultAbiCoder.encode(
    SolidityCommitInitTypes[type],
    initData
  );

  const rc = await (await hub.createCommitment(type, byteData)).wait();
  if (!rc.events) throw Error("No events found in tx");

  let commitAddr: string;
  for (const event of rc.events) {
    if (event.event && event.event == "CommitmentCreation") {
      commitAddr = event.args!.commitmentAddr;
    }
  }

  return ICommitment__factory.connect(commitAddr!, hub.signer);
}
