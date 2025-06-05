# Deployment Guide

This document explains how to set up the CI/CD pipeline for deploying the Fashion Shop application to AWS S3 and CloudFront using GitHub Actions.

## GitHub Actions Workflow

The repository includes a GitHub Actions workflow file (`.github/workflows/deploy.yml`) that automatically:

1. Builds the React application
2. Runs tests
3. Deploys to AWS S3
4. Invalidates the CloudFront distribution cache

The workflow runs on:
- Push to main/master branches
- Pull requests to main/master branches
- Manual trigger via GitHub Actions UI

## Required GitHub Configuration

### GitHub Secrets (for sensitive information)

In your GitHub repository settings, add these secrets:

1. `AWS_ACCESS_KEY_ID`: Your AWS access key
2. `AWS_SECRET_ACCESS_KEY`: Your AWS secret key

### GitHub Variables (for non-sensitive configuration)

In your GitHub repository settings, add these variables:

1. `AWS_REGION`: The AWS region where your S3 bucket is located (e.g., `us-east-1`)
2. `S3_BUCKET`: The name of your S3 bucket (e.g., `my-fashion-shop-bucket`)
3. `CLOUDFRONT_DISTRIBUTION_ID`: Your CloudFront distribution ID

## AWS Setup Requirements

Before the CI/CD pipeline can work, you need to:

1. Create an S3 bucket configured for static website hosting
2. Set up a CloudFront distribution pointing to the S3 bucket
3. Create an IAM user with permissions to:
   - Write to the S3 bucket
   - Create CloudFront invalidations

## IAM Policy Example

The IAM user needs at least these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET-NAME",
        "arn:aws:s3:::YOUR-BUCKET-NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

Replace `YOUR-BUCKET-NAME` with your actual S3 bucket name.
