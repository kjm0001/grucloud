// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    name: "MyHttpApi",
    properties: ({}) => ({
      ProtocolType: "HTTP",
      ApiKeySelectionExpression: "$request.header.x-api-key",
      DisableExecuteApiEndpoint: false,
      RouteSelectionExpression: "$request.method $request.path",
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    name: "$default",
    properties: ({}) => ({
      AutoDeploy: true,
    }),
    dependencies: () => ({
      api: "MyHttpApi",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      IntegrationType: "AWS_PROXY",
      IntegrationSubtype: "EventBridge-PutEvents",
      PayloadFormatVersion: "1.0",
      RequestParameters: {
        DetailType: "MyDetailType",
        Source: "WebApp",
        Detail: "$request.body",
      },
      RequestTemplates: {},
      TimeoutInMillis: 10000,
    }),
    dependencies: () => ({
      api: "MyHttpApi",
      eventBus: "MyEventBus",
      role: "ApiEventbridgeStack-EventBridgeIntegrationRoleB322-CKYCO76HXU2K",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ApiKeyRequired: false,
      AuthorizationScopes: [],
      AuthorizationType: "NONE",
      RequestModels: {},
      RouteKey: "POST /",
    }),
    dependencies: () => ({
      api: "MyHttpApi",
      integration: "integration::MyHttpApi::MyEventBus",
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Description:
        "Automatic deployment triggered by changes to the Api configuration",
      AutoDeployed: true,
    }),
    dependencies: () => ({
      api: "MyHttpApi",
      stage: "$default",
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Description:
        "Automatic deployment triggered by changes to the Api configuration",
    }),
    dependencies: () => ({
      api: "MyHttpApi",
    }),
  },
  { type: "EventBus", group: "CloudWatchEvents", name: "MyEventBus" },
  {
    type: "Rule",
    group: "CloudWatchEvents",
    name: "ApiEventbridgeStack-EventLoggerRuleC0DD3E40-Q9W76SELO1UD",
    properties: ({}) => ({
      Description: "Log all events",
      EventPattern: '{"region":["ap-southeast-2"]}',
      State: "ENABLED",
    }),
    dependencies: () => ({
      eventBus: "MyEventBus",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "/aws/events/MyEventBus",
    properties: ({}) => ({
      retentionInDays: 731,
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "/aws/lambda/ApiEventbridgeStack-AWS679f53fac002430cb0da5b7982b-57ndnTWa15y0",
  },
  {
    type: "Role",
    group: "IAM",
    name: "ApiEventbridgeStack-AWS679f53fac002430cb0da5b7982b-1E33HR9VLA6TW",
    properties: ({}) => ({
      Path: "/",
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
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: "logs:PutResourcePolicy",
                Resource: `*`,
                Effect: "Allow",
              },
              {
                Action: "logs:DeleteResourcePolicy",
                Resource: `*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName:
            "EventsLogGroupPolicyApiEventbridgeStackEventLoggerRuleB02679CDCustomResourcePolicy2604DC42",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    name: "ApiEventbridgeStack-EventBridgeIntegrationRoleB322-CKYCO76HXU2K",
    properties: ({ config }) => ({
      Path: "/",
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
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: "events:PutEvents",
                Resource: `arn:aws:events:${
                  config.region
                }:${config.accountId()}:event-bus/MyEventBus`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "EventBridgeIntegrationRoleDefaultPolicy16371A00",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    name: "ApiEventbridgeStack-AWS679f53fac002430cb0da5b7982b-57ndnTWa15y0",
    properties: ({}) => ({
      Handler: "index.handler",
      PackageType: "Zip",
      Runtime: "nodejs12.x",
      Description: "",
      Timeout: 120,
      MemorySize: 128,
    }),
    dependencies: () => ({
      role: "ApiEventbridgeStack-AWS679f53fac002430cb0da5b7982b-1E33HR9VLA6TW",
    }),
  },
];