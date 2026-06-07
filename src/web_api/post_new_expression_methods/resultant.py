from typing import Any

from fastapi import HTTPException

from scratchpad.expressions.resultant import Resultant
from scratchpad.scratchpad import get_next_id, expressions, default_symbols


def resultant(method_name: str, data: dict[str, Any]):
    if not isinstance(data, dict):
        raise HTTPException(status_code=400, detail="Resultant method data shall be an object.")

    id_expression_0 = data.get("id_expression_0")
    id_expression_1 = data.get("id_expression_1")
    gen = data.get("gen")

    if id_expression_0 not in expressions or id_expression_1 not in expressions:
        raise HTTPException(
            status_code=404,
            detail=f"Expression with id {id_expression_0} or {id_expression_1} not found.",
        )

    if not isinstance(gen, str) or gen not in default_symbols:
        raise HTTPException(status_code=400, detail="gen shall be one known symbol, such as x.")

    try:
        expression = Resultant(get_next_id(), id_expression_0, id_expression_1, gen)
    except Exception as error:
        raise HTTPException(status_code=400, detail=f"Cannot compute resultant: {error}")

    expressions[expression.get_id()] = expression
    return expression.serialize()
