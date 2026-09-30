from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.routes.analyze import router as analyze_router


app = FastAPI(
    title="NiveshRakshak API",
    description="AI-powered investor safety assistant",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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