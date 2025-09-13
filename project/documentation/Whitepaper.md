
# CM42 – Whitepaper

*(BEP-20 Token on BNB Testnet)*

## Résumé exécutif

CM42 est un token BEP-20 développé dans le cadre d’un projet pédagogique à l’école 42.  
Le smart contract est déployé sur le BNB Smart Chain Testnet et repose sur une configuration simple, transparente et sécurisée.

L’objectif est de démontrer la maîtrise des standards ERC-20/BEP-20 ainsi que l’intégration de fonctionnalités courantes (`burn`, `pause`, `ownership`), tout en garantissant un déploiement reproductible et une documentation complète.

---

## Vision

La philosophie de CM42 est la **simplicité robuste** :

- un code minimal mais conforme aux standards,
- des choix techniques justifiés et documentés,
- une orientation pédagogique pour illustrer les bonnes pratiques dans la création de tokens.

CM42 n’a pas vocation à devenir un actif spéculatif réel mais à servir de référence d’apprentissage pour l’écosystème blockchain.

---

## Caractéristiques techniques

- **Nom** : CM42
- **Symbole** : CM42
- **Décimales** : 18
- **Standard** : ERC-20 (compatible BEP-20)
- **Réseau** : BNB Smart Chain Testnet
- **Adresse du contrat** : `0xcb1dB15828c84231f37dB7D8eB20008F72acf227`
- **Supply initiale** : définie au déploiement et attribuée au propriétaire

### Extensions activées

- **Burn** : chaque détenteur peut détruire ses propres tokens.
- **Pause / Unpause** : l’owner peut geler et réactiver les transferts.
- **Ownable** : le contrat définit un propriétaire unique, transférable si besoin.

---

## Sécurité et bonnes pratiques

- Utilisation des bibliothèques **OpenZeppelin v5**, largement auditées et maintenues.
- Code écrit en **Solidity 0.8.30**, avec correctifs de sécurité intégrés (SafeMath inclus nativement).
- Propriétaire unique au déploiement pour centraliser les droits critiques (`pause`, `ownership`).
- Supply fixe, pas de mint post-déploiement, réduisant le risque d’inflation arbitraire, pré-requis du sujet.

### Tests automatisés couvrant :

- déploiement et transfert,
- mécanisme d’approval/allowance,
- burn et burnFrom,
- pause/unpause et restrictions d’accès.

---

## Outils et infrastructure

- **Hardhat** : compilation, tests, déploiement et scripts.
- **ethers v6** : interaction avec le contrat et gestion des BigInt.
- **TypeScript** : typage fort pour fiabiliser les scripts.
- **dotenv** : gestion centralisée des variables sensibles.
- **Makefile** : orchestration des commandes (`install`, `compile`, `test`, `deploy`, `demo`).

---

## Utilisation et démonstrations

Les fonctionnalités clés sont illustrées par des démos reproductibles :

- **Airdrop** : distribution de tokens à des adresses définies.
- **Pause/Unpause** : démonstration en live sur testnet que les transferts sont bloqués quand le contrat est en pause.
- **Ownership** : vérification qu’un non-owner ne peut pas effectuer d’actions réservées.
- **Burn** : réduction effective de l’offre en circulation.

Toutes ces démonstrations sont automatisées via `make demo-*` et disponibles dans le dossier `test/`.

---

## Objectifs pédagogiques atteints

- Compréhension et mise en œuvre du standard BEP-20.
- Intégration de fonctionnalités avancées (`burn`, `pause`, `ownership`).
- Déploiement sécurisé sur un réseau public testnet.
- Documentation complète et justification des choix techniques.
- Mise en place d’une infrastructure de test robuste et réplicable.

---

## Conclusion

CM42 illustre comment concevoir, documenter et déployer un token BEP-20 conforme aux standards, sans complexité inutile.  
Ce projet constitue une base de référence pédagogique pour comprendre la logique des contrats intelligents, des extensions ERC-20 et des processus de déploiement/test sur une blockchain publique.

