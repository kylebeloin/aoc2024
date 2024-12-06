import os
'''
Part One
'''
def list_difference(left: list[int], right: list[int]) -> int:
    total = 0
    for (first, second) in zip(left, right):
        if first > second:
            total += first - second
        else:
            total += second - first
    return total

def similarity_score(left: list[int], right: list[int]) -> int:

    score = 0
    right_count = {}
    for number in right:
        count = right_count.get(number, 0)
        right_count[number] = count + 1

    for number in left:
        score += number * right_count.get(number, 0)
    
    return score


def main():
    left, right = [], []
    
    with open('./day_01/python/inputs.txt') as f:
        for line in f.readlines():
            a, b = line.split()
            left.append(int(a))
            right.append(int(b))

    left, right = sorted(left), sorted(right)
    
    print(list_difference(left, right))
    print(similarity_score(left, right))
    
if __name__ == "__main__":
    main()