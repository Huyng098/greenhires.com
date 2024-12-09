from src.config import settings
import requests
from src.schema import PaginationData
from src.sample.schema import UnsplashImage

headers = {
    "accept": "application/json",
    "Authorization": f"Client-ID {settings.UNSPLASH_ACCESS_KEY}"
}


class ImageService:
    @staticmethod
    def get_all(
        q: str = '',
        page: int = 1,
        per_page: int = 10,
    ):
        BASE_UNSPLASH_URL = "https://api.unsplash.com/search/photos"
        url = f"{BASE_UNSPLASH_URL}?query={q}&page={page}&per_page={per_page}"
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            return PaginationData[UnsplashImage](
                items=[UnsplashImage(
                    id=item['id'],
                    width=item['width'],
                    height=item['height'],
                    name=item['user']['name'],
                    username=item['user']['username'],
                    thumb=item['urls']['thumb'],
                    image=item['urls']['full']
                ) for item in data['results']],
                total=data['total']
            )
        return PaginationData[UnsplashImage](items=[], total=0)

    @staticmethod
    def download(id: str) -> dict[str, str]:
        url = f"https://api.unsplash.com/photos/{id}/download"
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return {"url": response.json()['url']}
        return {"message": "Failed to download file"}
