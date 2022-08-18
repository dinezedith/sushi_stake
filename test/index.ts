import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe('SushiStake', async function(){

  let sushiToken:any;
  let sushiStake:any;
  let owner:any;
  let staker1:any;
  let staker2:any;
  let staker3:any;

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
    // Contracts are deployed using the first signer/account by default
      it(`setTaxReceiver as Admin by Owner`,async function(){
        const token = await ethers.getContractFactory("SushiToken");
        sushiToken = await token.deploy();
 
       const stake = await ethers.getContractFactory("SushiStake");
       sushiStake = await stake.deploy(sushiToken.address);
       [owner, staker1, staker2, staker3] = await ethers.getSigners();
        await sushiStake.connect(owner).setTaxReceiver(owner.address)
      });

      it(`SushiStake staking 1`,async function(){
        let stakeAmount = '1000000000000000000';        
        await sushiToken.connect(owner).mint(staker1.address,stakeAmount)
        await sushiToken.connect(staker1).approve(sushiStake.address,stakeAmount)
        await sushiStake.connect(staker1).enter(stakeAmount)
      });


      it(`SushiStake staking 2`,async function(){
          let stakeAmount = '1000000000000000000';
          await sushiToken.connect(owner).mint(staker2.address,stakeAmount)
          await sushiToken.connect(staker2).approve(sushiStake.address,stakeAmount)
          await sushiStake.connect(staker2).enter(stakeAmount)
      });
    
      it(`SushiStake staking 3`,async function(){
        let stakeAmount = '1000000000000000000';          
        await sushiToken.connect(owner).mint(staker3.address,stakeAmount)
        await sushiToken.connect(staker3).approve(sushiStake.address,stakeAmount)
        await sushiStake.connect(staker3).enter(stakeAmount)
      });

      it(`Unstake for user 1`,async function(){
          var userbalanceBefore;
          var userbalanceAfter;
          var currentTime = (await time.latest()) + (time.duration.days(2));
          await time.increaseTo(currentTime);
          userbalanceBefore = await sushiStake.balanceOf(staker1.address)
          console.log(`userbalanceBefore`,Number(userbalanceBefore));
          await sushiStake.connect(staker1).leave()
          userbalanceAfter = await sushiStake.balanceOf(staker1.address)
          console.log(`userbalanceAfter`,Number(userbalanceAfter));
          let yieldcount = await sushiStake.stakeInfo(staker1.address)
          expect(Number(yieldcount[3])).equal(1)
      });
  
      it(`Unstake for user 2`,async function(){
          var userbalanceBefore;
          var userbalanceAfter;
          var currentTime = (await time.latest()) + (time.duration.days(4));
          await time.increaseTo(currentTime);
          userbalanceBefore = await sushiStake.balanceOf(staker2.address)
          console.log(`userbalanceBefore`,Number(userbalanceBefore));
          await sushiStake.connect(staker2).leave();
          userbalanceAfter = await sushiStake.balanceOf(staker2.address)
          console.log(`userbalanceAfter`,Number(userbalanceAfter));
          let yieldcount = await sushiStake.stakeInfo(staker2.address)
          expect(Number(yieldcount[3])).equal(3)
      });

      it(`Unstake for user 3`,async function(){
          var userbalanceBefore;
          var userbalanceAfter;
          var currentTime = (await time.latest()) + (time.duration.days(8));
          await time.increaseTo(currentTime);
          userbalanceBefore = await sushiStake.balanceOf(staker3.address)
          console.log(`userbalanceBefore`,Number(userbalanceBefore));
          await sushiStake.connect(staker3).leave()
          userbalanceAfter = await sushiStake.balanceOf(staker3.address)
          console.log(`userbalanceAfter`,Number(userbalanceAfter));
          let yieldcount = await sushiStake.stakeInfo(staker3.address)
          expect(Number(yieldcount[3])).equal(0)
      });
})