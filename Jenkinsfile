
pipeline {
    agent any

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub'
                checkout scm
            }
        }

        stage('Validate Docker Compose') {
            steps {
                bat 'docker compose -p cyber-awareness-system config --quiet'
            }
        }

        stage('Build Application') {
            steps {
                bat 'docker compose -p cyber-awareness-system build backend frontend'
            }
        }

        stage('Deploy Application') {
            steps {
                bat 'docker compose -p cyber-awareness-system up -d backend frontend'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'docker compose -p cyber-awareness-system ps'
            }
        }
    }

    post {
        success {
            echo 'CI/CD Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check Jenkins console output.'
        }
    }
}
