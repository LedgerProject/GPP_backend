pipeline {
  agent none

  environment {
    REPO_NAME="gpp-backend"
    DEPLOY_PROD_APPROVAL_TIME=48
    SERVICE_PROD_TIMEOUT=600
  }

  stages {
    stage('Preparation') {
      agent any
      steps { 
        script {
          def buildName = Jenkins.instance.getItem('test').lastSuccessfulBuild.number
          sh 'echo Use Branch: ${SELECTED_BRANCH} with ${BUILD_ID} and ${buildName}' 
        }
      }
    }

    stage('Build') {
      agent any
      steps {
        script {

        sh "docker build -t ${REPO_NAME} ."

        }
      }
    }

    stage ('Approve Production Deploy') {
      agent any
      steps {
        timeout(time:env.DEPLOY_PROD_APPROVAL_TIME.toInteger(), unit: 'HOURS') { input 'Do you approve PRODUCTION deployment?' }
      }
    }

    stage ('Production Deploy') {
      agent any
      steps {
        script {

        sh 'CID=$(docker ps -a -q --filter="name=gpp");'

        sh 'docker run -d --network="host" --name gpp-${BUILD_NUMBER} ${REPO_NAME}:latest'
        
        //eliminates old docker running image
        sh 'docker rm -f $CID'

        }
      }
    }
  }
}
