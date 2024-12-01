import hashlib
import os
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import Optional, Union, Dict
from fastapi import HTTPException

# Load environment variables
load_dotenv()

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")  # Set secret key in .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 300000))

# Password hashing functions
def hash_password(password: str) -> str:
    """Hash a plaintext password using SHA-256."""
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a hashed password against a plaintext password."""
    return hash_password(plain_password) == hashed_password

# JWT token functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT token with an expiration time."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Union[Dict, None]:
    """Decode a JWT token and return the payload."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired.")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token.")
