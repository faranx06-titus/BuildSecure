from fastapi import FastAPI

app = FastAPI(
    title="MediDesk API",
    description="Security-focused clinic management API",
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "message": "MediDesk API is running",
        "status": "ok",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }