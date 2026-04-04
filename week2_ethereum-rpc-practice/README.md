# Week 2 Assignment

## 프로젝트 개요
- 블록체인의 노드 통신을 활용하여 이더리움 메인넷의 최신 블록 정보를 조회했습니다.
- raw JSON-RPC와 ethers.js 라이브러리를 구현하여 비교하였습니다.
- (json-rpc) : 'fetch'를 활용하여 API를 JSON-RPC의 규격으로 요청을 보내고, 받은 블록 번호를 10진수로 변환하여 함께 출력하였습니다.
- (ethers) : ethers.js 라이브러리를 이용하여 최신 블록 정보를 불러왔습니다.
- (.gitignore) : API가 직접적으로 노출되지 않게 합니다.


## 실습 상세 내용 및 초기 설정

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
