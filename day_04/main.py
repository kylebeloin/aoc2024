


xmas = ('X', 'M', 'A', 'S')
    
with open('./day_04/inputs.txt') as f:
    _lines = [line.strip() for line in f.readlines()]

    lines = []
    for line in _lines:
        lines.append([char for char in line])
    width, height = len(lines[0]) - 1, len(lines) - 1

    matches = 0

    position_result = lambda row, col: (lines[row][col], (row, col))

    def left(x, y):
        if x - 1 >= 0:
            col = x - 1
            return position_result(y, col)
        return (None, None)

    def right(x, y):
        if x + 1 <= width:
            col = x + 1
            return position_result(y, col)
        return (None, None)

    def top(x, y):
        if y - 1 >= 0:
            row = y - 1
            return position_result(row, x)
        return (None, None)
        
    def bottom(x, y):
        if y + 1 <= height:
            row = y + 1
            return position_result(row, x)
        return (None, None)
        
    def top_left(x, y):
        if (y - 1) >= 0 and (x - 1) >= 0:
            row, col = y - 1, x - 1
            return position_result(row, col)
        return (None, None)
        
    def top_right(x, y):
        if (y - 1) >= 0 and (x + 1) <= width:
            row, col = y - 1, x + 1
            return position_result(row, col)
        return (None, None)

    def bottom_right(x, y):
        if (y + 1) <= height and (x + 1) <= width:
            row, col = y + 1, x + 1
            return position_result(row, col)
        return (None, None)
        
    def bottom_left(x, y):
        if (y + 1) <= height and (x - 1) >= 0:
            row, col = y + 1, x - 1
            return position_result(row, col)
        return (None, None)
        
    def found_xmas(position, row, col):
        curr_letter = 1
        while curr_letter < len(xmas):
            expected = xmas[curr_letter]
            current, pos = position(col, row)
            if current == expected:
                row, col = pos
                curr_letter += 1
            else:
                return False
        return True
    
    def found_mas(position, row, col):
        first, second = position
        remaining = ['M', 'S']
        
        current, _ = first(col, row)
        if current in remaining:
            remaining.remove(current)
            return second(col, row)[0] in remaining
        return False
        
    

    xmas_positions = (top, top_right, right, bottom_right, bottom, bottom_left, left, top_left)
    mas_positions = ((top_right, bottom_left), (top_left, bottom_right))
    for row in range(0, height + 1):
        for col in range(0, width + 1):
            if lines[row][col] != xmas[0]:
                continue
            for pos in xmas_positions:
                if (found_xmas(pos, row, col)):
                    matches += 1
    matches = 0

    for row in range(1, height + 1):
        for col in range(1, width + 1):
            if lines[row][col] != 'A':
                continue
            
            if (found_mas(mas_positions[0], row, col) and found_mas(mas_positions[1], row, col)):
                matches += 1

    print(matches)
            
                




    
