const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  assign,
  filter,
  not,
  any,
  eq,
  flatMap,
  switchCase,
} = require("rubico");
const {
  isEmpty,
  isFunction,
  isObject,
  unless,
  when,
  values,
  keys,
  first,
  append,
  find,
  callProp,
  includes,
} = require("rubico/x");
const querystring = require("querystring");
const { getField } = require("@grucloud/core/ProviderCommon");
const {
  createEndpoint,
  replaceDependency,
  replaceArnWithAccountAndRegion,
  sortObject,
} = require("../AwsCommon");
const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");

const logger = require("@grucloud/core/logger")({ prefix: "IamCommon" });

exports.ignoreErrorCodes = ["NoSuchEntity", "NoSuchEntityException"];

const dependenciesFromPolicies = {
  apiGatewayAuthorizers: {
    pathLive: "live.arn",
    type: "Authorizer",
    group: "APIGateway",
  },
  apiGatewayRestApis: {
    pathLive: "live.arnv2",
    type: "RestApi",
    group: "APIGateway",
  },
  apiGatewayV2Apis: {
    pathLive: "live.ArnV2",
    type: "Api",
    group: "ApiGatewayV2",
  },
  appConfigConfigurationProfile: {
    pathLive: "live.Arn",
    type: "ConfigurationProfile",
    group: "AppConfig",
  },
  appsyncGraphqlApis: {
    pathLive: "live.uris.GRAPHQL",
    type: "GraphqlApi",
    group: "AppSync",
  },
  eventsApiDestinations: {
    type: "ApiDestination",
    group: "CloudWatchEvents",
    pathLive: "live.ApiDestinationArn",
  },
  cognitoIdentityPools: {
    pathLive: "id",
    type: "IdentityPool",
    group: "Cognito",
  },
  cognitoUserPools: {
    pathLive: "id",
    type: "UserPool",
    group: "CognitoIdentityServiceProvider",
  },
  cognitoUserPoolClient: {
    pathLive: "id",
    type: "UserPoolClient",
    group: "CognitoIdentityServiceProvider",
  },
  dynamoDbTables: {
    type: "Table",
    group: "DynamoDB",
    pathLive: "live.LatestStreamArn",
  },
  efsAccessPoints: {
    pathLive: "id",
    type: "AccessPoint",
    group: "EFS",
  },
  efsFileSystems: {
    pathLive: "id",
    type: "FileSystem",
    group: "EFS",
  },
  kmsKeys: {
    pathLive: "id",
    type: "Key",
    group: "KMS",
  },
  mqBrokers: {
    pathLive: "id",
    type: "Broker",
    group: "MQ",
  },
  organisations: {
    pathLive: "id",
    type: "Organisation",
    group: "Organisations",
  },
  rdsDbClusters: {
    pathLive: "live.DBClusterArn",
    type: "DBCluster",
    group: "RDS",
  },
  secretsManagerSecrets: {
    pathLive: "live.ARN",
    type: "Secret",
    group: "SecretsManager",
  },
  vpcLatticeTargetGroups: {
    pathLive: "live.arn",
    type: "TargetGroup",
    group: "VpcLattice",
  },
};
exports.dependenciesFromPolicies = dependenciesFromPolicies;

const replacePolicy = replaceDependency(dependenciesFromPolicies);
exports.replacePolicy = replacePolicy;

const replaceResource = ({ key, providerConfig, lives }) =>
  pipe([
    when(
      get(key),
      assign({
        [key]: pipe([
          get(key),
          switchCase([
            Array.isArray,
            map(replacePolicy({ providerConfig, lives })),
            replacePolicy({ providerConfig, lives }),
          ]),
        ]),
      })
    ),
  ]);

const assignPolicyResource = ({ providerConfig, lives }) =>
  pipe([
    tap((params) => {
      assert(lives);
      assert(providerConfig);
    }),
    replaceResource({ key: "Resource", providerConfig, lives }),
    replaceResource({ key: "NotResource", providerConfig, lives }),
  ]);

exports.assignPolicyResource = assignPolicyResource;

const replacePrincipal = ({ providerConfig, lives, principalKind }) =>
  pipe([
    when(
      get(principalKind),
      assign({
        [principalKind]: pipe([
          get(principalKind),
          switchCase([
            Array.isArray,
            map(replaceArnWithAccountAndRegion({ providerConfig, lives })),
            replaceArnWithAccountAndRegion({ providerConfig, lives }),
          ]),
        ]),
      })
    ),
  ]);

const replaceCondition = ({ conditionCriteria, providerConfig, lives }) =>
  when(
    get(conditionCriteria),
    assign({
      [conditionCriteria]: pipe([
        get(conditionCriteria),
        map.entries(([key, value]) => [
          // key
          pipe([
            () => key,
            replaceWithName({
              groupType: "IAM::OpenIDConnectProvider",
              path: "live.Url",
              pathLive: "live.Url",
              providerConfig,
              lives,
              withSuffix: true,
            }),
            (params) => (isFunction(params) ? params() : params),
          ])(),
          // value
          pipe([
            () => value,
            switchCase([
              Array.isArray,
              map(
                replaceArnWithAccountAndRegion({
                  providerConfig,
                  lives,
                })
              ),
              replaceArnWithAccountAndRegion({
                providerConfig,
                lives,
              }),
            ]),
          ])(),
        ]),
      ]),
    })
  );

const replaceArnByKey = ({ key, providerConfig, lives }) =>
  pipe([
    when(
      get(key),
      assign({
        [key]: pipe([
          get(key),
          replaceArnWithAccountAndRegion({
            providerConfig,
            lives,
          }),
        ]),
      })
    ),
  ]);

const replaceStatement = ({ providerConfig, lives }) =>
  pipe([
    tap((params) => {
      assert(lives);
    }),
    when(
      get("Principal"),
      assign({
        Principal: pipe([
          get("Principal"),
          replacePrincipal({ providerConfig, lives, principalKind: "Service" }),
          replacePrincipal({ providerConfig, lives, principalKind: "AWS" }),
          switchCase([
            pipe([get("Federated"), includes("oidc-provider")]),
            pipe([
              assign({
                Federated: pipe([
                  get("Federated"),
                  replaceWithName({
                    groupType: "IAM::OpenIDConnectProvider",
                    path: "id",
                    providerConfig,
                    lives,
                  }),
                ]),
              }),
            ]),
            replacePrincipal({
              providerConfig,
              lives,
              principalKind: "Federated",
            }),
          ]),
          when(
            get("AWS"),
            assign({
              AWS: pipe([
                get("AWS"),
                when(
                  includes("CloudFront Origin Access Identity"),
                  pipe([
                    replaceWithName({
                      groupType: "CloudFront::OriginAccessIdentity",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ])
                ),
              ]),
            })
          ),
        ]),
      })
    ),
    when(
      get("Condition"),
      assign({
        Condition: pipe([
          get("Condition"),
          replaceCondition({
            conditionCriteria: "ArnLike",
            providerConfig,
            lives,
          }),
          replaceCondition({
            conditionCriteria: "StringLike",
            providerConfig,
            lives,
          }),
          replaceCondition({
            conditionCriteria: "StringEquals",
            providerConfig,
            lives,
          }),
          when(
            get("StringEquals"),
            assign({
              StringEquals: pipe([
                get("StringEquals"),
                when(
                  get("elasticfilesystem:AccessPointArn"),
                  assign({
                    "elasticfilesystem:AccessPointArn": pipe([
                      get("elasticfilesystem:AccessPointArn"),
                      replaceWithName({
                        groupType: "EFS::AccessPoint",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                  })
                ),
                sortObject,
              ]),
            })
          ),
          when(
            get("ArnEquals"),
            assign({
              ArnEquals: pipe([
                get("ArnEquals"),
                replaceArnByKey({
                  key: "aws:PrincipalArn",
                  providerConfig,
                  lives,
                }),
                replaceArnByKey({
                  key: "aws:SourceArn",
                  providerConfig,
                  lives,
                }),
                replaceArnByKey({
                  key: "AWS:SourceArn",
                  providerConfig,
                  lives,
                }),
              ]),
            })
          ),
        ]),
      })
    ),
    assignPolicyResource({ providerConfig, lives }),
  ]);

const assignPolicyAccountAndRegion = ({ providerConfig, lives }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assign({
      Statement: pipe([
        get("Statement"),
        tap((params) => {
          assert(true);
        }),
        switchCase([
          Array.isArray,
          map(replaceStatement({ providerConfig, lives })),
          replaceStatement({ providerConfig, lives }),
        ]),
      ]),
    }),
  ]);

exports.assignPolicyAccountAndRegion = assignPolicyAccountAndRegion;

exports.assignPolicyDocumentAccountAndRegion = ({ providerConfig, lives }) =>
  assign({
    PolicyDocument: pipe([
      tap((params) => {
        assert(true);
      }),
      get("PolicyDocument"),
      assignPolicyAccountAndRegion({ providerConfig, lives }),
    ]),
  });

const sortStatement = pipe([
  tap((param) => {
    assert(param);
  }),
  assign({
    Principal: pipe([
      get("Principal"),
      when(
        get("Service"),
        assign({
          Service: pipe([
            get("Service"),
            when(
              Array.isArray,
              pipe([callProp("sort", (a, b) => a.localeCompare(b))])
            ),
          ]),
        })
      ),
    ]),
  }),
  when(
    get("Condition"),
    assign({ Condition: pipe([get("Condition"), map(sortObject)]) })
  ),
]);

const sortStatements = pipe([
  tap(({ Statement }) => {
    assert(Statement);
  }),
  assign({
    Statement: pipe([
      get("Statement"),
      switchCase([Array.isArray, map(sortStatement), sortStatement]),
    ]),
  }),
]);

exports.sortStatements = sortStatements;

exports.createIAM = createEndpoint("iam", "IAM");

exports.tagResourceIam =
  ({ propertyName, field, method }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live[field]);
      }),
      (Tags) => ({
        [propertyName || field]: live[field],
        Tags,
      }),
      endpoint()[method],
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagUser-property
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagPolicy-property
exports.untagResourceIam =
  ({ propertyName, field, method }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({
        [propertyName || field]: live[field],
        TagKeys,
      }),
      endpoint()[method],
    ]);

exports.createFetchPolicyDocument =
  ({ iam }) =>
  ({ Versions, PolicyArn }) =>
    pipe([
      tap(() => {
        assert(PolicyArn, "PolicyArn");
        assert(Versions, "Versions");
      }),
      () => Versions,
      find(get("IsDefaultVersion")),
      ({ VersionId }) => ({
        PolicyArn,
        VersionId,
      }),
      iam().getPolicyVersion,
      get("PolicyVersion.Document"),
      querystring.decode,
      keys,
      first,
      tryCatch(JSON.parse, (error, document) => {
        logger.error(`FetchPolicyDocument ${error}, ${document}`);
      }),
    ])();

exports.assignAttachedPolicies = ({ policies = [] }) =>
  assign({
    AttachedPolicies: pipe([
      () => policies,
      map(
        pipe([
          tap((policy) => {
            assert(policy.config.PolicyName);
          }),
          (policy) => ({
            PolicyArn: getField(policy, "Arn"),
            PolicyName: policy.config.PolicyName,
          }),
        ])
      ),
    ]),
  });

const findArnInCondition = ({ Condition }) =>
  pipe([
    () => [
      "StringEquals",
      "StringEquals.aws:PrincipalOrgID",
      "StringEquals.elasticfilesystem:AccessPointArn",
      "ArnLike.AWS:SourceArn",
      "ArnEquals.aws:SourceArn",
      "ArnEquals.aws:PrincipalArn",
    ],
    map((prop) => get(prop)(Condition)),
  ])();

const findInStatement =
  ({ type, group, lives, config, pathLive = "id" }) =>
  ({ Condition, Resource }) =>
    pipe([
      tap(() => {
        assert(pathLive);
        //assert(Resource);
      }),
      () => Resource,
      unless(Array.isArray, (resource) => [resource]),
      append(findArnInCondition({ Condition })),
      filter(not(isEmpty)),
      map((arn) =>
        pipe([
          lives.getByType({
            providerName: config.providerName,
            type,
            group,
          }),
          find(
            pipe([
              get(pathLive),
              (id) =>
                pipe([
                  tap(() => {
                    //assert(id, `no value at ${pathLive}, type: ${type}`);
                  }),
                  () => arn,
                  when(isObject, pipe([values, first])),
                  includes(id),
                ])(),
            ])
          ),
        ])()
      ),
      filter(not(isEmpty)),
      tap((param) => {
        assert(true);
      }),
    ])();

exports.findInStatement = findInStatement;

exports.sortPolicies = callProp("sort", (a, b) =>
  a.PolicyArn.localeCompare(b.PolicyArn)
);

exports.filterAttachedPolicies = ({ lives }) =>
  pipe([
    assign({
      AttachedPolicies: pipe([
        get("AttachedPolicies"),
        filter(
          not(({ PolicyArn }) =>
            pipe([() => lives, any(eq(get("id"), PolicyArn))])()
          )
        ),
      ]),
    }),
    omitIfEmpty(["AttachedPolicies"]),
  ]);

const buildDependencyPolicy =
  ({ policyKey }) =>
  ({ type, group, pathLive }) => ({
    type,
    group,
    list: true,
    dependencyIds: ({ lives, config }) =>
      pipe([
        tap((params) => {
          assert(policyKey);
          assert(pathLive);
        }),
        get(policyKey),
        tap((policy) => {
          assert(policy);
        }),
        get("Statement", []),
        tap((Statement) => {
          assert(Statement);
        }),
        flatMap(findInStatement({ type, group, lives, config, pathLive })),
        tap((params) => {
          assert(true);
        }),
      ]),
  });

exports.buildDependenciesPolicy = ({ policyKey }) =>
  pipe([
    () => dependenciesFromPolicies,
    map(buildDependencyPolicy({ policyKey })),
    tap((params) => {
      assert(true);
    }),
  ])();
