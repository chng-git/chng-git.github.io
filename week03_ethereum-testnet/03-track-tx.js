const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("https://sepolia-rpc.giwa.io");
    const txHash = "02번에서_발생한_TX해시값";

    const tx = await provider.getTransaction(txHash);
    
    console.log("Nonce:", tx.nonce);
    console.log("r:", tx.signature.r);
    console.log("s:", tx.signature.s);
    console.log("v:", tx.signature.v);
}
main();