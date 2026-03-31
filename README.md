# 🐾 2026년 1학기 블록체인 실습
20221530 박채원
이 레포지토리는 블록체인 수업의 매주 차 실습 과제와 코드를 기록합니다.

--
## Assignment
| 주차 | 과제명 | 코드 확인 (Code) | 실제 실행 (Web View) |
|:---:|:---|:---:|:---|
| **Week 5** | Solidity Lab 시뮬레이터 | [코드 보기](./week5_solidity-lab-simulator/index.html) | [🚀 웹에서 실행하기](https://chng-git.github.io/week5_solidity-lab-simulator/index.html) |
| **Week 3** | Ethereum Testnet 실습 | [코드 보기](./week3_ethereum-testnet/index.html) | [🚀 웹에서 실행하기](https://chng-git.github.io/week3_ethereum-testnet/index.html) |
| **Week 2** | Ethereum RPC Practice | [폴더 보기](./week2_ethereum-rpc-practice) | (웹 UI 없음) |
| **Week 1** | 블록체인 기초 과제 | [코드 보기](./week1_bitcoin-ethereum-prices/week1_assignmnet04.html) | [🚀 웹에서 실행하기](https://chng-git.github.io/week1_bitcoin-ethereum-prices/week1_assignmnet04.html) |

--

## Week 1 Assignment
- GitHub 계정 생성 및 홈페이지 구축
- 코인의 시세를 실시간으로 반영하는 시세표 제작
  정상적인 업데이트 확인을 위한 오류 안내 문구를 넣었습니다.
  API 호출 제한으로 인하여 실시간 업데이트 주기를 2분으로 최적화하였습니다.

--

## Week 2 Assignment

- 블록체인의 노드 통신을 활용하여 이더리움 메인넷의 최신 블록 정보를 조회했습니다.
- raw JSON-RPC와 ethers.js 라이브러리를 구현하여 비교하였습니다.
- (json-rpc) : 'fetch'를 활용하여 API를 JSON-RPC의 규격으로 요청을 보내고, 받은 블록 번호를 10진수로 변환하여 함께 출력하였습니다.
- (ethers) : ethers.js 라이브러리를 이용하여 최신 블록 정보를 불러왔습니다.
- (.gitignore) : API가 직접적으로 노출되지 않게 합니다.



### 의존성 패키지 설치
'ethers'와 'dotenv' 라이브러리를 사용하기 위해 터미널에 아래 명령어를 입력합니다.
```bash
npm install
```



### (.env) 파일 설정
보안을 위하여 API 키는 직접적으로 노출하지 않습니다.

(.env.example)파일 형식을 참고하여 Infura API 키를 입력할 수 있습니다.



### 실행 방법
  Assignment #3 (json-rpc) 실행
```bash
node json-rpc/index.js
```


  Assignment #4 (ethers.js) 실행
```bash
node ethers/index.js
```

--

## Week 3 Assignment

- Ethers.js(v6)를 활용하여 이더리움 테스트넷과 네트워크를 통해 상호작용하는 블록체인 실습 과제입니다.
- 블록체인의 코드를 통해 Nonce, Gas, Signature을 직접 확인합니다.
- 단일 스크립트 실행과 브라우저 환경 두 가지 방식의 인터페이스를 모두 구현했습니다.


## 기술 스택
- **Language & Runtime:** JavaScript, Node.js
- **Blockchain Library:** `ethers.js` (v6.13.4)
- **Frontend UI:** HTML5, Tailwind CSS (CDN)
- **Networks:** Sepolia (L1), Base Sepolia (L2), GIWA Sepolia (L2)



## 실습 스크립트

| 단계 | 파일명 | 핵심 기능 | 상세 설명 |
| :---: | :--- | :--- | :--- |
| **1️⃣** | `01-check-balance.js` | **잔액 및 상태 조회** | RPC Provider를 연동하여 특정 지갑 주소의 잔액(Balance)과 다음 트랜잭션을 위한 일련번호(Nonce)를 블록체인에서 읽어옵니다. |
| **2️⃣** | `02-send-eth.js` | **트랜잭션 생성 및 송금** | Ethers Wallet 객체를 생성하여 타 주소로 테스트 ETH를 송금(Transaction)합니다. <br>*( *깃허브 업로드 버전에서는 지갑 개인키가 안전하게 제거되어 있습니다.)* |
| **3️⃣** | `03-track-tx.js` | **온체인 데이터 추적** | 발생한 트랜잭션 해시(TX Hash)를 기반으로 블록체인 원장에 기록된 세부 데이터(Nonce, 서명값 r, s, v 등)를 역추적하여 출력합니다. |
| **4️⃣** | `04-verify-sig.js` | **서명 무결성 검증** | 타원곡선 암호(`ecrecover`) 원리를 활용해 서명 데이터(r, s, v)에서 송신자의 공개키(주소)를 수학적으로 복원하고, 실제 송신자(`tx.from`)와 일치하는지 증명합니다. |
| **5️⃣** | `05-bridge-tx.js` | **크로스체인 분석** | L1(Sepolia) ↔ L2(Base/GIWA) 간 브릿지(Bridge) 트랜잭션을 분석하여 스마트 컨트랙트 호출 여부, 가스비(Gas Used), 그리고 최종 실행 상태(Status)를 판별합니다. |
--
## Week 5 Assignment

- 이 프로젝트는 웹 브라우저 상에서 직접 Solidity 코드를 컴파일하고 배포하는 과정을 체험할 수 있도록 만든 **프론트엔드 시뮬레이터**입니다. Remix IDE의 핵심 경험을 모방하여 제작되었습니다.

<br>

###  탭 1: 가시성(Visibility)과 자동화의 이해 (HelloWorld 기본)
* **학습 목표:** `public` 상태 변수의 특성 파악
* **실습 의도:** 상태 변수에 `public` 키워드를 부여했을 때, 이더리움 EVM이 내부적으로 Getter 함수를 자동으로 생성해 준다는 편리함을 시각적으로 체험합니다. (초록색 View 버튼이 자동 생성됨을 확인)

###  탭 2: 캡슐화(Encapsulation)와 가스비(Gas)의 실체 (HelloWorld 확장)
* **학습 목표:** `private` 변수 제어 및 트랜잭션 비용 이해
* **실습 의도:** 1. 데이터를 외부로부터 숨기는(`private`) 객체지향적 캡슐화 개념을 도입합니다.
  2. 데이터를 읽기만 하는 함수(`view`, 가스비 무료)와 데이터를 변경하는 함수(상태 변경, 가스비 소모)를 분리하여 실행해 보며, 블록체인 네트워크에서 **'상태 변경은 곧 비용(ETH 차감)'**이라는 핵심 경제 모델을 깨닫게 합니다.

###  탭 3: 숫자형(Integer) 데이터와 트랜잭션의 이해
* **학습 목표:** 데이터 타입(`int`) 확장 및 직접 구현(Getter/Setter)
* **실습 의도:** 
  1. **트랜잭션의 핵심 데이터:** 앞선 문자열(`string`) 기반 실습에서 벗어나, 실제 블록체인 거래의 핵심인 숫자(`int`)를 다룹니다. 이 숫자는 실제 스마트 컨트랙트에서 **송금할 코인의 수량, 투표할 안건의 번호, 구매할 아이템의 ID** 등을 상징합니다.
  2. **상태 변경 시뮬레이션:** 학생들은 `setNumber(int)` 함수에 직접 특정 숫자(예: 거래 수량이나 선택지)를 입력하고 트랜잭션을 발생시켜 봅니다. 이를 통해 내가 입력한 숫자 데이터가 블록체인 네트워크의 상태(State)를 어떻게 영구적으로 변화시키는지 감각적으로 이해하게 됩니다.
  3. **도전과제 (보안성 강화):** 이렇게 중요한 숫자(자산, 투표 데이터 등)를 누구나 함부로 바꿀 수 없도록, 완전 개방형(`public`)에서 은닉형(`private`)으로 직접 수정해 보는 미션을 통해 스마트 컨트랙트의 기초적인 보안 설계(캡슐화)를 스스로 체득합니다.
 