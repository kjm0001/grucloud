const AWS = require("aws-sdk");
const { defaultsDeep, isEmpty } = require("lodash/fp");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsInternetGateway" });
const { tos } = require("../../tos");
const { retryExpectOk } = require("../Retry");
const { KeyName, getByIdCore } = require("./AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../Common");
const { findNameInTags } = require("./AwsCommon");
const { tagResource } = require("./AwsTagResource");

module.exports = AwsInternetGateway = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { stage } = config;
  assert(stage);

  const ec2 = new AWS.EC2();

  const findName = findNameInTags;
  const findId = (item) => {
    assert(item);
    const id = item.InternetGatewayId;
    assert(id);
    return id;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInternetGateways-property
  const list = async (params) => {
    logger.debug(`list ig ${tos(params)}`);
    const { InternetGateways } = await ec2
      .describeInternetGateways(params)
      .promise();
    logger.info(`list ig ${tos(InternetGateways)}`);

    return {
      total: InternetGateways.length,
      items: InternetGateways,
    };
  };

  const getByName = ({ name }) => getByNameCore({ name, list, findName });
  const getById = getByIdCore({ fieldIds: "InternetGatewayIds", list });

  const getStateName = (instance) => {
    const state = instance.Attachments[0]?.State;
    logger.debug(`stateName ${state}`);
    return state;
  };

  const isUpById = isUpByIdCore({
    getById,
    states: ["available"],
    getStateName,
  });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createInternetGateway-property
  const create = async ({ name, payload, dependencies }) => {
    assert(name);
    //assert(payload);

    logger.debug(`create ig  ${tos({ name, payload })}`);
    const {
      InternetGateway: { InternetGatewayId },
    } = await ec2.createInternetGateway(payload).promise();
    assert(InternetGatewayId);
    logger.info(`created ig ${InternetGatewayId}`);

    await tagResource({
      config,
      name,
      resourceType: "InternetGateway",
      resourceId: InternetGatewayId,
    });

    const { vpc } = dependencies;
    assert(vpc, "InternetGateway is missing the dependency 'vpc'");
    const vpcLive = await vpc.getLive();
    assert(vpcLive.VpcId);
    const paramsAttach = {
      InternetGatewayId,
      VpcId: vpcLive.VpcId,
    };
    logger.debug(`create ig, ig attaching vpc ${tos({ vpcLive })}`);
    await ec2.attachInternetGateway(paramsAttach).promise();
    logger.debug(`create ig, vpc attached`);

    await retryExpectOk({
      name: `isUpById: ${name} id: ${InternetGatewayId}`,
      fn: () => isUpById({ id: InternetGatewayId }),
    });

    return { id: InternetGatewayId };
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#detachInternetGateway-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteInternetGateway-property
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ig ${tos({ name, id })}`);

    if (isEmpty(id)) {
      throw Error(`destroy ig invalid id`);
    }
    const ig = await getById({ id });
    const attachment = ig.Attachments[0];
    if (attachment) {
      const paramsDetach = {
        InternetGatewayId: id,
        VpcId: attachment.VpcId,
      };
      logger.debug(`destroy ig detaching vpc ${attachment.VpcId}`);
      await ec2.detachInternetGateway(paramsDetach).promise();
    }
    await ec2.deleteInternetGateway({ InternetGatewayId: id }).promise();
    logger.debug(`destroy ig IN PROGRESS, ${tos({ name, id })}`);
    return;
  };

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({}, properties);

  return {
    type: "InternetGateway",
    spec,
    findId,
    isUpById,
    isDownById,
    getByName,
    getById,
    findName,
    cannotBeDeleted: () => false,
    list,
    create,
    destroy,
    configDefault,
  };
};