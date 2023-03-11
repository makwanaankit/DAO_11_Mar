const hre = require("hardhat");

async function main() {
  const DAO = await hre.ethers.getContractFactory("DAO");
  const dao = await DAO.deploy();
  await dao.deployed();
}

main().catch((erro) => {
  console.log(erro);
  process.exitCode = 1;
});
