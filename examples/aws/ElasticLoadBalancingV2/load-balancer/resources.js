// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    properties: ({}) => ({
      DomainName: "grucloud.org",
      SubjectAlternativeNames: ["grucloud.org", "*.grucloud.org"],
    }),
  },
  {
    type: "AutoScalingGroup",
    group: "AutoScaling",
    name: "ag",
    properties: ({}) => ({
      MinSize: 1,
      MaxSize: 1,
      DesiredCapacity: 1,
    }),
    dependencies: ({}) => ({
      subnets: ["vpc::subnet-a", "vpc::subnet-b"],
      launchTemplate: "my-template",
    }),
  },
  {
    type: "AutoScalingAttachment",
    group: "AutoScaling",
    dependencies: ({}) => ({
      autoScalingGroup: "ag",
      targetGroup: "target-group-rest",
    }),
  },
  {
    type: "AutoScalingAttachment",
    group: "AutoScaling",
    dependencies: ({}) => ({
      autoScalingGroup: "ag",
      targetGroup: "target-group-web",
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "internet-gateway" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "vpc",
      internetGateway: "internet-gateway",
    }),
  },
  {
    type: "LaunchTemplate",
    group: "EC2",
    name: "my-template",
    properties: ({}) => ({
      LaunchTemplateData: {
        Image: {
          Description: "Amazon Linux 2 AMI 2.0.20211001.1 x86_64 HVM gp2",
        },
        InstanceType: "t2.micro",
      },
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "internet-gateway",
      routeTable: "vpc::rt-default",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "rt-default",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "vpc::rt-default",
      subnet: "vpc::subnet-a",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "vpc::rt-default",
      subnet: "vpc::subnet-b",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "sg::vpc::default",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-a",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 3,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-b",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 3,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "192.168.0.0/16",
    }),
  },
  {
    type: "Listener",
    group: "ElasticLoadBalancingV2",
    properties: ({ getId }) => ({
      DefaultActions: [
        {
          ForwardConfig: {
            TargetGroups: [
              {
                TargetGroupArn: `${getId({
                  type: "TargetGroup",
                  group: "ElasticLoadBalancingV2",
                  name: "target-group-web",
                })}`,
                Weight: 1,
              },
            ],
            TargetGroupStickinessConfig: {
              Enabled: false,
            },
          },
          TargetGroupArn: `${getId({
            type: "TargetGroup",
            group: "ElasticLoadBalancingV2",
            name: "target-group-web",
          })}`,
          Type: "forward",
        },
      ],
      Port: 80,
      Protocol: "HTTP",
      Tags: [
        {
          Key: "mykey",
          Value: "value",
        },
      ],
    }),
    dependencies: ({}) => ({
      loadBalancer: "load-balancer",
      targetGroups: ["target-group-web"],
    }),
  },
  {
    type: "Listener",
    group: "ElasticLoadBalancingV2",
    properties: ({ getId }) => ({
      DefaultActions: [
        {
          ForwardConfig: {
            TargetGroups: [
              {
                TargetGroupArn: `${getId({
                  type: "TargetGroup",
                  group: "ElasticLoadBalancingV2",
                  name: "target-group-web",
                })}`,
                Weight: 1,
              },
            ],
            TargetGroupStickinessConfig: {
              Enabled: false,
            },
          },
          TargetGroupArn: `${getId({
            type: "TargetGroup",
            group: "ElasticLoadBalancingV2",
            name: "target-group-web",
          })}`,
          Type: "forward",
        },
      ],
      Port: 443,
      Protocol: "HTTPS",
    }),
    dependencies: ({}) => ({
      loadBalancer: "load-balancer",
      targetGroups: ["target-group-web"],
      certificate: "grucloud.org",
    }),
  },
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "load-balancer",
      Scheme: "internet-facing",
      Type: "application",
      IpAddressType: "ipv4",
      Tags: [
        {
          Key: "mykey",
          Value: "value",
        },
      ],
    }),
    dependencies: ({}) => ({
      subnets: ["vpc::subnet-a", "vpc::subnet-b"],
      securityGroups: ["sg::vpc::default"],
    }),
  },
  {
    type: "Rule",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Priority: "1",
      Conditions: [
        {
          Field: "path-pattern",
          Values: ["/*"],
        },
      ],
      Actions: [
        {
          Order: 1,
          RedirectConfig: {
            Host: "#{host}",
            Path: "/#{path}",
            Port: "443",
            Protocol: "HTTPS",
            Query: "#{query}",
            StatusCode: "HTTP_301",
          },
          Type: "redirect",
        },
      ],
      Tags: [
        {
          Key: "mykey",
          Value: "value",
        },
      ],
    }),
    dependencies: ({}) => ({
      listener: "listener::load-balancer::HTTP::80",
    }),
  },
  {
    type: "Rule",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Priority: "1",
      Conditions: [
        {
          Field: "path-pattern",
          Values: ["/api/*"],
        },
      ],
    }),
    dependencies: ({}) => ({
      listener: "listener::load-balancer::HTTPS::443",
      targetGroup: "target-group-rest",
    }),
  },
  {
    type: "Rule",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Priority: "2",
      Conditions: [
        {
          Field: "path-pattern",
          Values: ["/*"],
        },
      ],
    }),
    dependencies: ({}) => ({
      listener: "listener::load-balancer::HTTPS::443",
      targetGroup: "target-group-web",
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      HealthCheckPort: "traffic-port",
      HealthCheckProtocol: "HTTP",
      Name: "target-group-rest",
      Port: 30020,
      Protocol: "HTTP",
      ProtocolVersion: "HTTP1",
      Tags: [
        {
          Key: "mykey",
          Value: "value",
        },
      ],
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      HealthCheckPort: "traffic-port",
      HealthCheckProtocol: "HTTP",
      Name: "target-group-web",
      Port: 30010,
      Protocol: "HTTP",
      ProtocolVersion: "HTTP1",
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "grucloud.org.",
    }),
    dependencies: ({}) => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    properties: ({}) => ({
      AliasTarget: {
        EvaluateTargetHealth: true,
      },
      Name: "grucloud.org.",
      Type: "A",
    }),
    dependencies: ({}) => ({
      hostedZone: "grucloud.org.",
      loadBalancer: "load-balancer",
    }),
  },
  {
    type: "Domain",
    group: "Route53Domains",
    name: "grucloud.org",
    readOnly: true,
  },
];
