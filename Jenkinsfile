pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building'
                sh "ls"
                sh """

                docker -v && docker-compose -v
                 #stop docker containers
                docker stop \$(docker ps -a -q)
                # remove
                docker rm \$(docker ps -a -q)

                docker build -t peer-tutor-api -f Dockerfile-dev .
                docker run -d -p 5000:5000 peer-tutor-api:latest
                
                sleep 10

                # test the services
                python3 --version
                cd peer-tutor-api
                python3 -m virtualenv env
                ls
                . env/bin/activate
                pip install -r requirements.txt
                pytest -q test_api.py --url=http://10.0.0.188:5000 --junitxml=./junitResult.xml

                #stop docker containers
                docker stop \$(docker ps -a -q)
                # remove
                docker rm \$(docker ps -a -q)
                """
            }
        }
        stage('Test') {
            steps {
                echo 'Testing'

            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying'
            }
        }
    }
    post {
        always {

            archive "peer-tutor-api/*.xml"
            junit 'peer-tutor-api/*.xml'
        }
        success {
            echo 'This will run only if successful'
        }
        failure {
            echo 'This will run only if failed'
        }
        unstable {
            echo 'This will run only if the run was marked as unstable'
        }
        changed {
            echo 'This will run only if the state of the Pipeline has changed'
            echo 'For example, if the Pipeline was previously failing but is now successful'
        }
    }
}
