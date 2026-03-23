"""
Auth Middleware — Verify Firebase JWT tokens.

📚 LEARNING:
    In FastAPI, middleware is implemented via "dependencies" (Depends).
    This function:
    1. Extracts the token from the Authorization header
    2. Verifies it with Firebase Admin SDK
    3. Returns the user_id if valid
    4. Raises 401 if invalid

    Usage in a route:
        @router.get("/protected")
        async def protected_route(user_id: str = Depends(get_current_user)):
            ...
"""

from fastapi import Request, HTTPException
from firebase_admin import auth as firebase_auth


async def get_current_user(request: Request) -> str:
    """
    Extract and verify Firebase JWT from the Authorization header.
    Returns the user's UID.

    📚 LEARNING:
        The frontend sends: Authorization: Bearer <firebase_id_token>
        Firebase Admin SDK decodes and verifies the token server-side.
        This ensures only authenticated users can access protected routes.
    """
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid Authorization header. Expected: Bearer <token>",
        )

    token = auth_header.split("Bearer ")[1]

    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token["uid"]
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token expired. Please sign in again.")
    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid token.")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")
