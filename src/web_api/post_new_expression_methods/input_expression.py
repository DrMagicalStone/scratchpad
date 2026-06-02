
from fastapi import HTTPException
from latex2sympy import latex2sympy
from sympy import Eq, parse_expr

from scratchpad.expressions.expression import Expression
from scratchpad.scratchpad import get_next_id, expressions, default_symbols


def input_expression(method_name, string_expression):
    if type(string_expression) == str:
        try:
            lhs, rhs = string_expression.split("=")
            sympy_expression = Eq(parse_expr(lhs, default_symbols), parse_expr(rhs, default_symbols))
            expression = Expression(get_next_id(), "Manual Input", sympy_expression)
            expressions[expression.get_id()] = expression
            return expression.get_id()
        except:
            raise HTTPException(status_code=400, detail="Incorrect latex expression.")
    else:
        raise HTTPException(status_code=400, detail="Latex expression shall be a string.")