#include "FishManager.h"

// רשימת דגים אפשריים
std::vector<Fish> fishList = {
    {"Salmon", 12, 30},
    {"Tuna", 15, 50},
    {"Goldfish", 5, 10}
};

FishManager::FishManager() {
    srand(time(0)); // אתחול מחולל מספרים רנדומליים
}

Fish FishManager::getRandomFish() {
    int index = rand() % fishList.size();
    return fishList[index];
}
