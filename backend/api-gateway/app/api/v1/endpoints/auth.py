"""
Authentication API Endpoints
Handles user login with secure password verification
"""
import os
import hashlib
import hmac
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    token: Optional[str] = None


def verify_password(plain_password: str, stored_hash: str) -> bool:
    """Verify password against stored hash using constant-time comparison"""
    # Use PBKDF2 with SHA256 for password hashing
    salt = os.environ.get('PASSWORD_SALT', 'afpi-secure-salt-change-in-production')
    password_hash = hashlib.pbkdf2_hmac(
        'sha256',
        plain_password.encode('utf-8'),
        salt.encode('utf-8'),
        100000  # iterations
    ).hex()
    return hmac.compare_digest(password_hash, stored_hash)


def hash_password(password: str) -> str:
    """Hash a password for storage"""
    salt = os.environ.get('PASSWORD_SALT', 'afpi-secure-salt-change-in-production')
    return hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()


# Get admin credentials from environment (secure)
def get_admin_credentials():
    """Get admin credentials from environment variables"""
    return {
        'email': os.environ.get('ADMIN_EMAIL', 'admin@afpip.com'),
        'password_hash': os.environ.get('ADMIN_PASSWORD_HASH', hash_password(os.environ.get('ADMIN_PASSWORD', ''))),
        'name': os.environ.get('ADMIN_NAME', 'Administrator'),
        'role': 'admin'
    }


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Authenticate user and return user info
    """
    admin = get_admin_credentials()
    
    # Check if credentials match admin
    if request.email.lower() == admin['email'].lower():
        # Verify password
        input_hash = hash_password(request.password)
        if hmac.compare_digest(input_hash, admin['password_hash']):
            return LoginResponse(
                id="1",
                email=admin['email'],
                name=admin['name'],
                role=admin['role']
            )
    
    # Invalid credentials - use constant time to prevent timing attacks
    # Always hash to prevent timing-based email enumeration
    _ = hash_password(request.password)
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password"
    )


@router.get("/me")
async def get_current_user():
    """Get current user info - placeholder for JWT implementation"""
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated"
    )
