// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "CachePolicy",
    group: "CloudFront",
    properties: ({}) => ({
      CachePolicyConfig: {
        Comment: "",
        Name: "my-cache-policy",
        DefaultTTL: 86400,
        MaxTTL: 31536000,
        MinTTL: 1,
        ParametersInCacheKeyAndForwardedToOrigin: {
          EnableAcceptEncodingGzip: true,
          EnableAcceptEncodingBrotli: true,
          HeadersConfig: {
            HeaderBehavior: "none",
          },
          CookiesConfig: {
            CookieBehavior: "none",
          },
          QueryStringsConfig: {
            QueryStringBehavior: "none",
          },
        },
      },
    }),
  },
];