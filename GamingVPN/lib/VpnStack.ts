import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_ec2 as ec2 } from "aws-cdk-lib";

import { CertificatesStack } from "./CertificatesStack.js";

export interface VpnStackProps extends cdk.StackProps {
	readonly certificates: CertificatesStack;
}

export class VpnStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: VpnStackProps) {
		super(scope, id, props);

		const vpc = new ec2.Vpc(this, "VpnVpc", {
			ipAddresses: ec2.IpAddresses.cidr("10.23.0.0/16")
		});

		const endpoint = vpc.addClientVpnEndpoint("ClientVpnEndpoint", {
			cidr: "10.32.0.0/16",
			serverCertificateArn: props.certificates.ovpnGamingVPNKaitoTokyoCertificate.certificateArn,
			clientCertificateArn:
				props.certificates.umireonOvpnGamingVPNKaitoTokyoCertificate.certificateArn
		});

		endpoint.addAuthorizationRule("Internet", {
			cidr: "0.0.0.0/24"
		});

		endpoint.addRoute("PublicSubnet", {
			cidr: "0.0.0.0/0",
			target: ec2.ClientVpnRouteTarget.subnet(vpc.publicSubnets[0]!)
		});
	}
}
