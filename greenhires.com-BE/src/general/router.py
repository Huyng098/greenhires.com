from io import BytesIO
from uuid import uuid4
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from src.auth.jwt import parse_jwt_account_data, parse_jwt_admin_data
from src.auth.schema import JWTData
from src.general import service
from src.general.schema import CategoryCreate, Category, CategoryType, UploadImage, DeleteImage
from src.user import service as user_service
from src.schema import Url
from src.user.schema import ProfileCreate
from src.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from src import schema as baseSchema

router = APIRouter()


@router.post("/category")
async def create_category(
    category: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_admin_data),
) -> Category:
    category = await service.create_category(db, category, jwt_data.account_id)
    return category


@router.get("/category")
async def get_all_categories(
    type: CategoryType = CategoryType.RESUME, db: AsyncSession = Depends(get_db)
) -> list[Category]:
    categories = await service.get_all_categories(db, type)
    return categories


@router.post("/storage/upload", response_model=Url)
async def upload_image(
    background_tasks: BackgroundTasks,
    image_form: UploadImage = Depends(UploadImage.as_form),
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> Url:
    account_id = jwt_data.account_id
    extension = image_form.image.filename.split(".")[-1]
    if image_form.type == "avatar":
        filepath = f"{account_id}/avatars/{account_id}/{str(uuid4())}.{extension}"
    elif image_form.type == "resume":
        filepath = f"{account_id}/resumes/{image_form.resume_id}.{extension}"
    elif image_form.type == "sample":
        filepath = f"{account_id}/samples/{image_form.sample_id}.{extension}"
    elif image_form.type == "general":
        filepath = f"{account_id}/general/{uuid4()}.{extension}"
    elif image_form.type == "canva":
        filepath = f"{account_id}/canva/{image_form.image.filename}"
    elif image_form.type == "cover_picture":
        filepath = (
            f"{account_id}/cover_pictures/{account_id}/{str(uuid4())}.{extension}"
        )
    
    file_content = BytesIO(image_form.image.file.read())
    url = service.upload_file(file_content, filepath)
    if image_form.type == "avatar":
        background_tasks.add_task(
            user_service.change_info, db, account_id, ProfileCreate(picture=url)
        )
    elif image_form.type == "cover_picture":
        background_tasks.add_task(
            user_service.change_info, db, account_id, ProfileCreate(cover_picture=url)
        )
    elif image_form.type == "canva":
        image_type = (
            "svg" if image_form.image.content_type == "image/svg+xml" else "image"
        )
        background_tasks.add_task(
            user_service.insert_canva_image, db, account_id, url, image_type
        )
    return Url(url=url)


@router.delete("/storage/delete")
async def delete_file(
    file_path: DeleteImage,
    jwt_data: JWTData = Depends(parse_jwt_account_data)
) -> baseSchema.Message:
    try:
        service.delete_file(file_path.url)
    except:
        raise HTTPException(status_code=500, detail="Error when deleting image")
    return baseSchema.Message(message="Image has been deleted")
