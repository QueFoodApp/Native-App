from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Address Schemas
class AddressCreate(BaseModel):
    state: str
    city: str
    street_address: str
    postal_code: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class AddressOut(BaseModel):
    restaurant_id: int
    state: str
    city: str
    street_address: str
    postal_code: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        orm_mode = True


# Customer Account Schemas
class CustomerAccountCreate(BaseModel):
    manager_account_name: str = Field(..., min_length=3, max_length=255)
    manager_account_password: str = Field(..., min_length=6, max_length=255)
    phone_number: Optional[str]
    address: Optional[str]

class CustomerAccountOut(BaseModel):
    customer_id: int
    manager_account_name: str
    phone_number: Optional[str]
    address: Optional[str]

    class Config:
        orm_mode = True


# Manager Account Schemas
class ManagerAccountCreate(BaseModel):
    restaurant_id: int
    manager_account_name: str = Field(..., min_length=3, max_length=255)
    manager_account_password: str = Field(..., min_length=6, max_length=255)

class ManagerAccountOut(BaseModel):
    manager_id: int
    restaurant_id: int
    manager_account_name: str

    class Config:
        orm_mode = True


# Menu Schemas
class MenuCreate(BaseModel):
    restaurant_id: int
    category: str
    food_name: str
    food_description: Optional[str]
    food_price: float
    availability: bool = True

class MenuOut(BaseModel):
    menu_id: int
    restaurant_id: int
    category: str
    food_name: str
    food_description: Optional[str]
    food_price: float
    availability: bool

    class Config:
        orm_mode = True


# Order Schemas
class OrderCreate(BaseModel):
    customer_id: int
    restaurant_id: int
    items_count: int
    subtotal: float
    taxes: float
    fooditems: Optional[str]  # JSON or serialized data
    total: float

class OrderOut(BaseModel):
    order_number: str
    due_date: datetime
    status: Optional[str]
    customer_id: int
    restaurant_id: int
    items_count: int
    subtotal: float
    taxes: float
    fooditems: Optional[str]
    total: float

    class Config:
        orm_mode = True


# Restaurant Schemas
class RestaurantCreate(BaseModel):
    restaurant_name: str
    ratings: Optional[float]
    restaurant_type: Optional[str]
    pricing_levels: Optional[str]

class RestaurantOut(BaseModel):
    restaurant_id: int
    restaurant_name: str
    ratings: Optional[float]
    restaurant_type: Optional[str]
    pricing_levels: Optional[str]

    class Config:
        orm_mode = True
