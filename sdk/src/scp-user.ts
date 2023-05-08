import type { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";

class ScpClient {
  scpHubAddress: string;
  signer: Signer;

  constructor(scpHubAddress: string, signer: Signer) {
    this.scpHubAddress = scpHubAddress;
    this.signer = signer;
  }
}

type ScpUser = {
  signer?: Signer;
  address: string;
  commitmentAddrs: {
    [type: ]
  }[];

};
