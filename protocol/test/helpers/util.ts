export async function repeat(func: CallableFunction, args: any[], times: number): Promise<any[]> {
    const out = [];
    for (let i = 0; i < times; i++) {
      out.push(await (func as any)(...args));
    }
    return out;
  }
  
export const waitAll = async (txs: any[]) => {
    for (const tx of txs) {
      await tx.wait();
    }
  };