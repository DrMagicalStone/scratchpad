from typing import Any

from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from scratchpad.scratchpad import expressions
from web_api.post_new_expression_methods.resultant import resultant
from web_api.post_new_expression_methods.input_expression import input_expression
from web_api.post_new_expression_methods.simplifications import simplification

methods: dict[str, function] = dict()

router = APIRouter()

class NewExpression(BaseModel):
    method: str
    data: Any

@router.post("/expressions")
async def post_new_expression(body: NewExpression):
    '''
    基于传入参数创建一个新的表达式, 参数类型由创建方法决定, 创建方法均在 web_api.post_new_expression_methods 中
    返回值为创建的表达式 (与 GET /api/expression/{expression_id} 结果相同), 完整路径为 /api/expressions, 请求方法为 POST
    '''
    method_name = body.method
    if method_name in methods:
        return methods[method_name](method_name, body.data)
    else:
        raise HTTPException(status_code=400,detail=f"No method for newing expressions named {method_name}.")






methods["manual input"] = input_expression

methods["factor"] = simplification
methods["expand"] = simplification
methods["cancel"] = simplification
methods["together"] = simplification
methods["apart"] = simplification
methods["solve"] = simplification
methods["resultant"] = resultant