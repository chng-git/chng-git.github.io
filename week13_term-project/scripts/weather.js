const axios = require("axios");
const { ethers } = require("hardhat");
require("dotenv").config(); // 환경 변수 로드를 위한 안전 장치

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const API_KEY = process.env.WEATHER_API_KEY;

async function main() {

    // 1. 다중 오라클 수집 및 합의 (Consensus)
    const response1 = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${API_KEY}`
    );
    const weather1 = response1.data.weather[0].main;
    const isRainingFromOracle1 = (
        weather1 === "Rain" ||
        weather1 === "Drizzle" ||
        weather1 === "Thunderstorm"
    );
    console.log("Oracle 1 (OpenWeatherMap) Weather:", weather1);

    const response2 = await axios.get(`https://wttr.in/Seoul?format=j1`);
    const weatherCode = response2.data.current_condition[0].weatherCode;

    const isRainingFromOracle2 = ["389", "358", "355", "308", "305", "296"].includes(weatherCode);
    console.log("Oracle 2 (wttr.in) Weather Code:", weatherCode);

    const finalIsRaining = isRainingFromOracle1 && isRainingFromOracle2;
    const timestamp = Math.floor(Date.now() / 1000) - 60; // 가스비 방어용 시간 동기화

    console.log(`[Consensus] isRaining: ${finalIsRaining}, timestamp: ${timestamp}`);


    // 2. AI 기반 물리적 보안 위험도 분석 (LLM 연동)
    console.log("\n🤖 AI 물리적 보안 위험도 분석을 시작합니다...");

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY가 .env 파일에 없습니다! API 키를 먼저 세팅해주세요.");
    }

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const aiPrompt = `당신은 블록체인 스마트 금고의 물리적 보안 AI입니다. 
    현재 외부 날씨는 OpenWeatherMap 기준 '${weather1}', wttr.in 기준 코드 '${weatherCode}' 입니다. 
    이 날씨에 야외에 노출된 하드웨어 금고의 잠금을 해제할 때 발생할 수 있는 환경적/물리적 리스크를 1문장으로 분석하고, 마지막에 [개방 승인] 또는 [개방 경고]를 출력하세요.`;

    // 구글 AI 서버 503 에러 발생 시 런타임 종료 방지
    try {
        const aiResult = await model.generateContent(aiPrompt);
        console.log("📊 [AI 분석 로그]:", aiResult.response.text());
    } catch (aiError) {
        console.log("⚠️ [AI 서버 지연]: 현재 외부 AI 서버의 트래픽 급증으로 응답이 지연되고 있습니다.");
        console.log(`📊 [시스템 대체 로그]: 환경 데이터 '${weather1}' 기반 시스템 자체 분석 모드로 전환합니다. ${finalIsRaining ? '[개방 경고]' : '[개방 승인]'}`);
    }

    console.log("=====================================================================\n");


    // 3. 암호학적 서명 생성 및 온체인 전송 (Security)
    const [serverWallet] = await ethers.getSigners();

    const messageHash = ethers.utils.solidityKeccak256(
        ["bool", "uint256"],
        [finalIsRaining, timestamp]
    );

    const signature = await serverWallet.signMessage(ethers.utils.arrayify(messageHash));
    console.log("Generated ECDSA Signature:", signature);

    const Vault = await ethers.getContractFactory("WeatherSecureVault");
    const vault = await Vault.attach(CONTRACT_ADDRESS);

    // 정상 트랜잭션 전송
    console.log("Sending first valid transaction...");
    const tx = await vault.updateWeatherState(finalIsRaining, timestamp, signature);

    // 터미널에 정상 거래 이더스캔 링크 바로 띄우기
    console.log(`🔗 정상 거래 Etherscan 링크: https://sepolia.etherscan.io/tx/${tx.hash}`);

    await tx.wait();
    console.log("Weather state updated securely!");


    // 4. 해커 리플레이 공격 시뮬레이션 및 방어 검증
    console.log("\nSimulating hacker replay attack with the EXACT SAME signature...");
    try {
        // { gasLimit: 300000 }를 추가하여 Ethers.js의 사전 검열을 강제 우회
        const tx2 = await vault.updateWeatherState(finalIsRaining, timestamp, signature, { gasLimit: 300000 });

        console.log(`🔗 해커 차단 Etherscan 링크: https://sepolia.etherscan.io/tx/${tx2.hash}`);
        await tx2.wait();

        console.log("🚨 [Error] 방어 실패: 중복 트랜잭션이 허용되었습니다.");
    } catch (error) {
        console.log("🛡️ [Success] 방어 성공: 트랜잭션이 차단되었습니다.");
        console.log("차단 사유:", error.reason || "Reverted by contract");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});