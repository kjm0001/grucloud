const assert = require("assert");
const { pipe, tap, get, pick, eq, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");

const { Tagger, filterLiveDefault } = require("./LightsailCommon");

const buildArn = () =>
  pipe([
    get("relationalDatabaseName"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ relationalDatabaseName }) => {
    assert(relationalDatabaseName);
  }),
  pick(["relationalDatabaseName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    ({ name, location, ...other }) => ({
      relationalDatabaseName: name,
      availabilityZone: location.availabilityZone,
      ...other,
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailDatabase = ({ compare }) => ({
  type: "Database",
  package: "lightsail",
  client: "Lightsail",
  propertiesDefault: {
    publiclyAccessible: false,
    backupRetentionEnabled: true,
  },
  omitProperties: [
    "arn",
    "supportCode",
    "resourceType",
    "createdAt",
    "state",
    "masterEndpoint",
    "pendingMaintenanceActions",
    "caCertificateIdentifier",
    "masterUserPassword",
    "parameterApplyStatus",
    "pendingModifiedValues",
    "latestRestorableTime",
  ],
  inferName: () => get("relationalDatabaseName"),
  environmentVariables: [
    { path: "masterUsername", suffix: "MASTER_USERNAME" },
    { path: "masterUserPassword", suffix: "MASTER_USER_PASSWORD" },
  ],
  compare: compare({
    filterTarget: () => pipe([omit(["commasterUserPasswordpare"])]),
    filterAll: () => pipe([omit(["engineVersion"])]),
  }),
  filterLive: filterLiveDefault,
  findName: () =>
    pipe([
      get("relationalDatabaseName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("relationalDatabaseName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ relationalDatabaseName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  ignoreErrorCodes: ["DoesNotExist"],
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getRelationalDatabase-property
  getById: {
    method: "getRelationalDatabase",
    getField: "relationalDatabase",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getRelationalDatabases-property
  getList: {
    method: "getRelationalDatabases",
    getParam: "relationalDatabases",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#createRelationalDatabase-property
  create: {
    method: "createRelationalDatabase",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("state"), "available")]),
    isInstanceError: pipe([eq(get("state"), "error")]),
    // getErrorMessage: get("StatusMessage", "error"),
  },
  // TODO update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#updateRelationalDatabase-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#updateRelationalDatabaseParameters-property
  update: {
    method: "updateRelationalDatabase",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#deleteRelationalDatabase-property
  destroy: {
    //TODO skipFinalSnapshot:true and finalRelationalDatabaseSnapshotName
    method: "deleteRelationalDatabase",
    pickId,
    shouldRetryOnExceptionMessages: [
      "Sorry, you can't delete a relational database in backing-up state; please try again later",
    ],
  },
});
