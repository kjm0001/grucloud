// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Connection",
    group: "AppRunner",
    properties: ({}) => ({
      ConnectionName: "github",
      ProviderType: "GITHUB",
    }),
  },
  {
    type: "Service",
    group: "AppRunner",
    properties: ({ getId }) => ({
      ServiceName: "apprunner",
      NetworkConfiguration: {
        IngressConfiguration: {
          IsPubliclyAccessible: true,
        },
      },
      SourceConfiguration: {
        AutoDeploymentsEnabled: false,
        CodeRepository: {
          CodeConfiguration: {
            CodeConfigurationValues: {
              BuildCommand: "npm install",
              Port: "8080",
              Runtime: "NODEJS_16",
              RuntimeEnvironmentSecrets: {
                HOTEL_NAME: `${getId({
                  type: "Parameter",
                  group: "SSM",
                  name: "hotel_name",
                })}`,
                MYSQL_SECRET: `${getId({
                  type: "Secret",
                  group: "SecretsManager",
                  name: "AuroraDBSecret-sTV29wbW2hBn",
                })}`,
              },
              StartCommand: "npm start",
            },
            ConfigurationSource: "API",
          },
          RepositoryUrl: "https://github.com/FredericHeem/apprunner-hotel-app",
          SourceCodeVersion: {
            Type: "BRANCH",
            Value: "main",
          },
        },
      },
      InstanceConfiguration: {
        Cpu: "1024",
        Memory: "2048",
      },
      ObservabilityConfiguration: {
        ObservabilityEnabled: false,
      },
      HealthCheckConfiguration: {
        HealthyThreshold: 1,
        Interval: 10,
        Path: "/",
        Protocol: "TCP",
        Timeout: 5,
        UnhealthyThreshold: 5,
      },
    }),
    dependencies: ({ config }) => ({
      instanceRole: `AppRunnerHotelAppRole-${config.region}`,
      connection: "github",
      secrets: ["AuroraDBSecret-sTV29wbW2hBn"],
      ssmParameters: ["hotel_name"],
    }),
  },
  {
    type: "VpcConnector",
    group: "AppRunner",
    properties: ({}) => ({
      VpcConnectorName: "AppRunnerHotelApp-RDS-Connector",
    }),
    dependencies: ({}) => ({
      subnets: [
        "AppRunnerHotelAppVPC::AppRunnerHotelApp-PrivateSubnet-1",
        "AppRunnerHotelAppVPC::AppRunnerHotelApp-PrivateSubnet-2",
        "AppRunnerHotelAppVPC::AppRunnerHotelApp-PrivateSubnet-3",
      ],
      securityGroups: [
        "sg::AppRunnerHotelAppVPC::AppRunnerHotelApp-Service-SG",
      ],
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "AppRunnerHotelAppVPC",
    properties: ({}) => ({
      CidrBlock: "172.31.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "InternetGateway",
    group: "EC2",
    name: "stack-apprunner",
    properties: ({}) => ({
      Tags: [
        {
          Key: "Network",
          Value: "Public",
        },
      ],
    }),
  },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "AppRunnerHotelAppVPC",
      internetGateway: "stack-apprunner",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "NatGateway",
    properties: ({}) => ({
      PrivateIpAddressIndex: 77,
    }),
    dependencies: ({}) => ({
      subnet: "AppRunnerHotelAppVPC::AppRunnerHotelApp-PublicSubnet-1",
      eip: "NatPublicIP",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "AppRunnerHotelApp-PrivateSubnet-1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 8,
      NetworkNumber: 3,
    }),
    dependencies: ({}) => ({
      vpc: "AppRunnerHotelAppVPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "AppRunnerHotelApp-PrivateSubnet-2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 8,
      NetworkNumber: 4,
    }),
    dependencies: ({}) => ({
      vpc: "AppRunnerHotelAppVPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "AppRunnerHotelApp-PrivateSubnet-3",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}c`,
      NewBits: 8,
      NetworkNumber: 5,
    }),
    dependencies: ({}) => ({
      vpc: "AppRunnerHotelAppVPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "AppRunnerHotelApp-PublicSubnet-1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 8,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "AppRunnerHotelAppVPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "AppRunnerHotelApp-PublicSubnet-2",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 8,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "AppRunnerHotelAppVPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "AppRunnerHotelApp-PublicSubnet-3",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}c`,
      NewBits: 8,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "AppRunnerHotelAppVPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "PrivateRouteTable",
    properties: ({}) => ({
      Tags: [
        {
          Key: "Network",
          Value: "Private",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "AppRunnerHotelAppVPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "PublicRouteTable",
    properties: ({}) => ({
      Tags: [
        {
          Key: "Network",
          Value: "Public",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "AppRunnerHotelAppVPC",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "AppRunnerHotelAppVPC::PrivateRouteTable",
      subnet: "AppRunnerHotelAppVPC::AppRunnerHotelApp-PrivateSubnet-1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "AppRunnerHotelAppVPC::PrivateRouteTable",
      subnet: "AppRunnerHotelAppVPC::AppRunnerHotelApp-PrivateSubnet-2",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "AppRunnerHotelAppVPC::PrivateRouteTable",
      subnet: "AppRunnerHotelAppVPC::AppRunnerHotelApp-PrivateSubnet-3",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "AppRunnerHotelAppVPC::PublicRouteTable",
      subnet: "AppRunnerHotelAppVPC::AppRunnerHotelApp-PublicSubnet-1",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "AppRunnerHotelAppVPC::PublicRouteTable",
      subnet: "AppRunnerHotelAppVPC::AppRunnerHotelApp-PublicSubnet-2",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "AppRunnerHotelAppVPC::PublicRouteTable",
      subnet: "AppRunnerHotelAppVPC::AppRunnerHotelApp-PublicSubnet-3",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      natGateway: "NatGateway",
      routeTable: "AppRunnerHotelAppVPC::PrivateRouteTable",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "stack-apprunner",
      routeTable: "AppRunnerHotelAppVPC::PublicRouteTable",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "AppRunnerHotelApp-RDS-SG",
      Description: "Allow ingress traffic from AppRunner service",
    }),
    dependencies: ({}) => ({
      vpc: "AppRunnerHotelAppVPC",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "AppRunnerHotelApp-Service-SG",
      Description:
        "Allow egress traffic from AppRunner Service via VPC Connector",
    }),
    dependencies: ({}) => ({
      vpc: "AppRunnerHotelAppVPC",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 3306,
      IpProtocol: "tcp",
      ToPort: 3306,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::AppRunnerHotelAppVPC::AppRunnerHotelApp-RDS-SG",
      securityGroupFrom: [
        "sg::AppRunnerHotelAppVPC::AppRunnerHotelApp-Service-SG",
      ],
    }),
  },
  { type: "ElasticIpAddress", group: "EC2", name: "NatPublicIP" },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: `AppRunnerHotelAppECRAccessRole-${config.region}`,
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "build.apprunner.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AWSAppRunnerServicePolicyForECRAccess",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config, getId }) => ({
      RoleName: `AppRunnerHotelAppRole-${config.region}`,
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "tasks.apprunner.amazonaws.com",
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
                Action: ["logs:CreateLogGroup", "logs:PutRetentionPolicy"],
                Resource: "arn:aws:logs:*:*:log-group:/aws/apprunner/*",
                Effect: "Allow",
              },
              {
                Action: [
                  "logs:CreateLogStream",
                  "logs:PutLogEvents",
                  "logs:DescribeLogStreams",
                ],
                Resource:
                  "arn:aws:logs:*:*:log-group:/aws/apprunner/*:log-stream:*",
                Effect: "Allow",
              },
              {
                Action: [
                  "events:PutRule",
                  "events:PutTargets",
                  "events:DeleteRule",
                  "events:RemoveTargets",
                  "events:DescribeRule",
                  "events:EnableRule",
                  "events:DisableRule",
                ],
                Resource: "arn:aws:events:*:*:rule/AWSAppRunnerManagedRule*",
                Effect: "Allow",
              },
              {
                Action: ["secretsmanager:GetSecretValue"],
                Resource: `${getId({
                  type: "Secret",
                  group: "SecretsManager",
                  name: "AuroraDBSecret-sTV29wbW2hBn",
                })}`,
                Effect: "Allow",
              },
              {
                Action: ["ssm:GetParameters"],
                Resource: `${getId({
                  type: "Parameter",
                  group: "SSM",
                  name: "hotel_name",
                })}`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "AppRunnerServiceRolePolicy",
        },
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "ec2:CreateNetworkInterface",
                  "ec2:DeleteNetworkInterface",
                  "ec2:DescribeNetworkInterfaces",
                  "ec2:DescribeSecurityGroups",
                  "ec2:DescribeSubnets",
                  "ec2:DescribeVpcs",
                  "ec2:DescribeDhcpOptions",
                  "ec2:CreateTags",
                ],
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "AppRunnerVPCNetworkingPermissions",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSXRayDaemonWriteAccess",
          PolicyArn: "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess",
        },
      ],
    }),
    dependencies: ({}) => ({
      secrets: ["AuroraDBSecret-sTV29wbW2hBn"],
      ssmParameters: ["hotel_name"],
    }),
  },
  {
    type: "DBCluster",
    group: "RDS",
    properties: ({}) => ({
      BackupRetentionPeriod: 1,
      DBClusterIdentifier: "stack-apprunner-auroradbcluster-lhm564nziasj",
      Engine: "aurora-mysql",
      EngineVersion: "5.7.mysql_aurora.2.10.2",
      Port: 3306,
      MasterUsername:
        process.env
          .STACK_APPRUNNER_AURORADBCLUSTER_LHM564NZIASJ_MASTER_USERNAME,
      PreferredBackupWindow: "09:06-09:36",
      PreferredMaintenanceWindow: "sat:06:22-sat:06:52",
      IAMDatabaseAuthenticationEnabled: false,
      EngineMode: "provisioned",
      DeletionProtection: false,
      HttpEndpointEnabled: false,
      MasterUserPassword:
        process.env
          .STACK_APPRUNNER_AURORADBCLUSTER_LHM564NZIASJ_MASTER_USER_PASSWORD,
    }),
    dependencies: ({}) => ({
      dbSubnetGroup: "stack-apprunner-dbsubnetgroup-htvxd8nqbq22",
      securityGroups: ["sg::AppRunnerHotelAppVPC::AppRunnerHotelApp-RDS-SG"],
      secret: "AuroraDBSecret-sTV29wbW2hBn",
    }),
  },
  {
    type: "DBSubnetGroup",
    group: "RDS",
    properties: ({}) => ({
      DBSubnetGroupName: "stack-apprunner-dbsubnetgroup-htvxd8nqbq22",
      DBSubnetGroupDescription: "stack-apprunner",
    }),
    dependencies: ({}) => ({
      subnets: [
        "AppRunnerHotelAppVPC::AppRunnerHotelApp-PrivateSubnet-1",
        "AppRunnerHotelAppVPC::AppRunnerHotelApp-PrivateSubnet-2",
        "AppRunnerHotelAppVPC::AppRunnerHotelApp-PrivateSubnet-3",
      ],
    }),
  },
  {
    type: "DBInstance",
    group: "RDS",
    properties: ({}) => ({
      DBInstanceIdentifier:
        "stack-apprunner-auroradbfirstinstance-7xxkwgq44ds1",
      DBInstanceClass: "db.t4g.medium",
      Engine: "aurora-mysql",
      PreferredMaintenanceWindow: "fri:06:43-fri:07:13",
      EngineVersion: "5.7.mysql_aurora.2.10.2",
      PubliclyAccessible: false,
      StorageType: "aurora",
      DBClusterIdentifier: "stack-apprunner-auroradbcluster-lhm564nziasj",
      StorageEncrypted: true,
    }),
    dependencies: ({}) => ({
      dbSubnetGroup: "stack-apprunner-dbsubnetgroup-htvxd8nqbq22",
      securityGroups: ["sg::AppRunnerHotelAppVPC::AppRunnerHotelApp-RDS-SG"],
      secret: "AuroraDBSecret-sTV29wbW2hBn",
      dbCluster: "stack-apprunner-auroradbcluster-lhm564nziasj",
    }),
  },
  {
    type: "Secret",
    group: "SecretsManager",
    properties: ({ generatePassword }) => ({
      Name: "AuroraDBSecret-sTV29wbW2hBn",
      SecretString: {
        dbClusterIdentifier: "stack-apprunner-auroradbcluster-lhm564nziasj",
        password: generatePassword({ length: 32 }),
        engine: "mysql",
        port: 3306,
        username: "apprunner",
      },
      Description: "This is my rds instance secret",
    }),
  },
  {
    type: "Parameter",
    group: "SSM",
    properties: ({}) => ({
      Name: "hotel_name",
      Type: "String",
      Value: "AWS App Runner Hotel",
      Description: "App Runner Hotel Name",
      DataType: "text",
    }),
  },
];