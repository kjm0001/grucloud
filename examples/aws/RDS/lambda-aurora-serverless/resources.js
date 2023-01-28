// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-LambdaFunctionRole-11TTATG2VDRQ2",
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
                Action: ["secretsmanager:GetSecretValue"],
                Resource: `arn:aws:secretsmanager:${
                  config.region
                }:${config.accountId()}:secret:aurora-test-cluster-AuroraUserSecret-uVYAMe`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "LambdaFunctionRolePolicy0",
        },
        {
          PolicyDocument: {
            Statement: [
              {
                Action: "rds-data:ExecuteStatement",
                Resource: `arn:aws:rds:${
                  config.region
                }:${config.accountId()}:cluster:aurora-test-cluster`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "LambdaFunctionRolePolicy1",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
      Tags: [
        {
          Key: "lambda:createdBy",
          Value: "SAM",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ config, getId }) => ({
      Configuration: {
        Environment: {
          Variables: {
            SecretArn: `${getId({
              type: "Secret",
              group: "SecretsManager",
              name: "DBSecret",
            })}`,
            DBClusterArn: `arn:aws:rds:${
              config.region
            }:${config.accountId()}:cluster:aurora-test-cluster`,
            DBName: "aurora_test_db",
          },
        },
        FunctionName: "aurora-test-cluster-function",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
        Timeout: 30,
      },
      Tags: {
        "lambda:createdBy": "SAM",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-LambdaFunctionRole-11TTATG2VDRQ2",
      secrets: ["DBSecret"],
      dbClusters: ["aurora-test-cluster"],
    }),
  },
  {
    type: "DBCluster",
    group: "RDS",
    properties: ({}) => ({
      BackupRetentionPeriod: 1,
      DatabaseName: "aurora_test_db",
      DBClusterIdentifier: "aurora-test-cluster",
      Engine: "aurora",
      EngineVersion: "5.6.mysql_aurora.1.22.3",
      Port: 3306,
      MasterUsername: process.env.AURORA_TEST_CLUSTER_MASTER_USERNAME,
      PreferredBackupWindow: "08:17-08:47",
      PreferredMaintenanceWindow: "thu:06:25-thu:06:55",
      IAMDatabaseAuthenticationEnabled: false,
      EngineMode: "serverless",
      DeletionProtection: false,
      HttpEndpointEnabled: false,
      ScalingConfiguration: {
        MinCapacity: 1,
        MaxCapacity: 2,
        AutoPause: true,
        SecondsUntilAutoPause: 3600,
        TimeoutAction: "RollbackCapacityChange",
        SecondsBeforeTimeout: 300,
      },
      MasterUserPassword: process.env.AURORA_TEST_CLUSTER_MASTER_USER_PASSWORD,
    }),
    dependencies: ({}) => ({
      secret: "DBSecret",
    }),
  },
  {
    type: "Secret",
    group: "SecretsManager",
    properties: ({ generatePassword }) => ({
      Name: "DBSecret",
      SecretString: {
        password: generatePassword({ length: 30 }),
        username: "admin_user",
        port: 3306,
      },
      Description: "RDS database auto-generated user password",
    }),
  },
];