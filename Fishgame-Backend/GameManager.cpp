#include "GameManager.h"
#include <iostream>

GameManager::GameManager() : playerMoney(100) {} // שחקן מתחיל עם 100 מטבעות

int GameManager::getPlayerMoney() {
    return playerMoney;
}

void GameManager::addMoney(int amount) {
    playerMoney += amount;
    std::cout << "?? כסף השחקן: " << playerMoney << " מטבעות" << std::endl;
}

Fish GameManager::catchFish() {
    FishManager fishManager;
    Fish fish = fishManager.getRandomFish();
    addMoney(fish.value);
    return fish;
}
