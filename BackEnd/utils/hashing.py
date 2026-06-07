from passlib.context import CryptContext

pwd_context = CryptContext(
    # Use pbkdf2_sha256 to avoid bcrypt C-extension/backends issues in dev
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


def get_hashed_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    # bcrypt has a 72-byte input limit. If the provided password exceeds
    # this when encoded, treat it as invalid rather than letting the
    # hashing library raise an exception which breaks the request flow.
    try:
        if plain_password is None:
            return False

        # Check byte length to account for multibyte chars
        if len(plain_password.encode('utf-8')) > 72:
            return False

        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # Any unexpected error during verification should result in a
        # failed login rather than an unhandled server error.
        return False