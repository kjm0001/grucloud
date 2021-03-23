const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/test/E2ETestUtils");

describe("AwsIamInstanceProfile", async function () {
  let config;
  let provider;
  let iamRole;
  let iamInstanceProfile;
  const types = ["IamInstanceProfile", "IamRole"];
  const iamRoleName = "role-example-for-instance-profile";
  const iamInstanceProfileName = "instance-profile-example";

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      name: "aws",
      config: () => ({ projectName: "gru-test" }),
    });

    await provider.start();

    iamRole = await provider.makeIamRole({
      name: iamRoleName,
      properties: () => ({
        Path: "/",
        AssumeRolePolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: "sts:AssumeRole",
              Principal: {
                Service: "ec2.amazonaws.com",
              },
              Effect: "Allow",
              Sid: "",
            },
          ],
        },
      }),
    });

    iamInstanceProfile = await provider.makeIamInstanceProfile({
      name: iamInstanceProfileName,
      dependencies: { iamRoles: [iamRole] },
      properties: () => ({
        Path: "/",
      }),
    });
  });
  after(async () => {});
  it("iamInstanceProfile resolveConfig", async function () {
    assert.equal(iamInstanceProfile.name, iamInstanceProfileName);
    const config = await iamInstanceProfile.resolveConfig();
    assert(config.InstanceProfileName);
    assert(config.Path);
  });
  it.skip("iamInstanceProfile apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 2, destroy: 0 },
    });

    const iamInstanceProfileLive = await iamInstanceProfile.getLive();
    assert(iamInstanceProfileLive);
    assert.equal(iamInstanceProfileLive.Roles[0].RoleName, iamRole.name);

    await testPlanDestroy({ provider, types });
  });
});