import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_route53 as route53 } from "aws-cdk-lib";

export class Route53Stack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		new route53.PublicHostedZone(this, "KaitoTokyoObsChatTalkerZone", {
			zoneName: "obs-chattalker.kaito.tokyo"
		});
	}
}
