from lambda_function import lambda_handler
from moto import mock_cloudwatch
import boto3
import json


@mock_cloudwatch
def test_s3_metrics():
    """
    Given an admin
    When they go to the statistics page
    Then they can get the statistics about the storage.
    """
    conn = boto3.client("cloudwatch", region_name="eu-west-3")

    dim = [
                {
                    'Name': 'StorageType',
                    'Value': 'AllStorageTypes'
                },
                {
                    'Name': 'BucketName',
                    'Value': 'tdg-s3-bucket'
                }
            ]

    conn.put_metric_data(
        Namespace="AWS/S3",
        MetricData=[dict(MetricName="NumberOfObjects", Value=1.5, Dimensions=dim)]
    )

    event = dict()
    event["requestContext"] = dict()
    event["requestContext"]["http"] = dict()
    event["requestContext"]["http"]["sourceIp"] = "18.215.185.124"
    event["rawPath"] = "/S3/NumberOfObjects/AllStorageTypes"

    response = lambda_handler(event, None)
    body = json.loads(response['body'])

    assert response['statusCode'] == 200
    assert len(body['Datapoints']) == 1
    assert body['Datapoints'][0]["Average"] == 1.5


@mock_cloudwatch
def test_ec2_metrics():
    """
    Given an admin
    When they go to the statistics page
    Then they can get the statistics about the ec2.
    """
    conn = boto3.client("cloudwatch", region_name="us-east-1")

    dim = [
                {
                    'Name': 'InstanceId',
                    'Value': 'i-092988b42c6dea77e'
                }
            ]

    conn.put_metric_data(
        Namespace="AWS/EC2",
        MetricData=[dict(MetricName="NetworkIn", Value=222.7, Dimensions=dim)]
    )

    event = dict()
    event["requestContext"] = dict()
    event["requestContext"]["http"] = dict()
    event["requestContext"]["http"]["sourceIp"] = "18.215.185.124"
    event["rawPath"] = "/EC2/NetworkIn"

    response = lambda_handler(event, None)
    body = json.loads(response['body'])

    assert response['statusCode'] == 200
    assert len(body['Datapoints']) == 1
    assert body['Datapoints'][0]["Average"] == 222.7
