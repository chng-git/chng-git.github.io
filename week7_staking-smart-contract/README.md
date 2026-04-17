# Week 7 Assignment

[🚀 웹에서 실행하기](https://chng-git.github.io/week7_staking-smart-contract) 

## 프로젝트 개요

  - 본 프로젝트는 이더리움 네트워크상에서 자신만의 ERC-20 표준 토큰을 발행하고, 이를 활용한 기초적인 디파이(DeFi) 시스템인 **스테이킹(Staking) 플랫폼**을 구축하는 실습입니다.
  - 사용자는 발행된 토큰을 스마트 컨트랙트 은행에 예치(Stake)하고, 예치된 시간(`block.timestamp` 기반)에 비례하여 초당 보상(Reward)을 획득하는 일련의 토큰 이코노미를 체험합니다.

### 🏦 Sepolia Staking Bank Submission
- **Contract Address:** `0x15eF3E7320BFBeA8d475a8EBBd82C05E1E80B022`
- **Deployment Hash:** `0x8c76d58b2c4bb9375186595ca886415c1509d9553863f54c736f707e98f8cffa`
- **Stake Transaction Hash:** `0x01a1092e520f456a016f8985c5b3703e100760236169856c5b696ea0f4220a4b`
- **Withdraw Transaction Hash:** `0xe92ffae7ba20082f7ce866b2185fa2f2a92b0861fe2e266c0b417cb7765a4c3a`



<br>

---


## 실습 상세 내용 
| 단계 | 파일명 | 핵심 기능 | 상세 설명 |
| :---: | :--- | :--- | :--- |
| **1️⃣** | `CatToken.sol` | **코인 배포** | - ERC-20 인터페이스를 구현하여 고유 토큰(Cat Token, CT)을 발행합니다. <br> - `transfer`를 통한 직접 전송뿐만 아니라, 제3자(은행 컨트랙트)가 내 지갑의 토큰을 안전하게 가져갈 수 있도록 권한을 위임하는 `approve` 및 `transferFrom` 기능을 포함합니다. |
| **2️⃣** | `Staking.sol` | **Staking (예치/보상)** | - `stake(uint256)`: 사용자의 지갑에서 `transferFrom`을 통해 지정된 양의 토큰을 은행 컨트랙트로 예치합니다. <br> - `updateReward(modifier)`: 예치/출금 등 상태가 변할 때마다 가장 최근 업데이트된 시간(`lastUpdate`)을 기준으로 이자를 자동 계산하여 누적합니다. <br> - `withdraw()`: 누적된 이자와 예치 원금을 합산하여 사용자에게 한 번에 반환합니다. |

<br>

---

## ⚠️ 배포 및 테스트 시 주의사항 (Technical Notes)

실습 시 시뮬레이터나 테스트넷 환경에서 트랜잭션 실패를 방지하기 위해 다음 두 가지 사항을 반드시 확인해야 합니다.

### 1. 선행 승인 절차 (Approve First)
`Staking.sol`의 `stake` 함수는 내부적으로 `transferFrom`을 호출합니다. 
* **현상:** 사용자가 `stake` 함수를 바로 실행하면 권한 부족으로 인해 트랜잭션이 거절(Revert)됩니다.
* **해결:** 사용자는 반드시 **CatToken 컨트랙트**에서 `approve` 함수를 먼저 호출하여, `StakingBank` 컨트랙트 주소가 자신의 토큰을 가져갈 수 있도록 허용량을 설정해야 합니다.

### 2. 보상 풀(Reward Pool) 자금 조달
본 컨트랙트의 `withdraw` 함수는 이자를 새로 생성(Mint)하는 방식이 아니라, 컨트랙트가 보유한 토큰을 전송하는 방식입니다.
* **현상:** 스테이킹 은행 컨트랙트에 잔고가 부족하면 사용자가 이자를 포함한 금액을 출금할 수 없습니다.
* **해결:** 컨트랙트 배포 후, **Owner**는 이자로 지급될 충분한 양의 `Cat Token`을 `StakingBank` 컨트랙트 주소로 미리 전송하여 보상 풀을 활성화해야 합니다.