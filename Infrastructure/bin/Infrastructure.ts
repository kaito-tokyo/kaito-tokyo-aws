#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Route53Stack } from "../lib/Route53Stack.js";

const app = new cdk.App();

new Route53Stack(app, "InfrastructureRoute53Stack", {
	env: {
		account: "913524900670",
		region: "us-east-1"
	}
});

app.synth();
