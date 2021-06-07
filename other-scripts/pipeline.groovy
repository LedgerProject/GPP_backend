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
        sh 'echo Use Branch: ${SELECTED_BRANCH} with ${BUILD_ID}' 
      }
    }

    stage('Build') {
      agent any
      steps {
        script {

        sh "docker build -t ${REPO_NAME} ."

        //def REPOSITORY_URL =  "${REPO_NAME}" + ":build-" + "${BUILD_NUMBER}"
        //sh "docker tag ${REPO_NAME}:latest ${REPOSITORY_URL}"

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

        sh 'docker ps -q --filter ancestor="${REPO_NAME}:latest" | xargs -r docker stop'
        sh 'docker run -d --network="host" ${REPO_NAME}:latest'

        }
      }
    }
  }
}
