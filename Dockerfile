# syntax=docker/dockerfile:1.6
FROM python:3.12-slim AS base

# Create non-root user
ARG APP_USER=appuser
ARG APP_GROUP=appgroup
ARG APP_HOME=/app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

# System deps
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    curl ca-certificates && rm -rf /var/lib/apt/lists/*

# Add user and directories
RUN groupadd -r ${APP_GROUP} && useradd -r -g ${APP_GROUP} -d ${APP_HOME} -s /sbin/nologin ${APP_USER}
WORKDIR ${APP_HOME}

# Python deps
COPY requirements.txt ./
RUN python -m venv /venv && /venv/bin/pip install --upgrade pip && /venv/bin/pip install -r requirements.txt
ENV PATH="/venv/bin:$PATH"

# App code
COPY app.py ./
COPY templates/ ./templates/
# Static logo mapping expects ScardusLogo.png in project root
COPY static/ScardusLogo.png ./

# Runtime security hardening
USER ${APP_USER}
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1:${PORT}/health || exit 1

# Gunicorn with gevent workers for efficiency
ENV GUNICORN_CMD_ARGS="--bind 0.0.0.0:${PORT} --workers 2 --worker-class gthread --threads 4 --access-logfile - --error-logfile - --timeout 60"
CMD ["gunicorn", "app:app"]
