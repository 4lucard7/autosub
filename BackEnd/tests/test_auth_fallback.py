import unittest

from api.auth import login, register
from schemas.user_schema import UserCreate, UserLogin
from workers import DB


class AuthFallbackTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        DB.db.fallback_users._documents = []

    async def test_register_and_login_work_without_database(self):
        register_response = await register(
            UserCreate(email="fallback@example.com", password="password123")
        )
        self.assertEqual(register_response.status_code, 200)

        login_response = await login(
            UserLogin(email="fallback@example.com", password="password123")
        )
        self.assertEqual(login_response.status_code, 200)
        payload = login_response.body.decode("utf-8")
        self.assertIn("access_token", payload)


if __name__ == "__main__":
    unittest.main()
