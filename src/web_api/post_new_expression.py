from typing import Any, Callable

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from web_api.post_new_expression_methods.calculus import calculus
from web_api.post_new_expression_methods.input_expression import input_expression
from web_api.post_new_expression_methods.resultant import resultant
from web_api.post_new_expression_methods.simplifications import simplification
from web_api.post_new_expression_methods.solution import solution

methods: dict[str, Callable[[str, Any], Any]] = {}

router = APIRouter()


class NewExpression(BaseModel):
    method: str
    data: Any


@router.post("/expressions")
async def post_new_expression(body: NewExpression):
    """
    基于传入参数创建一个新的表达式。参数类型由创建方法决定，创建方法均在
    web_api.post_new_expression_methods 中。完整路径为 /api/expressions，请求方法为 POST。
    """
    method_name = body.method
    if method_name in methods:
        return methods[method_name](method_name, body.data)

    raise HTTPException(status_code=400, detail=f"No method for newing expressions named {method_name}.")


methods["manual input"] = input_expression

methods["factor"] = simplification
methods["expand"] = simplification
methods["cancel"] = simplification
methods["together"] = simplification
methods["apart"] = simplification
methods["solve"] = solution
methods["resultant"] = resultant
methods["differentiate"] = calculus
methods["integrate"] = calculus
