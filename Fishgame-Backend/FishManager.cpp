#include "FishManager.h"

// ����� ���� �������
std::vector<Fish> fishList = {
    {"Salmon", 12, 30},
    {"Tuna", 15, 50},
    {"Goldfish", 5, 10}
};

FishManager::FishManager() {
    srand(time(0)); // ����� ����� ������ ���������
}

Fish FishManager::getRandomFish() {
    int index = rand() % fishList.size();
    return fishList[index];
}
