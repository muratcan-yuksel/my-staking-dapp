const { ethers } = require("hardhat");

async function main() {
  const stakerContract = await ethers.getContractFactory("Staker");
  const staker = await stakerContract.deploy();
  await staker.deployed();

  console.log("Staker deployed to:", staker.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
