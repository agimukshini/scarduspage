# Simple Dockerfile for SCARDUS TECH website
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy all website files
COPY index.html .
COPY styles.css .
COPY animations.js .
COPY simple_server.py .
COPY 403.html .
COPY 404.html .
COPY *.png .
COPY *.jpg .
COPY *.svg .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000')" || exit 1

# Run the simple server
CMD ["python", "simple_server.py"]