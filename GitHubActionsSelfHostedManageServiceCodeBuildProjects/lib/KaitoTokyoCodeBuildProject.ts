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

		this.role!.addManagedPolicy(this.codeConnectionManagedPolicy);
		this.node.addDependency(this.codeConnectionManagedPolicy);
	}
}
