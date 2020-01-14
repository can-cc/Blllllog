pipeline {
    agent {
        docker {
            image 'node:12.14.0-stretch'
        }
    }
    triggers {
        pollSCM('*/1 * * * *')
    }
    environment {
        DOCKER_REGISTER = credentials('jenkins-blog-docker-register')
    }
    stages {
        stage('Npm install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Theme install') {
            steps {
                sh 'cd node_modules/@starfishx/theme-hg && npm install'
            }
        }
        stage('Build') {
            steps {
                sh './node_modules/.bin/starfish render . --output="blog-dist"'
            }
        }
        stage('Build ssr') {
            steps {
                sh './node_modules/.bin/starfish angular-ssr .'
            }
        }
        stage('Dockerize') {
            agent none
            steps {
                script {
                    dockerImage = docker.build "$DOCKER_REGISTER/fangwei-blog:v0.0.$BUILD_NUMBER"
                }
            }
        }
        stage('Publish image') {
            agent none
            steps {
                script {
                    docker.withRegistry($DOCKER_REGISTER) {
                        dockerImage.push()
                    }
                }
            }
        }
    }
    post {
        always {
            rocketSend currentBuild.currentResult
        }
    }
}