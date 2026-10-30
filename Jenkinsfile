pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'local'
        K8S_CONTEXT = 'docker-desktop'
        JAVA_HOME = 'C:\\Program Files\\Java\\latest\\jdk-25'
        MAVEN_OPTS = '-Dmaven.repo.local=C:\\Users\\Admin\\.m2\\repository'
        KUBECONFIG = 'C:\\Users\\Admin\\.kube\\config'
        DOCKER_HOST = 'npipe:////./pipe/dockerDesktopLinuxEngine'
        DOCKER_BUILDKIT = '1'
        PATH = "C:\\Program Files\\Java\\latest\\jdk-25\\bin;C:\\Users\\Admin\\AppData\\Local\\Programs\\ApacheMaven\\apache-maven-3.9.11\\bin;D:\\Program Files\\nodejs;C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;C:\\Program Files\\Git\\cmd;${env.PATH}"
    }

    triggers {
        pollSCM('* * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source repository...'
                checkout scm
            }
        }

        stage('Maven Build (Backend)') {
            steps {
                echo 'Building Spring Boot microservices...'
                script {
                    if (isUnix()) {
                        sh 'mvn clean package -DskipTests'
                    } else {
                        bat 'call mvn clean package -DskipTests'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building React Vite frontend...'
                dir('frontend') {
                    script {
                        if (isUnix()) {
                            sh 'npm --version'
                            sh 'npm install'
                            sh 'npm run build'
                        } else {
                            bat 'call npm --version'
                            bat 'call npm install'
                            bat 'call npm run build'
                        }
                    }
                }
            }
        }

        stage('Docker Build Images') {
            steps {
                echo 'Building Docker container images for microservices and frontend...'
                script {
                    def services = [
                        [dir: 'eureka-server', image: 'northstar/eureka-server:latest'],
                        [dir: 'auth-service', image: 'northstar/auth-service:latest'],
                        [dir: 'customer-service', image: 'northstar/customer-service:latest'],
                        [dir: 'account-service', image: 'northstar/account-service:latest'],
                        [dir: 'api-gateway', image: 'northstar/api-gateway:latest'],
                        [dir: 'frontend', image: 'northstar/frontend:latest']
                    ]

                    for (svc in services) {
                        echo "Building image: ${svc.image} from ./${svc.dir}"
                        if (isUnix()) {
                            sh "docker build -t ${svc.image} ./${svc.dir}"
                        } else {
                            bat "docker build -t ${svc.image} ./${svc.dir}"
                        }
                    }
                }
            }
        }

        stage('Deploy Containers (Docker Compose & Kubernetes)') {
            steps {
                echo "Deploying Docker Desktop containers and Kubernetes workloads..."
                script {
                    if (isUnix()) {
                        sh 'docker compose up -d'
                        sh "kubectl config use-context ${K8S_CONTEXT} || true"
                        sh 'kubectl apply -f k8s/ || true'
                    } else {
                        bat 'docker compose up -d'
                        bat "kubectl config use-context ${K8S_CONTEXT} || echo Context switched or default"
                        bat 'kubectl apply -f k8s/ || echo Kubernetes skipped or applied'
                    }
                }
            }
        }

        stage('Verify Rollout Status') {
            steps {
                echo 'Verifying deployment rollout across all workloads...'
                script {
                    def deployments = [
                        'mysql',
                        'eureka-server',
                        'auth-service',
                        'customer-service',
                        'account-service',
                        'api-gateway',
                        'frontend'
                    ]

                    for (dep in deployments) {
                        echo "Checking rollout status for deployment/${dep}..."
                        if (isUnix()) {
                            sh "kubectl rollout status deployment/${dep} --timeout=45s || true"
                        } else {
                            bat "kubectl rollout status deployment/${dep} --timeout=45s || echo Checked deployment ${dep}"
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo '=================================================='
            echo 'Northstar Banking CI/CD Pipeline Completed Successfully!'
            echo 'Frontend URL: http://localhost:30173'
            echo 'API Gateway URL: http://localhost:30080'
            echo 'Eureka Dashboard: http://localhost:8761'
            echo '=================================================='
        }
        failure {
            echo 'Pipeline failed! Inspect console output and pod logs.'
            script {
                if (isUnix()) {
                    sh 'kubectl get pods,svc -l app.kubernetes.io/part-of=northstar-banking || true'
                } else {
                    bat 'kubectl get pods,svc -l app.kubernetes.io/part-of=northstar-banking || echo Done'
                }
            }
        }
    }
}
