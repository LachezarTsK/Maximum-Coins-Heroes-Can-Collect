
class Solution {

    data class MonsterAndCoin(var strength: Int, var coin: Int) {
        var prefixSumCoins: Long = 0
    }

    fun maximumCoins(heroes: IntArray, monsters: IntArray, coins: IntArray): LongArray {
        val monstersAndCoins = arrayOfNulls<MonsterAndCoin>(monsters.size)
        initializeMonstersAndCoins(monsters, coins, monstersAndCoins)

        monstersAndCoins.sortWith { x, y -> x!!.strength - y!!.strength }
        calculatePrefixSumCoins(monstersAndCoins)

        return calculateMaxCoinsEachHeroCanCollect(heroes, monstersAndCoins)
    }

    private fun initializeMonstersAndCoins(
        monsters: IntArray, coins: IntArray, monstersAndCoins: Array<MonsterAndCoin?>
    ) {
        for (i in monsters.indices) {
            monstersAndCoins[i] = MonsterAndCoin(monsters[i], coins[i])
        }
    }

    private fun calculatePrefixSumCoins(monstersAndCoins: Array<MonsterAndCoin?>) {
        monstersAndCoins[0]!!.prefixSumCoins = monstersAndCoins[0]!!.coin.toLong()
        for (i in 1..<monstersAndCoins.size) {
            monstersAndCoins[i]!!.prefixSumCoins =
                monstersAndCoins[i - 1]!!.prefixSumCoins + monstersAndCoins[i]!!.coin
        }
    }

    private fun binarySearch(monstersAndCoins: Array<MonsterAndCoin?>, heroStrength: Int): Int {
        var left = 0
        var right = monstersAndCoins.size - 1

        while (left <= right) {
            val mid = left + (right - left) / 2
            if (monstersAndCoins[mid]!!.strength <= heroStrength) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
        return left
    }

    private fun calculateMaxCoinsEachHeroCanCollect(
        heroes: IntArray,
        monstersAndCoins: Array<MonsterAndCoin?>
    ): LongArray {
        val maxCoinsPerHero = LongArray(heroes.size)

        for (i in heroes.indices) {
            val rightmostInsertionIndex = binarySearch(monstersAndCoins, heroes[i]) - 1
            if (rightmostInsertionIndex < 0) {
                continue
            }
            maxCoinsPerHero[i] = monstersAndCoins[rightmostInsertionIndex]!!.prefixSumCoins
        }

        return maxCoinsPerHero
    }
}
