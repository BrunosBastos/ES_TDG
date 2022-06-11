import json
import boto3
from datetime import datetime


# Get metrics from EC2 machine
def get_metric_ec2(namespace, metricname, client):
    response = client.get_metric_statistics(
            Namespace=namespace,
            MetricName=metricname,
            Dimensions=[
                {
                    'Name': 'InstanceId',
                    'Value': 'i-092988b42c6dea77e'
                }
            ],
            StartTime=datetime(2022, 5, 21),
            EndTime=datetime.now(),
            Period=3600,
            Statistics=[
                'SampleCount', 'Average', 'Sum', 'Minimum', 'Maximum'
            ]
        )
    return response


# Get metrics from S3 bucket
def get_metric_s3(namespace, metricname, storageType, client):
    response = client.get_metric_statistics(
            Namespace=namespace,
            MetricName=metricname,
            Dimensions=[
                {
                    'Name': 'StorageType',
                    'Value': storageType
                },
                {
                    'Name': 'BucketName',
                    'Value': 'tdg-s3-bucket'
                }
            ],
            StartTime=datetime(2022, 5, 21),
            EndTime=datetime.now(),
            Period=3600,
            Statistics=[
                'SampleCount', 'Average', 'Sum', 'Minimum', 'Maximum'
            ]
        )
    return response


def lambda_handler(event, context):

    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    if event["requestContext"]["http"]["sourceIp"] == "18.215.185.124":

        path = event["rawPath"].split("/")
        namespace = "AWS/" + path[1]
        metricname = path[2]

        if namespace == "AWS/EC2":
            client = boto3.client('cloudwatch', region_name='us-east-1')
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(get_metric_ec2(namespace, metricname, client), default=str)
            }
        else:
            client = boto3.client('cloudwatch', region_name='eu-west-3')
            storageType = path[3]
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(get_metric_s3(namespace, metricname, storageType, client), default=str)
            }

    else:
        return {
            'statusCode': 403,
            'headers': headers,
            'body': json.dumps("Access denied")
        }
