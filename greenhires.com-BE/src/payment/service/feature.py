from uuid import UUID
from sqlalchemy.orm import Session
from src.user.schema import Feature
from sqlalchemy import select, insert, update
from src.user.model import Feature


async def update_feature_limits(db: Session, account_id: UUID, is_coupon_used: bool = False):
    stmt = select(Feature).where(Feature.account_id == account_id)
    result = await db.execute(stmt)
    feature = result.scalars().first()

    COUPON_FREE_DOWNLOAD = 3
    if is_coupon_used:
        if feature.num_of_PDF_exports >= 0:
            feature.num_of_PDF_exports += COUPON_FREE_DOWNLOAD
    else:
        if feature.num_of_PDF_exports >= 0:
            feature.num_of_PDF_exports = -1

    db.add(feature)
    return feature
