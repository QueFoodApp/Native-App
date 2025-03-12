from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql import text  # ✅ Import text()
from app.api.database import get_db
from typing import List, Optional
import logging
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
logging.basicConfig(level=logging.DEBUG)  # ✅ Enable Debug Logging

API_BASE_URL = os.getenv("API_BASE_URL")

@router.get("/{restaurant_id}", response_model=List[dict])
def get_menu(
    restaurant_id: int,
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    try:
        # ✅ Fetch Restaurant Name
        restaurant_sql = text("""
            SELECT restaurant_name FROM restaurant_table WHERE restaurant_id = :restaurant_id
        """)
        restaurant_result = db.execute(restaurant_sql, {"restaurant_id": restaurant_id})
        restaurant_row = restaurant_result.fetchone()

        if not restaurant_row:
            raise HTTPException(status_code=404, detail="Restaurant not found")

        restaurant_name = restaurant_row.restaurant_name  # ✅ Extract restaurant name

        # ✅ Fetch All Menu Items
        menu_sql = text("""
            SELECT menu_id, food_name, food_description, food_price, category, availability, restaurant_id
            FROM menu_table
            WHERE restaurant_id = :restaurant_id
        """)

        params = {"restaurant_id": restaurant_id}
        if category:
            menu_sql = text(menu_sql.text + " AND category ILIKE :category")
            params["category"] = f"%{category}%"

        result = db.execute(menu_sql, params)
        menu_items = result.fetchall()

        if not menu_items:
            return []  # If no menu items exist, return an empty array

        # ✅ Fetch All Photos (Raw SQL)
        photo_sql = text("""
            SELECT food_name, file_name 
            FROM restaurant_photos
            WHERE restaurant_id = :restaurant_id
        """)
        photo_result = db.execute(photo_sql, {"restaurant_id": restaurant_id})
        photos = photo_result.fetchall()

        # ✅ Organize Photos by Food Name
        photo_dict = {}
        for photo in photos:
            if photo.food_name:
                trimmed_food_name = photo.food_name.strip()  # 🔥 Ensure trimming
                if trimmed_food_name not in photo_dict:
                    photo_dict[trimmed_food_name] = []
                photo_dict[trimmed_food_name].append(f"{API_BASE_URL}/api/photos/{photo.file_name}")

        # ✅ Construct Response
        response = []
        for menu in menu_items:
            trimmed_menu_name = menu.food_name.strip()  # 🔥 Trim before lookup
            image_urls = photo_dict.get(trimmed_menu_name, [None])  # Default to None if no images
            for image_url in image_urls:
                response.append({
                    "menu_id": menu.menu_id,
                    "food_name": menu.food_name,
                    "food_description": menu.food_description or "No description available.",
                    "food_price": float(menu.food_price),
                    "category": menu.category,
                    "availability": menu.availability,
                    "restaurant_id": menu.restaurant_id,
                    "restaurant_name": restaurant_name,  # ✅ Include restaurant name
                    "image_url": image_url  # ✅ Ensure image_url is set correctly
                })

        return response

    except Exception as e:
        logging.error(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
