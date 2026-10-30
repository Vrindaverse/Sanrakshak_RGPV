FROM python:3.12-slim-bookworm

WORKDIR /app

# Update package lists
RUN apt-get update

# Install Nmap separately
RUN apt-get install -y --no-install-recommends nmap

# Install Nikto separately
RUN apt-get install -y --no-install-recommends nikto

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Start FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
