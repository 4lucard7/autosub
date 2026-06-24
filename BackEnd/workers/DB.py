import logging
import os
from types import SimpleNamespace

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

LOGGER = logging.getLogger(__name__)
MONGODB_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "autosub")


class InMemoryCursor:
    def __init__(self, documents, query):
        self._documents = documents
        self._query = query or {}

    def _matches(self, document):
        return all(document.get(key) == value for key, value in self._query.items())

    async def to_list(self, length=100):
        return [document for document in self._documents if self._matches(document)][:length]


class InMemoryCollection:
    def __init__(self):
        self._documents = []

    def find(self, query):
        return InMemoryCursor(self._documents, query)

    async def find_one(self, query):
        for document in self._documents:
            if all(document.get(key) == value for key, value in query.items()):
                return document
        return None

    async def insert_one(self, document):
        inserted_id = len(self._documents)
        if "_id" not in document:
            document["_id"] = inserted_id
        else:
            inserted_id = document["_id"]
        self._documents.append(document)
        return SimpleNamespace(inserted_id=inserted_id)

    async def delete_one(self, query):
        for index, document in enumerate(self._documents):
            if all(document.get(key) == value for key, value in query.items()):
                del self._documents[index]
                return SimpleNamespace(deleted_count=1)
        return SimpleNamespace(deleted_count=0)

    async def update_one(self, query, update):
        for document in self._documents:
            if all(document.get(key) == value for key, value in query.items()):
                if "$set" in update:
                    document.update(update["$set"])
                return SimpleNamespace(modified_count=1)
        return SimpleNamespace(modified_count=0)


class CollectionProxy:
    def __init__(self, database, name):
        self._database = database
        self._name = name

    async def _get_collection(self):
        if self._database._connected is None:
            await self._database._connect()

        if self._database._connected:
            return self._database._client[self._database._db_name][self._name]

        return self._database._fallback_collections[self._name]

    def find(self, query):
        if self._database._connected is True:
            return self._database._client[self._database._db_name][self._name].find(query)
        return self._database._fallback_collections[self._name].find(query)

    async def find_one(self, query):
        collection = await self._get_collection()
        return await collection.find_one(query)

    async def insert_one(self, document):
        collection = await self._get_collection()
        return await collection.insert_one(document)

    async def delete_one(self, query):
        collection = await self._get_collection()
        return await collection.delete_one(query)

    async def update_one(self, query, update):
        collection = await self._get_collection()
        return await collection.update_one(query, update)


class DatabaseProxy:
    def __init__(self):
        self._client = None
        self._connected = None
        self._db_name = DB_NAME
        self._fallback_collections = {
            "users": InMemoryCollection(),
            "jobs": InMemoryCollection(),
            "videos": InMemoryCollection(),
            "subtitle_styles": InMemoryCollection(),
        }
        self.fallback_users = self._fallback_collections["users"]
        self.fallback_jobs = self._fallback_collections["jobs"]
        self.fallback_videos = self._fallback_collections["videos"]
        self.fallback_subtitle_styles = self._fallback_collections["subtitle_styles"]
        self.users = CollectionProxy(self, "users")
        self.jobs = CollectionProxy(self, "jobs")
        self.videos = CollectionProxy(self, "videos")
        self.subtitle_styles = CollectionProxy(self, "subtitle_styles")

    async def _connect(self):
        if self._connected is not None:
            return

        try:
            self._client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=2000)
            await self._client.admin.command("ping")
            self._connected = True
            LOGGER.info("Connected to MongoDB at %s", MONGODB_URL)
        except Exception as exc:
            self._connected = False
            LOGGER.warning("MongoDB unavailable; using in-memory fallback: %s", exc)

    def __getattr__(self, name):
        return CollectionProxy(self, name)


db = DatabaseProxy()
