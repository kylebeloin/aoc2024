#include <iostream>
#include <fstream>

using namespace std;

int main() {
    string inputs = "";
    ifstream Inputs("input.txt");
    while (getline(Inputs, inputs)) {
        cout << inputs;
    }
    cout << "Hello World";
    return 0;
}