export const shorthandAddress = (address: string) => {
  return "0x" + address.slice(2, 4) + "..." + address.slice(-4)
}