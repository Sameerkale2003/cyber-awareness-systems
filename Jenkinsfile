
pipeline {
    agent any

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub'
                checkout scm
            }
        }

        stage('Validate Docker Compose') {
            steps {
                bat 'docker compose config --quiet'
            }
        }

        stage('Build Application') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Deploy Application') {
            steps {
                bat 'docker compose up -d'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'docker compose ps'
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
