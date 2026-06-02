from typing import Any

from scratchpad.expressions.expression import Expression
from scratchpad.scratchpad import expressions
from sympy import apart, cancel, expand, factor, solve, together

class Simplification(Expression):
    def __init__(self, id: str, definition_method: str, id_expression_from: str, simplification_function):
        self.id_expression_from = id_expression_from
        expression = expressions[id_expression_from]
        if expression:
            sympy_expression = expression.get_sympy_expression()
            super().__init__(id, definition_method, simplification_function(sympy_expression))
        else:
            raise "Expression not found"
        
    def get_parent_numbers(self) -> int:
        return 1
    
    def get_parent_ids(self) -> list[str]:
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
        
class Solve(Simplification):
    def __init__(self, id: str, id_expression_from: str):
        super().__init__(id, "Solve", id_expression_from, solve)
        
        
    
    def serialize(self) -> dict[str, Any]:
        data = super().serialize()
        
        data["solve_set"] = data["latex_expression"]
        
        del data["latex_expression"]
        
        return data