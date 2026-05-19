# Week 3 Assignment

[🚀 웹에서 실행하기](https://chng-git.github.io/week3_ethereum-testnet)

## 프로젝트 개요
- Ethers.js(v6)를 활용하여 이더리움 테스트넷과 네트워크를 통해 상호작용하는 블록체인 실습 과제입니다.
- 블록체인의 코드를 통해 Nonce, Gas, Signature을 직접 확인합니다.
- 단일 스크립트 실행과 브라우저 환경 두 가지 방식의 인터페이스를 모두 구현했습니다.


## 기술 스택
- **Language & Runtime:** JavaScript, Node.js
- **Blockchain Library:** `ethers.js` (v6.13.4)
- **Frontend UI:** HTML5, Tailwind CSS (CDN)
- **Networks:** Sepolia (L1), Base Sepolia (L2), GIWA Sepolia (L2)



## 실습 상세 내용

| 단계 | 파일명 | 핵심 기능 | 상세 설명 |
| :---: | :--- | :--- | :--- |
| **1️⃣** | `01-check-balance.js` | **잔액 및 상태 조회** | RPC Provider를 연동하여 특정 지갑 주소의 잔액(Balance)과 다음 트랜잭션을 위한 일련번호(Nonce)를 블록체인에서 읽어옵니다. |
| **2️⃣** | `02-send-eth.js` | **트랜잭션 생성 및 송금** | Ethers Wallet 객체를 생성하여 타 주소로 테스트 ETH를 송금(Transaction)합니다. <br>*( *깃허브 업로드 버전에서는 지갑 개인키가 안전하게 제거되어 있습니다.)* |
| **3️⃣** | `03-track-tx.js` | **온체인 데이터 추적** | 발생한 트랜잭션 해시(TX Hash)를 기반으로 블록체인 원장에 기록된 세부 데이터(Nonce, 서명값 r, s, v 등)를 역추적하여 출력합니다. |
| **4️⃣** | `04-verify-sig.js` | **서명 무결성 검증** | 타원곡선 암호(`ecrecover`) 원리를 활용해 서명 데이터(r, s, v)에서 송신자의 공개키(주소)를 수학적으로 복원하고, 실제 송신자(`tx.from`)와 일치하는지 증명합니다. |
| **5️⃣** | `05-bridge-tx.js` | **크로스체인 분석** | L1(Sepolia) ↔ L2(Base/GIWA) 간 브릿지(Bridge) 트랜잭션을 분석하여 스마트 컨트랙트 호출 여부, 가스비(Gas Used), 그리고 최종 실행 상태(Status)를 판별합니다. |