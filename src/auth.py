import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-super-secret-banking-key-for-internal-use-only"
ALGORITHM = "HS256"

# Hardcoded for demo. Real app would query a database (e.g., AD / LDAP / Postgres)
MOCK_USERS = {
    "admin": "password123",
    "analyst": "bank123"
}

def verify_user(username, password):
    if username in MOCK_USERS and MOCK_USERS[username] == password:
        return True
    return False

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=8)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
