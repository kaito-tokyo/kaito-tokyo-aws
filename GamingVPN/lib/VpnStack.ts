import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_ec2 as ec2 } from "aws-cdk-lib";

import { CertificatesStack } from "./CertificatesStack.js";

export interface VpcStackProps extends cdk.StackProps {
	readonly certificates: CertificatesStack;
}

export class VpcStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: VpcStackProps) {
		super(scope, id, props);

		const vpc = new ec2.Vpc(this, "VpnVpc", {
			ipAddresses: ec2.IpAddresses.cidr("10.23.0.0/16")
		});

		const endpoint = vpc.addClientVpnEndpoint("ClientVpnEndpoint", {
			cidr: "10.32.0.0/16",
			serverCertificateArn: props.certificates.ovpnGamingVPNKaitoTokyoCertificate.certificateArn
		});
	}
}
