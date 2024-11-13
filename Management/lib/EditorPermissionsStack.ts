import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { ImportedControlTowerIdentitiesStack } from "./ImportedControlTowerIdentitiesStack.js";

import type { User } from "@aws-sdk/client-identitystore";

interface EditorPermissionsStackProps extends cdk.StackProps {
	readonly importedControlTowerIdentities: ImportedControlTowerIdentitiesStack;
	readonly users: User[];
}

export class EditorPermissionsStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: EditorPermissionsStackProps) {
		super(scope, id, props);
	}
}
