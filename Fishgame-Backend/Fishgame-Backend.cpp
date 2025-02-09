#include "Server.h"
#include "GameManager.h"
#include <iostream>

int main() {
    Server server(5000);
    server.start();
    return 0;
}