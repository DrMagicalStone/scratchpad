from typing import Any

from fastapi import HTTPException
from sympy import Eq
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

from scratchpad.expressions.expression import Expression
from scratchpad.scratchpad import get_next_id, expressions, default_symbols

_transformations = standard_transformations + (implicit_multiplication_application,)


def _parse_math_expression(text: str):
    return parse_expr(
        text.strip(),
        local_dict=default_symbols,
        transformations=_transformations,
        evaluate=True,
    )


def _normalize_input(data: Any) -> tuple[str, str]:
    """
    Accept both the old API payload (a plain string) and the new payload:
    {"content": "x**2 + 2*x", "input_type": "calculus" | "ordinary"}
    """
    if isinstance(data, str):
        return data, "ordinary"

    if isinstance(data, dict):
        content = data.get("content")
        input_type = data.get("input_type", "ordinary")
        if not isinstance(content, str):
            raise HTTPException(status_code=400, detail="Input content shall be a string.")
        if input_type not in {"ordinary", "calculus"}:
            raise HTTPException(status_code=400, detail="input_type shall be ordinary or calculus.")
        return content, input_type

    raise HTTPException(status_code=400, detail="Manual input data shall be a string or an object.")


def input_expression(method_name, data: Any):
    text, input_type = _normalize_input(data)

    try:
        text = text.strip()
        if not text:
            raise ValueError("Empty expression.")

        if input_type == "calculus" and "=" in text:
            raise ValueError(
                "Calculus input should be a plain expression, not an equation. "
                "For example, use x**2 + 2*x instead of x**2 + 2*x = 0."
            )

        if "=" in text:
            parts = text.split("=")
            if len(parts) != 2:
                raise ValueError("Only one equals sign is allowed.")
            lhs, rhs = parts
            sympy_expression = Eq(_parse_math_expression(lhs), _parse_math_expression(rhs), evaluate=False)
        else:
            sympy_expression = _parse_math_expression(text)

        method_label = "Manual Input (Calculus)" if input_type == "calculus" else "Manual Input"
        expression = Expression(get_next_id(), method_label, sympy_expression)
        expressions[expression.get_id()] = expression
        return expression.serialize()

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=400, detail=f"Incorrect expression: {error}")
