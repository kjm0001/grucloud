// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

const createResources = ({ provider }) => {
  provider.KMS.makeKey({
    name: "secret-key-test",
  });
};

exports.createResources = createResources;