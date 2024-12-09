import json
import logging
import boto3
from botocore.exceptions import ClientError
from src.config import settings
from io import BytesIO

# Singleton S3 Instance
S3Instance = None


class S3Manager:
    def __init__(self, client):
        self.client = client
        self.bucket_path = f"https://{settings.AWS_S3_BUCKET_NAME}.s3.{settings.AWS_DEFAULT_REGION}.amazonaws.com"

    def upload_object(
        self,
        buffer: BytesIO,
        filepath: str,
    ) -> str:
        logging.info(f"Uploading {filepath} to S3")
        extension = filepath.split(".")[-1]
        filename = filepath.split("/")[-1]
        if extension == "pdf":
            content_type = "application/pdf"
            content_disposition = f"attachment;filename=${filename}"
        elif extension == "txt":
            content_type = "text/plain"
            content_disposition = f"attachment;filename=${filename}"
        elif extension == "svg":
            content_type = "image/svg+xml"
            content_disposition = ""
        else:
            content_type = "image/jpeg"
            content_disposition = ""
        self.client.put_object(
            Body=buffer, Bucket=settings.AWS_S3_BUCKET_NAME,
            Key=filepath, ContentType=content_type,
            ContentDisposition=content_disposition,
            ACL='public-read')
        url = f"{self.bucket_path}/{filepath}"
        return url

    def delete_object(self, filepath: str) -> None:
        filename = filepath.replace(f"{self.bucket_path}/", "")
        self.client.delete_object(
            Bucket=settings.AWS_S3_BUCKET_NAME, Key=filename)


def init_instance_s3() -> S3Manager:
    """Create an S3 bucket in a specified region
        If a region is not specified, the bucket is created in the S3 default region (us-east-1).
    :param bucket_name: Bucket to create
    :param region: String region to create bucket in, e.g., 'us-west-2'
    :return: True if bucket created, else False
    """
    global S3Instance
    if S3Instance is not None:
        return S3Instance
    BUCKET_POLICY = {
        'Version': '2012-10-17',
        'Statement': [{
            'Sid': 'AddPerm',
            'Effect': 'Allow',
            'Principal': '*',
            'Action': ['s3:GetObject'],
            'Resource': f'arn:aws:s3:::{settings.AWS_S3_BUCKET_NAME}/*'
        }]
    }
    bucket_policy = json.dumps(BUCKET_POLICY)
    client = boto3.client('s3',
                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                          )
    try:
        client.head_bucket(Bucket=settings.AWS_S3_BUCKET_NAME)
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == '404':
            try:
                if settings.AWS_DEFAULT_REGION is None:
                    client.create_bucket(Bucket=settings.AWS_S3_BUCKET_NAME)
                else:
                    location = {
                        'LocationConstraint': settings.AWS_DEFAULT_REGION}
                    client.create_bucket(
                        Bucket=settings.AWS_S3_BUCKET_NAME,
                        CreateBucketConfiguration=location
                    )
            except ClientError as e:
                logging.error(e)
        client.put_bucket_policy(
            Bucket=settings.AWS_S3_BUCKET_NAME, Policy=bucket_policy)
    S3Instance = S3Manager(client)
    return S3Instance


init_instance_s3()
