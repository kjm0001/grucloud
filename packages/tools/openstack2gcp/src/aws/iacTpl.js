exports.iacTpl = ({ resourcesCode, resourcesVarNames = [] }) => `
// Generated by aws2gc
const { set, pipe } = require("rubico")
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = async ({ provider }) => {
  const {config} = provider;
  return pipe([
    () => ({}),
    ${resourcesCode}
  ])();
};

exports.createResources = createResources;

exports.createStack = async () => {
  const provider = AwsProvider({ config: require("./config") });
  const resources = await createResources({
    provider,
  });

  return {
    provider,
    resources,
  };
};

`;