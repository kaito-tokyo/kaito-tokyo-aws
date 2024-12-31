import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_certificatemanager as acm } from "aws-cdk-lib";

import { HostedZonesStack } from "./HostedZonesStack.js";

interface CertificatesStackProps extends cdk.StackProps {
	readonly hostedZones: HostedZonesStack;
	readonly ovpnGamingVPNKaitoTokyoDomainName: string;
}

export class CertificatesStack extends cdk.Stack {
	readonly ovpnGamingVPNKaitoTokyoCertificate: acm.Certificate;

	constructor(scope: Construct, id: string, props: CertificatesStackProps) {
		super(scope, id, props);

		this.ovpnGamingVPNKaitoTokyoCertificate = new acm.Certificate(this, "OvpnGamingVPNKaitoTokyoClickCertificate", {
			domainName: props.ovpnGamingVPNKaitoTokyoDomainName,
			validation: acm.CertificateValidation.fromDns(props.hostedZones.apiZone)
		});
	}
}
