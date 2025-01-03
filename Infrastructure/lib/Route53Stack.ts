import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_iam as iam, aws_route53 as route53 } from "aws-cdk-lib";

import { workloadsAccountIds } from "kaito-tokyo-aws-commonparameters";

export class Route53Stack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const obsChatTalkerZone = new route53.PublicHostedZone(this, "KaitoTokyoObsChatTalkerZone", {
			zoneName: "obs-chattalker.kaito.tokyo"
		});

		const apidevObsChatTalkerZoneDelegationRole = new iam.Role(
			this,
			"ApidevObsChatTalkerZoneDelegationRole",
			{
				path: "/route53-delegation/",
				roleName: `apidev-${workloadsAccountIds.obsChatTalkerDev001}`,
				assumedBy: new iam.AccountPrincipal(workloadsAccountIds.obsChatTalkerDev001),
				inlinePolicies: {
					crossAccountPolicy: new iam.PolicyDocument({
						statements: [
							new iam.PolicyStatement({
								effect: iam.Effect.ALLOW,
								resources: ["*"],
								actions: ["route53:ListHostedZonesByName"]
							}),
							new iam.PolicyStatement({
								effect: iam.Effect.ALLOW,
								resources: [obsChatTalkerZone.hostedZoneArn],
								actions: ["route53:GetHostedZone", "route53:ChangeResourceRecordSets"],
								conditions: {
									"ForAllValues:StringLike": {
										"route53:ChangeResourceRecordSetsNormalizedRecordNames": [
											"apidev.obs-chattalker.kaito.tokyo"
										]
									}
								}
							})
						]
					})
				}
			}
		);
		obsChatTalkerZone.grantDelegation(apidevObsChatTalkerZoneDelegationRole);

		const kaitoTokyoClickZone = route53.HostedZone.fromHostedZoneAttributes(
			this,
			"KaitoTokyoClickZone",
			{
				zoneName: "click.kaito.tokyo",
				hostedZoneId: "Z02227982TKVA5OZ2METT"
			}
		);

		const gamingVPNKaitoTokyoClickZoneDelegationRole = new iam.Role(
			this,
			"GamingVPNKaitoTokyoClickZoneDelegationRole",
			{
				path: "/route53-delegation/",
				roleName: `gamingvpn-${workloadsAccountIds.gamingVPNProd001}`,
				assumedBy: new iam.AccountPrincipal(workloadsAccountIds.gamingVPNProd001),
				inlinePolicies: {
					crossAccountPolicy: new iam.PolicyDocument({
						statements: [
							new iam.PolicyStatement({
								effect: iam.Effect.ALLOW,
								resources: ["*"],
								actions: ["route53:ListHostedZonesByName"]
							}),
							new iam.PolicyStatement({
								effect: iam.Effect.ALLOW,
								resources: [obsChatTalkerZone.hostedZoneArn],
								actions: ["route53:GetHostedZone", "route53:ChangeResourceRecordSets"],
								conditions: {
									"ForAllValues:StringLike": {
										"route53:ChangeResourceRecordSetsNormalizedRecordNames": [
											"gamingvpn.kaito-tokyo.click"
										]
									}
								}
							})
						]
					})
				}
			}
		);
		kaitoTokyoClickZone.grantDelegation(gamingVPNKaitoTokyoClickZoneDelegationRole);
	}
}
