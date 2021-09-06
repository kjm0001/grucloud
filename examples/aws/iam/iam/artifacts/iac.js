// Generated by aws2gc
const { get } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  provider.IAM.usePolicy({
    name: get("config.IAM.Policy.amazonEksWorkerNodePolicy.name"),
    properties: get("config.IAM.Policy.amazonEksWorkerNodePolicy.properties"),
  });

  provider.IAM.makePolicy({
    name: get("config.IAM.Policy.myPolicyToGroup.name"),
    properties: get("config.IAM.Policy.myPolicyToGroup.properties"),
  });

  provider.IAM.makePolicy({
    name: get("config.IAM.Policy.myPolicyToRole.name"),
    properties: get("config.IAM.Policy.myPolicyToRole.properties"),
  });

  provider.IAM.makePolicy({
    name: get("config.IAM.Policy.myPolicyToUser.name"),
    properties: get("config.IAM.Policy.myPolicyToUser.properties"),
  });

  provider.IAM.makeUser({
    name: get("config.IAM.User.alice.name"),
    properties: get("config.IAM.User.alice.properties"),
    dependencies: ({ resources }) => ({
      iamGroups: [resources.IAM.Group.admin],
      policies: [resources.IAM.Policy.myPolicyToUser],
    }),
  });

  provider.IAM.makeGroup({
    name: get("config.IAM.Group.admin.name"),
    properties: get("config.IAM.Group.admin.properties"),
    dependencies: ({ resources }) => ({
      policies: [resources.IAM.Policy.myPolicyToGroup],
    }),
  });

  provider.IAM.makeRole({
    name: get("config.IAM.Role.roleAllowAssumeRole.name"),
    properties: get("config.IAM.Role.roleAllowAssumeRole.properties"),
    dependencies: ({ resources }) => ({
      policies: [
        resources.IAM.Policy.amazonEksWorkerNodePolicy,
        resources.IAM.Policy.myPolicyToRole,
      ],
    }),
  });

  provider.IAM.makeInstanceProfile({
    name: get("config.IAM.InstanceProfile.myProfile.name"),
    dependencies: ({ resources }) => ({
      roles: [resources.IAM.Role.roleAllowAssumeRole],
    }),
  });

  provider.EC2.makeInstance({
    name: get("config.EC2.Instance.webIam.name"),
    properties: get("config.EC2.Instance.webIam.properties"),
    dependencies: ({ resources }) => ({
      iamInstanceProfile: resources.IAM.InstanceProfile.myProfile,
    }),
  });
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  createResources({
    provider,
  });

  return {
    provider,
  };
};