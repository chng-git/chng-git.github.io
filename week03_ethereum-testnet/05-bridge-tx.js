const { ethers } = require("ethers");

async function main() {
    const RPC_URL = "https://sepolia.base.org";
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const BRIDGE_TX_HASH = "브릿지_실행한_TX해시값";

    const tx = await provider.getTransaction(BRIDGE_TX_HASH);
    const receipt = await provider.getTransactionReceipt(BRIDGE_TX_HASH);

    console.log('Nonce:', tx.nonce);
    console.log('To (Bridge Contract):', tx.to);
    console.log('Value:', ethers.formatEther(tx.value), 'ETH');
    console.log('Gas Used:', receipt.gasUsed.toString());
    console.log('Status:', receipt.status === 1 ? 'Success' : 'Failed');
}
main();