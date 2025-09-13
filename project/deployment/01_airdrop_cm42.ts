import { ethers } from "hardhat";

// couleurs pour les logs
const C = { reset:"\x1b[0m", green:"\x1b[32m", red:"\x1b[31m", yellow:"\x1b[33m", cyan:"\x1b[36m" };
const info = (m: string) => console.log(`${C.cyan}[INFO]${C.reset} ${m}`);
const ok = (m: string) => console.log(`${C.green}[SUCCESS]${C.reset} ${m}`);
const warn = (m: string) => console.log(`${C.yellow}[WARN]${C.reset} ${m}`);
const error = (m: string) => console.log(`${C.red}[ERROR]${C.reset} ${m}`);

// main pour airdrop de tokens CM42 à 2 adresses
async function main() {
	info("Démarrage du processus d'airdrop...");

	const cm42Addr = process.env.CM42_ADDR!;
	const sub1 = process.env.SUB1_ADDR!;
	const sub2 = process.env.SUB2_ADDR!;
	if (!cm42Addr || !sub1 || !sub2) {
		error("Variables d'environnement manquantes");
		throw new Error("Variables d'environnement manquantes");
	}

	info(`Adresse du contrat CM42 : ${cm42Addr}`);
	info(`Adresse du destinataire 1 : ${sub1}`);
	info(`Adresse du destinataire 2 : ${sub2}`);

	// définition des montants à airdrop
	const amount1 = ethers.parseUnits("100", 18);
	const amount2 = ethers.parseUnits("200", 18);

	info(`Préparation de l'airdrop de 100 CM42 vers ${sub1}`);
	info(`Préparation de l'airdrop de 200 CM42 vers ${sub2}`);

	// récupère le contrat CM42
	const cm42 = await ethers.getContractAt("CM42", cm42Addr);
	const deployer = (await ethers.getSigners())[0].address;
	info(`Déployeur : ${deployer}`);

	// envoie les tokens aux 2 adresses
	info(`Transfert de 100 CM42 vers ${sub1}...`);
	await (await cm42.transfer(sub1, amount1)).wait();
	ok(`100 CM42 envoyés -> ${sub1}`);

	info(`Transfert de 200 CM42 vers ${sub2}...`);
	await (await cm42.transfer(sub2, amount2)).wait();
	ok(`200 CM42 envoyés -> ${sub2}`);

	ok("Processus d'airdrop terminé avec succès.");
}

// point d'entrée main avec gestion des erreurs
main().catch((e) => { error(e.message); process.exit(1); });
