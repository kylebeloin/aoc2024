import re
# Part 1
with open('./day_03/inputs.txt') as f:
    pattern = r'(?<=mul\()\d{1,3},\d{1,3}(?=\))'
    string = f.read()
    print(sum(x[0] * x[1] for x in [[*map(int, result.split(','))] for result in re.findall(pattern, string)]))


# Part 2
with open('./day_03/inputs.txt') as f:
    ignore_pattern = r"don't\S+?(?=do\()"
    pattern = r'(?<=mul\()\d{1,3},\d{1,3}(?=\))'
    string = re.sub(ignore_pattern, '', re.sub(r"\s+", "", f.read()))
    print(sum(x[0] * x[1] for x in [[*map(int, result.split(','))] for result in re.findall(pattern, string)]))
