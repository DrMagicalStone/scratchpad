from fastapi import HTTPException

from scratchpad.expressions.simplifications import Apart, Cancel, Expand, Factor, Together
from scratchpad.scratchpad import get_next_id, expressions


def simplification(method_name: str, id_expression_to_transform: str):
    if id_expression_to_transform not in expressions:
        raise HTTPException(
            status_code=404,
            detail=f"Expression with id {id_expression_to_transform} to perform \"{method_name}\" not found.",
        )

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
        case _:
            raise HTTPException(status_code=400, detail=f"Unknown simplification method: {method_name}.")

    expressions[expression.get_id()] = expression
    return expression.serialize()
