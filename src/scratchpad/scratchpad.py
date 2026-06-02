import string

from sympy import symbols
from scratchpad.expressions.expression import Expression


'''
无状态地处理与持久化存储关于所有表达式的数据, 但是在此 demo 中不保证无状态和持久化
'''

# 所有符号的集合, 但在此 demo 中仅包含 26 个英文字母
default_symbols: dict[str, any] = dict()

for symbol in symbols("a:z", real=True):
    default_symbols[symbol.name] = symbol

# 临时存储所有的表达式, 在此 demo 中用来暂代持久化存储
expressions: dict[str, Expression] = dict()

next_id = 0

def get_next_id() -> str:
    '''
    为每一个表达式分配一个唯一的 ID, 在此 demo 中用自增 ID 暂代
    '''
    global next_id
    id = ""
    digit_1 = next_id // 26
    digit_0 = next_id % 26
    next_id += 1
    if digit_1 > 0:
        return string.ascii_uppercase[digit_1 - 1] + string.ascii_uppercase[digit_0]
    else:
        return string.ascii_uppercase[digit_0]