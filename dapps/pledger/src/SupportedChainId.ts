
export function chainSupported(chainId: number | string) {
    return Object.values(SupportedChainId).includes(Number(chainId))
}

export enum  SupportedChainId {
    LOCALHOST = 31337     
}
