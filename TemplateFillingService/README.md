# Template Filing MicroService

This service allows to fill templates and store them in the S3 bucket

## API

### Endpoints:

POST: /api/3/fill - Stores a file with the given filename filled using the given template and json data.

- Args: 
    - File (JSON)
    - Template name (str)
    - Final name (str)

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