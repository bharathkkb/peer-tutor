pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building'
                sh "ls"
                sh """
                # optional: record current versions of docker apps with each build
                docker -v && docker-compose -v && docker-machine -v

                # set-up: clean up any previous machine failures
                docker-machine stop test || echo "nothing to stop" && \
                docker-machine rm -f test   || echo "nothing to remove"

                # use docker-machine to create and configure 'test' environment
                # add a -D (debug) if having issues
                docker-machine create --driver virtualbox test
                eval "\$(docker-machine env test)"

                # use docker-compose to pull and build new images and containers
                docker-compose -p jenkins up -d

                # optional: list machines, images, and containers
                docker-machine ls && docker images && docker ps -a

                # wait for containers to fully start before tests fire up
                sleep 30

                # test the services
                python3 --version
                cd peer-tutor-api
                python3 -m virtualenv env
                ls
                . env/bin/activate
                pip install -r requirements.txt
                pytest -q test_api.py --url=http://\$(docker-machine ip test):5000

                curl http://\$(docker-machine ip test):5000/test/api/hello
                # tear down: stop and remove 'test' environment
                docker-machine stop test && docker-machine rm test
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
            echo 'This will always run'
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
