
import string
from typing import Any

from fastapi import HTTPException
from latex2sympy import latex2sympy
from sympy import Eq

from scratchpad.expressions.expression import Expression
from scratchpad.expressions.resultant import Resultant
from scratchpad.expressions.simplifications import Apart, Cancel, Expand, Factor, Solve, Together
from scratchpad.scratchpad import get_next_id, expressions


def resultant(method_name: str, data: dict[str, Any]):
    id_expression_0: str = data["id_expression_0"]
    id_expression_1: str = data["id_expression_1"]
    gen: str = data["gen"]
    if id_expression_0 in expressions and id_expression_1 in expressions and len(gen) == 1 and gen in string.ascii_letters:
        expression = Resultant(get_next_id(), id_expression_0, id_expression_1, gen)
        expressions[expression.get_id()] = expression
        return expression.get_id()
    else:
        raise HTTPException(status_code=404, detail=f"Expression with id {id_expression_0} or {id_expression_1} not found.")