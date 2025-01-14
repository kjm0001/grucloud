// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Distribution",
    group: "CloudFront",
    properties: ({ config }) => ({
      DefaultRootObject: "",
      Origins: {
        Items: [
          {
            Id: "CloudfrontLeApigwCdkStackmyDistributionOrigin1ACBD3C2F",
            DomainName: `dl6n2iazdf.execute-api.${config.region}.amazonaws.com`,
            OriginPath: "",
            CustomHeaders: {
              Quantity: 0,
            },
            CustomOriginConfig: {
              HTTPPort: 80,
              HTTPSPort: 443,
              OriginProtocolPolicy: "https-only",
              OriginSslProtocols: {
                Quantity: 1,
                Items: ["TLSv1.2"],
              },
              OriginReadTimeout: 30,
              OriginKeepaliveTimeout: 5,
            },
            ConnectionAttempts: 3,
            ConnectionTimeout: 10,
            OriginShield: {
              Enabled: false,
            },
            OriginAccessControlId: "",
          },
        ],
      },
      DefaultCacheBehavior: {
        TargetOriginId:
          "CloudfrontLeApigwCdkStackmyDistributionOrigin1ACBD3C2F",
        TrustedSigners: {
          Enabled: false,
        },
        TrustedKeyGroups: {
          Enabled: false,
        },
        ViewerProtocolPolicy: "redirect-to-https",
        AllowedMethods: {
          Quantity: 2,
          Items: ["HEAD", "GET"],
          CachedMethods: {
            Quantity: 2,
            Items: ["HEAD", "GET"],
          },
        },
        SmoothStreaming: false,
        Compress: true,
        LambdaFunctionAssociations: {
          Items: [
            {
              LambdaFunctionARN: `arn:aws:lambda:${
                config.region
              }:${config.accountId()}:function:CloudfrontLeApigwCdkStack-LambdaEdge6A7A1843-sWx5QByO0zMJ:1`,
              EventType: "origin-request",
              IncludeBody: false,
            },
          ],
        },
        FieldLevelEncryptionId: "",
        CachePolicyId: "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
      },
      Comment: "Test sig4 signature",
      PriceClass: "PriceClass_All",
      ViewerCertificate: {
        CloudFrontDefaultCertificate: true,
        SSLSupportMethod: "vip",
        MinimumProtocolVersion: "TLSv1",
        CertificateSource: "cloudfront",
      },
    }),
    dependencies: ({}) => ({
      lambdaFunctions: [
        "CloudfrontLeApigwCdkStack-LambdaEdge6A7A1843-sWx5QByO0zMJ",
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "CloudfrontLeApigwCdkStack-HelloWorldServiceRoleF3F-1FADEMKTLFN51",
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
    properties: ({ config }) => ({
      RoleName:
        "CloudfrontLeApigwCdkStack-LambdaEdgeServiceRole9A3-9JSSALELXYXY",
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
          {
            Effect: "Allow",
            Principal: {
              Service: "edgelambda.amazonaws.com",
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
                Action: "execute-api:Invoke",
                Resource: `arn:aws:execute-api:${config.region}:*:dl6n2iazdf/*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "invokehttpapipolicy7AEBB0BF",
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
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName:
          "CloudfrontLeApigwCdkStack-HelloWorld7964D1E8-Fyz9ID6qaZtf",
        Handler: "index.handler",
        Runtime: "python3.7",
      },
    }),
    dependencies: ({}) => ({
      role: "CloudfrontLeApigwCdkStack-HelloWorldServiceRoleF3F-1FADEMKTLFN51",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName:
          "CloudfrontLeApigwCdkStack-LambdaEdge6A7A1843-sWx5QByO0zMJ",
        Handler: "index.handler",
        Runtime: "nodejs12.x",
      },
    }),
    dependencies: ({}) => ({
      role: "CloudfrontLeApigwCdkStack-LambdaEdgeServiceRole9A3-9JSSALELXYXY",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ config }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName:
            "CloudfrontLeApigwCdkStack-HelloWorld7964D1E8-Fyz9ID6qaZtf",
          Principal: "apigateway.amazonaws.com",
          StatementId:
            "CloudfrontLeApigwCdkStack-HttpApiGETHelloWorldIntegrationPermissionFFD73C74-1420S8U6BYEFN",
          SourceArn: `arn:aws:execute-api:${
            config.region
          }:${config.accountId()}:dl6n2iazdf/*/*/`,
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction:
        "CloudfrontLeApigwCdkStack-HelloWorld7964D1E8-Fyz9ID6qaZtf",
    }),
  },
];
