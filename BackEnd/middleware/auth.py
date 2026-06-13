from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from jose import jwt, JWTError, ExpiredSignatureError
from utils.token import SECRET_KEY, ALGORITHM

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip auth for auth routes and health check
        if request.url.path in ["/login", "/register", "/", "/auth/login", "/auth/register"]:
            return await call_next(request)
        
        # Get token from header
        token = request.headers.get("Authorization")
        if not token:
            return JSONResponse({"detail": "Missing authorization token"}, status_code=401)
        
        # Remove "Bearer " prefix
        try:
            token = token.split(" ")[1]
        except IndexError:
            return JSONResponse({"detail": "Invalid authorization header format"}, status_code=401)
        
        try:
            # Verify token
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            # Attach user to request for downstream use. Token contains 'email', not 'user_id'
            request.state.user = payload.get("email")
            if not request.state.user:
                return JSONResponse({"detail": "Token payload invalid"}, status_code=401)
        except ExpiredSignatureError:
            return JSONResponse({"detail": "Token has expired"}, status_code=401)
        except JWTError:
            return JSONResponse({"detail": "Invalid token"}, status_code=401)
        
        response = await call_next(request)
        return response
