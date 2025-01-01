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
	readonly umireonOvpnGamingVPNKaitoTokyoCertificate: acm.ICertificate;

	constructor(scope: Construct, id: string, props: CertificatesStackProps) {
		super(scope, id, props);

		this.ovpnGamingVPNKaitoTokyoCertificate = new acm.Certificate(
			this,
			"OvpnGamingVPNKaitoTokyoClickCertificate",
			{
				domainName: props.ovpnGamingVPNKaitoTokyoDomainName,
				validation: acm.CertificateValidation.fromDns(props.hostedZones.apiZone)
			}
		);

		this.umireonOvpnGamingVPNKaitoTokyoCertificate = acm.Certificate.fromCertificateArn(
			this,
			"UmireonOvpnGamingVPNKaitoTokyoClickCertificate",
			"arn:aws:acm:us-east-1:872515250936:certificate/559de3ee-ddc1-4921-9f13-04215931c261"
		);
	}
}
