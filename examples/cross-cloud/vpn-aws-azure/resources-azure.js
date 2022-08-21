// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LocalNetworkGateway",
    group: "Network",
    properties: ({ config, getId }) => ({
      name: "azlngw1",
      location: config.location,
      properties: {
        localNetworkAddressSpace: {
          addressPrefixes: ["192.168.0.0/16"],
        },
        gatewayIpAddress: `${getId({
          type: "VpnConnection",
          group: "EC2",
          name: "vpn-connection",
          path: "live.Options.TunnelOptions[1].OutsideIpAddress",
        })}`,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      gatewayIpAddressAws: "vpn-connection",
    }),
  },
  {
    type: "LocalNetworkGateway",
    group: "Network",
    properties: ({ config, getId }) => ({
      name: "azlngw2",
      location: config.location,
      properties: {
        localNetworkAddressSpace: {
          addressPrefixes: ["192.168.0.0/16"],
        },
        gatewayIpAddress: `${getId({
          type: "VpnConnection",
          group: "EC2",
          name: "vpn-connection",
          path: "live.Options.TunnelOptions[0].OutsideIpAddress",
        })}`,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      gatewayIpAddressAws: "vpn-connection",
    }),
  },
  {
    type: "PublicIPAddress",
    group: "Network",
    properties: ({}) => ({
      name: "vnetvgwpip1",
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
    }),
  },
  {
    type: "Route",
    group: "Network",
    properties: ({}) => ({
      name: "awsroute",
      properties: {
        addressPrefix: "192.168.0.0/16",
        nextHopType: "VirtualNetworkGateway",
        hasBgpOverride: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      routeTable: "hybridrg::awsroute",
    }),
  },
  {
    type: "RouteTable",
    group: "Network",
    properties: ({ config }) => ({
      name: "awsroute",
      location: config.location,
      properties: {
        disableBgpRoutePropagation: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
    }),
  },
  {
    type: "Subnet",
    group: "Network",
    properties: ({}) => ({
      name: "GatewaySubnet",
      properties: {
        addressPrefix: "172.16.2.0/28",
        privateEndpointNetworkPolicies: "Enabled",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      virtualNetwork: "hybridrg::vnet1",
    }),
  },
  {
    type: "Subnet",
    group: "Network",
    properties: ({}) => ({
      name: "subnet1",
      properties: {
        addressPrefix: "172.16.1.0/24",
        privateEndpointNetworkPolicies: "Enabled",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      virtualNetwork: "hybridrg::vnet1",
    }),
  },
  {
    type: "VirtualNetwork",
    group: "Network",
    properties: ({}) => ({
      name: "vnet1",
      properties: {
        addressSpace: {
          addressPrefixes: ["172.16.0.0/16"],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
    }),
  },
  {
    type: "VirtualNetworkGateway",
    group: "Network",
    properties: ({ config, getId }) => ({
      name: "myvng1",
      location: config.location,
      properties: {
        ipConfigurations: [
          {
            properties: {
              privateIPAllocationMethod: "Dynamic",
              subnet: {
                id: `${getId({
                  type: "Subnet",
                  group: "Network",
                  name: "hybridrg::vnet1::GatewaySubnet",
                })}`,
              },
              publicIPAddress: {
                id: `${getId({
                  type: "PublicIPAddress",
                  group: "Network",
                  name: "hybridrg::vnetvgwpip1",
                })}`,
              },
            },
            name: "vnetGatewayConfig",
          },
        ],
        gatewayType: "Vpn",
        vpnType: "RouteBased",
        vpnGatewayGeneration: "Generation1",
        enableBgp: false,
        enablePrivateIpAddress: false,
        activeActive: false,
        disableIPSecReplayProtection: false,
        sku: {
          name: "VpnGw1",
          tier: "VpnGw1",
        },
        vpnClientConfiguration: {
          vpnClientProtocols: ["OpenVPN", "IkeV2"],
          vpnAuthenticationTypes: [],
        },
        bgpSettings: {
          asn: 65515,
          bgpPeeringAddress: "172.16.2.14",
          peerWeight: 0,
        },
        enableBgpRouteTranslationForNat: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      subnets: ["hybridrg::vnet1::GatewaySubnet"],
      publicIpAddresses: ["hybridrg::vnetvgwpip1"],
    }),
  },
  {
    type: "VirtualNetworkGatewayConnection",
    group: "Network",
    properties: ({ config }) => ({
      name: "vngc1",
      location: config.location,
      properties: {
        connectionType: "IPsec",
        connectionProtocol: "IKEv2",
        routingWeight: 0,
        dpdTimeoutSeconds: 0,
        connectionMode: "Default",
        enableBgp: false,
        useLocalAzureIpAddress: false,
        usePolicyBasedTrafficSelectors: false,
        expressRouteGatewayBypass: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      localNetworkGateway: "hybridrg::azlngw1",
      virtualNetworkGateway: "hybridrg::myvng1",
    }),
  },
  {
    type: "VirtualNetworkGatewayConnection",
    group: "Network",
    properties: ({ config }) => ({
      name: "vngc2",
      location: config.location,
      properties: {
        connectionType: "IPsec",
        connectionProtocol: "IKEv2",
        routingWeight: 0,
        dpdTimeoutSeconds: 0,
        connectionMode: "Default",
        enableBgp: false,
        useLocalAzureIpAddress: false,
        usePolicyBasedTrafficSelectors: false,
        expressRouteGatewayBypass: false,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      localNetworkGateway: "hybridrg::azlngw2",
      virtualNetworkGateway: "hybridrg::myvng1",
    }),
  },
  {
    type: "VirtualNetworkGatewayConnectionSharedKey",
    group: "Network",
    properties: ({ getId }) => ({
      value: `${getId({
        type: "VpnConnection",
        group: "EC2",
        name: "vpn-connection",
        path: "live.Options.TunnelOptions[1].PreSharedKey",
      })}`,
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      virtualNetworkGatewayConnection: "hybridrg::vngc1",
      vpnConnectionAws: "vpn-connection",
    }),
  },
  {
    type: "VirtualNetworkGatewayConnectionSharedKey",
    group: "Network",
    properties: ({ getId }) => ({
      value: `${getId({
        type: "VpnConnection",
        group: "EC2",
        name: "vpn-connection",
        path: "live.Options.TunnelOptions[0].PreSharedKey",
      })}`,
    }),
    dependencies: ({}) => ({
      resourceGroup: "hybridrg",
      virtualNetworkGatewayConnection: "hybridrg::vngc2",
      vpnConnectionAws: "vpn-connection",
    }),
  },
  {
    type: "ResourceGroup",
    group: "Resources",
    properties: ({}) => ({
      name: "hybridrg",
    }),
  },
];