# Retrieve MicroService

This service allows to retrive a file from S3 tdg bucket

## API

### Endpoints:

GET: /api/2/files - Returns all the file names and their sizes.


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


