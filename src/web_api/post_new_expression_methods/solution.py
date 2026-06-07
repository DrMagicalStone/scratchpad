from typing import Any

from fastapi import HTTPException

from scratchpad.expressions.solution import Solve
from scratchpad.scratchpad import expressions, get_next_id, default_symbols


def solution(method_name: str, data: dict[str, Any]):
    if not isinstance(data, dict) or not ("id_expression" in data and "symbols" in data):
        raise HTTPException(status_code=400, detail="To solve an equation, provide id_expression and symbols.")

    id_expression_to_solve = data["id_expression"]
    symbol_str_list = data["symbols"]

    if isinstance(symbol_str_list, str):
        symbol_str_list = symbol_str_list.split()

    if not isinstance(symbol_str_list, list) or not all(isinstance(p, str) and p in default_symbols for p in symbol_str_list):
        raise HTTPException(status_code=400, detail="Each symbol to be solved must be a known symbol, such as x.")

    symbols = [default_symbols[s] for s in symbol_str_list]

    if id_expression_to_solve not in expressions:
        raise HTTPException(
            status_code=404,
            detail=f"Expression with id {id_expression_to_solve} to perform \"{method_name}\" not found.",
        )

    expression = Solve(get_next_id(), id_expression_to_solve, symbols)
    expressions[expression.get_id()] = expression
    return expression.serialize()
