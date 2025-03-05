from fastapi import FastAPI
from app.api.database import engine, Base
from app.api.routers import auth, restaurant

# Initialize FastAPI app
app = FastAPI(title="QueFood Backend")

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(restaurant.router, prefix="/api/restaurant", tags=["Restaurants"])


# Root route
@app.get("/")
def root():
    return {"message": "Welcome to QueFood Backend!"}