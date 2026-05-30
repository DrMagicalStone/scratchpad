from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# RESTful API 示例
@app.get("/api/items/{item_id}")
async def get_item(item_id: int):
    return {"item_id": item_id, "message": "Hello from API"}

@app.post("/api/items")
async def create_item(item: dict):
    return {"received": item}

# 挂载静态文件
app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="frontend")

@app.get("/*")
async def get_index():
    return FileResponse("frontend/dist/index.html")