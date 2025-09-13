import { ethers } from "hardhat";

// couleurs pour les logs
const C = { reset:"\x1b[0m", green:"\x1b[32m", red:"\x1b[31m", yellow:"\x1b[33m", cyan:"\x1b[36m" };
const info = (m: string) => console.log(`${C.cyan}[INFO]${C.reset} ${m}`);
const ok = (m: string) => console.log(`${C.green}[SUCCESS]${C.reset} ${m}`);
const warn = (m: string) => console.log(`${C.yellow}[WARN]${C.reset} ${m}`);
const error = (m: string) => console.log(`${C.red}[ERROR]${C.reset} ${m}`);

// defini la supply initiale
function readSupply() {
	// lit la variable d'environnement INITIAL_SUPPLY
	const raw = process.env.INITIAL_SUPPLY;
	if (raw) {
		info(`Utilisation de INITIAL_SUPPLY depuis l'environnement : ${raw}`);
		return ethers.parseUnits(raw, 18);
	} else {
		warn("Aucune variable d'environnement INITIAL_SUPPLY trouvée, utilisation de la valeur par défaut : 1000000");
		return ethers.parseUnits("1000000", 18);
	}
}

async function main() {
	// récupère le compte du déployeur
	info("Récupération du compte du déployeur...");
	const [deployer] = await ethers.getSigners();
	ok(`Adresse du déployeur : ${deployer.address}`);

	// prépare la factory du contrat CM42
	info("Préparation de la factory du contrat CM42...");
	const CM42 = await ethers.getContractFactory("CM42");

	// lit la supply initiale
	info("Lecture de la supply initiale...");
	const supply = readSupply();

	// déploie le contrat CM42
	info("Déploiement du contrat CM42...");
	const token = await CM42.deploy(supply, deployer.address);

	// attend la fin du déploiement
	info("Attente de la fin du déploiement...");
	await token.waitForDeployment();

	// affiche l'adresse du contrat déployé et du déployeur
	ok(`CM42 déployé à l'adresse : ${await token.getAddress()}`);
	info(`Réseau : ${(await ethers.provider.getNetwork()).name}`);
	ok(`Déployeur : ${deployer.address}`);
}

// point d'entrée main avec gestion des erreurs
main().catch((e) => { error(e.message); process.exit(1); });
