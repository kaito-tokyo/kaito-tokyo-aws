import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_codebuild as codebuild, aws_iam as iam } from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "kaito-tokyo-aws-commonstacks/ImportedCodeConnectionStack.js";
import { CDKDeployTargetEnvironment, createPolicyStatementForCDKDeploy } from "./cdk.js";

export interface ObsChatTalkerBuilderStackProps extends cdk.StackProps {
	readonly importedCodeConnection: ImportedCodeConnectionStack;
	readonly cdkDeployTargetEnrionments: CDKDeployTargetEnvironment[];
}

export class ObsChatTalkerBuilderStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: ObsChatTalkerBuilderStackProps) {
		super(scope, id, { ...props, description: "Manage the CodeBuild project for obs-chattalker" });

		const role = new iam.Role(this, "ObsChatTalkerBuilderCodeBuildRole", {
			assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
			roleName: "ObsChatTalkerBuilderCodeBuildRole",
			path: "/Builders/"
		});
		role.addManagedPolicy(props.importedCodeConnection.codeConnectionManagedPolicy);

		const project = new codebuild.Project(this, "ObsChatTalkerBuilderCodeBuildProject", {
			projectName: "ObsChatTalkerBuilder",
			source: codebuild.Source.gitHub({
				owner: "kaito-tokyo",
				repo: "obs-chattalker",
				webhook: true,
				webhookFilters: [
					codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs("main")
				]
			}),
			environment: {
				buildImage: codebuild.LinuxArmLambdaBuildImage.AMAZON_LINUX_2023_NODE_20
			},
			buildSpec: codebuild.BuildSpec.fromSourceFilename("buildspec.yml"),
			concurrentBuildLimit: 1,
			role
		});
		project.node.addDependency(props.importedCodeConnection.codeConnectionManagedPolicy);

		for (const { account, region, qualifier } of props.cdkDeployTargetEnrionments) {
			role.addToPolicy(createPolicyStatementForCDKDeploy(account, region, qualifier));
		}
	}
}
