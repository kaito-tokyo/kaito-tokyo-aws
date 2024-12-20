#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Route53Stack } from "../lib/Route53Stack.js";

import { infrastructureAccountIds } from "kaito-tokyo-aws-commonparameters";

const app = new cdk.App();

new Route53Stack(app, "Route53Stack", {
	env: {
		account: infrastructureAccountIds.route53Prod001,
		region: "us-east-1"
	}
});

app.synth();
