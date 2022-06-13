# Template Document Generator

The template document generator is a web based application which allows users to automatically fill documents based on uploaded templates and data.

The application is available in: http://18.215.185.124/

## Features

- Store files safelly in amazon S3;
- Access the aplication via web anywhere;
- Upload templates such as .xlsx, .docx and ppt;
- See all the templates and files uploaded and download them;
- Automatically fill tempaltes with data;

## Arquitecture and Technologies

![Template Document Generator Arquitecture](https://github.com/brunosbastos/es_tdg/blob/dev/assets/es_arch.png)


## Instalation

In order to locally install the application follow these steps:

1. Add your aws credentials (you need to have premissions for the S3 bucket otherwise you need to change the bucket name for one of your own)
```
cd RetrieveService
cp ~/.aws/credentials .

cd ../StoreService
cp ~/.aws/credentials .

cd ../TemplateFillingService
cp ~/.aws/credentials .
```


2. Change to Docker directory

```
cd Docker
```

3. Run the docker-compose

```
docker-compose -f docker-compose-local.yml up --build
```

Thats it the application will now be available on localhost
