// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Account",
    group: "APIGateway",
    dependencies: ({}) => ({
      cloudwatchRole:
        "ServerlessLand-ServerlessLandCloudWatchRole836732A-W72RXN6FCTVP",
    }),
  },
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      description:
        "General purpose Lambda to get request from API Gateway with CDK",
      endpointConfiguration: {
        types: ["EDGE"],
      },
      name: "ServerlessLand",
      tags: {
        Key: "Value",
        Project: "ServerlessLand",
      },
      schema: {
        openapi: "3.0.1",
        info: {
          description:
            "General purpose Lambda to get request from API Gateway with CDK",
          title: "ServerlessLand",
          version: "1",
        },
        paths: {
          "/": {
            "x-amazon-apigateway-any-method": {
              "x-amazon-apigateway-integration": {
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_MATCH",
                type: "AWS_PROXY",
                uri: `arn:aws:apigateway:${
                  config.region
                }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:ServerlessLand-handlerE1533BD5-zl2CyOxo8mTL/invocations`,
              },
            },
          },
          "/{proxy+}": {
            "x-amazon-apigateway-any-method": {
              parameters: [
                {
                  name: "proxy",
                  in: "path",
                  required: true,
                  schema: {
                    type: "string",
                  },
                },
              ],
              "x-amazon-apigateway-integration": {
                httpMethod: "POST",
                passthroughBehavior: "WHEN_NO_MATCH",
                type: "AWS_PROXY",
                uri: `arn:aws:apigateway:${
                  config.region
                }:lambda:path/2015-03-31/functions/arn:aws:lambda:${
                  config.region
                }:${config.accountId()}:function:ServerlessLand-handlerE1533BD5-zl2CyOxo8mTL/invocations`,
              },
            },
          },
        },
        components: {
          schemas: {
            Empty: {
              title: "Empty Schema",
              type: "object",
            },
            Error: {
              title: "Error Schema",
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      deployment: {
        stageName: "prod",
      },
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "prod",
      tags: {
        Key: "Value",
        Project: "ServerlessLand",
      },
    }),
    dependencies: ({}) => ({
      restApi: "ServerlessLand",
      account: "default",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "ServerlessLand-handlerServiceRole187D5A5A-1QKSYX4MFFNOR",
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
      Tags: [
        {
          Key: "Key",
          Value: "Value",
        },
        {
          Key: "Project",
          Value: "ServerlessLand",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "ServerlessLand-ServerlessLandCloudWatchRole836732A-W72RXN6FCTVP",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "apigateway.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs",
          PolicyName: "AmazonAPIGatewayPushToCloudWatchLogs",
        },
      ],
      Tags: [
        {
          Key: "Key",
          Value: "Value",
        },
        {
          Key: "Project",
          Value: "ServerlessLand",
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
        FunctionName: "ServerlessLand-handlerE1533BD5-zl2CyOxo8mTL",
        Handler: "index.ApiLambda",
        Runtime: "nodejs16.x",
      },
      Tags: {
        Key: "Value",
        Project: "ServerlessLand",
      },
    }),
    dependencies: ({}) => ({
      role: "ServerlessLand-handlerServiceRole187D5A5A-1QKSYX4MFFNOR",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "ServerlessLand-handlerE1533BD5-zl2CyOxo8mTL",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "ServerlessLand",
            path: "live.arnv2",
          })}/prod/*/`,
          StatementId:
            "ServerlessLand-ServerlessLandANYApiPermissionServerlessLand218F49ADANYCCE6DDD3-194C9WW38PGN1",
        },
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "ServerlessLand-handlerE1533BD5-zl2CyOxo8mTL",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "ServerlessLand",
            path: "live.arnv2",
          })}/test-invoke-stage/*/`,
          StatementId:
            "ServerlessLand-ServerlessLandANYApiPermissionTestServerlessLand218F49ADANY2068D9E3-1N6GVS0XJDM9F",
        },
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "ServerlessLand-handlerE1533BD5-zl2CyOxo8mTL",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "ServerlessLand",
            path: "live.arnv2",
          })}/prod/*/*`,
          StatementId:
            "ServerlessLand-ServerlessLandproxyANYApiPermissionServerlessLand218F49ADANYproxyEB71D2-WI6TYU0FL8KH",
        },
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "ServerlessLand-handlerE1533BD5-zl2CyOxo8mTL",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "ServerlessLand",
            path: "live.arnv2",
          })}/test-invoke-stage/*/*`,
          StatementId:
            "ServerlessLand-ServerlessLandproxyANYApiPermissionTestServerlessLand218F49ADANYproxyB6-S8FAQ9HDQB50",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "ServerlessLand-handlerE1533BD5-zl2CyOxo8mTL",
      apiGatewayRestApis: ["ServerlessLand"],
    }),
  },
];