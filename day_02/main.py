def get_direction(a: int, b: int) -> int:
    return  -1 if b - a < 0 else 1

def delta_unsafe(a: int, b: int, direction: int) -> bool:
    if a == b:
        return True
    if get_direction(a, b) != direction:
        return True
    if abs(b - a) > 3:
        return True
    return False

def rule_safe_with_skipped(nums: list[int], i: int):
    nums.pop(i)
    return rule_safe(nums, False)

def rule_safe(nums: list[int], try_skip: bool = True):
    direction =  get_direction(nums[0], nums[1])
    
    for i in range(0, len(nums) - 1):
        if delta_unsafe(nums[i], nums[i + 1], direction):
            if try_skip:
                if rule_safe_with_skipped(nums[::], i):
                    return True
                if rule_safe_with_skipped(nums[::], i + 1):
                    return True
            return False
    
    return True

def main():
    total_safe = 0
    with open('./day_02/inputs.txt') as f:
        for line in f.readlines():
            if rule_safe([int(num) for num in line.split()], True):
                total_safe += 1
            else:
                print(line)
    print(total_safe)

if __name__ == "__main__":
    main()


