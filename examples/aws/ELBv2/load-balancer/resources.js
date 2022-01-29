// Generated by 'gc gencode'
const { pipe, tap, get, eq, and } = require("rubico");
const { find } = require("rubico/x");

const createResources = ({ provider }) => {
  provider.AutoScaling.makeAutoScalingGroup({
    name: "ag",
    properties: ({ config }) => ({
      MinSize: 1,
      MaxSize: 1,
      DesiredCapacity: 1,
    }),
    dependencies: ({ resources }) => ({
      subnets: [
        resources.EC2.Subnet["subnet-a"],
        resources.EC2.Subnet["subnet-b"],
      ],
      launchTemplate: resources.EC2.LaunchTemplate["my-template"],
    }),
  });

  provider.AutoScaling.makeAutoScalingAttachment({
    dependencies: ({ resources }) => ({
      autoScalingGroup: resources.AutoScaling.AutoScalingGroup["ag"],
      targetGroup: resources.ELBv2.TargetGroup["target-group-rest"],
    }),
  });

  provider.AutoScaling.makeAutoScalingAttachment({
    dependencies: ({ resources }) => ({
      autoScalingGroup: resources.AutoScaling.AutoScalingGroup["ag"],
      targetGroup: resources.ELBv2.TargetGroup["target-group-web"],
    }),
  });

  provider.ACM.makeCertificate({
    name: "grucloud.org",
  });

  provider.EC2.makeVpc({
    name: "vpc",
    properties: ({ config }) => ({
      CidrBlock: "192.168.0.0/16",
    }),
  });

  provider.EC2.makeInternetGateway({
    name: "internet-gateway",
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc["vpc"],
    }),
  });

  provider.EC2.makeSubnet({
    name: "subnet-a",
    properties: ({ config }) => ({
      CidrBlock: "192.168.0.0/19",
      AvailabilityZone: `${config.region}a`,
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc["vpc"],
    }),
  });

  provider.EC2.makeSubnet({
    name: "subnet-b",
    properties: ({ config }) => ({
      CidrBlock: "192.168.32.0/19",
      AvailabilityZone: `${config.region}b`,
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc["vpc"],
    }),
  });

  provider.EC2.useDefaultRouteTable({
    name: "rt-default-vpc",
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc["vpc"],
    }),
  });

  provider.EC2.makeRouteTableAssociation({
    dependencies: ({ resources }) => ({
      routeTable: resources.EC2.RouteTable["rt-default-vpc"],
      subnet: resources.EC2.Subnet["subnet-a"],
    }),
  });

  provider.EC2.makeRouteTableAssociation({
    dependencies: ({ resources }) => ({
      routeTable: resources.EC2.RouteTable["rt-default-vpc"],
      subnet: resources.EC2.Subnet["subnet-b"],
    }),
  });

  provider.EC2.makeRoute({
    properties: ({ config }) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({ resources }) => ({
      routeTable: resources.EC2.RouteTable["rt-default-vpc"],
      ig: resources.EC2.InternetGateway["internet-gateway"],
    }),
  });

  provider.EC2.useDefaultSecurityGroup({
    name: "sg-default-vpc",
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc["vpc"],
    }),
  });

  provider.EC2.makeLaunchTemplate({
    name: "my-template",
    properties: ({ config }) => ({
      LaunchTemplateData: {
        ImageId: "ami-02e136e904f3da870",
        InstanceType: "t2.micro",
      },
    }),
  });

  provider.ELBv2.makeLoadBalancer({
    name: "load-balancer",
    properties: ({ config }) => ({
      Scheme: "internet-facing",
      Type: "application",
      IpAddressType: "ipv4",
    }),
    dependencies: ({ resources }) => ({
      subnets: [
        resources.EC2.Subnet["subnet-a"],
        resources.EC2.Subnet["subnet-b"],
      ],
      securityGroups: [resources.EC2.SecurityGroup["sg-default-vpc"]],
    }),
  });

  provider.ELBv2.makeTargetGroup({
    name: "target-group-rest",
    properties: ({ config }) => ({
      Protocol: "HTTP",
      Port: 30020,
      HealthCheckProtocol: "HTTP",
      HealthCheckPort: "traffic-port",
      HealthCheckEnabled: true,
      HealthCheckIntervalSeconds: 30,
      HealthCheckTimeoutSeconds: 5,
      HealthyThresholdCount: 5,
      HealthCheckPath: "/",
      Matcher: {
        HttpCode: "200",
      },
      TargetType: "instance",
      ProtocolVersion: "HTTP1",
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc["vpc"],
    }),
  });

  provider.ELBv2.makeTargetGroup({
    name: "target-group-web",
    properties: ({ config }) => ({
      Protocol: "HTTP",
      Port: 30010,
      HealthCheckProtocol: "HTTP",
      HealthCheckPort: "traffic-port",
      HealthCheckEnabled: true,
      HealthCheckIntervalSeconds: 30,
      HealthCheckTimeoutSeconds: 5,
      HealthyThresholdCount: 5,
      HealthCheckPath: "/",
      Matcher: {
        HttpCode: "200",
      },
      TargetType: "instance",
      ProtocolVersion: "HTTP1",
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc["vpc"],
    }),
  });

  provider.ELBv2.makeListener({
    properties: ({ config }) => ({
      Port: 80,
      Protocol: "HTTP",
    }),
    dependencies: ({ resources }) => ({
      loadBalancer: resources.ELBv2.LoadBalancer["load-balancer"],
      targetGroup: resources.ELBv2.TargetGroup["target-group-web"],
    }),
  });

  provider.ELBv2.makeListener({
    properties: ({ config }) => ({
      Port: 443,
      Protocol: "HTTPS",
    }),
    dependencies: ({ resources }) => ({
      loadBalancer: resources.ELBv2.LoadBalancer["load-balancer"],
      targetGroup: resources.ELBv2.TargetGroup["target-group-rest"],
      certificate: resources.ACM.Certificate["grucloud.org"],
    }),
  });

  provider.ELBv2.makeRule({
    properties: ({ config }) => ({
      Priority: "1",
      Conditions: [
        {
          Field: "path-pattern",
          Values: ["/*"],
        },
      ],
      Actions: [
        {
          Type: "redirect",
          Order: 1,
          RedirectConfig: {
            Protocol: "HTTPS",
            Port: "443",
            Host: "#{host}",
            Path: "/#{path}",
            Query: "#{query}",
            StatusCode: "HTTP_301",
          },
        },
      ],
    }),
    dependencies: ({ resources }) => ({
      listener: resources.ELBv2.Listener["listener::load-balancer::HTTP::80"],
    }),
  });

  provider.ELBv2.makeRule({
    properties: ({ config }) => ({
      Priority: "1",
      Conditions: [
        {
          Field: "path-pattern",
          Values: ["/api/*"],
        },
      ],
    }),
    dependencies: ({ resources }) => ({
      listener: resources.ELBv2.Listener["listener::load-balancer::HTTPS::443"],
      targetGroup: resources.ELBv2.TargetGroup["target-group-rest"],
    }),
  });

  provider.ELBv2.makeRule({
    properties: ({ config }) => ({
      Priority: "2",
      Conditions: [
        {
          Field: "path-pattern",
          Values: ["/*"],
        },
      ],
    }),
    dependencies: ({ resources }) => ({
      listener: resources.ELBv2.Listener["listener::load-balancer::HTTPS::443"],
      targetGroup: resources.ELBv2.TargetGroup["target-group-web"],
    }),
  });

  provider.Route53.makeHostedZone({
    name: "grucloud.org.",
    dependencies: ({ resources }) => ({
      domain: resources.Route53Domains.Domain["grucloud.org"],
    }),
  });

  provider.Route53.makeRecord({
    dependencies: ({ resources }) => ({
      hostedZone: resources.Route53.HostedZone["grucloud.org."],
      loadBalancer: resources.ELBv2.LoadBalancer["load-balancer"],
    }),
  });

  provider.Route53Domains.useDomain({
    name: "grucloud.org",
  });
};

exports.createResources = createResources;