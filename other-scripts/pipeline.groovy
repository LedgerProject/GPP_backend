pipeline {
  agent none

  environment {
    REPO_NAME="gpp-backend"
    BUILD_DIRECTORY="gpp-backend"
    DEPLOY_PROD_APPROVAL_TIME=48
    SERVICE_PROD_TIMEOUT=600
  }

  stages {
    stage('Preparation') {
      steps { sh 'echo Use Branch: ${SELECTED_BRANCH}' }
    }

    stage('Build') {
      steps {
        dir("${BUILD_DIRECTORY}") {
          script {

            sh "docker build -t ${REPO_NAME} ."

            def REPOSITORY_URL =  "${REPO_NAME}" + ":build-" + "${BUILD_NUMBER}"
            sh "docker tag ${REPO_NAME}:latest ${REPOSITORY_URL}"

          }
        }
      }
    }

    stage ('Approve Production Deploy') {
      steps {
        timeout(time:env.DEPLOY_PROD_APPROVAL_TIME.toInteger(), unit: 'HOURS') { input 'Do you approve PRODUCTION deployment?' }
      }
    }

    stage ('Production Deploy') {
      steps {
        dir("${BUILD_DIRECTORY}") {
          script {

            sh 'docker rm $(docker stop $(docker ps -a -q --filter ancestor=gpp-backend --format="{{.ID}}"))'
            sh 'sudo docker run --network="host" ${REPOSITORY_URL}'

          }
        }
      }
    }
  }
}