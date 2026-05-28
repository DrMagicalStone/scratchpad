from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# 挂载静态文件
app.mount("/static", StaticFiles(directory="static"), name="static")

# RESTful API 示例
@app.get("/api/items/{item_id}")
async def get_item(item_id: int):
    return {"item_id": item_id, "message": "Hello from API"}

@app.post("/api/items")
async def create_item(item: dict):
    return {"received": item}