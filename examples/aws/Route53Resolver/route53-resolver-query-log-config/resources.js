// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "my-project-dns-query",
    }),
  },
  { type: "Vpc", group: "EC2", name: "vpc-default", isDefault: true },
  {
    type: "QueryLogConfig",
    group: "Route53Resolver",
    properties: ({}) => ({
      Name: "my-dns-query-config",
    }),
    dependencies: ({}) => ({
      cloudWatchLogGroup: "my-project-dns-query",
    }),
  },
  {
    type: "QueryLogConfig",
    group: "Route53Resolver",
    properties: ({}) => ({
      DestinationArn: "arn:aws:s3:::gc-dns-query-config/my-prefix",
      Name: "my-dns-query-config-s3",
    }),
    dependencies: ({}) => ({
      s3Bucket: "gc-dns-query-config",
    }),
  },
  {
    type: "QueryLogConfigAssociation",
    group: "Route53Resolver",
    dependencies: ({}) => ({
      queryLogConfig: "my-dns-query-config-s3",
      vpc: "vpc-default",
    }),
  },
  {
    type: "QueryLogConfigAssociation",
    group: "Route53Resolver",
    dependencies: ({}) => ({
      queryLogConfig: "my-dns-query-config",
      vpc: "vpc-default",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: "gc-dns-query-config",
      Policy: {
        Version: "2012-10-17",
        Id: "AWSLogDeliveryWrite20150319",
        Statement: [
          {
            Sid: "AWSLogDeliveryWrite",
            Effect: "Allow",
            Principal: {
              Service: "delivery.logs.amazonaws.com",
            },
            Action: "s3:PutObject",
            Resource: `arn:aws:s3:::gc-dns-query-config/my-prefix/AWSLogs/${config.accountId()}/*`,
            Condition: {
              StringEquals: {
                "aws:SourceAccount": `${config.accountId()}`,
                "s3:x-amz-acl": "bucket-owner-full-control",
              },
              ArnLike: {
                "aws:SourceArn": `arn:aws:logs:${
                  config.region
                }:${config.accountId()}:*`,
              },
            },
          },
          {
            Sid: "AWSLogDeliveryAclCheck",
            Effect: "Allow",
            Principal: {
              Service: "delivery.logs.amazonaws.com",
            },
            Action: "s3:GetBucketAcl",
            Resource: "arn:aws:s3:::gc-dns-query-config",
            Condition: {
              StringEquals: {
                "aws:SourceAccount": `${config.accountId()}`,
              },
              ArnLike: {
                "aws:SourceArn": `arn:aws:logs:${
                  config.region
                }:${config.accountId()}:*`,
              },
            },
          },
        ],
      },
    }),
  },
];