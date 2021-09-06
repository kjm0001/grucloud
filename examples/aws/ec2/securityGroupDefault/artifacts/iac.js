// Generated by aws2gc
const { get } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  provider.EC2.makeSecurityGroupRuleIngress({
    name: get("config.EC2.SecurityGroupRuleIngress.sgRuleIngressTest.name"),
    properties: get(
      "config.EC2.SecurityGroupRuleIngress.sgRuleIngressTest.properties"
    ),
  });

  provider.EC2.makeSecurityGroupRuleEgress({
    name: get("config.EC2.SecurityGroupRuleEgress.sgRuleEgressTest.name"),
    properties: get(
      "config.EC2.SecurityGroupRuleEgress.sgRuleEgressTest.properties"
    ),
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