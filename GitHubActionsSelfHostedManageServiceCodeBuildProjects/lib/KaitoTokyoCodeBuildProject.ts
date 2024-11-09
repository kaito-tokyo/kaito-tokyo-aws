import { Construct } from "constructs";

import { aws_codebuild as codebuild, aws_iam as iam } from "aws-cdk-lib";

interface KaitoTokyoCodeBuildProjectProps extends codebuild.ProjectProps {
	readonly codeConnectionManagedPolicy: iam.ManagedPolicy;
}

export class KaitoTokyoCodeBuildProject extends codebuild.Project {
	readonly codeConnectionManagedPolicy: iam.ManagedPolicy;

	constructor(scope: Construct, id: string, props: KaitoTokyoCodeBuildProjectProps) {
		super(scope, id, props);

		this.codeConnectionManagedPolicy = props.codeConnectionManagedPolicy;

		const { role } = this;
		if (!role) {
			throw new Error("Role is not defined");
		}
		role.addManagedPolicy(this.codeConnectionManagedPolicy);

		this.addToRolePolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				resources: ["arn:aws:iam::*:role/cdk-*"],
				actions: ["iam:AssumeRole"]
			})
		);

		this.node.addDependency(this.codeConnectionManagedPolicy);
	}
}
