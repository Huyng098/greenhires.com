from src.config import settings
import requests
from src.schema import PaginationData
from src.sample.schema import SVGImage

headers = {
    "accept": "application/json",
    "Authorization": f"Bearer {settings.ICONFINDER_API_KEY}"
}


class GraphicService:
    @staticmethod
    def get_all(
        q: str = '',
        offset: int = 0,
        limit: int = 100,
    ):
        BASE_ICONFINDER_URL = "https://api.iconfinder.com/v4/icons/search?premium=0&vector=1&license=commercial"
        url = f"{BASE_ICONFINDER_URL}?query={q}&count={limit}&offset={offset}&vector=1"

        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()

            return PaginationData[SVGImage](
                items=[SVGImage(
                    id=item['icon_id'],
                    downloadUrl=item['vector_sizes'][0]['formats'][0]['download_url'],
                    thumb=[
                        r['formats'][0]['preview_url']
                        for r in item['raster_sizes']
                        if r['size'] <= 128 and any(f['format'] == "png" for f in r['formats'])
                    ][-1]
                ) for item in data['icons']
                    if any(
                    any(f['format'] == "svg" for f in s['formats'])
                    for s in item['vector_sizes']
                )],
                total=data['total_count']
            )
        return PaginationData[SVGImage](items=[], total=0)

    @staticmethod
    def download(url: str) -> dict[str, str]:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return {"file": response.text}
        return {"message": "Failed to download file"}
