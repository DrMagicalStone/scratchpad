from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from scratchpad.expressions.expression import Expression
from scratchpad.scratchpad import expressions

router = APIRouter()

@router.delete("/expression/{expression_id}")
async def get_expression(expression_id: str):
    '''
    删除表达式和所有依赖其定义的表达式
    '''
    if expression_id in expressions:
        del expressions[expression_id]
        while not all([ base_exist(expressions[exp]) for exp in expressions]):
            for exp in [exp for exp in expressions if not base_exist(expressions[exp])]:
                del expressions[exp]
    else:
        raise HTTPException(status_code=404, detail=f"Expression with id {expression_id} not found.")
    
def base_exist(exp: Expression):
    return all([b in expressions for b in exp.get_base_ids()])