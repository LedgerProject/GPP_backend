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

        def oldContainer = sh(script: 'docker ps -q --filter="name=gpp"', returnStdout: true)

        sh 'docker run -d --network="host" --name gpp-${BUILD_NUMBER} ${REPO_NAME}:latest'
        if (oldContainer){
          sh 'docker rm -f ' + oldContainer
        }
        

        }
      }
    }
  }
}