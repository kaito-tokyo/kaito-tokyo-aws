#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { VPNStack } from "../lib/VPNStack.js";

import { workloadsAccountIds } from "kaito-tokyo-aws-commonparameters";

const app = new cdk.App();

new VPNStack(app, "VPNStack", {
	env: {
		account: workloadsAccountIds.gamingVPNProd001,
		region: "us-east-1"
	}
});

app.synth();
