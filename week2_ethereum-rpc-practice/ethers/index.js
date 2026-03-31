require('dotenv').config();
const { ethers } = require('ethers');

async function main() {
    const url = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
    const provider = new ethers.JsonRpcProvider(url);
    const blockNumber = await provider.getBlockNumber();
    console.log(" 최신 블록 번호:", blockNumber);
}
main();