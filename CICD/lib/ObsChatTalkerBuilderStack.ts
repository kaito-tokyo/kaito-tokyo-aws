import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_codebuild as codebuild } from "aws-cdk-lib";

import { ImportedCodeConnectionStack } from "kaito-tokyo-aws-commonstacks/ImportedCodeConnectionStack.js";

export interface ObsChatTalkerBuilderStackProps extends cdk.StackProps {
	readonly importedCodeConnection: ImportedCodeConnectionStack;
}

export class ObsChatTalkerBuilderStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: ObsChatTalkerBuilderStackProps) {
		super(scope, id, props);

		const project = new codebuild.Project(this, "ObsChatTalkerBuilderCodeBuildProject", {
			projectName: "GitHubActionsSelfHostedBuilder",
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
			concurrentBuildLimit: 1
		});

		project.role!.addManagedPolicy(props.importedCodeConnection.codeConnectionManagedPolicy);
		project.node.addDependency(props.importedCodeConnection.codeConnectionManagedPolicy);
	}
}
