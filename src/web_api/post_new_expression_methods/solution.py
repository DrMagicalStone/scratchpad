import string
from typing import Any

from fastapi import HTTPException

from scratchpad.expressions.solution import Solve
from scratchpad.scratchpad import expressions, get_next_id, default_symbols

def solution(method_name: str, data: dict[str, Any]):
    if not ("id_expression" in data and "symbols" in data):
        raise HTTPException(status_code=400, detail=f"To solve a equation must provide an id_expression and symbols")
    
    id_expression_to_solve = data["id_expression"]
    symbol_str_list = data["symbols"]
    if not all([(len(p) == 1) and (p in string.ascii_letters) for p in symbol_str_list]):
        raise HTTPException(status_code=400, detail=f"Eavh symbol in symbols to be solved must in ascii letters.")
    symbols = [default_symbols[s] for s in symbol_str_list]
    
    if not (id_expression_to_solve in expressions):
        raise HTTPException(status_code=404, detail=f"Expression with id {id_expression_to_solve} to perform \"{method_name}\" not found.")
    
    expression = Solve(get_next_id(), id_expression_to_solve, symbols)

    expressions[expression.get_id()] = expression
    return expression.serialize()