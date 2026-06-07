from scratchpad.expressions.expression import Expression
from scratchpad.scratchpad import expressions, default_symbols

from sympy import Eq, resultant
from sympy.core.relational import Equality


def _as_polynomial_expression(expr):
    if isinstance(expr, Equality):
        return expr.lhs - expr.rhs
    return expr


class Resultant(Expression):
    def __init__(self, id, id_expression_0: str, id_expression_1: str, gen: str):
        expression_0 = expressions[id_expression_0]
        expression_1 = expressions[id_expression_1]
        poly_0 = _as_polynomial_expression(expression_0.get_sympy_expression())
        poly_1 = _as_polynomial_expression(expression_1.get_sympy_expression())
        expression = resultant(poly_0, poly_1, default_symbols[gen])
        self.id_expression_0 = id_expression_0
        self.id_expression_1 = id_expression_1
        super().__init__(id, "Resultant", Eq(expression, 0, evaluate=False))

    def get_base_numbers(self) -> int:
        return 2

    def get_base_ids(self) -> list[str]:
        return [self.id_expression_0, self.id_expression_1]
