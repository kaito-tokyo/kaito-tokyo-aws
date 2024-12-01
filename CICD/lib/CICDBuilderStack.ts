import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_codebuild as codebuild, aws_iam as iam } from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "kaito-tokyo-aws-commonstacks";

export interface CICDBuilderStackProps extends cdk.StackProps {
	readonly importedCodeConnection: ImportedCodeConnectionStack;
}

export class CICDBuilderStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: CICDBuilderStackProps) {
		super(scope, id, props);

		const project = new codebuild.Project(this, "CICDBuilderCodeBuildProject", {
			projectName: "CICDBuilder",
			source: codebuild.Source.gitHub({
				owner: "kaito-tokyo",
				repo: "kaito-tokyo-aws",
				webhook: true,
				webhookFilters: [
					codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs("main")
				]
			}),
			environment: {
				buildImage: codebuild.LinuxArmLambdaBuildImage.AMAZON_LINUX_2023_NODE_20
			},
			buildSpec: codebuild.BuildSpec.fromSourceFilename("CICD/buildspec.yml"),
			concurrentBuildLimit: 1
		});

		project.role!.addManagedPolicy(props.importedCodeConnection.codeConnectionManagedPolicy);
		project.node.addDependency(props.importedCodeConnection.codeConnectionManagedPolicy);

		project.addToRolePolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				resources: ["*"],
				actions: ["sts:AssumeRole"],
				conditions: {
					StringEquals: {
						"iam:ResourceTag/aws-cdk:bootstrap-role": [
							"image-publishing",
							"file-publishing",
							"deploy",
							"lookup"
						]
					}
				}
			})
		);
	}
}
