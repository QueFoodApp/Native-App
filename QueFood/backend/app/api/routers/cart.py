from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from uuid import uuid4
from typing import List, Dict
from datetime import datetime
from sqlalchemy import func

router = APIRouter()

@router.post("/cart", response_model=schemas.CartRead)
def create_or_get_cart(
    cart_data: schemas.CartCreate,
    db: Session = Depends(get_db)
):
    """
    Get the user's open cart or create one if none exists.
    """
    # Look up the customer by phone number
    customer = db.query(models.CustomerAccount).filter(
        models.CustomerAccount.phone_number == cart_data.phone_number
    ).first()
    print(customer)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Check if there's already an open cart for this customer
    existing_cart = db.query(models.OrderTable).filter(
        models.OrderTable.customer_id == customer.customer_id,
        models.OrderTable.restaurant_id == cart_data.restaurant_id,
        models.OrderTable.status == "cart"
    ).first()

    if existing_cart:
        return existing_cart

    # Determine the next order number
    last_order = db.query(models.OrderTable).order_by(models.OrderTable.order_number.desc()).first()
    if last_order:
        last_order_number_str = last_order.order_number
        try:
            last_order_number = int(last_order_number_str[1:])  # Extract digits and convert to int
            next_order_number = last_order_number + 1
            next_order_number_str = f"A{next_order_number:07d}"  # Format with leading zeros
        except ValueError:
            # Handle the case where the last order number is not in the expected format
            next_order_number_str = "A0000001"  # Or some other default starting value
    else:
        next_order_number_str = "A0000001"

    # Otherwise, create a new cart
    new_cart = models.OrderTable(
        order_number=next_order_number_str,
        due_date=datetime.utcnow(),
        status="cart",
        customer_id=customer.customer_id,
        restaurant_id=cart_data.restaurant_id,
        items_count=0,
        subtotal=0.0,
        taxes=0.0,
        fooditems=[]
    )
    db.add(new_cart)
    db.commit()
    db.refresh(new_cart)
    return new_cart

@router.get("/cart/{order_number}", response_model=schemas.CartRead)
def get_cart(
    order_number: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve a cart by order_number.
    """
    cart = db.query(models.OrderTable).filter(
        models.OrderTable.order_number == order_number,
        models.OrderTable.status == "cart"
    ).first()

    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found or not open")

    return cart

@router.put("/cart/{order_number}/items", response_model=schemas.CartRead)
def add_item_to_cart(
    order_number: str,
    item: Dict,  # Change to Dict
    db: Session = Depends(get_db)
):
    """
    Add an item to the cart's fooditems array.
    """
    cart = db.query(models.OrderTable).filter(
        models.OrderTable.order_number == order_number,
        models.OrderTable.status == "cart"
    ).first()

    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found or not open")

    # Fetch menu info
    menu_item = db.query(models.Menu).filter(
        models.Menu.menu_id == item['menu_id'],
        models.Menu.food_name == item['food_name'],
        models.Menu.restaurant_id == cart.restaurant_id
    ).first()
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    # Ensure quantity is provided and valid
    quantity = item.get('quantity', 1)
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than zero")

    # Check if the item already exists in the cart
    current_items = cart.fooditems or []
    current_items = current_items.copy()  # Create a copy to avoid modifying the original list directly
    existing_item_index = -1

    print(f"Current items: {current_items}")

    for index, existing_item in enumerate(current_items):
        if existing_item["menu_id"] == menu_item.menu_id and existing_item["food_name"] == menu_item.food_name:
            existing_item_index = index
            break

    if existing_item_index != -1:
        # Increment the quantity of the existing item
        current_items[existing_item_index]["quantity"] += quantity
        current_items[existing_item_index]["line_total"] = float(current_items[existing_item_index]["unit_price"]) * current_items[existing_item_index]["quantity"]
    else:
        # Build a new CartItem
        line_total = float(menu_item.food_price) * quantity
        new_item = {
            "menu_id": menu_item.menu_id,
            "food_name": menu_item.food_name,
            "quantity": quantity,
            "unit_price": float(menu_item.food_price),
            "line_total": line_total
        }
        current_items.append(new_item)

    # Update the cart's fooditems
    cart.fooditems = current_items

    # Recalculate
    cart.items_count = sum(i["quantity"] for i in current_items)
    cart.subtotal = sum(i["line_total"] for i in current_items)
    cart.taxes = round(cart.subtotal * 0.1, 2)  # example 10% tax

    db.commit()
    db.refresh(cart)
    return cart

@router.delete("/cart/{order_number}/items/{menu_id}", response_model=schemas.CartRead)
def remove_item_from_cart(
    order_number: str,
    menu_id: int,
    db: Session = Depends(get_db)
):
    """
    Remove an item from the cart by menu_id.
    """
    cart = db.query(models.OrderTable).filter(
        models.OrderTable.order_number == order_number,
        models.OrderTable.status == "cart"
    ).first()

    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found or not open")

    updated_items = [x for x in cart.fooditems if x["menu_id"] != menu_id]
    cart.fooditems = updated_items

    cart.items_count = sum(i["quantity"] for i in updated_items)
    cart.subtotal = sum(i["line_total"] for i in updated_items)
    cart.taxes = round(cart.subtotal * 0.1, 2)

    db.commit()
    db.refresh(cart)
    return cart

@router.post("/cart/{order_number}/checkout", response_model=schemas.CartRead)
def checkout_cart(
    order_number: str,
    db: Session = Depends(get_db)
):
    """
    Checkout the cart (set status to something else, e.g. 'new' or 'pending').
    """
    cart = db.query(models.OrderTable).filter(
        models.OrderTable.order_number == order_number,
        models.OrderTable.status == "cart"
    ).first()

    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found or not open")

    # Move from 'cart' to 'new' or 'pending'
    cart.status = "new"
    db.commit()
    db.refresh(cart)
    return cart

@router.get("/cart/customer/{phone_number}/{restaurant_id}", response_model=schemas.CartRead)
def get_cart_by_customer_and_restaurant(
    phone_number: str,
    restaurant_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a cart by customer phone number and restaurant ID.
    """
    customer = db.query(models.CustomerAccount).filter(models.CustomerAccount.phone_number == phone_number).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    cart = db.query(models.OrderTable).filter(
        models.OrderTable.customer_id == customer.customer_id,
        models.OrderTable.restaurant_id == restaurant_id,
        models.OrderTable.status == "cart"
    ).first()

    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    return cart