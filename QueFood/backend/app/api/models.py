from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Boolean, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


# Address Table
class Address(Base):
    __tablename__ = "address_table"

    restaurant_id = Column(Integer, ForeignKey("restaurant_table.restaurant_id"), primary_key=True, index=True)
    state = Column(String, nullable=False)
    city = Column(String, nullable=False)
    street_address = Column(String, nullable=False)
    postal_code = Column(Integer, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Relationship with Restaurant
    restaurant = relationship("Restaurant", back_populates="address")

class CustomerAccount(Base):
    __tablename__ = "customer_account_table"

    customer_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    manager_account_name = Column(String(255), nullable=False)
    manager_account_password = Column(String(255), nullable=False)
    phone_number = Column(String(15), nullable=True)
    address = Column(String(255), nullable=True)
    verified = Column(Boolean, default=True) 
    otp = Column(String(6), nullable=True) 
    email = Column(String(255), nullable=True)

    # Relationship with Orders
    orders = relationship("Order", back_populates="customer")



# Manager Account Table
class ManagerAccount(Base):
    __tablename__ = "manager_account_table"

    manager_id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurant_table.restaurant_id"), nullable=False)
    manager_account_name = Column(String(255), nullable=False)
    manager_account_password = Column(String(255), nullable=False)

    # Relationship with Restaurant
    restaurant = relationship("Restaurant", back_populates="managers")


# Menu Table
class Menu(Base):
    __tablename__ = "menu_table"

    menu_id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurant_table.restaurant_id"), nullable=False)
    category = Column(String(255), nullable=False)
    food_name = Column(String(255), nullable=False)
    food_description = Column(String, nullable=True)
    food_price = Column(Numeric, nullable=False)
    availability = Column(Boolean, default=True)

    # Relationship with Restaurant
    restaurant = relationship("Restaurant", back_populates="menus")


# Order Table
class Order(Base):
    __tablename__ = "order_table"

    order_number = Column(String, primary_key=True, index=True)
    due_date = Column(DateTime, default=func.now())
    status = Column(String(50), nullable=True)
    customer_id = Column(Integer, ForeignKey("customer_account_table.customer_id"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurant_table.restaurant_id"), nullable=False)
    items_count = Column(Numeric, nullable=False)
    subtotal = Column(Numeric, nullable=False)
    taxes = Column(Numeric, nullable=False)
    fooditems = Column(String, nullable=True)  # JSON or serialized data
    total = Column(Numeric, nullable=False)

    # Relationships
    customer = relationship("CustomerAccount", back_populates="orders")
    restaurant = relationship("Restaurant", back_populates="orders")


# Restaurant Table
class Restaurant(Base):
    __tablename__ = "restaurant_table"

    restaurant_id = Column(Integer, primary_key=True, index=True)
    restaurant_name = Column(String(255), nullable=False)
    ratings = Column(Numeric, nullable=True)
    restaurant_type = Column(String(255), nullable=True)
    pricing_levels = Column(String(50), nullable=True)

    # Relationships
    menus = relationship("Menu", back_populates="restaurant")
    managers = relationship("ManagerAccount", back_populates="restaurant")
    orders = relationship("Order", back_populates="restaurant")
    address = relationship("Address", back_populates="restaurant", uselist=False)
