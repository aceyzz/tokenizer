import { expect } from "chai";
import { ethers, network } from "hardhat";

// couleurs pour les logs
const C = { reset:"\x1b[0m", green:"\x1b[32m", red:"\x1b[31m", yellow:"\x1b[33m", cyan:"\x1b[36m" };
const info = (m: string) => console.log(`${C.cyan}[INFO]${C.reset} ${m}`);
const ok = (m: string) => console.log(`${C.green}[SUCCESS]${C.reset} ${m}`);
const warn = (m: string) => console.log(`${C.yellow}[WARN]${C.reset} ${m}`);

// check si tout est pret pour les tests (network, addr, bytecode, owner, paused)
async function ensureOwnerAndReady(addr: string) {
  if (network.name !== "bscTestnet") return { skip: true, reason: "network != bscTestnet" };
  if (!addr) return { skip: true, reason: "CM42_ADDR vide" };
  const code = await ethers.provider.getCode(addr);
  if (!code || code === "0x") return { skip: true, reason: "pas de bytecode à l’adresse" };

  const cm42 = await ethers.getContractAt("CM42", addr);
  const ownerAddr = await cm42.owner();
  const [signer] = await ethers.getSigners();
  if (ownerAddr.toLowerCase() !== signer.address.toLowerCase()) {
    return { skip: true, reason: "le signer courant n’est pas owner()" };
  }
  const isPaused = await cm42.paused();
  if (isPaused) {
    info("Contrat en pause → unpause avant test burn");
    await (await cm42.unpause()).wait();
  }
  return { skip: false, cm42 };
}

// --------------------------------------------
// Live tests sur BNB Testnet
// 1. recuper le balance owner
// 2. burn (1 token) → balance et supply doit diminuer
// 3. burnFrom (owner) sans allowance doit etre refusé
// --------------------------------------------
describe("LIVE - Burn (BNB Testnet)", function () {
  let cm42Addr = process.env.CM42_ADDR || "";

  before(function () {
    if (!cm42Addr) this.skip();
  });

  it("burn owner diminue balance et supply, burnFrom sans allowance refusé", async function () {
    const ready = await ensureOwnerAndReady(cm42Addr);
    if (ready.skip) this.skip();
    const cm42 = ready.cm42!;
    const [owner] = await ethers.getSigners();

    const amt = ethers.parseUnits("1", 18);
    const balBefore = await cm42.balanceOf(owner.address);
    const supplyBefore = await cm42.totalSupply();
    info(`OwnerBalanceBefore: ${balBefore.toString()}`);
    info(`TotalSupplyBefore: ${supplyBefore.toString()}`);

    info("Burn owner");
    await (await cm42.connect(owner).burn(amt)).wait();
    ok("Burn owner ok");

    const balAfter = await cm42.balanceOf(owner.address);
    const supplyAfter = await cm42.totalSupply();
    info(`OwnerBalanceAfter: ${balAfter.toString()}`);
    info(`TotalSupplyAfter: ${supplyAfter.toString()}`);

    expect(balAfter).to.equal(balBefore - amt);
    expect(supplyAfter).to.equal(supplyBefore - amt);

    const sub1 = process.env.SUB1_ADDR;
    if (sub1) {
      info("Tentative burnFrom sans allowance");
      await expect(cm42.connect(owner).burnFrom(sub1, amt)).to.be.reverted;
      ok("burnFrom sans allowance refusé");
    } else {
      warn("SUB1_ADDR manquant: skip burnFrom");
    }
  });
});
