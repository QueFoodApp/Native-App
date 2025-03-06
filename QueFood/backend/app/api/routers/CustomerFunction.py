from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.api.database import get_db
from app.api.auth import decode_access_token  # ✅ Import `decode_access_token`
from app.api.models import CustomerHistory, OrderTable 
from sqlalchemy import asc, desc

router = APIRouter()

# ✅ Debug All Request Headers
@router.get("/debug/headers")
async def debug_headers(request: Request):
    """Print all request headers for debugging."""
    headers = dict(request.headers)
    print(f"📌 Request Headers: {headers}")  # ✅ Debugging
    return headers


# ✅ Fix Token Extraction
def get_token_from_header(request: Request):
    """Extract the token from Authorization header correctly."""
    auth_header = request.headers.get("Authorization")

    print(f"📌 Raw Authorization Header: {auth_header}")  # ✅ Debugging

    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")

    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization Format")

    token = auth_header.split(" ")[1]  # ✅ Correctly extract the token
    print(f"📌 Extracted Token from Headers: {token}")  # ✅ Debugging extracted token
    return token


# ✅ Extract Phone Number from Token
def get_phone_number_from_token(request: Request):
    token = get_token_from_header(request)  # ✅ Extract token
    print(f"📌 Token Before Decoding: {token}")  # ✅ Debugging before decoding

    try:
        payload = decode_access_token(token)  # ✅ Decode the token
        print(f"📌 Decoded Payload: {payload}")  # ✅ Debugging decoded token payload
    except Exception as e:
        print(f"❌ Token decoding error: {str(e)}")  # ✅ Debugging error
        raise HTTPException(status_code=401, detail="Invalid token")

    phone_number = payload.get("sub")  # ✅ Extract `sub` field
    if not phone_number:
        print("❌ Token does not contain 'sub' field!")  # ✅ Debugging missing phone number
        raise HTTPException(status_code=401, detail="Invalid token")

    print(f"📌 Extracted Phone Number from Token: {phone_number}")  # ✅ Debugging final phone number
    return phone_number


# ✅ Fetch Orders Using Phone Number
@router.get("/orders")
def get_customer_orders(
    db: Session = Depends(get_db),
    customer_number: str = Depends(get_phone_number_from_token)  # Use correct identifier
):
    """Fetch full order details from `order_table` sorted by `due_date`."""
    print(f"📌 Looking up orders for customer_number: {customer_number}")  # Debugging

    # ✅ Get order numbers from `customer_history_table`
    order_records = db.query(CustomerHistory.order_number).filter(
        CustomerHistory.customer_number == customer_number
    ).all()

    order_numbers = [record.order_number for record in order_records]

    if not order_numbers:
        print("❌ No orders found for this customer")
        return {"message": "No orders found for this customer", "customer_number": customer_number}

    # ✅ Fetch full order details from `order_table` and sort by `due_date`
    orders = (
        db.query(OrderTable)
        .filter(OrderTable.order_number.in_(order_numbers))
        .order_by(desc(OrderTable.due_date))  # Change to `asc(OrderTable.due_date)` for earliest first
        .all()
    )

    if not orders:
        print("❌ No matching orders in order_table")
        return {"message": "No orders found in order_table", "customer_number": customer_number}

    # ✅ Convert orders to JSON-friendly format, including address details
    order_list = []
    for order in orders:
        order_list.append({
            "order_number": order.order_number,
            "due_date": order.due_date,
            "status": order.status,
            "customer_id": order.customer_id,
            "restaurant_id": order.restaurant_id,
            "items_count": order.items_count,
            "subtotal": order.subtotal,
            "taxes": order.taxes,
            "fooditems": order.fooditems,  # Assuming fooditems is JSON-serializable
            "total": order.total,
            "restaurant_name": order.restaurant_name,
            "state": order.state,
            "city": order.city,
            "street_address": order.street_address,
            "postal_code": order.postal_code,
            "latitude": float(order.latitude) if order.latitude else None,  # Convert Decimal to float
            "longitude": float(order.longitude) if order.longitude else None,  # Convert Decimal to float
        })

    print(f"📌 Retrieved Orders (sorted by due_date): {order_list}")  # ✅ Debugging retrieved orders

    return {
        "message": "Orders retrieved successfully",
        "customer_number": customer_number,
        "orders": order_list  # ✅ Full order details, sorted by due_date
    }
