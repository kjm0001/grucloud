// Generated by aws2gc
const { get } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  provider.S3.makeBucket({
    name: get("config.S3.Bucket.grucloudAcceleration.name"),
    properties: get("config.S3.Bucket.grucloudAcceleration.properties"),
  });

  provider.S3.makeBucket({
    name: get("config.S3.Bucket.grucloudCors.name"),
    properties: get("config.S3.Bucket.grucloudCors.properties"),
  });

  provider.S3.makeBucket({
    name: get("config.S3.Bucket.grucloudEncryption.name"),
    properties: get("config.S3.Bucket.grucloudEncryption.properties"),
  });

  provider.S3.makeBucket({
    name: get("config.S3.Bucket.grucloudLifecycleconfiguration.name"),
    properties: get(
      "config.S3.Bucket.grucloudLifecycleconfiguration.properties"
    ),
  });

  provider.S3.makeBucket({
    name: get("config.S3.Bucket.grucloudLogDestination.name"),
  });

  provider.S3.makeBucket({
    name: get("config.S3.Bucket.grucloudPolicy.name"),
    properties: get("config.S3.Bucket.grucloudPolicy.properties"),
  });

  provider.S3.makeBucket({
    name: get("config.S3.Bucket.grucloudRequestPayment.name"),
    properties: get("config.S3.Bucket.grucloudRequestPayment.properties"),
  });

  provider.S3.makeBucket({
    name: get("config.S3.Bucket.grucloudTag.name"),
    properties: get("config.S3.Bucket.grucloudTag.properties"),
  });

  provider.S3.makeBucket({
    name: get("config.S3.Bucket.grucloudTestBasic.name"),
  });

  provider.S3.makeBucket({
    name: get("config.S3.Bucket.grucloudVersioning.name"),
    properties: get("config.S3.Bucket.grucloudVersioning.properties"),
  });

  provider.S3.makeBucket({
    name: get("config.S3.Bucket.grucloudWebsite.name"),
    properties: get("config.S3.Bucket.grucloudWebsite.properties"),
  });

  provider.S3.makeObject({
    name: get("config.S3.Object.fileTest.name"),
    properties: get("config.S3.Object.fileTest.properties"),
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket.grucloudTestBasic,
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