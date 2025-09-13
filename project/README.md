# CM42 – Token BEP-20 (BNB Testnet)

## Introduction

J'ai développé un token BEP-20 nommé CM42.  
Le projet tourne sur le testnet BNB.  
J'ai choisi une configuration minimale pour rester simple et robuste.

Lien vers le token [sur BscScan](https://testnet.bscscan.com/token/0xcb1dB15828c84231f37dB7D8eB20008F72acf227)

<br>

## Objectifs

- Déployer un token BEP-20 sur BNB Testnet.  
- Fournir un supply fixe défini au déploiement.  
- Implémenter les extensions standards (burn, pause).  
- Gérer la propriété du contrat avec `Ownable`.  
- Écrire des tests automatisés pour vérifier les comportements clés.  
- Fournir un Makefile pour simplifier l'utilisation.

<br>

## Choix techniques

| Choix               | Justification précise                                                                                                                                                                                                 | Alternatives envisagées                         | Pourquoi pas ces alternatives                                                                                                                                                                      |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Solidity 0.8.30 | Version récente et stable côté compilateur + corrections de sécurité intégrées.<br>Compatible OZ v5 | |
| OpenZeppelin v5 | Lib standard, bien maintenue, API claire, modules ERC20 Burn/Pause/Own.<br>Réduit le code custom et les risques. | Contrats faits maison<br>Solmate | From scratch = plus d’erreurs potentielles si pas de maîtrise (mon cas).<br>Solmate optimise mieux les gas mais sacrifie lisibilité et couverture |
| Hardhat | Suite intégrée (compilation, test, run, forking) + écosystème plugins vaste.<br>DX excellente (stack traces, console.log, tasks). Facile à scripter et CI-friendly. | Foundry<br>Truffle | Foundry très rapide mais impose la toolchain forge + réécriture des habitudes TS/ethers.<br>Truffle est daté et moins maintenu, moins d’outils modernes. |
| ethers v6 | API moderne (BigInt natif), intégration Hardhat, typings solides, tooling et docs à jour. | web3.js<br>viem | web3.js moins ergonomique/typé pour TS.<br>viem encore moins standard dans l’écosystème Hardhat, demande d’adapter davantage scripts/tests. |
| dotenv | Charge unique dans `hardhat.config.ts` → tout hérite des envs.<br>Simple, explicite, évite l’import multiple. | | |
| TypeScript | Typage fort pour scripts/tests, autocomplétion, erreurs à la compile.<br>Réduit les bugs (paramètres, BigInt, addresses). | JavaScript | JS plus rapide à écrire mais laxiste sur les types, plus de pièges runtime. |
| Makefile | Point d’entrée unique (install/compile/test/deploy).<br>Reproductible, explicite, zéro dépendance supplémentaire. | | |



<br>

## Architecture des fichiers

```
project/
│
├── code/                  # sources du projet
│   ├── contracts/         # smart contracts Solidity
│   │   └── CM42.sol
│   ├── scripts/           # scripts Hardhat (deploy, airdrop, demo pause)  -> DEPLACÉS dans `../deployment`
│   ├── test/              # tests automatisés avec Hardhat/Chai
│   ├── hardhat.config.ts  # configuration Hardhat (envs chargées ici)
│   └── package.json       # dépendances Node.js
│
├── documentation/         # README et documentation
│
├── Makefile               # commandes simplifiées
├── .env.example           # exemple d'environnement
└── .env                   # variables réelles (absent du git pour raisons évidentes)
```

<br>

## Variables d'environnement

`.env` doit contenir le strict nécessaire :

```
RPC_URL_BSC_TESTNET=   # URL RPC vers un noeud BNB Testnet
PRIVATE_KEY=           # clé privée du compte déployeur (testnet uniquement)
INITIAL_SUPPLY=        # supply initial en unités entières

CM42_ADDR=             # adresse du contrat après déploiement
SUB1_ADDR=             # compte secondaire pour airdrop
SUB2_ADDR=             # compte secondaire pour airdrop
SUB1_PRIVATE_KEY=      # clé privée SUB1 (pour tests ownership)
```

<br>

## Makefile

J'ai centralisé toutes les commandes utiles :

- `make install` : installe les dépendances.  
- `make compile` : compile les contrats.  
- `make test` : lance tous les tests (locaux + live si env correct).  
- `make deploy` : déploie le contrat CM42 sur BNB Testnet.  
- `make airdrop` : envoie des tokens aux comptes SUB1 et SUB2.  
- `make demo-pause` : démontre le mécanisme pause/unpause.  
- `make demo-ownership` : démontre qu’un non-owner ne peut pas pauser.  
- `make demo-burn` : démontre le burn et burnFrom refusé sans allowance.  
- `make clean` : supprime les fichiers générés.  
- `make lock` : verrouille les dépendances.  

<br>

## Fonctionnalités du token

- **Nom** : CM42  
- **Symbole** : CM42  
- **Décimales** : 18  
- **Supply fixe** : défini au déploiement et minté sur l'adresse owner.  
- **Burn** : chaque détenteur peut détruire ses tokens.  
- **Pause/Unpause** : le owner peut geler les transferts.  
- **Ownable** : un seul owner au départ, transférable si besoin.

<br>

## Tests

J'ai écrit trois catégories de tests :

1. **Unit tests (`cm42.test.ts`)** : vérifient localement le déploiement, le mint, les transferts, les approvals, le burn, et le pause/unpause.  
2. **Live ownership (`live_ownership.test.ts`)** : vérifie sur BNB Testnet que seul le owner peut pauser/unpause et qu’un transfert est bien bloqué pendant la pause.  
3. **Live burn (`live_burn.test.ts`)** : vérifie sur BNB Testnet que le burn réduit balance et supply et que `burnFrom` échoue sans allowance.

Les tests sont centralisés dans `test/` et loguent avec couleurs pour plus de lisibilité.  
Tous les tests passent actuellement.

<br>

## Étapes de fonctionnement

1. Remplir `.env`.  
2. Lancer `make install`.  
3. Compiler et tester avec `make compile` et `make test`.  
4. Déployer avec `make deploy`.  
5. Récupérer l'adresse du contrat et l'ajouter à `.env` (CM42_ADDR).  
6. Faire un airdrop avec `make airdrop`.  
7. Lancer les démos :  
   - `make demo-pause`  
   - `make demo-ownership`  
   - `make demo-burn`
