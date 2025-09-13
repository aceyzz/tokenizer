.PHONY: help install compile test deploy airdrop demo-pause demo-ownership demo-burn env-check clean lock

LIME := \033[32m
GOLD := \033[33m
RED := \033[31m
BLUE := \033[34m
RST := \033[0m

help:
	@printf "\n"
	@printf "$(BLUE)Commandes disponibles :$(RST)\n"
	@printf "  $(LIME)make install$(RST)        - Installer les dépendances\n"
	@printf "  $(LIME)make compile$(RST)        - Compiler les contrats\n"
	@printf "  $(LIME)make test$(RST)           - Lancer les tests (unit + live si env ok)\n"
	@printf "  $(LIME)make deploy$(RST)         - Déployer CM42 sur BNB Testnet\n"
	@printf "  $(LIME)make airdrop$(RST)        - Envoyer des CM42 à SUB1 et SUB2\n"
	@printf "  $(LIME)make demo-pause$(RST)     - Démo live pause/unpause + ownership\n"
	@printf "  $(LIME)make demo-ownership$(RST) - Alias demo-pause\n"
	@printf "  $(LIME)make demo-burn$(RST)      - Démo live burn\n"
	@printf "\n"
	@printf "$(GOLD)Prérequis .env$(RST): RPC_URL_BSC_TESTNET, PRIVATE_KEY, INITIAL_SUPPLY, CM42_ADDR, SUB1_ADDR, SUB2_ADDR, SUB1_PRIVATE_KEY\n"
	@printf "\n"

install:
	@$(MAKE) --no-print-directory env-check
	cd code && npm ci

env-check:
	@printf "$(BLUE)[CHECK]$(RST) Vérification .env...\n"
	@test -f .env || (printf "$(RED)Erreur: .env manquant$(RST)\n" && exit 1)
	@awk -F= 'BEGIN{split("RPC_URL_BSC_TESTNET PRIVATE_KEY INITIAL_SUPPLY CM42_ADDR SUB1_ADDR SUB2_ADDR SUB1_PRIVATE_KEY",req," ");for(i in req) need[req[i]]=1} /^[A-Za-z_][A-Za-z0-9_]*=/{k=$$1;v=$$2;if(k in need && v!="") have[k]=1} END{for(k in need) if(!(k in have)){print "Variable manquante:",k;missing=1} if(missing) exit 1}' .env
	@printf "$(LIME).env OK.$(RST)\n"

compile:
	@$(MAKE) --no-print-directory install
	cd code && npx hardhat compile

test:
	@$(MAKE) --no-print-directory install
	@printf "$(BLUE)[TEST]$(RST) Unit tests (réseau local)...\n"
	cd code && npx hardhat test
	@printf "$(BLUE)[TEST]$(RST) Live tests (BNB Testnet) si env ok...\n"
	cd code && npx hardhat test test/live_ownership.test.ts --network bscTestnet || true
	cd code && npx hardhat test test/live_burn.test.ts --network bscTestnet || true

deploy:
	@$(MAKE) --no-print-directory env-check
	cd code && NODE_PATH=./node_modules npx hardhat run ../deployment/00_deploy_cm42.ts --network bscTestnet

airdrop:
	@$(MAKE) --no-print-directory env-check
	cd code && NODE_PATH=./node_modules npx hardhat run ../deployment/01_airdrop_cm42.ts --network bscTestnet

demo-pause:
	@$(MAKE) --no-print-directory env-check
	cd code && npx hardhat test test/live_ownership.test.ts --network bscTestnet

demo-ownership:
	@$(MAKE) --no-print-directory demo-pause

demo-burn:
	@$(MAKE) --no-print-directory env-check
	cd code && npx hardhat test test/live_burn.test.ts --network bscTestnet

clean:
	@printf "$(BLUE)[CLEAN]$(RST) Nettoyage des fichiers générés...\n"
	@rm -rf code/node_modules code/artifacts code/cache code/typechain-types

lock:
	@printf "$(BLUE)[LOCK]$(RST) Verrouillage des dépendances...\n"
	cd code && npm i --package-lock-only
