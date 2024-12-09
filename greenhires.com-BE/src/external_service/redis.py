from datetime import timedelta
from typing import Callable, Literal, Optional, Union
from redis.asyncio import Redis, client
from redis.typing import ChannelT
from pydantic import BaseModel
import logging
import redis.asyncio as aioredis
from src.config import settings
import orjson
from src.utils.utils import defaultDumpJson


class RedisManager:
    def __init__(self, client: Redis):
        self.client = client

    async def set_redis_key(self, redis_data: 'RedisData', *,
                            is_transaction: bool = False) -> None:
        async with self.client.pipeline(transaction=is_transaction) as pipe:
            await pipe.set(redis_data.key, redis_data.value)
            if redis_data.ttl:
                await pipe.expire(redis_data.key, redis_data.ttl)
            await pipe.execute()

    async def get_by_key(self, key: str) -> Optional[str]:
        return await self.client.get(key)

    async def delete_by_key(self, key: str) -> None:
        return await self.client.delete(key)

    async def close(self):
        await self.client.close()

    async def getCachedOrSet(
        self,
        key: str,
        callback: Callable[[], Union[dict, str]],
        ttl: int = 60 * 60 * 24,  # 24 hours
        cached_type: Literal["string", "json"] = "json"
    ) -> dict:
        cached = await self.get_by_key(key)
        if cached:
            logging.info(f"Cache hit for key: {key}")
            if cached_type == "json":
                cached = orjson.loads(cached)
            return cached
        result = await callback()
        if result is None:
            return None
        valueToCache = result if cached_type == "string" else orjson.dumps(
            result, default=defaultDumpJson)
        await self.set_redis_key(RedisData(key=key, value=valueToCache, ttl=ttl))
        return result

    async def publish(self, channel: ChannelT, message: str) -> None:
        await self.client.publish(channel, message)

    async def subscribe(self, channel: ChannelT) -> client.PubSub:
        pubsub = self.client.pubsub()
        await pubsub.subscribe(channel)
        return pubsub


# Singleton redis manager
RedisInstance = None


class RedisData(BaseModel):
    key: bytes | str
    value: bytes | str
    ttl: Optional[int | timedelta] = 60 * 60  # 1 hour


def init_instance_redis() -> RedisManager:
    global RedisInstance
    if RedisInstance is not None:
        return RedisInstance
    pool = aioredis.ConnectionPool.from_url(
        str(settings.REDIS_URL), max_connections=10, decode_responses=True
    )
    client = aioredis.Redis(connection_pool=pool)
    RedisInstance = RedisManager(client)
    return RedisInstance


init_instance_redis()
