from fastapi import FastAPI
from app.api.database import engine, Base
from app.api.routers import auth, restaurant, menu, photo
from app.api.routers.CustomerFunction import router as customer_router  # ✅ Correct import

# Initialize FastAPI app
app = FastAPI(title="QueFood Backend")

# Create database tables
Base.metadata.create_all(bind=engine)

# ✅ Include routers correctly
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(restaurant.router, prefix="/api/restaurant", tags=["Restaurants"])
app.include_router(customer_router, prefix="/api/customer", tags=["Customer"])  
app.include_router(menu.router, prefix="/api/menu", tags=["Menu"])
app.include_router(photo.router, prefix="/api", tags=["Photos"])

# Root route
@app.get("/")
def root():
    return {"message": "Welcome to QueFood Backend!"}
