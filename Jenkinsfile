pipeline {
    agent any

    stages {
      stage('Build and test backend locally') {
          steps {
              echo 'Building'
              sh "ls"
              sh """
              # test the services
              python3 --version
              cd peer-tutor-api
              docker-compose -f MaaS-jenkins.yml up --d
              sleep 10
              docker ps -a
              python3 -m virtualenv env
              ls
              . env/bin/activate
              pip install -r requirements.txt
              pytest -q test_api.py --url=http://10.0.0.188:5000  --local=0 -vv -s --cov-config .coveragerc --cov=. --cov-report=html
              """
          }
      }
        stage('Build and test backend in container') {
            steps {
                echo 'Building'
                sh "ls"
                sh """

                docker -v && docker-compose -v
                cd peer-tutor-api
                cd ..
                sleep 10

                docker build -t peer-tutor-api-test -f Dockerfile-dev .
                docker run -d --network="web_dev" -p 5000:5000 peer-tutor-api-test:latest

                sleep 10
                docker ps -a
                # test the services
                python3 --version
                cd peer-tutor-api
                python3 -m virtualenv env
                ls
                . env/bin/activate
                pip install -r requirements.txt
                pytest -q test_api.py --url=http://10.0.0.188:5000 --local=1 -vv -s --junitxml=./junitResult.xml

                """
            }
        }
        stage('Build and test front end') {
            steps {
                echo 'Testing'
                // sh """
                // docker build -t peer-tutor-ui -f Dockerfile-ui .
                // """
                sh """
                cd peer-tutor-ui
                cd angular
                npm install
                npm rebuild node-sass
                ng test --browsers headlessChrome --watch=false
                ng e2e --prod
                """


            }
        }
        stage('Deploy') {
            steps {
                echo 'Test Deployment'
                script {
                  if(GIT_BRANCH == 'stg'){
                    echo 'Test building deployment package'
                    sh """
                    result=\$( docker ps -a -q )

                    if [ -n "\$result" ]; then
                      docker stop \$(docker ps -a -q)
                       docker rm \$(docker ps -a -q)
                    else
                      echo "No containers left"
                    fi
                   """

                    sh"""
                    docker-compose -f compose-peer-tutor-prd-pkg.yml  up --d --build
                    sleep 10
                    curl http://10.0.0.188:8083/login
                    docker-compose -f compose-peer-tutor-prd-pkg.yml  down
                    """

                  }
                  else{
                    echo 'Not Testing in dev'
                  }
                }
            }
        }
    }
    post {
        always {
          //cleanup all containers
          sh """
            result=\$( docker ps -a -q )

            if [ -n "\$result" ]; then
              docker stop \$(docker ps -a -q)
               docker rm \$(docker ps -a -q)
            else
              echo "No containers left"
            fi
           """
           sh """
           docker volume prune -f
         """
            archive "peer-tutor-api/htmlcov/*"
            archive "peer-tutor-api/*.xml"
            junit 'peer-tutor-api/*.xml'
            archive "peer-tutor-ui/angular/src/reports/*.xml"
            junit 'peer-tutor-ui/angular/src/reports/*.xml'
            archive "peer-tutor-ui/angular/e2e-test-results/*"
            junit 'peer-tutor-ui/angular/e2e-test-results/*.xml'
            publishHTML target: [
            allowMissing: false,
            alwaysLinkToLastBuild: false,
            keepAll: true,
            reportDir: 'peer-tutor-api/htmlcov/',
            reportFiles: 'index.html',
            reportName: 'Code Coverage Report'
          ]
          publishHTML target: [
          allowMissing: false,
          alwaysLinkToLastBuild: false,
          keepAll: true,
          reportDir: 'peer-tutor-ui/angular/e2e-test-results/e2e-html-result',
          reportFiles: 'index.html',
          reportName: 'UI BB E2E Report'
        ]

        }
        success {
            script {
            echo 'This build was successful.'
            if(GIT_BRANCH == 'dev'){
            if(GIT_PREVIOUS_SUCCESSFUL_COMMIT == GIT_PREVIOUS_COMMIT){
            echo 'Promoting to staging'
            withCredentials([usernamePassword(credentialsId: 'github-cred', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
            sh"""
            rm -rf git-push-stg
            mkdir git-push-stg
            cd git-push-stg
            git config --global user.email \"bharath.baiju@sjsu.edu\"
            git config --global user.name \"jenkins-bot\"
            git clone https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/bharathkkb/peer-tutor.git
            cd peer-tutor
            git checkout stg
            git branch
            git pull --commit --rebase origin dev

            git push origin stg

            """
            }
            }
            else{
                echo 'Not eligible for promoting to staging'
            }
          }
        }
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
