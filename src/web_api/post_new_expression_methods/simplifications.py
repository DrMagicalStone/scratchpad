
from fastapi import HTTPException
from latex2sympy import latex2sympy
from sympy import Eq

from scratchpad.expressions.expression import Expression
from scratchpad.expressions.simplifications import Apart, Cancel, Expand, Factor, Solve, Together
from scratchpad.scratchpad import get_next_id, expressions


def simplification(method_name: str, id_expression_to_transform: str):
    if id_expression_to_transform in expressions:
        match method_name:
            case "factor":
                expression = Factor(get_next_id(), id_expression_to_transform)
            case "expand":
                expression = Expand(get_next_id(), id_expression_to_transform)
            case "cancel":
                expression = Cancel(get_next_id(), id_expression_to_transform)
            case "together":
                expression = Together(get_next_id(), id_expression_to_transform)
            case "apart":
                expression = Apart(get_next_id(), id_expression_to_transform)
            case "solve":
                expression = Solve(get_next_id(), id_expression_to_transform)
                
        expressions[expression.get_id()] = expression
        return expression.get_id()
    else:
        raise HTTPException(status_code=404, detail=f"Expression with id {id_expression_to_transform} to perform \"{method_name}\" not found.")