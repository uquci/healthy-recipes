FROM python:3.12-slim

WORKDIR /app

# sqlite dosyası için yazılabilir klasör
RUN mkdir -p /app/data

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
ENV PYTHONUNBUFFERED=1

# Render'da bunu kullanacağız
ENV SQLITE_PATH=/app/data/app.db

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
