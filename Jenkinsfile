pipeline {
    agent any
    environment {
        registry = "146747443241.dkr.ecr.ap-south-1.amazonaws.com/health-check"
    }
   
    stages {
        stage('Cloning Git') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '', url: 'https://github.com/deepsaha288/CICD-CodePipeLine.git']]])     
            }
        }
    }
    // Building Docker images
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build registry
        }
      }
    }
   
    // Uploading Docker images into AWS ECR

    stage('Pushing to ECR') {
     steps{  
         script {
                sh 'aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 146747443241.dkr.ecr.ap-south-1.amazonaws.com'
                sh 'docker push 146747443241.dkr.ecr.ap-south-1.amazonaws.com/health-check:latest'
         }
        }
      }
   
    stage('Deploy to ECS cluster'){ 
     steps {
        script {
            def serviceName = "service-health-check"
            def clusterName = "health-check"
            def taskDefinition = "ALB-health-check"
            def containerName = "health-check"
            def containerPort = 3000
            def image = "146747443241.dkr.ecr.ap-south-1.amazonaws.com/health-check/:${env.BUILD_NUMBER}"
            def awsAccessKeyId = "AWS_ACCESS_KEY_ID"
            def awsSecretAccessKey = "AWS_SECRET_ACCESS_KEY"
            sh "aws ecs update-service --cluster $clusterName --service $serviceName --force-new-deployment" 
            withCredentials([string(credentialsId: "aws-jenkins-credentials", variable: 'awsCredentials')]) {
             sh "aws ecs register-task-definition --cli-input-json '{\"family\":\"$taskDefinition\",\"containerDefinitions\":[{\"name\":\"$containerName\",\"image\":\"$image\",\"portMappings\":[{\"containerPort\":$containerPort}]}]}'"
             sh "aws ecs update-service --cluster $clusterName --service $serviceName --task-definition $taskDefinition" 
             }
          }
        }
    }
}