// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "LambdaAdapterCdkStack-lambdaAdapterFunctionService-1WCZ5N8NHXFJG",
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
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
          PolicyName: "AWSLambdaBasicExecutionRole",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            AWS_LAMBDA_EXEC_WRAPPER: "/opt/bootstrap",
            RUST_LOG: "info",
          },
        },
        FunctionName:
          "LambdaAdapterCdkStack-lambdaAdapterFunction6BCDA39-EKYUs9AiFOqv",
        Handler: "run.sh",
        Layers: [
          "arn:aws:lambda:us-east-1:753240598075:layer:LambdaAdapterLayerX86:3",
        ],
        MemorySize: 1024,
        Runtime: "nodejs16.x",
        Timeout: 60,
      },
      FunctionUrlConfig: {
        AuthType: "NONE",
        Cors: {
          AllowMethods: ["*"],
          AllowOrigins: ["*"],
        },
        InvokeMode: "BUFFERED",
      },
    }),
    dependencies: ({}) => ({
      role: "LambdaAdapterCdkStack-lambdaAdapterFunctionService-1WCZ5N8NHXFJG",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({}) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName:
            "LambdaAdapterCdkStack-lambdaAdapterFunction6BCDA39-EKYUs9AiFOqv",
          Principal: "*",
          StatementId:
            "LambdaAdapterCdkStack-lambdaAdapterFunctioninvokefunctionurl0D7ABC84-YN2FM2PEP32Y",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction:
        "LambdaAdapterCdkStack-lambdaAdapterFunction6BCDA39-EKYUs9AiFOqv",
    }),
  },
];