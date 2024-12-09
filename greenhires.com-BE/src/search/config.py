from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text


async def init_index(db: AsyncSession) -> None:
    # Index for blog table if not exists
    try:
        stmt = "ALTER TABLE blog ADD COLUMN bm25_id SERIAL;"
        await db.execute(text(stmt))
        try:
            stmt = """
            CALL paradedb.create_bm25(
              index_name => 'blog_idx',
              schema_name => 'public',
              key_field => 'bm25_id',
              table_name => 'blog',
              text_fields => '{content: {tokenizer: {type: "en_stem"}}, title: {}}'
            );
          """
            await db.execute(text(stmt))
        except Exception as e:
            pass
    except Exception as e:
        pass
