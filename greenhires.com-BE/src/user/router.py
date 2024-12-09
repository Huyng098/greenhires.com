from fastapi import APIRouter, Depends, HTTPException
from src.auth import service as auth_service
from src.auth.jwt import (
    parse_jwt_account_data,
    parse_jwt_admin_data,
    parse_jwt_superadmin_data,
)
from src.auth.model import AccountRoleEnum
from src.auth.schema import AccountCreatedAdmin, JWTData, BasicInformation
from src.schema import PaginationData
from src.user.schema import CanvaImage, ChangePasswordSchema, ProfileUpdate, RoleUpdate
from src.user import service
from src.auth import service as auth_service
from src.auth.dependencies import valid_add_account
from src.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from src import schema as baseSchema

router = APIRouter()


@router.get("/me", response_model=BasicInformation)
async def get_my_account(
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> BasicInformation:
    account = await auth_service.get_account_by_id(db, jwt_data.account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found!")
    return account


@router.post("/logout")
async def logout(
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> baseSchema.Message:
    await auth_service.delete_refresh_token(db, jwt_data.account_id)
    return baseSchema.Message(message="Logout successfully!")


@router.put("/change-password")
async def change_password(
    change_password: ChangePasswordSchema,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> baseSchema.Message:
    await service.verify_password(db, jwt_data.account_id, change_password.old_password)
    if change_password.new_password != change_password.confirm_password:
        raise ValueError("New password and confirm password do not match!")
    await service.change_password(
        db, jwt_data.account_id, change_password.confirm_password
    )
    return baseSchema.Message(message="Password has been changed!")


@router.put("/change-my-info")
async def change_info(
    info: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> BasicInformation:
    user = await service.change_info(db, jwt_data.account_id, info)
    return user


@router.put("/change-role-user/{id}", response_model=BasicInformation)
async def change_role_user(
    id: str,
    role: RoleUpdate,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_superadmin_data),
) -> BasicInformation:
    user = await service.change_role_user(db, id, role.role)
    return user


@router.get("", response_model=PaginationData[BasicInformation])
async def get_all_users(
    limit: int = 10,
    offset: int = 0,
    role: AccountRoleEnum = None,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_admin_data),
) -> PaginationData[BasicInformation]:
    users, total = await service.get_all_users(db, limit, offset, role)
    return PaginationData[BasicInformation](items=users, total=total)


@router.post("", response_model=BasicInformation)
async def add_user(
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_admin_data),
    info: AccountCreatedAdmin = Depends(valid_add_account),
) -> BasicInformation:
    return await auth_service.create_email_account(db, info, jwt_data.account_id)


@router.delete("", response_model=baseSchema.Message)
async def delete_my_account(
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> baseSchema.Message:
    await service.delete_account(db, jwt_data.account_id)
    return baseSchema.Message(message="Account has been deleted!")


@router.delete("/{user_id}", response_model=baseSchema.Message)
async def superadmin_delete_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_superadmin_data),
) -> baseSchema.Message:
    await service.delete_account(db, user_id)
    return baseSchema.Message(message="Account has been deleted!")


@router.get("/canva-images", response_model=PaginationData[CanvaImage])
async def get_list_canva_images(
    limit: int = 10,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    jwt_data: JWTData = Depends(parse_jwt_account_data),
) -> PaginationData[CanvaImage]:
    images, total = await service.get_canva_images(
        db, jwt_data.account_id, limit, offset
    )
    return PaginationData[CanvaImage](items=images, total=total)
