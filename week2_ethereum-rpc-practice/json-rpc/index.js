require('dotenv').config();

async function run() {
    const url = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: "2.0", 
            method: "eth_blockNumber",
            params: [],
            id: 1
        })
    });
    const data = await response.json();
    console.log(" 최신 블록 번호 (16진수):", data.result);
    console.log(" 최신 블록 번호 (10진수):", parseInt(data.result, 16));

}
run();