const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staker", function () {
  let staker1, staker2, staker;
  beforeEach(async function () {
    [staker1, staker2] = await ethers.getSigners();
    const Staker = await ethers.getContractFactory("Staker");
    staker = await Staker.deploy();
    await staker.deployed();
  });

  describe("deployed with the correct values", function () {
    it("staker should have 0 balance", async function () {
      expect(await staker.balances(staker1.address)).to.equal(0);
      expect(await staker.balances(staker2.address)).to.equal(0);
    });
    it("thresholde should be 1 ether", async function () {
      expect(await staker.threshold()).to.equal(ethers.utils.parseEther("1"));
    });
  });

  describe("stake", function () {
    it("address1 should stake 0.2 ether", async function () {
      await staker
        .connect(staker1)
        .stake({ value: ethers.utils.parseEther("0.2") });
      expect(await staker.balances(staker1.address)).to.equal(
        ethers.utils.parseEther("0.2")
      );
      expect(await staker.totalStaked()).to.equal(
        ethers.utils.parseEther("0.2")
      );
    });
  });

  describe("withdraw", function () {
    it("address1 should withdraw 0.2 ether", async function () {
      await staker
        .connect(staker1)
        .stake({ value: ethers.utils.parseEther("0.2") });
      expect(await staker.balances(staker1.address)).to.equal(
        ethers.utils.parseEther("0.2")
      );
      expect(await staker.totalStaked()).to.equal(
        ethers.utils.parseEther("0.2")
      );
      //wait for 32 seconds
      await ethers.provider.send("evm_increaseTime", [32]);
      await ethers.provider.send("evm_mine");

      await staker.connect(staker1).withdraw();
      expect(await staker.balances(staker1.address)).to.equal(0);
    });

    it("can't withdraw before 30 seconds has passed", async function () {
      await staker
        .connect(staker1)
        .stake({ value: ethers.utils.parseEther("0.2") });
      expect(await staker.balances(staker1.address)).to.equal(
        ethers.utils.parseEther("0.2")
      );
      expect(await staker.totalStaked()).to.equal(
        ethers.utils.parseEther("0.2")
      );
      await expect(staker.connect(staker1).withdraw()).to.be.revertedWith(
        "Staking period is not over"
      );
    });
  });

  describe("execute", async function () {
    it("should execute properly", async function () {
      await staker
        .connect(staker1)
        .stake({ value: ethers.utils.parseEther("0.5") });
      await staker
        .connect(staker2)
        .stake({ value: ethers.utils.parseEther("0.6") });
      //wait for 32 seconds
      await ethers.provider.send("evm_increaseTime", [32]);
      await ethers.provider.send("evm_mine");
      await staker.execute();
      expect(await staker.balances(staker1.address)).to.equal(0);
      expect(await staker.totalStaked()).to.equal(0);
    });
  });
});
