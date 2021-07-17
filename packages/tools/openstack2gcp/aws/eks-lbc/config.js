const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
  iam: {
    Policy: {
      awsLoadBalancerControllerIamPolicy: {
        name: "AWSLoadBalancerControllerIAMPolicy",
        properties: {
          PolicyName: "AWSLoadBalancerControllerIAMPolicy",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: [
                  "iam:CreateServiceLinkedRole",
                  "ec2:DescribeAccountAttributes",
                  "ec2:DescribeAddresses",
                  "ec2:DescribeInternetGateways",
                  "ec2:DescribeVpcs",
                  "ec2:DescribeSubnets",
                  "ec2:DescribeSecurityGroups",
                  "ec2:DescribeInstances",
                  "ec2:DescribeNetworkInterfaces",
                  "ec2:DescribeTags",
                  "ec2:GetCoipPoolUsage",
                  "ec2:DescribeCoipPools",
                  "elasticloadbalancing:DescribeLoadBalancers",
                  "elasticloadbalancing:DescribeLoadBalancerAttributes",
                  "elasticloadbalancing:DescribeListeners",
                  "elasticloadbalancing:DescribeListenerCertificates",
                  "elasticloadbalancing:DescribeSSLPolicies",
                  "elasticloadbalancing:DescribeRules",
                  "elasticloadbalancing:DescribeTargetGroups",
                  "elasticloadbalancing:DescribeTargetGroupAttributes",
                  "elasticloadbalancing:DescribeTargetHealth",
                  "elasticloadbalancing:DescribeTags",
                ],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: [
                  "cognito-idp:DescribeUserPoolClient",
                  "acm:ListCertificates",
                  "acm:DescribeCertificate",
                  "iam:ListServerCertificates",
                  "iam:GetServerCertificate",
                  "waf-regional:GetWebACL",
                  "waf-regional:GetWebACLForResource",
                  "waf-regional:AssociateWebACL",
                  "waf-regional:DisassociateWebACL",
                  "wafv2:GetWebACL",
                  "wafv2:GetWebACLForResource",
                  "wafv2:AssociateWebACL",
                  "wafv2:DisassociateWebACL",
                  "shield:GetSubscriptionState",
                  "shield:DescribeProtection",
                  "shield:CreateProtection",
                  "shield:DeleteProtection",
                ],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: [
                  "ec2:AuthorizeSecurityGroupIngress",
                  "ec2:RevokeSecurityGroupIngress",
                ],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: ["ec2:CreateSecurityGroup"],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: ["ec2:CreateTags"],
                Resource: "arn:aws:ec2:*:*:security-group/*",
                Condition: {
                  StringEquals: {
                    "ec2:CreateAction": "CreateSecurityGroup",
                  },
                  Null: {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "false",
                  },
                },
              },
              {
                Effect: "Allow",
                Action: ["ec2:CreateTags", "ec2:DeleteTags"],
                Resource: "arn:aws:ec2:*:*:security-group/*",
                Condition: {
                  Null: {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false",
                  },
                },
              },
              {
                Effect: "Allow",
                Action: [
                  "ec2:AuthorizeSecurityGroupIngress",
                  "ec2:RevokeSecurityGroupIngress",
                  "ec2:DeleteSecurityGroup",
                ],
                Resource: "*",
                Condition: {
                  Null: {
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false",
                  },
                },
              },
              {
                Effect: "Allow",
                Action: [
                  "elasticloadbalancing:CreateLoadBalancer",
                  "elasticloadbalancing:CreateTargetGroup",
                ],
                Resource: "*",
                Condition: {
                  Null: {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "false",
                  },
                },
              },
              {
                Effect: "Allow",
                Action: [
                  "elasticloadbalancing:CreateListener",
                  "elasticloadbalancing:DeleteListener",
                  "elasticloadbalancing:CreateRule",
                  "elasticloadbalancing:DeleteRule",
                ],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: [
                  "elasticloadbalancing:AddTags",
                  "elasticloadbalancing:RemoveTags",
                ],
                Resource: [
                  "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
                  "arn:aws:elasticloadbalancing:*:*:loadbalancer/net/*/*",
                  "arn:aws:elasticloadbalancing:*:*:loadbalancer/app/*/*",
                ],
                Condition: {
                  Null: {
                    "aws:RequestTag/elbv2.k8s.aws/cluster": "true",
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false",
                  },
                },
              },
              {
                Effect: "Allow",
                Action: [
                  "elasticloadbalancing:ModifyLoadBalancerAttributes",
                  "elasticloadbalancing:SetIpAddressType",
                  "elasticloadbalancing:SetSecurityGroups",
                  "elasticloadbalancing:SetSubnets",
                  "elasticloadbalancing:DeleteLoadBalancer",
                  "elasticloadbalancing:ModifyTargetGroup",
                  "elasticloadbalancing:ModifyTargetGroupAttributes",
                  "elasticloadbalancing:DeleteTargetGroup",
                ],
                Resource: "*",
                Condition: {
                  Null: {
                    "aws:ResourceTag/elbv2.k8s.aws/cluster": "false",
                  },
                },
              },
              {
                Effect: "Allow",
                Action: [
                  "elasticloadbalancing:RegisterTargets",
                  "elasticloadbalancing:DeregisterTargets",
                ],
                Resource: "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
              },
              {
                Effect: "Allow",
                Action: [
                  "elasticloadbalancing:SetWebAcl",
                  "elasticloadbalancing:ModifyListener",
                  "elasticloadbalancing:AddListenerCertificates",
                  "elasticloadbalancing:RemoveListenerCertificates",
                  "elasticloadbalancing:ModifyRule",
                ],
                Resource: "*",
              },
            ],
          },
          Path: "/",
          Description: "Load Balancer Policy",
        },
      },
      amazonEksClusterPolicy: {
        name: "AmazonEKSClusterPolicy",
        properties: {
          Arn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
        },
      },
      amazonEksvpcResourceController: {
        name: "AmazonEKSVPCResourceController",
        properties: {
          Arn: "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
        },
      },
      amazonEksWorkerNodePolicy: {
        name: "AmazonEKSWorkerNodePolicy",
        properties: {
          Arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
        },
      },
      amazonEc2ContainerRegistryReadOnly: {
        name: "AmazonEC2ContainerRegistryReadOnly",
        properties: {
          Arn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
        },
      },
      amazonEksCniPolicy: {
        name: "AmazonEKS_CNI_Policy",
        properties: {
          Arn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
        },
      },
    },
    Role: {
      roleCluster: {
        name: "role-cluster",
        properties: {
          RoleName: "role-cluster",
          Path: "/",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: "eks.amazonaws.com",
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
        },
      },
      roleLoadBalancer: {
        name: "role-load-balancer",
        properties: {
          RoleName: "role-load-balancer",
          Path: "/",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Federated:
                    "arn:aws:iam::840541460064:oidc-provider/oidc.eks.eu-west-2.amazonaws.com/id/36FF899D2FFA7296225778F72B9E07B9",
                },
                Action: "sts:AssumeRoleWithWebIdentity",
                Condition: {
                  StringEquals: {
                    "oidc.eks.eu-west-2.amazonaws.com/id/36FF899D2FFA7296225778F72B9E07B9:aud":
                      "sts.amazonaws.com",
                  },
                },
              },
            ],
          },
        },
      },
      roleNodeGroup: {
        name: "role-node-group",
        properties: {
          RoleName: "role-node-group",
          Path: "/",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Service: "ec2.amazonaws.com",
                },
                Action: "sts:AssumeRole",
              },
            ],
          },
        },
      },
    },
    InstanceProfile: {
      eks_2ebd5779_066c_7078_9a82_5b430171dea7: {
        name: "eks-2ebd5779-066c-7078-9a82-5b430171dea7",
      },
    },
    OpenIDConnectProvider: {
      oidcEks: {
        name: "oidc-eks",
        properties: {
          ClientIDList: ["sts.amazonaws.com"],
        },
      },
    },
  },
  ec2: {
    Vpc: {
      vpc: {
        name: "vpc",
        properties: {
          CidrBlock: "192.168.0.0/16",
          DnsSupport: true,
          DnsHostnames: true,
          Tags: [
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "shared",
            },
          ],
        },
      },
    },
    Subnet: {
      subnetPrivateB: {
        name: "subnet-private-b",
        properties: {
          CidrBlock: "192.168.128.0/19",
          AvailabilityZone: "eu-west-2b",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
          Tags: [
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "shared",
            },
            {
              Key: "kubernetes.io/role/internal-elb",
              Value: "1",
            },
          ],
        },
      },
      subnetPublicA: {
        name: "subnet-public-a",
        properties: {
          CidrBlock: "192.168.0.0/19",
          AvailabilityZone: "eu-west-2a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
          Tags: [
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "shared",
            },
            {
              Key: "kubernetes.io/role/elb",
              Value: "1",
            },
          ],
        },
      },
      subnetPublicB: {
        name: "subnet-public-b",
        properties: {
          CidrBlock: "192.168.32.0/19",
          AvailabilityZone: "eu-west-2b",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
          Tags: [
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "shared",
            },
            {
              Key: "kubernetes.io/role/elb",
              Value: "1",
            },
          ],
        },
      },
      subnetPrivateA: {
        name: "subnet-private-a",
        properties: {
          CidrBlock: "192.168.96.0/19",
          AvailabilityZone: "eu-west-2a",
          MapPublicIpOnLaunch: false,
          MapCustomerOwnedIpOnLaunch: false,
          Tags: [
            {
              Key: "kubernetes.io/role/internal-elb",
              Value: "1",
            },
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "shared",
            },
          ],
        },
      },
    },
    KeyPair: {
      kp: {
        name: "kp",
      },
    },
    ElasticIpAddress: {
      iep: {
        name: "iep",
      },
    },
    InternetGateway: {
      internetGateway: {
        name: "internet-gateway",
      },
    },
    NatGateway: {
      natGateway: {
        name: "nat-gateway",
      },
    },
    RouteTable: {
      routeTablePrivateA: {
        name: "route-table-private-a",
      },
      routeTablePublic: {
        name: "route-table-public",
      },
      routeTablePrivateB: {
        name: "route-table-private-b",
      },
    },
    Route: {
      routePublic: {
        name: "route-public",
        properties: {
          DestinationCidrBlock: "0.0.0.0/0",
        },
      },
      routePrivateA: {
        name: "route-private-a",
        properties: {
          DestinationCidrBlock: "0.0.0.0/0",
        },
      },
      routePrivateB: {
        name: "route-private-b",
        properties: {
          DestinationCidrBlock: "0.0.0.0/0",
        },
      },
    },
    SecurityGroup: {
      securityGroupCluster: {
        name: "security-group-cluster",
        properties: {
          Description: "EKS Cluster Security Group",
        },
      },
      securityGroupNode: {
        name: "security-group-node",
        properties: {
          Description: "SG for the EKS Nodes",
          Tags: [
            {
              Key: "kubernetes.io/cluster/cluster",
              Value: "owned",
            },
          ],
        },
      },
    },
    SecurityGroupRuleIngress: {
      sgNodesRuleIngressAll: {
        name: "sg-nodes-rule-ingress-all",
        properties: {
          IpProtocol: "-1",
          FromPort: -1,
          ToPort: -1,
          CidrIpv4: "0.0.0.0/0",
        },
      },
      sgNodesRuleIngressAll: {
        name: "sg-nodes-rule-ingress-all",
        properties: {
          IpProtocol: "-1",
          FromPort: -1,
          ToPort: -1,
          CidrIpv6: "::/0",
        },
      },
      sgClusterRuleIngressHttps: {
        name: "sg-cluster-rule-ingress-https",
        properties: {
          IpProtocol: "tcp",
          FromPort: 443,
          ToPort: 443,
          CidrIpv4: "0.0.0.0/0",
        },
      },
      sgRuleNodeGroupIngressCluster: {
        name: "sg-rule-node-group-ingress-cluster",
        properties: {
          IpProtocol: "tcp",
          FromPort: 1025,
          ToPort: 65535,
          CidrIpv4: "0.0.0.0/0",
        },
      },
      sgRuleNodeGroupIngressCluster: {
        name: "sg-rule-node-group-ingress-cluster",
        properties: {
          IpProtocol: "tcp",
          FromPort: 1025,
          ToPort: 65535,
          ReferencedGroupInfo: {
            GroupId: "sg-05cd69f653e9eb6a7",
            UserId: "840541460064",
          },
        },
      },
      sgClusterRuleIngressHttps: {
        name: "sg-cluster-rule-ingress-https",
        properties: {
          IpProtocol: "tcp",
          FromPort: 443,
          ToPort: 443,
          CidrIpv6: "::/0",
        },
      },
      sgRuleNodeGroupIngressCluster: {
        name: "sg-rule-node-group-ingress-cluster",
        properties: {
          IpProtocol: "tcp",
          FromPort: 1025,
          ToPort: 65535,
          CidrIpv6: "::/0",
        },
      },
    },
    SecurityGroupRuleEgress: {
      sgClusterRuleEgress: {
        name: "sg-cluster-rule-egress",
        properties: {
          IpProtocol: "tcp",
          FromPort: 1024,
          ToPort: 65535,
          CidrIpv4: "0.0.0.0/0",
        },
      },
      sgClusterRuleEgress: {
        name: "sg-cluster-rule-egress",
        properties: {
          IpProtocol: "tcp",
          FromPort: 1024,
          ToPort: 65535,
          CidrIpv6: "::/0",
        },
      },
    },
  },
  acm: {
    Certificate: {
      exampleModuleAwsCertificateGrucloudOrg: {
        name: "example-module-aws-certificate.grucloud.org",
        properties: {
          DomainName: "example-module-aws-certificate.grucloud.org",
          SubjectAlternativeNames: [
            "example-module-aws-certificate.grucloud.org",
          ],
        },
      },
      modAwsLoadBalancerGrucloudOrg: {
        name: "mod-aws-load-balancer.grucloud.org",
        properties: {
          DomainName: "mod-aws-load-balancer.grucloud.org",
          SubjectAlternativeNames: ["mod-aws-load-balancer.grucloud.org"],
        },
      },
      starhackitEksLbcGrucloudOrg: {
        name: "starhackit-eks-lbc.grucloud.org",
        properties: {
          DomainName: "starhackit-eks-lbc.grucloud.org",
          SubjectAlternativeNames: ["starhackit-eks-lbc.grucloud.org"],
        },
      },
    },
  },
  eks: {
    Cluster: {
      cluster: {
        name: "cluster",
        properties: {
          version: "1.20",
        },
      },
    },
    NodeGroup: {
      nodeGroupPrivateCluster: {
        name: "node-group-private-cluster",
        properties: {
          capacityType: "ON_DEMAND",
          scalingConfig: {
            minSize: 1,
            maxSize: 1,
            desiredSize: 1,
          },
          instanceTypes: ["t2.medium"],
          amiType: "AL2_x86_64",
          labels: {},
          diskSize: 20,
        },
      },
    },
  },
  route53Domain: {
    Domain: {
      grucloudOrg: {
        name: "grucloud.org",
      },
    },
  },
  route53: {
    HostedZone: {
      starhackitEksLbcGrucloudOrg: {
        name: "starhackit-eks-lbc.grucloud.org.",
        properties: {
          Name: "starhackit-eks-lbc.grucloud.org.",
        },
      },
    },
    Record: {
      dnsRecordAliasLoadBalancerStarhackitEksLbcGrucloudOrg: {
        name: "dns-record-alias-load-balancer-starhackit-eks-lbc.grucloud.org.",
        properties: {
          Name: "starhackit-eks-lbc.grucloud.org.",
          Type: "A",
          ResourceRecords: [],
          AliasTarget: {
            HostedZoneId: "ZHURV8PSTC4K8",
            DNSName:
              "k8s-default-ingress-e514cce9f1-1778706756.eu-west-2.elb.amazonaws.com.",
            EvaluateTargetHealth: false,
          },
        },
      },
      certificateValidationStarhackitEksLbcGrucloudOrg: {
        name: "certificate-validation-starhackit-eks-lbc.grucloud.org.",
        properties: {
          Name: "_b4c084392d6f4726727d69dfaf665819.starhackit-eks-lbc.grucloud.org.",
          Type: "CNAME",
          TTL: 300,
          ResourceRecords: [
            {
              Value:
                "_009ebaa39ee9a4d18d0ebd96e91635bf.bbfvkzsszw.acm-validations.aws.",
            },
          ],
        },
      },
    },
  },
});