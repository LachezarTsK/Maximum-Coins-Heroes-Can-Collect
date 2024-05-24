
import java.util.Arrays;

public class Solution {

    class MonsterAndCoin {

        int strength;
        int coin;
        long prefixSumCoins;

        MonsterAndCoin(int strength, int coin) {
            this.strength = strength;
            this.coin = coin;
        }
    }

    public long[] maximumCoins(int[] heroes, int[] monsters, int[] coins) {
        MonsterAndCoin[] monstersAndCoins = new MonsterAndCoin[monsters.length];
        initializeMonstersAndCoins(monsters, coins, monstersAndCoins);

        Arrays.sort(monstersAndCoins, (x, y) -> x.strength - y.strength);
        calculatePrefixSumCoins(monstersAndCoins);

        return calculateMaxCoinsEachHeroCanCollect(heroes, monstersAndCoins);
    }

    private void initializeMonstersAndCoins(int[] monsters, int[] coins, MonsterAndCoin[] monstersAndCoins) {
        for (int i = 0; i < monsters.length; ++i) {
            monstersAndCoins[i] = new MonsterAndCoin(monsters[i], coins[i]);
        }
    }

    private void calculatePrefixSumCoins(MonsterAndCoin[] monstersAndCoins) {
        monstersAndCoins[0].prefixSumCoins = monstersAndCoins[0].coin;
        for (int i = 1; i < monstersAndCoins.length; ++i) {
            monstersAndCoins[i].prefixSumCoins = monstersAndCoins[i - 1].prefixSumCoins + monstersAndCoins[i].coin;
        }
    }

    private int binarySearch(MonsterAndCoin[] monstersAndCoins, int heroStrength) {
        int left = 0;
        int right = monstersAndCoins.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (monstersAndCoins[mid].strength <= heroStrength) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return left;
    }

    private long[] calculateMaxCoinsEachHeroCanCollect(int[] heroes, MonsterAndCoin[] monstersAndCoins) {
        long[] maxCoinsPerHero = new long[heroes.length];

        for (int i = 0; i < heroes.length; ++i) {
            int rightmostInsertionIndex = binarySearch(monstersAndCoins, heroes[i]) - 1;
            if (rightmostInsertionIndex < 0) {
                continue;
            }
            maxCoinsPerHero[i] = monstersAndCoins[rightmostInsertionIndex].prefixSumCoins;
        }

        return maxCoinsPerHero;
    }
}
