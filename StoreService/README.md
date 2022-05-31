# Store MicroService

This service allows to store files in S3 bucket

## API

### Endpoints:

POST: /api/1/files - Stores the provided file in the S3 bucket.

- Args: 
    - File

## Local Installation

1. (Optional) Create a virtual environment
```
python3 -m venv venv
source venv/bin/activate
```

2. Install requirements
```
pip install -r requirements.txt
```

3. Running 
```
cd src
uvicorn main:app --reload
```

Run Tests
```
cd src
pytest
```


