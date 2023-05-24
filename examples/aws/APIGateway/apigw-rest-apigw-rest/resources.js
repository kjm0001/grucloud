// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "ApiKey",
    group: "APIGateway",
    properties: ({}) => ({
      name: "sam-ap-ApiKe-qI6WC9I57Dqo",
    }),
  },
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      description: "Centralized API",
      endpointConfiguration: {
        types: ["REGIONAL"],
      },
      name: "Primary API Gateway",
      schema: {
        openapi: "3.0.1",
        info: {
          description: "Centralized API",
          title: "Primary API Gateway",
          version: "1",
        },
        paths: {
          "/": {},
          "/admin": {},
          "/admin/reports": {
            get: {
              parameters: [
                {
                  name: "x-api-key",
                  in: "header",
                  required: true,
                  schema: {
                    type: "string",
                  },
                },
              ],
              responses: {
                200: {
                  description: "200 response",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Empty",
                      },
                    },
                  },
                },
              },
              "x-amazon-apigateway-integration": {
                httpMethod: "GET",
                passthroughBehavior: "WHEN_NO_MATCH",
                requestParameters: {
                  "integration.request.header.x-api-key":
                    "'12345678901234567890'",
                },
                type: "HTTP_PROXY",
                uri: `https://emxkmiruk0.execute-api.${config.region}.amazonaws.com/Prod`,
                responses: {
                  default: {
                    statusCode: "200",
                  },
                },
              },
            },
          },
          "/admin/users": {
            get: {
              parameters: [
                {
                  name: "x-api-key",
                  in: "header",
                  required: true,
                  schema: {
                    type: "string",
                  },
                },
              ],
              responses: {
                200: {
                  description: "200 response",
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Empty",
                      },
                    },
                  },
                },
              },
              "x-amazon-apigateway-integration": {
                httpMethod: "GET",
                passthroughBehavior: "WHEN_NO_MATCH",
                requestParameters: {
                  "integration.request.header.x-api-key":
                    "'12345678901234567890'",
                },
                type: "HTTP_PROXY",
                uri: `https://k3ti627zq7.execute-api.${config.region}.amazonaws.com/Prod`,
                responses: {
                  default: {
                    statusCode: "200",
                  },
                },
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
          },
        },
      },
      deployment: {
        stageName: "Prod",
      },
    }),
  },
  {
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["REGIONAL"],
      },
      name: "Reporting API",
      schema: {
        openapi: "3.0.1",
        info: {
          title: "Reporting API",
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
                }:${config.accountId()}:function:sam-app-ReportingFunction-uWuM1bJCNVIn/invocations`,
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
    type: "RestApi",
    group: "APIGateway",
    properties: ({ config }) => ({
      apiKeySource: "HEADER",
      endpointConfiguration: {
        types: ["REGIONAL"],
      },
      name: "User Management API",
      schema: {
        openapi: "3.0.1",
        info: {
          title: "User Management API",
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
                }:${config.accountId()}:function:sam-app-UserManagementFunction-So5CQsnlAZWO/invocations`,
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
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "Prod",
    }),
    dependencies: ({}) => ({
      restApi: "Primary API Gateway",
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "Stage",
    }),
    dependencies: ({}) => ({
      restApi: "Primary API Gateway",
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "Prod",
    }),
    dependencies: ({}) => ({
      restApi: "Reporting API",
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "Stage",
    }),
    dependencies: ({}) => ({
      restApi: "Reporting API",
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "Prod",
    }),
    dependencies: ({}) => ({
      restApi: "User Management API",
    }),
  },
  {
    type: "Stage",
    group: "APIGateway",
    properties: ({}) => ({
      stageName: "Stage",
    }),
    dependencies: ({}) => ({
      restApi: "User Management API",
    }),
  },
  {
    type: "UsagePlan",
    group: "APIGateway",
    properties: ({ getId }) => ({
      apiStages: [
        {
          apiId: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "User Management API",
          })}`,
          stage: "Prod",
        },
        {
          apiId: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "Reporting API",
          })}`,
          stage: "Prod",
        },
      ],
      name: "sam-ap-Usage-2Q9PBNv5VIOp",
    }),
    dependencies: ({}) => ({
      stages: ["Reporting API::Prod", "User Management API::Prod"],
    }),
  },
  {
    type: "UsagePlanKey",
    group: "APIGateway",
    properties: ({}) => ({
      name: "sam-ap-ApiKe-qI6WC9I57Dqo",
    }),
    dependencies: ({}) => ({
      usagePlan: "sam-ap-Usage-2Q9PBNv5VIOp",
      apiKey: "sam-ap-ApiKe-qI6WC9I57Dqo",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-ReportingFunctionRole-O4OB63LJ7IYA",
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
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-UserManagementFunctionRole-PCG3JRRLN8CI",
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
            LOCATION: "Response from reporting application",
          },
        },
        FunctionName: "sam-app-ReportingFunction-uWuM1bJCNVIn",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-ReportingFunctionRole-O4OB63LJ7IYA",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        Environment: {
          Variables: {
            LOCATION: "Response from user management application",
          },
        },
        FunctionName: "sam-app-UserManagementFunction-So5CQsnlAZWO",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-UserManagementFunctionRole-PCG3JRRLN8CI",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-ReportingFunction-uWuM1bJCNVIn",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "Reporting API",
            path: "live.arnv2",
          })}/*/GET/`,
          StatementId:
            "sam-app-ReportingFunctionRestApiPermissionProd-12HUD73KN7MJO",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-ReportingFunction-uWuM1bJCNVIn",
      apiGatewayRestApis: ["Reporting API"],
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-UserManagementFunction-So5CQsnlAZWO",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "RestApi",
            group: "APIGateway",
            name: "User Management API",
            path: "live.arnv2",
          })}/*/GET/`,
          StatementId:
            "sam-app-UserManagementFunctionRestApiPermissionProd-UYYYNDDKZ8QY",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-UserManagementFunction-So5CQsnlAZWO",
      apiGatewayRestApis: ["User Management API"],
    }),
  },
];