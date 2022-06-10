# Metrics MicroService

This service fetches metrics from EC2 and S3, the code in file lambda_function.py and runs in AWS Lambda.


## EC2 Metrics

### Network traffic entering in bytes
 [https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/EC2/NetworkIn](https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/EC2/NetworkIn)

### Network traffic leaving in bytes
 [https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/EC2/NetworkOut](https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/EC2/NetworkOut)

### Number of traffic packets entering
 [https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/EC2/NetworkPacketsIn](https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/EC2/NetworkPacketsIn)

### Number of traffic packets leaving
 [https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/EC2/NetworkPacketsOut](https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/EC2/NetworkPacketsOut)

### CPU Usage (Percentage)
 [https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/EC2/CPUUtilization](https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/EC2/CPUUtilization)



## S3 Metrics

### Get number of objects from S3 bucket:

 [https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/S3/NumberOfObjects/AllStorageTypes](https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/S3/NumberOfObjects/AllStorageTypes)


### Get number of bytes stored in S3 bucket:

 [https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/S3/BucketSizeBytes/StandardStorage](https://t3rvuagfqgsjo5t2sek3twfyz40cngon.lambda-url.us-east-1.on.aws/S3/BucketSizeBytes/StandardStorage)


 