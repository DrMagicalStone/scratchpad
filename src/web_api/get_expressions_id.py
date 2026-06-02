from fastapi import APIRouter, FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from scratchpad.scratchpad import expressions

router = APIRouter()

@router.get("/expressions_id")
async def get_expressions_id():
    '''
    获取所有的表达式的 ID 的集合, 类型为 JSON 数组, ID 的类型为 str, 完整路径为 /api/expressions_id, 请求方法为 GET
    '''
    return set(expressions.keys())