#include "GameManager.h"
#include <iostream>

GameManager::GameManager() : playerMoney(100) {} // ���� ����� �� 100 ������

int GameManager::getPlayerMoney() {
    return playerMoney;
}

void GameManager::addMoney(int amount) {
    playerMoney += amount;
    std::cout << "?? ��� �����: " << playerMoney << " ������" << std::endl;
}

Fish GameManager::catchFish() {
    FishManager fishManager;
    Fish fish = fishManager.getRandomFish();
    addMoney(fish.value);
    return fish;
}
