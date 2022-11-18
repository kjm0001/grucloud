// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "Amazon_EventBridge_Scheduler_SNS",
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "scheduler.amazonaws.com",
            },
            Action: "sts:AssumeRole",
            Condition: {
              StringEquals: {
                "aws:SourceAccount": `${config.accountId()}`,
                "aws:SourceArn": `arn:aws:scheduler:${
                  config.region
                }:${config.accountId()}:schedule/default/schedule-sns`,
              },
            },
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      policies: [
        "Amazon-EventBridge-Scheduler-Execution-Policy-50a964bf-c6f1-477b-bce9-869058e66a1b",
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName:
        "Amazon-EventBridge-Scheduler-Execution-Policy-50a964bf-c6f1-477b-bce9-869058e66a1b",
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["sns:Publish"],
            Resource: [
              `arn:aws:sns:${
                config.region
              }:${config.accountId()}:topic-scheduler`,
            ],
          },
        ],
      },
      Path: "/service-role/",
    }),
    dependencies: ({}) => ({
      snsTopic: "topic-scheduler",
    }),
  },
  {
    type: "Schedule",
    group: "Scheduler",
    properties: ({ config }) => ({
      Description: "",
      FlexibleTimeWindow: {
        Mode: "OFF",
      },
      GroupName: "default",
      Name: "schedule-sns",
      ScheduleExpression: "at(2022-11-13T00:00:00)",
      ScheduleExpressionTimezone: "America/Fortaleza",
      Target: {
        Arn: `arn:aws:sns:${
          config.region
        }:${config.accountId()}:topic-scheduler`,
        Input: "{}",
        RetryPolicy: {
          MaximumEventAgeInSeconds: 86400,
          MaximumRetryAttempts: 185,
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "Amazon_EventBridge_Scheduler_SNS",
      snsTopic: "topic-scheduler",
    }),
  },
  { type: "Topic", group: "SNS", name: "topic-scheduler" },
];