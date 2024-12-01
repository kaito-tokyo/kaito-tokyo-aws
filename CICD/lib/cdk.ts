import { aws_iam as iam } from "aws-cdk-lib";

export interface CDKDeployTargetEnvironment {
	readonly account: string;
	readonly region: string;
	readonly qualifier?: string;
}

export function createPolicyStatementForCDKDeploy(
	accountId: string,
	region: string,
	qualifier: string = "hnb659fds"
): iam.PolicyStatement {
	return new iam.PolicyStatement({
		effect: iam.Effect.ALLOW,
		resources: [
			`arn:aws:iam::${accountId}:role/cdk-${qualifier}-cfn-exec-role-${accountId}-${region}`,
			`arn:aws:iam::${accountId}:role/cdk-${qualifier}-deploy-role-${accountId}-${region}`,
			`arn:aws:iam::${accountId}:role/cdk-${qualifier}-file-publishing-role-${accountId}-${region}`,
			`arn:aws:iam::${accountId}:role/cdk-${qualifier}-image-publishing-role-${accountId}-${region}`,
			`arn:aws:iam::${accountId}:role/cdk-${qualifier}-lookup-role-${accountId}-${region}`
		],
		actions: ["sts:AssumeRole"]
	});
}
