import json
import boto3
from datetime import datetime

def get_metric(namespace, metricname, client):
    response = client.get_metric_statistics(
            Namespace=namespace, 
            MetricName=metricname,  
            Dimensions=[
                {
                    'Name':'InstanceId',
                    'Value':'i-092988b42c6dea77e'
                }
            ],
            StartTime=datetime(2022, 5, 21),
            EndTime=datetime.now(),
            Period=3600,
            Statistics=[
                'SampleCount','Average','Sum','Minimum','Maximum'
            ]
        )
    return response
        
def lambda_handler(event, context):
    
    if event["requestContext"]["http"]["sourceIp"] == "18.215.185.124":
        
        client = boto3.client('cloudwatch',region_name = 'us-east-1')
        
        path= event["rawPath"].split("/")
        namespace = "AWS/" + path[1]
        metricname= path[2]
        
        return {
            'statusCode': 200,
            'body': json.dumps(get_metric(namespace,metricname, client), default=str)
        }
    else:
        return {
            'statusCode': 200,
            'body': json.dumps(event["requestContext"]["http"]["sourceIp"])
        }
