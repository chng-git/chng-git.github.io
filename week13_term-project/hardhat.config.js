require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // .env 파일을 읽어오기 위한 모듈

module.exports = {
  solidity: "0.8.20",
  networks: {
    // 로컬 테스트넷
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    // 실제 Sepolia 테스트넷
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  }
};