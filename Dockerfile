# Ultra-simple Dockerfile for SCARDUS TECH website
FROM python:3.12-alpine

# Set working directory
WORKDIR /app

# Copy only the essential files
COPY index.html .
COPY 403.html .
COPY server.py .
COPY *.png .
COPY *.jpg .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000')" || exit 1

# Run the simple server
CMD ["python", "server.py"]