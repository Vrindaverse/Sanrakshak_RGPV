FROM python:3.12-slim-bookworm

WORKDIR /app

# Install system dependencies for vulnerability scanning
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        nmap \
        nikto; \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Start FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
