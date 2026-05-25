const hre = require("hardhat");

async function main() {
    // Hardhat 로컬 환경의 첫 번째 계정을 서버 지갑으로 가져옵니다.
    const [serverWallet] = await hre.ethers.getSigners();

    const Vault = await hre.ethers.getContractFactory("WeatherSecureVault");

    // [수정된 부분] 배포 시 serverWallet의 주소를 생성자 인자로 전달합니다.
    const vault = await Vault.deploy(serverWallet.address);

    await vault.deployed();

    console.log("Contract deployed to:", vault.address);
    console.log("Registered Oracle Signer:", serverWallet.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});