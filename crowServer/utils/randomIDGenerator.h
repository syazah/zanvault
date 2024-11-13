#include <iostream>
#include <string>
#include <random>
using namespace std;
string generateRandomID(size_t length) {
    const std::string characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    random_device rd;
    mt19937 generator(rd());
    uniform_int_distribution<> distribution(0, characters.size() - 1);

    string randomID;
    for (size_t i = 0; i < length; ++i) {
        randomID += characters[distribution(generator)];
    }
    return randomID;
}
