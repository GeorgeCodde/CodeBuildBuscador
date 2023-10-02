import * as cdk from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as config from '../config.json'
import { BuildSpec, LinuxBuildImage, Project, Source } from 'aws-cdk-lib/aws-codebuild';
import { Repository } from 'aws-cdk-lib/aws-ecr';
export class CodeBuildBuscadorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const imageRepo = new Repository(this, "imageRepo",{
      repositoryName: config.environments.test.ecrName
    });

    //Create a S3 bucket
    const sourceBucket = new Bucket(this, 'Sourcebucket', {
      bucketName: config.environments.test.bucketName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    const buildImage = new Project(this, "BuildImage", {
      //buildSpec: BuildSpec.fromSourceFilename("buildspec.yaml"),
      source: Source.s3({
        bucket: sourceBucket,
        path: 'buscador.zip',
      }),
      environment: {
        privileged: true,
        buildImage: LinuxBuildImage.AMAZON_LINUX_2,  
        environmentVariables: {
          AWS_ACCOUNT_ID: { value: config.environments.test.env.account },
          REGION: { value:  config.environments.test.env.region},
          IMAGE_TAG: { value: config.environments.test.imageTag },
          IMAGE_REPO_NAME: { value: config.environments.test.ecrName },
        },
      },
    });

    imageRepo.grantPullPush(buildImage);

  }
}
