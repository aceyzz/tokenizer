import { expect } from "chai";
import { ethers } from "hardhat";

const toWei = (n: string) => ethers.parseUnits(n, 18);

// Tests unitaires pour le contrat CM42 sur environnement local Hardhat
// 	1. Déploiement
// 	2. Mint initial à l'owner
// 	3. Transfert entre comptes
// 	4. Approval et transferFrom
// 	5. Burn de tokens
// 	6. Pause et unpause des transferts
describe("CM42", () => {
  it("deploy, mint supply to owner, transfer/approve/burn/pause", async () => {
    const [owner, user] = await ethers.getSigners();
    const initialSupply = toWei("1000000");

    const CM42 = await ethers.getContractFactory("CM42");
    const cm42 = await CM42.deploy(initialSupply, owner.address);
    await cm42.waitForDeployment();

    expect(await cm42.totalSupply()).to.equal(initialSupply);
    expect(await cm42.balanceOf(owner.address)).to.equal(initialSupply);

    await expect(cm42.transfer(user.address, toWei("10"))).to.emit(cm42, "Transfer");
    expect(await cm42.balanceOf(user.address)).to.equal(toWei("10"));

    await expect(cm42.connect(user).approve(owner.address, toWei("5"))).to.emit(cm42, "Approval");
    await expect(cm42.transferFrom(user.address, owner.address, toWei("5"))).to.emit(cm42, "Transfer");
    expect(await cm42.balanceOf(user.address)).to.equal(toWei("5"));

    await expect(cm42.connect(user).burn(toWei("2"))).to.emit(cm42, "Transfer");
    expect(await cm42.totalSupply()).to.equal(toWei("999998"));
    expect(await cm42.balanceOf(user.address)).to.equal(toWei("3"));

    await expect(cm42.pause()).to.emit(cm42, "Paused");
    await expect(cm42.transfer(user.address, 1n)).to.be.revertedWithCustomError(cm42, "EnforcedPause");
    await expect(cm42.unpause()).to.emit(cm42, "Unpaused");
    await expect(cm42.transfer(user.address, 1n)).to.emit(cm42, "Transfer");
  });
});
