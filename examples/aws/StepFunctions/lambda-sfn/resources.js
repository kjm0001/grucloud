// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "stepfunctions/StateMachine",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-LambdaProxyRole-1Y0SLC4P2GYCW",
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
            Statement: [
              {
                Action: ["states:StartExecution"],
                Resource: `arn:aws:states:${
                  config.region
                }:${config.accountId()}:stateMachine:StateMachine-QcjYVBBtLAi1`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "LambdaProxyRolePolicy0",
        },
      ],
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
      RoleName: "sam-app-StateMachineRole-1E15UFX2LMRYB",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "states.amazonaws.com",
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
                Action: ["cloudwatch:*", "logs:*"],
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "StateMachineRolePolicy0",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ config }) => ({
      Configuration: {
        Environment: {
          Variables: {
            StateMachineArn: `arn:aws:states:${
              config.region
            }:${config.accountId()}:stateMachine:StateMachine-QcjYVBBtLAi1`,
          },
        },
        FunctionName: "sam-app-LambdaProxy-3WUHNeLsP7OO",
        Handler: "app.handler",
        Runtime: "nodejs12.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-LambdaProxyRole-1Y0SLC4P2GYCW",
    }),
  },
  {
    type: "StateMachine",
    group: "StepFunctions",
    properties: ({ getId }) => ({
      definition: {
        Comment:
          "A Hello World example demonstrating various state types of the Amazon States Language",
        StartAt: "Pass",
        States: {
          Pass: {
            Comment:
              "A Pass state passes its input to its output, without performing work. Pass states are useful when constructing and debugging state machines.",
            Type: "Pass",
            Next: "Hello World example?",
          },
          "Hello World example?": {
            Comment:
              "A Choice state adds branching logic to a state machine. Choice rules can implement 16 different comparison operators, and can be combined using And, Or, and Not",
            Type: "Choice",
            Choices: [
              {
                Variable: "$.IsHelloWorldExample",
                BooleanEquals: true,
                Next: "Yes",
              },
              {
                Variable: "$.IsHelloWorldExample",
                BooleanEquals: false,
                Next: "No",
              },
            ],
            Default: "Yes",
          },
          Yes: {
            Type: "Pass",
            Next: "Wait 3 sec",
          },
          No: {
            Type: "Fail",
            Cause: "Not Hello World",
          },
          "Wait 3 sec": {
            Comment:
              "A Wait state delays the state machine from continuing for a specified time.",
            Type: "Wait",
            Seconds: 3,
            Next: "Parallel State",
          },
          "Parallel State": {
            Comment:
              "A Parallel state can be used to create parallel branches of execution in your state machine.",
            Type: "Parallel",
            Next: "Hello World",
            Branches: [
              {
                StartAt: "Hello",
                States: {
                  Hello: {
                    Type: "Pass",
                    End: true,
                  },
                },
              },
              {
                StartAt: "World",
                States: {
                  World: {
                    Type: "Pass",
                    End: true,
                  },
                },
              },
            ],
          },
          "Hello World": {
            Type: "Pass",
            End: true,
          },
        },
      },
      loggingConfiguration: {
        destinations: [
          {
            cloudWatchLogsLogGroup: {
              logGroupArn: `${getId({
                type: "LogGroup",
                group: "CloudWatchLogs",
                name: "stepfunctions/StateMachine",
              })}:*`,
            },
          },
        ],
        level: "ALL",
      },
      name: "StateMachine-QcjYVBBtLAi1",
      type: "EXPRESS",
    }),
    dependencies: ({}) => ({
      role: "sam-app-StateMachineRole-1E15UFX2LMRYB",
      logGroups: ["stepfunctions/StateMachine"],
    }),
  },
];