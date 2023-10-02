#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CodeBuildBuscadorStack } from '../lib/code_build_buscador-stack';
import *  as config from '../config.json'

const app = new cdk.App();
new CodeBuildBuscadorStack(app, 'CodeBuildBuscadorStack', {
  env: config.environments.test.env
});