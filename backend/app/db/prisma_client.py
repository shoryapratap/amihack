from prisma import Prisma
import logging

logger = logging.getLogger(__name__)

prisma = Prisma()

async def get_prisma_db() -> Prisma:
    """
    Returns connected Prisma client instance for PostgreSQL.
    Automatically connects if disconnected.
    """
    if not prisma.is_connected():
        try:
            await prisma.connect()
            logger.info("Connected to PostgreSQL (schema surplus) via Prisma.")
        except Exception as e:
            logger.error(f"Error connecting to PostgreSQL: {e}")
            raise
    return prisma
