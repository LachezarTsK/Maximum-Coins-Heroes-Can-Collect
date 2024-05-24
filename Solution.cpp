
#include <span>
#include <ranges>
#include <vector>
using namespace std;

class Solution {

    struct  MonsterAndCoin {
        int strength;
        int coin;
        long prefixSumCoins = 0;
        MonsterAndCoin() = default;
        MonsterAndCoin(int strength, int coin) :strength{ strength }, coin{ coin } {}
    };

public:
    vector<long long> maximumCoins
    (const vector<int>& heroes, const vector<int>& monsters, const vector<int>& coins) const {
        vector <MonsterAndCoin> monstersAndCoins(monsters.size());
        initializeMonstersAndCoins(monsters, coins, monstersAndCoins);

        ranges::sort(monstersAndCoins, [](const auto& x, const auto& y) {return x.strength < y.strength;});
        calculatePrefixSumCoins(monstersAndCoins);

        return calculateMaxCoinsEachHeroCanCollect(heroes, monstersAndCoins);
    }

private:
    void initializeMonstersAndCoins(span<const int> monsters, span<const int> coins, span<MonsterAndCoin> monstersAndCoins) const {
        for (size_t i = 0; i < monsters.size(); ++i) {
            monstersAndCoins[i] = MonsterAndCoin(monsters[i], coins[i]);
        }
    }

    void calculatePrefixSumCoins(span<MonsterAndCoin> monstersAndCoins)const {
        monstersAndCoins[0].prefixSumCoins = monstersAndCoins[0].coin;
        for (size_t i = 1; i < monstersAndCoins.size(); ++i) {
            monstersAndCoins[i].prefixSumCoins = monstersAndCoins[i - 1].prefixSumCoins + monstersAndCoins[i].coin;
        }
    }

    int binarySearch(span<const MonsterAndCoin> monstersAndCoins, int heroStrength)const {
        int left = 0;
        int right = monstersAndCoins.size() - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (monstersAndCoins[mid].strength <= heroStrength) {
                left = mid + 1;
            }
            else {
                right = mid - 1;
            }
        }
        return left;
    }

    vector<long long> calculateMaxCoinsEachHeroCanCollect(span<const int> heroes, span<const MonsterAndCoin> monstersAndCoins) const {
        vector<long long>  maxCoinsPerHero(heroes.size());

        for (size_t i = 0; i < heroes.size(); ++i) {
            int rightmostInsertionIndex = binarySearch(monstersAndCoins, heroes[i]) - 1;
            if (rightmostInsertionIndex < 0) {
                continue;
            }
            maxCoinsPerHero[i] = monstersAndCoins[rightmostInsertionIndex].prefixSumCoins;
        }

        return maxCoinsPerHero;
    }
};
