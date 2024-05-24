
package main

import (
	"fmt"
	"sort"
)

type MonsterAndCoin struct {
	Strength       int
	Coin           int
	PrefixSumCoins int64
}

func NewMonsterAndCoin(strength, coin int) *MonsterAndCoin {
	monsterAndCoin := MonsterAndCoin{}
	monsterAndCoin.Strength = strength
	monsterAndCoin.Coin = coin
	monsterAndCoin.PrefixSumCoins = 0
	return &monsterAndCoin
}

func maximumCoins(heroes []int, monsters []int, coins []int) []int64 {
	var monstersAndCoins = make([]MonsterAndCoin, len(monsters))
	initializeMonstersAndCoins(&monsters, &coins, &monstersAndCoins)

	sort.Slice(monstersAndCoins, func(i, j int) bool { return monstersAndCoins[i].Strength < monstersAndCoins[j].Strength })

	calculatePrefixSumCoins(&monstersAndCoins)

	return calculateMaxCoinsEachHeroCanCollect(&heroes, &monstersAndCoins)
}

func initializeMonstersAndCoins(monsters *[]int, coins *[]int, monstersAndCoins *[]MonsterAndCoin) {
	for i := range *monsters {
		(*monstersAndCoins)[i] = *NewMonsterAndCoin((*monsters)[i], (*coins)[i])
	}
}

func calculatePrefixSumCoins(monstersAndCoins *[]MonsterAndCoin) {
	(*monstersAndCoins)[0].PrefixSumCoins = int64((*monstersAndCoins)[0].Coin)
	for i := 1; i < len((*monstersAndCoins)); i++ {
		(*monstersAndCoins)[i].PrefixSumCoins =
			(*monstersAndCoins)[i-1].PrefixSumCoins + int64((*monstersAndCoins)[i].Coin)
	}
}

func binarySearch(monstersAndCoins *[]MonsterAndCoin, heroStrength int) int {
	var left = 0
	var right = len(*monstersAndCoins) - 1

	for left <= right {
		var mid = left + (right-left)/2
		if (*monstersAndCoins)[mid].Strength <= heroStrength {
			left = mid + 1
		} else {
			right = mid - 1
		}
	}
	return left
}

func calculateMaxCoinsEachHeroCanCollect(heroes *[]int, monstersAndCoins *[]MonsterAndCoin) []int64 {
	var maxCoinsPerHero = make([]int64, len(*heroes))

	for i := range *heroes {
		var rightmostInsertionIndex = binarySearch(monstersAndCoins, (*heroes)[i]) - 1
		if rightmostInsertionIndex < 0 {
			continue
		}
		maxCoinsPerHero[i] = (*monstersAndCoins)[rightmostInsertionIndex].PrefixSumCoins
	}

	return maxCoinsPerHero
}
