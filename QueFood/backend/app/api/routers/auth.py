from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.database import get_db
from app.api.models import CustomerAccount
from app.api.schemas import CustomerAccountCreate, PhoneVerificationRequest, PhoneVerificationResponse, OTPVerificationRequest, SignInRequest, SignInResponse, ChangePasswordRequest
from app.api.auth import hash_password, create_access_token, verify_password
from app.api.otp import generate_otp, send_otp

router = APIRouter()

@router.post("/send-otp", response_model=PhoneVerificationResponse)
def send_otp_endpoint(phone_verification: PhoneVerificationRequest, db: Session = Depends(get_db)):
    existing_user = db.query(CustomerAccount).filter(CustomerAccount.phone_number == phone_verification.phone_number).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    # Generate OTP and send it
    otp = generate_otp()
    send_otp(phone_verification.phone_number, otp)

    # Store OTP in the database
    new_user = CustomerAccount(
        customer_id = phone_verification.phone_number,
        phone_number=phone_verification.phone_number,
        otp=otp,
        verified=False,
        manager_account_name="default_name",  
        manager_account_password="default_password"  
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "OTP sent successfully"}

@router.post("/resend-otp", response_model=PhoneVerificationResponse)
def resend_otp(phone_verification: PhoneVerificationRequest, db: Session = Depends(get_db)):
    user = db.query(CustomerAccount).filter(CustomerAccount.phone_number == phone_verification.phone_number).first()
    if not user:
        raise HTTPException(status_code=400, detail="Phone number not registered. Please send OTP first.")

    # Generate OTP and send it
    otp = generate_otp()
    send_otp(phone_verification.phone_number, otp)

    # Store OTP in the database
    user.otp = otp
    db.commit()

    return {"message": "OTP sent successfully"}


@router.post("/verify-otp", response_model=PhoneVerificationResponse)
def verify_otp(request: OTPVerificationRequest, db: Session = Depends(get_db)):
    user = db.query(CustomerAccount).filter(CustomerAccount.phone_number == request.phone_number).first()
    if not user or user.otp != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.verified = True
    user.otp = None  # Clear the OTP after verification
    db.commit()
    return {"message": "Phone number verified successfully"}

@router.post("/signup")
def signup(customer: CustomerAccountCreate, db: Session = Depends(get_db)):
    # Print the incoming request data for debugging
    print("Signup Data:", customer.dict())

    # Check if phone number exists
    existing_user = db.query(CustomerAccount).filter(CustomerAccount.phone_number == customer.phone_number).first()
    if not existing_user:
        raise HTTPException(status_code=400, detail="Phone number not registered. Please send OTP first.")

    # Update existing customer with hashed password and other details
    hashed_password = hash_password(customer.manager_account_password)
    existing_user.manager_account_name = customer.manager_account_name
    existing_user.manager_account_password = hashed_password
    existing_user.email = customer.email
    existing_user.verified = True

    db.commit()
    db.refresh(existing_user)
    return {"message": "Signup successful. You can now log in."}

@router.post("/signin", response_model=SignInResponse)
def signin(customer: SignInRequest, db: Session = Depends(get_db)):
    user = db.query(CustomerAccount).filter(CustomerAccount.phone_number == customer.phone_number).first()
    if not user:
        raise HTTPException(status_code=404, detail="Phone number not registered. Please sign up.")
    if not verify_password(customer.password, user.manager_account_password):
        raise HTTPException(status_code=401, detail="Invalid phone number or password")

    access_token = create_access_token(data={"sub": user.phone_number})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/request-password-change", response_model=PhoneVerificationResponse)
def request_password_change(phone_verification: PhoneVerificationRequest, db: Session = Depends(get_db)):
    user = db.query(CustomerAccount).filter(CustomerAccount.phone_number == phone_verification.phone_number).first()
    if not user:
        raise HTTPException(status_code=400, detail="Phone number not registered")

    # Generate OTP and send it
    otp = generate_otp()
    send_otp(phone_verification.phone_number, otp)

    # Store OTP in the database
    user.otp = otp
    db.commit()

    return {"message": "OTP sent successfully"}

@router.post("/change-password", response_model=PhoneVerificationResponse)
def change_password(request: ChangePasswordRequest, db: Session = Depends(get_db)):
    user = db.query(CustomerAccount).filter(CustomerAccount.phone_number == request.phone_number).first()
    if not user:
        raise HTTPException(status_code=400, detail="Phone number not registered")

    # Check if the new password is the same as the current password
    if verify_password(request.new_password, user.manager_account_password):
        raise HTTPException(status_code=400, detail="New password cannot be the same as the current password")

    # Update the password
    hashed_password = hash_password(request.new_password)
    user.manager_account_password = hashed_password
    db.commit()

    return {"message": "Password changed successfully"}