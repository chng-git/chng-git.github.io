# Week 13 Assignment
*본 프로젝트는 2026-1 블록체인실습 기말 프로젝트로 진행되었습니다.*

[🔗 Week 12 제안서 초안 웹으로 보기](https://chng-git.github.io/week12_term-project-proposal/)
[🔗 Week 13 실제 시연 발표 자료 웹으로 보기](https://chng-git.github.io/week13_term-project/)

<br>

## 프로젝트 개요

  - 본 프로젝트는 이더리움 네트워크(Sepolia Testnet) 상에서 외부 세계의 데이터(날씨)를 안전하게 연동하기 위한 **보안 강화형 하이브리드 스마트 금고**를 구축하는 실습입니다.
  - 단순한 단일 API 호출을 넘어, **다중 오라클 합의**, **생성형 AI(LLM) 환경 분석**, 그리고 암호학적 서명(ECDSA)을 활용한 **리플레이 공격 방어** 로직을 융합하여 오라클 조작 리스크를 원천 차단하는 과정을 체험합니다.


<br>


## 기술 스택
* **Smart Contract (온체인):** Solidity (0.8.20), OpenZeppelin (ECDSA)
* **Infrastructure (배포/테스트):** Hardhat, Sepolia Testnet, MetaMask
* **Middleware (오프체인 서버):** Node.js, Ethers.js, Axios
* **Data & AI (오라클/분석):** OpenWeatherMap API, wttr.in, Google Gemini 2.5 Flash API

<br>


## 실습 상세 내용 
| 단계 | 파일명 | 핵심 기능 | 상세 설명 |
| :---: | :--- | :--- | :--- |
| **1️⃣** | `WeatherSecureVault.sol` | **온체인 스마트 금고** | - 오프체인 미들웨어에서 전달된 데이터를 안전하게 수신하고 기록합니다. <br> - `recoverSigner` 함수를 통해 인가된 오라클의 서명(ECDSA)인지 검증합니다. <br> - `usedSignatures` 매핑을 활용하여 한 번 사용된 서명을 영구 소각(OTP 방식)함으로써 해커의 재전송 공격을 방어합니다. |
| **2️⃣** | `weather.js` | **오프체인 미들웨어** | - `OpenWeatherMap`과 `wttr.in` 두 API의 날씨 데이터를 교차 검증(Consensus)하여 무결성을 확보합니다. <br> - Google Gemini 2.5 Flash AI를 호출하여 날씨에 따른 하드웨어 금고의 물리적 개방 위험도를 정성적으로 분석합니다. <br> - Ethers.js를 사용해 검증된 데이터와 타임스탬프를 해싱하고 암호학적 서명을 생성하여 컨트랙트로 전송합니다. |
| **3️⃣** | `deploy.js` | **인프라 배포** | - 작성된 `WeatherSecureVault` 컨트랙트를 Hardhat 환경을 통해 Sepolia 테스트넷에 안전하게 배포합니다. <br> - 배포 시 초기 오라클 권한(signer)을 서버의 지갑 주소로 안전하게 설정합니다. |

<br>



## 배포 및 테스트 시 주의사항

실습 시 시뮬레이터나 테스트넷 환경에서 트랜잭션 실패(Revert) 및 API 호출 오류를 방지하기 위해 다음 사항들을 반드시 확인해야 합니다.

### 1. 블록체인 시간차 공격 방어망 오작동 극복
`updateWeatherState` 함수는 미래 시간의 조작을 막기 위해 타임스탬프를 검증합니다.
* **현상:** 로컬 컴퓨터 시간과 글로벌 블록체인 노드 시간의 미세한 오차로 인해 `Future timestamp not allowed` 에러가 발생하여 트랜잭션이 거절됩니다.
* **해결:** 오프체인 서버(`weather.js`)에서 서명을 생성할 때 `Math.floor(Date.now() / 1000) - 60`을 적용하여 타임스탬프 버퍼를 부여함으로써 안전하게 우회해야 합니다.

### 2. AI 모델 라이프사이클 종료 대응
오프체인 미들웨어는 Gemini AI를 호출하여 물리적 위험도를 분석합니다.
* **현상:** 구형 AI 모델(`gemini-1.5-flash`)의 서비스 완전 종료(Deprecated)로 인해 `404 Not Found` 에러가 발생하며 서버가 멈춥니다.
* **해결:** `weather.js` 내의 타겟 AI 모델을 구글의 최신 활성 모델인 `gemini-2.5-flash`로 즉각 마이그레이션하여 SDK 아키텍처를 복구해야 합니다.

### 3. 해커의 리플레이 공격(Replay Attack) 방어 시뮬레이션
본 프로젝트는 보안 실습을 위해 일부러 중복된 서명을 전송하는 테스트를 포함합니다.
* **현상:** 방금 성공했던 트랜잭션과 완전히 동일한 데이터 및 서명을 한 번 더 전송하면, 스마트 컨트랙트가 `Signature already used!`라는 에러를 반환하며 강제로 `Revert` 시킵니다.
* **해결:** 이는 오류가 아니라, 1회용 OTP 방어 로직이 정상적으로 작동하여 해커의 공격을 차단했음을 의미하는 **성공적인 보안 방어 로그**입니다.


<br>


## 실행 가이드
해당 리포지토리를 로컬 환경에서 실행하는 방법입니다.

### 1. 클론 및 의존성 설치
```bash
git clone [https://github.com/chng-git/WeatherSecureVault.git](https://github.com/chng-git/WeatherSecureVault.git)
cd WeatherSecureVault
npm install
```

### 2. 환경 변수 세팅 (보안 주의)
프로젝트 루트 경로에 `.env` 파일을 생성하고 아래 항목을 기입합니다. **(GitHub 업로드 시 `.env` 파일은 반드시 `.gitignore`에 포함되어야 합니다.)**
```env
PRIVATE_KEY="메타마스크_지갑_개인키"
GEMINI_API_KEY="구글_제미나이_API_키"
```

### 3. 미들웨어 실행 및 트랜잭션 전송
```bash
npx hardhat run scripts/weather.js --network sepolia
```
*(실행 시 터미널에서 AI 분석 로그와 3단계 보안 합의 과정을 확인할 수 있습니다.)*

---
