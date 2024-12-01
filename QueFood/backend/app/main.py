from fastapi import FastAPI
from app.api.database import engine, Base
from app.api.routers import auth

# Initialize FastAPI app
app = FastAPI(title="QueFood Backend")

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Root route
@app.get("/")
def root():
    return {"message": "Welcome to QueFood Backend!"}