#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { MainStack } from "../lib/MainStack.js";

const prod001 = {
	account: "147997151289",
	region: "us-east-1"
};

const app = new cdk.App();
new MainStack(app, "GitHubActionsSelfHostedManageServiceCodeBuildProjectsStack", {
	env: prod001
});
