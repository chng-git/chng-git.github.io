const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("https://sepolia-rpc.giwa.io");
    
    const privateKey = "개인키_주소"; 
    const wallet = new ethers.Wallet(privateKey, provider);
    const toAddress = "친구_지갑_주소";

    console.log("송금 중...");
    const tx = await wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther("0.001"),
    });

    const receipt = await tx.wait();
    console.log("✅ 송금 완료! TX Hash:", receipt.hash);
}
main();