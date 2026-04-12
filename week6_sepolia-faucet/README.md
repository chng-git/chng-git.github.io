# Week 6 Assignment

[🚀 웹에서 실행하기](https://chng-git.github.io/week6_sepolia-faucet) 

## 프로젝트 개요

  - 이 프로젝트는 사용자가 테스트넷 이더리움(Sepolia ETH)을 무료로 받을 수 있는 **Faucet 스마트 컨트랙트**를 구축하고, 이를 웹 브라우저에서 직접 조작할 수 있는 **프론트엔드 대시보드(DApp)**를 개발하는 과제입니다.


<br>
----


## 실습 상세 내용 

| 단계 | 파일명 | 핵심 기능 | 상세 설명 |
| :---: | :--- | :--- | :--- |
| **1️⃣** | `Faucet.sol` | **블록체인 동작 로직** | `requestTokens()`로 사용자가 호출 시 정해진 금액(0.01ETH)를 송금합니다. `lockTime`(24시간)과 `lastRequestTime` 매핑을 통해 동일한 지갑 주소가 연속으로 토큰을 가져가는 것을 방지합니다. `withdrawAll()`을 통해 컨트랙트 소유자(Owner)만이 남은 잔액을 회수할 수 있는 권한을 가집니다. |
| **2️⃣** | `index.html` | **사용자 인터페이스** | 사용자가 Faucet과 상호작용하는 웹 페이지의 구조와 디자인을 담당합니다. |
| **3️⃣** | `app.js` | **프론트엔드 로직** |   `connectWallet()`로 MetaMask 연동 및 계정 정보 획득합니다. `updateBalance()`를 통해서 `ethers.js`의 `provider.getBalance`를 통해 컨트랙트 잔액을 조회하고 차트를 업데이트합니다. `requestTokens()`로 컨트랙트의 함수를 실행하고, 트랜잭션 해시를 받아 Etherscan 확인 링크를 생성합니다. |
| **4️⃣** | `abi.js` | **컨트랙트의 설명서(ABI)** | 프론트엔드가 컨트랙트의 어떤 함수를 어떻게 호출해야 하는지 인식하게 합니다. |