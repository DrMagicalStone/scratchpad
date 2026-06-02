from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from web_api.get_expressions_id import router as get_expressions_id
from web_api.get_expression import router as get_expression
from web_api.post_new_expression import router as post_new_expression

app = FastAPI()

# 注册所有的 API
app.include_router(get_expressions_id, prefix="/api")
app.include_router(get_expression, prefix="/api")
app.include_router(post_new_expression, prefix="/api")

# 挂载静态文件
app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="frontend")

# 挂载主页并支持 Single Page App
@app.get("/{full_path:path}")
async def get_index(full_path: str):
    return FileResponse("frontend/dist/index.html")