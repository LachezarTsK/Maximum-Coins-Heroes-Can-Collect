
var maximumCoins = function(heroes: number[], monsters: number[], coins: number[]): number[] {
    const monstersAndCoins = new Array(monsters.length);
    initializeMonstersAndCoins(monsters, coins, monstersAndCoins);

    monstersAndCoins.sort((x, y) => x.strength - y.strength);
    calculatePrefixSumCoins(monstersAndCoins);

    return calculateMaxCoinsEachHeroCanCollect(heroes, monstersAndCoins);
};

class MonsterAndCoin {
    prefixSumCoins = 0
    constructor(public strength: number, public coin: number) { }
}

function initializeMonstersAndCoins(monsters: number[], coins: number[], monstersAndCoins: MonsterAndCoin[]): void {
    for (let i = 0; i < monsters.length; ++i) {
        monstersAndCoins[i] = new MonsterAndCoin(monsters[i], coins[i]);
    }
}

function calculatePrefixSumCoins(monstersAndCoins: MonsterAndCoin[]): void {
    monstersAndCoins[0].prefixSumCoins = monstersAndCoins[0].coin;
    for (let i = 1; i < monstersAndCoins.length; ++i) {
        monstersAndCoins[i].prefixSumCoins = monstersAndCoins[i - 1].prefixSumCoins + monstersAndCoins[i].coin;
    }
}

function binarySearch(monstersAndCoins: MonsterAndCoin[], heroStrength: number): number {
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

function calculateMaxCoinsEachHeroCanCollect(heroes: number[], monstersAndCoins: MonsterAndCoin[]): number[] {
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
