FROM python:3.12.3-slim

RUN apt-get update && \
    apt-get install -y gcc libpq-dev build-essential libpoppler-cpp-dev pkg-config python3-dev && \
    apt clean && \
    rm -rf /var/cache/apt/* && \
    pip install poetry

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8 


WORKDIR /tmp
COPY ./pyproject.toml ./poetry.lock* /tmp/
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes
RUN pip install -U pip && \
    pip install --no-cache-dir -r /tmp/requirements.txt && \
    pip install playwright==1.43.0 && \
    playwright install --with-deps

COPY . /src
ENV PATH "$PATH:/src/scripts"
RUN chmod +x /src/scripts/*
WORKDIR /src
CMD ["./scripts/start-dev.sh"]
