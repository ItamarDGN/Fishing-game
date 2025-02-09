#ifndef FISHMANAGER_H
#define FISHMANAGER_H

#include <string>
#include <vector>
#include <cstdlib>
#include <ctime>

struct Fish {
    std::string name;
    float size;
    int value;
};

class FishManager {
public:
    FishManager();
    Fish getRandomFish();
};

#endif
