import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { ImportedCodeConnectionStack } from "./ImportedCodeConnectionStack.js";

interface MainStackProps extends cdk.StackProps {
	readonly importedCodeConnection: ImportedCodeConnectionStack;
}

export class MainStack extends cdk.Stack {
	readonly importedCodeConnection: ImportedCodeConnectionStack;

	constructor(scope: Construct, id: string, props: MainStackProps) {
		super(scope, id, props);

		this.importedCodeConnection = props.importedCodeConnection;
	}
}
