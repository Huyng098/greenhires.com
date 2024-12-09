import logging
from fastapi import Request
import httpx
from asgiref.sync import sync_to_async
from XdbSearchIP.xdbSearcher import XdbSearcher
from src.external_service.redis import RedisData, RedisInstance
from src.config import settings
import os
from pathlib import Path

BasePath = Path(__file__).resolve().parent.parent
IP2REGION_XDB = os.path.join(BasePath, 'static', 'ip2region.xdb')


@sync_to_async
def get_request_ip(request: Request) -> str:
    """Read the client's IP address from the request headers"""
    real = request.headers.get('X-Real-IP')
    if real:
        ip = real
    else:
        forwarded = request.headers.get('X-Forwarded-For')
        if forwarded:
            ip = forwarded.split(',')[0]
        else:
            ip = request.client.host
    if ip == 'testclient':
        ip = '127.0.0.1'
    return ip


async def get_location_online(ip: str, user_agent: str) -> dict | None:
    """
    :param ip:
    :param user_agent:
    :return:
    """
    async with httpx.AsyncClient(timeout=3) as client:
        ip_api_url = f'http://ip-api.com/json/{ip}?lang=en'
        headers = {'User-Agent': user_agent}
        try:
            response = await client.get(ip_api_url, headers=headers)
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            logging.error(f'Failed to get ip location online, error: {e}')
            return None


@sync_to_async
def get_location_offline(ip: str) -> dict | None:
    """
    :param ip:
    :return:
    """
    try:
        cb = XdbSearcher.loadContentFromFile(dbfile=IP2REGION_XDB)
        searcher = XdbSearcher(contentBuff=cb)
        data = searcher.search(ip)
        searcher.close()
        data = data.split('|')
        return {
            'country': data[0] if data[0] != '0' else None,
            'regionName': data[2] if data[2] != '0' else None,
            'city': data[3] if data[3] != '0' else None,
        }
    except Exception as e:
        logging.error(f'Failed to get ip location offline, error: {e}')
        return None


async def parse_ip_info(request: Request) -> tuple[str, str, str, str]:
    country, region, city = None, None, None
    ip = await get_request_ip(request)
    location = await RedisInstance.get_by_key(f'ip_location:{ip}')
    if location:
        country, region, city = location.split(' ')
        return ip, country, region, city
    if settings.LOCATION_PARSE == 'online':
        location_info = await get_location_online(ip, request.headers.get('User-Agent'))
    elif settings.LOCATION_PARSE == 'offline':
        location_info = await get_location_offline(ip)
    else:
        location_info = None
    if location_info:
        country = location_info.get('country')
        region = location_info.get('regionName')
        city = location_info.get('city')
        await RedisInstance.set_redis_key(
            RedisData(key=f'ip_location:{ip}',
                      value=f'{country} {region} {city}'),
            ttl=60 * 60 * 24
        )
    return ip, country, region, city
