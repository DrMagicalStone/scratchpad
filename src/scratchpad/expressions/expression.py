from typing import Any

from sympy import latex


class Expression:
    
    def __init__(self, id: str, definition_method: str, sympy_expression):
        self.id: str = id
        self.definition_method: str = definition_method
        self.sympy_expression = sympy_expression
        
    def get_id(self):
        return self.id
    
    def get_definition_method(self):
        return self.definition_method
        
    def get_sympy_expression(self):
        return self.sympy_expression
        
    def get_parent_numbers(self) -> int:
        return 0
    
    def get_parent_ids(self) -> list[str]:
        return []
    
    
    
    
    
    
    def serialize(self) -> dict[str, Any]:
        data = dict()
        
        data["id"] = self.id
        data["definition_method"] = self.definition_method
        data["parent_ids"] = self.get_parent_ids()
        data["latex_expression"] = latex(self.sympy_expression)
        
        return data
