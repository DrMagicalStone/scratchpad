from typing import Any

from fastapi import HTTPException
from sympy.core.relational import Equality

from scratchpad.expressions.simplifications import Differentiate, Integrate
from scratchpad.scratchpad import default_symbols, expressions, get_next_id


def calculus(method_name: str, data: dict[str, Any]):
    if not isinstance(data, dict):
        raise HTTPException(status_code=400, detail="Calculus method data shall be an object.")

    id_expression_from = data.get("id_expression_from")
    gen = data.get("gen")

    if not isinstance(id_expression_from, str):
        raise HTTPException(status_code=400, detail="id_expression_from shall be a string.")

    if id_expression_from not in expressions:
        raise HTTPException(
            status_code=404,
            detail=f"Expression with id {id_expression_from} to perform \"{method_name}\" not found.",
        )

    source_expression = expressions[id_expression_from]
    if isinstance(source_expression.get_sympy_expression(), Equality):
        raise HTTPException(
            status_code=400,
            detail=(
                "Differentiate and Integrate only work on calculus expressions, not equations. "
                "Use the Calculus input type and enter something like x**2 + 2*x."
            ),
        )

    if not isinstance(gen, str) or gen not in default_symbols:
        raise HTTPException(status_code=400, detail="gen shall be one known symbol, such as x.")

    match method_name:
        case "differentiate":
            expression = Differentiate(get_next_id(), id_expression_from, gen)
        case "integrate":
            expression = Integrate(get_next_id(), id_expression_from, gen)
        case _:
            raise HTTPException(status_code=400, detail=f"Unknown calculus method: {method_name}.")

    expressions[expression.get_id()] = expression
    return expression.serialize()
