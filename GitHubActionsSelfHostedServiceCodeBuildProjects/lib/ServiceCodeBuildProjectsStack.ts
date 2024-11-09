import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { aws_iam as iam } from "aws-cdk-lib";

import { MyCodeBuildProject, createCodeBuildSource } from "./MyCodeBuildProject.js";
import { ImportedCodeConnectionStack } from "./ImportedCodeConnectionStack.js";

interface ServiceCodeBuildProjectsStackProps extends cdk.StackProps {
	readonly importedCodeConnection: ImportedCodeConnectionStack;
}

export class ServiceCodeBuildProjectsStack extends cdk.Stack {
	readonly importedCodeConnection: ImportedCodeConnectionStack;

	constructor(scope: Construct, id: string, props: ServiceCodeBuildProjectsStackProps) {
		super(scope, id, props);

		this.importedCodeConnection = props.importedCodeConnection;

		const obsChatTalkerSource = createCodeBuildSource("kaito-tokyo", "obs-chattalker");

		const obsChatTalkerDeployInfraDev001CodeBuildProject = new MyCodeBuildProject(
			this,
			"ObsChatTalkerDeployInfraDev001CodeBuildProject",
			{
				projectName: "ObsChatTalkerDeployInfraDev001",
				source: obsChatTalkerSource,
				importCodeConnection: this.importedCodeConnection
			}
		);
		obsChatTalkerDeployInfraDev001CodeBuildProject.addToRolePolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				resources: [
					this.formatArn({
						account: "586794439382",
						service: "iam",
						resource: "role/GitHubActionsSelfHosted/*"
					})
				],
				actions: ["sts:AssumeRole"]
			})
		);

		new cdk.CfnOutput(this, "ObsChatTalkerDeployInfraDev001CodeBuildProjectRoleArn", {
			value: obsChatTalkerDeployInfraDev001CodeBuildProject.role!.roleArn,
			exportName: "ObsChatTalkerDeployInfraDev001CodeBuildProjectRoleArn"
		});
	}
}
