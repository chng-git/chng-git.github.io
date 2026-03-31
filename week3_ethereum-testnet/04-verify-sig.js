const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("https://sepolia-rpc.giwa.io");
    const txHash = "02번에서_발생한_TX해시값";

    const tx = await provider.getTransaction(txHash);
    
    const txObj = ethers.Transaction.from(tx);
    const recoveredAddress = txObj.from;

    console.log("원래 발신자:", tx.from);
    console.log("서명에서 복원된 주소:", recoveredAddress);
    console.log("일치 여부:", tx.from.toLowerCase() === recoveredAddress.toLowerCase() ? "✅ 검증 성공" : "❌ 실패");
}
main();