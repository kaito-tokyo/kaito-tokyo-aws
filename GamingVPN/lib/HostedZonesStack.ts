import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_iam as iam, aws_route53 as route53 } from "aws-cdk-lib";

interface HostedZonesStackProps extends cdk.StackProps {
	readonly zoneName: string;
	readonly deletationRoleArn: string;
	readonly parentHostedZoneName: string;
}

export class HostedZonesStack extends cdk.Stack {
	readonly apiZone: route53.PublicHostedZone;

	constructor(scope: Construct, id: string, props: HostedZonesStackProps) {
		super(scope, id, {
			...props,
			description: "Manage hosted zones for Gaming VPN"
		});

		this.apiZone = new route53.PublicHostedZone(this, "GamingVPNZone", {
			zoneName: props.zoneName
		});

		const delegationRole = iam.Role.fromRoleArn(
			this,
			"GamingVPNZoneDelegationRole",
			props.deletationRoleArn
		);

		new route53.CrossAccountZoneDelegationRecord(this, "GamingVPNZoneDelegate", {
			delegatedZone: this.apiZone,
			parentHostedZoneName: props.parentHostedZoneName,
			delegationRole
		});
	}
}
