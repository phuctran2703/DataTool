FROM python:3.12-slim

WORKDIR /app

COPY static/ static/
COPY templates/ templates/
COPY requirements.txt .
COPY app.py .
COPY tool.py .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "app.py"]
