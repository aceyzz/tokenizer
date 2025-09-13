<img title="42_tokenizer" alt="42_tokenizer" src="./utils/banner.png" width="100%">

<br>

# Tokenizer

### 🔗 Ressources

- [Documentation technique complète](./project/documentation/README.md)  
- [Voir le token sur BscScan](https://testnet.bscscan.com/token/0xcb1dB15828c84231f37dB7D8eB20008F72acf227)

<br>

### Objectifs du projet

- Déployer un token **BEP-20** sur **BNB Testnet**  
- Fournir un **supply fixe** défini au déploiement  
- Implémenter des extensions standards : **burn** et **pause/unpause**  
- Gérer la propriété via **Ownable**  
- Écrire des **tests automatisés** (locaux + live testnet)  
- Fournir un **Makefile** pour simplifier l’utilisation  

<br>

### Fonctionnalités principales

- **Nom** : CM42  
- **Symbole** : CM42  
- **Décimales** : 18  
- **Supply fixe** : minté au déploiement sur l’adresse owner  
- **Burn** : chaque détenteur peut détruire ses tokens  
- **Pause/Unpause** : le owner peut geler/reprendre les transferts  
- **Ownership** : un seul owner au départ, transférable si besoin  

<br>

### Stack technique

- **Solidity 0.8.30** + **OpenZeppelin v5** (ERC20, Burnable, Pausable, Ownable)  
- **Hardhat + ethers v6** (déploiement, scripts, tests)  
- **TypeScript** pour typage et robustesse  
- **dotenv** pour la configuration via `.env`  
- **Makefile** pour centraliser les commandes  

<br>

### Tests et démonstrations

- **Unit tests** (Hardhat local)  
- **Live tests** (BNB Testnet) :  
  - Ownership : non-owner bloqué sur pause, owner peut pause/unpause  
  - Burn : diminution de balance/supply et rejet de `burnFrom` sans allowance  

👉 Les logs de tests utilisent un système de **couleurs** pour plus de clarté.  

<br>

### Structure

```
project/
├── code/                  # sources (contracts, scripts, tests, config)
├── documentation/         # documentation technique détaillée
├── Makefile               # commandes simplifiées
├── .env.example           # exemple de configuration
└── utils/banner.png       # visuel du projet
```

<br>

## Grade

> En cours d'évaluation

<br>

This work is published under the terms of **[42 Unlicense](./LICENSE)**.
