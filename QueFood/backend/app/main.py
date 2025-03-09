from fastapi import FastAPI
from app.api.database import engine, Base
from app.api.routers import auth, restaurant, menu, photo
from app.api.routers.CustomerFunction import router as customer_router  
import stripe
import os
from dotenv import load_dotenv

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

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

# Add Payment Endpoint
@app.post("/api/payment-intent")
async def create_payment_intent():
    try:
        # Set minimum amount to 50 cents (50 in cents)
        intent = stripe.PaymentIntent.create(
            amount=50,  # 50 cents ($0.50 USD)
            currency="usd",  # Change if needed
        )
        return {"client_secret": intent.client_secret}
    except Exception as e:
        return {"error": str(e)}

# Root route
@app.get("/")
def root():
    return {"message": "Welcome to QueFood Backend!"}
