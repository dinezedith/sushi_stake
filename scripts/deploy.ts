import { ethers } from "hardhat";

async function main() {

 //Token deployment

  const token = await ethers.getContractFactory("SushiToken");
  const sushiToken = await token.deploy();

  await sushiToken.deployed();

  console.log(`sushiToken deployed to ${sushiToken.address}`);

  //Sushi Stake

  const stake = await ethers.getContractFactory("SushiStake");
  const sushiStake = await stake.deploy(sushiToken.address);

  await sushiStake.deployed();

  console.log(`sushiStake deployed to ${sushiStake.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
