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
    info("Contrat déjà en pause → unpause avant test");
    await (await cm42.unpause()).wait();
  }
  return { skip: false, cm42 };
}

// --------------------------------------------
// Live tests sur BNB Testnet
// 1. recuper le balance owner
// 2. pause (owner) → paused doit etre true
// 3. unpause (owner) → paused doit etre false
// 4. non-owner ne peut pas pause
// 5. non-owner ne peut pas unpause
// --------------------------------------------
describe("LIVE - Ownership + Pause/Unpause (BNB Testnet)", function () {
  let cm42Addr = process.env.CM42_ADDR || "";

  before(function () {
    if (!cm42Addr) this.skip();
  });

  it("non-owner ne peut pas pause, owner peut pause/unpause", async function () {
    const ready = await ensureOwnerAndReady(cm42Addr);
    if (ready.skip) this.skip();
    const cm42 = ready.cm42!;
    info("Récupération des signers");
    const [owner] = await ethers.getSigners();
    const nonOwnerPk = process.env.SUB1_PRIVATE_KEY || "";
    if (!nonOwnerPk) this.skip();
    const nonOwner = new ethers.Wallet(nonOwnerPk, ethers.provider);
    info(`Owner: ${owner.address}`);
    info(`NonOwner: ${nonOwner.address}`);

    info("Tentative de pause par non-owner");
    await expect(cm42.connect(nonOwner).pause()).to.be.reverted;
    ok("Non-owner bloqué sur pause()");

    info("Owner pause");
    await (await cm42.connect(owner).pause()).wait();
    expect(await cm42.paused()).to.equal(true);
    ok("Contrat est en pause");

    info("Transfert bloqué pendant pause");
    const recipient = process.env.SUB1_ADDR || owner.address;
    await expect(cm42.connect(owner).transfer(recipient, 1n)).to.be.reverted;
    ok("Transfert bien bloqué");

    info("Owner unpause");
    await (await cm42.connect(owner).unpause()).wait();
    expect(await cm42.paused()).to.equal(false);
    ok("Contrat unpaused");

    info("Transfert après unpause");
    await (await cm42.connect(owner).transfer(recipient, 1n)).wait();
    ok("Transfert ok après unpause");
  });
});
