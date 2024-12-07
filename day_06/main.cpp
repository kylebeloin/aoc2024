#include <iostream>
#include <fstream>

using namespace std;

struct Point {
    int x = 0;
    int y = 0;
};

struct Position {
    Point point;
    int index;
    bool occupied = false;
    bool visited = false;
};

struct Grid {
    Point dimensions;
    vector<Position> positions;
};

struct Guard {
    Position position;
    Point direction;
    bool moving;
};

void turnRight(Guard& guard) {
    // up or down 
    if (guard.direction.x == 0) {
        if (guard.direction.y == 1) {
            // down -> left
            guard.direction.y = 0;
            guard.direction.x = -1;
            return;
        }
        // up -> right
        guard.direction.y = 0;
        guard.direction.x = 1;
        return;
    }
    // left or right
    if (guard.direction.y == 0) {
        // right => down
        if(guard.direction.x == 1) {
            guard.direction.y = 1;
            guard.direction.x = 0;
            return;
        };
        // left -> up
        guard.direction.y = -1;
        guard.direction.x = 0;
        return;
    }
}
// draw to file
void draw(Grid grid) {
    ofstream File("output.txt");
    for(int i = 0; i < grid.positions.size(); i++) {
        if (grid.positions[i].point.x == 0 && i != 0) {
            File << endl;
        }
        if (grid.positions[i].visited) {
            File << "X";
        } else {
            if (grid.positions[i].occupied) {
                File << "#";
            } else {
                File << ".";
            }
        }
    }
    File.close();
}

Position& getNext(Guard& guard, Grid& grid) {
    if (guard.direction.x == 0) {
        // Moving down
        if (guard.direction.y == 1) {
            if ((guard.position.point.y + 1) == grid.dimensions.y) {
                return guard.position;
            }
            Position& next = grid.positions.at(((guard.position.point.y + 1) * grid.dimensions.x) + guard.position.point.x);
            return next;
        } 
        else {
// Moving up
            if (!((guard.position.point.y - 1) < 0)) {
                Position& next = grid.positions.at(((guard.position.point.y - 1) * grid.dimensions.x) + guard.position.point.x);
                return next;
            }
        }
    }

    if (guard.direction.y == 0) {
        // Moving right
        if (guard.direction.x == 1) {
            if ((guard.position.point.x + 1) == grid.dimensions.x) {
                return guard.position;
            }
            Position& next = grid.positions.at(((guard.position.point.y) * grid.dimensions.x) + guard.position.point.x + 1);
            return next;
        } else {
            if (!((guard.position.point.x - 1) < 0)) {
                Position& next = grid.positions.at(((guard.position.point.y) * grid.dimensions.x) + guard.position.point.x - 1);
                return next;
            };
        }
    }
    return guard.position;
};

int main() {
    ifstream File("test.txt");
    string inputs = "";
    Grid grid;
    Guard guard;


    // The first space is always visited.
    int total = 1;
    int count = 0;
    while (getline(File, inputs)) {
        for(int i = 0; i < inputs.length(); i++) {        
            Position position;
            position.point.x = i;
            position.point.y = count;
            position.index = (count * inputs.length()) + i;

            
            if (inputs[i] == '#') {
                cout << "Obstacle";
                position.occupied = true;
            }
            position.visited = false;

            if (inputs[i] == '^') {
                position.visited = true;
                guard.position = position;
                guard.direction.x = 0;
                guard.direction.y = -1;
            };


            grid.positions.push_back(position);
        }
        count++;
    }

    grid.dimensions.x = inputs.length();
    grid.dimensions.y = count;

    bool out = false;
    while(!out) {
        Position nextPos = getNext(guard, grid);
        while(nextPos.occupied) {
            turnRight(guard);
            nextPos = getNext(guard, grid);
        }
        if ((guard.position.point.x == nextPos.point.x) & (guard.position.point.y == nextPos.point.y)) 
        {
            out = true;
        }
        if (!nextPos.visited) {
            total++;
        };
        if (!nextPos.occupied) {
            grid.positions.at(nextPos.index).visited = true;
        }
        
        guard.position = grid.positions.at(nextPos.index);
    }


    return 0;
}