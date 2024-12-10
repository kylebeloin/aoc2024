     

inputs = []

with open('./day_07/test.txt') as f:
        for line in f.readlines():
            result, operands = line.split(':')
            operands = operands.strip().split()
            inputs.append((int(result), tuple([*map(int, operands)])))

def get_combinations()

operands = []

print(inputs)
