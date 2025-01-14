// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "ElasticIpAddress", group: "EC2", name: "myip" },
  {
    type: "ElasticIpAddressAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      eip: "myip",
      instance: "web-server-ec2-vpc",
    }),
  },
  {
    type: "Instance",
    group: "EC2",
    name: "web-server-ec2-vpc",
    properties: ({ config, getId }) => ({
      Image: {
        Description: "Amazon Linux 2 AMI 2.0.20211001.1 x86_64 HVM gp2",
      },
      InstanceType: "t2.micro",
      NetworkInterfaces: [
        {
          DeviceIndex: 0,
          Groups: [
            `${getId({
              type: "SecurityGroup",
              group: "EC2",
              name: "sg::vpc-ec2-example::security-group",
            })}`,
          ],
          SubnetId: `${getId({
            type: "Subnet",
            group: "EC2",
            name: "vpc-ec2-example::subnet",
          })}`,
        },
      ],
      Placement: {
        AvailabilityZone: `${config.region}a`,
      },
      UserData: `#!/bin/bash
echo "Mounting /dev/xvdf"
while ! ls /dev/xvdf > /dev/null
do 
  sleep 1
done
if [ \`file -s /dev/xvdf | cut -d ' ' -f 2\` = 'data' ]
then
  echo "Formatting /dev/xvdf"
  mkfs.xfs /dev/xvdf
fi
mkdir -p /data
mount /dev/xvdf /data
echo /dev/xvdf /data defaults,nofail 0 2 >> /etc/fstab
`,
    }),
    dependencies: ({}) => ({
      subnets: ["vpc-ec2-example::subnet"],
      keyPair: "kp-ec2-vpc",
      securityGroups: ["sg::vpc-ec2-example::security-group"],
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "ig" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "vpc-ec2-example",
      internetGateway: "ig",
    }),
  },
  { type: "KeyPair", group: "EC2", name: "kp-ec2-vpc" },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "ig",
      routeTable: "vpc-ec2-example::route-table",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "route-table",
    dependencies: ({}) => ({
      vpc: "vpc-ec2-example",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "vpc-ec2-example::route-table",
      subnet: "vpc-ec2-example::subnet",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "security-group",
      Description: "Managed By GruCloud",
    }),
    dependencies: ({}) => ({
      vpc: "vpc-ec2-example",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpProtocol: "icmp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      Ipv6Ranges: [
        {
          CidrIpv6: "::/0",
        },
      ],
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc-ec2-example::security-group",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 22,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      Ipv6Ranges: [
        {
          CidrIpv6: "::/0",
        },
      ],
      ToPort: 22,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc-ec2-example::security-group",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 8,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "vpc-ec2-example",
    }),
  },
  {
    type: "Volume",
    group: "EC2",
    name: "volume",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      Size: 5,
      VolumeType: "standard",
    }),
  },
  {
    type: "VolumeAttachment",
    group: "EC2",
    properties: ({}) => ({
      Device: "/dev/sdf",
      DeleteOnTermination: false,
    }),
    dependencies: ({}) => ({
      volume: "volume",
      instance: "web-server-ec2-vpc",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc-ec2-example",
    properties: ({}) => ({
      CidrBlock: "10.1.0.0/16",
    }),
  },
];
