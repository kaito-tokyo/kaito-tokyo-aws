#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { VPNStack } from "../lib/VPNStack.js";

import { workloadsAccountIds } from "kaito-tokyo-aws-commonparameters";
import { CertificatesStack } from "../lib/CertificatesStack.js";
import { HostedZonesStack } from "../lib/HostedZonesStack.js";

const app = new cdk.App();

const hostedZones = new HostedZonesStack(app, "HostedZonesStack", {
	env: {
		account: workloadsAccountIds.gamingVPNProd001,
		region: "us-east-1"
	},
	zoneName: "gamingvpn.kaito-tokyo.click",
	deletationRoleArn: "arn:aws:iam::913524900670:role/route53-delegation/gamingvpn-872515250936",
	parentHostedZoneName: "kaito-tokyo.click"
});
s
const certificates = new CertificatesStack(app, "CertificatesStack", {
	env: {
		account: workloadsAccountIds.gamingVPNProd001,
		region: "us-east-1"
	},
	hostedZones,
	ovpnGamingVPNKaitoTokyoDomainName: "ovpn.gamingvpn.kaito-tokyo.click"
});

new VPNStack(app, "VPNStack", {
	env: {
		account: workloadsAccountIds.gamingVPNProd001,
		region: "us-east-1"
	}
});

app.synth();
