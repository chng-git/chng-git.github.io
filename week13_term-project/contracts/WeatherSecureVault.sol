// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
// [추가된 부분 1] OpenZeppelin의 서명 검증 라이브러리를 가져옵니다.
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract WeatherSecureVault is Ownable, ReentrancyGuard, Pausable {
    // [추가된 부분 2] bytes32 데이터 타입에 ECDSA 라이브러리의 함수들을 적용합니다.
    using ECDSA for bytes32;

    mapping(address => uint256) public balances;
    bool public isRaining;

    // [추가된 부분 3] 오프체인 서버(Node.js)의 지갑 주소를 저장할 변수입니다.
    // 이 주소에서 만든 서명만 유효한 것으로 인정합니다.
    address public oracleSigner;

    // 이미 사용된 서명의 해시값을 기록하여 1회용(OTP)으로 만듭니다.
    mapping(bytes32 => bool) public usedSignatures;

    // [추가된 부분 4] 컨트랙트를 처음 배포할 때, 서버의 지갑 주소를 등록하도록 생성자를 추가합니다.
    constructor(address _oracleSigner) {
        oracleSigner = _oracleSigner;
    }

    // 입금 (기존과 동일)
    function deposit() external payable whenNotPaused {
        balances[msg.sender] += msg.value;
    }

    // 출금 (기존과 동일)
    function withdraw(uint256 amount)
        external
        nonReentrant
        whenNotPaused
    {
        require(balances[msg.sender] >= amount, "Not enough balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    // [핵심 변경: 날씨 상태 업데이트]
    // 1. onlyOwner를 제거했습니다. (서명만 맞다면 서버가 직접 호출할 수 있도록)
    // 2. _timestamp와 _signature를 파라미터로 추가로 받습니다.
    function updateWeatherState(
        bool _rain, 
        uint256 _timestamp, 
        bytes calldata _signature
    ) 
        external 
        whenNotPaused 
    {
        // 방어 로직 1: Replay Attack(재전송 공격) 방지
        // 해커가 과거의 유효했던 트랜잭션을 복사해서 다시 보내는 것을 막기 위해
        // 서명이 생성된 지 5분이 지난 데이터는 폐기합니다.
        require(block.timestamp <= _timestamp + 5 minutes, "Expired signature");
        require(block.timestamp >= _timestamp, "Future timestamp not allowed");

        // 들어온 서명 데이터 자체를 해싱하여 고유 키를 생성합니다.
        bytes32 sigHash = keccak256(_signature);

        // 이미 이 서명이 사용된 적이 있는지 맵을 확인합니다.
        require(!usedSignatures[sigHash], "Signature already used! Replay attack detected.");
        
        // 확인 통과 즉시 해당 서명을 '사용됨' 상태로 잠급니다. (재전송 방어)
        usedSignatures[sigHash] = true;

        // 방어 로직 2: 메시지 해시 복원
        // 오프체인에서 서명했던 내용(_rain, _timestamp)을 똑같이 해싱합니다.
        bytes32 messageHash = keccak256(abi.encodePacked(_rain, _timestamp));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        // 방어 로직 3: 서명으로부터 주소 추출 및 검증
        // 암호학적 서명에서 이를 서명한 주소를 역산출하여, 우리가 등록한 oracleSigner와 맞는지 대조합니다.
        address signer = ethSignedMessageHash.recover(_signature);
        require(signer == oracleSigner, "Invalid oracle signature");

        // 모든 검증이 끝난 안전한 데이터이므로 상태를 업데이트합니다.
        isRaining = _rain;
    }

    // [추가된 부분 5] 비상 대응 함수
    // 만약 오프체인 서버의 개인키(Private Key)가 해킹당했다면? 
    // 보스(Owner)가 재빨리 서버 주소를 다른 것으로 교체할 수 있는 가치 판단 영역입니다.
    function setOracleSigner(address _newSigner) external onlyOwner {
        oracleSigner = _newSigner;
    }

    // 보상 가능 여부 확인 (기존과 동일)
    function canReward()
        public
        view
        returns(bool)
    {
        return isRaining;
    }

    // 긴급 정지 (기존과 동일)
    function pause() external onlyOwner {
        _pause();
    }

    // 긴급 정지 해제 (기존과 동일)
    function unpause() external onlyOwner {
        _unpause();
    }
}