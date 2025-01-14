const assert = require("assert");
const { pipe, tap, get, or, eq, reduce, switchCase, omit } = require("rubico");
const {
  defaultsDeep,
  first,
  isEmpty,
  callProp,
  differenceWith,
  isDeepEqual,
} = require("rubico/x");

const resourceTypesAll = ["EC2", "ECR", "LAMBDA"];

const cannotBeDeleted = () => pipe([eq(get("state.status"), "DISABLED")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html
exports.Inspector2Enabler = ({ compare }) => ({
  type: "Enabler",
  package: "inspector2",
  client: "Inspector2",
  inferName: () => () => "default",
  findName: () => pipe([() => "default"]),
  findId: () => pipe([() => "default"]),
  ignoreResource: () => pipe([get("live.resourceTypes"), isEmpty]),
  compare: compare({
    filterAll: () => pipe([omit(["accountIds"])]),
  }),
  omitProperties: ["state"],
  cannotBeDeleted,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: {
    method: "batchGetAccountStatus",
    pickId: () => ({ accountIds: [] }),
    decorate: ({ endpoint }) =>
      pipe([
        get("accounts"),
        first,
        ({ resourceState, state }) =>
          pipe([
            () => resourceTypesAll,
            reduce(
              (acc, type) =>
                pipe([
                  () => resourceState,
                  get(type.toLowerCase()),
                  get("status"),
                  switchCase([
                    callProp("startsWith", "ENA"),
                    () => [...acc, type],
                    () => acc,
                  ]),
                ])(),
              []
            ),
            (resourceTypes) => ({
              resourceTypes,
              state,
            }),
          ])(),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html#enable-property
  create: {
    method: "enable",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html#disable-property
  destroy: {
    method: "disable",
    pickId: ({ accountIds = [] }) => ({
      accountIds,
      resourceTypes: resourceTypesAll,
    }),
    isInstanceDown: pipe([eq(get("state.status"), "DISABLED")]),
  },
  getList: ({ endpoint, getById }) => pipe([getById({}), (result) => [result]]),
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => diff,
        tap.if(
          or([get("liveDiff.deleted.resourceTypes")]),
          pipe([
            () => payload.resourceTypes,
            differenceWith(isDeepEqual, resourceTypesAll),
            (resourceTypes) => ({
              accountIds: payload.accountIds,
              resourceTypes,
            }),
            endpoint().disable,
          ])
        ),
        tap.if(
          or([get("liveDiff.added.resourceTypes")]),
          pipe([() => payload, endpoint().enable])
        ),
      ])(),
  getByName: ({ getList, endpoint, getById }) => pipe([getById({})]),
  configDefault: ({
    name,
    namespace,
    properties: { accountIds = [], ...otherProps },
  }) => pipe([() => otherProps, defaultsDeep({ accountIds })])(),
});
