const provider = new ethers.JsonRpcProvider(RPC_URL);
const balance = await provider.getBalance(address);
const nonce = await provider.getTransactionCount(address);
