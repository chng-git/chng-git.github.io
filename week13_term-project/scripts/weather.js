const axios = require("axios");
const { ethers } = require("hardhat");
require("dotenv").config(); // 환경 변수 로드를 위한 안전 장치

const CONTRACT_ADDRESS = "0x4cA71854cCb0423E8Aa92F1ff54097130491b933";
const API_KEY = "93b6b8eac752d7caa1eb5fb7d668f753"; // (주의: 실무에서는 API_KEY도 .env로 숨깁니다)

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

  
    //  2. AI 기반 물리적 보안 위험도 분석 (LLM 연동)
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

    const aiResult = await model.generateContent(aiPrompt);
    console.log("📊 [AI 분석 로그]:", aiResult.response.text());
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
    await tx.wait();

    console.log("Weather state updated securely!");


    // 4. 해커 리플레이 공격 시뮬레이션 및 방어 검증
    console.log("\nSimulating hacker replay attack with the EXACT SAME signature...");
    try {
        const tx2 = await vault.updateWeatherState(finalIsRaining, timestamp, signature);
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