from fastapi import FastAPI

app = FastAPI()


@app.post("/")
async def post_template():
    return {"message": "Hello World"}

