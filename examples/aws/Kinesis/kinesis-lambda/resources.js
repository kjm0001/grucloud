// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-ApplicationFunctionRole-YS9MK7MA96OX",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyArn: "arn:aws:iam::aws:policy/AWSXrayWriteOnlyAccess",
          PolicyName: "AWSXrayWriteOnlyAccess",
        },
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
          PolicyName: "AWSLambdaBasicExecutionRole",
        },
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaKinesisExecutionRole",
          PolicyName: "AWSLambdaKinesisExecutionRole",
        },
      ],
    }),
  },
  {
    type: "Stream",
    group: "Kinesis",
    properties: ({}) => ({
      StreamName: "sam-app-KinesisStream-YpZDFXzi0Z4z",
      ShardCount: 1,
    }),
  },
  {
    type: "EventSourceMapping",
    group: "Lambda",
    properties: ({}) => ({
      BatchSize: 100,
      BisectBatchOnFunctionError: false,
      MaximumRecordAgeInSeconds: -1,
      MaximumRetryAttempts: -1,
      ParallelizationFactor: 1,
      StartingPosition: "LATEST",
      TumblingWindowInSeconds: 0,
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-ApplicationFunction-HBClwcgvRw7Z",
      kinesisStream: "sam-app-KinesisStream-YpZDFXzi0Z4z",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "sam-app-ApplicationFunction-HBClwcgvRw7Z",
        Handler: "app.lambdaHandler",
        Runtime: "nodejs12.x",
        TracingConfig: {
          Mode: "Active",
        },
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-ApplicationFunctionRole-YS9MK7MA96OX",
    }),
  },
];
