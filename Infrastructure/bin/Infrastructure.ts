#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Route53Stack } from "../lib/Route53Stack.js";

import { Route53Prod001 } from "account_ids";

const app = new cdk.App();

new Route53Stack(app, "InfrastructureRoute53Stack", {
	env: {
		account: Route53Prod001,
		region: "us-east-1"
	}
});

app.synth();
