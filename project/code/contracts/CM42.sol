// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// 1. le déployeur est le propriétaire.
// 2. le propriétaire peut créer l'offre initiale pour lui-même.
// 3. le propriétaire peut mettre en pause ou reprendre le contrat.
// 4. tout le monde peut brûler ses propres tokens.
// 5. lorsque le contrat est en pause, personne ne peut transférer de tokens.
// 6. lorsque le contrat n'est pas en pause, tout le monde peut transférer des tokens.
// 7. token : CM42, symbole : CM42.
// 8. offre initiale est définie lors du déploiement.
// 9. offre initiale est attribuée au propriétaire lors du déploiement.
// 10. (implicite) décimales sont 18 (par défaut dans OpenZeppelin).
contract CM42 is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    constructor(uint256 initialSupply, address owner_)
        ERC20("CM42", "CM42")
        Ownable(owner_)
    {
        _mint(owner_, initialSupply);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}
