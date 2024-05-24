
/**
 * @param {number[]} heroes
 * @param {number[]} monsters
 * @param {number[]} coins
 * @return {number[]}
 */
var maximumCoins = function (heroes, monsters, coins) {
    const monstersAndCoins = new Array(monsters.length);
    initializeMonstersAndCoins(monsters, coins, monstersAndCoins);

    monstersAndCoins.sort((x, y) => x.strength - y.strength);
    calculatePrefixSumCoins(monstersAndCoins);

    return calculateMaxCoinsEachHeroCanCollect(heroes, monstersAndCoins);
};

class MonsterAndCoin {

    /**
     * @param {number} strength
     * @param {number} coin
     */
    constructor(strength, coin) {
        this.strength = strength;
        this.coin = coin;
        this.prefixSumCoins = 0;
    }
}

/**
 * @param {number[]} monsters
 * @param {number[]} coins
 * @param {MonsterAndCoin[]} monstersAndCoins
 * @return {void}
 */
function initializeMonstersAndCoins(monsters, coins, monstersAndCoins) {
    for (let i = 0; i < monsters.length; ++i) {
        monstersAndCoins[i] = new MonsterAndCoin(monsters[i], coins[i]);
    }
}

/**
 * @param {MonsterAndCoin[]} monstersAndCoins
 * @return {void}
 */
function calculatePrefixSumCoins(monstersAndCoins) {
    monstersAndCoins[0].prefixSumCoins = monstersAndCoins[0].coin;
    for (let i = 1; i < monstersAndCoins.length; ++i) {
        monstersAndCoins[i].prefixSumCoins = monstersAndCoins[i - 1].prefixSumCoins + monstersAndCoins[i].coin;
    }
}

/**
 * @param {MonsterAndCoin[]} monstersAndCoins
 * @param {number} heroStrength
 * @return {number}
 */
function binarySearch(monstersAndCoins, heroStrength) {
    let left = 0;
    let right = monstersAndCoins.length - 1;

    while (left <= right) {
        let mid = left + Math.floor((right - left) / 2);
        if (monstersAndCoins[mid].strength <= heroStrength) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return left;
}

/**
 * @param {number[]} heroes
 * @param {MonsterAndCoin[]} monstersAndCoins
 * @return {number[]}
 */
function  calculateMaxCoinsEachHeroCanCollect(heroes, monstersAndCoins) {
    const maxCoinsPerHero = new Array(heroes.length).fill(0);

    for (let i = 0; i < heroes.length; ++i) {
        let rightmostInsertionIndex = binarySearch(monstersAndCoins, heroes[i]) - 1;
        if (rightmostInsertionIndex < 0) {
            continue;
        }
        maxCoinsPerHero[i] = monstersAndCoins[rightmostInsertionIndex].prefixSumCoins;
    }

    return maxCoinsPerHero;
}
