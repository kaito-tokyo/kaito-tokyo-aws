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

		const kaitoTokyoAwsSource = createCodeBuildSource("kaito-tokyo", "kaito-tokyo-aws");
		const obsChatTalkerSource = createCodeBuildSource("kaito-tokyo", "obs-chattalker");

		new MyCodeBuildProject(this, "InfrastructureManagerProd001Project", {
			projectName: "InfrastructureManagerProd001",
			source: kaitoTokyoAwsSource,
			importCodeConnection: this.importedCodeConnection
		});

		new MyCodeBuildProject(this, "ObsChatTalkerInfraDeployerDev001Project", {
			projectName: "ObsChatTalkerInfraDeployerDev001",
			source: obsChatTalkerSource,
			importCodeConnection: this.importedCodeConnection
		});
	}
}
