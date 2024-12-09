import logging
import os
from src.config import settings
from io import BytesIO

# Singleton Upload Server Instance
UploadServerInstance = None

class UploadServerManager:
    def __init__(self) -> None:
        pass

    def upload_object(
        self,
        buffer: BytesIO,
        path: str,
    ) -> str:
        file_folder = os.path.dirname(path)
        full_path = os.path.join(settings.LOCAL_STATIC_FILES_DIR, file_folder)
        os.makedirs(full_path, exist_ok=True)
        file_path = os.path.join(settings.LOCAL_STATIC_FILES_DIR, path)
        with open(file_path, "wb") as out_file:
            out_file.write(buffer.read())

        url = f"{settings.LOCAL_STATIC_FILES_DOMAIN}/{path}"
        return url

    def delete_object(self, filepath: str) -> None:
        # Delete the file locally
        file_path = filepath.replace(f"{settings.LOCAL_STATIC_FILES_DOMAIN}/", "")
        local_file_path = os.path.join(settings.LOCAL_STATIC_FILES_DIR, f"{file_path}")

        if os.path.exists(local_file_path):
            os.remove(local_file_path)
            logging.info(f"File {local_file_path} has been deleted")
        else:
            logging.warning(f"File {local_file_path} not found for deletion")


def init_instance() -> UploadServerManager:
    global UploadServerInstance
    if UploadServerInstance is not None:
        return UploadServerInstance
    UploadServerInstance = UploadServerManager()
    return UploadServerInstance


init_instance()
