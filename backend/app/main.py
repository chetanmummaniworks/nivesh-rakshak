from fastapi import FastAPI

from backend.app.routes.analyze import router as analyze_router


app = FastAPI(
    title="NiveshRakshak API",
    description="AI-powered investor safety assistant",
    version="0.1.0",
)


app.include_router(analyze_router)


@app.get("/")
def root():
    return {
        "message": "NiveshRakshak API is running",
        "status": "ok"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}