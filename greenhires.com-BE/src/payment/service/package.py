from fastapi import HTTPException
from src.payment.model import Package, PackageStatus
from src.payment import schema
from src.payment.gateway import PayPalGateway
from sqlalchemy import and_, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession


async def add_package(
    db: AsyncSession, package: schema.PackageCreate
) -> schema.Package:
    if package.isAutoRenew:
        paypal_product_id = PayPalGateway.create_product(package)
    else:
        paypal_product_id = None
    stmt = (
        insert(Package)
        .values(
            **package.model_dump(exclude_none=True),
            paypal_product_id=paypal_product_id,
        )
        .returning(Package)
    )
    result = await db.execute(stmt)
    dto = result.scalars().first()
    package = schema.Package.model_validate(dto)
    await db.commit()
    return package


async def get_package(db: AsyncSession, package_id: str) -> schema.Package | None:
    stmt = select(Package).where(
        and_(
            Package.id == package_id,
            Package.status == PackageStatus.ACTIVE,
        )
    )
    result = await db.execute(stmt)
    package = result.scalars().first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return schema.Package.model_validate(package)


async def get_package_frequency(
    db: AsyncSession, frequency: str
) -> schema.Package | None:
    stmt = select(Package).where((Package.frequency == frequency))
    result = await db.execute(stmt)
    package = result.scalars().first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return schema.Package.model_validate(package)


async def get_packages(
    db: AsyncSession,
) -> list[schema.Package] | None:
    stmt = select(Package)
    result = await db.execute(stmt)
    packages = result.scalars().all()
    return [schema.Package.model_validate(package) for package in packages]


async def update_package(
    db: AsyncSession, package_id: str, package: schema.PackageUpdate
) -> schema.Package:
    stmt = (
        update(Package)
        .where(Package.id == package_id)
        .values(
            **package.model_dump(exclude_none=True),
        )
        .returning(Package)
    )
    result = await db.execute(stmt)
    dto = result.scalars().first()
    if not dto:
        raise HTTPException(status_code=404, detail="Package not found")
    package = schema.Package.model_validate(dto)

    await db.commit()
    return package
