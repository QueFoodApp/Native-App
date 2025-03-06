from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Boolean
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
from datetime import datetime
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
    phone_number = Column(String(15), unique=True, nullable=False)  # ✅ Match with `customer_history_table`
    manager_account_name = Column(String(255), nullable=False)
    manager_account_password = Column(String(255), nullable=False)
    address = Column(String(255), nullable=True)
    verified = Column(Boolean, default=True) 
    otp = Column(String(6), nullable=True) 
    email = Column(String(255), unique=True, nullable=True)

    # Relationship with Orders
    orders = relationship("Order", back_populates="customer")



# Manager Account Table
class ManagerAccount(Base):
    __tablename__ = "manager_account_table"
    # ✅ Fix Relationship with CustomerHistory
    customer_history = relationship("CustomerHistory", back_populates="customer")


class CustomerHistory(Base):
    __tablename__ = "customer_history_table"

    id = Column(Integer, primary_key=True, index=True)
    customer_number = Column(Integer, ForeignKey("customer_account_table.phone_number"), nullable=False)
    order_number = Column(String, ForeignKey("order_table.order_number"), nullable=False)

    # ✅ Fix relationship with CustomerAccount
    customer = relationship("CustomerAccount", back_populates="customer_history")

    # ✅ Fix relationship with OrderTable
    order = relationship("OrderTable", back_populates="customer_histories")  # ✅ Use the correct back_populates


class OrderTable(Base):
    __tablename__ = "order_table"

    order_number = Column(String, primary_key=True, index=True)
    due_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    status = Column(String, nullable=False, default="Pending")
    customer_id = Column(Integer, ForeignKey("customer_account_table.customer_id"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurant_table.restaurant_id"), nullable=False)
    restaurant_name = Column(String(255), nullable=True)  # ✅ Add restaurant_name
    items_count = Column(Integer, nullable=False, default=1)
    subtotal = Column(Float, nullable=False, default=0.0)
    taxes = Column(Float, nullable=False, default=0.0)
    fooditems = Column(JSON, nullable=False)
    total = Column(Float, nullable=False, default=0.0)


    # ✅ Fix relationship with CustomerHistory
    customer_histories = relationship("CustomerHistory", back_populates="order")

    def __repr__(self):
        return f"<Order(order_number={self.order_number}, restaurant_name={self.restaurant_name}, status={self.status}, total={self.total})>"


    # Relationships
    menus = relationship("Menu", back_populates="restaurant")
    managers = relationship("ManagerAccount", back_populates="restaurant")
    orders = relationship("Order", back_populates="restaurant")
    address = relationship("Address", back_populates="restaurant", uselist=False)
