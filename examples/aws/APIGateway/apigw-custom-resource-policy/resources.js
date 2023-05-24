// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      name: "sam-app",
      schema: {
        openapi: "3.0.1",
        info: {
          title: "sam-app",
          version: "1",
        },
        paths: {
          "/": {
            get: {
              "x-amazon-apigateway-integration": {
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_MATCH",
                type: "AWS_PROXY",
                uri: `arn:aws:apigateway:${
                  config.region
                }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:sam-app-HelloWorldFunction-mNxHkrOxjPyE/invocations`,
              },
            },
          },
        },
        components: {
          schemas: {},
        },
      },
      deployment: {
        stageName: "Prod",
      },
    }),
  },
  {
    type: "RestApiPolicy",
    group: "APIGateway",
    properties: ({ getId }) => ({
      policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: "execute-api:Invoke",
            Resource: `${getId({
              type: "RestApi",
              group: "APIGateway",
              name: "sam-app",
              path: "live.arnv2",
            })}/Prod/*/*`,
            Condition: {
              DateGreaterThan: {
                "aws:CurrentTime": "2022-09-01T00:00:00Z",
              },
              DateLessThan: {
                "aws:CurrentTime": "2022-09-30T23:59:59Z",
              },
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      restApi: "sam-app",
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "Prod",
    }),
    dependencies: ({}) => ({
      restApi: "sam-app",
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "Stage",
    }),
    dependencies: ({}) => ({
      restApi: "sam-app",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-HelloWorldFunctionRole-1K79IUAXP1MXQ",
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
        Architectures: ["arm64"],
        FunctionName: "sam-app-HelloWorldFunction-mNxHkrOxjPyE",
        Handler: "app.lambda_handler",
        Runtime: "python3.9",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-HelloWorldFunctionRole-1K79IUAXP1MXQ",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-HelloWorldFunction-mNxHkrOxjPyE",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "sam-app",
            path: "live.arnv2",
          })}/*/GET/`,
          StatementId:
            "sam-app-HelloWorldFunctionHelloWorldPermissionProd-1XSCWVNXANXH8",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-HelloWorldFunction-mNxHkrOxjPyE",
      apiGatewayRestApis: ["sam-app"],
    }),
  },
];