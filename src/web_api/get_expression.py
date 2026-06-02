from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from scratchpad.scratchpad import expressions

router = APIRouter()

# 根据表达式 ID 获取表达式，路径为 /api/expression/{expression_id}
@router.get("/expression/{expression_id}")
async def get_expression(expression_id: str):
    '''
    根据表达式 ID 获取表达式, 完整路径为 /api/expression/{expression_id}, 请求方法为 GET
    '''
    if expression_id in expressions:
        return expressions[expression_id].serialize()
    else:
        raise HTTPException(status_code=404, detail=f"Expression with id {expression_id} not found.")