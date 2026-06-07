from sympy import solve

from scratchpad.expressions.expression import Expression
from scratchpad.scratchpad import expressions


class Solve(Expression):
    def __init__(self, id: str, id_expression_from: str, symbols):
        self.id_expression_from = id_expression_from
        expression = expressions[id_expression_from]
        if expression:
            sympy_expression = expression.get_sympy_expression()
            super().__init__(id, "Solve", solve(sympy_expression, symbols))
        else:
            raise ValueError("Expression not found")

    def get_base_numbers(self) -> int:
        return 1

    def get_base_ids(self) -> list[str]:
        return [self.id_expression_from]
