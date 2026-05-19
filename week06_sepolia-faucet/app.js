// app.js
let provider, signer, contract;

let balanceHistory = []; // 잔액 기록
let timeLabels = [];     // 시간 기록
let myChart;             // 차트 객체

// HTML 요소 가져오기
const connectBtn = document.getElementById('connectBtn');
const requestBtn = document.getElementById('requestBtn');
const accountArea = document.getElementById('accountArea');
const faucetBalance = document.getElementById('faucetBalance');
const statusDiv = document.getElementById('status');

// 1. 차트 초기화 함수
function initChart() {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: '잔액 (ETH)',
                data: balanceHistory,
                borderColor: '#ff9900',
                fill: false
            }]
        }
    });
}

// 2. 잔액 업데이트 및 차트 그리기 (중복 제거 및 통합)
async function updateBalance() {
    const balance = await provider.getBalance(contractAddress);
    const ethValue = parseFloat(ethers.formatEther(balance));

    faucetBalance.innerText = ethValue;

    // 데이터 기록 추가
    const now = new Date();
    timeLabels.push(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
    balanceHistory.push(ethValue);

    if (!myChart) {
        initChart();
    } else {
        myChart.update(); // 차트 업데이트
    }
}

// 3. 지갑 연결 로직
async function connectWallet() {
    if (window.ethereum) {
        try {
            provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = await provider.getSigner();
            const address = await signer.getAddress();

            accountArea.innerText = `연결된 주소: ${address}`;

            // abi.js에서 정의한 contractAddress와 contractABI를 가져다 씁니다.
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            requestBtn.disabled = false;
            updateBalance();
            connectBtn.innerText = "연결 완료";
        } catch (error) {
            console.log("전체 에러 객체:", error);
            statusDiv.innerText = "실패: " + (error.message || "상세 내역 콘솔 확인");
        }
    } else {
        alert("메타마스크를 설치해주세요!");
    }
}

// 4. 요청 로직
async function requestTokens() {
    try {
        statusDiv.innerText = "요청 처리 중... ";
        const tx = await contract.requestTokens();

        const hash = tx.hash;
        statusDiv.innerHTML = `성공! <a href="https://sepolia.etherscan.io/tx/${hash}" target="_blank">영수증(Etherscan) 확인하기</a>`;

        await tx.wait(); // 트랜잭션 확정 대기
        updateBalance(); // 잔액 및 차트 업데이트
    } catch (error) {
        console.error(error);
        statusDiv.innerText = "실패: " + (error.reason || "알 수 없는 오류");
    }
}

// 5. 버튼에 이벤트 연결
connectBtn.onclick = connectWallet;
requestBtn.onclick = requestTokens;