#ifndef GAMEMANAGER_H
#define GAMEMANAGER_H

#include "FishManager.h"

class GameManager {
private:
    int playerMoney;

public:
    GameManager();
    int getPlayerMoney();
    void addMoney(int amount);
    Fish catchFish();
};

#endif
