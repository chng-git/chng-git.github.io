# Week 9 Assignment 


## 프로젝트 개요
- 본 프로젝트는 **GIWA Sepolia 네트워크**상에서 사용자 정의 ERC-20 스테이블코인인 **Cat Stable(MSC)**을 발행하고, 이를 활용한 **온체인 결제(Payment) 시스템**을 구축하는 실습입니다.
- 고객이 결제하면 스마트 컨트랙트가 자동으로 **3%의 수수료**를 계산하여 본사(Owner)로 예치하고, 나머지 대금을 가맹점(Merchant)에게 즉시 정산하는 투명한 유통 구조를 구현합니다.

---

## Submission Requirements
- **MSC Contract Address:** `0x03110f8F8d366EAF18E8df328c44172ec8708040`
- **Payment Contract Address:** `0x440486044B9583a20512f4CA0f29c5850CF41a33`
- **Approve Transaction Hash:** `0x655da448011a41f595a5d76a8f89dc019f40d4bddb87347c0665f5d8332f710c`
- **Pay Transaction Hash:** `0xd09e4afcef6eb6e92a4be631cf10c9aaffd90915a0c35a6e9a53a2066e20c612`

<br>

---

## 🛠 실습 상세 내용 
| 단계 | 파일명 | 핵심 기능 | 상세 설명 |
| :---: | :--- | :--- | :--- |
| **1️⃣** | `MyStablecoin.sol` | **화폐 발행 (MSC)** | - ERC-20 표준을 준수하는 'Cat Stable(MSC)' 토큰을 배포합니다. <br> - `mint` 함수를 통해 관리자(Owner)가 초기 유동성을 공급하며, 소수점 18자리의 정밀도를 가집니다. |
| **2️⃣** | `MeowPayment.sol` | **결제 및 수수료 분배** | - `pay(uint256)`: 고객으로부터 토큰을 가져와 가맹점과 본사로 분배합니다. <br> - **수수료 로직**: $Amount \times 300 / 10000$ 공식을 통해 결제액의 3%를 컨트랙트에 귀속시키고 나머지를 가맹점에 전송합니다. <br> - `withdrawFees()`: 쌓인 수수료 수익을 관리자가 인출할 수 있는 관리 기능을 포함합니다. |

<br>


-----

## 실습 캡쳐

![01](https://github.com/user-attachments/assets/204ef686-2837-422b-a007-02611e77faea)
![02](https://github.com/user-attachments/assets/8672e44e-7d76-45bd-8995-8260d974bb28)
![03](https://github.com/user-attachments/assets/0bd2f7f1-a6d8-489b-8682-821c106f015c)
![04](https://github.com/user-attachments/assets/1a813c5e-f95e-4e2f-a1b8-fe734e5534ee)
![05](https://github.com/user-attachments/assets/3ba8c310-f855-4032-aa18-06d22635a143)
![06](https://github.com/user-attachments/assets/f1a90990-b90a-42f6-bcf9-b45488c665c4)
![07](https://github.com/user-attachments/assets/9db678e4-0fc1-4e24-aea2-6db70f9c8807)


---

<br>

## ⚠️ 배포 및 테스트 시 주의사항

실제 블록체인 네트워크에서 결제 로직이 정상 작동하기 위해 다음을 반드시 확인해야 합니다.

### ERC-20의 선행 승인(Approve) 절차
`MeowPayment.sol`의 `pay` 함수는 고객의 지갑에서 토큰을 인출하기 위해 `transferFrom`을 사용합니다.
* **현상:** 권한 승인 없이 `pay`를 실행하면 `Gas estimation errored` 또는 `revert`가 발생하며 트랜잭션이 거절됩니다.
* **해결:** 사용자는 결제 전, **MyStablecoin 컨트랙트**에서 `approve` 함수를 호출하여 `MeowPayment` 컨트랙트 주소가 자신의 토큰을 가져갈 수 있도록 허용량(Allowance)을 설정해야 합니다.