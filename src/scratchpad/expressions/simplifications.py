from scratchpad.expressions.expression import Expression
from scratchpad.scratchpad import expressions, default_symbols
from sympy import apart, cancel, diff, expand, factor, integrate, together


class Simplification(Expression):
    def __init__(self, id: str, definition_method: str, id_expression_from: str, simplification_function):
        self.id_expression_from = id_expression_from
        expression = expressions[id_expression_from]
        if expression:
            sympy_expression = expression.get_sympy_expression()
            super().__init__(id, definition_method, simplification_function(sympy_expression))
        else:
            raise ValueError("Expression not found")

    def get_base_numbers(self) -> int:
        return 1

    def get_base_ids(self) -> list[str]:
        return [self.id_expression_from]


class Factor(Simplification):
    def __init__(self, id: str, id_expression_from: str):
        super().__init__(id, "Factor", id_expression_from, factor)


class Expand(Simplification):
    def __init__(self, id: str, id_expression_from: str):
        super().__init__(id, "Expand", id_expression_from, expand)


class Cancel(Simplification):
    def __init__(self, id: str, id_expression_from: str):
        super().__init__(id, "Cancel", id_expression_from, cancel)


class Together(Simplification):
    def __init__(self, id: str, id_expression_from: str):
        super().__init__(id, "Together", id_expression_from, together)


class Apart(Simplification):
    def __init__(self, id: str, id_expression_from: str):
        super().__init__(id, "Apart", id_expression_from, apart)


class Differentiate(Simplification):
    def __init__(self, id: str, id_expression_from: str, gen: str):
        if gen not in default_symbols:
            raise ValueError(f"Unknown symbol: {gen}")
        super().__init__(id, f"Differentiate d/d{gen}", id_expression_from, lambda expr: diff(expr, default_symbols[gen]))


class Integrate(Simplification):
    def __init__(self, id: str, id_expression_from: str, gen: str):
        if gen not in default_symbols:
            raise ValueError(f"Unknown symbol: {gen}")
        super().__init__(id, f"Integrate d{gen}", id_expression_from, lambda expr: integrate(expr, default_symbols[gen]))
