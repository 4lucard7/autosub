import os
from dotenv import load_dotenv

load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
mongo_url = os.getenv("MONGO_URL")

print("OpenAI Key:", openai_key)
print("MongoDB URL:", mongo_url)

