
using System;

public class Solution
{
    class MonsterAndCoin
    {
        public int strength;
        public int coin;
        public long prefixSumCoins;

        public MonsterAndCoin(int strength, int coin)
        {
            this.strength = strength;
            this.coin = coin;
        }
    }

    public long[] MaximumCoins(int[] heroes, int[] monsters, int[] coins)
    {
        MonsterAndCoin[] monstersAndCoins = new MonsterAndCoin[monsters.Length];
        InitializeMonstersAndCoins(monsters, coins, monstersAndCoins);

        Array.Sort(monstersAndCoins, (x, y) => x.strength - y.strength);
        CalculatePrefixSumCoins(monstersAndCoins);

        return CalculateMaxCoinsEachHeroCanCollect(heroes, monstersAndCoins);
    }

    private void InitializeMonstersAndCoins(int[] monsters, int[] coins, MonsterAndCoin[] monstersAndCoins)
    {
        for (int i = 0; i < monsters.Length; ++i)
        {
            monstersAndCoins[i] = new MonsterAndCoin(monsters[i], coins[i]);
        }
    }

    private void CalculatePrefixSumCoins(MonsterAndCoin[] monstersAndCoins)
    {
        monstersAndCoins[0].prefixSumCoins = monstersAndCoins[0].coin;
        for (int i = 1; i < monstersAndCoins.Length; ++i)
        {
            monstersAndCoins[i].prefixSumCoins = monstersAndCoins[i - 1].prefixSumCoins + monstersAndCoins[i].coin;
        }
    }

    private int BinarySearch(MonsterAndCoin[] monstersAndCoins, int heroStrength)
    {
        int left = 0;
        int right = monstersAndCoins.Length - 1;

        while (left <= right)
        {
            int mid = left + (right - left) / 2;
            if (monstersAndCoins[mid].strength <= heroStrength)
            {
                left = mid + 1;
            }
            else
            {
                right = mid - 1;
            }
        }
        return left;
    }

    private long[] CalculateMaxCoinsEachHeroCanCollect(int[] heroes, MonsterAndCoin[] monstersAndCoins)
    {
        long[] maxCoinsPerHero = new long[heroes.Length];

        for (int i = 0; i < heroes.Length; ++i)
        {
            int rightmostInsertionIndex = BinarySearch(monstersAndCoins, heroes[i]) - 1;
            if (rightmostInsertionIndex < 0)
            {
                continue;
            }
            maxCoinsPerHero[i] = monstersAndCoins[rightmostInsertionIndex].prefixSumCoins;
        }

        return maxCoinsPerHero;
    }
}
