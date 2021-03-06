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
          sh 'echo Building ${REPO_NAME} on the branch: ${SELECTED_BRANCH} with build id: ${BUILD_ID}' 
        }
      }
    }

    stage('Build') {
      agent any
      steps {
        script {

        sh 'cp /var/node.js/GPP_backend/.env /var/lib/jenkins/workspace/test'
        sh "docker build -t ${REPO_NAME} ."
        sh 'rm -rf .env'

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

        def oldContainers = sh(script: 'docker ps -q -a --filter="name=gpp"', returnStdout: true)
        if (oldContainers){
          sh 'docker ps -q -a --filter="name=gpp" | xargs docker rm -f'
        }

        sh 'docker run -d --network="host" --restart=always --name gpp-${BUILD_NUMBER} ${REPO_NAME}:latest'        

        }
      }
    }
  }
}